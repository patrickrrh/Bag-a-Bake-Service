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

    public async findAllBakery(): Promise<Bakery[]> {
        try {
            return await databaseService.getClient().bakery.findMany({
                include: {
                    regionBakery: true,
                    favorite: true
                }
            })
        } catch (error) {
            console.log("[src][services][BakeryServices][findAllBakery] ", error)
            throw new Error("Failed to find bakery")
        }
    }

    public async findBakeryByCategory(categoryId: number[]): Promise<Bakery[] | null> {
        try {
            const distinctBakeryIds = await databaseService.getClient().product.findMany({
                where: {
                    categoryId: {
                        in: categoryId
                    }
                },
                select: {
                    bakeryId: true
                },
                distinct: ['bakeryId']
            });

            const bakeryIds = distinctBakeryIds.map((bakery) => bakery.bakeryId);

            if (bakeryIds.length === 0) {
                return null;
            }
            
            const bakeries = await databaseService.getClient().bakery.findMany({
                where: {
                    bakeryId: {
                        in: bakeryIds
                    }
                },
                include: {
                    regionBakery: true
                }
            });

            return bakeries;
        } catch (error) {
            console.log("[src][services][BakeryServices][findBakeryByCategory] ", error)
            throw new Error("Failed to find bakery")
        }
    }

    public async findBakeryByProduct(productId: number): Promise<Bakery | null> {
        try {
            const bakery = await databaseService.getClient().product.findUnique({
                where: {
                    productId: productId,
                },
                include: {
                    bakery: {
                        include: {
                            regionBakery: true,
                            product: true
                        }
                    },
                },
            });

            return bakery?.bakery || null;
        } catch (error) {
            console.log("[src][services][BakeryServices][findBakeryByProduct] ", error)
            throw new Error("Failed to find bakery")
        }
    }

    public async findBakeryByRegion(regionId: number): Promise<Bakery[] | null> {
        try {
            const bakery = await databaseService.getClient().bakery.findMany({
                where: {
                    regionId: regionId
                },
                include: {
                    regionBakery: true
                }
            })

            return bakery
        } catch (error) {
            console.log("[src][services][BakeryServices][findBakeryByRegion] ", error)
            throw new Error("Failed to find bakery")
        }
    }

    public async findBakeryByUser(userId: number): Promise<Bakery | null> {
        try {
            const bakery = await databaseService.getClient().bakery.findUnique({
                where: {
                    userId: userId
                },
                include: {
                    regionBakery: true
                }
            })

            return bakery
        } catch (error) {
            console.log("[src][services][BakeryServices][findBakeryByUser] ", error)
            throw new Error("Failed to find bakery")
        }
    }
}