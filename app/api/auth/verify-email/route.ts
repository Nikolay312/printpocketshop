// app/api/auth/verify-email/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { token } = await req.json().catch(() => ({}));

  if (!token || typeof token !== "string") {
    return NextResponse.json(
      { error: "Invalid or expired verification token" },
      { status: 400 }
    );
  }

  const verificationToken = await prisma.emailVerificationToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (
    !verificationToken ||
    verificationToken.used ||
    verificationToken.expiresAt < new Date()
  ) {
    return NextResponse.json(
      { error: "Invalid or expired verification token" },
      { status: 400 }
    );
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: true },
    }),
    prisma.emailVerificationToken.update({
      where: { id: verificationToken.id },
      data: { used: true },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
