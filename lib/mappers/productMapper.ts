import type { Product } from "@/types/product";

/* =========================
   LOCAL DB SHAPES (SAFE)
========================= */

type DbTag = {
  name: string;
};

type DbCategory = {
  id: string;
  slug: string;
  name: string;
};

type DbProductFile = {
  id: string;
  label?: string | null;
};

type DbProductImage = {
  fileKey: string;
};

type DbProductWithRelations = {
  id: string;
  title: string;
  slug: string;
  description: string;

  price: number;
  currency: Product["currency"];

  format: Product["format"];
  license: Product["license"];

  isFeatured: boolean;
  sales: number;

  createdAt: Date;

  category: DbCategory;
  tags?: DbTag[];
  files?: DbProductFile[];
  previewImages?: DbProductImage[];
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

    previewImages:
      p.previewImages?.map((img: DbProductImage) => img.fileKey) ?? [],

    files:
      p.files?.map((f: DbProductFile) => ({
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

    tags: p.tags?.map((t: DbTag) => t.name) ?? [],

    format: p.format,
    license: p.license,
    isFeatured: p.isFeatured,
    sales: p.sales,

    createdAt: p.createdAt.toISOString(),
  };
}