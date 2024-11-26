import { NextFunction, Request, Response } from "express";
import { RatingServices } from "../services/ratingServices";

const ratingServices = new RatingServices();

export class RatingController {
    public async createRating(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { orderId, rating, review } = req.body;
    
            if (!orderId || !rating) {
                console.log("[src][controllers][RatingController][createRating] orderId or rating is required");
                res.status(400).send("orderId or rating is required");
                return;
            }

            const createdRating = await ratingServices.createRating({ orderId, rating, review });
            res.status(201).json({
                status: 201,
                data: createdRating
            })
        } catch (error) {
            console.log("[src][controllers][RatingController][createRating] ", error);
            next(error);
        }
    }

    public async findBakeryRatingWithUserDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { bakeryId, star } = req.body;
            const ratings = await ratingServices.findBakeryRatingWithUserDetail(bakeryId);
            const filteredRatings = star ? ratings.filter(r => r.rating == star) : ratings;

            const totalRatings = ratings.reduce((sum, r) => sum + r.rating, 0);
            const averageRating = ratings.length > 0 ? totalRatings / ratings.length : 0;
            const reviewCount = ratings.filter((r) => r.review !== '').length;

            res.status(200).json({
                status: 200,
                data: filteredRatings, averageRating, reviewCount
            })
        } catch (error) {
            console.log("[src][controllers][RatingController][findBakeryRatingWithUserDetail] ", error);
            next(error);
        }
    }
}