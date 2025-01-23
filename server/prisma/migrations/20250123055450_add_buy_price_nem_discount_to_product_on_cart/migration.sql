/*
  Warnings:

  - Added the required column `buyPriceNum` to the `ProductOnCart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProductOnCart" ADD COLUMN     "buyPriceNum" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "discount" DOUBLE PRECISION;
