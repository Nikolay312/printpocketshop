export const runtime = "nodejs";

import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Currency } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth.server";
import { enforceIpRateLimit } from "@/lib/rateLimit";
import { auditLog } from "@/lib/audit.server";
import * as Sentry from "@sentry/nextjs";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

const stripe = new Stripe(stripeSecret);

type CartItemLike = {
  productId: string;
  quantity: number;
  license: string;
  product: {
    price: number;
    currency: Currency;
    status: "DRAFT" | "PUBLISHED";
    title: string;
    description: string | null;
  };
};

function getCartSubtotal<T extends CartItemLike>(items: T[]) {
  return items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);
}

function getCartCurrency<T extends CartItemLike>(items: T[]) {
  if (items.length === 0) return null;

  const first = items[0].product.currency;
  const hasMixedCurrencies = items.some((item) => item.product.currency !== first);

  if (hasMixedCurrencies) {
    throw new Error("Cart contains mixed currencies.");
  }

  return first;
}

function getDiscountAmount(params: {
  subtotal: number;
  discountType: string;
  percentOff: number | null;
  amountOff: number | null;
}) {
  const { subtotal, discountType, percentOff, amountOff } = params;

  if (subtotal <= 0) return 0;

  if (discountType === "PERCENT") {
    if (!percentOff || percentOff <= 0) return 0;
    return Math.min(subtotal, Math.floor((subtotal * percentOff) / 100));
  }

  if (!amountOff || amountOff <= 0) return 0;
  return Math.min(subtotal, amountOff);
}

function normalizeAppUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

/**
 * Stripe Checkout does not accept negative line items.
 * To preserve the correct total, distribute the discount across product unit prices.
 *
 * Example:
 * - product A: 1000 x 2
 * - product B: 500 x 1
 * - discount: 300
 *
 * We flatten to unit rows, distribute cents proportionally, then regroup.
 */
function buildDiscountedLineItems<T extends CartItemLike>(params: {
  items: T[];
  currency: Currency;
  discountAmount: number;
}): Stripe.Checkout.SessionCreateParams.LineItem[] {
  const { items, currency, discountAmount } = params;

  const flatUnits: Array<{
    key: string;
    productId: string;
    license: string;
    title: string;
    description: string | null;
    originalUnitAmount: number;
    adjustedUnitAmount: number;
  }> = [];

  for (const item of items) {
    for (let i = 0; i < item.quantity; i += 1) {
      flatUnits.push({
        key: `${item.productId}:${item.license}:${item.product.title}:${item.product.description ?? ""}:${item.product.price}`,
        productId: item.productId,
        license: item.license,
        title: item.product.title,
        description: item.product.description ?? null,
        originalUnitAmount: item.product.price,
        adjustedUnitAmount: item.product.price,
      });
    }
  }

  if (flatUnits.length === 0) {
    throw new Error("Cannot build Stripe line items for an empty cart.");
  }

  if (discountAmount <= 0) {
    return regroupFlatUnitsToLineItems(flatUnits, currency);
  }

  const subtotal = flatUnits.reduce((sum, unit) => sum + unit.originalUnitAmount, 0);
  if (subtotal <= 0) {
    throw new Error("Invalid cart subtotal.");
  }

  const remainingDiscount = Math.min(discountAmount, subtotal);

  const proportionalDiscounts = flatUnits.map((unit) => {
    const rawShare = (unit.originalUnitAmount / subtotal) * remainingDiscount;
    const floorShare = Math.floor(rawShare);

    return {
      floorShare,
      remainder: rawShare - floorShare,
    };
  });

  let distributed = 0;
  for (let i = 0; i < flatUnits.length; i += 1) {
    const amount = Math.min(
      proportionalDiscounts[i].floorShare,
      flatUnits[i].adjustedUnitAmount
    );
    flatUnits[i].adjustedUnitAmount -= amount;
    distributed += amount;
  }

  let leftover = remainingDiscount - distributed;

  const remainderOrder = proportionalDiscounts
    .map((value, index) => ({ index, remainder: value.remainder }))
    .sort((a, b) => b.remainder - a.remainder);

  for (const entry of remainderOrder) {
    if (leftover <= 0) break;
    if (flatUnits[entry.index].adjustedUnitAmount <= 0) continue;

    flatUnits[entry.index].adjustedUnitAmount -= 1;
    leftover -= 1;
  }

  if (leftover > 0) {
    for (const unit of flatUnits) {
      if (leftover <= 0) break;
      const removable = Math.min(unit.adjustedUnitAmount, leftover);
      unit.adjustedUnitAmount -= removable;
      leftover -= removable;
    }
  }

  if (leftover !== 0) {
    throw new Error("Failed to distribute discount across cart items.");
  }

  return regroupFlatUnitsToLineItems(flatUnits, currency);
}

