import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

import { GET as downloadHandler } from "@/app/api/download/[Id]/route";

import { createTestUser } from "@/tests/helpers/createTestUser";
import { createTestOrder } from "@/tests/helpers/createTestOrder";

import { ProductFormat, ProductLicense, ProductStatus } from "@prisma/client";

// 🔒 mock auth + storage
vi.mock("@/lib/auth.server", () => ({
  requireVerifiedUser: vi.fn(),
}));

vi.mock("@/lib/storage", () => ({
  getSignedDownloadUrl: vi.fn(),
}));

import { requireVerifiedUser } from "@/lib/auth.server";
import { getSignedDownloadUrl } from "@/lib/storage";

describe("Downloads integration", () => {
  beforeEach(async () => {
    vi.resetAllMocks();

    // clean tables touched by test
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
  });

  it("blocks download when order is unpaid", async () => {
    const user = await createTestUser();
    vi.mocked(requireVerifiedUser).mockResolvedValue(user.id);

    const product = await prisma.product.create({
      data: {
        title: "Test product",
        slug: `test-${Date.now()}`,
        description: "Test description",
        price: 5000,
        currency: "EUR",
        format: ProductFormat.PDF,
        license: ProductLicense.PERSONAL,
        status: ProductStatus.PUBLISHED,
        previewImages: [],
        fileKey: "files/test.pdf",
        category: {
          create: {
            name: "Test",
            slug: `test-${Date.now()}`,
          },
        },
      },
    });

    const order = await createTestOrder({
      userId: user.id,
      status: "PENDING",
    });

    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: product.id,
        quantity: 1,
        license: ProductLicense.PERSONAL,
        price: product.price,
      },
    });

    const req = new NextRequest(
      `http://localhost/api/download/${product.id}`
    );

    const res = await downloadHandler(req, {
      params: { id: product.id },
    });

    expect(res.status).toBe(403);
  });

  it("allows download after order is paid", async () => {
    const user = await createTestUser();
    vi.mocked(requireVerifiedUser).mockResolvedValue(user.id);

    vi.mocked(getSignedDownloadUrl).mockResolvedValue(
      "https://signed.example.com/file"
    );

    const product = await prisma.product.create({
      data: {
        title: "Paid product",
        slug: `paid-${Date.now()}`,
        description: "Paid description",
        price: 5000,
        currency: "EUR",
        format: ProductFormat.PDF,
        license: ProductLicense.PERSONAL,
        status: ProductStatus.PUBLISHED,
        previewImages: [],
        fileKey: "files/paid.pdf",
        category: {
          create: {
            name: "Paid",
            slug: `paid-${Date.now()}`,
          },
        },
      },
    });

    const order = await createTestOrder({
      userId: user.id,
      status: "PAID",
    });

    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: product.id,
        quantity: 1,
        license: ProductLicense.PERSONAL,
        price: product.price,
      },
    });

    const req = new NextRequest(
      `http://localhost/api/download/${product.id}`
    );

    const res = await downloadHandler(req, {
      params: { id: product.id },
    });

    // redirect to signed URL
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(
      "https://signed.example.com/file"
    );
  });
});
