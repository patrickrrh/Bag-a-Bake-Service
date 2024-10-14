import { NextFunction, Request, Response } from "express";
import { CreateCategoryInput, CategoryServices } from "../services/categoryServices";

const categoryServices = new CategoryServices();

export class CategoryController {
    public async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const categoryData: CreateCategoryInput = req.body;

            if (!categoryData) {
                console.log("[src][controllers][CategoryController][createCategory] All fields must be filled");
                res.status(401).json({ error: 'All fields must be filled' });
                return;
            }

            const createdCategory = await categoryServices.createCategory(categoryData);
            res.status(200).json(createdCategory);
        } catch (error) {
            console.log("[src][controllers][CategoryController][createCategory] ", error);
            next(error);
        }
    }

    public async getAvailableCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const category = await categoryServices.getAvailableCategory();
            res.status(200).json({
                status: 200,
                data: category
            });
        } catch (error) {
            console.log("[src][controllers][CategoryController][findCategory] ", error);
            next(error);
        }
    }
}