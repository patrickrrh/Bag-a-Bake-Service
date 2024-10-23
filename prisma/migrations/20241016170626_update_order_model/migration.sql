/*
  Warnings:

  - You are about to drop the column `orderTotalPrice` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `productTotalPrice` on the `OrderDetail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "orderTotalPrice";

-- AlterTable
ALTER TABLE "OrderDetail" DROP COLUMN "productTotalPrice";
