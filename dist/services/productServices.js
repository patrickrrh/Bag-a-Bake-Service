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
exports.ProductServices = void 0;
const script_1 = __importDefault(require("../script"));
;
class ProductServices {
    createProduct(product) {
        return __awaiter(this, void 0, void 0, function* () {
            const prisma = script_1.default.getClient();
            try {
                const createdProduct = yield prisma.product.create({
                    data: {
                        productName: product.productName,
                        productPrice: product.productPrice,
                        productImage: product.productImage,
                        productDescription: product.productDescription,
                        productExpirationDate: product.productExpirationDate,
                        productStock: product.productStock,
                        bakeryId: product.bakeryId,
                        categoryId: product.categoryId,
                    },
                });
                yield prisma.listDiscount.createMany({
                    data: product.discount.map((disc) => ({
                        productId: createdProduct.productId,
                        discountDate: disc.discountDate,
                        discountAmount: disc.discountAmount,
                    })),
                });
                console.log("Product created successfully");
            }
            catch (error) {
                console.log("[src][services][ProductServices][createProduct] ", error);
                throw new Error("Failed to create product");
            }
        });
    }
    findProductById(parameterProductId) {
        return __awaiter(this, void 0, void 0, function* () {
            const productId = Number(parameterProductId);
            try {
                return yield script_1.default.getClient().product.findUnique({
                    where: {
                        productId
                    },
                    include: {
                        discount: true,
                    },
                });
            }
            catch (error) {
                console.log("[src][services][ProductServices][findProductById] ", error);
                throw new Error("Failed to find product");
            }
        });
    }
    updateProductById(productId, product) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!productId) {
                console.log("[src][services][ProductServices][updateProductById] Product ID is required");
                throw new Error("Product ID is required");
            }
            try {
                const updatedProduct = yield script_1.default.getClient().product.update({
                    where: { productId },
                    data: {
                        productName: product.productName,
                        productPrice: product.productPrice,
                        productImage: product.productImage,
                        productDescription: product.productDescription,
                        productExpirationDate: product.productExpirationDate,
                        productStock: product.productStock,
                        discount: {
                            deleteMany: {},
                            create: product.discount.map((disc) => ({
                                discountDate: disc.discountDate,
                                discountAmount: disc.discountAmount,
                            })),
                        },
                        bakeryId: product.bakeryId,
                        categoryId: product.categoryId,
                        isActive: product.isActive,
                    },
                    include: {
                        discount: true,
                    },
                });
                return updatedProduct;
            }
            catch (error) {
                console.log("[src][services][ProductServices][updateProductById] ", error);
                throw new Error("Failed to update product");
            }
        });
    }
    deleteProductById(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingProduct = yield this.findProductById(productId);
                if (!existingProduct) {
                    console.log("[src][services][ProductServices][deleteProductById] Product not found");
                    return null;
                }
                yield script_1.default.getClient().listDiscount.deleteMany({
                    where: { productId },
                });
                return yield script_1.default.getClient().product.delete({
                    where: { productId },
                });
            }
            catch (error) {
                console.log("[src][services][ProductServices][deleteProductById] ", error);
                throw new Error("Failed to delete product");
            }
        });
    }
    findRecommendedProducts(currentTime) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield script_1.default.getClient().product.findMany({
                    where: {
                        bakery: {
                            openingTime: {
                                lte: currentTime
                            },
                            closingTime: {
                                gte: currentTime
                            }
                        },
                        isActive: 1,
                        productStock: { gt: 0 },
                    },
                    orderBy: {
                        productStock: "asc",
                    },
                    include: {
                        bakery: true,
                        discount: true
                    },
                });
            }
            catch (error) {
                console.log("[src][services][ProductServices][findRecommendedProducts] ", error);
                throw new Error("Failed to find recommended products");
            }
        });
    }
    findExpiringProducts(currentTime) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield script_1.default.getClient().product.findMany({
                    where: {
                        bakery: {
                            openingTime: {
                                lte: currentTime
                            },
                            closingTime: {
                                gte: currentTime
                            }
                        },
                        isActive: 1,
                        productStock: { gt: 0 },
                    },
                    orderBy: [
                        {
                            productExpirationDate: "asc",
                        },
                        {
                            productStock: "asc",
                        },
                    ],
                    include: {
                        bakery: true,
                        discount: true
                    },
                    take: 10,
                });
            }
            catch (error) {
                console.log("[src][services][ProductServices][findExpiringProducts] ", error);
                throw new Error("Failed to find expiring products");
            }
        });
    }
    findBakeryByProductId(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bakery = yield script_1.default.getClient().product.findUnique({
                    where: {
                        productId: productId,
                    },
                    select: {
                        bakery: {
                            select: {
                                bakeryName: true,
                                closingTime: true,
                                bakeryId: true,
                            }
                        }
                    }
                });
                return (bakery === null || bakery === void 0 ? void 0 : bakery.bakery) || null;
            }
            catch (error) {
                console.log("[src][services][ProductServices][findBakeryByProductId]", error);
                throw new Error("Failed to find bakery by product ID");
            }
        });
    }
    findProductsByBakeryId(bakeryId, isActive) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield script_1.default.getClient().product.findMany({
                    where: {
                        bakeryId,
                        isActive,
                    },
                    include: {
                        discount: true,
                    },
                });
            }
            catch (error) {
                console.log("[src][services][ProductServices][findProductsByBakeryId]", error);
                throw new Error("Failed to find products by bakery ID");
            }
        });
    }
    updateProductStock(productId, productStock) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield script_1.default.getClient().product.update({
                    where: {
                        productId
                    },
                    data: {
                        productStock
                    }
                });
            }
            catch (error) {
                console.log("[src][services][ProductServices][updateProductStock]", error);
                throw new Error("Failed to update product stock");
            }
        });
    }
    deactivateExpiredProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const today = new Date().toISOString().split("T")[0];
                yield script_1.default.getClient().product.updateMany({
                    where: {
                        productExpirationDate: {
                            lte: new Date(today),
                        },
                        isActive: 1,
                    },
                    data: {
                        isActive: 2,
                    },
                });
                console.log("Expired products deactivated successfully.");
            }
            catch (error) {
                console.log("[ProductServices][deactivateExpiredProducts] Error: ", error);
                throw new Error("Failed to deactivate expired products.");
            }
        });
    }
}
exports.ProductServices = ProductServices;
