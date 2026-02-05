// app/api/auth/forgot-password/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mail";

const TOKEN_TTL_MINUTES = 30;

export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({}));

  // Always return ok (no enumeration)
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
}
