// app/api/auth/register/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, hashPassword } from "@/lib/auth.server";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const { email, password, name } = await req.json().catch(() => ({}));

  if (!email || !password || typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  // ✅ Rate limit registrations (per IP)
  const ip = getClientIp(req.headers);
  const rl = await checkRateLimit({
    key: `auth:register:${ip}`,
    limit: 5,
    windowSec: 60 * 10, // 5 signups / 10 minutes
  });

  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many signups from this network. Please try again later." },
      { status: 429 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      name: typeof name === "string" ? name : null,
      password: passwordHash,
      role: "USER",
    },
    select: { id: true },
  });

  await createSession(user.id);

  return NextResponse.json({ ok: true });
}
