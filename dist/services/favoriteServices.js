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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteServices = void 0;
const script_1 = __importDefault(require("../script"));
class FavoriteServices {
    addFavorite(favorite) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield script_1.default.getClient().favorite.create({
                    data: favorite
                });
            }
            catch (error) {
                console.log("[src][services][FavoriteServices][createFavorite] ", error);
                throw new Error("Failed to create favorite");
            }
        });
    }
    removeFavorite(favoriteId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield script_1.default.getClient().favorite.delete({
                    where: {
                        favoriteId: favoriteId
                    }
                });
            }
            catch (error) {
                console.log("[src][services][FavoriteServices][removeFavorite] ", error);
                throw new Error("Failed to remove favorite");
            }
        });
    }
    findAllFavorite(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield script_1.default.getClient().favorite.findMany({
                    where: {
                        userId
                    },
                    include: {
                        bakery: true
                    }
                });
            }
            catch (error) {
                console.log("[src][services][FavoriteServices][findAllFavorite] ", error);
                throw new Error("Failed to find favorite");
            }
        });
    }
}
exports.FavoriteServices = FavoriteServices;
