import Link from "next/link";
import { getAllOrdersForAdmin } from "@/lib/admin.server";
import { formatPrice } from "@/lib/formatPrice";

export default async function AdminOrdersPage() {
  const orders = await getAllOrdersForAdmin();

  return (
    <div className="space-y-24">
      <section className="rounded-3xl border border-border bg-background shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="px-16 py-16">
          {orders.length === 0 ? (
            <div className="py-20 text-center text-muted">
              No orders found.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="block py-8 transition hover:bg-muted/20"
                >
                  <div className="flex items-center justify-between">
                    {/* Left */}
                    <div className="space-y-2">
                      <div className="text-base font-medium text-foreground">
                        Order #{order.id.slice(0, 8)}
                      </div>

                      <div className="text-sm text-muted">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>

                      <div className="text-xs text-muted">
                        {order.user.email}
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-8">
                      <span className="text-base font-semibold text-foreground">
                        {formatPrice(order.total)}
                      </span>

                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          order.status === "PAID"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-yellow-500/10 text-yellow-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
