/*
  Warnings:

  - You are about to drop the column `regionId` on the `Bakery` table. All the data in the column will be lost.
  - You are about to drop the column `regionId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Region` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bakeryAddress` to the `Bakery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bakeryLatitude` to the `Bakery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bakeryLongitude` to the `Bakery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bakery" DROP CONSTRAINT "Bakery_regionId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_regionId_fkey";

-- AlterTable
ALTER TABLE "Bakery" DROP COLUMN "regionId",
ADD COLUMN     "bakeryAddress" INTEGER NOT NULL,
ADD COLUMN     "bakeryLatitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "bakeryLongitude" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "regionId",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "Region";
