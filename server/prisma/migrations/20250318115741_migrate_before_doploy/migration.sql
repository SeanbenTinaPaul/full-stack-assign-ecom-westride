/*
  Warnings:

  - You are about to drop the column `brandId` on the `Image` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,productId,orderId,comment]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdBy` to the `Brand` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_brandId_fkey";

-- DropIndex
DROP INDEX "Rating_userId_productId_orderId_key";

-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "img_url" TEXT,
ADD COLUMN     "public_id" TEXT,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "createdBy" TEXT;

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "brandId";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "updatedBy" TEXT,
ALTER COLUMN "brandId" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "Rating" ADD COLUMN     "comment" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "picturePub" TEXT,
ADD COLUMN     "updatedBy" TEXT;

-- CreateIndex
CREATE INDEX "Favorite_userId_idx" ON "Favorite"("userId");

-- CreateIndex
CREATE INDEX "Favorite_productId_idx" ON "Favorite"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_userId_productId_orderId_comment_key" ON "Rating"("userId", "productId", "orderId", "comment");
