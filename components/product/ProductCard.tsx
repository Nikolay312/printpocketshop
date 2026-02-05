"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/formatPrice";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block rounded-2xl focus-visible:shadow-[var(--ring)]"
    >
      <article className="card overflow-hidden transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-surface">
          <Image
            src={product.previewImages[0]}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
          />

          {/* Featured badge */}
          {product.isFeatured && (
            <span className="absolute left-3 top-3 rounded-full bg-background/90 backdrop-blur px-3 py-1 text-xs font-semibold shadow-sm">
              Featured
            </span>
          )}

          {/* Hover overlay */}
          <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/5" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3 p-5">
          {/* Title + price */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
              {product.title}
            </h3>

            <span className="shrink-0 text-sm font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Description */}
          <p className="line-clamp-2 text-sm text-muted">
            {product.description}
          </p>

          {/* Meta */}
          <div className="mt-2 flex items-center justify-between">
            <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-muted">
              {product.format}
            </span>

            <span className="text-sm font-medium text-[var(--accent)] opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100">
              View details →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
