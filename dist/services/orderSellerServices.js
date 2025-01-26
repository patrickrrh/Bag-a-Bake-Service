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
exports.OrderSellerServices = void 0;
const script_1 = __importDefault(require("../script"));
class OrderSellerServices {
    findLatestPendingOrder(bakeryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield script_1.default.getClient().order.findFirst({
                    where: {
                        orderStatus: 1,
                        bakeryId
                    },
                    include: {
                        user: true,
                        orderDetail: {
                            include: {
                                product: {
                                    include: {
                                        discount: true
                                    }
                                }
                            }
                        }
                    }
                });
            }
            catch (error) {
                console.log("[src][services][OrderSellerServices][findLatestPendingOrder] ", error);
                throw new Error("Failed to get latest pending order");
            }
        });
    }
    findLatestPaymentOrder(bakeryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield script_1.default.getClient().order.findFirst({
                    where: {
                        orderStatus: 2,
                        bakeryId
                    },
                    include: {
                        user: true,
                        orderDetail: {
                            include: {
                                product: {
                                    include: {
                                        discount: true
                                    }
                                }
                            }
                        }
                    }
                });
            }
            catch (error) {
                console.log("[src][services][OrderSellerServices][findLatestPaymentOrder] ", error);
                throw new Error("Failed to get on payment order");
            }
        });
    }
    findLatestOngoingOrder(bakeryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield script_1.default.getClient().order.findFirst({
                    where: {
                        orderStatus: 3,
                        bakeryId
                    },
                    include: {
                        user: true,
                        orderDetail: {
                            include: {
                                product: {
                                    include: {
                                        discount: true
                                    }
                                }
                            }
                        }
                    }
                });
            }
            catch (error) {
                console.log("[src][services][OrderSellerServices][findLatestOngoingOrder] ", error);
                throw new Error("Failed to get latest ongoing order");
            }
        });
    }
    countAllPendingOrder(bakeryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield script_1.default.getClient().order.count({
                    where: {
                        orderStatus: 1,
                        bakeryId
                    }
                });
            }
            catch (error) {
                console.log("[src][services][OrderSellerServices][countAllPendingOrder] ", error);
                throw new Error("Failed to count all pending order");
            }
        });
    }
    countAllOnPaymentOrder(bakeryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield script_1.default.getClient().order.count({
                    where: {
                        orderStatus: 2,
                        bakeryId
                    }
                });
            }
            catch (error) {
                console.log("[src][services][OrderSellerServices][countAllOnPaymentOrder] ", error);
                throw new Error("Failed to count all on payment order");
            }
        });
    }
    countAllOngoingOrder(bakeryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield script_1.default.getClient().order.count({
                    where: {
                        orderStatus: 3,
                        bakeryId
                    }
                });
            }
            catch (error) {
                console.log("[src][services][OrderSellerServices][countAllOngoingOrder] ", error);
                throw new Error("Failed to count all ongoing order");
            }
        });
    }
    findAllOrderByStatus(orderStatus, bakeryId, statusOrderDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield script_1.default.getClient().order.findMany({
                    where: {
                        bakeryId,
                        orderStatus: {
                            in: orderStatus
                        }
                    },
                    include: {
                        user: true,
                        orderDetail: {
                            include: {
                                product: {
                                    include: {
                                        discount: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        orderId: statusOrderDirection
                    }
                });
            }
            catch (error) {
                console.log("[src][services][OrderSellerServices][findAllPendingOrder] ", error);
                throw new Error("Failed to get all pending order");
            }
        });
    }
    actionOrder(orderId, orderStatus, paymentStartedAt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield script_1.default.getClient().order.update({
                    where: {
                        orderId
                    },
                    data: {
                        orderStatus,
                        paymentStartedAt
                    }
                });
            }
            catch (error) {
                console.log("[src][services][OrderSellerServices][actionOrder] ", error);
                throw new Error("Failed to action order");
            }
        });
    }
    findOrderDetailByOrderId(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield script_1.default.getClient().order.findUnique({
                    where: { orderId },
                    include: {
                        orderDetail: {
                            include: {
                                product: true,
                            },
                        },
                    },
                });
                return order;
            }
            catch (err) {
                throw new Error("Failed to retrieve order details by ID");
            }
        });
    }
}
exports.OrderSellerServices = OrderSellerServices;
