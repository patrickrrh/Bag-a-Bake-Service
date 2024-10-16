import { NextFunction, Request, Response } from "express";
import { FavoriteServices } from "../services/favoriteServices";

const favoriteServices = new FavoriteServices();

export class FavoriteController {
    public async addFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId, bakeryId } = req.body;

            if (!userId || !bakeryId) {
                console.log("[src][controllers][FavoriteController][addFavorite] userId or bakeryId is required");
                res.status(400).send("userId or bakeryId is required");
                return;
            }
            
            const favorite = await favoriteServices.addFavorite({ userId, bakeryId });
            res.status(201).json(favorite);
        } catch (error) {
            console.log("[src][controllers][FavoriteController][addFavorite] ", error);
            next(error);
        }
    }

    public async removeFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { favoriteId } = req.body;

            if (!favoriteId) {
                console.log("[src][controllers][FavoriteController][removeFavorite] favoriteId is required");
                res.status(400).send("favoriteId is required");
                return;
            }

            const favorite = await favoriteServices.removeFavorite(favoriteId);
            res.status(200).json(favorite);
        } catch (error) {
            console.log("[src][controllers][FavoriteController][removeFavorite] ", error);
            next(error);
        }
    }

    public async findAllFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId } = req.body;

            const favorites = await favoriteServices.findAllFavorite(userId);
            res.status(200).json({
                status: 200,
                data: favorites
            });
        } catch (error) {
            console.log("[src][controllers][FavoriteController][findAllFavorite] ", error);
            next(error);
        }
    }
}