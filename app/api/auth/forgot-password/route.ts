// app/api/auth/forgot-password/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mail";

const TOKEN_TTL_MINUTES = 30;

export async function POST(req: Request) {
  try {
    const { email } = await req.json().catch(() => ({}));

    // Always return ok (prevent email enumeration)
    if (!email || typeof email !== "string") {
      return NextResponse.json({ ok: true });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ ok: true });
    }

    // Invalidate old unused tokens
    await prisma.passwordResetToken.updateMany({
      where: {
        userId: user.id,
        used: false,
      },
      data: { used: true },
    });

    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(
      Date.now() + TOKEN_TTL_MINUTES * 60 * 1000
    );

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    await sendPasswordResetEmail({
      email: user.email,
      token,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ ok: true });
  }
}
