import "server-only";

import { OrderStatus, ProductLicense } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { mapDbProductToProduct } from "@/lib/mappers/productMapper";
import type { Order } from "@/types/order";
import type { PurchasedProduct } from "@/types/product";

/* =========================
   Helpers
========================= */

function mapPurchasedProduct(dbProduct: unknown) {
  if (!dbProduct || typeof dbProduct !== "object") {
    return null;
  }

  return mapDbProductToProduct(
    dbProduct as Parameters<typeof mapDbProductToProduct>[0]
  );
}

/* =========================
   SINGLE ORDER
========================= */

export async function getOrderForUser(userId: string, orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
              files: true,
            },
          },
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
      license: item.license,
      product: mapPurchasedProduct(item.product),
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
          product: {
            include: {
              category: true,
              files: true,
            },
          },
        },
      },
    },
  });

  return orders.map((order) => ({
    id: order.id,
    createdAt: order.createdAt.toISOString(),
    total: order.total,
    status: order.status,
    items: order.items.map((item) => ({
      quantity: item.quantity,
      license: item.license,
      product: mapPurchasedProduct(item.product),
    })),
  })) as Order[];
}

/* =========================
   PURCHASED PRODUCTS
========================= */

export async function getPurchasedProductsForUser(
  userId: string
): Promise<PurchasedProduct[]> {
  const orders = await prisma.order.findMany({
    where: { userId, status: OrderStatus.PAID },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
              files: true,
            },
          },
        },
      },
    },
  });

  return orders.flatMap((order) =>
    order.items.map((item) => ({
      orderId: order.id,
      purchasedAt: order.createdAt.toISOString(),
      quantity: item.quantity,
      license: item.license as ProductLicense,
      product: mapPurchasedProduct(item.product),
    }))
  ) as PurchasedProduct[];
}