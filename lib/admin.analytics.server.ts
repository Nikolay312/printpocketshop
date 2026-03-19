import "server-only";
import { prisma } from "@/lib/prisma";

/* =========================
   TOTAL REVENUE (ORDERS)
========================= */

export async function getTotalRevenue() {
  const result = await prisma.order.groupBy({
    by: ["currency"],
    where: { status: "PAID" },
    _sum: {
      total: true,
    },
  });

  return result.map((r: (typeof result)[number]) => ({
    currency: r.currency,
    total: r._sum.total ?? 0,
  }));
}

/* =========================
   REVENUE OVER TIME (DAILY)
========================= */

export async function getRevenueOverTime() {
  const orders = await prisma.order.findMany({
    where: { status: "PAID" },
    select: {
      createdAt: true,
      total: true,
      currency: true,
    },
  });

  const byDay = new Map<string, number>();

  for (const order of orders) {
    const day = order.createdAt.toISOString().slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + order.total);
  }

  return Array.from(byDay.entries())
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/* =========================
   REVENUE PER PRODUCT (ORDERS)
========================= */

export async function getRevenuePerProduct() {
  const items = await prisma.orderItem.findMany({
    where: {
      order: { status: "PAID" },
    },
    include: {
      product: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
  });

  const map = new Map<
    string,
    {
      productId: string;
      title: string;
      slug: string;
      quantity: number;
      revenue: number;
    }
  >();

  for (const item of items) {
    const key = item.productId;
    const revenue = item.price * item.quantity;

    const existing = map.get(key);
    if (existing) {
      existing.quantity += item.quantity;
      existing.revenue += revenue;
    } else {
      map.set(key, {
        productId: item.productId,
        title: item.product.title,
        slug: item.product.slug,
        quantity: item.quantity,
        revenue,
      });
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => b.revenue - a.revenue
  );
}

/* =========================
   LICENSE BREAKDOWN (BASE SALES)
========================= */

export async function getLicenseBreakdown() {
  const items = await prisma.orderItem.findMany({
    where: {
      order: { status: "PAID" },
    },
    select: {
      license: true,
      price: true,
      quantity: true,
    },
  });

  const result = {
    PERSONAL: { revenue: 0, quantity: 0 },
    COMMERCIAL: { revenue: 0, quantity: 0 },
  };

  for (const item of items) {
    const revenue = item.price * item.quantity;
    result[item.license].revenue += revenue;
    result[item.license].quantity += item.quantity;
  }

  return result;
}

/* =========================
   BEST SELLERS
========================= */

export async function getBestSellers(limit = 10) {
  const products = await getRevenuePerProduct();
  return products.slice(0, limit);
}

/* ======================================================
   🔁 LICENSE UPGRADE ANALYTICS (NEW)
====================================================== */

/* =========================
   TOTAL UPGRADE REVENUE
========================= */

export async function getTotalUpgradeRevenue() {
  const result = await prisma.licenseUpgrade.groupBy({
    by: ["currency"],
    where: { status: "PAID" },
    _sum: {
      deltaCents: true,
    },
  });

  return result.map((r: (typeof result)[number]) => ({
    currency: r.currency,
    total: r._sum.deltaCents ?? 0,
  }));
}

/* =========================
   UPGRADE COUNT
========================= */

export async function getUpgradeCount() {
  return prisma.licenseUpgrade.count({
    where: { status: "PAID" },
  });
}

/* =========================
   UPGRADES PER PRODUCT
========================= */

export async function getUpgradesPerProduct() {
  const upgrades = await prisma.licenseUpgrade.findMany({
    where: { status: "PAID" },
    include: {
      orderItem: {
        include: {
          product: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  const map = new Map<
    string,
    {
      productId: string;
      title: string;
      slug: string;
      upgrades: number;
      revenue: number;
    }
  >();

  for (const upgrade of upgrades) {
    const product = upgrade.orderItem.product;
    const key = product.id;

    const existing = map.get(key);
    if (existing) {
      existing.upgrades += 1;
      existing.revenue += upgrade.deltaCents;
    } else {
      map.set(key, {
        productId: product.id,
        title: product.title,
        slug: product.slug,
        upgrades: 1,
        revenue: upgrade.deltaCents,
      });
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => b.revenue - a.revenue
  );
}

/* =========================
   LICENSE UPGRADE BREAKDOWN
========================= */

export async function getLicenseUpgradeBreakdown() {
  const upgrades = await prisma.licenseUpgrade.findMany({
    where: { status: "PAID" },
    select: {
      fromLicense: true,
      toLicense: true,
      deltaCents: true,
    },
  });

  const map = new Map<
    string,
    { from: string; to: string; count: number; revenue: number }
  >();

  for (const u of upgrades) {
    const key = `${u.fromLicense}->${u.toLicense}`;

    const existing = map.get(key);
    if (existing) {
      existing.count += 1;
      existing.revenue += u.deltaCents;
    } else {
      map.set(key, {
        from: u.fromLicense,
        to: u.toLicense,
        count: 1,
        revenue: u.deltaCents,
      });
    }
  }

  return Array.from(map.values());
}