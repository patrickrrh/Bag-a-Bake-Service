import { NextFunction, Request, Response } from "express";
import { RatingServices } from "../services/ratingServices";

const ratingServices = new RatingServices();

export class RatingController {
    public async createRating(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId, bakeryId, rating } = req.body;
    
            if (!userId || !bakeryId || !rating) {
                console.log("[src][controllers][RatingController][createRating] userId, bakeryId or rating is required");
                res.status(400).send("userId, bakeryId or rating is required");
                return;
            }

            const createdRating = await ratingServices.createRating({ userId, bakeryId, rating });
            res.status(201).json({
                status: 201,
                data: createdRating
            })
        } catch (error) {
            console.log("[src][controllers][RatingController][createRating] ", error);
            next(error);
        }
    }
}