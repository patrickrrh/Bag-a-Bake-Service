import express from 'express';
import { BakeryController } from '../controllers/bakeryController';

const router = express.Router();

const bakeryController = new BakeryController();

router.post("/get/bakery/by-product", bakeryController.findBakeryByProduct);
router.post("/get/bakery/by-id", bakeryController.findBakeryById);
router.post("/get/bakery/with-filters", bakeryController.findBakeryWithFilters);
router.put("/update/bakery", bakeryController.updateBakery);

router.post("/get/user/by-id", bakeryController.getUserId);

export default router;