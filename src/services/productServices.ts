import { Category, ListDiscount, Product, Bakery, Prisma } from "@prisma/client";
import databaseService from "../script";
import { Decimal } from "@prisma/client/runtime/library";

export interface CreateProductInput {
  productName: string;
  productPrice: Decimal;
  productImage: string;
  productDescription: string;
  productExpirationDate: Date;
  productStock: number;
  discount: ListDiscount[];
  bakeryId: number;
  categoryId: number;
}

type ProductWithDiscount = Prisma.ProductGetPayload<{
  include: {
      discount: any
  }
}>

export class ProductServices {
  public async createProduct(product: CreateProductInput): Promise<void> {
    const prisma = databaseService.getClient();

    try {
      const createdProduct = await prisma.product.create({
        data: {
          productName: product.productName,
          productPrice: product.productPrice,
          productImage: product.productImage,
          productDescription: product.productDescription,
          productExpirationDate: product.productExpirationDate,
          productStock: product.productStock,
          bakeryId: product.bakeryId,
          categoryId: product.categoryId,
        },
      });

      await prisma.listDiscount.createMany({
        data: product.discount.map((disc) => ({
          productId: createdProduct.productId,
          discountDate: disc.discountDate,
          discountAmount: disc.discountAmount,
        })),
      });

      console.log("Product created successfully");
    } catch (error) {
      console.log("[src][services][ProductServices][createProduct] ", error);
      throw new Error("Failed to create product");
    }
  }

  public async findProductById(productId: number | string): Promise<Product | null> {
    const numericProductId = Number(productId);

    if (!numericProductId) {
      console.log(
        "[src][services][ProductServices][findProductById] Product ID is required"
      );
      throw new Error("Product ID is required");
    }
    // console.log("product id", numericProductId);
    try {
      return await databaseService.getClient().product.findUnique({
        where: { productId: numericProductId },
        include: {
          discount: true,
        },
      });
    } catch (error) {
      console.log("[src][services][ProductServices][findProductById] ", error);
      throw new Error("Failed to find product");
    }
  }


  public async updateProductById(
    productId: number,
    product: CreateProductInput
  ): Promise<Product | null> {
    if (!productId) {
      console.log(
        "[src][services][ProductServices][updateProductById] Product ID is required"
      );
      throw new Error("Product ID is required");
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
            create: product.discount.map((disc) => ({
              discountDate: disc.discountDate,
              discountAmount: disc.discountAmount,
            })),
          },
          bakeryId: product.bakeryId,
          categoryId: product.categoryId,
        },
        include: {
          discount: true,
        },
      });

      return updatedProduct;
    } catch (error) {
      console.log(
        "[src][services][ProductServices][updateProductById] ",
        error
      );
      throw new Error("Failed to update product");
    }
  }

  public async searchProductByKeyword(keyword: string): Promise<Product[]> {
    try {
      const normalizedKeyword = keyword.trim().replace(/\s+/g, " ");
      const keywordsArray = normalizedKeyword.split(" ");

      return await databaseService.getClient().product.findMany({
        where: {
          OR: keywordsArray.map((word) => ({
            OR: [
              {
                productName: {
                  contains: word,
                  mode: "insensitive",
                },
              },
              {
                productDescription: {
                  contains: word,
                  mode: "insensitive",
                },
              },
            ],
          })),
          isActive: 1,
        },
        include: {
          discount: true,
          category: true,
          bakery: true,
        },
      });
    } catch (error) {
      console.log(
        "[src][services][ProductServices][searchProductByKeyword] ",
        error
      );
      throw new Error("Failed to search for products");
    }
  }

  public async deleteProductById(productId: number): Promise<Product | null> {
    try {
      const existingProduct = await this.findProductById(productId);
      if (!existingProduct) {
        console.log(
          "[src][services][ProductServices][deleteProductById] Product not found"
        );
        return null;
      }

      await databaseService.getClient().listDiscount.deleteMany({
        where: { productId },
      });

      return await databaseService.getClient().product.delete({
        where: { productId },
      });
    } catch (error) {
      console.log(
        "[src][services][ProductServices][deleteProductById] ",
        error
      );
      throw new Error("Failed to delete product");
    }
  }

  public async findProductsByCategory(
    categoryName: string
  ): Promise<Product[]> {
    try {
      return await databaseService.getClient().product.findMany({
        where: {
          category: {
            categoryName: {
              contains: categoryName,
            },
          },
        },
        include: {
          discount: true,
          category: true,
        },
      });
    } catch (error) {
      console.log(
        "[src][services][ProductServices][findProductsByCategory] ",
        error
      );
      throw new Error("Failed to find products by category");
    }
  }

  public async findRecommendedProducts(regionId: number): Promise<Product[]> {
    try {
      return await databaseService.getClient().product.findMany({
        where: {
          bakery: {
            regionId: regionId,
          },
        },
        orderBy: {
          productStock: "asc",
        },
        include: {
          bakery: true,
          discount: true
        },
      });
    } catch (error) {
      console.log("[src][services][ProductServices][findRecommendedProducts] ", error);
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
            productExpirationDate: "asc",
          },
          {
            productStock: "asc",
          },
        ],
        include: {
          bakery: true,
          discount: true
        },
        take: 10,
      });
    } catch (error) {
      console.log(
        "[src][services][ProductServices][findExpiringProducts] ",
        error
      );
      throw new Error("Failed to find expiring products");
    }
  }

  public async findBakeryByProductId(productId: number): Promise<Product | {}> {
    try {
      const product = await databaseService.getClient().product.findUnique({
        where: {
          productId: productId,
        },
        select: {
          bakery: {
            select: {
              bakeryName: true,
              closingTime: true,
              bakeryId: true,
              // bakeryRating: true,
            }
          }
        }
      });

      if (product !== null) {
        return product;
      } else {
        return {};
      }

    } catch (error) {
      console.log("[src][services][ProductServices][findBakeryByProductId]", error)
      throw new Error("Failed to find bakery by product ID");
    }
  }

  public async findProductsByBakeryId(bakeryId: number, isActive: number): Promise<ProductWithDiscount[]> {
    try {
      return await databaseService.getClient().product.findMany({
        where: { 
          bakeryId,
          isActive
        },
        include: {
          discount: true,
        },
      });
    } catch (error) {
      console.log("[src][services][ProductServices][findProductsByBakeryId]", error);
      throw new Error("Failed to find products by bakery ID");
    }
  }
}
