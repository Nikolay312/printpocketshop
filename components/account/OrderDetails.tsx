import Link from "next/link";
import Image from "next/image";
import type { Order } from "@/types/order";
import { formatPrice } from "@/lib/formatPrice";

type Props = {
  order: Order;
};

export default function OrderDetails({ order }: Props) {
  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">
          Order #{order.id.slice(0, 8)}
        </h1>
        <p className="text-sm text-muted">
          Placed on{" "}
          {new Date(order.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </header>

      {/* Items */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          Items in this order
        </h2>

        <div className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.product.id}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              {/* Product info */}
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-surface">
                  <Image
                    src={item.product.previewImages[0]}
                    alt={item.product.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-0.5">
                  <p className="font-medium text-foreground">
                    {item.product.title}
                  </p>

                  <p className="text-sm text-muted">
                    {item.product.format} ·{" "}
                    {item.product.license} license
                  </p>

                  <p className="text-xs text-muted">
                    Quantity: {item.quantity}
                  </p>
                </div>
              </div>

              {/* Price + download */}
              <div className="flex flex-col items-start gap-2 sm:items-end">
                <p className="font-semibold text-foreground">
                  {formatPrice(
                    item.product.price * item.quantity
                  )}
                </p>

                {item.product.fileUrl && (
                  <a
                    href={item.product.fileUrl}
                    download
                    className="text-sm text-[var(--accent)] underline underline-offset-4"
                  >
                    Download file
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Total */}
      <div className="flex justify-between border-t border-border pt-6 text-lg font-semibold">
        <span>Total</span>
        <span>{formatPrice(order.total)}</span>
      </div>

      {/* Back */}
      <Link
        href="/account/orders"
        className="inline-block text-sm text-muted hover:underline underline-offset-4"
      >
        ← Back to orders
      </Link>
    </div>
  );
}
