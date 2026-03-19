import "server-only";
import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/auth.server";
import { redirect } from "next/navigation";

/**
 * Admin Orders
 */
export async function getAllOrdersForAdmin() {
  await requireAdminUser();

  return prisma.order.findMany({
    include: {
      user: {
        select: {
          email: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Admin Discount Codes List
 */
export async function getAllDiscountCodesForAdmin() {
  await requireAdminUser();

  const codes = await prisma.discountCode.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      usages: true,
    },
  });

  return codes.map((code: (typeof codes)[number]) => ({
    ...code,
    usedCount: code.usages.length,
  }));
}

/**
 * Get single code for edit page
 */
export async function getDiscountCodeForAdmin(id: string) {
  await requireAdminUser();

  return prisma.discountCode.findUnique({
    where: { id },
  });
}

/**
 * Create discount code
 */
export async function createDiscountCode(formData: FormData) {
  await requireAdminUser();

  const code = String(formData.get("code")).toUpperCase();
  const discountType = formData.get("discountType") as "PERCENT" | "FIXED";

  const percentOff = Number(formData.get("percentOff")) || null;
  const amountOff = Number(formData.get("amountOff")) || null;

  const maxUses = Number(formData.get("maxUses")) || null;
  const perUserLimit = Number(formData.get("perUserLimit")) || null;

  const expiresRaw = formData.get("expiresAt") as string | null;
  const expiresAt = expiresRaw ? new Date(expiresRaw) : null;

  const isActive = formData.get("isActive") === "on";

  await prisma.discountCode.create({
    data: {
      code,
      discountType,
      percentOff,
      amountOff,
      currency: "EUR",
      maxUses,
      perUserLimit,
      expiresAt,
      isActive,
    },
  });

  redirect("/admin/codes");
}

/**
 * Update discount code
 */
export async function updateDiscountCode(id: string, formData: FormData) {
  await requireAdminUser();

  const code = String(formData.get("code")).toUpperCase();
  const discountType = formData.get("discountType") as "PERCENT" | "FIXED";

  const percentOff = Number(formData.get("percentOff")) || null;
  const amountOff = Number(formData.get("amountOff")) || null;

  const maxUses = Number(formData.get("maxUses")) || null;
  const perUserLimit = Number(formData.get("perUserLimit")) || null;

  const expiresRaw = formData.get("expiresAt") as string | null;
  const expiresAt = expiresRaw ? new Date(expiresRaw) : null;

  const isActive = formData.get("isActive") === "on";

  await prisma.discountCode.update({
    where: { id },
    data: {
      code,
      discountType,
      percentOff,
      amountOff,
      maxUses,
      perUserLimit,
      expiresAt,
      isActive,
    },
  });

  redirect(`/admin/codes/${id}`);
}

/**
 * Delete discount code
 */
export async function deleteDiscountCode(id: string) {
  await requireAdminUser();

  await prisma.discountCode.delete({
    where: { id },
  });

  redirect("/admin/codes");
}