import Link from "next/link";
import { getAllOrdersForAdmin } from "@/lib/admin.server";
import { formatPrice } from "@/lib/formatPrice";

export default async function AdminOrdersPage() {
  const orders = await getAllOrdersForAdmin();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-gray-500">
          Overview of all customer orders.
        </p>
      </div>

      {/* List */}
      <div className="rounded-2xl border divide-y">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/account/orders/${order.id}`}
            className="block px-5 py-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  Order #{order.id.slice(0, 8)}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-400">
                  {order.user.email}
                </p>
              </div>

              <div className="text-right space-y-1">
                <p className="font-semibold">
                  {formatPrice(order.total)}
                </p>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs
                    ${
                      order.status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }
                  `}
                >
                  {order.status}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
