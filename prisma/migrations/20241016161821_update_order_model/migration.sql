/*
  Warnings:

  - Added the required column `bakeryId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "bakeryId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_bakeryId_fkey" FOREIGN KEY ("bakeryId") REFERENCES "Bakery"("bakeryId") ON DELETE RESTRICT ON UPDATE CASCADE;
