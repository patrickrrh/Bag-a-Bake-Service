-- CreateTable
CREATE TABLE "Payment" (
    "paymentId" SERIAL NOT NULL,
    "bakeryId" INTEGER NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "PaymentDetail" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("paymentId")
);

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bakeryId_fkey" FOREIGN KEY ("bakeryId") REFERENCES "Bakery"("bakeryId") ON DELETE RESTRICT ON UPDATE CASCADE;
