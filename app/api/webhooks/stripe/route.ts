export const runtime = "nodejs";

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { computeVat } from "@/lib/vat";
import {
  sendOrderConfirmationEmail,
  sendDownloadLinksEmail,
  sendRefundEmail,
} from "@/lib/mail";
import { rateLimitInvalidStripeAttempt } from "@/lib/rateLimit";
import { auditLog } from "@/lib/audit.server";
import * as Sentry from "@sentry/nextjs";

/* =========================
   STRIPE INIT
========================= */

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecret) throw new Error("STRIPE_SECRET_KEY missing");
if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET missing");

const stripe = new Stripe(stripeSecret);

/* =========================
   ORDER LOOKUP
========================= */

async function findOrderForCheckoutSession(session: Stripe.Checkout.Session) {
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : undefined;

  if (paymentIntentId) {
    const byPaymentIntent = await prisma.order.findUnique({
      where: { stripePaymentIntentId: paymentIntentId },
      include: { user: true },
    });

    if (byPaymentIntent) return byPaymentIntent;
  }

  const bySession = await prisma.order.findUnique({
    where: { stripeSessionId: session.id },
    include: { user: true },
  });

  return bySession;
}

/* =========================
   PAYMENT SUCCESS FLOW
========================= */

async function handleSuccessfulCheckout(params: {
  event: Stripe.Event;
  session: Stripe.Checkout.Session;
}) {
  const { event, session } = params;

  if (session.payment_status !== "paid") {
    await auditLog({
      eventType: "CHECKOUT_SESSION_COMPLETED_NOT_PAID",
      level: "WARN",
      stripeEventId: event.id,
      stripeObjectId: session.id,
      metadata: {
        paymentStatus: session.payment_status,
      },
    });

    return;
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : undefined;

  const billing = session.customer_details;

  const order = await findOrderForCheckoutSession(session);

  if (!order) {
    await auditLog({
      eventType: "ORDER_NOT_FOUND_FOR_STRIPE_SESSION",
      level: "ERROR",
      stripeEventId: event.id,
      stripeObjectId: session.id,
      metadata: {
        paymentIntentId,
      },
    });

    return;
  }

  const updated = await prisma.$transaction(
    async (tx) => {
      const currentOrder = await tx.order.findUnique({
        where: { id: order.id },
        include: { user: true },
      });

      if (!currentOrder) {
        throw new Error(`Order ${order.id} disappeared during webhook processing.`);
      }

      const wasPending = currentOrder.status === "PENDING";
      const isAlreadyPaid = currentOrder.status === "PAID";

      let finalOrder = currentOrder;

      if (!isAlreadyPaid) {
        finalOrder = await tx.order.update({
          where: { id: currentOrder.id },
          data: {
            status: "PAID",
            stripePaymentIntentId:
              currentOrder.stripePaymentIntentId ?? paymentIntentId,
          },
          include: { user: true },
        });
      }

      if (wasPending) {
        await tx.cartItem.deleteMany({
          where: {
            cart: {
              userId: currentOrder.userId,
            },
          },
        });
      }

      const existingInvoice = await tx.invoice.findFirst({
        where: { orderId: currentOrder.id },
        select: { id: true },
      });

      let createdInvoiceId: string | null = null;

      if (!existingInvoice) {
        const lastInvoice = await tx.invoice.findFirst({
          orderBy: { invoiceNumber: "desc" },
          select: { invoiceNumber: true },
        });

        const invoiceNumber = (lastInvoice?.invoiceNumber ?? 0) + 1;

        const buyerCountry = billing?.address?.country ?? "UNKNOWN";
        const vat = computeVat({
          buyerCountry,
          sellerCountry: "EU",
          hasVatNumber: false,
        });

        const vatAmount = Math.round(finalOrder.total * vat.rate);
        const gross = finalOrder.total + vatAmount;

        const invoice = await tx.invoice.create({
          data: {
            invoiceNumber,
            userId: finalOrder.userId,
            orderId: finalOrder.id,
            currency: finalOrder.currency,
            netAmount: finalOrder.total,
            vatAmount,
            grossAmount: gross,
            vatRate: vat.rate,
            vatCountry: buyerCountry,
            vatApplied: vat.applied,
            buyerName: billing?.name ?? finalOrder.user.email,
            buyerEmail: finalOrder.user.email,
            buyerCountry,
            sellerName: "PrintPocketShop",
            sellerCountry: "EU",
          },
        });

        createdInvoiceId = invoice.id;
      }

      return {
        order: finalOrder,
        wasPending,
        createdInvoiceId,
        wasAlreadyPaid: isAlreadyPaid,
      };
    },
    {
      isolationLevel: "Serializable",
    }
  );

  if (!updated.wasAlreadyPaid) {
    await auditLog({
      eventType: "ORDER_MARKED_PAID",
      orderId: updated.order.id,
      stripeEventId: event.id,
      stripeObjectId: paymentIntentId ?? session.id,
      amountCents: updated.order.total,
      currency: updated.order.currency,
    });
  }

  if (updated.wasPending) {
    await auditLog({
      eventType: "CART_CLEARED_AFTER_PAYMENT",
      orderId: updated.order.id,
    });
  }

  if (updated.createdInvoiceId) {
    await auditLog({
      eventType: "INVOICE_CREATED",
      invoiceId: updated.createdInvoiceId,
      orderId: updated.order.id,
      amountCents: updated.order.total,
      currency: updated.order.currency,
    });
  }

  try {
    const confirmationResult = await sendOrderConfirmationEmail({
      email: updated.order.user.email,
      orderId: updated.order.id,
      total: updated.order.total,
      currency: updated.order.currency,
    });

    await auditLog({
      eventType: "EMAIL_SENT",
      orderId: updated.order.id,
      metadata: {
        type: "ORDER_CONFIRMATION",
        to: updated.order.user.email,
        provider: confirmationResult.provider,
        providerMessageId: confirmationResult.id,
      },
    });

    const downloadResult = await sendDownloadLinksEmail({
      email: updated.order.user.email,
    });

    await auditLog({
      eventType: "EMAIL_SENT",
      orderId: updated.order.id,
      metadata: {
        type: "DOWNLOAD_LINKS",
        to: updated.order.user.email,
        provider: downloadResult.provider,
        providerMessageId: downloadResult.id,
      },
    });
  } catch (err) {
    Sentry.captureException(err);

    await auditLog({
      eventType: "EMAIL_SEND_FAILED",
      level: "ERROR",
      orderId: updated.order.id,
      metadata: { error: String(err), to: updated.order.user.email },
    });
  }
}

/* =========================
   REFUND FLOW
========================= */

async function handleChargeRefunded(params: {
  event: Stripe.Event;
  charge: Stripe.Charge;
}) {
  const { event, charge } = params;

  if (typeof charge.payment_intent !== "string") {
    return;
  }

  const order = await prisma.order.findUnique({
    where: { stripePaymentIntentId: charge.payment_intent },
    include: { user: true },
  });

  if (!order) {
    await auditLog({
      eventType: "REFUND_ORDER_NOT_FOUND",
      level: "WARN",
      stripeEventId: event.id,
      stripeObjectId: charge.id,
      metadata: {
        paymentIntentId: charge.payment_intent,
      },
    });

    return;
  }

  if (order.status !== "REFUNDED") {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "REFUNDED" },
    });

    await auditLog({
      eventType: "ORDER_REFUNDED",
      orderId: order.id,
      stripeEventId: event.id,
      stripeObjectId: charge.id,
      amountCents: charge.amount_refunded ?? order.total,
      currency: order.currency,
    });
  }

  try {
    const refundResult = await sendRefundEmail({
      email: order.user.email,
      orderId: order.id,
      total: order.total,
      currency: order.currency,
    });

    await auditLog({
      eventType: "EMAIL_SENT",
      orderId: order.id,
      metadata: {
        type: "REFUND_EMAIL",
        to: order.user.email,
        provider: refundResult.provider,
        providerMessageId: refundResult.id,
      },
    });
  } catch (err) {
    Sentry.captureException(err);

    await auditLog({
      eventType: "EMAIL_SEND_FAILED",
      level: "ERROR",
      orderId: order.id,
      metadata: { error: String(err), to: order.user.email },
    });
  }
}

