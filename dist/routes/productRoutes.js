"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const router = express_1.default.Router();
const productController = new productController_1.ProductController();
router.post("/create/product", productController.createProduct);
router.post("/get/product/id", productController.getProductById);
router.put("/edit/product/id", productController.updateProductById);
router.delete("/delete/product/id", productController.deleteProductById);
router.post("/get/recommended/products", productController.findRecommendedProducts);
router.post("/get/expiring/products", productController.findExpiringProducts);
router.post("/get/bakery/product", productController.findBakeryByProductId);
router.post("/get/products/bakery", productController.getProductsByBakeryId);
exports.default = router;
