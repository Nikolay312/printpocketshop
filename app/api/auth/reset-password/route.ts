// app/api/auth/reset-password/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, clearSession } from "@/lib/auth.server";

export async function POST(req: Request) {
  const { token, password } = await req.json().catch(() => ({}));

  if (
    !token ||
    !password ||
    typeof token !== "string" ||
    typeof password !== "string"
  ) {
    return NextResponse.json(
      { error: "Invalid or expired reset token" },
      { status: 400 }
    );
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
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

  // 🔒 IMPORTANT: invalidate current session
  await clearSession();

  return NextResponse.json({ ok: true });
}
