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
exports.UserServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const script_1 = __importDefault(require("../script"));
class UserServices {
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email) {
                console.log("[src][services][UserServices][findUserByEmail] Email is required");
                throw new Error('Email is required');
            }
            try {
                return script_1.default.getClient().user.findUnique({
                    where: {
                        email
                    }
                });
            }
            catch (error) {
                console.log("[src][services][UserServices][findUserByEmail]", error);
                throw new Error("Failed to find user");
            }
        });
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            user.password = bcrypt_1.default.hashSync(user.password, 12);
            try {
                return yield script_1.default.getClient().user.create({
                    data: user
                });
            }
            catch (error) {
                console.log("[src][services][UserServices][createUser]", error);
                throw new Error("Failed to create user");
            }
        });
    }
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                console.log("[src][services][UserServices][findUserById] User ID is required");
                throw new Error('User ID is required');
            }
            try {
                return yield script_1.default.getClient().user.findUnique({
                    where: {
                        userId
                    },
                    include: {
                        bakery: {
                            include: {
                                payment: true
                            }
                        }
                    }
                });
            }
            catch (error) {
                console.log("[src][services][UserServices][findUserById]", error);
                throw new Error("Failed to find user");
            }
        });
    }
    updateUserPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                password = bcrypt_1.default.hashSync(password, 12);
                return yield script_1.default.getClient().user.update({
                    where: {
                        email
                    },
                    data: {
                        password
                    }
                });
            }
            catch (error) {
                console.log("[src][services][UserServices][updateUserPassword]", error);
                throw new Error("Failed to update user password");
            }
        });
    }
    updateUserById(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield script_1.default.getClient().user.update({
                    where: { userId },
                    data: updateData
                });
            }
            catch (error) {
                console.log("[src][services][UserServices][updateUserById] ", error);
                throw error;
            }
        });
    }
    findSellerByBakeryId(bakeryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bakery = yield script_1.default.getClient().bakery.findUnique({
                    where: {
                        bakeryId
                    },
                    include: {
                        user: true,
                    }
                });
                return bakery ? bakery.user : null;
            }
            catch (error) {
                console.log("[src][services][UserServices][findSellerByBakeryId]", error);
                throw new Error("Failed to find user");
            }
        });
    }
    findBuyerByOrderId(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield script_1.default.getClient().order.findUnique({
                    where: {
                        orderId
                    },
                    include: {
                        user: true,
                    }
                });
                return order ? order.user : null;
            }
            catch (error) {
                console.log("[src][services][UserServices][findBuyerByOrderId]", error);
                throw new Error("Failed to find user");
            }
        });
    }
    findSellerByOrderId(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield script_1.default.getClient().order.findUnique({
                    where: {
                        orderId
                    },
                    include: {
                        bakery: {
                            include: {
                                user: true,
                            }
                        }
                    }
                });
                return order ? order.bakery.user : null;
            }
            catch (error) {
                console.log("[src][services][UserServices][findSellerByOrderId]", error);
                throw new Error("Failed to find user");
            }
        });
    }
    updateUserCancelled(userId, isCancelled) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield script_1.default.getClient().user.update({
                    where: { userId },
                    data: {
                        isCancelled,
                    }
                });
            }
            catch (error) {
                console.log("[src][services][UserServices][updateUserCancelled]", error);
                throw new Error("Failed to update user cancellation status");
            }
        });
    }
    findUsersWithCancelledThreshold(threshold) {
        return __awaiter(this, void 0, void 0, function* () {
            if (threshold < 0) {
                console.log("[src][services][UserServices][findUsersWithCancelledThreshold] Threshold must be a non-negative number");
                throw new Error("Threshold must be a non-negative number");
            }
            try {
                return yield script_1.default.getClient().user.findMany({
                    where: {
                        isCancelled: {
                            gte: threshold,
                        }
                    }
                });
            }
            catch (error) {
                console.log("[src][services][UserServices][findUsersWithCancelledThreshold]", error);
                throw new Error("Failed to find users with the specified cancellation threshold");
            }
        });
    }
    updatePushToken(userId, pushToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield script_1.default.getClient().user.update({
                    where: {
                        userId
                    },
                    data: {
                        pushToken
                    }
                });
            }
            catch (error) {
                console.log("[src][services][UserServices][updatePushToken]", error);
                throw new Error("Failed to update push token");
            }
        });
    }
}
exports.UserServices = UserServices;
