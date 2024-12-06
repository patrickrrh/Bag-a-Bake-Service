"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bakeryController_1 = require("../controllers/bakeryController");
const router = express_1.default.Router();
const bakeryController = new bakeryController_1.BakeryController();
router.post("/get/bakery/by-product", bakeryController.findBakeryByProduct);
router.post("/get/bakery/by-id", bakeryController.findBakeryById);
router.post("/get/bakery/with-filters", bakeryController.findBakeryWithFilters);
router.put("/update/bakery", bakeryController.updateBakery);
router.post("/get/user/by-id", bakeryController.getUserId);
router.post("/get/list/bakery", bakeryController.findListBakery);
router.put("/update/bakery/active", bakeryController.updateBakeryIsActive);
router.post("/delete/bakery", bakeryController.deleteBakery);
exports.default = router;
