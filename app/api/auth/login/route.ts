export const runtime = "nodejs";

import { NextResponse } from "next/server";
import {
  createSession,
  getUserByEmail,
  verifyPassword,
} from "@/lib/auth.server";
import { enforceIpRateLimit } from "@/lib/rateLimit";

type Body = {
  email?: unknown;
  password?: unknown;
  rememberMe?: unknown;
};

export async function POST(req: Request) {
  /* =========================
     GLOBAL IP LIMIT (ANTI-BOT)
  ========================= */

  const globalLimit = await enforceIpRateLimit({
    headers: req.headers,
    routeKey: "auth:login:global",
    limit: 40,
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
      { error: "Invalid input" },
      { status: 400 }
    );
  }

  const email =
    typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : undefined;

  const password =
    typeof body.password === "string"
      ? body.password
      : undefined;

  const rememberMe =
    typeof body.rememberMe === "boolean"
      ? body.rememberMe
      : false;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  /* =========================
     TARGETED LIMIT (IP + EMAIL)
  ========================= */

  const targetedLimit = await enforceIpRateLimit({
    headers: req.headers,
    routeKey: `auth:login:${email}`,
    limit: 8,
    windowSec: 60,
  });

  if (!targetedLimit.allowed) {
    return targetedLimit.response;
  }

  /* =========================
     AUTH LOGIC
  ========================= */

  try {
    const user = await getUserByEmail(email);

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const passwordValid = await verifyPassword(
      password,
      user.password
    );

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    await createSession(user.id, rememberMe);

    return NextResponse.json({
      ok: true,
      emailVerified: user.emailVerified,
    });
  } catch (err) {
    console.error("Login error:", err);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}