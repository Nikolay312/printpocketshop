import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { getCurrentUserId } from "@/lib/auth.server";
import { getOrderForUser } from "@/lib/orders.server";
import { formatPrice } from "@/lib/formatPrice";

type Props = {
  params: {
    id: string;
  };
};

export default async function OrderDetailsPage({ params }: Props) {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const order = await getOrderForUser(userId, params.id);
  if (!order) notFound();

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 space-y-12">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">
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

        <span className="inline-flex w-fit items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          {order.status}
        </span>
      </header>

      {/* Items */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold">
          Items in this order
        </h2>

        <div className="space-y-4">
          {order.items.map((item) => {
            const images =
              (item.product.previewImages as string[] | null) ?? [];

            return (
              <div
                key={item.product.id}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-4 sm:flex-row"
              >
                {/* Image */}
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-surface">
                  <Image
                    src={images[0] ?? "/placeholder.png"}
                    alt={item.product.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 space-y-1">
                  <p className="font-medium">
                    {item.product.title}
                  </p>

                  <p className="text-sm text-muted">
                    {item.product.format} ·{" "}
                    {item.product.license}
                  </p>

                  <Link
                    href={`/api/download/${item.product.id}`}
                    className="inline-block text-sm text-[var(--accent)] underline underline-offset-4"
                  >
                    Download file
                  </Link>
                </div>

                {/* Price */}
                <div className="text-right font-semibold">
                  {formatPrice(
                    item.product.price * item.quantity
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Total */}
      <div className="flex justify-between border-t border-border pt-6 text-lg font-semibold">
        <span>Total</span>
        <span>{formatPrice(order.total)}</span>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/account/downloads"
          className="btn-primary"
        >
          Go to downloads
        </Link>

        <Link
          href="/shop"
          className="btn-ghost"
        >
          Continue shopping
        </Link>
      </div>
    </main>
  );
}
