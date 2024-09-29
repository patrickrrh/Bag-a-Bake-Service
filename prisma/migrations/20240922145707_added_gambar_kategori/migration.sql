/*
  Warnings:

  - Added the required column `gambarKategori` to the `Kategori` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Kategori" ADD COLUMN     "gambarKategori" TEXT NOT NULL;
