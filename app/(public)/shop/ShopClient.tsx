"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types/product";
import type { Category } from "@prisma/client";
import { ShopState } from "@/types/shop";

import ProductGrid from "@/components/product/ProductGrid";
import FilterSidebar from "@/components/shop/FilterSidebar";
import FilterDrawer from "@/components/shop/FilterDrawer";
import CategoryChips from "@/components/shop/CategoryChips";
import SearchInput from "@/components/shop/SearchInput";
import SortDropdown from "@/components/shop/SortDropdown";
import ShopEmptyState from "@/components/shop/ShopEmptyState";
import Button from "@/components/ui/Button";

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
  categories?: Category[];
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

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const visibleProducts = useMemo(() => {
    return safeProducts.filter((product) => {
      if (
        state.filters.search &&
        !product.title
          .toLowerCase()
          .includes(state.filters.search.toLowerCase())
      ) {
        return false;
      }

      if (
        state.filters.category &&
        product.category.slug !== state.filters.category
      ) {
        return false;
      }

      return true;
    });
  }, [safeProducts, state]);

  return (
    <section className="space-y-14">
      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">
          Shop
        </h1>
        <p className="text-sm text-muted">
          {visibleProducts.length} premium digital product
          {visibleProducts.length !== 1 && "s"} available
        </p>
      </header>

      {/* Search + sort */}
      <div className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={state.filters.search}
          onChange={(search) =>
            setState((s) => ({
              ...s,
              filters: { ...s.filters, search },
            }))
          }
        />

        <SortDropdown
          value={state.sort}
          onChange={(sort) =>
            setState((s) => ({
              ...s,
              sort,
            }))
          }
        />
      </div>

      {/* Mobile filters */}
      <div className="lg:hidden">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => setMobileFiltersOpen(true)}
        >
          Filter products
        </Button>
      </div>

      {/* Categories */}
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

      {/* Main content */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <FilterSidebar
              filters={state.filters}
              onChange={(filters) =>
                setState((s) => ({ ...s, filters }))
              }
            />
          </div>
        </aside>

        {/* Products */}
        <section>
          {visibleProducts.length === 0 ? (
            <ShopEmptyState
              onReset={() => setState(INITIAL_STATE)}
            />
          ) : (
            <ProductGrid products={visibleProducts} />
          )}
        </section>
      </div>

      {/* Mobile drawer */}
      <FilterDrawer
        open={mobileFiltersOpen}
        filters={state.filters}
        onClose={() => setMobileFiltersOpen(false)}
        onChange={(filters) =>
          setState((s) => ({ ...s, filters }))
        }
      />
    </section>
  );
}
