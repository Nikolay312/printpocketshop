export const runtime = "nodejs";

import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/api";
import ProductClient from "./ProductClient";

/* =========================
   TYPES
========================= */

type Props = {
  params: {
    slug: string;
  };
};

/* =========================
   SEO
========================= */

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  return {
    title: `${product.title} | PrintPocketShop`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.previewImages.length
        ? [
            {
              url: product.previewImages[0],
              width: 1200,
              height: 630,
              alt: product.title,
            },
          ]
        : [],
    },
  };
}

/* =========================
   PAGE
========================= */

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);

  return <ProductClient product={product} />;
}
