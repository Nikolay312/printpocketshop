import { prisma } from "@/lib/prisma";
import { Currency, OrderStatus } from "@prisma/client";
import { randomUUID } from "crypto";

type CreateTestOrderInput = {
  userId: string;
  status?: OrderStatus;
  total?: number;
  currency?: Currency;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
};

export async function createTestOrder(input: CreateTestOrderInput) {
  if (!input.userId) {
    throw new Error("createTestOrder: userId is required");
  }

  return prisma.order.create({
    data: {
      status: input.status ?? OrderStatus.PENDING,
      total: input.total ?? 1000,
      currency: input.currency ?? Currency.EUR,

      stripeSessionId:
        input.stripeSessionId ?? `cs_test_${randomUUID()}`,

      stripePaymentIntentId:
        input.stripePaymentIntentId ?? null,

      // 🔒 FK-safe relation
      user: {
        connectOrCreate: {
          where: { id: input.userId },
          create: {
            id: input.userId,
            email: `recovered-${input.userId}@test.com`,
            password: "test-password",
            emailVerified: true,
          },
        },
      },
    },
  });
}
