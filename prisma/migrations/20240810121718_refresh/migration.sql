-- CreateTable
CREATE TABLE "RefreshToken" (
    "jti" SERIAL NOT NULL,
    "hashedToken" TEXT NOT NULL,
    "idPengguna" INTEGER NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("jti")
);

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_idPengguna_fkey" FOREIGN KEY ("idPengguna") REFERENCES "Pengguna"("idPengguna") ON DELETE RESTRICT ON UPDATE CASCADE;
