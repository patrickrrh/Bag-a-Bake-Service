import { NextFunction, Request, Response } from "express";
import { BakeryServices } from "../services/bakeryServices";
import { ProductServices } from "../services/productServices";
import { RatingServices } from "../services/ratingServices";
import { Bakery } from "@prisma/client";
import { calculateDiscountPercentage, getTodayPrice } from "../utilities/productUtils";
import getDistance from "geolib/es/getPreciseDistance";
import { getPreciseDistance } from "geolib";
import { UserServices } from "../services/userServices";
import { sendMail } from "../config/mailer";
import { generateActivateBakeryMailContent, generateDeactivateBakeryMailContent, generateRejectBakeryMailContent } from "../utilities/mailHandler";
import path from "path";
import fs from "fs";

const bakeryServices = new BakeryServices();
const productServices = new ProductServices();
const ratingServices = new RatingServices();
const userServices = new UserServices();

export class BakeryController {
    public async findBakeryById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { bakeryId } = req.body;

            const bakery = await bakeryServices.findBakeryById(bakeryId);

            if (!bakery) {
                res.status(404).json({
                    status: 404,
                    message: 'Bakery not found',
                });
                return;
            }

            const ratings = await ratingServices.findRatingByBakery(bakeryId);

            const totalRatings = ratings.reduce((sum, r) => sum + r.rating, 0);
            const averageRating = ratings.length > 0 ? (totalRatings / ratings.length).toFixed(1) : '0.0';
            const reviewCount = ratings.filter((r) => r.review !== '').length;

            const currentTime = new Date();
            const currentHour = currentTime.getHours().toString().padStart(2, '0');
            const currentMinute = currentTime.getMinutes().toString().padStart(2, '0');
            const formattedTime = `${currentHour}:${currentMinute}`;

            const currentTimeInMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
            const openingTimeInMinutes = parseInt(bakery.openingTime.split(':')[0]) * 60 + parseInt(bakery.openingTime.split(':')[1]);
            const closingTimeInMinutes = parseInt(bakery.closingTime.split(':')[0]) * 60 + parseInt(bakery.closingTime.split(':')[1]);

