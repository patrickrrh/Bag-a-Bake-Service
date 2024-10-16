import { NextFunction, Request, Response } from "express";
import { BakeryServices } from "../services/bakeryServices";

const bakeryServices = new BakeryServices(); 

export class BakeryController {
    public async findAllBakery(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const bakery = await bakeryServices.findAllBakery();
            res.status(200).json({
                status: 200,
                data: bakery
            });
        } catch (error) {
            console.log("[src][controllers][BakeryController][findAllBakery] ", error);
            next(error);
        }
    }

    public async findBakeryByCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { categoryId } = req.body;

            const bakery = await bakeryServices.findBakeryByCategory(categoryId);
            res.status(200).json({
                status: 200,
                data: bakery
            });
        } catch (error) {
            console.log("[src][controllers][BakeryController][findBakeryByCategory] ", error);
            next(error);
        }
    }

    public async findBakeryByProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId } = req.body;

            const bakery = await bakeryServices.findBakeryByProduct(productId);
            res.status(200).json({
                status: 200,
                data: bakery
            });
        } catch (error) {
            console.log("[src][controllers][BakeryController][findBakeryByProduct] ", error);
            next(error);
        }
    }

    public async findBakeryByRegion(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { regionId } = req.body;

            const bakery = await bakeryServices.findBakeryByRegion(regionId);
            res.status(200).json({
                status: 200,
                data: bakery
            });
        } catch (error) {
            console.log("[src][controllers][BakeryController][findBakeryByRegion] ", error);
            next(error);
        }
    }
}