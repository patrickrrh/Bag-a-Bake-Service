import { Category, ListDiscount, Product, Bakery } from '@prisma/client';
import databaseService from '../script';

export interface CreateProductInput {
    productName: string;
    productPrice: number;
    productImage: string;
    productDescription: string;
    productExpirationDate: Date;
    productStock: number;
    discount: ListDiscount[];
    bakeryId: number;
    categoryId: number;
}

export class ProductServices {
 
    public async createProduct(product: CreateProductInput): Promise<Product> {

        try {
            return await databaseService.getClient().product.create({
                data: {
                    productName: product.productName,
                    productPrice: product.productPrice,
                    productImage: product.productImage,
                    productDescription: product.productDescription,
                    productExpirationDate: product.productExpirationDate,
                    productStock: product.productStock,
                    discount: {
                        create: product.discount.map(disc => ({
                            discountDate: disc.discountDate,
                            discountAmount: disc.discountAmount
                        }))
                    },
                    bakeryId: product.bakeryId,
                    categoryId: product.categoryId
                    
                },
                include: {
                    discount: true,
                }
            }, )
        } catch (error) {
            console.log("[src][services][ProductServices][createProduct] ", error)
            throw new Error("Failed to create product")
        }
    }

    public async findProductById(productId: number): Promise<Product | null> {
        if (!productId) {
            console.log("[src][services][ProductServices][findProductById] Product ID is required")
            throw new Error('Product ID is required');
        }
    
        try {
            return await databaseService.getClient().product.findUnique({
                where: { productId }
            })
        } catch (error) {
            console.log("[src][services][ProductServices][findProductById] ", error)
            throw new Error("Failed to find product")
        }
    }

    public async updateProductById(productId: number, product: CreateProductInput): Promise<Product | null> {

        if (!productId) {
            console.log("[src][services][ProductServices][updateProductById] Product ID is required")
            throw new Error('Product ID is required');
        }
    
        try {
            const updatedProduct = await databaseService.getClient().product.update({
                where: { productId },
                data: {
                    productName: product.productName,
                    productPrice: product.productPrice,
                    productImage: product.productImage,
                    productDescription: product.productDescription,
                    productExpirationDate: product.productExpirationDate,
                    productStock: product.productStock,
                    discount: {
                        deleteMany: {},  
                        create: product.discount.map(disc => ({
                            discountDate: disc.discountDate,
                            discountAmount: disc.discountAmount
                        }))
                    },
                    bakeryId: product.bakeryId,
                    categoryId: product.categoryId
                },
                include: {
                    discount: true,
                }
            });

            return updatedProduct;
        } catch (error) {
            console.log("[src][services][ProductServices][updateProductById] ", error)
            throw new Error("Failed to update product");
        }
    }
    
    public async searchProductByKeyword(keyword: string): Promise<Product[]> {
        try {
            const normalizedKeyword = keyword.trim().replace(/\s+/g, ' ');
            const keywordsArray = normalizedKeyword.split(' ');  
            
            return await databaseService.getClient().product.findMany({
                where: {
                    OR: keywordsArray.map(word => ({
                        OR: [
                            {
                                productName: {
                                    contains: word,
                                    mode: 'insensitive'
                                }
                            },
                            {
                                productDescription: {
                                    contains: word,
                                    mode: 'insensitive'
                                }
                            }
                        ]
                    })),
                    isActive: 1
                },
                include: {
                    discount: true,
                    category: true,
                    bakery: true
                }
            });
        } catch (error) {
            console.log("[src][services][ProductServices][searchProductByKeyword] ", error)
            throw new Error("Failed to search for products");
        }
    }

    public async deleteProductById(productId: number): Promise<Product | null> {
        try {
            const existingProduct = await this.findProductById(productId);
            if (!existingProduct) {
                console.log("[src][services][ProductServices][deleteProductById] Product not found");
                return null;
            }

            await databaseService.getClient().listDiscount.deleteMany({
                where: { productId }
            });

            return await databaseService.getClient().product.delete({
                where: { productId }
            });

        } catch (error) {
            console.log("[src][services][ProductServices][deleteProductById] ", error)
            throw new Error("Failed to delete product");
        }
    }
    
    public async findProductsByCategory(categoryName: string): Promise<Product[]> {
        try {
            return await databaseService.getClient().product.findMany({
                where: {
                    category: {
                        categoryName: {
                            contains: categoryName, 
                        }
                    }
                },
                include: {
                    discount: true,
                    category: true, 
                }
            });
        } catch (error) {
            console.log("[src][services][ProductServices][findProductsByCategory] ", error)
            throw new Error("Failed to find products by category");
        }
    }

    public async findRecommendedProducts(regionId: number): Promise<Product[]> {
        try {
            return await databaseService.getClient().product.findMany({
                where: {
                    bakery: {
                        regionId: regionId
                    } 
                },
                orderBy: {
                    productStock: 'asc'
                },
                include: {
                    bakery: true
                }
            });
        } catch (error) {
            console.log("[src][services][ProductServices][findRecommendedProducts] ", error)
            throw new Error("Failed to find recommended products");
        }
    }

    public async findExpiringProducts(): Promise<Product[]> {
        try {
            return await databaseService.getClient().product.findMany({
                where: {
                    isActive: 1,
                },
                orderBy: [
                    {
                        productExpirationDate: 'asc',
                    },
                    {
                        productStock: 'asc',
                    },
                ],
                include: {
                    bakery: true
                },
                take: 2
            })
        } catch (error) {
            console.log("[src][services][ProductServices][findExpiringProducts] ", error)
            throw new Error("Failed to find expiring products");
        }
    }
}