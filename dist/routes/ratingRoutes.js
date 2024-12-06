"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ratingControllers_1 = require("../controllers/ratingControllers");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const ratingController = new ratingControllers_1.RatingController();
router.post("/create/rating", ratingController.createRating);
router.post("/get/rating/user-detail", ratingController.findBakeryRatingWithUserDetail);
exports.default = router;
