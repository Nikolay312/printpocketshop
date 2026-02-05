import { categories } from "@/mock/categories";

export default function AdminCategoriesPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Categories</h1>
        <p className="text-gray-500">
          Manage product categories used in the shop.
        </p>
      </div>

      {/* List */}
      <div className="rounded-2xl border divide-y">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between px-5 py-4"
          >
            <div>
              <p className="font-medium">{cat.name}</p>
              <p className="text-sm text-gray-400">
                /{cat.slug}
              </p>
            </div>

            <span className="text-xs rounded-full bg-gray-100 px-3 py-1">
              static
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
