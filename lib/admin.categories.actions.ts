"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export async function createCategory(name: string) {
  const slug = slugify(name);

  await prisma.category.create({
    data: {
      name,
      slug,
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
}

export async function updateCategory(
  id: string,
  name: string
) {
  const slug = slugify(name);

  await prisma.category.update({
    where: { id },
    data: { name, slug },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
}

export async function deleteCategory(id: string) {
  const productCount = await prisma.product.count({
    where: { categoryId: id },
  });

  if (productCount > 0) {
    throw new Error(
      "Cannot delete category with existing products."
    );
  }

  await prisma.category.delete({
    where: { id },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
}
