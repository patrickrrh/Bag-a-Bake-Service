import express from 'express';
import { OrderCustomerController } from '../controllers/orderCustomerControllers';

const router = express.Router();

const orderCustomerController = new OrderCustomerController();

router.post("/create/order", orderCustomerController.createOrder);
router.post("/get/order/status", orderCustomerController.getOrderByStatus);
router.post("/cancel/order", orderCustomerController.cancelOrder);
router.post("/submit/proof-of-payment", orderCustomerController.submitProofOfPayment);

export default router