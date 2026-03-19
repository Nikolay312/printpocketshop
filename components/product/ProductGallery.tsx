"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  images: string[];
  title: string;
}

export default function ProductGallery({ images, title }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () =>
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));

  const next = () =>
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] rounded-3xl bg-neutral-100" />
    );
  }

  return (
    <div className="space-y-10">
      {/* ===== MAIN IMAGE ===== */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-neutral-50">
        {images.map((img, index) => (
          <Image
            key={img}
            src={img}
            alt={title}
            fill
            priority={index === activeIndex}
            className={clsx(
              "object-cover transition-opacity duration-200",
              index === activeIndex ? "opacity-100" : "opacity-0"
            )}
          />
        ))}

        {/* ARROWS */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="
                absolute left-6 top-1/2 -translate-y-1/2
                h-10 w-10
                flex items-center justify-center
                rounded-full
                text-neutral-700
                bg-white/60
                backdrop-blur-sm
                transition-all duration-300
                hover:bg-white/90
              "
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={next}
              aria-label="Next image"
              className="
                absolute right-6 top-1/2 -translate-y-1/2
                h-10 w-10
                flex items-center justify-center
                rounded-full
                text-neutral-700
                bg-white/60
                backdrop-blur-sm
                transition-all duration-300
                hover:bg-white/90
              "
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* ===== THUMBNAILS ===== */}
      {images.length > 1 && (
        <div className="flex gap-5 overflow-x-auto pb-1">
          {images.map((img, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                aria-label={`View image ${index + 1}`}
                className={clsx(
                  "relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl transition-opacity duration-300",
                  isActive
                    ? "opacity-100"
                    : "opacity-60 hover:opacity-100"
                )}
              >
                <Image
                  src={img}
                  alt={`${title} preview ${index + 1}`}
                  fill
                  className="object-cover"
                />

                {isActive && (
                  <span className="absolute inset-0 rounded-2xl ring-1 ring-neutral-900/10" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}