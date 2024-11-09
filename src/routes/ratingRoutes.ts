import { RatingController } from "../controllers/ratingControllers";
import express from "express";

const router = express.Router();

const ratingController = new RatingController();

router.post("/create/rating", ratingController.createRating);

export default router;