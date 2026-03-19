import { describe, it, expect } from "vitest";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { POST } from "@/app/api/webhooks/stripe/route";
import { createTestUser } from "@/tests/helpers/createTestUser";
import { createTestOrder } from "@/tests/helpers/createTestOrder";

const stripe = new Stripe("sk_test_dummy");

describe("Stripe webhook integration", () => {
  it("marks existing PENDING order as PAID on checkout.session.completed", async () => {
    // 1️⃣ Create user
    const user = await createTestUser({
      email: "buyer-webhook@test.com",
    });

    // 2️⃣ Create PENDING order
    const order = await createTestOrder({
      userId: user.id,
      status: "PENDING",
      total: 1000,
      currency: "EUR",
      stripeSessionId: "cs_test_123",
    });

    // 3️⃣ Create Stripe session object
    const session = {
      id: order.stripeSessionId,
      object: "checkout.session",
      payment_intent: "pi_test_123",
      customer_details: {
        email: user.email,
        address: { country: "DE" },
      },
      metadata: {},
    };

    // 4️⃣ Create event with UNIQUE id
    const event = {
      id: `evt_test_${Date.now()}`, // 🔥 prevent idempotency collision
      type: "checkout.session.completed",
      data: {
        object: session,
      },
    };

    const payload = JSON.stringify(event);

    const signature = stripe.webhooks.generateTestHeaderString({
      payload,
      secret: process.env.STRIPE_WEBHOOK_SECRET!,
    });

    const req = new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      headers: {
        "stripe-signature": signature,
        "content-type": "application/json",
      },
      body: payload,
    });

    // 5️⃣ Call handler
    const res = await POST(req);
    expect(res.status).toBe(200);

    // 6️⃣ Verify order was marked PAID
    const updatedOrder = await prisma.order.findUnique({
      where: { id: order.id },
    });

    expect(updatedOrder).toBeDefined();
    expect(updatedOrder!.status).toBe("PAID");
    expect(updatedOrder!.stripePaymentIntentId).toBe("pi_test_123");
  });
});