            const isClosed = currentTimeInMinutes < openingTimeInMinutes || currentTimeInMinutes > closingTimeInMinutes;

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
                data: { bakery, prevRating: { averageRating, reviewCount }, isClosed }
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
                const categoryBakeries = await bakeryServices.findBakeryByCategory(categoryId);
                bakeries = bakeries
                    ? bakeries.filter(bakery => categoryBakeries?.some(categoryBakery => categoryBakery.bakeryId === bakery.bakeryId)) :
                    categoryBakeries;
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
                bakeries = await bakeryServices.findAllBakery();
            }

            const updatedBakeries = await Promise.all(bakeries.map(async (bakery) => {
                const currentTimeInMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
                const openingTimeInMinutes = parseInt(bakery.openingTime.split(':')[0]) * 60 + parseInt(bakery.openingTime.split(':')[1]);
                const closingTimeInMinutes = parseInt(bakery.closingTime.split(':')[0]) * 60 + parseInt(bakery.closingTime.split(':')[1]);

                const isClosed = currentTimeInMinutes < openingTimeInMinutes || currentTimeInMinutes > closingTimeInMinutes;

                const bakeryLocation = { latitude: bakery.bakeryLatitude, longitude: bakery.bakeryLongitude };
                const distance = getPreciseDistance(userLocation, bakeryLocation, 0.01);
                const distanceInKm = parseFloat((distance / 1000).toFixed(2));

                const ratings = await ratingServices.findRatingByBakery(bakery.bakeryId);
                const totalRatings = ratings.reduce((sum, r) => sum + r.rating, 0);
                const averageRating = ratings.length > 0 ? (totalRatings / ratings.length).toFixed(1) : '0.0';
                const reviewCount = ratings.filter((r) => r.review !== '').length;

                return {
                    ...bakery,
                    isClosed,
                    distanceInKm,
                    rating: {
                        averageRating,
                        reviewCount,
                    },
                };
            }));

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

            const prevBakery = await bakeryServices.findBakeryById(parseInt(bakeryId));
            if (!prevBakery) {
                console.log("[src][controllers][BakeryController][updateBakery] Bakery Not Found");
                res.status(404).json({
                    status: 404,
                    message: "Bakery Not Found",
                });
                return;
            }

            const encodedBakeryImage = req.body.bakeryImage;
            if (encodedBakeryImage) {

                if (prevBakery.bakeryImage) {
                    const oldImagePath = path.join(__dirname, '../uploads/bakery-picture', prevBakery.bakeryImage);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }

                const buffer = Buffer.from(encodedBakeryImage, 'base64');
                const fileName = `bakeryImage-${Date.now()}.jpeg`;

                const filePath = path.join(__dirname, '../uploads/bakery-picture', fileName);
                fs.writeFileSync(filePath, buffer);

                updateData.bakeryImage = path.join(fileName);
            }

            const updatedBakery = await bakeryServices.updateBakeryById(parseInt(bakeryId), updateData);

            console.log("[src][controllers][BakeryController][updateBakery] Bakery updated successfully");
            res.status(200).json({ status: 200, message: 'Bakery updated successfully', bakery: updatedBakery });
        } catch (error) {
            console.log("[src][controllers][BakeryController][updateBakery] ", error);
            next(error);
        }
    }

    public async getUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId } = req.body;
            const user = await userServices.findUserById(userId);
            if (!user) {
                console.log("[src][controllers][BakeryController][getUserId] User not found");
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.status(200).json({ status: 200, data: user });
        } catch (error) {
            console.log("[src][controllers][BakeryController][getUserId] ", error);
            next(error);
        }
    }

    public async findListBakery(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { isActive } = req.body;

            const bakeries = await bakeryServices.findListBakery(isActive);

            if (!bakeries) {
                console.log("[src][controllers][BakeryController][findListBakery] There is no bakery");
                res.status(404).json({ error: 'There is no bakery' });
                return;
            }

            res.status(200).json({ status: 200, data: bakeries });
        } catch (error) {
            console.log("[src][controllers][BakeryController][findListBakery] ", error);
            next(error);
        }
    }

    public async updateBakeryIsActive(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { bakeryId, isActive, email, userName, status, message } = req.body;

            const updatedBakery = await bakeryServices.updateBakeryIsActive(bakeryId, isActive);

            if (!updatedBakery) {
                console.log("[src][controllers][BakeryController][updateBakeryIsActive] Bakery not found");
                res.status(404).json({ error: 'Bakery not found' });
                return;
            }

            let info: any;
            if (isActive === 1) {
                info = sendMail(email, "Bakeri Anda Telah Aktif", generateActivateBakeryMailContent(userName, status, message));
            } else {
                info = sendMail(email, "Bakeri Anda Telah Dinonaktifkan", generateDeactivateBakeryMailContent(userName, status, message));
            }

            if (info) {
                console.log("[src][controllers][AuthController][updateBakeryIsActive] Email sent successfully");
                res.status(200).json({
                    status: 200,
                    message: 'Berhasil mengirim email'
                });
            } else {
                console.log("[src][controllers][AuthController][updateBakeryIsActive] Failed to send email");
                res.status(500).json({
                    status: 500,
                    error: 'Gagal mengirim email'
                });
            }
        } catch (error) {
            console.log("[src][controllers][BakeryController][updateBakeryIsActive] ", error);
            next(error);
        }
    }

    public async deleteBakery(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { bakeryId, email, userName, status, message } = req.body;

            console.log("bakery id at controller", bakeryId)

            const deletedBakery = await bakeryServices.deleteBakery(bakeryId);
            if (!deletedBakery) {
                console.log("[src][controllers][BakeryController][deleteBakery] Bakery not found");
                res.status(404).json({ error: 'Bakery not found' });
                return;
            }

            const info = sendMail(email, "Registrasi Bakeri Anda Ditolak", generateRejectBakeryMailContent(userName, status, message));

            if (info) {
                console.log("[src][controllers][AuthController][deleteBakery] Email sent successfully");
                res.status(200).json({
                    status: 200,
                    message: 'Berhasil mengirim email'
                });
            } else {
                console.log("[src][controllers][AuthController][deleteBakery] Failed to send email");
                res.status(500).json({
                    status: 500,
                    error: 'Gagal mengirim email'
                });
            }
        } catch (error) {
            console.log("[src][controllers][BakeryController][deleteBakery] ", error);
            next(error);
        }
    }
}