import Link from "next/link";
import type { Order } from "@/types/order";
import { formatPrice } from "@/lib/formatPrice";
import { formatDate } from "@/lib/formatDate";

type Props = {
  orders: Order[];
};

function StatusBadge({ status }: { status: Order["status"] }) {
  const styles =
    status === "PAID"
      ? "bg-green-100 text-green-700"
      : status === "PENDING"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize ${styles}`}
    >
      {status.toLowerCase()}
    </span>
  );
}

export default function OrdersList({ orders }: Props) {
  if (orders.length === 0) {
    return (
      <div className="card-soft p-8 text-center text-sm text-muted">
        You haven’t placed any orders yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/account/orders/${order.id}`}
          className="group block rounded-2xl border border-border bg-background p-5 transition hover:border-foreground/20 hover:shadow-sm"
        >
          {/* Top */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="font-semibold text-foreground">
                Order #{order.id.slice(0, 8)}
              </p>
              <p className="text-sm text-muted">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>

            <StatusBadge status={order.status} />
          </div>

          <div className="my-4 h-px bg-border" />

          {/* Bottom */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">
              {order.items.length} item
              {order.items.length !== 1 && "s"}
            </p>

            <p className="font-semibold text-foreground">
              {formatPrice(order.total)}
            </p>
          </div>

          <p className="mt-3 text-xs text-muted opacity-0 transition group-hover:opacity-100">
            View order details →
          </p>
        </Link>
      ))}
    </div>
  );
}
