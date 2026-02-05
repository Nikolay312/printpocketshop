import Link from "next/link";
import { getAdminProducts } from "@/lib/admin.products.server";
import { formatPrice } from "@/lib/formatPrice";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-gray-500">Manage your digital products.</p>
        </div>

        <Link
          href="/admin/products/new"
          className="rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          + New product
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-2xl border divide-y">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between px-5 py-4"
          >
            <div>
              <p className="font-medium">{product.title}</p>
              <p className="text-sm text-gray-400">
                {product.category.name} · {product.format}
              </p>

              <span
                className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs
                  ${
                    product.status === "PUBLISHED"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }
                `}
              >
                {product.status}
              </span>
            </div>

            <div className="flex items-center gap-6">
              <span className="font-semibold">
                {formatPrice(product.price)}
              </span>

              <Link
                href={`/admin/products/${product.id}/edit`}
                className="text-sm underline"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="px-6 py-10 text-center text-gray-500">
            No products yet.
          </div>
        )}
      </div>
    </main>
  );
}
