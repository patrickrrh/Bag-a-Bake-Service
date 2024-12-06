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
exports.OrderSellerController = void 0;
const orderSellerServices_1 = require("../services/orderSellerServices");
const productUtils_1 = require("../utilities/productUtils");
const productServices_1 = require("../services/productServices");
const userServices_1 = require("../services/userServices");
const notificationHandler_1 = require("../utilities/notificationHandler");
const orderSellerServices = new orderSellerServices_1.OrderSellerServices();
const productServices = new productServices_1.ProductServices();
const userServices = new userServices_1.UserServices();
class OrderSellerController {
    findLatestPendingOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bakeryId } = req.body;
                const latestPendingOrder = yield orderSellerServices.findLatestPendingOrder(bakeryId);
                const updatedOrderDetails = latestPendingOrder === null || latestPendingOrder === void 0 ? void 0 : latestPendingOrder.orderDetail.map((detail) => (Object.assign(Object.assign({}, detail), { totalDetailPrice: detail.productQuantity * (0, productUtils_1.getPriceOnOrderDate)(detail.product, latestPendingOrder.orderDate).toNumber(), discountPercentage: (0, productUtils_1.calculateDiscountPercentage)(detail.product.productPrice, (0, productUtils_1.getPriceOnOrderDate)(detail.product, latestPendingOrder.orderDate)) })));
                const totalOrderPrice = latestPendingOrder === null || latestPendingOrder === void 0 ? void 0 : latestPendingOrder.orderDetail.reduce((sum, detail) => sum + detail.productQuantity * (0, productUtils_1.getPriceOnOrderDate)(detail.product, latestPendingOrder.orderDate).toNumber(), 0);
                res.status(200).json({
                    status: 200,
                    data: Object.assign(Object.assign({}, latestPendingOrder), { orderDetail: updatedOrderDetails, totalOrderPrice })
                });
            }
            catch (error) {
                console.log("[src][controllers][OrderSellerController][findLatestPendingOrder] ", error);
                next(error);
            }
        });
    }
    findLatestPaymentOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bakeryId } = req.body;
                const latestPaymentOrder = yield orderSellerServices.findLatestPaymentOrder(bakeryId);
                const updatedOrderDetails = latestPaymentOrder === null || latestPaymentOrder === void 0 ? void 0 : latestPaymentOrder.orderDetail.map((detail) => (Object.assign(Object.assign({}, detail), { totalDetailPrice: detail.productQuantity * (0, productUtils_1.getPriceOnOrderDate)(detail.product, latestPaymentOrder.orderDate).toNumber(), discountPercentage: (0, productUtils_1.calculateDiscountPercentage)(detail.product.productPrice, (0, productUtils_1.getPriceOnOrderDate)(detail.product, latestPaymentOrder.orderDate)) })));
                const totalOrderPrice = latestPaymentOrder === null || latestPaymentOrder === void 0 ? void 0 : latestPaymentOrder.orderDetail.reduce((sum, detail) => sum + detail.productQuantity * (0, productUtils_1.getPriceOnOrderDate)(detail.product, latestPaymentOrder.orderDate).toNumber(), 0);
                res.status(200).json({
                    status: 200,
                    data: Object.assign(Object.assign({}, latestPaymentOrder), { orderDetail: updatedOrderDetails, totalOrderPrice })
                });
            }
            catch (error) {
                console.log("[src][controllers][OrderSellerController][findLatestPaymentOrder] ", error);
                next(error);
            }
        });
    }
    findLatestOngoingOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bakeryId } = req.body;
                const latestOngoingOrder = yield orderSellerServices.findLatestOngoingOrder(bakeryId);
                const updatedOrderDetails = latestOngoingOrder === null || latestOngoingOrder === void 0 ? void 0 : latestOngoingOrder.orderDetail.map((detail) => (Object.assign(Object.assign({}, detail), { totalDetailPrice: detail.productQuantity * (0, productUtils_1.getPriceOnOrderDate)(detail.product, latestOngoingOrder.orderDate).toNumber(), discountPercentage: (0, productUtils_1.calculateDiscountPercentage)(detail.product.productPrice, (0, productUtils_1.getPriceOnOrderDate)(detail.product, latestOngoingOrder.orderDate)) })));
                const totalOrderPrice = latestOngoingOrder === null || latestOngoingOrder === void 0 ? void 0 : latestOngoingOrder.orderDetail.reduce((sum, detail) => sum + detail.productQuantity * (0, productUtils_1.getPriceOnOrderDate)(detail.product, latestOngoingOrder.orderDate).toNumber(), 0);
                res.status(200).json({
                    status: 200,
                    data: Object.assign(Object.assign({}, latestOngoingOrder), { orderDetail: updatedOrderDetails, totalOrderPrice })
                });
            }
            catch (error) {
                console.log("[src][controllers][OrderSellerController][findLatestOngoingOrder] ", error);
                next(error);
            }
        });
    }
    countAllPendingOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bakeryId } = req.body;
                const countAllPendingOrder = yield orderSellerServices.countAllPendingOrder(bakeryId);
                res.status(200).json({
                    status: 200,
                    data: countAllPendingOrder
                });
            }
            catch (error) {
                console.log("[src][controllers][OrderSellerController][countAllPendingOrder] ", error);
                next(error);
            }
        });
    }
    countAllOnPaymentOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bakeryId } = req.body;
                const countAllOnPaymentOrder = yield orderSellerServices.countAllOnPaymentOrder(bakeryId);
                res.status(200).json({
                    status: 200,
                    data: countAllOnPaymentOrder
                });
            }
            catch (error) {
                console.log("[src][controllers][OrderSellerController][countAllOnPaymentOrder] ", error);
                next(error);
            }
        });
    }
    countAllOngoingOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bakeryId } = req.body;
                const countAllOngoingOrder = yield orderSellerServices.countAllOngoingOrder(bakeryId);
                res.status(200).json({
                    status: 200,
                    data: countAllOngoingOrder
                });
            }
            catch (error) {
                console.log("[src][controllers][OrderSellerController][countAllOngoingOrder] ", error);
                next(error);
            }
        });
    }
    findAllOrderByStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { orderStatus, bakeryId } = req.body;
                if (!Array.isArray(orderStatus)) {
                    orderStatus = orderStatus === 4 ? [4, 5] : [orderStatus];
                }
                const statusOrderDirection = orderStatus.includes(4) || orderStatus.includes(5) ? "desc" : "asc";
                const allOrder = yield orderSellerServices.findAllOrderByStatus(orderStatus, bakeryId, statusOrderDirection);
                const newOrderData = yield Promise.all(allOrder.map((order) => __awaiter(this, void 0, void 0, function* () {
                    const updatedOrderDetails = order.orderDetail.map((detail) => (Object.assign(Object.assign({}, detail), { totalDetailPrice: detail.productQuantity * (0, productUtils_1.getPriceOnOrderDate)(detail.product, order.orderDate).toNumber(), discountPercentage: (0, productUtils_1.calculateDiscountPercentage)(detail.product.productPrice, (0, productUtils_1.getPriceOnOrderDate)(detail.product, order.orderDate)) })));
                    const totalOrderPrice = order.orderDetail.reduce((sum, detail) => sum + detail.productQuantity * (0, productUtils_1.getPriceOnOrderDate)(detail.product, order.orderDate).toNumber(), 0);
                    return Object.assign(Object.assign({}, order), { orderDetail: updatedOrderDetails, totalOrderPrice });
                })));
                res.status(200).json({
                    status: 200,
                    data: newOrderData
                });
            }
            catch (error) {
                console.log("[src][controllers][OrderSellerController][findAllOrderByStatus] ", error);
                next(error);
            }
        });
    }
    actionOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId, orderStatus, paymentStartedAt } = req.body;
                if (!orderId || !orderStatus) {
                    res.status(400).json({
                        status: 400,
                        message: "Missing orderId or orderStatus"
                    });
                }
                yield orderSellerServices.actionOrder(orderId, orderStatus, paymentStartedAt);
                if (orderStatus === 2) {
                    const orderDetails = yield orderSellerServices.findOrderDetailsByOrderId(orderId);
                    if (orderDetails.length === 0) {
                        res.status(404).json({
                            status: 404,
                            message: "Order details not found",
                        });
                        return;
                    }
                    yield Promise.all(orderDetails.map((detail) => __awaiter(this, void 0, void 0, function* () {
                        const product = yield productServices.findProductById(detail.productId);
                        const updatedProductStock = Number(product === null || product === void 0 ? void 0 : product.productStock) - detail.productQuantity;
                        yield productServices.updateProductStock(detail.productId, updatedProductStock);
                    })));
                }
                const buyer = yield userServices.findBuyerByOrderId(orderId);
                if (buyer === null || buyer === void 0 ? void 0 : buyer.pushToken) {
                    if (orderStatus === 2) {
                        yield (0, notificationHandler_1.sendNotifications)(buyer.pushToken, 'Pesanan Diterima', 'Silakan selesaikan pembayaran sebelum waktu yang ditentukan');
                    }
                    else if (orderStatus === 5) {
                        yield (0, notificationHandler_1.sendNotifications)(buyer.pushToken, 'Pesanan Dibatalkan', 'Maaf, bakeri membatalkan pesanan Anda');
                    }
                    else {
                        yield (0, notificationHandler_1.sendNotifications)(buyer.pushToken, 'Status Pesanan', 'Silakan cek status pesanan Anda');
                    }
                }
                res.status(200).json({
                    status: 200,
                    message: "Success"
                });
            }
            catch (error) {
                console.log("[src][controllers][OrderSellerController][actionOrder] ", error);
                next(error);
            }
        });
    }
    cancelOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId } = req.body;
                console.log("is this called");
                yield orderSellerServices.actionOrder(orderId, 5);
                const orderDetails = yield orderSellerServices.findOrderDetailByOrderId(orderId);
                console.log("order details", orderDetails);
                if (!orderDetails) {
                    res.status(404).json({ message: "Order details not found" });
                    return;
                }
                yield Promise.all(orderDetails.orderDetail.map((detail) => __awaiter(this, void 0, void 0, function* () {
                    const currentProduct = yield productServices.findProductById(detail.productId);
                    const updatedProductStock = Number(currentProduct === null || currentProduct === void 0 ? void 0 : currentProduct.productStock) + detail.productQuantity;
                    yield productServices.updateProductStock(detail.productId, updatedProductStock);
                })));
                const buyer = yield userServices.findBuyerByOrderId(orderId);
                if (buyer === null || buyer === void 0 ? void 0 : buyer.pushToken) {
                    yield (0, notificationHandler_1.sendNotifications)(buyer.pushToken, 'Pesanan Dibatalkan', 'Maaf, bakeri membatalkan pesanan Anda');
                }
                res.status(200).json({
                    status: 200,
                    message: "Success"
                });
            }
            catch (error) {
                console.log("[src][controllers][OrderSellerController][cancelOrder] ", error);
                next(error);
            }
        });
    }
}
exports.OrderSellerController = OrderSellerController;
