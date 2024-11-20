import { NextFunction, Request, Response } from "express";
import { ProductServices } from "../services/productServices";
import { CreateProductInput } from "../services/productServices";
import cron from "node-cron";

const productServices = new ProductServices();

export class ProductController {
  constructor() {
    this.scheduleDeactivateExpiredProducts();
  }

  private scheduleDeactivateExpiredProducts() {
    cron.schedule("0 0 * * *", async () => {
      try {
        console.log("Running Expired Product Deactivation (CRON)");
        await productServices.deactivateExpiredProducts();
      } catch (error) {
        console.error(
          "[ProductController][scheduleDeactivateExpiredProducts] Error:",
          error
        );
      }
    });
  }

  public async createProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const productData: CreateProductInput = req.body;
      console.log(productData);
      if (
        !productData.productName ||
        !productData.productPrice ||
        !productData.productImage ||
        !productData.productDescription ||
        !productData.productExpirationDate ||
        !productData.productStock ||
        !productData.discount ||
        !productData.bakeryId ||
        !productData.categoryId
      ) {
        console.log(
          "[src][controllers][ProductController][createProduct] Missing required fields"
        );
        res.status(400).send("Missing required fields");
        return;
      }

      for (const disc of productData.discount) {
        if (!disc.discountAmount) {
          console.log(
            "[src][controllers][ProductController][createProduct] Invalid data in Discount"
          );
          res.status(400).send("Invalid data in Discount");
          return;
        }
      }

      const createdProduct = await productServices.createProduct(productData);

