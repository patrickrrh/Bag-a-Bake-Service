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
exports.OrderCustomerController = void 0;
const orderCustomerServices_1 = require("../services/orderCustomerServices");
const ratingServices_1 = require("../services/ratingServices");
const productUtils_1 = require("../utilities/productUtils");
const userServices_1 = require("../services/userServices");
const notificationHandler_1 = require("../utilities/notificationHandler");
const orderSellerServices_1 = require("../services/orderSellerServices");
const node_cron_1 = __importDefault(require("node-cron"));
const productServices_1 = require("../services/productServices");
const bakeryServices_1 = require("../services/bakeryServices");
const orderCustomerServices = new orderCustomerServices_1.OrderCustomerServices();
const ratingServices = new ratingServices_1.RatingServices();
const userServices = new userServices_1.UserServices();
const productServices = new productServices_1.ProductServices();
const bakeryServices = new bakeryServices_1.BakeryServices();
const orderSellerServices = new orderSellerServices_1.OrderSellerServices();
class OrderCustomerController {
    constructor() {
        this.scheduleDeactiveUnpaidOrders();
        this.scheduleResetIsCancelled();
    }
    scheduleResetIsCancelled() {
        node_cron_1.default.schedule('0 0 * * *', () => __awaiter(this, void 0, void 0, function* () {
            console.log("Running daily reset at 00:00...");
            try {
                const usersToReset = yield userServices.findUsersWithCancelledThreshold(3);
                for (const user of usersToReset) {
                    yield userServices.updateUserCancelled(user.userId, 0);
                    console.log(`User ${user.userId}'s isCancelled count reset.`);
                }
            }
            catch (error) {
                console.error("Error during daily reset:", error);
            }
        }));
    }
    scheduleDeactiveUnpaidOrders() {
        node_cron_1.default.schedule("* * * * *", () => __awaiter(this, void 0, void 0, function* () {
            try {
                const paymentDueAt = new Date(Date.now() - 15 * 60 * 1000);
                const orderToDeactive = yield orderCustomerServices.findOnPaymentOrders(paymentDueAt);
                if (orderToDeactive.length === 0) {
                    return;
                }
                for (const order of orderToDeactive) {
                    yield orderCustomerServices.deactiveUnpaidOrders(order.orderId);
                    yield Promise.all(order.orderDetail.map((detail) => __awaiter(this, void 0, void 0, function* () {
                        const currentProduct = yield productServices.findProductById(detail.productId);
                        const updatedProductStock = Number(currentProduct === null || currentProduct === void 0 ? void 0 : currentProduct.productStock) + detail.productQuantity;
                        yield productServices.updateProductStock(detail.productId, updatedProductStock);
                    })));
                    const seller = yield userServices.findSellerByBakeryId(order.bakeryId);
                    if (seller === null || seller === void 0 ? void 0 : seller.pushToken) {
                        yield (0, notificationHandler_1.sendNotifications)(seller.pushToken, 'Pesanan Dibatalkan', 'Pesanan dibatalkan secara otomatis karena pembeli belum melakukan pembayaran');
                    }
                    const buyer = yield userServices.findBuyerByOrderId(order.orderId);
                    if (buyer === null || buyer === void 0 ? void 0 : buyer.pushToken) {
                        yield (0, notificationHandler_1.sendNotifications)(buyer.pushToken, 'Pesanan Dibatalkan', 'Pesanan dibatalkan secara otomatis karena belum melakukan pembayaran');
                    }
                }
            }
            catch (error) {
                console.error("[src][controllers][OrderCustomerController][scheduleDeactiveUnpaidOrders] Error: ", error);
            }
        }));
    }
    createOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, orderDetail, bakeryId } = req.body;
                if ((!userId || !orderDetail || !bakeryId)) {
                    res.status(400);
                    throw new Error('All fields must be filled');
                }
                const user = yield userServices.findUserById(userId);
                if (!user) {
                    res.status(404).json({ message: "User not found" });
                    return;
                }
                if (user.isCancelled > 3) {
                    res.status(403).json({
                        status: 403,
                        message: "You cannot create a new order because your account has exceeded the cancellation limit."
                    });
                    return;
                }
                const bakery = yield bakeryServices.findBakeryById(bakeryId);
                if (!bakery || !bakery.closingTime) {
                    res.status(404).send('Bakery not found or closing time not set');
                    return;
                }
                const currentTime = new Date();
                const closingTime = new Date();
                const [closingHour, closingMinute] = bakery.closingTime.split(':').map(Number);
                closingTime.setHours(closingHour, closingMinute, 0, 0);
                if (currentTime > closingTime) {
                    res.status(404).json({
                        status: 404,
                        message: 'The bakery is closed. Please try again during business hours.'
                    });
                    return;
                }
                const order = yield orderCustomerServices.createOrder({
                    userId,
                    orderDetail,
                    bakeryId
                });
                const seller = yield userServices.findSellerByBakeryId(bakeryId);
                if (seller === null || seller === void 0 ? void 0 : seller.pushToken) {
                    yield (0, notificationHandler_1.sendNotifications)(seller.pushToken, 'Pesanan Baru', 'Anda memiliki pesanan baru');
                }
                res.status(200).json({
                    status: 200,
                    data: order
                });
            }
            catch (error) {
                console.log("[src][controllers][OrderCustomerController][createOrder] ", error);
                next(error);
            }
        });
    }
    getOrderByStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { orderStatus, userId } = req.body;
                if (!Array.isArray(orderStatus)) {
                    orderStatus = orderStatus === 4 ? [4, 5] : [orderStatus];
                }
                const statusOrderDirection = orderStatus.includes(4) || orderStatus.includes(5) ? "desc" : "asc";
                const orders = yield orderCustomerServices.getOrderByStatus(orderStatus, userId, statusOrderDirection);
                if (orders.length === 0) {
                    res.status(404).json({
                        status: 404,
                        message: "No orders found"
                    });
                    return;
                }
                const newOrderData = yield Promise.all(orders.map((order) => __awaiter(this, void 0, void 0, function* () {
                    const isRated = yield ratingServices.checkIsOrderRated(order.orderId);
                    const prevRating = yield ratingServices.findRatingByBakery(order.bakeryId);
                    const totalRatings = prevRating.reduce((sum, r) => sum + r.rating, 0);
                    const averageRating = prevRating.length > 0 ? (totalRatings / prevRating.length).toFixed(1) : '0.0';
                    const reviewCount = prevRating.filter((r) => r.review !== '').length;
                    const updatedOrderDetails = order.orderDetail.map((detail) => {
                        const orderDatePrice = (0, productUtils_1.getPriceOnOrderDate)(detail.product, order.orderDate);
                        return Object.assign(Object.assign({}, detail), { product: Object.assign(Object.assign({}, detail.product), { orderDatePrice }), totalDetailPrice: detail.productQuantity * orderDatePrice.toNumber(), discountPercentage: (0, productUtils_1.calculateDiscountPercentage)(detail.product.productPrice, orderDatePrice) });
                    });
                    const totalOrderQuantity = order.orderDetail.reduce((sum, detail) => sum + detail.productQuantity, 0);
                    const totalOrderPrice = order.orderDetail.reduce((sum, detail) => sum + detail.productQuantity * (0, productUtils_1.getPriceOnOrderDate)(detail.product, order.orderDate).toNumber(), 0);
                    return Object.assign(Object.assign({}, order), { orderDetail: updatedOrderDetails, isRated, prevRating: { averageRating, reviewCount }, totalOrderQuantity, totalOrderPrice });
                })));
                res.status(200).json({
                    status: 200,
                    data: newOrderData
                });
            }
            catch (error) {
                console.log("[src][controllers][OrderCustomerController][getOrderByStatus] ", error);
                next(error);
            }
        });
    }
    cancelOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId, bakeryId, isUpdateStock } = req.body;
                const order = yield orderCustomerServices.cancelOrder(orderId);
                if (!order) {
                    res.status(404).json({ message: "Order not found" });
                    return;
                }
                if (isUpdateStock) {
                    const orderDetail = yield orderSellerServices.findOrderDetailsByOrderId(orderId);
                    yield Promise.all(orderDetail.map((detail) => __awaiter(this, void 0, void 0, function* () {
                        const currentProduct = yield productServices.findProductById(detail.productId);
                        const updatedProductStock = Number(currentProduct === null || currentProduct === void 0 ? void 0 : currentProduct.productStock) + detail.productQuantity;
                        yield productServices.updateProductStock(detail.productId, updatedProductStock);
                    })));
                }
                const seller = yield userServices.findSellerByBakeryId(bakeryId);
                if (seller === null || seller === void 0 ? void 0 : seller.pushToken) {
                    yield (0, notificationHandler_1.sendNotifications)(seller.pushToken, 'Pesanan Dibatalkan', 'Maaf, pembeli telah membatalkan pesanan');
                }
                res.status(200).json({
                    status: 200,
                    data: order,
                });
            }
            catch (error) {
                console.log("[src][controllers][OrderCustomerController][cancelOrder] ", error);
                next(error);
            }
        });
    }
    submitProofOfPayment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId, proofOfPayment, bakeryId } = req.body;
                yield orderCustomerServices.submitProofOfPayment(orderId, proofOfPayment);
                const seller = yield userServices.findSellerByBakeryId(bakeryId);
                if (seller === null || seller === void 0 ? void 0 : seller.pushToken) {
                    yield (0, notificationHandler_1.sendNotifications)(seller.pushToken, 'Pembayaran Berhasil', 'Harap cek pembayaran dan melakukan konfirmasi');
                }
                res.status(200).json({
                    status: 200,
                    message: "Proof of payment submitted successfully",
                });
            }
            catch (error) {
                console.log("[src][controllers][OrderCustomerController][submitProofOfPayment] ", error);
                next(error);
            }
        });
    }
}
exports.OrderCustomerController = OrderCustomerController;
