import "server-only";
import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/auth.server";

export async function getAllOrdersForAdmin() {
  // 🔒 HARD SECURITY
  await requireAdminUser();

  return prisma.order.findMany({
    include: {
      user: {
        select: {
          email: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
