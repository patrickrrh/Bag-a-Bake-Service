-- CreateTable
CREATE TABLE "Peran" (
    "idPeran" SERIAL NOT NULL,
    "namaPeran" TEXT NOT NULL,

    CONSTRAINT "Peran_pkey" PRIMARY KEY ("idPeran")
);

-- CreateTable
CREATE TABLE "Pengguna" (
    "idPengguna" SERIAL NOT NULL,
    "idPeran" INTEGER NOT NULL,
    "namaPengguna" TEXT NOT NULL,
    "noTeleponPengguna" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "alamatPengguna" TEXT NOT NULL,
    "tanggalDaftar" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pengguna_pkey" PRIMARY KEY ("idPengguna")
);

-- CreateTable
CREATE TABLE "Toko" (
    "idToko" SERIAL NOT NULL,
    "idPengguna" INTEGER NOT NULL,
    "namaToko" TEXT NOT NULL,
    "gambarToko" TEXT NOT NULL,
    "deskripsiToko" TEXT NOT NULL,
    "jamBuka" TIMESTAMP(3) NOT NULL,
    "jamTutup" TIMESTAMP(3) NOT NULL,
    "alamatToko" TEXT NOT NULL,
    "noTeleponToko" TEXT NOT NULL,

    CONSTRAINT "Toko_pkey" PRIMARY KEY ("idToko")
);

-- CreateTable
CREATE TABLE "Kategori" (
    "idKategori" SERIAL NOT NULL,
    "namaKategori" TEXT NOT NULL,

    CONSTRAINT "Kategori_pkey" PRIMARY KEY ("idKategori")
);

-- CreateTable
CREATE TABLE "Produk" (
    "idProduk" SERIAL NOT NULL,
    "idToko" INTEGER NOT NULL,
    "idKategori" INTEGER NOT NULL,
    "namaProduk" TEXT NOT NULL,
    "harga" DECIMAL(10,2) NOT NULL,
    "gambarProduk" TEXT NOT NULL,
    "deskripsiProduk" TEXT NOT NULL,
    "tanggalKedaluwarsa" TIMESTAMP(3) NOT NULL,
    "stok" INTEGER NOT NULL,
    "isActive" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Produk_pkey" PRIMARY KEY ("idProduk")
);

-- CreateTable
CREATE TABLE "ListPotonganHarga" (
    "idLPH" SERIAL NOT NULL,
    "idProduk" INTEGER NOT NULL,
    "jumlah" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "ListPotonganHarga_pkey" PRIMARY KEY ("idLPH")
);

-- CreateTable
CREATE TABLE "Pesanan" (
    "idPesanan" SERIAL NOT NULL,
    "idPengguna" INTEGER NOT NULL,
    "tanggalPesanan" TIMESTAMP(3) NOT NULL,
    "statusPesanan" INTEGER NOT NULL,
    "totalHarga" INTEGER NOT NULL,

    CONSTRAINT "Pesanan_pkey" PRIMARY KEY ("idPesanan")
);

-- CreateTable
CREATE TABLE "DetailPesanan" (
    "idDetailPesanan" SERIAL NOT NULL,
    "idPesanan" INTEGER NOT NULL,
    "idProduk" INTEGER NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "jumlahHarga" INTEGER NOT NULL,

    CONSTRAINT "DetailPesanan_pkey" PRIMARY KEY ("idDetailPesanan")
);

-- CreateTable
CREATE TABLE "Favorit" (
    "idFavorit" SERIAL NOT NULL,
    "idPengguna" INTEGER NOT NULL,
    "idToko" INTEGER NOT NULL,

    CONSTRAINT "Favorit_pkey" PRIMARY KEY ("idFavorit")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "jti" TEXT NOT NULL,
    "hashedToken" TEXT NOT NULL,
    "idPengguna" INTEGER NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("jti")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pengguna_email_key" ON "Pengguna"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Toko_idPengguna_key" ON "Toko"("idPengguna");

-- CreateIndex
CREATE UNIQUE INDEX "Favorit_idPengguna_idToko_key" ON "Favorit"("idPengguna", "idToko");

-- AddForeignKey
ALTER TABLE "Pengguna" ADD CONSTRAINT "Pengguna_idPeran_fkey" FOREIGN KEY ("idPeran") REFERENCES "Peran"("idPeran") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Toko" ADD CONSTRAINT "Toko_idPengguna_fkey" FOREIGN KEY ("idPengguna") REFERENCES "Pengguna"("idPengguna") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produk" ADD CONSTRAINT "Produk_idToko_fkey" FOREIGN KEY ("idToko") REFERENCES "Toko"("idToko") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produk" ADD CONSTRAINT "Produk_idKategori_fkey" FOREIGN KEY ("idKategori") REFERENCES "Kategori"("idKategori") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListPotonganHarga" ADD CONSTRAINT "ListPotonganHarga_idProduk_fkey" FOREIGN KEY ("idProduk") REFERENCES "Produk"("idProduk") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pesanan" ADD CONSTRAINT "Pesanan_idPengguna_fkey" FOREIGN KEY ("idPengguna") REFERENCES "Pengguna"("idPengguna") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailPesanan" ADD CONSTRAINT "DetailPesanan_idPesanan_fkey" FOREIGN KEY ("idPesanan") REFERENCES "Pesanan"("idPesanan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailPesanan" ADD CONSTRAINT "DetailPesanan_idProduk_fkey" FOREIGN KEY ("idProduk") REFERENCES "Produk"("idProduk") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_idPengguna_fkey" FOREIGN KEY ("idPengguna") REFERENCES "Pengguna"("idPengguna") ON DELETE RESTRICT ON UPDATE CASCADE;
