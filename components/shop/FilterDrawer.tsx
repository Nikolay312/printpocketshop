"use client";

import { ShopFilters } from "@/types/shop";

interface Props {
  open: boolean;
  filters: ShopFilters;
  onClose: () => void;
  onChange: (filters: ShopFilters) => void;
}

export default function FilterDrawer({
  open,
  filters,
  onClose,
  onChange,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filter products"
        className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-background shadow-2xl"
      >
        <div className="space-y-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground">
              Filters
            </h3>

            <button
              onClick={onClose}
              className="rounded-md px-2 py-1 text-sm text-muted transition hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:shadow-[var(--ring)]"
            >
              Close
            </button>
          </div>

          {/* Price */}
          <div className="space-y-3">
            <label className="text-xs font-medium text-foreground">
              Price range
            </label>

            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceMin ?? ""}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    priceMin: e.target.value
                      ? Number(e.target.value)
                      : null,
                  })
                }
                className="
                  w-full rounded-md border border-border bg-background
                  px-3 py-2 text-sm text-foreground
                  placeholder:text-muted
                  transition
                  focus:outline-none focus:border-[var(--accent)] focus-visible:shadow-[var(--ring)]
                "
                aria-label="Minimum price"
              />

              <input
                type="number"
                placeholder="Max"
                value={filters.priceMax ?? ""}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    priceMax: e.target.value
                      ? Number(e.target.value)
                      : null,
                  })
                }
                className="
                  w-full rounded-md border border-border bg-background
                  px-3 py-2 text-sm text-foreground
                  placeholder:text-muted
                  transition
                  focus:outline-none focus:border-[var(--accent)] focus-visible:shadow-[var(--ring)]
                "
                aria-label="Maximum price"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() =>
                onChange({
                  ...filters,
                  priceMin: null,
                  priceMax: null,
                })
              }
              className="flex-1 rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:bg-surface focus-visible:outline-none focus-visible:shadow-[var(--ring)]"
            >
              Clear
            </button>

            <button
              onClick={onClose}
              className="flex-1 btn-primary"
            >
              Apply filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
