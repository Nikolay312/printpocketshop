"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";

interface Props {
  images: string[];
  title: string;
}

export default function ProductGallery({ images, title }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] rounded-2xl bg-surface" />
    );
  }

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface">
        <Image
          src={images[activeIndex]}
          alt={title}
          fill
          priority
          className="object-cover transition-transform duration-300 ease-out"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View image ${index + 1}`}
                className={clsx(
                  "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border transition-all",
                  isActive
                    ? "border-foreground shadow-sm"
                    : "border-border hover:border-foreground/40"
                )}
              >
                <Image
                  src={img}
                  alt={`${title} preview ${index + 1}`}
                  fill
                  className="object-cover"
                />

                {/* Active overlay */}
                {isActive && (
                  <span className="pointer-events-none absolute inset-0 ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-background rounded-xl" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
