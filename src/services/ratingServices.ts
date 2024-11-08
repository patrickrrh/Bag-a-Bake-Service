import { Rating } from "@prisma/client";
import databaseService from "../script";

export interface CreateRatingInput {
    userId: number;
    bakeryId: number;
    rating: number;
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
}