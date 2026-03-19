-- CreateEnum
CREATE TYPE "LicenseUpgradeStatus" AS ENUM ('PENDING', 'PAID', 'REFUNDED', 'EXPIRED');

-- CreateTable
CREATE TABLE "LicenseUpgrade" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "fromLicense" "ProductLicense" NOT NULL,
    "toLicense" "ProductLicense" NOT NULL,
    "currency" "Currency" NOT NULL,
    "deltaCents" INTEGER NOT NULL,
    "fromPriceCents" INTEGER NOT NULL,
    "toPriceCents" INTEGER NOT NULL,
    "status" "LicenseUpgradeStatus" NOT NULL DEFAULT 'PENDING',
    "stripeCheckoutSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "stripeCustomerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "expiredAt" TIMESTAMP(3),

    CONSTRAINT "LicenseUpgrade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LicenseUpgrade_stripeCheckoutSessionId_key" ON "LicenseUpgrade"("stripeCheckoutSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "LicenseUpgrade_stripePaymentIntentId_key" ON "LicenseUpgrade"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "LicenseUpgrade_userId_createdAt_idx" ON "LicenseUpgrade"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "LicenseUpgrade_orderItemId_status_idx" ON "LicenseUpgrade"("orderItemId", "status");

-- CreateIndex
CREATE INDEX "LicenseUpgrade_status_createdAt_idx" ON "LicenseUpgrade"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "LicenseUpgrade" ADD CONSTRAINT "LicenseUpgrade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LicenseUpgrade" ADD CONSTRAINT "LicenseUpgrade_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
