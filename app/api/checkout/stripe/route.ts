export const runtime = "nodejs";

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth.server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type Body = {
  items: { productId: string; quantity: number }[];
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

    // ✅ FIX: correct usage of auth helper (no args)
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as Body;
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "Empty cart" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, stripeCustomerId: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId },
      });

      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customer.id },
      });

      customerId = customer.id;
    }

    const productIds = body.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "Invalid product in cart" },
        { status: 400 }
      );
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
      body.items.map((item) => {
        if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
          throw new Error("Invalid quantity");
        }

        const product = products.find((p) => p.id === item.productId)!;

        return {
          quantity: item.quantity,
          price_data: {
            currency: product.currency.toLowerCase(),
            unit_amount: product.price,
            product_data: {
              name: product.title,
              description: product.description ?? undefined,
            },
          },
        };
      });

    const cartCompact = body.items
      .map((i) => `${i.productId}:${i.quantity}`)
      .join("|");

    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        customer: customerId,
        line_items,
        billing_address_collection: "required",
        success_url: `${appUrl}/checkout/success`,
        cancel_url: `${appUrl}/checkout`,
        client_reference_id: userId,
        metadata: {
          userId,
          cart: cartCompact,
        },
      },
      { idempotencyKey: crypto.randomUUID() }
    );

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("❌ Checkout error:", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
