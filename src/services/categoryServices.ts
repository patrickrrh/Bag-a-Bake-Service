import { Category } from "@prisma/client";
import databaseService from "../script";

export interface CreateCategoryInput {
    categoryName: string;
    categoryImage: string;
}

export class CategoryServices {
    public async createCategory(category: CreateCategoryInput): Promise<Category> {
        try {
            return await databaseService.getClient().category.create({
                data: category
            })
        } catch (error) {
            console.log("[src][services][KategoriServices][createCategory] ", error)
            throw new Error("Failed to create category")
        }
    }

    public async getAvailableCategory(): Promise<Category[]> {
        try {
            return databaseService.getClient().category.findMany()
        } catch (error) {
            console.log("[src][services][KategoriServices][findCategory] ", error)
            throw new Error("Failed to find category")
        }
    }
}