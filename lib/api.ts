import "server-only";

import { prisma } from "@/lib/prisma";
import { mapDbProductToProduct } from "@/lib/mappers/productMapper";
import type { Product } from "@/types/product";
import { notFound } from "next/navigation";

/* =========================
   PRODUCTS (SERVER)
========================= */

// ✅ Public-safe: only PUBLISHED products
export const getAllProducts = async (): Promise<Product[]> => {
  const products = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: {
      category: true,
      previewImages: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return products.map(mapDbProductToProduct);
};

// ⚠️ Used only where product ID is trusted (orders, downloads)
export const getProductById = async (
  id: string
): Promise<Product> => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      previewImages: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  return mapDbProductToProduct(product);
};

export const getProductBySlug = async (
  slug: string
): Promise<Product> => {
  const product = await prisma.product.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
    include: {
      category: true,
      previewImages: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  return mapDbProductToProduct(product);
};


/* =========================
   CATEGORIES (SERVER)
========================= */

export const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));
};


/* =========================
   SHOP (SERVER)
========================= */

export const getProductsForShop = async (
  categorySlug?: string
): Promise<Product[]> => {
  const products = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      ...(categorySlug && {
        category: { slug: categorySlug },
      }),
    },
    include: {
      category: true,
      previewImages: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return products.map(mapDbProductToProduct);
};