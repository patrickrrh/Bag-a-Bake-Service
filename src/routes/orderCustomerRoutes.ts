import express from 'express';
import { OrderCustomerController } from '../controllers/orderCustomerControllers';

const router = express.Router();

const orderCustomerController = new OrderCustomerController();

router.post("/create/order", orderCustomerController.createOrder);
router.post("/get/order/status", orderCustomerController.getOrderByStatus);
router.post("/get/order/detail/id", orderCustomerController.getOrderDetailById); 

export default router