      res.status(201).json(createdProduct);
    } catch (error) {
      console.log(
        "[src][controllers][ProductController][createProduct] ",
        error
      );
      next(error);
    }
  }

  public async getProductById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { productId } = req.body;
      const createdProduct = await productServices.findProductById(productId);

      if (!createdProduct) {
        console.log(
          "[src][controllers][ProductController][getProductById] Product ID Not Found"
        );
        res.status(400).send("Product ID Not Found");
        return;
      }

      res.status(200).json({
        status: 200,
        data: createdProduct,
      });
    } catch (error) {
      console.log(
        "[src][controllers][ProductController][getProductById] ",
        error
      );
      next(error);
    }
  }

  public async updateProductById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { productId } = req.body;
      const productData: CreateProductInput = req.body;
      console.log(productData);
      if (
        !productId ||
        !productData.productName ||
        !productData.productPrice ||
        !productData.productImage ||
        !productData.productDescription ||
        !productData.productExpirationDate ||
        !productData.productStock ||
        !productData.bakeryId ||
        !productData.categoryId
      ) {
        console.log(
          "[src][controllers][ProductController][updateProductById] Missing required fields"
        );
        res.status(400).send("Missing required fields");
        return;
      }

      for (const disc of productData.discount) {
        if (!disc.discountAmount) {
          console.log(
            "[src][controllers][ProductController][updateProductById] Invalid data in Discount"
          );
          res.status(400).send("Invalid data in Discount");
          return;
        }
      }

      const updatedProduct = await productServices.updateProductById(
        productId,
        productData
      );

      if (!updatedProduct) {
        console.log(
          "[src][controllers][ProductController][updateProductById] Product ID Not Found"
        );
        res.status(400).send("Product ID Not Found");
        return;
      }

      res.status(200).json(updatedProduct);
    } catch (error) {
      console.log(
        "[src][controllers][ProductController][updateProductById] ",
        error
      );
      next(error);
    }
  }

  public async searchProductByKeyword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { keyword } = req.query;

      if (!keyword || typeof keyword !== "string") {
        console.log(
          "[src][controllers][ProductController][searchProductByKeyword] Keyword is required"
        );
        res.status(400).send("Keyword is required");
        return;
      }

      const foundProducts = await productServices.searchProductByKeyword(
        keyword
      );

      if (foundProducts.length === 0) {
        console.log(
          "[src][controllers][ProductController][searchProductByKeyword] No products found"
        );
        res.status(404).send("No products found");
        return;
      }

      res.status(200).json(foundProducts);
    } catch (error) {
      console.log(
        "[src][controllers][ProductController][searchProductByKeyword] ",
        error
      );
      next(error);
    }
  }

  public async deleteProductById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { productId } = req.body;
      const numericProductId = Number(productId);
      console.log(req.body);
      console.log(productId);

      if (!productId) {
        console.log(
          "[src][controllers][ProductController][deleteProductById] Product ID is required"
        );
        res.status(400).send("Product ID is required");
        return;
      }

      const deletedProduct = await productServices.deleteProductById(
        numericProductId
      );

      if (!deletedProduct) {
        console.log(
          "[src][controllers][ProductController][deleteProductById] Product not found or could not be deleted"
        );
        res.status(404).send("Product not found or could not be deleted");
        return;
      }

      res.status(200).send("Product deleted successfully");
    } catch (error) {
      console.log(
        "[src][controllers][ProductController][deleteProductById] ",
        error
      );
      next(error);
    }
  }

  public async getProductsByCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { categoryName } = req.body;

      if (!categoryName) {
        console.log(
          "[src][controllers][ProductController][getProductsByCategory] Category name is required"
        );
        res.status(400).send("Category name is required");
        return;
      }

      const products = await productServices.findProductsByCategory(
        categoryName
      );

      res.status(200).json(products);
    } catch (error) {
      console.log(
        "[src][controllers][ProductController][getProductsByCategory] ",
        error
      );
      next(error);
    }
  }

  public async findRecommendedProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { regionId } = req.body;

      if (!regionId) {
        console.log(
          "[src][controllers][ProductController][findRecommendedProducts] Region ID is required"
        );
        res.status(400).send("Region ID is required");
        return;
      }

      const recommendedProducts = await productServices.findRecommendedProducts(
        regionId
      );

      res.status(200).json({
        status: 200,
        data: recommendedProducts,
      });
    } catch (error) {
      console.log(
        "[src][controllers][ProductController][findRecommendedProducts] ",
        error
      );
      next(error);
    }
  }

  public async findExpiringProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const expiringProducts = await productServices.findExpiringProducts();

      res.status(200).json({
        status: 200,
        data: expiringProducts,
      });
    } catch (error) {
      console.log(
        "[src][controllers][ProductController][findExpiringProducts] ",
        error
      );
      next(error);
    }
  }

  public async getProductsByBakeryId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { bakeryId, isActive } = req.body;

      if (!bakeryId || !isActive) {
        console.log(
          "[src][controllers][ProductController][getProductsByBakeryId] Bakery ID or isActive is required"
        );
        res.status(400).send("Bakery ID or isActive is required");
        return;
      }

      const products = await productServices.findProductsByBakeryId(
        bakeryId,
        isActive
      );

      if (products.length === 0) {
        console.log(
          "[src][controllers][ProductController][getProductsByBakeryId] No products found for this bakery ID"
        );
        res.status(404).send("No products found for this bakery ID");
        return;
      }

      const today = new Date().toISOString().split("T")[0];

      const modifiedProducts = products.map((product) => {
        const todayDiscount = product.discount.find((discount) => {
          const discountDateString =
            typeof discount.discountDate === "string"
              ? discount.discountDate
              : discount.discountDate?.toISOString();

          return discountDateString?.split("T")[0] === today;
        })?.discountAmount;

        return {
          ...product,
          todayPrice: todayDiscount || product.productPrice,
        };
      });

      res.status(200).json({
        status: 200,
        data: modifiedProducts,
      });
    } catch (error) {
      console.log(
        "[src][controllers][ProductController][getProductsByBakeryId]",
        error
      );
      next(error);
    }
  }

  public async findBakeryByProductId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { productId } = req.body;

      if (!productId) {
        console.log(
          "[src][controllers][ProductController][findBakeryByProductId] Product ID is required"
        );
        res.status(400).send("Product ID is required");
        return;
      }

      const product = await productServices.findBakeryByProductId(productId);

      res.status(200).json({
        status: 200,
        data: product,
      });
    } catch (error) {
      console.log(
        "[src][controllers][ProductController][findBakeryByProductId] ",
        error
      );
      next(error);
    }
  }
}
