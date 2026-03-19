import Link from "next/link";
import Image from "next/image";
import type { Order } from "@/types/order";
import { formatPrice } from "@/lib/formatPrice";

type Props = {
  order: Order;
};

export default function OrderDetails({ order }: Props) {
  return (
    <div className="space-y-14">
      {/* ================= HEADER ================= */}
      <header className="space-y-3">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Order #{order.id.slice(0, 8)}
        </h2>

        <p className="text-sm text-muted">
          Placed on{" "}
          {new Date(order.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </header>

      {/* ================= ITEMS ================= */}
      <section className="space-y-8">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Items in this order
          </h3>
          <p className="text-sm text-muted">
            Download purchased files or review product details below.
          </p>
        </div>

        <div className="border border-border bg-background divide-y divide-border shadow-[0_1px_0_rgba(0,0,0,0.04)]">
          {order.items.map((item) => (
            <div
              key={item.product.id}
              className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-24 shrink-0 overflow-hidden bg-surface">
                  <Image
                    src={item.product.previewImages[0]}
                    alt={item.product.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-1.5">
                  <p className="font-medium text-foreground">
                    {item.product.title}
                  </p>

                  <p className="text-sm text-muted">
                    {item.product.format} · {item.product.license} license
                  </p>

                  <p className="text-xs text-muted">
                    Quantity: {item.quantity}
                  </p>
                </div>
              </div>

              {/* Price + Download */}
              <div className="flex flex-col gap-3 sm:items-end">
                <p className="font-semibold text-foreground">
                  {formatPrice(
                    item.product.price * item.quantity
                  )}
                </p>

                {item.product.fileUrl && (
                  <a
                    href={item.product.fileUrl}
                    download
                    className="inline-flex items-center text-sm font-medium text-accent hover:text-accent-hover transition-colors"
                  >
                    Download file
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TOTAL ================= */}
      <section className="border-t border-border pt-8">
        <div className="flex items-center justify-between text-base sm:text-lg font-semibold text-foreground">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </section>

      {/* ================= BACK LINK ================= */}
      <div>
        <Link
          href="/account/orders"
          className="inline-flex items-center text-sm font-medium text-muted hover:text-foreground transition-colors"
        >
          ← Back to orders
        </Link>
      </div>
    </div>
  );
}
