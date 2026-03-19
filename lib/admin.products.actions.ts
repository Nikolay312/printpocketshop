"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/adminGuard";
import {
  ProductFormat,
  ProductLicense,
  Currency,
  ProductStatus,
} from "@prisma/client";

/* =========================
   HELPERS
========================= */

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function hasAtLeastOneFile(files: string[]): boolean {
  return files.length > 0;
}

/* =========================
   CREATE PRODUCT
========================= */

export async function createAdminProduct(input: {
  title: string;
  description?: string;
  price: number;
  format?: ProductFormat;
  categoryId: string;
  status: ProductStatus;
  files: string[];
  previewImages: string[];
}) {
  await requireAdminUser();

  if (
    input.status === ProductStatus.PUBLISHED &&
    !hasAtLeastOneFile(input.files)
  ) {
    throw new Error("Product file is required before publishing");
  }

  const slug = slugify(input.title);

  const existing = await prisma.product.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (existing) {
    throw new Error("Product with this title already exists");
  }

  const product = await prisma.product.create({
    data: {
      title: input.title,
      slug,
      description: input.description ?? "",
      price: input.price,
      currency: Currency.EUR,
      format: input.format ?? ProductFormat.PDF,
      license: ProductLicense.PERSONAL,
      status: input.status,
      categoryId: input.categoryId,

      // RELATIONAL PREVIEW IMAGES
      previewImages: {
        create: input.previewImages.map((fileKey, index) => ({
          fileKey,
          order: index,
        })),
      },

      // RELATIONAL PRODUCT FILES
      files: {
        create: input.files.map((key) => ({
          fileKey: key,
          label: null,
        })),
      },
    },
  });

  return product.id;
}

/* =========================
   UPDATE PRODUCT
========================= */

export async function updateAdminProduct(input: {
  id: string;
  title: string;
  description: string;
  price: number;
  format?: ProductFormat;
  categoryId: string;
  status: ProductStatus;
  files: string[];
  previewImages: string[];
}) {
  await requireAdminUser();

  if (
    input.status === ProductStatus.PUBLISHED &&
    !hasAtLeastOneFile(input.files)
  ) {
    throw new Error("Product file is required before publishing");
  }

  await prisma.product.update({
    where: { id: input.id },
    data: {
      title: input.title,
      description: input.description,
      price: input.price,
      currency: Currency.EUR,
      format: input.format,
      categoryId: input.categoryId,
      status: input.status,

      // Replace preview images
      previewImages: {
        deleteMany: {},
        create: input.previewImages.map((fileKey, index) => ({
          fileKey,
          order: index,
        })),
      },

      // Replace files
      files: {
        deleteMany: {},
        create: input.files.map((key) => ({
          fileKey: key,
          label: null,
        })),
      },
    },
  });
}

/* =========================
   FEATURED TOGGLE
========================= */

export async function toggleAdminProductFeatured(productId: string) {
  await requireAdminUser();

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { isFeatured: true },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  await prisma.product.update({
    where: { id: productId },
    data: {
      isFeatured: !product.isFeatured,
    },
  });
}