/*
  Warnings:

  - Added the required column `discountDate` to the `ListDiscount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ListDiscount" ADD COLUMN     "discountDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "productCreatedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
