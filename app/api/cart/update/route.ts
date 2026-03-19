import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth.server";

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

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { cartItemId, quantity } = body;

    if (
      typeof cartItemId !== "string" ||
      !cartItemId ||
      typeof quantity !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(quantity) || quantity < 0 || quantity > 99) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        cart: true,
      },
    });

    if (!cartItem || cartItem.cart.userId !== userId) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    if (quantity === 0) {
      await prisma.cartItem.delete({
        where: { id: cartItemId },
      });
    } else {
      await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
      });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const validItems: CartItemWithProduct[] =
      cart?.items.filter(
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
    console.error("Cart UPDATE error:", error);
    return NextResponse.json(
      { error: "Unable to update cart" },
      { status: 500 }
    );
  }
}