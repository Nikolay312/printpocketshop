export const runtime = "nodejs";

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import {
  sendOrderConfirmationEmail,
  sendDownloadLinksEmail,
  sendRefundEmail,
} from "@/lib/mail";
import * as Sentry from "@sentry/nextjs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function parseCompactCart(cart: string | null) {
  if (!cart) return [];
  return cart
    .split("|")
    .map((pair) => {
      const [productId, qtyStr] = pair.split(":");
      const quantity = Number(qtyStr);
      if (!productId || !Number.isInteger(quantity) || quantity <= 0) return null;
      return { productId, quantity };
    })
    .filter(Boolean) as { productId: string; quantity: number }[];
}

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await req.text(), signature, secret);
  } catch (err) {
    console.error("❌ Invalid webhook signature:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const existing = await prisma.order.findUnique({
      where: { stripeSessionId: session.id },
    });
    if (existing) return NextResponse.json({ received: true });

    const userId =
      session.metadata?.userId ??
      session.client_reference_id ??
      null;

    if (!userId) {
      console.error("❌ Missing userId on session");
      return NextResponse.json({ received: true });
    }

    const cart = parseCompactCart(session.metadata?.cart ?? null);
    if (!cart.length) {
      console.error("❌ Empty cart metadata");
      return NextResponse.json({ received: true });
    }

    const products = await prisma.product.findMany({
      where: { id: { in: cart.map((c) => c.productId) } },
      select: { id: true, price: true },
    });

    const priceMap = new Map(products.map((p) => [p.id, p.price]));

    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : undefined;

    const order = await prisma.order.create({
      data: {
        stripeSessionId: session.id,
        stripePaymentIntentId: paymentIntentId,
        userId,
        total: session.amount_total ?? 0,
        currency: String(session.currency ?? "EUR").toUpperCase() as any,
        status: "PAID",
        items: {
          create: cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: priceMap.get(item.productId) ?? 0,
          })),
        },
      },
    });

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });

      if (user?.email) {
        await sendOrderConfirmationEmail({
          email: user.email,
          orderId: order.id,
          total: order.total,
          currency: order.currency,
        });

        await sendDownloadLinksEmail({
          email: user.email,
          orderId: order.id,
        });
      }
    } catch (err) {
      console.error("⚠️ Email side-effect failed:", err);
      Sentry.captureException(err);
    }

    return NextResponse.json({ received: true });
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;

    const paymentIntentId =
      typeof charge.payment_intent === "string"
        ? charge.payment_intent
        : undefined;

    if (!paymentIntentId) {
      return NextResponse.json({ received: true });
    }

    await prisma.order.updateMany({
      where: { stripePaymentIntentId: paymentIntentId },
      data: { status: "REFUNDED" },
    });

    try {
      const order = await prisma.order.findFirst({
        where: { stripePaymentIntentId: paymentIntentId },
        include: {
          user: { select: { email: true } },
        },
      });

      if (order?.user?.email) {
        await sendRefundEmail({
          email: order.user.email,
          orderId: order.id,
          total: order.total,
          currency: order.currency,
        });
      }
    } catch (err) {
      console.error("⚠️ Refund email failed:", err);
      Sentry.captureException(err);
    }

    return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true });
}
