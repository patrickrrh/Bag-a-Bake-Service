"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingController = void 0;
const ratingServices_1 = require("../services/ratingServices");
const ratingServices = new ratingServices_1.RatingServices();
class RatingController {
    createRating(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId, rating, review } = req.body;
                if (!orderId || !rating) {
                    console.log("[src][controllers][RatingController][createRating] orderId or rating is required");
                    res.status(400).send("orderId or rating is required");
                    return;
                }
                const createdRating = yield ratingServices.createRating({ orderId, rating, review });
                res.status(201).json({
                    status: 201,
                    data: createdRating
                });
            }
            catch (error) {
                console.log("[src][controllers][RatingController][createRating] ", error);
                next(error);
            }
        });
    }
    findBakeryRatingWithUserDetail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bakeryId, star } = req.body;
                const filterStar = star === "Semua" ? null : star;
                const ratings = yield ratingServices.findBakeryRatingWithUserDetail(bakeryId);
                const filteredRatings = filterStar ? ratings.filter(r => r.rating == star) : ratings;
                const totalRatings = ratings.reduce((sum, r) => sum + r.rating, 0);
                const averageRating = ratings.length > 0 ? (totalRatings / ratings.length).toFixed(1) : '0.0';
                const ratingCount = ratings.length;
                const reviewCount = ratings.filter((r) => r.review !== '').length;
                res.status(200).json({
                    status: 200,
                    data: { filteredRatings, ratingCount, averageRating, reviewCount }
                });
            }
            catch (error) {
                console.log("[src][controllers][RatingController][findBakeryRatingWithUserDetail] ", error);
                next(error);
            }
        });
    }
}
exports.RatingController = RatingController;
