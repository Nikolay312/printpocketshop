export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireUserId,
  verifyPassword,
  clearSession,
} from "@/lib/auth.server";
import { enforceIpRateLimit } from "@/lib/rateLimit";

type Body = {
  password?: unknown;
};

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();

    const limit = await enforceIpRateLimit({
      headers: req.headers,
      routeKey: "account:delete",
      limit: 5,
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

    const password =
      typeof body.password === "string"
        ? body.password
        : undefined;

    if (!password) {
      return NextResponse.json(
        { error: "Password required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
        stripeCustomerId: true,
      },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const valid = await verifyPassword(password, user.password);

    if (!valid) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.delete({
        where: { id: userId },
      });
    });

    await clearSession();

    return NextResponse.json({ ok: true });

  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Delete account error:", err);

    return NextResponse.json(
      { error: "Unable to delete account" },
      { status: 400 }
    );
  }
}