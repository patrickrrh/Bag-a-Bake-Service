import express from 'express';
import { CategoryController } from '../controllers/categoryController';

const router = express.Router();

const categoryController = new CategoryController();

router.post("/create/category", categoryController.createCategory);
router.get("/get/category", categoryController.findCategory);

export default router;