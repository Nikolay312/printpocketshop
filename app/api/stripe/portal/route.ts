export const runtime = "nodejs";

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth.server";
import { redis } from "@/lib/redis";

function getStripeClient() {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }

  return new Stripe(stripeSecret);
}

export async function POST() {
  try {
    const stripe = getStripeClient();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      return NextResponse.redirect(new URL("/account/profile", "http://localhost:3000"));
    }

    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.redirect(new URL("/login", appUrl));
    }

    const rateKey = `portal:${userId}`;
    const attempts = await redis.incr(rateKey);

    if (attempts === 1) {
      await redis.expire(rateKey, 60);
    }

    if (attempts > 5) {
      return NextResponse.redirect(
        new URL("/account/profile?error=rate_limited", appUrl)
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, stripeCustomerId: true },
    });

    if (!user?.email) {
      return NextResponse.redirect(new URL("/account/profile", appUrl));
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

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appUrl}/account/profile`,
    });

    return NextResponse.redirect(session.url!, { status: 303 });
  } catch (err) {
    console.error("Stripe portal error:", err);

    const fallbackBase = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return NextResponse.redirect(
      new URL("/account/profile?error=portal_failed", fallbackBase)
    );
  }
}