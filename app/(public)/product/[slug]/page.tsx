export const runtime = "nodejs";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/api";
import ProductClient from "./ProductClient";

/* =========================
   TYPES
========================= */

type RouteParams = {
  slug: string;
};

type Props = {
  params: Promise<RouteParams>;
};

/* =========================
   HELPERS
========================= */

const SITE_URL = "https://printpocketshop.com";

function toAbsoluteUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${SITE_URL}${url}`;
}

/* =========================
   SEO
========================= */

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | PrintPocketShop",
      description: "The requested product could not be found.",
    };
  }

  const image =
    product.previewImages?.length > 0
      ? toAbsoluteUrl(product.previewImages[0])
      : undefined;

  const productUrl = `${SITE_URL}/product/${product.slug}`;

  return {
    title: `${product.title} | PrintPocketShop`,
    description: product.description,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      type: "website",
      url: productUrl,
      title: product.title,
      description: product.description,
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: product.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.description,
      images: image ? [image] : undefined,
    },
  };
}

/* =========================
   PAGE
========================= */

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const primaryImage =
    product.previewImages?.length > 0
      ? toAbsoluteUrl(product.previewImages[0])
      : undefined;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: primaryImage ? [primaryImage] : undefined,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "PrintPocketShop",
    },
    category: product.format,
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency ?? "EUR",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/product/${product.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <ProductClient product={product} />
    </>
  );
}