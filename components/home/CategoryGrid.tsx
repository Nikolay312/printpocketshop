import Link from "next/link";
import { categories } from "@/mock/categories";

export default function CategoryGrid() {
  return (
    <div className="mx-auto max-w-6xl space-y-16 text-center">
      <div className="space-y-3">
        <h2 className="text-3xl font-semibold">
          Shop by category
        </h2>
        <p className="text-muted">
          Find the perfect template for your needs
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/shop?category=${category.slug}`}
            className="group rounded-2xl border border-border bg-white p-6 text-center transition hover:-translate-y-1 hover:shadow-md"
          >
            <h3 className="font-semibold">{category.name}</h3>
            <p className="mt-2 text-sm text-muted">
              Professionally designed templates
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
