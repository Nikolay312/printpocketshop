import "server-only";

import { Resend } from "resend";

/* =========================
   ENV VALIDATION
========================= */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not set");
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL;
if (!APP_URL) {
  throw new Error("NEXT_PUBLIC_APP_URL is not set");
}

const resend = new Resend(RESEND_API_KEY);

const FROM_EMAIL = "PrintPocketShop <no-reply@printpocketshop.com>";

/* =========================
   COMMON RETURN TYPE
========================= */

export type EmailResult = {
  provider: "resend";
  id: string | null;
};

/* =========================
   TYPES
========================= */

type PasswordResetEmailParams = {
  email: string;
  token: string;
};

type EmailVerificationParams = {
  email: string;
  token: string;
};

type OrderConfirmationParams = {
  email: string;
  orderId: string;
  total: number;
  currency: string;
};

type DownloadEmailParams = {
  email: string;
};

type RefundEmailParams = {
  email: string;
  orderId: string;
  total: number;
  currency: string;
};

/* =========================
   INTERNAL SEND HELPER
========================= */

async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<EmailResult> {
  const response = await resend.emails.send({
    from: FROM_EMAIL,
    to: params.to,
    subject: params.subject,
    html: params.html,
    ...(params.replyTo ? { reply_to: params.replyTo } : {}),
  });

  // Resend returns:
  // { data: { id: string } | null, error: {...} | null }

  if (response.error) {
    throw new Error(
      `Email send failed: ${response.error.message ?? "Unknown error"}`
    );
  }

  return {
    provider: "resend",
    id: response.data?.id ?? null,
  };
}

/* =========================
   EMAILS
========================= */

export async function sendPasswordResetEmail({
  email,
  token,
}: PasswordResetEmailParams): Promise<EmailResult> {
  const resetUrl = `${APP_URL}/reset-password?token=${encodeURIComponent(
    token
  )}`;

  return sendEmail({
    to: email,
    subject: "Reset your password",
    html: `
      <p>You requested a password reset.</p>
      <p><a href="${resetUrl}">Reset your password</a></p>
      <p>This link expires in 30 minutes.</p>
    `,
  });
}

export async function sendEmailVerification({
  email,
  token,
}: EmailVerificationParams): Promise<EmailResult> {
  const verifyUrl = `${APP_URL}/verify-email?token=${encodeURIComponent(
    token
  )}`;

  return sendEmail({
    to: email,
    subject: "Verify your email address",
    html: `
      <p>Welcome to PrintPocketShop 👋</p>
      <p>Please verify your email address.</p>
      <p><a href="${verifyUrl}">Verify email</a></p>
      <p>This link expires in 24 hours.</p>
    `,
  });
}

export async function sendOrderConfirmationEmail({
  email,
  orderId,
  total,
  currency,
}: OrderConfirmationParams): Promise<EmailResult> {
  const ordersUrl = `${APP_URL}/account/orders/${orderId}`;

  return sendEmail({
    to: email,
    subject: "Your order is confirmed 🎉",
    html: `
      <h2>Thank you for your purchase!</h2>
      <p>Your order <strong>#${orderId}</strong> has been successfully completed.</p>
      <p><strong>Total:</strong> ${(total / 100).toFixed(
        2
      )} ${currency}</p>
      <p>
        <a href="${ordersUrl}">
          View your order & download files
        </a>
      </p>
      <p>If you have any issues, just reply to this email.</p>
    `,
  });
}

export async function sendDownloadLinksEmail({
  email,
}: DownloadEmailParams): Promise<EmailResult> {
  const downloadsUrl = `${APP_URL}/account/downloads`;

  return sendEmail({
    to: email,
    subject: "Your downloads are ready 📦",
    html: `
      <h2>Your files are ready</h2>
      <p>Thanks for your purchase! Your digital products are now available.</p>
      <p>
        <a href="${downloadsUrl}">
          Access your downloads
        </a>
      </p>
      <p>
        You can always find your files under <strong>Account → Downloads</strong>.
      </p>
      <p>If you have any issues, just reply to this email.</p>
    `,
  });
}

export async function sendRefundEmail({
  email,
  orderId,
  total,
  currency,
}: RefundEmailParams): Promise<EmailResult> {
  const ordersUrl = `${APP_URL}/account/orders/${orderId}`;

  return sendEmail({
    to: email,
    subject: "Your refund has been processed",
    html: `
      <h2>Refund completed</h2>
      <p>Your refund for order <strong>#${orderId}</strong> has been processed.</p>
      <p>
        <strong>Amount refunded:</strong>
        ${(total / 100).toFixed(2)} ${currency}
      </p>
      <p>
        The funds will appear on your original payment method shortly,
        depending on your bank.
      </p>
      <p>
        <a href="${ordersUrl}">
          View order details
        </a>
      </p>
      <p>If you have any questions, just reply to this email.</p>
    `,
  });
}
