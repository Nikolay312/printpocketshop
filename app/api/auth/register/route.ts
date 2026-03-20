export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth.server";
import { enforceIpRateLimit } from "@/lib/rateLimit";
import { randomBytes } from "crypto";
import { Resend } from "resend";

type Body = {
  email?: unknown;
  password?: unknown;
  name?: unknown;
  country?: unknown;
};

function getRequiredRegisterMailEnv() {
  const resendApiKey = process.env.RESEND_API_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const supportEmail = process.env.SUPPORT_EMAIL;

  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }

  if (!appUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL is not set");
  }

  if (!supportEmail) {
    throw new Error("SUPPORT_EMAIL is not set");
  }

  return { resendApiKey, appUrl, supportEmail };
}

async function sendVerificationEmail(params: {
  email: string;
  name: string | null;
  token: string;
}) {
  const { resendApiKey, appUrl, supportEmail } = getRequiredRegisterMailEnv();
  const resend = new Resend(resendApiKey);
  const verifyUrl = `${appUrl}/verify-email?token=${params.token}`;

  await resend.emails.send({
    from: `PrintPocketShop <${supportEmail}>`,
    to: params.email,
    subject: "Verify your email",
    html: `
      <div style="font-family: sans-serif; line-height: 1.6;">
        <h2>Welcome to PrintPocketShop</h2>
        <p>Hi ${params.name ?? "there"},</p>

        <p>Please verify your email address to activate your account:</p>

        <p>
          <a href="${verifyUrl}" 
             style="display:inline-block;padding:12px 20px;background:#000;color:#fff;text-decoration:none;border-radius:6px;">
            Verify Email
          </a>
        </p>

        <p>This link will expire in 15 minutes.</p>

        <p>If you didn’t create this account, you can ignore this email.</p>
      </div>
    `,
  });
}

export async function POST(req: Request) {
  const globalLimit = await enforceIpRateLimit({
    headers: req.headers,
    routeKey: "auth:register:global",
    limit: 20,
    windowSec: 60,
  });

  if (!globalLimit.allowed) {
    return globalLimit.response;
  }

  let body: Body;

  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const email =
    typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : undefined;

  const password =
    typeof body.password === "string" ? body.password : undefined;

  const name = typeof body.name === "string" ? body.name.trim() : null;

  const country =
    typeof body.country === "string" ? body.country.trim() : null;

  if (!email || !password || password.length < 8) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const targetedLimit = await enforceIpRateLimit({
    headers: req.headers,
    routeKey: `auth:register:${email}`,
    limit: 5,
    windowSec: 60,
  });

  if (!targetedLimit.allowed) {
    return targetedLimit.response;
  }

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      country,
      password: passwordHash,
      role: "USER",
      emailVerified: false,
    },
    select: { id: true, email: true, name: true },
  });

  await prisma.emailVerificationToken.deleteMany({
    where: { userId: user.id },
  });

  const token = randomBytes(32).toString("hex");

  await prisma.emailVerificationToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 15),
    },
  });

  try {
    await sendVerificationEmail({
      email: user.email,
      name: user.name,
      token,
    });
  } catch (err) {
    console.error("Email send error:", err);
  }

  return NextResponse.json({
    ok: true,
    message: "Verification email sent",
  });
}