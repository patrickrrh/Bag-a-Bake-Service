import { NextFunction, Request, Response } from "express";
import { BakeryServices } from "../services/bakeryServices";
import { ProductServices } from "../services/productServices";
import { RatingServices } from "../services/ratingServices";
import { Bakery } from "@prisma/client";
import { calculateDiscountPercentage, getTodayPrice } from "../utilities/productUtils";
import getDistance from "geolib/es/getPreciseDistance";
import { getPreciseDistance } from "geolib";

const bakeryServices = new BakeryServices();
const productServices = new ProductServices();
const ratingServices = new RatingServices();

export class BakeryController {
    public async findBakeryById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { bakeryId } = req.body;

            const bakery = await bakeryServices.findBakeryById(bakeryId);

            const ratings = await ratingServices.findRatingByBakery(bakeryId);

            const totalRatings = ratings.reduce((sum, r) => sum + r.rating, 0);
            const averageRating = ratings.length > 0 ? (totalRatings / ratings.length).toFixed(1) : '0.0'; 
            const reviewCount = ratings.filter((r) => r.review !== '').length;

            if (bakery?.product) {
                bakery.product = bakery.product.map((product) => {
                    const todayPrice = getTodayPrice(product);
                    const discountPercentage = calculateDiscountPercentage(product.productPrice, todayPrice);

                    return {
                        ...product,
                        todayPrice,
                        discountPercentage,
                    };
                });
            }

            res.status(200).json({
                status: 200,
                data: { bakery, prevRating: { averageRating, reviewCount } }
            });
        } catch (error) {
            console.log("[src][controllers][BakeryController][findBakeryById] ", error);
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

    public async findBakeryWithFilters(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { categoryId, userLocationFilter, expiringProducts } = req.body;
            const userLocation = { latitude: req.body.latitude, longitude: req.body.longitude };

            const currentTime = new Date();
            const currentHour = currentTime.getHours().toString().padStart(2, '0');
            const currentMinute = currentTime.getMinutes().toString().padStart(2, '0');
            const formattedTime = `${currentHour}:${currentMinute}`;

            let bakeries: Bakery[] | undefined;

            if (Array.isArray(categoryId) && categoryId.length > 0) {
                const categoryBakeries = await bakeryServices.findBakeryByCategory(categoryId, formattedTime);
                bakeries = bakeries
                    ? bakeries.filter(bakery => categoryBakeries?.some(categoryBakery => categoryBakery.bakeryId === bakery.bakeryId)) :
                    categoryBakeries;
            }

            if (expiringProducts) {
                const expiringProducts = await productServices.findExpiringProducts(formattedTime);

                if (!expiringProducts) {
                    console.log("[src][controllers][BakeryController][findBakeryByExpiringProducts] No expiring products");
                    res.status(404).json({
                        status: 404,
                        message: "No expiring products"
                    });
                    return;
                }

                const expiringBakeriesMap = new Map<number, Bakery>();

                for (const product of expiringProducts) {
                    const bakery = await bakeryServices.findBakeryById(product.bakeryId);
                    if (bakery && !expiringBakeriesMap.has(bakery.bakeryId)) {
                        expiringBakeriesMap.set(bakery.bakeryId, bakery);
                    }
                }

                const expiringBakeries = Array.from(expiringBakeriesMap.values());

                bakeries = bakeries
                    ? bakeries.filter(bakery => expiringBakeries.some(expBakery => expBakery.bakeryId === bakery.bakeryId))
                    : expiringBakeries;
            }

            if (!bakeries) {
                bakeries = await bakeryServices.findAllBakery(formattedTime);
            }

            const updatedBakeries = bakeries.map((bakery) => {
                const bakeryLocation = { latitude: bakery.bakeryLatitude, longitude: bakery.bakeryLongitude };

                const distance = getPreciseDistance(userLocation, bakeryLocation, 0.01);
                const distanceInKm = parseFloat((distance / 1000).toFixed(2));

                return {
                    ...bakery,
                    distanceInKm
                };
            });

            if (userLocationFilter) {
                const top5NearestBakeries = updatedBakeries
                    .sort((a, b) => a.distanceInKm - b.distanceInKm)
                    .slice(0, 5);
                res.status(200).json({
                    status: 200,
                    data: top5NearestBakeries,
                });
            } else {
                res.status(200).json({
                    status: 200,
                    data: updatedBakeries,
                });
            }
        } catch (error) {
            console.log("[src][controllers][BakeryController][findBakeryWithFilters] ", error);
            next(error);
        }
    }

    public async updateBakery(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { bakeryId, ...updateData } = req.body;

            const updatedBakery = await bakeryServices.updateBakeryById(parseInt(bakeryId), updateData);

            if (!updatedBakery) {
                console.log("[src][controllers][BakeryController][updateBakery] Bakery not found");
                res.status(404).json({ error: 'Bakery not found' });
                return;
            }

            console.log("[src][controllers][BakeryController][updateBakery] Bakery updated successfully");
            res.status(200).json({ message: 'Bakery updated successfully', bakery: updatedBakery });
        } catch (error) {
            console.log("[src][controllers][BakeryController][updateBakery] ", error);
            next(error);
        }
    }

}