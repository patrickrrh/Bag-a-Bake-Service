-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_bakeryId_fkey";

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bakeryId_fkey" FOREIGN KEY ("bakeryId") REFERENCES "Bakery"("bakeryId") ON DELETE CASCADE ON UPDATE CASCADE;
