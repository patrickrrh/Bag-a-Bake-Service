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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingServices = void 0;
const script_1 = __importDefault(require("../script"));
class RatingServices {
    createRating(rating) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield script_1.default.getClient().rating.create({
                    data: rating
                });
            }
            catch (error) {
                console.log("[src][services][RatingServices][createRating] ", error);
                throw new Error("Failed to create rating");
            }
        });
    }
    checkIsOrderRated(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rating = yield script_1.default.getClient().rating.findFirst({
                    where: {
                        orderId
                    }
                });
                return rating !== null;
            }
            catch (error) {
                console.log("[src][services][RatingServices][checkIsBakeryRated] ", error);
                throw new Error("Failed to check is bakery rated");
            }
        });
    }
    findRatingByBakery(bakeryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield script_1.default.getClient().rating.findMany({
                    where: {
                        order: {
                            bakeryId
                        }
                    }
                });
            }
            catch (error) {
                console.log("[src][services][RatingServices][findRatingByBakery] ", error);
                throw new Error("Failed to find rating by bakery");
            }
        });
    }
    findBakeryRatingWithUserDetail(bakeryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield script_1.default.getClient().rating.findMany({
                    where: {
                        order: {
                            bakeryId,
                        },
                    },
                    select: {
                        ratingId: true,
                        orderId: true,
                        rating: true,
                        review: true,
                        createdDate: true,
                        order: {
                            select: {
                                user: {
                                    select: {
                                        userId: true,
                                        userName: true,
                                        userImage: true,
                                    },
                                },
                            },
                        },
                    },
                    orderBy: {
                        createdDate: 'desc',
                    },
                });
            }
            catch (error) {
                console.log("[src][services][RatingServices][findBakeryRatingWithUserDetail] ", error);
                throw new Error("Failed to find bakery rating with user detail");
            }
        });
    }
}
exports.RatingServices = RatingServices;
