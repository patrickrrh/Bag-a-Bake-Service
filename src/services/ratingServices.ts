import { Rating } from "@prisma/client";
import databaseService from "../script";

export interface CreateRatingInput {
    orderId: number;
    rating: number;
    review: string;
}

export class RatingServices {
    public async createRating(rating: CreateRatingInput): Promise<Rating> {
        try {
            return await databaseService.getClient().rating.create({
                data: rating
            })
        } catch (error) {
            console.log("[src][services][RatingServices][createRating] ", error)
            throw new Error("Failed to create rating")
        }
    }

    public async checkIsOrderRated(orderId: number): Promise<Boolean> {
        try {
            const rating = await databaseService.getClient().rating.findFirst({
                where: {
                    orderId
                }
            })

            return rating !== null
        } catch (error) {
            console.log("[src][services][RatingServices][checkIsBakeryRated] ", error)
            throw new Error("Failed to check is bakery rated")
        }
    }

    public async findRatingByBakery(bakeryId: number): Promise<Rating[]> {
        try {
            return await databaseService.getClient().rating.findMany({
                where: {
                    order: {
                        bakeryId
                    }
                }
            })
        } catch (error) {
            console.log("[src][services][RatingServices][findRatingByBakery] ", error)
            throw new Error("Failed to find rating by bakery")
        }
    }
}