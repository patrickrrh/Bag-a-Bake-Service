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
            const { bakeryId } = req.body;
            const ratings = await ratingServices.findBakeryRatingWithUserDetail(bakeryId);
            res.status(200).json({
                status: 200,
                data: ratings
            })
        } catch (error) {
            console.log("[src][controllers][RatingController][findBakeryRatingWithUserDetail] ", error);
            next(error);
        }
    }
}