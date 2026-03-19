import "server-only";
import { prisma } from "@/lib/prisma";

type CleanupResult = {
  expiredCount: number;
  cutoffIso: string;
};

export async function expireOldPendingOrders(
  olderThanMinutes: number = 60
): Promise<CleanupResult> {
  const cutoff = new Date(
    Date.now() - olderThanMinutes * 60 * 1000
  );

  const { count } = await prisma.order.updateMany({
    where: {
      status: "PENDING",
      createdAt: { lt: cutoff },
    },
    data: {
      status: "EXPIRED",
    },
  });

  return {
    expiredCount: count,
    cutoffIso: cutoff.toISOString(),
  };
}
