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
exports.CategoryController = void 0;
const categoryServices_1 = require("../services/categoryServices");
const categoryServices = new categoryServices_1.CategoryServices();
class CategoryController {
    createCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryData = req.body;
                if (!categoryData) {
                    console.log("[src][controllers][CategoryController][createCategory] All fields must be filled");
                    res.status(401).json({ error: 'All fields must be filled' });
                    return;
                }
                const createdCategory = yield categoryServices.createCategory(categoryData);
                res.status(200).json(createdCategory);
            }
            catch (error) {
                console.log("[src][controllers][CategoryController][createCategory] ", error);
                next(error);
            }
        });
    }
    getAvailableCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield categoryServices.getAvailableCategory();
                res.status(200).json({
                    status: 200,
                    data: category
                });
            }
            catch (error) {
                console.log("[src][controllers][CategoryController][findCategory] ", error);
                next(error);
            }
        });
    }
}
exports.CategoryController = CategoryController;
