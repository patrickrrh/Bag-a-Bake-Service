/*
  Warnings:

  - You are about to drop the column `alamatPengguna` on the `Pengguna` table. All the data in the column will be lost.
  - You are about to drop the column `alamatToko` on the `Toko` table. All the data in the column will be lost.
  - Added the required column `idRegion` to the `Pengguna` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idRegion` to the `Toko` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pengguna" DROP COLUMN "alamatPengguna",
ADD COLUMN     "idRegion" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Toko" DROP COLUMN "alamatToko",
ADD COLUMN     "idRegion" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Region" (
    "idRegion" SERIAL NOT NULL,
    "namaRegion" TEXT NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("idRegion")
);

-- AddForeignKey
ALTER TABLE "Pengguna" ADD CONSTRAINT "Pengguna_idRegion_fkey" FOREIGN KEY ("idRegion") REFERENCES "Region"("idRegion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Toko" ADD CONSTRAINT "Toko_idRegion_fkey" FOREIGN KEY ("idRegion") REFERENCES "Region"("idRegion") ON DELETE RESTRICT ON UPDATE CASCADE;
