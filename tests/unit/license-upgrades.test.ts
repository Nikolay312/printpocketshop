import { describe, it, expect, beforeEach, vi } from "vitest";
import { randomUUID } from "crypto";

/* =====================================================
   MOCKS FIRST (ESM REQUIREMENT)
===================================================== */

vi.mock("@/lib/auth.server", () => ({
  getCurrentUserId: vi.fn(),
}));

vi.mock("stripe", () => {
  return {
    default: class Stripe {
      checkout = {
        sessions: {
          create: vi.fn().mockImplementation(() =>
            Promise.resolve({
              id: `cs_test_${randomUUID()}`,
              url: "https://stripe.test/checkout",
            })
          ),
        },
      };

      customers = {
        create: vi.fn().mockImplementation(() =>
          Promise.resolve({
            id: `cus_test_${randomUUID()}`,
          })
        ),
      };
    },
  };
});

/* =====================================================
   IMPORTS AFTER MOCKS
===================================================== */

import { prisma } from "@/lib/prisma";
import { POST } from "@/app/api/license-upgrades/start/route";
import { createTestUser } from "@/tests/helpers/createTestUser";
import { createTestOrder } from "@/tests/helpers/createTestOrder";
import { getCurrentUserId } from "@/lib/auth.server";

import {
  ProductLicense,
  ProductStatus,
  ProductFormat,
  OrderStatus,
} from "@prisma/client";

/* =====================================================
   TESTS (SEQUENTIAL + ISOLATED)
===================================================== */

describe.sequential("License upgrades (integration)", () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    // FK-safe cleanup order
    await prisma.licenseUpgrade.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
  });

  it("creates a PENDING license upgrade and returns Stripe checkout URL", async () => {
    const user = await createTestUser();
    vi.mocked(getCurrentUserId).mockResolvedValue(user.id);

    const product = await prisma.product.create({
      data: {
        title: "Pro asset",
        slug: `pro-${randomUUID()}`,
        description: "Test",
        price: 10000,
        currency: "EUR",
        format: ProductFormat.PDF,
        license: ProductLicense.PERSONAL,
        status: ProductStatus.PUBLISHED,
        previewImages: [],
        fileKey: "files/pro.pdf",
        category: {
          create: {
            name: `Test-${randomUUID()}`,
            slug: `test-${randomUUID()}`,
          },
        },
      },
    });

    const order = await createTestOrder({
      userId: user.id,
      status: OrderStatus.PAID,
    });

    const orderItem = await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: product.id,
        quantity: 1,
        license: ProductLicense.PERSONAL,
        price: 5000, // paid 50€, full product is 100€
      },
    });

    const req = new Request(
      "http://localhost/api/license-upgrades/start",
      {
        method: "POST",
        body: JSON.stringify({ orderItemId: orderItem.id }),
      }
    );

    const res = await POST(req);

    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.url).toBe("https://stripe.test/checkout");

    const upgrade = await prisma.licenseUpgrade.findFirst({
      where: { orderItemId: orderItem.id },
    });

    expect(upgrade).not.toBeNull();
    expect(upgrade?.status).toBe("PENDING");
    expect(upgrade?.fromLicense).toBe(ProductLicense.PERSONAL);
    expect(upgrade?.toLicense).toBe(ProductLicense.COMMERCIAL);
    expect(upgrade?.deltaCents).toBe(5000);
    expect(upgrade?.userId).toBe(user.id);
  });

  it("blocks upgrade if user does not own the order item", async () => {
    const user = await createTestUser();
    vi.mocked(getCurrentUserId).mockResolvedValue(user.id);

    const otherUser = await createTestUser();

    const product = await prisma.product.create({
      data: {
        title: "Other product",
        slug: `other-${randomUUID()}`,
        description: "Test",
        price: 10000,
        currency: "EUR",
        format: ProductFormat.PDF,
        license: ProductLicense.PERSONAL,
        status: ProductStatus.PUBLISHED,
        previewImages: [],
        fileKey: "files/other.pdf",
        category: {
          create: {
            name: `Test-${randomUUID()}`,
            slug: `test-${randomUUID()}`,
          },
        },
      },
    });

    const order = await createTestOrder({
      userId: otherUser.id,
      status: OrderStatus.PAID,
    });

    const orderItem = await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: product.id,
        quantity: 1,
        license: ProductLicense.PERSONAL,
        price: 5000,
      },
    });

    const req = new Request(
      "http://localhost/api/license-upgrades/start",
      {
        method: "POST",
        body: JSON.stringify({ orderItemId: orderItem.id }),
      }
    );

    const res = await POST(req);

    expect(res.status).toBe(403);

    const upgrades = await prisma.licenseUpgrade.findMany();
    expect(upgrades.length).toBe(0);
  });
});
