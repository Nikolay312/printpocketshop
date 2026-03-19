import Link from "next/link";
import type { Order } from "@/types/order";
import { formatPrice } from "@/lib/formatPrice";
import { formatDate } from "@/lib/formatDate";

type Props = {
  orders: Order[];
};

function StatusBadge({ status }: { status: Order["status"] }) {
  const statusStyles: Record<Order["status"], string> = {
    PAID: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    REFUNDED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    EXPIRED: "bg-muted text-muted-foreground border-border",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

export default function OrdersList({ orders }: Props) {
  if (orders.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-background p-12 text-center shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="mx-auto max-w-md space-y-3">
          <p className="text-lg font-semibold tracking-tight text-foreground">
            No orders available
          </p>

          <p className="text-sm leading-relaxed text-muted">
            Completed purchases will appear here for lifetime reference.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link
          key={order.id}
          href="/account/downloads"
          className="group block rounded-2xl border border-border bg-background p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/10 hover:shadow-xl"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            {/* LEFT SIDE */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <p className="text-base font-semibold text-foreground">
                  Order #{order.id.slice(0, 8)}
                </p>

                <StatusBadge status={order.status} />
              </div>

              <p className="text-sm text-muted">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center justify-between sm:justify-end sm:gap-10">
              <p className="text-sm text-muted">
                {order.items.length} item
                {order.items.length !== 1 && "s"}
              </p>

              <p className="text-lg font-semibold text-foreground">
                {formatPrice(order.total)}
              </p>
            </div>

          </div>
        </Link>
      ))}
    </div>
  );
}