-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "invoiceNumber" INTEGER NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "orderId" TEXT,
    "licenseUpgradeId" TEXT,
    "currency" "Currency" NOT NULL,
    "netAmount" INTEGER NOT NULL,
    "vatAmount" INTEGER NOT NULL,
    "grossAmount" INTEGER NOT NULL,
    "vatRate" DOUBLE PRECISION NOT NULL,
    "vatCountry" TEXT NOT NULL,
    "vatApplied" BOOLEAN NOT NULL,
    "buyerName" TEXT NOT NULL,
    "buyerEmail" TEXT NOT NULL,
    "buyerCountry" TEXT NOT NULL,
    "buyerAddress" TEXT,
    "buyerVatNumber" TEXT,
    "sellerName" TEXT NOT NULL,
    "sellerCountry" TEXT NOT NULL,
    "sellerVatNumber" TEXT,
    "pdfUrl" TEXT,
    "refundedAt" TIMESTAMP(3),

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_orderId_key" ON "Invoice"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_licenseUpgradeId_key" ON "Invoice"("licenseUpgradeId");

-- CreateIndex
CREATE INDEX "Invoice_userId_idx" ON "Invoice"("userId");

-- CreateIndex
CREATE INDEX "Invoice_issuedAt_idx" ON "Invoice"("issuedAt");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_licenseUpgradeId_fkey" FOREIGN KEY ("licenseUpgradeId") REFERENCES "LicenseUpgrade"("id") ON DELETE SET NULL ON UPDATE CASCADE;
