import Link from "next/link";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import {
  CheckCircle,
  Download,
  ArrowRight,
  Clock3,
  AlertCircle,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

function getStripeClient() {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }

  return new Stripe(stripeSecret);
}

type SuccessPageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

export default async function SuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/checkout");
  }

  let session: Stripe.Checkout.Session | null = null;

  try {
    const stripe = getStripeClient();
    session = await stripe.checkout.sessions.retrieve(session_id);
  } catch {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24">
        <div className="space-y-10 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-red-200 bg-red-50">
            <AlertCircle className="h-10 w-10 text-red-600" strokeWidth={1.5} />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-black">
              We couldn&apos;t verify this checkout
            </h1>

            <p className="text-lg leading-relaxed text-neutral-600">
              The payment session could not be found. Please check your account
              downloads, or contact support if you were charged.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <Link
              href="/account/downloads"
              className="inline-flex h-[56px] items-center justify-center gap-2 rounded-xl bg-black px-12 text-base font-semibold text-white shadow-[0_14px_30px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(0,0,0,0.28)]"
            >
              <Download className="h-5 w-5" />
              <span>Check Your Downloads</span>
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-black"
            >
              <span>Contact Support</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : null;

  let orderStatus: string | null = null;

  if (paymentIntentId) {
    const order = await prisma.order.findUnique({
      where: { stripePaymentIntentId: paymentIntentId },
      select: { status: true, id: true },
    });

    if (order) {
      orderStatus = order.status;
    }
  }

  if (!orderStatus) {
    const order = await prisma.order.findUnique({
      where: { stripeSessionId: session.id },
      select: { status: true, id: true },
    });

    if (order) {
      orderStatus = order.status;
    }
  }

  const isPaidInStripe = session.payment_status === "paid";
  const isPaidInApp = orderStatus === "PAID";

  if (!isPaidInStripe || !isPaidInApp) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24">
        <div className="space-y-14 text-center animate-[fadeIn_.25s_ease-out]">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-amber-200 bg-amber-50">
            <Clock3 className="h-10 w-10 text-amber-600" strokeWidth={1.5} />
          </div>

          <div className="space-y-5">
            <h1 className="text-4xl font-semibold tracking-tight text-black md:text-5xl">
              Your payment is being processed
            </h1>

            <p className="mx-auto max-w-xl pt-4 text-lg leading-relaxed text-neutral-600">
              We received your checkout and are finalizing your order. This
              usually takes just a moment. If your downloads do not appear right
              away, refresh the downloads page shortly.
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm text-neutral-500">
                <span>Waiting for payment confirmation</span>
                <span aria-hidden="true">•</span>
                <span>Digital delivery activates automatically</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 pt-4">
            <Link
              href="/account/downloads"
              className="
                inline-flex h-[56px] items-center justify-center gap-2 whitespace-nowrap
                rounded-xl bg-black px-12 text-base font-semibold text-white
                shadow-[0_14px_30px_rgba(0,0,0,0.22)]
                transition-all duration-300 ease-out
                hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(0,0,0,0.28)]
              "
            >
              <Download className="h-5 w-5 text-white" />
              <span>Check Your Downloads</span>
            </Link>

            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium text-neutral-500 transition-colors hover:text-black"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-2 pt-6 text-sm text-neutral-500">
            <p>
              If payment was successful, your downloads will appear
              automatically once processing completes.
            </p>

            <p className="inline-flex items-center justify-center gap-1">
              <span>Still need help?</span>
              <Link
                href="/contact"
                className="text-neutral-600 underline underline-offset-4 transition-colors hover:text-black"
              >
                Contact support
              </Link>
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <div className="space-y-14 text-center animate-[fadeIn_.25s_ease-out]">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-green-200 bg-green-50">
          <CheckCircle className="h-10 w-10 text-green-600" strokeWidth={1.5} />
        </div>

        <div className="space-y-5">
          <h1 className="text-4xl font-semibold tracking-tight text-black md:text-5xl">
            Thank you for your purchase
          </h1>

          <p className="mx-auto max-w-xl pt-4 text-lg leading-relaxed text-neutral-600">
            Your order has been confirmed and your templates are ready to
            download.
          </p>

          <div className="pt-2">
            <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm text-neutral-500">
              <span>Order confirmed</span>
              <span aria-hidden="true">•</span>
              <span>Instant digital delivery</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 pt-4">
          <Link
            href="/account/downloads"
            className="
              group relative isolate
              inline-flex h-[56px] items-center justify-center gap-2 whitespace-nowrap
              overflow-hidden rounded-xl
              bg-black px-12 text-base font-semibold text-white
              shadow-[0_14px_30px_rgba(0,0,0,0.22)]
              ring-1 ring-black/10
              transition-all duration-300 ease-out
              hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(0,0,0,0.28)]
              active:scale-[0.98]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2
            "
          >
            <span
              aria-hidden="true"
              className="
                pointer-events-none absolute inset-0
                opacity-0 transition-opacity duration-300 group-hover:opacity-100
              "
            >
              <span
                className="
                  absolute -inset-x-24 -inset-y-8
                  translate-x-[-60%] rotate-12
                  bg-gradient-to-r from-transparent via-white/20 to-transparent
                  transition-transform duration-700 ease-out
                  group-hover:translate-x-[60%]
                "
              />
            </span>

            <span
              aria-hidden="true"
              className="
                absolute inset-0 -z-10
                bg-gradient-to-b from-neutral-800 to-black
                transition-colors duration-300
                group-hover:from-neutral-700 group-hover:to-black
              "
            />

            <Download className="h-5 w-5 text-white" />
            <span className="text-white">Access Your Downloads</span>
          </Link>

          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium text-neutral-500 transition-colors hover:text-black"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="space-y-2 pt-6 text-sm text-neutral-500">
          <p>A confirmation email has been sent to your registered address.</p>

          <p className="inline-flex items-center justify-center gap-1">
            <span>Need assistance?</span>
            <Link
              href="/contact"
              className="text-neutral-600 underline underline-offset-4 transition-colors hover:text-black"
            >
              Our support team is here to help.
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}