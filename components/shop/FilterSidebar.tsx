import { ShopFilters } from "@/types/shop";

interface Props {
  filters: ShopFilters;
  onChange: (filters: ShopFilters) => void;
}

export default function FilterSidebar({ filters, onChange }: Props) {
  return (
    <aside className="card space-y-6 p-6">
      {/* Header */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground">
          Filters
        </h3>
        <p className="text-xs text-muted">
          Refine your results
        </p>
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
    </aside>
  );
}
