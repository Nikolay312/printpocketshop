export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  verifyPassword,
  requireUserId,
} from "@/lib/auth.server";
import { enforceIpRateLimit } from "@/lib/rateLimit";

type Body = {
  currentPassword?: unknown;
  newPassword?: unknown;
};

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();

    const limit = await enforceIpRateLimit({
      headers: req.headers,
      routeKey: "account:change-password",
      limit: 20,
      windowSec: 60,
    });

    if (!limit.allowed) {
      return limit.response;
    }

    let body: Body;

    try {
      body = (await req.json()) as Body;
    } catch {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    const currentPassword =
      typeof body.currentPassword === "string"
        ? body.currentPassword
        : undefined;

    const newPassword =
      typeof body.newPassword === "string"
        ? body.newPassword
        : undefined;

    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const valid = await verifyPassword(
      currentPassword,
      user.password
    );

    if (!valid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: passwordHash },
    });

    return NextResponse.json({ ok: true });

  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Change password error:", err);

    return NextResponse.json(
      { error: "Unable to update password" },
      { status: 400 }
    );
  }
}