function regroupFlatUnitsToLineItems(
  flatUnits: Array<{
    key: string;
    title: string;
    description: string | null;
    adjustedUnitAmount: number;
  }>,
  currency: Currency
): Stripe.Checkout.SessionCreateParams.LineItem[] {
  const grouped = new Map<
    string,
    {
      name: string;
      description: string | null;
      unitAmount: number;
      quantity: number;
    }
  >();

  for (const unit of flatUnits) {
    const groupKey = `${unit.key}:${unit.adjustedUnitAmount}`;

    const existing = grouped.get(groupKey);
    if (existing) {
      existing.quantity += 1;
      continue;
    }

    grouped.set(groupKey, {
      name: unit.title,
      description: unit.description,
      unitAmount: unit.adjustedUnitAmount,
      quantity: 1,
    });
  }

  return Array.from(grouped.values()).map((group) => ({
    quantity: group.quantity,
    price_data: {
      currency: groupCurrencyForStripe(currency),
      unit_amount: group.unitAmount,
      product_data: {
        name: group.name,
        description: group.description ?? undefined,
      },
    },
  }));
}

function groupCurrencyForStripe(currency: Currency): Lowercase<string> {
  return currency.toLowerCase() as Lowercase<string>;
}

function createCheckoutFingerprint<T extends CartItemLike>(params: {
  userId: string;
  cartId: string;
  currency: Currency;
  subtotal: number;
  discountAmount: number;
  total: number;
  appliedDiscountCodeId: string | null;
  items: T[];
}) {
  const payload = JSON.stringify({
    userId: params.userId,
    cartId: params.cartId,
    currency: params.currency,
    subtotal: params.subtotal,
    discountAmount: params.discountAmount,
    total: params.total,
    appliedDiscountCodeId: params.appliedDiscountCodeId,
    items: params.items.map((item) => ({
      productId: item.productId,
      license: item.license,
      quantity: item.quantity,
      price: item.product.price,
      title: item.product.title,
    })),
  });

  return createHash("sha256").update(payload).digest("hex");
}

