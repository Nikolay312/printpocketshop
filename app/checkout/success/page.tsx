import Link from "next/link";
import { requireVerifiedUser } from "@/lib/auth.server";
import { getOrdersForUser } from "@/lib/orders.server";
import { formatPrice } from "@/lib/formatPrice";

export default async function CheckoutSuccessPage() {
  const userId = await requireVerifiedUser();
  const orders = await getOrdersForUser(userId);
  const latestOrder = orders.find((o) => o.status === "PAID");

  if (!latestOrder) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-28 text-center space-y-8">
        <h1 className="text-2xl font-semibold">
          Payment received
        </h1>
        <p className="text-muted">
          We’re finalizing your order. This usually takes just a few seconds.
        </p>
        <Link href="/account/orders" className="btn-primary">
          View my orders
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-28 text-center space-y-12">
      {/* Success icon */}
      <div
        aria-hidden
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent)] text-2xl text-white shadow-md"
      >
        ✓
      </div>

      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold">
          Payment successful
        </h1>
        <p className="mx-auto max-w-xl text-muted">
          Thank you for your purchase. Your digital products are now available
          for download.
        </p>
      </header>

      {/* Order summary */}
      <section className="card space-y-4 p-6 text-left text-sm">
        <p className="text-muted">
          <strong className="text-foreground">Order ID:</strong>{" "}
          {latestOrder.id}
        </p>

        <ul className="space-y-2">
          {latestOrder.items.map((item, idx) => (
            <li
              key={idx}
              className="flex justify-between gap-4"
            >
              <span className="text-muted">
                {item.product.title} × {item.quantity}
              </span>
              <span className="font-medium">
                {formatPrice(item.product.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex justify-between border-t border-border pt-3 font-semibold">
          <span>Total</span>
          <span>{formatPrice(latestOrder.total)}</span>
        </div>
      </section>

      {/* Primary actions */}
      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <Link href="/account/downloads" className="btn-primary">
          Go to downloads
        </Link>

        <Link
          href={`/account/orders/${latestOrder.id}`}
          className="btn-ghost"
        >
          View order details
        </Link>
      </div>

      {/* Secondary */}
      <p>
        <Link
          href="/shop"
          className="text-sm text-muted hover:underline underline-offset-4"
        >
          Continue shopping
        </Link>
      </p>
    </main>
  );
}