/* =========================
   WEBHOOK HANDLER
========================= */

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    await auditLog({
      eventType: "STRIPE_WEBHOOK_SIGNATURE_MISSING",
      level: "WARN",
    });

    return NextResponse.json(
      { error: "Missing stripe-signature" },
      { status: 400 }
    );
  }

  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret!);
  } catch (err) {
    const rateLimited = await rateLimitInvalidStripeAttempt(req);
    if (rateLimited) return rateLimited;

    await auditLog({
      eventType: "STRIPE_WEBHOOK_SIGNATURE_INVALID",
      level: "WARN",
      metadata: { error: String(err) },
    });

    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  const stripeObject =
    "id" in event.data.object
      ? (event.data.object as { id: string })
      : undefined;

  await auditLog({
    eventType: "STRIPE_EVENT_RECEIVED",
    stripeEventId: event.id,
    stripeObjectId: stripeObject?.id,
    metadata: {
      type: event.type,
    },
  });

  try {
    try {
      await prisma.processedStripeEvent.create({
        data: { id: event.id, type: event.type },
      });
    } catch {
      await auditLog({
        eventType: "STRIPE_WEBHOOK_DUPLICATE_IGNORED",
        stripeEventId: event.id,
      });

      return NextResponse.json({ received: true });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        await handleSuccessfulCheckout({
          event,
          session: event.data.object as Stripe.Checkout.Session,
        });
        break;
      }

      case "checkout.session.async_payment_succeeded": {
        await handleSuccessfulCheckout({
          event,
          session: event.data.object as Stripe.Checkout.Session,
        });
        break;
      }

      case "charge.refunded": {
        await handleChargeRefunded({
          event,
          charge: event.data.object as Stripe.Charge,
        });
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    Sentry.captureException(err);

    try {
      await prisma.processedStripeEvent.delete({
        where: { id: event.id },
      });
    } catch {
      // Best effort only. If this fails, Stripe may not retry safely.
    }

    await auditLog({
      eventType: "STRIPE_WEBHOOK_PROCESSING_FAILED",
      level: "ERROR",
      stripeEventId: event.id,
      stripeObjectId: stripeObject?.id,
      metadata: {
        type: event.type,
        error: String(err),
      },
    });

    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}