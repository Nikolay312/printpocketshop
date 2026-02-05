import { SortOption } from "@/types/shop";

interface Props {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export default function SortDropdown({ value, onChange }: Props) {
  return (
    <div className="relative inline-block min-w-[220px]">
      {/* Label */}
      <span
        className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-xs font-medium text-muted"
        aria-hidden
      >
        Sort
      </span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="
          w-full appearance-none rounded-md
          border border-border bg-background
          pl-14 pr-10 py-2.5
          text-sm font-medium text-foreground
          transition
          hover:bg-surface
          focus:outline-none focus:border-[var(--accent)] focus-visible:shadow-[var(--ring)]
        "
        aria-label="Sort products"
      >
        <option value="newest">Newest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="popular">Most Popular</option>
      </select>

      {/* Chevron */}
      <span
        className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted"
        aria-hidden
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </div>
  );
}
