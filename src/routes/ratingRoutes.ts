import { RatingController } from "../controllers/ratingControllers";
import express from "express";

const router = express.Router();

const ratingController = new RatingController();

router.post("/create/rating", ratingController.createRating);
router.post("/get/rating/user-detail", ratingController.findBakeryRatingWithUserDetail);

export default router;