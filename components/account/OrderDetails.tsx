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
      <header className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
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

      <section className="space-y-8">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Items in this order
          </h3>
          <p className="text-sm text-muted">
            Download purchased files or review product details below.
          </p>
        </div>

        <div className="divide-y divide-border border border-border bg-background shadow-[0_1px_0_rgba(0,0,0,0.04)]">
          {order.items.map((item: Order["items"][number]) => (
            <div
              key={item.product.id}
              className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between"
            >
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

              <div className="flex flex-col gap-3 sm:items-end">
                <p className="font-semibold text-foreground">
                  {formatPrice(item.product.price * item.quantity)}
                </p>

                <Link
                  href="/account/downloads"
                  className="inline-flex items-center text-sm font-medium text-accent transition-colors hover:text-accent-hover"
                >
                  View downloads
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border pt-8">
        <div className="flex items-center justify-between text-base font-semibold text-foreground sm:text-lg">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </section>

      <div>
        <Link
          href="/account/orders"
          className="inline-flex items-center text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          ← Back to orders
        </Link>
      </div>
    </div>
  );
}