import { Favorite } from "@prisma/client";
import databaseService from "../script";

export interface CreateFavoriteInput {
    userId: number;
    bakeryId: number;
}

export class FavoriteServices {
    public async addFavorite(favorite: CreateFavoriteInput): Promise<Favorite> {
        try {
            return await databaseService.getClient().favorite.create({
                data: favorite
            })
        } catch (error) {
            console.log("[src][services][FavoriteServices][createFavorite] ", error)
            throw new Error("Failed to create favorite")
        }
    }

    public async removeFavorite(favoriteId: number): Promise<Favorite> {
        try {
            return await databaseService.getClient().favorite.delete({
                where: {
                    favoriteId: favoriteId
                }
            })
        } catch (error) {
            console.log("[src][services][FavoriteServices][removeFavorite] ", error)
            throw new Error("Failed to remove favorite")
        }
    }

    public async findAllFavorite(userId: number): Promise<Favorite[]> {
        try {
            return await databaseService.getClient().favorite.findMany({
                where: {
                    userId
                },
                include: {
                    bakery: {
                        include: {
                            regionBakery: true
                        }
                    }
                }
            })
        } catch (error) {
            console.log("[src][services][FavoriteServices][findAllFavorite] ", error)
            throw new Error("Failed to find favorite")
        }
    }
}