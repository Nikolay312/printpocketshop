import { redirect } from "next/navigation";
import Link from "next/link";

import { getCurrentUserId } from "@/lib/auth.server";
import { getOrdersForUser } from "@/lib/orders.server";
import { formatPrice } from "@/lib/formatPrice";

export default async function AccountDashboardPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const orders = await getOrdersForUser(userId);

  const totalOrders = orders.length;
  const paidOrders = orders.filter((order) => order.status === "PAID");
  const totalSpent = paidOrders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="space-y-16">
      {/* ================= HEADER ================= */}
      <header className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Overview
        </h2>
        <p className="text-sm text-muted">
          A summary of your account activity.
        </p>
      </header>

      {/* ================= STATS ================= */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total orders"
          value={totalOrders.toString()}
        />

        <StatCard
          label="Completed"
          value={paidOrders.length.toString()}
        />

        <StatCard
          label="Total spent"
          value={formatPrice(totalSpent)}
          highlight
        />
      </section>

      {/* ================= QUICK ACTIONS ================= */}
      <section className="space-y-4">
        <h3 className="text-base font-semibold text-foreground">
          Quick access
        </h3>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <QuickCard href="/account/profile" label="Profile" />
          <QuickCard href="/account/orders" label="Orders" />
          <QuickCard href="/account/downloads" label="Downloads" />
          <QuickCard href="/account/settings" label="Settings" />
        </div>
      </section>

      {/* ================= RECENT ORDERS ================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">
            Recent orders
          </h3>

          {orders.length > 0 && (
            <Link
              href="/account/orders"
              className="text-sm font-medium text-accent hover:opacity-80"
            >
              View all →
            </Link>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <div className="divide-y divide-border rounded-xl border border-border bg-background/70 backdrop-blur-sm">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-4 p-6 transition hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    Order #{order.id.slice(0, 8)}
                  </p>

                  <p className="text-xs text-muted">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <StatusBadge status={order.status} />

                  <p className="text-sm font-semibold text-foreground">
                    {formatPrice(order.total)}
                  </p>

                  <Link
                    href={`/account/orders/${order.id}`}
                    className="text-sm font-medium text-accent hover:opacity-80"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* =============================== */
/* COMPONENTS */
/* =============================== */

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/70 p-6 backdrop-blur-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </p>

      <p
        className={`mt-2 text-3xl font-semibold tracking-tight ${
          highlight ? "text-accent" : "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function QuickCard({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-border bg-background/70 p-6 backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <p className="text-sm font-semibold text-foreground group-hover:text-accent">
        {label}
      </p>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium";

  if (status === "PAID") {
    return (
      <span className={`${base} bg-emerald-500/10 text-emerald-600`}>
        Paid
      </span>
    );
  }

  return (
    <span className={`${base} bg-amber-500/10 text-amber-600`}>
      Pending
    </span>
  );
}

function EmptyOrders() {
  return (
    <div className="rounded-xl border border-border bg-background/70 p-10 text-center backdrop-blur-sm">
      <p className="text-sm text-muted">
        You haven’t placed any orders yet.
      </p>

      <div className="pt-6">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center rounded-lg bg-accent px-8 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Browse templates
        </Link>
      </div>
    </div>
  );
}
