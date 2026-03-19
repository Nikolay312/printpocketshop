export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth.server";

export async function PATCH(req: Request) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { productUpdatesEmail } = body as {
      productUpdatesEmail?: unknown;
    };

    if (typeof productUpdatesEmail !== "boolean") {
      return NextResponse.json(
        { error: "Invalid notification preference" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { productUpdatesEmail },
      select: {
        productUpdatesEmail: true,
      },
    });

    return NextResponse.json({
      success: true,
      preferences: {
        productUpdatesEmail: updatedUser.productUpdatesEmail,
      },
    });
  } catch (error) {
    console.error("Failed to update notification settings:", error);

    return NextResponse.json(
      { error: "Failed to update notification settings" },
      { status: 500 }
    );
  }
}