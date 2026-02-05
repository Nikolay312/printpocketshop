// lib/shopUtils.ts
import type { Product } from "@/types/product";
import type { ShopState } from "@/types/shop";

export function applyShopLogic(
  products: Product[],
  state: ShopState
): Product[] {
  let result = [...products];
  const { filters, sort } = state;

  /* 🔍 Search */
  if (filters.search.trim()) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  /* 🏷 Category */
  if (filters.category) {
    result = result.filter(
      (p) => p.category.slug === filters.category
    );
  }

  /* 💰 Price */
  const min = filters.priceMin;
  if (min !== null) {
    result = result.filter((p) => p.price >= min);
  }

  const max = filters.priceMax;
  if (max !== null) {
    result = result.filter((p) => p.price <= max);
  }

  /* ↕ Sorting */
  switch (sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;

    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;

    case "popular":
      result.sort((a, b) => b.sales - a.sales);
      break;

    case "newest":
    default:
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
  }

  return result;
}
