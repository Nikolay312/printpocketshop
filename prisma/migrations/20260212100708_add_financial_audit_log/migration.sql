-- CreateEnum
CREATE TYPE "AuditActorType" AS ENUM ('SYSTEM', 'USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "AuditLevel" AS ENUM ('INFO', 'WARN', 'ERROR');

-- CreateEnum
CREATE TYPE "AuditEntityType" AS ENUM ('ORDER', 'INVOICE', 'LICENSE_UPGRADE', 'STRIPE_EVENT', 'PORTAL_SESSION');

-- CreateTable
CREATE TABLE "FinancialAuditLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actorType" "AuditActorType" NOT NULL DEFAULT 'SYSTEM',
    "actorId" TEXT,
    "level" "AuditLevel" NOT NULL DEFAULT 'INFO',
    "eventType" TEXT NOT NULL,
    "entityType" "AuditEntityType",
    "entityId" TEXT,
    "stripeEventId" TEXT,
    "stripeObjectId" TEXT,
    "amountCents" INTEGER,
    "currency" TEXT,
    "metadata" JSONB,

    CONSTRAINT "FinancialAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FinancialAuditLog_createdAt_idx" ON "FinancialAuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "FinancialAuditLog_entityType_entityId_idx" ON "FinancialAuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "FinancialAuditLog_stripeEventId_idx" ON "FinancialAuditLog"("stripeEventId");

-- CreateIndex
CREATE INDEX "FinancialAuditLog_stripeObjectId_idx" ON "FinancialAuditLog"("stripeObjectId");
