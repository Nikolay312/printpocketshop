import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth.server";

const VALID_LICENSES = ["PERSONAL", "COMMERCIAL"] as const;

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
    const productId = typeof body.productId === "string" ? body.productId : "";
    const quantity = typeof body.quantity === "number" ? body.quantity : 1;
    const license = typeof body.license === "string" ? body.license : "PERSONAL";

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    if (!VALID_LICENSES.includes(license as (typeof VALID_LICENSES)[number])) {
      return NextResponse.json({ error: "Invalid license" }, { status: 400 });
    }

    if (!Number.isInteger(quantity) || quantity <= 0 || quantity > 99) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: "Product not available" },
        { status: 404 }
      );
    }

    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        license,
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: {
            increment: quantity,
          },
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          license,
        },
      });
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
    console.error("Cart ADD error:", error);
    return NextResponse.json(
      { error: "Unable to add to cart" },
      { status: 500 }
    );
  }
}