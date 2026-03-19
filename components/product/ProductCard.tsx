"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/formatPrice";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const imageSrc =
    product.previewImages && product.previewImages.length > 0
      ? product.previewImages[0]
      : null;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="
        group block h-full rounded-[24px]
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-neutral-900/15
        focus-visible:ring-offset-4
      "
      aria-label={`View product: ${product.title}`}
    >
      <article
        className="
          flex h-full flex-col
          rounded-[24px]
          transition-all duration-300 ease-out
          group-hover:-translate-y-1
        "
      >
        <div
          className="
            relative aspect-[4/3] overflow-hidden rounded-[24px]
            bg-neutral-100
            shadow-[0_1px_2px_rgba(0,0,0,0.04)]
            transition-shadow duration-300 ease-out
            group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]
          "
        >
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={product.title}
              fill
              className="
                object-cover
                transition-transform duration-700 ease-out
                group-hover:scale-[1.035]
              "
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-neutral-400">
              No preview available
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {product.isFeatured && (
            <span
              className="
                absolute left-4 top-4
                inline-flex items-center
                rounded-full
                bg-white/92 px-4 py-2
                text-[10px] font-semibold uppercase tracking-[0.18em]
                text-neutral-900
                shadow-sm backdrop-blur-md
              "
            >
              Featured
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col pt-5">
          <h3
            className="
              max-w-[22ch]
              line-clamp-2
              text-[15px] font-semibold leading-[1.32]
              tracking-[-0.01em] text-neutral-900
              transition-colors duration-200
              group-hover:text-neutral-700
            "
          >
            {product.title}
          </h3>

          <p className="mt-2.5 line-clamp-2 max-w-[30ch] text-[14px] leading-6 text-neutral-500">
            {product.description}
          </p>

          <div className="mt-auto pt-6">
            <div
              className="
                inline-flex items-center rounded-2xl
                border border-neutral-200/80
                bg-white px-4 py-2.5
                shadow-[0_1px_2px_rgba(0,0,0,0.03)]
                transition-all duration-300
                group-hover:border-neutral-300
                group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.05)]
              "
            >
              <span
                className="
                  text-[22px] font-semibold leading-none
                  tracking-[-0.03em] tabular-nums text-neutral-900
                "
              >
                {formatPrice(product.price, product.currency)}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}