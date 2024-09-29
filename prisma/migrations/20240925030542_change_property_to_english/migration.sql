/*
  Warnings:

  - You are about to drop the column `idPengguna` on the `RefreshToken` table. All the data in the column will be lost.
  - The primary key for the `Region` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idRegion` on the `Region` table. All the data in the column will be lost.
  - You are about to drop the column `namaRegion` on the `Region` table. All the data in the column will be lost.
  - You are about to drop the `DetailPesanan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Favorit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Kategori` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ListPotonganHarga` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pengguna` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Peran` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pesanan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Produk` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Toko` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `regionName` to the `Region` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DetailPesanan" DROP CONSTRAINT "DetailPesanan_idPesanan_fkey";

-- DropForeignKey
ALTER TABLE "DetailPesanan" DROP CONSTRAINT "DetailPesanan_idProduk_fkey";

-- DropForeignKey
ALTER TABLE "ListPotonganHarga" DROP CONSTRAINT "ListPotonganHarga_idProduk_fkey";

-- DropForeignKey
ALTER TABLE "Pengguna" DROP CONSTRAINT "Pengguna_idPeran_fkey";

-- DropForeignKey
ALTER TABLE "Pengguna" DROP CONSTRAINT "Pengguna_idRegion_fkey";

-- DropForeignKey
ALTER TABLE "Pesanan" DROP CONSTRAINT "Pesanan_idPengguna_fkey";

-- DropForeignKey
ALTER TABLE "Produk" DROP CONSTRAINT "Produk_idKategori_fkey";

-- DropForeignKey
ALTER TABLE "Produk" DROP CONSTRAINT "Produk_idToko_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_idPengguna_fkey";

-- DropForeignKey
ALTER TABLE "Toko" DROP CONSTRAINT "Toko_idPengguna_fkey";

-- DropForeignKey
ALTER TABLE "Toko" DROP CONSTRAINT "Toko_idRegion_fkey";

-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "idPengguna",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Region" DROP CONSTRAINT "Region_pkey",
DROP COLUMN "idRegion",
DROP COLUMN "namaRegion",
ADD COLUMN     "regionId" SERIAL NOT NULL,
ADD COLUMN     "regionName" TEXT NOT NULL,
ADD CONSTRAINT "Region_pkey" PRIMARY KEY ("regionId");

-- DropTable
DROP TABLE "DetailPesanan";

-- DropTable
DROP TABLE "Favorit";

-- DropTable
DROP TABLE "Kategori";

-- DropTable
DROP TABLE "ListPotonganHarga";

-- DropTable
DROP TABLE "Pengguna";

-- DropTable
DROP TABLE "Peran";

-- DropTable
DROP TABLE "Pesanan";

-- DropTable
DROP TABLE "Produk";

-- DropTable
DROP TABLE "Toko";

-- CreateTable
CREATE TABLE "Role" (
    "roleId" SERIAL NOT NULL,
    "roleName" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("roleId")
);

-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "userName" TEXT NOT NULL,
    "userImage" TEXT,
    "userPhoneNumber" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "regionId" INTEGER,
    "signUpDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Bakery" (
    "bakeryId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "bakeryName" TEXT NOT NULL,
    "bakeryImage" TEXT NOT NULL,
    "bakeryDescription" TEXT NOT NULL,
    "bakeryPhoneNumber" TEXT NOT NULL,
    "openingTime" TIMESTAMP(3) NOT NULL,
    "closingTime" TIMESTAMP(3) NOT NULL,
    "regionId" INTEGER NOT NULL,

    CONSTRAINT "Bakery_pkey" PRIMARY KEY ("bakeryId")
);

-- CreateTable
CREATE TABLE "Category" (
    "categoryId" SERIAL NOT NULL,
    "categoryName" TEXT NOT NULL,
    "categoryImage" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("categoryId")
);

-- CreateTable
CREATE TABLE "Product" (
    "productId" SERIAL NOT NULL,
    "bakeryId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "productName" TEXT NOT NULL,
    "productPrice" DECIMAL(10,2) NOT NULL,
    "productImage" TEXT NOT NULL,
    "productDescription" TEXT NOT NULL,
    "productExpirationDate" TIMESTAMP(3) NOT NULL,
    "productStock" INTEGER NOT NULL,
    "isActive" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "ListDiscount" (
    "discountId" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "discountAmount" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "ListDiscount_pkey" PRIMARY KEY ("discountId")
);

-- CreateTable
CREATE TABLE "Order" (
    "orderId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "orderStatus" INTEGER NOT NULL,
    "orderTotalPrice" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "OrderDetail" (
    "orderDetailId" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "productQuantity" INTEGER NOT NULL,
    "productTotalPrice" INTEGER NOT NULL,

    CONSTRAINT "OrderDetail_pkey" PRIMARY KEY ("orderDetailId")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "favoriteId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "bakeryId" INTEGER NOT NULL,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("favoriteId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Bakery_userId_key" ON "Bakery"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_bakeryId_key" ON "Favorite"("userId", "bakeryId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("roleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("regionId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bakery" ADD CONSTRAINT "Bakery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bakery" ADD CONSTRAINT "Bakery_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("regionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_bakeryId_fkey" FOREIGN KEY ("bakeryId") REFERENCES "Bakery"("bakeryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("categoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListDiscount" ADD CONSTRAINT "ListDiscount_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("orderId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_bakeryId_fkey" FOREIGN KEY ("bakeryId") REFERENCES "Bakery"("bakeryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
