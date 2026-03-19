export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth.server";
import { enforceIpRateLimit } from "@/lib/rateLimit";

type Body = {
  token?: unknown;
  password?: unknown;
};

export async function POST(req: Request) {
  try {
    /* =========================
       GLOBAL IP LIMIT (ANTI-BOT)
    ========================= */

    const globalLimit = await enforceIpRateLimit({
      headers: req.headers,
      routeKey: "auth:reset:global",
      limit: 30, // 30 reset attempts per minute per IP
      windowSec: 60,
    });

    if (!globalLimit.allowed) {
      return globalLimit.response;
    }

    /* =========================
       BODY PARSE (SAFE)
    ========================= */

    let body: Body;

    try {
      body = (await req.json()) as Body;
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    const token =
      typeof body.token === "string"
        ? body.token.trim()
        : undefined;

    const password =
      typeof body.password === "string"
        ? body.password
        : undefined;

    if (!token || !password || password.length < 8) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    /* =========================
       TARGETED LIMIT (IP + TOKEN)
       Prevent token brute force
    ========================= */

    const targetedLimit = await enforceIpRateLimit({
      headers: req.headers,
      routeKey: `auth:reset:${token}`,
      limit: 10, // 10 attempts per minute per IP per token
      windowSec: 60,
    });

    if (!targetedLimit.allowed) {
      return targetedLimit.response;
    }

    /* =========================
       TOKEN VALIDATION
    ========================= */

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (
      !resetToken ||
      resetToken.used ||
      resetToken.expiresAt < new Date()
    ) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    /* =========================
       PASSWORD UPDATE (ATOMIC)
    ========================= */

    const passwordHash = await hashPassword(password);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Reset password error:", err);

    return NextResponse.json(
      { error: "Invalid or expired reset token" },
      { status: 400 }
    );
  }
}
