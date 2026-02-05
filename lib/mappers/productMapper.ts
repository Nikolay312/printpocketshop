import type { Product } from "@/types/product";
import type {
  Product as DbProduct,
  Category,
} from "@prisma/client";

/* =========================
   INTERNAL DB SHAPES
========================= */

// Minimal tag shape (Prisma-safe)
type DbTag = {
  name: string;
};

type DbProductWithRelations = DbProduct & {
  category: Category;
  tags?: DbTag[];
};

/* =========================
   HELPERS
========================= */

function normalizePreviewImages(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

/* =========================
   MAPPER
========================= */

export function mapDbProductToProduct(
  p: DbProductWithRelations
): Product {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,

    previewImages: normalizePreviewImages(p.previewImages),

    fileUrl: p.fileKey
      ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${p.fileKey}`
      : undefined,

    price: p.price,
    currency: p.currency,

    category: {
      id: p.category.id,
      slug: p.category.slug,
      name: p.category.name,
    },

    tags: p.tags?.map((t) => t.name) ?? [],

    format: p.format,
    license: p.license,
    isFeatured: p.isFeatured,
    sales: p.sales,

    createdAt: p.createdAt.toISOString(),
  };
}