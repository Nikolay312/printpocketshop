// app/api/auth/csrf/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import crypto from "crypto";

const COOKIE_NAME = "pps_csrf";

export async function GET() {
  const token = crypto.randomBytes(32).toString("hex");

  const res = NextResponse.json({ ok: true });

  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: false, // must be readable by client
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res;
}
