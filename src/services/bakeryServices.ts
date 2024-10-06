import { Bakery } from "@prisma/client";
import databaseService from "../script";

export interface CreateBakeryInput {
    userId: number;
    regionId: number;
    bakeryName: string;
    bakeryPhoneNumber: string;
    bakeryImage: string;
    bakeryDescription: string;
    openingTime: string;
    closingTime: string;
}

export class BakeryServices {
    public async createBakery(bakery: CreateBakeryInput): Promise<Bakery> {
        try {
            return await databaseService.getClient().bakery.create({
                data: bakery
            })
        } catch (error) {
            console.log("[src][services][BakeryServices][createBakery] ", error)
            throw new Error("Failed to create bakery")
        }
    }
}