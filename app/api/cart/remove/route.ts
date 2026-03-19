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
      console.error("Cart REMOVE: Unauthorized request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { cartItemId } = body;

    if (typeof cartItemId !== "string" || !cartItemId.trim()) {
      console.error("Cart REMOVE: Missing cartItemId", body);
      return NextResponse.json(
        { error: "Cart item ID is required" },
        { status: 400 }
      );
    }

    console.log("Cart REMOVE request:", { userId, cartItemId });

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        cart: true,
      },
    });

    if (!cartItem) {
      console.error("Cart REMOVE: Item not found", cartItemId);
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    if (cartItem.cart.userId !== userId) {
      console.error("Cart REMOVE: Forbidden attempt", {
        userId,
        owner: cartItem.cart.userId,
      });

      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const cartId = cartItem.cartId;

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    console.log("Cart REMOVE: Item deleted", cartItemId);

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      console.error("Cart REMOVE: Cart not found after deletion", cartId);

      return NextResponse.json({
        items: [],
        subtotal: 0,
        currency: null,
      });
    }

    const validItems: CartItemWithProduct[] = cart.items.filter(
      (item: CartItemWithProduct) => item.product.status === "PUBLISHED"
    );

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

    console.log("Cart REMOVE: Updated cart returned", {
      items: responseItems.length,
      subtotal,
    });

    return NextResponse.json({
      items: responseItems,
      subtotal,
      currency,
    });
  } catch (error) {
    console.error("Cart REMOVE error:", error);

    return NextResponse.json(
      {
        error: "Unable to remove item",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}