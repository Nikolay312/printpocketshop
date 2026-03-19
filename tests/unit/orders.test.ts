import { describe, it, expect } from "vitest";
import { prisma } from "@/lib/prisma";
import { expireOldPendingOrders } from "@/lib/orders.cleanup.server";
import { createTestUser } from "@/tests/helpers/createTestUser";

describe("Order cleanup", () => {
  it("expires old pending orders", async () => {
    const user = await createTestUser({
      email: "cleanup@test.com",
    });

    const oldOrder = await prisma.order.create({
      data: {
        userId: user.id,
        status: "PENDING",
        total: 1000,
        currency: "EUR",
        stripeSessionId: "cs_cleanup_test",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
    });

    const result = await expireOldPendingOrders(60);

    const updated = await prisma.order.findUnique({
      where: { id: oldOrder.id },
    });

    expect(updated!.status).toBe("EXPIRED");
    expect(result.expiredCount).toBeGreaterThan(0);
  });
});
