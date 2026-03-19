import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth.server";

type CartItemWithProduct = {
  quantity: number;
  product: {
    price: number;
    currency: "EUR" | "USD" | "BGN";
    status: "DRAFT" | "PUBLISHED";
  };
};

function getCartSubtotal(items: CartItemWithProduct[]) {
  return items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);
}

function getCartCurrency(items: CartItemWithProduct[]) {
  if (items.length === 0) return null;

  const first = items[0].product.currency;

  const hasMixedCurrencies = items.some(
    (item: CartItemWithProduct) => item.product.currency !== first
  );

  if (hasMixedCurrencies) {
    throw new Error("Cart contains mixed currencies.");
  }

  return first;
}

function getDiscountAmount(params: {
  subtotal: number;
  discountType: "PERCENT" | "FIXED";
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

export async function POST(req: Request) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const rawCode = typeof body?.code === "string" ? body.code : "";
    const code = rawCode.trim().toUpperCase();

    if (!code) {
      return NextResponse.json(
        { error: "Please enter a discount code." },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                price: true,
                currency: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    const hasUnpublishedItems = cart.items.some(
      (item: CartItemWithProduct) => item.product.status !== "PUBLISHED"
    );

    if (hasUnpublishedItems) {
      return NextResponse.json(
        { error: "Your cart contains unavailable products." },
        { status: 400 }
      );
    }

    const subtotal = getCartSubtotal(cart.items as CartItemWithProduct[]);

    const currency = getCartCurrency(cart.items as CartItemWithProduct[]);

    if (!currency) {
      return NextResponse.json(
        { error: "Unable to determine cart currency." },
        { status: 400 }
      );
    }

    if (currency !== "EUR") {
      return NextResponse.json(
        { error: "Store currency must be EUR." },
        { status: 400 }
      );
    }

    const discountCode = await prisma.discountCode.findUnique({
      where: { code },
      select: {
        id: true,
        code: true,
        isActive: true,
        discountType: true,
        percentOff: true,
        amountOff: true,
        minSubtotal: true,
        maxUses: true,
        usedCount: true,
        perUserLimit: true,
        startsAt: true,
        expiresAt: true,
      },
    });

    if (!discountCode || !discountCode.isActive) {
      return NextResponse.json(
        { error: "Invalid discount code." },
        { status: 400 }
      );
    }

    const now = new Date();

    if (discountCode.startsAt && discountCode.startsAt > now) {
      return NextResponse.json(
        { error: "This discount code is not active yet." },
        { status: 400 }
      );
    }

    if (discountCode.expiresAt && discountCode.expiresAt < now) {
      return NextResponse.json(
        { error: "This discount code has expired." },
        { status: 400 }
      );
    }

    if (
      typeof discountCode.minSubtotal === "number" &&
      subtotal < discountCode.minSubtotal
    ) {
      return NextResponse.json(
        { error: "Minimum order amount not met for this code." },
        { status: 400 }
      );
    }

    if (
      typeof discountCode.maxUses === "number" &&
      discountCode.usedCount >= discountCode.maxUses
    ) {
      return NextResponse.json(
        { error: "This discount code has reached its usage limit." },
        { status: 400 }
      );
    }

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

      if (userUsageCount >= discountCode.perUserLimit) {
        return NextResponse.json(
          { error: "You have already used this discount code." },
          { status: 400 }
        );
      }
    }

    const discountAmount = getDiscountAmount({
      subtotal,
      discountType: discountCode.discountType,
      percentOff: discountCode.percentOff,
      amountOff: discountCode.amountOff,
    });

    if (discountAmount <= 0) {
      return NextResponse.json(
        { error: "This discount code is not valid for your cart." },
        { status: 400 }
      );
    }

    const total = Math.max(0, subtotal - discountAmount);

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        discountCodeId: discountCode.id,
      },
    });

    return NextResponse.json({
      success: true,
      code: discountCode.code,
      summary: {
        subtotal,
        discountAmount,
        total,
        currency,
      },
      discount: {
        id: discountCode.id,
        code: discountCode.code,
        type: discountCode.discountType,
        percentOff: discountCode.percentOff,
        amountOff: discountCode.amountOff,
      },
    });
  } catch (error) {
    console.error("apply-discount error:", error);

    const message =
      error instanceof Error ? error.message : "Unable to apply discount code.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}