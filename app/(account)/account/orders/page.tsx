import { redirect } from "next/navigation";
import Link from "next/link";

import { getCurrentUserId } from "@/lib/auth.server";
import { getOrdersForUser } from "@/lib/orders.server";
import OrdersList from "@/components/account/OrdersList";

export default async function OrdersPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const orders = await getOrdersForUser(userId);

  return (
    <div className="space-y-24">

      {/* ================= ORDERS SURFACE ================= */}
      <section className="rounded-3xl border border-border bg-background shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="px-24 py-24">

          {orders.length === 0 ? (
            <div className="max-w-xl space-y-6">
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                No orders yet
              </h3>

              <p className="text-sm text-muted leading-relaxed">
                Once you complete a purchase, your orders will appear here.
              </p>

              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-2xl bg-foreground px-10 py-4 text-sm font-semibold text-background shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Browse templates
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-14">
              <OrdersList orders={orders} />

              <div className="rounded-2xl border border-border bg-muted/30 px-8 py-6 text-sm text-muted">
                Invoices are attached to each completed order and can be
                accessed directly from the order details view.
              </div>
            </div>
          )}

        </div>
      </section>

    </div>
  );
}
