import { Bakery, Prisma } from "@prisma/client";
import databaseService from "../script";

export interface CreateBakeryInput {
    userId: number;
    bakeryName: string;
    bakeryPhoneNumber: string;
    bakeryImage: string;
    bakeryDescription: string;
    openingTime: string;
    closingTime: string;
    bakeryAddress: string;
    bakeryLatitude: number;
    bakeryLongitude: number;
}

type BakeryWithProduct = Prisma.BakeryGetPayload<{
    include: {
        product: {
            include: {
                discount: true
            }
        }
    }
}>

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

    public async findAllBakery(currentTime?: string): Promise<Bakery[]> {
        try {
            return await databaseService.getClient().bakery.findMany({
                where: {
                    openingTime: {
                        lte: currentTime
                    },
                    closingTime: {
                        gte: currentTime
                    }
                },
                include: {
                    favorite: true
                }
            })
        } catch (error) {
            console.log("[src][services][BakeryServices][findAllBakery] ", error)
            throw new Error("Failed to find bakery")
        }
    }

    public async findBakeryById(bakeryId: number): Promise<BakeryWithProduct | null> {
        try {
            return await databaseService.getClient().bakery.findUnique({
                where: {
                    bakeryId
                },
                include: {
                    product: {
                        where: {
                            isActive: 1,
                            productStock: { gt: 0 }
                        },
                        include: {
                            discount: true
                        }
                    },
                    favorite: true
                }
            })
        } catch (error) {
            console.log("[src][services][BakeryServices][findBakeryById] ", error)
            throw new Error("Failed to find bakery")
        }
    }

    public async findBakeryByCategory(categoryId: number[], currentTime?: string): Promise<Bakery[] | []> {
        try {
            const distinctBakeryIds = await databaseService.getClient().product.findMany({
                where: {
                    categoryId: {
                        in: categoryId
                    },
                    bakery: {
                        openingTime: {
                            lte: currentTime
                        },
                        closingTime: {
                            gte: currentTime
                        }
                    },
                    isActive: 1,
                    productStock: { gt: 0 },
                },
                select: {
                    bakeryId: true,
                },
                distinct: ['bakeryId']
            }); 

            const bakeryIds = distinctBakeryIds.map((bakery) => bakery.bakeryId);

            if (bakeryIds.length === 0) {
                return [];
            }
            
            const bakeries = await databaseService.getClient().bakery.findMany({
                where: {
                    bakeryId: {
                        in: bakeryIds
                    }
                },
                include: {
                    favorite: true,
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

    public async updateBakeryById(bakeryId: number, updateData: Partial<Bakery>): Promise<Bakery | null> {
        try {
            return await databaseService.getClient().bakery.update({
                where: { bakeryId },
                data: updateData,
            });
        } catch (error) {
            console.log("[src][services][BakeryServices][updateBakeryById] ", error);
            throw new Error("Failed to update bakery");
        }
    }
    
}