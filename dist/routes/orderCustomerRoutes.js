"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderCustomerControllers_1 = require("../controllers/orderCustomerControllers");
const router = express_1.default.Router();
const orderCustomerController = new orderCustomerControllers_1.OrderCustomerController();
router.post("/create/order", orderCustomerController.createOrder);
router.post("/get/order/status", orderCustomerController.getOrderByStatus);
router.post("/cancel/order", orderCustomerController.cancelOrder);
router.post("/submit/proof-of-payment", orderCustomerController.submitProofOfPayment);
exports.default = router;
