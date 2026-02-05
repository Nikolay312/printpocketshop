// app/api/auth/login/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createSession, getUserByEmail, verifyPassword } from "@/lib/auth.server";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));

  if (!email || !password || typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  // ✅ Rate limit login attempts (per IP + email)
  const ip = getClientIp(req.headers);
  const rl = await checkRateLimit({
    key: `auth:login:${ip}:${email.toLowerCase()}`,
    limit: 8,
    windowSec: 60, // 8 attempts / minute
  });

  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait and try again." },
      { status: 429 }
    );
  }

  const user = await getUserByEmail(email);
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const ok = await verifyPassword(password, user.password);
  if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  await createSession(user.id);

  return NextResponse.json({ ok: true });
}
