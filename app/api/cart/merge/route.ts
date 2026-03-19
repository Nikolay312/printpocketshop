import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth.server";

type GuestCartItem = {
  productId: string;
  quantity: number;
  license?: "PERSONAL" | "COMMERCIAL";
};

type CartItemWithProduct = {
  id: string;
  productId: string;
  quantity: number;
  license: string;
  product: {
    title: string;
    slug: string;
    price: number;
    currency: string;
    status: string;
  };
};

const VALID_LICENSES = ["PERSONAL", "COMMERCIAL"] as const;

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items } = body as { items: GuestCartItem[] };

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    for (const item of items) {
      if (typeof item.productId !== "string" || !item.productId) continue;
      if (!Number.isInteger(item.quantity) || item.quantity <= 0 || item.quantity > 99) continue;

      const license =
        typeof item.license === "string" &&
        VALID_LICENSES.includes(item.license as (typeof VALID_LICENSES)[number])
          ? item.license
          : "PERSONAL";

      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || product.status !== "PUBLISHED") {
        continue;
      }

      const existing = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: item.productId,
          license,
        },
      });

      if (existing) {
        await prisma.cartItem.update({
          where: { id: existing.id },
          data: {
            quantity: {
              increment: item.quantity,
            },
          },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: item.productId,
            quantity: item.quantity,
            license,
          },
        });
      }
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const validItems: CartItemWithProduct[] =
      updatedCart?.items.filter(
        (item: CartItemWithProduct) => item.product.status === "PUBLISHED"
      ) ?? [];

    let subtotal = 0;
    let currency: string | null = null;

    for (const item of validItems) {
      subtotal += item.product.price * item.quantity;
      currency = item.product.currency;
    }

    const responseItems = validItems.map((item: CartItemWithProduct) => ({
      id: item.id,
      productId: item.productId,
      title: item.product.title,
      slug: item.product.slug,
      price: item.product.price,
      currency: item.product.currency,
      quantity: item.quantity,
      license: item.license,
    }));

    return NextResponse.json({
      items: responseItems,
      subtotal,
      currency,
    });
  } catch (error) {
    console.error("Cart MERGE error:", error);
    return NextResponse.json(
      { error: "Unable to merge cart" },
      { status: 500 }
    );
  }
}