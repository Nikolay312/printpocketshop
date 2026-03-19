"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types/product";
import type { ShopState } from "@/types/shop";

import ProductGrid from "@/components/product/ProductGrid";
import CategoryChips from "@/components/shop/CategoryChips";
import ShopEmptyState from "@/components/shop/ShopEmptyState";

type ShopCategory = {
  id: string;
  name: string;
  slug: string;
};

const INITIAL_STATE: ShopState = {
  filters: {
    category: null,
    priceMin: null,
    priceMax: null,
    search: "",
  },
  sort: "newest",
};

interface Props {
  products?: Product[];
  categories?: ShopCategory[];
  activeCategory?: string | null;
}

export default function ShopClient({
  products,
  categories,
  activeCategory,
}: Props) {
  const safeProducts = products ?? [];
  const safeCategories = categories ?? [];

  const [state, setState] = useState<ShopState>({
    ...INITIAL_STATE,
    filters: {
      ...INITIAL_STATE.filters,
      category: activeCategory ?? null,
    },
  });

  const visibleProducts = useMemo(() => {
    return safeProducts.filter((product) => {
      if (
        state.filters.category &&
        product.category.slug !== state.filters.category
      ) {
        return false;
      }

      return true;
    });
  }, [safeProducts, state.filters.category]);

  const animationKey = state.filters.category ?? "all";

  return (
    <section className="bg-white">

{/* ================= Category Band ================= */}
{safeCategories.length > 0 && (
  <div className="bg-neutral-50/60 backdrop-blur-sm border-b border-neutral-100">
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="flex justify-center">
        <CategoryChips
          categories={safeCategories}
          active={state.filters.category}
          onChange={(category) =>
            setState((s) => ({
              ...s,
              filters: { ...s.filters, category },
            }))
          }
        />
      </div>
    </div>
  </div>
)}

  {/* ================= Products Section ================= */}
  <div className="relative">
    <div className="mx-auto max-w-6xl px-6 pt-14 pb-28">

      <div
        key={animationKey}
        className="transition-opacity duration-200 ease-out"
      >
        {visibleProducts.length === 0 ? (
          <div className="py-24">
            <ShopEmptyState
              onReset={() => setState(INITIAL_STATE)}
            />
          </div>
        ) : (
          <ProductGrid products={visibleProducts} />
        )}
      </div>

    </div>
  </div>
    </section>
  );
}
