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

function hasAtLeastOneFile(fileKey: string | null): boolean {
  if (!fileKey) return false;
  try {
    const parsed = JSON.parse(fileKey);
    return Array.isArray(parsed) ? parsed.length > 0 : true;
  } catch {
    return true;
  }
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
  fileKey: string | null;
  previewImages: string[];
}) {
  await requireAdminUser();

  if (
    input.status === ProductStatus.PUBLISHED &&
    !hasAtLeastOneFile(input.fileKey)
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

      previewImages: input.previewImages,
      fileKey: input.fileKey,

      categoryId: input.categoryId,
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
  fileKey: string | null;
  previewImages: string[];
}) {
  await requireAdminUser();

  if (
    input.status === ProductStatus.PUBLISHED &&
    !hasAtLeastOneFile(input.fileKey)
  ) {
    throw new Error("Product file is required before publishing");
  }

  await prisma.product.update({
    where: { id: input.id },
    data: {
      title: input.title,
      description: input.description,
      price: input.price,
      format: input.format,
      categoryId: input.categoryId,
      status: input.status,
      fileKey: input.fileKey,
      previewImages: input.previewImages,
    },
  });
}
