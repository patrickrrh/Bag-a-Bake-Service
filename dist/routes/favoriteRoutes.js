"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const favoriteControllers_1 = require("../controllers/favoriteControllers");
const router = express_1.default.Router();
const favoriteController = new favoriteControllers_1.FavoriteController();
router.post("/add/favorite", favoriteController.addFavorite);
router.delete("/remove/favorite/:favoriteId", favoriteController.removeFavorite);
router.post("/get/favorite", favoriteController.findAllFavorite);
exports.default = router;
