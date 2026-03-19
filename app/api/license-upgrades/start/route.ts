export const runtime = "nodejs";

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth.server";
import { ProductLicense, AuditActorType, AuditLevel } from "@prisma/client";
import { enforceIpRateLimit } from "@/lib/rateLimit";
import { auditLog } from "@/lib/audit.server";
import * as Sentry from "@sentry/nextjs";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

const stripe = new Stripe(stripeSecret);

type Body = {
  orderItemId: string;
};

export async function POST(req: Request) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      return NextResponse.json(
        { error: "Missing NEXT_PUBLIC_APP_URL" },
        { status: 500 }
      );
    }

    /* =========================
       IP RATE LIMIT
    ========================= */

    const ipLimit = await enforceIpRateLimit({
      headers: req.headers,
      routeKey: "license-upgrade:start",
      limit: 20,
      windowSec: 60,
    });

    if (!ipLimit.allowed) {
      return ipLimit.response;
    }

    /* =========================
       AUTH
    ========================= */

    const authUserId = await getCurrentUserId();
    if (!authUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* =========================
       USER RATE LIMIT
    ========================= */

    const userLimit = await enforceIpRateLimit({
      headers: req.headers,
      routeKey: `license-upgrade:user:${authUserId}`,
      limit: 5,
      windowSec: 60,
    });

    if (!userLimit.allowed) {
      return userLimit.response;
    }

    const body = (await req.json()) as Body;

    if (!body?.orderItemId) {
      return NextResponse.json(
        { error: "Missing orderItemId" },
        { status: 400 }
      );
    }

    /* =========================
       AUTHORITATIVE QUERY
    ========================= */

    const orderItem = await prisma.orderItem.findFirst({
      where: {
        id: body.orderItemId,
        order: {
          userId: authUserId,
          status: "PAID",
        },
      },
      include: {
        order: true,
        product: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
        licenseUpgrades: true,
      },
    });

    if (!orderItem) {
      return NextResponse.json(
        { error: "Upgrade not allowed" },
        { status: 403 }
      );
    }

    if (!orderItem.product) {
      return NextResponse.json(
        { error: "Invalid order item" },
        { status: 400 }
      );
    }

    if (orderItem.license !== ProductLicense.PERSONAL) {
      return NextResponse.json(
        { error: "Upgrade not allowed" },
        { status: 403 }
      );
    }

    if (
      orderItem.licenseUpgrades.some(
        (u) => u.toLicense === ProductLicense.COMMERCIAL
      )
    ) {
      return NextResponse.json(
        { error: "Already upgraded" },
        { status: 400 }
      );
    }

    const deltaCents = orderItem.product.price - orderItem.price;

    if (deltaCents <= 0) {
      return NextResponse.json(
        { error: "No upgrade needed" },
        { status: 400 }
      );
    }

    /* =========================
       CREATE PENDING UPGRADE
    ========================= */

    const upgrade = await prisma.licenseUpgrade.create({
      data: {
        userId: authUserId,
        orderItemId: orderItem.id,
        fromLicense: ProductLicense.PERSONAL,
        toLicense: ProductLicense.COMMERCIAL,
        currency: orderItem.order.currency,
        fromPriceCents: orderItem.price,
        toPriceCents: orderItem.product.price,
        deltaCents,
        status: "PENDING",
      },
    });

    /* =========================
       STRIPE SESSION
    ========================= */

    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: orderItem.order.currency.toLowerCase(),
              unit_amount: deltaCents,
              product_data: {
                name: `License upgrade: ${orderItem.product.title}`,
              },
            },
          },
        ],
        success_url: `${appUrl}/checkout/success`,
        cancel_url: `${appUrl}/account/orders`,
        metadata: {
          type: "license_upgrade",
          licenseUpgradeId: upgrade.id,
        },
      },
      {
        idempotencyKey: crypto.randomUUID(),
      }
    );

    await prisma.licenseUpgrade.update({
      where: { id: upgrade.id },
      data: { stripeCheckoutSessionId: session.id },
    });

    /* =========================
       AUDIT: UPGRADE INITIATED
    ========================= */

    await auditLog({
      eventType: "LICENSE_UPGRADE_SESSION_CREATED",
      actorType: AuditActorType.USER,
      actorId: authUserId,
      licenseUpgradeId: upgrade.id,
      orderId: orderItem.orderId,
      stripeObjectId: session.id,
      amountCents: deltaCents,
      currency: orderItem.order.currency,
      metadata: {
        productId: orderItem.product.id,
        fromLicense: ProductLicense.PERSONAL,
        toLicense: ProductLicense.COMMERCIAL,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    Sentry.captureException(err);

    await auditLog({
      eventType: "LICENSE_UPGRADE_START_FAILED",
      level: AuditLevel.ERROR,
      metadata: { error: String(err) },
    });

    return NextResponse.json(
      { error: "Upgrade checkout failed" },
      { status: 500 }
    );
  }
}
