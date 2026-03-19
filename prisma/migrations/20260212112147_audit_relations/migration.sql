/*
  Warnings:

  - The `currency` column on the `FinancialAuditLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AuditEntityType" ADD VALUE 'EMAIL';
ALTER TYPE "AuditEntityType" ADD VALUE 'REFUND';

-- AlterEnum
ALTER TYPE "AuditLevel" ADD VALUE 'CRITICAL';

-- AlterTable
ALTER TABLE "FinancialAuditLog" ADD COLUMN     "invoiceId" TEXT,
ADD COLUMN     "licenseUpgradeId" TEXT,
ADD COLUMN     "orderId" TEXT,
DROP COLUMN "currency",
ADD COLUMN     "currency" "Currency";

-- CreateIndex
CREATE INDEX "FinancialAuditLog_eventType_idx" ON "FinancialAuditLog"("eventType");

-- CreateIndex
CREATE INDEX "FinancialAuditLog_eventType_createdAt_idx" ON "FinancialAuditLog"("eventType", "createdAt");

-- CreateIndex
CREATE INDEX "FinancialAuditLog_orderId_createdAt_idx" ON "FinancialAuditLog"("orderId", "createdAt");

-- CreateIndex
CREATE INDEX "FinancialAuditLog_invoiceId_createdAt_idx" ON "FinancialAuditLog"("invoiceId", "createdAt");

-- CreateIndex
CREATE INDEX "FinancialAuditLog_licenseUpgradeId_createdAt_idx" ON "FinancialAuditLog"("licenseUpgradeId", "createdAt");

-- AddForeignKey
ALTER TABLE "FinancialAuditLog" ADD CONSTRAINT "FinancialAuditLog_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialAuditLog" ADD CONSTRAINT "FinancialAuditLog_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialAuditLog" ADD CONSTRAINT "FinancialAuditLog_licenseUpgradeId_fkey" FOREIGN KEY ("licenseUpgradeId") REFERENCES "LicenseUpgrade"("id") ON DELETE SET NULL ON UPDATE CASCADE;
