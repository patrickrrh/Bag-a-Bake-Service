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
exports.ProductController = void 0;
const productServices_1 = require("../services/productServices");
const productUtils_1 = require("../utilities/productUtils");
const ratingServices_1 = require("../services/ratingServices");
const geolib_1 = require("geolib");
const node_cron_1 = __importDefault(require("node-cron"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const productServices = new productServices_1.ProductServices();
const ratingServices = new ratingServices_1.RatingServices();
class ProductController {
    constructor() {
        this.scheduleDeactivateExpiredProducts();
    }
    scheduleDeactivateExpiredProducts() {
        node_cron_1.default.schedule("0 0 * * *", () => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Running Expired Product Deactivation (CRON)");
                yield productServices.deactivateExpiredProducts();
            }
            catch (error) {
                console.error("[ProductController][scheduleDeactivateExpiredProducts] Error:", error);
            }
        }));
    }
    createProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productData = req.body;
                if (!productData.productName ||
                    !productData.productPrice ||
                    !productData.productImage ||
                    !productData.productDescription ||
                    !productData.productExpirationDate ||
                    !productData.productStock ||
                    !productData.discount ||
                    !productData.bakeryId ||
                    !productData.categoryId) {
                    console.log("[src][controllers][ProductController][createProduct] Missing required fields");
                    res.status(400).send("Missing required fields");
                    return;
                }
                for (const disc of productData.discount) {
                    if (!disc.discountAmount) {
                        console.log("[src][controllers][ProductController][createProduct] Invalid data in Discount");
                        res.status(400).send("Invalid data in Discount");
                        return;
                    }
                }
                const encodedProductImage = req.body.productImage;
                if (encodedProductImage) {
                    const buffer = Buffer.from(encodedProductImage, 'base64');
                    const fileName = `productImage-${Date.now()}.jpeg`;
                    const filePath = path_1.default.join(__dirname, '../../../public_html/uploads/product', fileName);
                    fs_1.default.writeFileSync(filePath, buffer);
                    productData.productImage = path_1.default.join(fileName);
                }
                const createdProduct = yield productServices.createProduct(productData);
                res.status(201).json({
                    status: 201,
                    data: createdProduct,
                });
            }
            catch (error) {
                console.log("[src][controllers][ProductController][createProduct] ", error);
                next(error);
            }
        });
    }
    getProductById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId } = req.body;
                const createdProduct = yield productServices.findProductById(productId);
                if (!createdProduct) {
                    console.log("[src][controllers][ProductController][getProductById] Product ID Not Found");
                    res.status(400).send("Product ID Not Found");
                    return;
                }
                const todayPrice = (0, productUtils_1.getTodayPrice)(createdProduct);
                const discountPercentage = (0, productUtils_1.calculateDiscountPercentage)(createdProduct.productPrice, todayPrice);
                res.status(200).json({
                    status: 200,
                    data: Object.assign(Object.assign({}, createdProduct), { todayPrice, discountPercentage }),
                });
            }
            catch (error) {
                console.log("[src][controllers][ProductController][getProductById] ", error);
                next(error);
            }
        });
    }
    updateProductById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId } = req.body;
                const productData = req.body;
                if (!productId ||
                    !productData.productName ||
                    !productData.productPrice ||
                    !productData.productDescription ||
                    !productData.productExpirationDate ||
                    !productData.bakeryId ||
                    !productData.categoryId) {
                    console.log("[src][controllers][ProductController][updateProductById] Missing required fields");
                    res.status(400).send("Missing required fields");
                    return;
                }
                for (const disc of productData.discount) {
                    if (!disc.discountAmount) {
                        console.log("[src][controllers][ProductController][updateProductById] Invalid data in Discount");
                        res.status(400).send("Invalid data in Discount");
                        return;
                    }
                }
                const prevProduct = yield productServices.findProductById(productId);
                if (!prevProduct) {
                    console.log("[src][controllers][ProductController][updateProductById] Product ID Not Found");
                    res.status(400).json({
                        status: 400,
                        message: "Product ID Not Found",
                    });
                    return;
                }
                const encodedProductImage = req.body.productImage;
                if (encodedProductImage) {
                    if (prevProduct.productImage) {
                        const oldImagePath = path_1.default.join(__dirname, '../../../public_html/uploads/product', prevProduct.productImage);
                        if (fs_1.default.existsSync(oldImagePath)) {
                            fs_1.default.unlinkSync(oldImagePath);
                        }
                    }
                    const buffer = Buffer.from(encodedProductImage, 'base64');
                    const fileName = `productImage-${Date.now()}.jpeg`;
                    const filePath = path_1.default.join(__dirname, '../../../public_html/uploads/product', fileName);
                    fs_1.default.writeFileSync(filePath, buffer);
                    productData.productImage = path_1.default.join(fileName);
                }
                const updatedProduct = yield productServices.updateProductById(productId, productData);
                console.log("update product res", updatedProduct);
                if (!updatedProduct) {
                    console.log("[src][controllers][ProductController][updateProductById] Product ID Not Found");
                    res.status(400).send("Product ID Not Found");
                    return;
                }
                res.status(200).json({
                    status: 200,
                    data: updatedProduct,
                });
            }
            catch (error) {
                console.log("[src][controllers][ProductController][updateProductById] ", error);
                next(error);
            }
        });
    }
    deleteProductById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId } = req.body;
                const numericProductId = Number(productId);
                if (!productId) {
                    console.log("[src][controllers][ProductController][deleteProductById] Product ID is required");
                    res.status(400).json({
                        status: 400,
                        message: "Product ID is required",
                    });
                    return;
                }
                const deletedProduct = yield productServices.deleteProductById(numericProductId);
                if (!deletedProduct) {
                    console.log("[src][controllers][ProductController][deleteProductById] Product not found or could not be deleted");
                    res.status(404).json({
                        status: 404,
                        message: "Product not found or could not be deleted",
                    });
                    return;
                }
                res.status(200).json({
                    status: 200,
                    message: "Product berhasil dihapus",
                });
            }
            catch (error) {
                console.log("[src][controllers][ProductController][deleteProductById] ", error);
                next(error);
            }
        });
    }
    findRecommendedProducts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentTime = new Date();
                const currentHour = currentTime.getHours().toString().padStart(2, '0');
                const currentMinute = currentTime.getMinutes().toString().padStart(2, '0');
                const formattedTime = `${currentHour}:${currentMinute}`;
                const products = yield productServices.findRecommendedProducts(formattedTime);
                const userLocation = {
                    latitude: req.body.latitude,
                    longitude: req.body.longitude,
                };
                const nearestProductsMap = new Map();
                products.forEach((product) => {
                    const bakeryLocation = {
                        latitude: product.bakery.bakeryLatitude,
                        longitude: product.bakery.bakeryLongitude,
                    };
                    const distance = (0, geolib_1.getPreciseDistance)(userLocation, bakeryLocation, 0.01);
                    const distanceInKm = parseFloat((distance / 1000).toFixed(2));
                    if (!nearestProductsMap.has(product.bakery.bakeryId) ||
                        distance < nearestProductsMap.get(product.bakery.bakeryId).distance) {
                        nearestProductsMap.set(product.bakery.bakeryId, Object.assign(Object.assign({}, product), { todayPrice: (0, productUtils_1.getTodayPrice)(product), discountPercentage: (0, productUtils_1.calculateDiscountPercentage)(product.productPrice, (0, productUtils_1.getTodayPrice)(product)), distanceInKm }));
                    }
                });
                const sortedNearestProducts = Array.from(nearestProductsMap.values()).sort((a, b) => a.distance - b.distance);
                const topNearestProducts = sortedNearestProducts.slice(0, 5);
                res.status(200).json({
                    status: 200,
                    data: topNearestProducts,
                });
            }
            catch (error) {
                console.error('[src][controllers][ProductController][findRecommendedProducts]', error);
                next(error);
            }
        });
    }
    findExpiringProducts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentTime = new Date();
                const currentHour = currentTime.getHours().toString().padStart(2, '0');
                const currentMinute = currentTime.getMinutes().toString().padStart(2, '0');
                const formattedTime = `${currentHour}:${currentMinute}`;
                const expiringProducts = yield productServices.findExpiringProducts(formattedTime);
                const userLocation = {
                    latitude: req.body.latitude,
                    longitude: req.body.longitude,
                };
                const modifiedProducts = expiringProducts.map((product) => {
                    const bakeryLocation = {
                        latitude: product.bakery.bakeryLatitude,
                        longitude: product.bakery.bakeryLongitude,
                    };
                    const distance = (0, geolib_1.getPreciseDistance)(userLocation, bakeryLocation, 0.01);
                    const distanceInKm = parseFloat((distance / 1000).toFixed(2));
                    return Object.assign(Object.assign({}, product), { todayPrice: (0, productUtils_1.getTodayPrice)(product), discountPercentage: (0, productUtils_1.calculateDiscountPercentage)(product.productPrice, (0, productUtils_1.getTodayPrice)(product)), distanceInKm });
                });
                res.status(200).json({
                    status: 200,
                    data: modifiedProducts,
                });
            }
            catch (error) {
                console.log("[src][controllers][ProductController][findExpiringProducts] ", error);
                next(error);
            }
        });
    }
    getProductsByBakeryId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bakeryId, isActive } = req.body;
                if (!bakeryId || !isActive) {
                    console.log("[src][controllers][ProductController][getProductsByBakeryId] Bakery ID or isActive is required");
                    res.status(400).send("Bakery ID or isActive is required");
                    return;
                }
                const products = yield productServices.findProductsByBakeryId(bakeryId, isActive);
                if (products.length === 0) {
                    console.log("[src][controllers][ProductController][getProductsByBakeryId] No products found for this bakery ID");
                    res.status(404).send("No products found for this bakery ID");
                    return;
                }
                const modifiedProducts = products.map((product) => (Object.assign(Object.assign({}, product), { todayPrice: (0, productUtils_1.getTodayPrice)(product) })));
                res.status(200).json({
                    status: 200,
                    data: modifiedProducts,
                });
            }
            catch (error) {
                console.log("[src][controllers][ProductController][getProductsByBakeryId]", error);
                next(error);
            }
        });
    }
    findBakeryByProductId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId } = req.body;
                if (!productId) {
                    console.log("[src][controllers][ProductController][findBakeryByProductId] Product ID is required");
                    res.status(400).send("Product ID is required");
                    return;
                }
                const bakery = yield productServices.findBakeryByProductId(productId);
                const ratings = yield ratingServices.findRatingByBakery(bakery === null || bakery === void 0 ? void 0 : bakery.bakeryId);
                const totalRatings = ratings.reduce((sum, r) => sum + r.rating, 0);
                const averageRating = ratings.length > 0 ? (totalRatings / ratings.length).toFixed(1) : '0.0';
                const reviewCount = ratings.filter((r) => r.review !== '').length;
                res.status(200).json({
                    status: 200,
                    data: { bakery, prevRating: { averageRating, reviewCount } },
                });
            }
            catch (error) {
                console.log("[src][controllers][ProductController][findBakeryByProductId] ", error);
                next(error);
            }
        });
    }
}
exports.ProductController = ProductController;
