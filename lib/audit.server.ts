import "server-only";

import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";

/* =========================
   SAFE LOCAL TYPES
========================= */

type AuditActorType = "SYSTEM" | "USER" | "ADMIN";
type AuditLevel = "INFO" | "WARN" | "ERROR" | "CRITICAL";
type Currency = "EUR" | "USD" | "BGN";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

/* =========================
   TYPES
========================= */

type AuditParams = {
  eventType: string;

  actorType?: AuditActorType;
  actorId?: string;

  level?: AuditLevel;

  orderId?: string;
  invoiceId?: string;
  licenseUpgradeId?: string;

  stripeEventId?: string;
  stripeObjectId?: string;

  amountCents?: number;
  currency?: Currency;

  metadata?: JsonValue;
};

/* =========================
   INTERNAL VALIDATION
========================= */

function validateAuditPayload(data: AuditParams): void {
  const hasAnchor =
    data.orderId ||
    data.invoiceId ||
    data.licenseUpgradeId ||
    data.stripeEventId ||
    data.stripeObjectId ||
    data.metadata;

  if (!hasAnchor) {
    console.warn(
      "Audit log without entity linkage:",
      data.eventType
    );
  }

  if (
    (data.amountCents !== undefined && !data.currency) ||
    (data.currency !== undefined && data.amountCents === undefined)
  ) {
    console.warn(
      "Audit log financial fields inconsistent:",
      data.eventType
    );
  }
}

/* =========================
   AUDIT LOGGER (LEDGER SAFE)
========================= */

export async function auditLog(
  data: AuditParams
): Promise<void> {
  try {
    validateAuditPayload(data);

    await prisma.financialAuditLog.create({
      data: {
        actorType: data.actorType ?? "SYSTEM",
        actorId: data.actorId,

        level: data.level ?? "INFO",
        eventType: data.eventType,

        orderId: data.orderId,
        invoiceId: data.invoiceId,
        licenseUpgradeId: data.licenseUpgradeId,

        stripeEventId: data.stripeEventId,
        stripeObjectId: data.stripeObjectId,

        amountCents: data.amountCents,
        currency: data.currency,

        metadata: data.metadata ?? undefined,
      },
    });
  } catch (err) {
    console.error("Audit log failed:", err);
    Sentry.captureException(err);
  }
}