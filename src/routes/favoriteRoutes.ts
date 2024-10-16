import express from 'express';
import { FavoriteController } from '../controllers/favoriteControllers';

const router = express.Router();

const favoriteController = new FavoriteController();

router.post("/add/favorite", favoriteController.addFavorite);
router.delete("/remove/favorite", favoriteController.removeFavorite);
router.get("/get/favorite", favoriteController.findAllFavorite);

export default router;