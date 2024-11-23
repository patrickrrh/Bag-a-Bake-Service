/*
  Warnings:

  - You are about to drop the column `PaymentDetail` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `paymentDetail` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "PaymentDetail",
ADD COLUMN     "paymentDetail" TEXT NOT NULL;
