import { describe, it, expect } from "vitest";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { POST } from "@/app/api/webhooks/stripe/route";

// ✅ standardized helpers
import { createTestUser } from "@/tests/helpers/createTestUser";
import { createTestOrder } from "@/tests/helpers/createTestOrder";

const stripe = new Stripe("sk_test_dummy");

describe("Invoices integration", () => {
  it("creates an invoice when an order is paid via Stripe webhook", async () => {
    // 1️⃣ Create user
    const user = await createTestUser({
      email: "buyer-invoice@test.com",
    });

    // 2️⃣ Create PENDING order
    const order = await createTestOrder({
      userId: user.id,
      status: "PENDING",
      total: 5000,
      currency: "EUR",
      stripeSessionId: "cs_test_invoice_123",
    });

    // 3️⃣ Build Stripe session
    const session = {
      id: order.stripeSessionId,
      object: "checkout.session",
      payment_intent: "pi_test_invoice_123",
      customer_details: {
        email: user.email,
        address: {
          country: "DE",
        },
      },
      metadata: {},
    };

    // 4️⃣ Build Stripe event (UNIQUE ID 🔥)
    const event = {
      id: `evt_test_invoice_${Date.now()}`, // prevent idempotency collision
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

    // 5️⃣ Call webhook
    const res = await POST(req);
    expect(res.status).toBe(200);

    // 6️⃣ Assert invoice created
    const invoice = await prisma.invoice.findFirst({
      where: {
        orderId: order.id,
      },
    });

    expect(invoice).not.toBeNull();
    expect(invoice!.orderId).toBe(order.id);
    expect(invoice!.userId).toBe(user.id);
    expect(invoice!.currency).toBe(order.currency);
    expect(invoice!.netAmount).toBe(order.total);
    expect(invoice!.grossAmount).toBeGreaterThanOrEqual(order.total);
    expect(invoice!.invoiceNumber).toBeGreaterThan(0);

    // 7️⃣ Assert order marked as PAID
    const updatedOrder = await prisma.order.findUnique({
      where: { id: order.id },
    });

    expect(updatedOrder).not.toBeNull();
    expect(updatedOrder!.status).toBe("PAID");
    expect(updatedOrder!.stripePaymentIntentId).toBe(
      "pi_test_invoice_123"
    );
  });
});
