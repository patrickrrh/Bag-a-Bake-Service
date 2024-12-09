-- AlterTable
ALTER TABLE "Bakery" ADD COLUMN     "halalCertificate" TEXT,
ADD COLUMN     "isHalal" INTEGER NOT NULL DEFAULT 0;
