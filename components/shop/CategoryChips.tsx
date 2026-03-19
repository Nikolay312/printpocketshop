"use client";

import { useEffect, useRef, useState } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ width: 0, left: 0 });

  const items = [{ id: "all", name: "All", slug: null }, ...categories];

  /* Sliding indicator */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const activeIndex = items.findIndex(
      (c) => c.slug === active || (c.slug === null && active === null)
    );

    const activeElement = container.children[
      activeIndex
    ] as HTMLElement | undefined;

    if (activeElement) {
      setIndicator({
        left: activeElement.offsetLeft,
        width: activeElement.offsetWidth,
      });
    }
  }, [active, categories]);

  return (
    <div className="w-full flex justify-center">
      <div className="relative">
        <div
          ref={containerRef}
          className="
            relative flex items-center
            gap-10
            border-b border-neutral-100
          "
        >
          {items.map((category) => {
            const isActive =
              active === category.slug ||
              (active === null && category.slug === null);

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onChange(category.slug)}
                className="
                  group
                  relative pb-4 px-2
                  text-base font-medium tracking-tight
                  transition-all duration-200
                  active:scale-[0.96]
                "
              >
                {/* subtle hover background */}
                <span
                  className="
                    absolute inset-0 -bottom-1
                    rounded-md
                    bg-neutral-100
                    opacity-0
                    transition-opacity duration-200
                    group-hover:opacity-60
                  "
                />

                <span
                  className={
                    isActive
                      ? "relative z-10 text-neutral-900"
                      : "relative z-10 text-neutral-500 group-hover:text-neutral-900"
                  }
                >
                  {category.name}
                </span>
              </button>
            );
          })}

          {/* Sliding Indicator */}
          <span
            className="
              absolute bottom-0
              h-[2.5px]
              bg-neutral-900
              transition-all duration-400 ease-out
            "
            style={{
              left: indicator.left,
              width: indicator.width,
            }}
          />
        </div>
      </div>
    </div>
  );
}
