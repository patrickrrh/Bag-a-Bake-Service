import express from 'express';
import { BakeryController } from '../controllers/bakeryController';

const router = express.Router();

const bakeryController = new BakeryController();

router.get("/get/bakery", bakeryController.findAllBakery);
router.post("/get/bakery/by-category", bakeryController.findBakeryByCategory);
router.post("/get/bakery/by-product", bakeryController.findBakeryByProduct);
router.post("/get/bakery/by-region", bakeryController.findBakeryByRegion);

export default router;