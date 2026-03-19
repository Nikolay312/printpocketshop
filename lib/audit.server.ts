import "server-only";

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import {
  AuditActorType,
  AuditLevel,
  Currency,
} from "@prisma/client";
import * as Sentry from "@sentry/nextjs";

/* =========================
   TYPES
========================= */

type AuditParams = {
  eventType: string;

  // Actor
  actorType?: AuditActorType; // SYSTEM | USER | ADMIN
  actorId?: string;

  // Severity
  level?: AuditLevel;

  // Entity linkage
  orderId?: string;
  invoiceId?: string;
  licenseUpgradeId?: string;

  stripeEventId?: string;
  stripeObjectId?: string;

  // Financial metadata
  amountCents?: number;
  currency?: Currency;

  // Arbitrary structured data
  metadata?: Prisma.InputJsonValue;
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
        actorType:
          data.actorType ?? AuditActorType.SYSTEM,
        actorId: data.actorId,

        level: data.level ?? AuditLevel.INFO,
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
    // 🔐 Never break financial flows due to audit failure
    console.error("Audit log failed:", err);

    // Audit failure itself is critical
    Sentry.captureException(err);
  }
}
