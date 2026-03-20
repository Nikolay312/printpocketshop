import "server-only";

import { prisma } from "@/lib/prisma";
import { mapDbProductToProduct } from "@/lib/mappers/productMapper";
import type { Order } from "@/types/order";
import type { PurchasedProduct } from "@/types/product";

type OrderStatus = "PENDING" | "PAID" | "REFUNDED" | "EXPIRED";
type ProductLicense = "PERSONAL" | "COMMERCIAL";

type DbOrderProduct = Parameters<typeof mapDbProductToProduct>[0];

type DbOrderItem = {
  quantity: number;
  license: ProductLicense;
  product: DbOrderProduct | null;
};

type DbOrderWithItems = {
  id: string;
  createdAt: Date;
  total: number;
  status: OrderStatus;
  items: DbOrderItem[];
};

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

  const typedOrder = order as DbOrderWithItems;

  return {
    ...typedOrder,
    createdAt: typedOrder.createdAt.toISOString(),
    items: typedOrder.items.map((item: DbOrderItem) => ({
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

  const typedOrders = orders as DbOrderWithItems[];

  return typedOrders.map((order: DbOrderWithItems) => ({
    id: order.id,
    createdAt: order.createdAt.toISOString(),
    total: order.total,
    status: order.status,
    items: order.items.map((item: DbOrderItem) => ({
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
    where: { userId, status: "PAID" },
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

  const typedOrders = orders as DbOrderWithItems[];

  return typedOrders.flatMap((order: DbOrderWithItems) =>
    order.items.map((item: DbOrderItem) => ({
      orderId: order.id,
      purchasedAt: order.createdAt.toISOString(),
      quantity: item.quantity,
      license: item.license,
      product: mapPurchasedProduct(item.product),
    }))
  ) as PurchasedProduct[];
}