"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controllers/paymentController");
const router = express_1.default.Router();
const paymentController = new paymentController_1.PaymentController();
router.post("/get/bakery/payment-info", paymentController.findPaymentInfoByBakeryId);
router.put("/update/payments", paymentController.updatePayments);
exports.default = router;
