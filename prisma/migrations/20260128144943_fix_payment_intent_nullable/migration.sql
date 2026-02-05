-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "stripePaymentIntentId" DROP NOT NULL;
