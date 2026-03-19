import type { Product } from "@/types/product";
import type {
  Product as DbProduct,
  Category,
  ProductFile,
  ProductImage,
} from "@prisma/client";

/* =========================
   INTERNAL DB SHAPES
========================= */

type DbTag = {
  name: string;
};

type DbProductWithRelations = DbProduct & {
  category: Category;
  tags?: DbTag[];
  files?: ProductFile[];
  previewImages?: ProductImage[];
};

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

    // ✅ FIXED: relational preview images
    previewImages:
      p.previewImages?.map((img) => img.fileKey) ?? [],

    // ✅ multi-file support
    files:
      p.files?.map((f) => ({
        id: f.id,
        label: f.label ?? null,
      })) ?? [],

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