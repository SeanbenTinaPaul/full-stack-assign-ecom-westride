/*
  Warnings:

  - You are about to drop the column `avgRating` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `promotion` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `ProductOnOrder` table. All the data in the column will be lost.
  - You are about to drop the `Discount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Favorite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rating` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Discount" DROP CONSTRAINT "Discount_productId_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_productId_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_userId_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_productId_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_userId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "avgRating",
DROP COLUMN "promotion";

-- AlterTable
ALTER TABLE "ProductOnOrder" DROP COLUMN "discount";

-- DropTable
DROP TABLE "Discount";

-- DropTable
DROP TABLE "Favorite";

-- DropTable
DROP TABLE "Rating";
