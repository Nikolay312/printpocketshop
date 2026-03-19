import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth.server";

export async function POST() {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      select: {
        id: true,
      },
    });

    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found." },
        { status: 404 }
      );
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        discountCodeId: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Discount code removed.",
    });
  } catch (error) {
    console.error("remove-discount error:", error);

    const message =
      error instanceof Error ? error.message : "Unable to remove discount code.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}