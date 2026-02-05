import "server-only";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth.server";

export async function requireAdminUser() {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user || user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }

  return userId;
}
