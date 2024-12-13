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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BakeryController = void 0;
const bakeryServices_1 = require("../services/bakeryServices");
const productServices_1 = require("../services/productServices");
const ratingServices_1 = require("../services/ratingServices");
const productUtils_1 = require("../utilities/productUtils");
const geolib_1 = require("geolib");
const userServices_1 = require("../services/userServices");
const mailer_1 = require("../config/mailer");
const mailHandler_1 = require("../utilities/mailHandler");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const bakeryServices = new bakeryServices_1.BakeryServices();
const productServices = new productServices_1.ProductServices();
const ratingServices = new ratingServices_1.RatingServices();
const userServices = new userServices_1.UserServices();
class BakeryController {
    findBakeryById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bakeryId } = req.body;
                const bakery = yield bakeryServices.findBakeryById(bakeryId);
                if (!bakery) {
                    res.status(404).json({
                        status: 404,
                        message: 'Bakery not found',
                    });
                    return;
                }
                const ratings = yield ratingServices.findRatingByBakery(bakeryId);
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
                if (bakery === null || bakery === void 0 ? void 0 : bakery.product) {
                    bakery.product = bakery.product.map((product) => {
                        const todayPrice = (0, productUtils_1.getTodayPrice)(product);
                        const discountPercentage = (0, productUtils_1.calculateDiscountPercentage)(product.productPrice, todayPrice);
                        return Object.assign(Object.assign({}, product), { todayPrice,
                            discountPercentage });
                    });
                }
                res.status(200).json({
                    status: 200,
                    data: { bakery, prevRating: { averageRating, reviewCount }, isClosed }
                });
            }
            catch (error) {
                console.log("[src][controllers][BakeryController][findBakeryById] ", error);
                next(error);
            }
        });
    }
    findBakeryByProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId } = req.body;
                const bakery = yield bakeryServices.findBakeryByProduct(productId);
                res.status(200).json({
                    status: 200,
                    data: bakery
                });
            }
            catch (error) {
                console.log("[src][controllers][BakeryController][findBakeryByProduct] ", error);
                next(error);
            }
        });
    }
    findBakeryWithFilters(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId, userLocationFilter, expiringProducts } = req.body;
                const userLocation = { latitude: req.body.latitude, longitude: req.body.longitude };
                const currentTime = new Date();
                const currentHour = currentTime.getHours().toString().padStart(2, '0');
                const currentMinute = currentTime.getMinutes().toString().padStart(2, '0');
                const formattedTime = `${currentHour}:${currentMinute}`;
                let bakeries;
                if (Array.isArray(categoryId) && categoryId.length > 0) {
                    const categoryBakeries = yield bakeryServices.findBakeryByCategory(categoryId);
                    bakeries = bakeries
                        ? bakeries.filter(bakery => categoryBakeries === null || categoryBakeries === void 0 ? void 0 : categoryBakeries.some(categoryBakery => categoryBakery.bakeryId === bakery.bakeryId)) :
                        categoryBakeries;
                }
                if (expiringProducts) {
                    const expiringProducts = yield productServices.findExpiringProducts();
                    if (!expiringProducts) {
                        console.log("[src][controllers][BakeryController][findBakeryByExpiringProducts] No expiring products");
                        res.status(404).json({
                            status: 404,
                            message: "No expiring products"
                        });
                        return;
                    }
                    const expiringBakeriesMap = new Map();
                    for (const product of expiringProducts) {
                        const bakery = yield bakeryServices.findBakeryById(product.bakeryId);
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
                    bakeries = yield bakeryServices.findAllBakery();
                }
                const updatedBakeries = yield Promise.all(bakeries.map((bakery) => __awaiter(this, void 0, void 0, function* () {
                    const currentTimeInMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
                    const openingTimeInMinutes = parseInt(bakery.openingTime.split(':')[0]) * 60 + parseInt(bakery.openingTime.split(':')[1]);
                    const closingTimeInMinutes = parseInt(bakery.closingTime.split(':')[0]) * 60 + parseInt(bakery.closingTime.split(':')[1]);
                    const isClosed = currentTimeInMinutes < openingTimeInMinutes || currentTimeInMinutes > closingTimeInMinutes;
                    const bakeryLocation = { latitude: bakery.bakeryLatitude, longitude: bakery.bakeryLongitude };
                    const distance = (0, geolib_1.getPreciseDistance)(userLocation, bakeryLocation, 0.01);
                    const distanceInKm = parseFloat((distance / 1000).toFixed(2));
                    const ratings = yield ratingServices.findRatingByBakery(bakery.bakeryId);
                    const totalRatings = ratings.reduce((sum, r) => sum + r.rating, 0);
                    const averageRating = ratings.length > 0 ? (totalRatings / ratings.length).toFixed(1) : '0.0';
                    const reviewCount = ratings.filter((r) => r.review !== '').length;
                    return Object.assign(Object.assign({}, bakery), { isClosed,
                        distanceInKm, rating: {
                            averageRating,
                            reviewCount,
                        } });
                })));
                if (userLocationFilter) {
                    const top5NearestBakeries = updatedBakeries
                        .sort((a, b) => a.distanceInKm - b.distanceInKm)
                        .slice(0, 5);
                    res.status(200).json({
                        status: 200,
                        data: top5NearestBakeries,
                    });
                }
                else {
                    res.status(200).json({
                        status: 200,
                        data: updatedBakeries,
                    });
                }
            }
            catch (error) {
                console.log("[src][controllers][BakeryController][findBakeryWithFilters] ", error);
                next(error);
            }
        });
    }
    updateBakery(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _a = req.body, { bakeryId } = _a, updateData = __rest(_a, ["bakeryId"]);
                const prevBakery = yield bakeryServices.findBakeryById(parseInt(bakeryId));
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
                        const oldImagePath = path_1.default.join(__dirname, '../../../public_html/uploads/bakery-image', prevBakery.bakeryImage);
                        if (fs_1.default.existsSync(oldImagePath)) {
                            fs_1.default.unlinkSync(oldImagePath);
                        }
                    }
                    const buffer = Buffer.from(encodedBakeryImage, 'base64');
                    const fileName = `bakeryImage-${Date.now()}.jpeg`;
                    const filePath = path_1.default.join(__dirname, '../../../public_html/uploads/bakery-image', fileName);
                    fs_1.default.writeFileSync(filePath, buffer);
                    updateData.bakeryImage = path_1.default.join(fileName);
                }
                const updatedBakery = yield bakeryServices.updateBakeryById(parseInt(bakeryId), updateData);
                console.log("[src][controllers][BakeryController][updateBakery] Bakery updated successfully");
                res.status(200).json({ status: 200, message: 'Bakery updated successfully', bakery: updatedBakery });
            }
            catch (error) {
                console.log("[src][controllers][BakeryController][updateBakery] ", error);
                next(error);
            }
        });
    }
    getUserId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                const user = yield userServices.findUserById(userId);
                if (!user) {
                    console.log("[src][controllers][BakeryController][getUserId] User not found");
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                res.status(200).json({ status: 200, data: user });
            }
            catch (error) {
                console.log("[src][controllers][BakeryController][getUserId] ", error);
                next(error);
            }
        });
    }
    findListBakery(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { isActive } = req.body;
                const bakeries = yield bakeryServices.findListBakery(isActive);
                if (!bakeries) {
                    console.log("[src][controllers][BakeryController][findListBakery] There is no bakery");
                    res.status(404).json({ error: 'There is no bakery' });
                    return;
                }
                res.status(200).json({ status: 200, data: bakeries });
            }
            catch (error) {
                console.log("[src][controllers][BakeryController][findListBakery] ", error);
                next(error);
            }
        });
    }
    updateBakeryIsActive(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bakeryId, isActive, email, userName, status, message } = req.body;
                const updatedBakery = yield bakeryServices.updateBakeryIsActive(bakeryId, isActive);
                if (!updatedBakery) {
                    console.log("[src][controllers][BakeryController][updateBakeryIsActive] Bakery not found");
                    res.status(404).json({ error: 'Bakery not found' });
                    return;
                }
                let info;
                if (isActive === 1) {
                    info = (0, mailer_1.sendMail)(email, "Bakeri Anda Telah Aktif", (0, mailHandler_1.generateActivateBakeryMailContent)(userName, status, message));
                }
                else {
                    info = (0, mailer_1.sendMail)(email, "Bakeri Anda Telah Dinonaktifkan", (0, mailHandler_1.generateDeactivateBakeryMailContent)(userName, status, message));
                }
                if (info) {
                    console.log("[src][controllers][AuthController][updateBakeryIsActive] Email sent successfully");
                    res.status(200).json({
                        status: 200,
                        message: 'Berhasil mengirim email'
                    });
                }
                else {
                    console.log("[src][controllers][AuthController][updateBakeryIsActive] Failed to send email");
                    res.status(500).json({
                        status: 500,
                        error: 'Gagal mengirim email'
                    });
                }
            }
            catch (error) {
                console.log("[src][controllers][BakeryController][updateBakeryIsActive] ", error);
                next(error);
            }
        });
    }
    deleteBakery(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bakeryId, email, userName, status, message } = req.body;
                console.log("bakery id at controller", bakeryId);
                const deletedBakery = yield bakeryServices.deleteBakery(bakeryId);
                if (!deletedBakery) {
                    console.log("[src][controllers][BakeryController][deleteBakery] Bakery not found");
                    res.status(404).json({ error: 'Bakery not found' });
                    return;
                }
                const info = (0, mailer_1.sendMail)(email, "Registrasi Bakeri Anda Ditolak", (0, mailHandler_1.generateRejectBakeryMailContent)(userName, status, message));
                if (info) {
                    console.log("[src][controllers][AuthController][deleteBakery] Email sent successfully");
                    res.status(200).json({
                        status: 200,
                        message: 'Berhasil mengirim email'
                    });
                }
                else {
                    console.log("[src][controllers][AuthController][deleteBakery] Failed to send email");
                    res.status(500).json({
                        status: 500,
                        error: 'Gagal mengirim email'
                    });
                }
            }
            catch (error) {
                console.log("[src][controllers][BakeryController][deleteBakery] ", error);
                next(error);
            }
        });
    }
}
exports.BakeryController = BakeryController;
