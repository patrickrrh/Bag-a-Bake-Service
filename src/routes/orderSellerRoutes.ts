import express from 'express';
import { OrderSellerController } from '../controllers/orderSellerController';

const router = express.Router();

const orderSellerController = new OrderSellerController();

router.post("/get/latest/pending/order", orderSellerController.findLatestPendingOrder);
router.post("/get/latest/payment/order", orderSellerController.findLatestPaymentOrder);
router.post("/get/latest/ongoing/order", orderSellerController.findLatestOngoingOrder);
router.post("/count/all/pending/order", orderSellerController.countAllPendingOrder);
router.post("/count/all/on-payment/order", orderSellerController.countAllOnPaymentOrder);
router.post("/count/all/ongoing/order", orderSellerController.countAllOngoingOrder);
router.post("/get/all/order/status", orderSellerController.findAllOrderByStatus);
router.put("/action/order", orderSellerController.actionOrder);
router.post("/cancel/order", orderSellerController.cancelOrder);

export default router;

