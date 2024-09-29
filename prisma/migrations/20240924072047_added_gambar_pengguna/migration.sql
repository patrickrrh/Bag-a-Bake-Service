/*
  Warnings:

  - Added the required column `gambarPengguna` to the `Pengguna` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pengguna" ADD COLUMN     "gambarPengguna" TEXT NOT NULL;
