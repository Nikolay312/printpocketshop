import "server-only";
import { prisma } from "@/lib/prisma";

type Currency = "EUR" | "USD" | "BGN";
type ProductFormat = "PDF" | "PNG" | "JPG" | "CANVA";
type ProductStatus = "DRAFT" | "PUBLISHED";

type Category = {
  id: string;
  name: string;
  slug: string;
};

/* =========================
   ADMIN PRODUCTS LIST
========================= */

export type AdminProductRow = {
  id: string;
  title: string;
  price: number;
  currency: Currency;
  status: ProductStatus;
  format: ProductFormat;
  category: {
    name: string;
  };
  createdAt: string;
};

export async function getAdminProducts(): Promise<AdminProductRow[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      price: true,
      currency: true,
      status: true,
      format: true,
      createdAt: true,
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  return products.map((p: (typeof products)[number]) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    currency: p.currency as Currency,
    status: p.status as ProductStatus,
    format: p.format as ProductFormat,
    category: p.category,
    createdAt: p.createdAt.toISOString(),
  }));
}

/* =========================
   ADMIN CATEGORIES
========================= */

export async function getAdminCategories(): Promise<
  Pick<Category, "id" | "name">[]
> {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });
}

/* =========================
   ADMIN PRODUCT (EDIT)
========================= */

export async function getAdminProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      format: true,
      status: true,

      files: {
        select: {
          id: true,
          fileKey: true,
          label: true,
        },
      },

      previewImages: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          fileKey: true,
          order: true,
        },
      },

      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!product) return null;

  return {
    ...product,
    previewImages: product.previewImages.map(
      (img: (typeof product.previewImages)[number]) => img.fileKey
    ),
    files: product.files.map(
      (file: (typeof product.files)[number]) => file.fileKey
    ),
  };
}