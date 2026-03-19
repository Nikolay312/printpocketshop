export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { enforceIpRateLimit } from "@/lib/rateLimit";
import { auditLog } from "@/lib/audit.server";

const resend = new Resend(process.env.RESEND_API_KEY);

type Body = {
  email: string;
  subject: string;
  message: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const ipLimit = await enforceIpRateLimit({
      headers: req.headers,
      routeKey: "contact:submit",
      limit: 10,
      windowSec: 60,
    });

    if (!ipLimit.allowed) {
      return ipLimit.response;
    }

    const body = (await req.json()) as Partial<Body>;

    if (
      !body.email ||
      !body.subject ||
      !body.message ||
      typeof body.email !== "string" ||
      typeof body.subject !== "string" ||
      typeof body.message !== "string" ||
      !isValidEmail(body.email)
    ) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const result = await resend.emails.send({
      from: "PrintPocketShop <support@printpocketshop.com>",
      to: process.env.SUPPORT_EMAIL || "support@printpocketshop.com",
      replyTo: body.email,
      subject: `[Contact] ${body.subject}`,
      html: `
        <h2>New contact message</h2>
        <p><strong>From:</strong> ${body.email}</p>
        <p><strong>Subject:</strong> ${body.subject}</p>
        <hr />
        <p>${body.message.replace(/\n/g, "<br />")}</p>
      `,
    });

    if (result.error) {
      console.error("Resend error:", result.error);

      await auditLog({
        eventType: "CONTACT_EMAIL_FAILED",
        metadata: {
          from: body.email,
          subject: body.subject,
          error: result.error.message,
        },
      });

      return NextResponse.json(
        { error: result.error.message || "Failed to send message" },
        { status: 500 }
      );
    }

    const providerMessageId = result.data?.id ?? null;

    await auditLog({
      eventType: "CONTACT_FORM_SUBMITTED",
      metadata: {
        from: body.email,
        subject: body.subject,
        provider: "resend",
        providerMessageId,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);

    await auditLog({
      eventType: "CONTACT_FORM_ERROR",
      metadata: {
        error: String(err),
      },
    });

    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Something went wrong",
      },
      { status: 500 }
    );
  }
}