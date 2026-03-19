/*
  Warnings:

  - You are about to drop the column `alt` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ProductImage` table. All the data in the column will be lost.
  - Added the required column `order` to the `ProductImage` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ProductImage_productId_idx";

-- AlterTable
ALTER TABLE "ProductImage" DROP COLUMN "alt",
DROP COLUMN "createdAt",
ADD COLUMN     "order" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "ProductImage_productId_order_idx" ON "ProductImage"("productId", "order");
