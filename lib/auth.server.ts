import "server-only";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "pps_session";
const DEFAULT_MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days
const REMEMBER_ME_MAX_AGE_SEC = 60 * 60 * 24 * 30; // 30 days

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("Missing AUTH_SECRET");
  return new TextEncoder().encode(secret);
}

/* =========================
   PASSWORD
========================= */

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

/* =========================
   SESSION
========================= */

export async function createSession(
  userId: string,
  rememberMe: boolean = false
) {
  const maxAge = rememberMe
    ? REMEMBER_ME_MAX_AGE_SEC
    : DEFAULT_MAX_AGE_SEC;

  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${maxAge}s`)
    .sign(getSecret());

  const jar = await cookies();

  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    ...(rememberMe ? { maxAge } : {}),
  });
}

export async function clearSession() {
  const jar = await cookies();

  jar.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/* =========================
   CURRENT USER
========================= */

export async function getCurrentUserId(): Promise<string | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      emailVerified: true,
      role: true,
      name: true,
    },
  });
}

/* =========================
   REQUIRE HELPERS
========================= */

export async function requireUserId() {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("UNAUTHORIZED");
  return userId;
}

export async function requireVerifiedUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  if (!user.emailVerified) {
    throw new Error("EMAIL_NOT_VERIFIED");
  }

  return user.id;
}

export async function requireAdminUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  if (user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }

  return user.id;
}

/* =========================
   LOOKUPS
========================= */

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}