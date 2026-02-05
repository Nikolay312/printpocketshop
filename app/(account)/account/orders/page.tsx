import { redirect } from "next/navigation";

import { getCurrentUserId } from "@/lib/auth.server";
import { getOrdersForUser } from "@/lib/orders.server";
import OrdersList from "@/components/account/OrdersList";
import Link from "next/link";

export default async function OrdersPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const orders = await getOrdersForUser(userId);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 space-y-8">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">
          My orders
        </h1>
        <p className="text-sm text-muted">
          View your past purchases and order details.
        </p>
      </header>

      {/* Content */}
      {orders.length === 0 ? (
        <div className="card-soft space-y-4 p-6">
          <p className="text-sm text-muted">
            You haven’t placed any orders yet.
          </p>

          <p className="text-sm text-muted">
            Once you complete a purchase, your orders will appear here for
            lifetime access.
          </p>

          <Link href="/shop" className="btn-primary w-fit">
            Browse products
          </Link>
        </div>
      ) : (
        <OrdersList orders={orders} />
      )}
    </main>
  );
}
