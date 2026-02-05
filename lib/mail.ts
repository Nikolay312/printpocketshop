import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
  orderId: string;
};

type RefundEmailParams = {
  email: string;
  orderId: string;
  total: number;
  currency: string;
};

export async function sendPasswordResetEmail({
  email,
  token,
}: PasswordResetEmailParams) {
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error("Missing NEXT_PUBLIC_APP_URL");
  }

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: "PrintPocketShop <no-reply@printpocketshop.com>",
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
}: EmailVerificationParams) {
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error("Missing NEXT_PUBLIC_APP_URL");
  }

  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  await resend.emails.send({
    from: "PrintPocketShop <no-reply@printpocketshop.com>",
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
}: OrderConfirmationParams) {
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error("Missing NEXT_PUBLIC_APP_URL");
  }

  const ordersUrl = `${process.env.NEXT_PUBLIC_APP_URL}/account/orders/${orderId}`;

  await resend.emails.send({
    from: "PrintPocketShop <no-reply@printpocketshop.com>",
    to: email,
    subject: "Your order is confirmed 🎉",
    html: `
      <h2>Thank you for your purchase!</h2>
      <p>Your order <strong>#${orderId}</strong> has been successfully completed.</p>
      <p><strong>Total:</strong> ${(total / 100).toFixed(2)} ${currency}</p>
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
  orderId,
}: DownloadEmailParams) {
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error("Missing NEXT_PUBLIC_APP_URL");
  }

  const downloadsUrl = `${process.env.NEXT_PUBLIC_APP_URL}/account/downloads`;

  await resend.emails.send({
    from: "PrintPocketShop <no-reply@printpocketshop.com>",
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

// ✅ NEW — refund email
export async function sendRefundEmail({
  email,
  orderId,
  total,
  currency,
}: RefundEmailParams) {
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error("Missing NEXT_PUBLIC_APP_URL");
  }

  const ordersUrl = `${process.env.NEXT_PUBLIC_APP_URL}/account/orders/${orderId}`;

  await resend.emails.send({
    from: "PrintPocketShop <no-reply@printpocketshop.com>",
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
