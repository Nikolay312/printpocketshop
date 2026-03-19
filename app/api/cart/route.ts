import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth.server";

export async function GET() {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({
        items: [],
        subtotal: 0,
        currency: null,
      });
    }

    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    const validItems = cart.items.filter(
      (item) => item.product.status === "PUBLISHED"
    );

    let subtotal = 0;
    let currency: string | null = null;

    for (const item of validItems) {
      subtotal += item.product.price * item.quantity;
      currency = item.product.currency;
    }

    const responseItems = validItems.map((item) => ({
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
    console.error("Cart GET error:", error);
    return NextResponse.json(
      { error: "Unable to load cart" },
      { status: 500 }
    );
  }
}