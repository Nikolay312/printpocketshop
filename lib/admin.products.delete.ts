"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/adminGuard";

export async function deleteAdminProduct(productId: string) {
  await requireAdminUser();

  await prisma.product.update({
    where: { id: productId },
    data: {
      status: "DRAFT", // use existing enum
    },
  });
}