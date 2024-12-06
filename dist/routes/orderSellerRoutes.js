"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderSellerController_1 = require("../controllers/orderSellerController");
const router = express_1.default.Router();
const orderSellerController = new orderSellerController_1.OrderSellerController();
router.post("/get/latest/pending/order", orderSellerController.findLatestPendingOrder);
router.post("/get/latest/payment/order", orderSellerController.findLatestPaymentOrder);
router.post("/get/latest/ongoing/order", orderSellerController.findLatestOngoingOrder);
router.post("/count/all/pending/order", orderSellerController.countAllPendingOrder);
router.post("/count/all/on-payment/order", orderSellerController.countAllOnPaymentOrder);
router.post("/count/all/ongoing/order", orderSellerController.countAllOngoingOrder);
router.post("/get/all/order/status", orderSellerController.findAllOrderByStatus);
router.put("/action/order", orderSellerController.actionOrder);
router.post("/seller/cancel/order", orderSellerController.cancelOrder);
exports.default = router;
