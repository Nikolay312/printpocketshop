import "server-only";
import { prisma } from "@/lib/prisma";
import { mapDbProductToProduct } from "@/lib/mappers/productMapper";
import type { Order } from "@/types/order";
import type { PurchasedProduct } from "@/types/product";

/* =========================
   SINGLE ORDER
========================= */

export async function getOrderForUser(userId: string, orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      items: {
        include: {
          product: { include: { category: true } },
        },
      },
    },
  });

  if (!order) return null;

  return {
    ...order,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      quantity: item.quantity,
      product: mapDbProductToProduct(item.product),
    })),
  };
}

/* =========================
   ORDERS LIST
========================= */

export async function getOrdersForUser(userId: string): Promise<Order[]> {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: { include: { category: true } },
        },
      },
    },
  });

  return orders.map((order) => ({
    id: order.id,
    createdAt: order.createdAt.toISOString(),
    total: order.total,
    status: order.status === "PAID" ? "PAID" : "FAILED",
    items: order.items.map((item) => ({
      quantity: item.quantity,
      product: mapDbProductToProduct(item.product),
    })),
  }));
}

/* =========================
   PURCHASED PRODUCTS
========================= */

export async function getPurchasedProductsForUser(
  userId: string
): Promise<PurchasedProduct[]> {
  const orders = await prisma.order.findMany({
    where: { userId, status: "PAID" },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: { include: { category: true } },
        },
      },
    },
  });

  return orders.flatMap((order) =>
    order.items.map((item) => ({
      orderId: order.id,
      purchasedAt: order.createdAt.toISOString(),
      product: mapDbProductToProduct(item.product),
    }))
  );
}
