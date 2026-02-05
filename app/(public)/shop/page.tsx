export const runtime = "nodejs";

import type { Metadata } from "next";
import ShopClient from "./ShopClient";
import { getAllCategories, getProductsForShop } from "@/lib/api";

export const metadata: Metadata = {
  title: "Shop Digital Products | PrintPocketShop",
  description:
    "Browse premium digital templates and printables. Instant download, lifetime access, and professional quality.",
};

type Props = {
  searchParams: {
    category?: string;
  };
};

export default async function ShopPage({ searchParams }: Props) {
  const category = searchParams?.category ?? undefined;

  const [products, categories] = await Promise.all([
    getProductsForShop(category),
    getAllCategories(),
  ]);

  return (
    <main className="container-app py-20">
      <ShopClient
        products={products}
        categories={categories}
        activeCategory={category ?? null}
      />
    </main>
  );
}
