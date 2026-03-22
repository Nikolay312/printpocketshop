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
    <div className="mx-auto w-full max-w-5xl space-y-6 sm:space-y-8">
      <section className="rounded-3xl bg-card p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] sm:p-6 lg:p-8">
        {orders.length === 0 ? (
          <div className="mx-auto flex max-w-xl flex-col items-start justify-center py-6 sm:py-10">

            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Your order history will appear here
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-[15px]">
              Once you complete a purchase, your orders will be listed here for
              quick access on mobile and desktop.
            </p>

            <div className="mt-6">
              <Link
                href="/shop"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition-transform duration-200 hover:-translate-y-0.5 sm:px-6"
              >
                Browse templates
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-5 sm:space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Order history
                </div>
                <h2 className="mt-3 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  {orders.length} {orders.length === 1 ? "order" : "orders"}
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Access your completed purchases, invoices, and related details.
                </p>
              </div>
            </div>

            <OrdersList orders={orders} />

            <div className="rounded-2xl bg-muted/40 px-4 py-4 sm:px-5">
              <p className="text-sm leading-6 text-muted-foreground">
                Invoices are attached to each completed order and can be accessed
                directly from the order details view.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}