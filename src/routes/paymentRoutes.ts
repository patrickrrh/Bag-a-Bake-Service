import express from 'express';
import { PaymentController } from "../controllers/paymentController";

const router = express.Router();

const paymentController = new PaymentController();

router.post("/get/bakery/payment-info", paymentController.findPaymentInfoByBakeryId);
router.put("/update/payments", paymentController.updatePayments);

export default router