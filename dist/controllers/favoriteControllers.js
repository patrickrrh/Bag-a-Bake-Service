"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteController = void 0;
const favoriteServices_1 = require("../services/favoriteServices");
const favoriteServices = new favoriteServices_1.FavoriteServices();
class FavoriteController {
    addFavorite(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, bakeryId } = req.body;
                if (!userId || !bakeryId) {
                    console.log("[src][controllers][FavoriteController][addFavorite] userId or bakeryId is required");
                    res.status(400).send("userId or bakeryId is required");
                    return;
                }
                const favorite = yield favoriteServices.addFavorite({ userId, bakeryId });
                res.status(201).json({
                    status: 201,
                    data: favorite
                });
            }
            catch (error) {
                console.log("[src][controllers][FavoriteController][addFavorite] ", error);
                next(error);
            }
        });
    }
    removeFavorite(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { favoriteId } = req.params;
                if (!favoriteId) {
                    console.log("[src][controllers][FavoriteController][addFavorite] userId or bakeryId is required");
                    res.status(400).send("userId or bakeryId is required");
                    return;
                }
                const favorite = yield favoriteServices.removeFavorite(Number(favoriteId));
                res.status(200).json({
                    status: 200
                });
            }
            catch (error) {
                console.log("[src][controllers][FavoriteController][removeFavorite] ", error);
                next(error);
            }
        });
    }
    findAllFavorite(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                const favorites = yield favoriteServices.findAllFavorite(userId);
                res.status(200).json({
                    status: 200,
                    data: favorites
                });
            }
            catch (error) {
                console.log("[src][controllers][FavoriteController][findAllFavorite] ", error);
                next(error);
            }
        });
    }
}
exports.FavoriteController = FavoriteController;
