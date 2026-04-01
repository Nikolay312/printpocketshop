"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/adminGuard";

export async function deleteAdminProduct(productId: string) {
  await requireAdminUser();

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      orderItems: {
        select: { id: true },
        take: 1,
      },
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.orderItems.length > 0) {
    await prisma.product.update({
      where: { id: productId },
      data: {
        status: "DRAFT",
      },
    });

    return { deleted: false, archived: true };
  }

  await prisma.product.delete({
    where: { id: productId },
  });

  return { deleted: true, archived: false };
}