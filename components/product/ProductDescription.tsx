"use client";

import type { Product } from "@/types/product";

type Props = {
  product: Product;
};

export default function ProductDescription({ product }: Props) {
  const description = product.description ?? "";

  const lines = description
    .split("\n")
    .map((line) => line.replace(/\r/g, ""));

  const firstContentIndex = lines.findIndex(
    (line) => line.trim() !== ""
  );

  return (
    <section className="space-y-12">
      <div className="max-w-xl text-[17px] leading-[1.85] text-neutral-700 space-y-5">
        {lines.map((line, index) => {
          const trimmed = line.trim();

          // Empty line = spacing
          if (!trimmed) {
            return <div key={index} className="h-4" />;
          }

          // FIRST CONTENT LINE = HERO TITLE
          if (index === firstContentIndex) {
            return (
              <h2
                key={index}
                className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 leading-[1.15]"
              >
                {trimmed}
              </h2>
            );
          }

          // Bullet line
          if (trimmed.startsWith("•")) {
            return (
              <div key={index} className="flex gap-3 pl-2">
                <span className="mt-[8px] h-1.5 w-1.5 rounded-full bg-neutral-500 shrink-0" />
                <span>{trimmed.replace(/^•\s*/, "")}</span>
              </div>
            );
          }

          // Section header (emoji + uppercase line)
          if (
            /^[^\w]*[A-Z0-9\s’']+$/.test(trimmed) &&
            trimmed.length < 60
          ) {
            return (
              <h3
                key={index}
                className="pt-10 text-2xl font-semibold tracking-tight text-neutral-900"
              >
                {trimmed}
              </h3>
            );
          }

          // Normal paragraph
          return <p key={index}>{trimmed}</p>;
        })}
      </div>
    </section>
  );
}