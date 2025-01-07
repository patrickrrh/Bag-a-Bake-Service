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
exports.BakeryServices = void 0;
const script_1 = __importDefault(require("../script"));
class BakeryServices {
    createBakery(bakery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield script_1.default.getClient().bakery.create({
                    data: bakery
                });
            }
            catch (error) {
                console.log("[src][services][BakeryServices][createBakery] ", error);
                throw new Error("Failed to create bakery");
            }
        });
    }
    findAllBakery() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield script_1.default.getClient().bakery.findMany({
                    where: {
                        isActive: 1
                    },
                    include: {
                        favorite: true
                    }
                });
            }
            catch (error) {
                console.log("[src][services][BakeryServices][findAllBakery] ", error);
                throw new Error("Failed to find bakery");
            }
        });
    }
    findBakeryById(bakeryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield script_1.default.getClient().bakery.findUnique({
                    where: {
                        bakeryId
                    },
                    include: {
                        product: {
                            where: {
                                isActive: 1,
                                productStock: { gt: 0 }
                            },
                            include: {
                                discount: true
                            }
                        },
                        favorite: true
                    }
                });
            }
            catch (error) {
                console.log("[src][services][BakeryServices][findBakeryById] ", error);
                throw new Error("Failed to find bakery");
            }
        });
    }
    findBakeryByCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const distinctBakeryIds = yield script_1.default.getClient().product.findMany({
                    where: {
                        categoryId: {
                            in: categoryId
                        },
                        isActive: 1,
                        productStock: { gt: 0 },
                    },
                    select: {
                        bakeryId: true,
                    },
                    distinct: ['bakeryId']
                });
                const bakeryIds = distinctBakeryIds.map((bakery) => bakery.bakeryId);
                if (bakeryIds.length === 0) {
                    return [];
                }
                const bakeries = yield script_1.default.getClient().bakery.findMany({
                    where: {
                        bakeryId: {
                            in: bakeryIds
                        }
                    },
                    include: {
                        favorite: true,
                    }
                });
                return bakeries;
            }
            catch (error) {
                console.log("[src][services][BakeryServices][findBakeryByCategory] ", error);
                throw new Error("Failed to find bakery");
            }
        });
    }
    findBakeryByProduct(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bakery = yield script_1.default.getClient().product.findUnique({
                    where: {
                        productId: productId,
                    },
                    include: {
                        bakery: {
                            include: {
                                product: true
                            }
                        },
                    },
                });
                return (bakery === null || bakery === void 0 ? void 0 : bakery.bakery) || null;
            }
            catch (error) {
                console.log("[src][services][BakeryServices][findBakeryByProduct] ", error);
                throw new Error("Failed to find bakery");
            }
        });
    }
    updateBakeryById(bakeryId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield script_1.default.getClient().bakery.update({
                    where: { bakeryId },
                    data: updateData,
                });
            }
            catch (error) {
                console.log("[src][services][BakeryServices][updateBakeryById] ", error);
                throw new Error("Failed to update bakery");
            }
        });
    }
    findListBakery(isActive) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield script_1.default.getClient().bakery.findMany({
                    where: Object.assign({}, (isActive !== undefined
                        ? { isActive }
                        : { isActive: { not: 0 } })),
                    include: {
                        user: true,
                        payment: true
                    }
                });
            }
            catch (error) {
                console.log("[src][services][BakeryServices][findListBakery] ", error);
                throw new Error("Failed to find bakery");
            }
        });
    }
    updateBakeryIsActive(bakeryId, isActive) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield script_1.default.getClient().bakery.update({
                    where: { bakeryId },
                    data: { isActive },
                });
            }
            catch (error) {
                console.log("[src][services][BakeryServices][updateBakeryIsActive] ", error);
                throw new Error("Failed to update bakery");
            }
        });
    }
    deleteBakery(bakeryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield script_1.default.getClient().bakery.delete({
                    where: { bakeryId },
                });
            }
            catch (error) {
                console.log("[src][services][BakeryServices][deleteBakery] ", error);
                throw new Error("Failed to delete bakery");
            }
        });
    }
}
exports.BakeryServices = BakeryServices;
