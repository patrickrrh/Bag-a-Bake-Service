"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryController_1 = require("../controllers/categoryController");
const router = express_1.default.Router();
const categoryController = new categoryController_1.CategoryController();
router.post("/create/category", categoryController.createCategory);
router.get("/get/category", categoryController.getAvailableCategory);
exports.default = router;
