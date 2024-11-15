import { NextFunction, Request, Response } from "express";
import { BakeryServices } from "../services/bakeryServices";
import { ProductServices } from "../services/productServices";
import { RatingServices } from "../services/ratingServices";
import { Bakery } from "@prisma/client";

const bakeryServices = new BakeryServices();
const productServices = new ProductServices();
const ratingServices = new RatingServices();

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

    public async findBakeryById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { bakeryId } = req.body;

            const bakery = await bakeryServices.findBakeryById(bakeryId);

            const ratings = await ratingServices.findRatingByBakery(bakeryId);

            const totalRatings = ratings.reduce((sum, r) => sum + r.rating, 0);
            const averageRating = ratings.length > 0 ? totalRatings / ratings.length : 0;
            const reviewCount = ratings.filter((r) => r.review !== '').length;

            res.status(200).json({
                status: 200,
                data: { bakery, prevRating: { averageRating, reviewCount } }
            });
        } catch (error) {
            console.log("[src][controllers][BakeryController][findBakeryById] ", error);
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

    public async findBakeryByExpiringProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const expiringProducts = await productServices.findExpiringProducts();

            if (!expiringProducts) {
                console.log("[src][controllers][BakeryController][findBakeryByExpiringProducts] No expiring products");
                res.status(404).json({
                    status: 404,
                    message: "No expiring products"
                });
                return;
            }

            const bakeries: Bakery[] = [];
            for (const product of expiringProducts) {
                const bakery = await bakeryServices.findBakeryById(product.bakeryId);
                if (bakery) {
                    bakeries.push(bakery);
                }
            }

            res.status(200).json({
                status: 200,
                data: bakeries
            });
        } catch (error) {
            console.log("[src][controllers][BakeryController][findBakeryByExpiringProducts] ", error);
            next(error);
        }
    }

    public async findBakeryWithFilters(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { categoryId, regionId, expiringProducts } = req.body;
            let bakeries: Bakery[] | undefined;

            if (categoryId.length > 0) {
                const categoryBakeries = await bakeryServices.findBakeryByCategory(categoryId);
                bakeries = bakeries
                    ? bakeries.filter(bakery => categoryBakeries?.some(categoryBakery => categoryBakery.bakeryId === bakery.bakeryId)) :
                    categoryBakeries;
            }

            if (regionId) {
                const regionBakeries = await bakeryServices.findBakeryByRegion(regionId);
                bakeries = bakeries
                    ? bakeries.filter(bakery => regionBakeries?.some(regionBakery => regionBakery.bakeryId === bakery.bakeryId)) :
                    regionBakeries;
            }

            if (expiringProducts) {
                const expiringProducts = await productServices.findExpiringProducts();

                if (!expiringProducts) {
                    console.log("[src][controllers][BakeryController][findBakeryByExpiringProducts] No expiring products");
                    res.status(404).json({
                        status: 404,
                        message: "No expiring products"
                    });
                    return;
                }

                const expiringBakeries: Bakery[] = [];
                for (const product of expiringProducts) {
                    const bakery = await bakeryServices.findBakeryById(product.bakeryId);
                    if (bakery) {
                        expiringBakeries.push(bakery);
                    }
                }

                bakeries = bakeries
                    ? bakeries.filter(bakery => expiringBakeries.some(expBakery => expBakery.bakeryId === bakery.bakeryId))
                    : expiringBakeries;
            }

            if (!bakeries) {
                bakeries = await bakeryServices.findAllBakery();
            }
            
            res.status(200).json({
                status: 200,
                data: bakeries
            })
        } catch (error) {
            console.log("[src][controllers][BakeryController][findBakeryWithFilters] ", error);
            next(error);
        }
    }
}