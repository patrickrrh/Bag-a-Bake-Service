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
exports.CategoryServices = void 0;
const script_1 = __importDefault(require("../script"));
class CategoryServices {
    createCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield script_1.default.getClient().category.create({
                    data: category
                });
            }
            catch (error) {
                console.log("[src][services][KategoriServices][createCategory] ", error);
                throw new Error("Failed to create category");
            }
        });
    }
    getAvailableCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return script_1.default.getClient().category.findMany();
            }
            catch (error) {
                console.log("[src][services][KategoriServices][findCategory] ", error);
                throw new Error("Failed to find category");
            }
        });
    }
}
exports.CategoryServices = CategoryServices;
