import express from 'express';
import { OrderCustomerController } from '../controllers/orderCustomerControllers';

const router = express.Router();

const orderCustomerController = new OrderCustomerController();

router.post("/create/order", orderCustomerController.createOrder);

export default router