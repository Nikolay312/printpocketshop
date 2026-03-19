export const runtime = "nodejs";

import type { Metadata } from "next";
import ShopClient from "./ShopClient";
import { getAllCategories, getProductsForShop } from "@/lib/api";

export const metadata: Metadata = {
  title: "Our Products | PrintPocketShop",
  description:
    "Browse our premium digital templates. Instant download. Lifetime access.",
};

type Props = {
  searchParams?: Promise<{
    category?: string;
  }>;
};

export default async function ShopPage({ searchParams }: Props) {
  const resolvedSearchParams = searchParams
    ? await searchParams
    : undefined;

  const category = resolvedSearchParams?.category ?? undefined;

  const [products, categories] = await Promise.all([
    getProductsForShop(category),
    getAllCategories(),
  ]);

  return (
    <main className="bg-[var(--bg)]">
  

      {/* ================= Shop Interface ================= */}
      <section className="w-full pb-32">
        <ShopClient
          products={products}
          categories={categories}
          activeCategory={category ?? null}
        />
      </section>
    </main>
  );
}
