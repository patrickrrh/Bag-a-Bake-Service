import { Toko } from "@prisma/client";
import databaseService from "../script";

interface CreateTokoInput {
    idPengguna: number;
    namaToko: string;
    gambarToko: string;
    deskripsiToko: string;
    jamBuka: Date;
    jamTutup: Date;
    alamatToko: string;
    noTeleponToko: string;
}

export class TokoServices {
    public async createToko(toko: CreateTokoInput): Promise<Toko> {
        try {
            toko.jamBuka = new Date(toko.jamBuka);
            toko.jamTutup = new Date(toko.jamTutup);

            return await databaseService.getClient().toko.create({
                data: toko
            })
        } catch (error) {
            throw new Error("Failed to create toko")
        }
    }
}