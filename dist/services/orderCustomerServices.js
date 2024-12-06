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
exports.OrderCustomerServices = void 0;
const script_1 = __importDefault(require("../script"));
class OrderCustomerServices {
    createOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield script_1.default.getClient().order.create({
                    data: {
                        userId: order.userId,
                        orderDetail: {
                            create: order.orderDetail.map(detail => ({
                                productId: detail.productId,
                                productQuantity: detail.productQuantity,
                            }))
                        },
                        bakeryId: order.bakeryId,
                        orderStatus: 1
                    },
                    include: {
                        orderDetail: true,
                    }
                });
            }
            catch (err) {
                throw new Error("Failed to create order");
            }
        });
    }
    getOrderByStatus(orderStatus, userId, statusOrderDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield script_1.default.getClient().order.findMany({
                    where: {
                        userId,
                        orderStatus: {
                            in: orderStatus
                        }
                    },
                    include: {
                        orderDetail: {
                            include: {
                                product: {
                                    include: {
                                        discount: true
                                    }
                                },
                            },
                        },
                        bakery: true
                    },
                    orderBy: {
                        orderId: statusOrderDirection
                    }
                });
                return orders;
            }
            catch (err) {
                throw new Error("Failed to retrieve orders by status");
            }
        });
    }
    cancelOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedOrder = yield script_1.default.getClient().order.update({
                    where: { orderId },
                    data: { orderStatus: 5 },
                });
                const order = yield script_1.default.getClient().order.findUnique({
                    where: { orderId },
                    include: { user: true },
                });
                if (!order) {
                    throw new Error("Order not found");
                }
                yield script_1.default.getClient().user.update({
                    where: { userId: order.userId },
                    data: {
                        isCancelled: {
                            increment: 1,
                        },
                    },
                });
                return updatedOrder;
            }
            catch (err) {
                throw new Error("Failed to cancel order");
            }
        });
    }
    submitProofOfPayment(orderId, proofOfPayment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield script_1.default.getClient().order.update({
                    where: { orderId },
                    data: { proofOfPayment },
                });
            }
            catch (error) {
                throw new Error("Failed to submit proof of payment");
            }
        });
    }
    findOnPaymentOrders(paymentDueAt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield script_1.default.getClient().order.findMany({
                    where: {
                        orderStatus: 2,
                        paymentStartedAt: { lte: paymentDueAt },
                        proofOfPayment: null
                    },
                    include: {
                        orderDetail: {
                            include: {
                                product: true
                            }
                        }
                    }
                });
            }
            catch (error) {
                throw new Error("Failed to find on payment orders");
            }
        });
    }
    deactiveUnpaidOrders(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield script_1.default.getClient().order.update({
                    where: { orderId },
                    data: { orderStatus: 5 },
                });
            }
            catch (error) {
                throw new Error("Failed to deactive order");
            }
        });
    }
}
exports.OrderCustomerServices = OrderCustomerServices;
