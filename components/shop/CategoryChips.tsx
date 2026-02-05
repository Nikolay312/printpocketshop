interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  categories: Category[];
  active: string | null;
  onChange: (category: string | null) => void;
}

export default function CategoryChips({
  categories,
  active,
  onChange,
}: Props) {
  const baseChip =
    "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:shadow-[var(--ring)]";

  const activeChip =
    "bg-[var(--accent)] text-white shadow-sm";

  const inactiveChip =
    "bg-surface text-foreground hover:bg-surface-muted";

  return (
    <div className="relative">
      <div className="overflow-x-auto">
        <div className="flex w-max gap-3 py-1">
          {/* All */}
          <button
            type="button"
            onClick={() => onChange(null)}
            className={`${baseChip} ${
              active === null ? activeChip : inactiveChip
            }`}
          >
            All
          </button>

          {categories.map((category) => {
            const isActive = active === category.slug;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onChange(category.slug)}
                className={`${baseChip} ${
                  isActive ? activeChip : inactiveChip
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