export async function POST(req: Request) {
  try {
    const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!rawAppUrl) {
      return NextResponse.json(
        { error: "Missing NEXT_PUBLIC_APP_URL" },
        { status: 500 }
      );
    }

    const appUrl = normalizeAppUrl(rawAppUrl);

    const ipLimit = await enforceIpRateLimit({
      headers: req.headers,
      routeKey: "checkout:create",
      limit: 20,
      windowSec: 60,
    });

    if (!ipLimit.allowed) return ipLimit.response;

    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userLimit = await enforceIpRateLimit({
      headers: req.headers,
      routeKey: `checkout:user:${userId}`,
      limit: 5,
      windowSec: 60,
    });

    if (!userLimit.allowed) return userLimit.response;

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        discountCode: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const validItems = cart.items.filter(
      (item) => item.product.status === "PUBLISHED"
    );

    if (validItems.length === 0) {
      return NextResponse.json(
        { error: "Cart contains invalid products" },
        { status: 400 }
      );
    }

    if (validItems.length !== cart.items.length) {
      return NextResponse.json(
        { error: "Cart contains unavailable products" },
        { status: 400 }
      );
    }

    const currency = getCartCurrency(validItems);
    if (!currency) {
      return NextResponse.json(
        { error: "Unable to determine cart currency" },
        { status: 400 }
      );
    }

    const subtotal = getCartSubtotal(validItems);

    let appliedDiscountCodeId: string | null = null;
    let appliedDiscountCode: string | null = null;
    let discountAmount = 0;

    const discountCode = cart.discountCode;
    const now = new Date();

    if (discountCode) {
      const isInactive = !discountCode.isActive;
      const notStarted = !!discountCode.startsAt && discountCode.startsAt > now;
      const expired = !!discountCode.expiresAt && discountCode.expiresAt < now;
      const wrongCurrency =
        !!discountCode.currency && discountCode.currency !== currency;
      const belowMinSubtotal =
        typeof discountCode.minSubtotal === "number" &&
        subtotal < discountCode.minSubtotal;
      const maxUsesReached =
        typeof discountCode.maxUses === "number" &&
        discountCode.usedCount >= discountCode.maxUses;

      let perUserLimitReached = false;

      if (
        typeof discountCode.perUserLimit === "number" &&
        discountCode.perUserLimit > 0
      ) {
        const userUsageCount = await prisma.discountUsage.count({
          where: {
            userId,
            discountCodeId: discountCode.id,
          },
        });

        perUserLimitReached = userUsageCount >= discountCode.perUserLimit;
      }

      const invalidDiscount =
        isInactive ||
        notStarted ||
        expired ||
        wrongCurrency ||
        belowMinSubtotal ||
        maxUsesReached ||
        perUserLimitReached;

      if (invalidDiscount) {
        await prisma.cart.update({
          where: { id: cart.id },
          data: {
            discountCodeId: null,
          },
        });
      } else {
        discountAmount = getDiscountAmount({
          subtotal,
          discountType: discountCode.discountType,
          percentOff: discountCode.percentOff,
          amountOff: discountCode.amountOff,
        });

        if (discountAmount > 0) {
          appliedDiscountCodeId = discountCode.id;
          appliedDiscountCode = discountCode.code;
        } else {
          await prisma.cart.update({
            where: { id: cart.id },
            data: {
              discountCodeId: null,
            },
          });
        }
      }
    }

    const total = Math.max(0, subtotal - discountAmount);

    if (total <= 0) {
      return NextResponse.json(
        { error: "Cart total must be greater than zero" },
        { status: 400 }
      );
    }

    const line_items = buildDiscountedLineItems({
      items: validItems,
      currency,
      discountAmount,
    });

    const computedStripeTotal = line_items.reduce((sum, item) => {
      const unitAmount = item.price_data?.unit_amount ?? 0;
      return sum + unitAmount * (item.quantity ?? 1);
    }, 0);

    if (computedStripeTotal !== total) {
      throw new Error(
        `Stripe total mismatch. Expected ${total}, got ${computedStripeTotal}.`
      );
    }

    const checkoutFingerprint = createCheckoutFingerprint({
      userId,
      cartId: cart.id,
      currency,
      subtotal,
      discountAmount,
      total,
      appliedDiscountCodeId,
      items: validItems,
    });

    const idempotencyKey = `checkout:${checkoutFingerprint}`;

    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        line_items,
        billing_address_collection: "required",
        success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/checkout`,
        client_reference_id: userId,
        metadata: {
          userId,
          cartId: cart.id,
          checkoutFingerprint,
          subtotal: String(subtotal),
          discountAmount: String(discountAmount),
          total: String(total),
          discountCodeId: appliedDiscountCodeId ?? "",
          discountCode: appliedDiscountCode ?? "",
        },
      },
      { idempotencyKey }
    );

    if (!session.url) {
      throw new Error("Stripe Checkout session was created without a redirect URL.");
    }

    const order = await prisma.order.create({
      data: {
        stripeSessionId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : undefined,
        userId,
        subtotal,
        discountAmount,
        discountCodeId: appliedDiscountCodeId,
        total,
        currency,
        status: "PENDING",
        items: {
          create: validItems.map((item) => ({
            product: {
              connect: {
                id: item.productId,
              },
            },
            quantity: item.quantity,
            price: item.product.price,
            license: item.license,
          })),
        },
      },
    });

    await auditLog({
      eventType: "CHECKOUT_SESSION_CREATED",
      actorType: "USER",
      actorId: userId,
      orderId: order.id,
      stripeObjectId: session.id,
      amountCents: total,
      currency,
      metadata: {
        subtotal,
        discountAmount,
        discountCodeId: appliedDiscountCodeId,
        discountCode: appliedDiscountCode,
        checkoutFingerprint,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    Sentry.captureException(err);

    await auditLog({
      eventType: "CHECKOUT_FAILED",
      level: "ERROR",
      metadata: { error: String(err) },
    });

    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}