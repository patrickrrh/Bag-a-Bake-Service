import express from 'express';
import { ProductController } from '../controllers/productController';

const router = express.Router();

const productController = new ProductController();

router.post("/create/product", productController.createProduct);
router.post("/get/product/id", productController.getProductById);
router.put("/edit/product/id", productController.updateProductById);
router.get("/search/product", productController.searchProductByKeyword);
router.delete("/delete/product/id", productController.deleteProductById);
router.post("/get/products/category", productController.getProductsByCategory);

export default router