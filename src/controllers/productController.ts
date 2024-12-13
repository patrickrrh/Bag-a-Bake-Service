import { NextFunction, Request, Response } from "express";
import { ProductServices } from "../services/productServices";
import { CreateProductInput } from "../services/productServices";
import { calculateDiscountPercentage, getTodayPrice } from "../utilities/productUtils";
import { RatingServices } from "../services/ratingServices";
import getDistance from "geolib/es/getPreciseDistance";
import { getPreciseDistance } from "geolib";
import cron from "node-cron";
import path from "path";
import fs from "fs";

const productServices = new ProductServices();
const ratingServices = new RatingServices();

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

      const encodedProductImage = req.body.productImage;
      if (encodedProductImage) {
        const buffer = Buffer.from(encodedProductImage, 'base64');
        const fileName = `productImage-${Date.now()}.jpeg`;

        const filePath = path.join(__dirname, '../uploads/product', fileName);
        fs.writeFileSync(filePath, buffer);

        productData.productImage = path.join(fileName);
      }

      const createdProduct = await productServices.createProduct(productData);

      res.status(201).json({
        status: 201,
        data: createdProduct,
      });
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

      const todayPrice = getTodayPrice(createdProduct);
      const discountPercentage = calculateDiscountPercentage(createdProduct.productPrice, todayPrice);

      res.status(200).json({
        status: 200,
        data: {
          ...createdProduct, todayPrice, discountPercentage
        },
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
      if (
        !productId ||
        !productData.productName ||
        !productData.productPrice ||
        !productData.productDescription ||
        !productData.productExpirationDate ||
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

      const prevProduct = await productServices.findProductById(productId);
      if (!prevProduct) {
        console.log("[src][controllers][ProductController][updateProductById] Product ID Not Found");
        res.status(400).json({
          status: 400,
          message: "Product ID Not Found",
        });
        return;
      }

      const encodedProductImage = req.body.productImage;
      if (encodedProductImage) {

        if (prevProduct.productImage) {
          const oldImagePath = path.join(__dirname, '../uploads/product', prevProduct.productImage);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }

        const buffer = Buffer.from(encodedProductImage, 'base64');
        const fileName = `productImage-${Date.now()}.jpeg`;

        const filePath = path.join(__dirname, '../uploads/product', fileName);
        fs.writeFileSync(filePath, buffer);

        productData.productImage = path.join(fileName);
      }

      const updatedProduct = await productServices.updateProductById(
        productId,
        productData
      );

      console.log("update product res", updatedProduct)

      if (!updatedProduct) {
        console.log(
          "[src][controllers][ProductController][updateProductById] Product ID Not Found"
        );
        res.status(400).send("Product ID Not Found");
        return;
      }

      res.status(200).json({
        status: 200,
        data: updatedProduct,
      });
    } catch (error) {
      console.log(
        "[src][controllers][ProductController][updateProductById] ",
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

  public async findRecommendedProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentTime = new Date();
      const currentHour = currentTime.getHours().toString().padStart(2, '0');
      const currentMinute = currentTime.getMinutes().toString().padStart(2, '0');
      const formattedTime = `${currentHour}:${currentMinute}`;

      const products = await productServices.findRecommendedProducts(formattedTime);

      const userLocation = {
        latitude: req.body.latitude,
        longitude: req.body.longitude,
      };

      const nearestProductsMap = new Map();

      products.forEach((product) => {
        const bakeryLocation = {
          latitude: product.bakery.bakeryLatitude,
          longitude: product.bakery.bakeryLongitude,
        };

        const distance = getPreciseDistance(userLocation, bakeryLocation, 0.01);
        const distanceInKm = parseFloat((distance / 1000).toFixed(2));

        if (
          !nearestProductsMap.has(product.bakery.bakeryId) ||
          distance < nearestProductsMap.get(product.bakery.bakeryId).distance
        ) {
          nearestProductsMap.set(product.bakery.bakeryId, {
            ...product,
            todayPrice: getTodayPrice(product),
            discountPercentage: calculateDiscountPercentage(product.productPrice, getTodayPrice(product)),
            distanceInKm,
          });
        }
      });

      const sortedNearestProducts = Array.from(nearestProductsMap.values()).sort(
        (a, b) => a.distance - b.distance
      );
      const topNearestProducts = sortedNearestProducts.slice(0, 5);

      res.status(200).json({
        status: 200,
        data: topNearestProducts,
      });
    } catch (error) {
      console.error('[src][controllers][ProductController][findRecommendedProducts]', error);
      next(error);
    }
  }

  public async findExpiringProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentTime = new Date();
      const currentHour = currentTime.getHours().toString().padStart(2, '0');
      const currentMinute = currentTime.getMinutes().toString().padStart(2, '0');
      const formattedTime = `${currentHour}:${currentMinute}`;

      const expiringProducts = await productServices.findExpiringProducts(formattedTime);

      const userLocation = {
        latitude: req.body.latitude,
        longitude: req.body.longitude,
      };

      const modifiedProducts = expiringProducts.map((product) => {
        const bakeryLocation = {
          latitude: product.bakery.bakeryLatitude,
          longitude: product.bakery.bakeryLongitude,
        };

        const distance = getPreciseDistance(userLocation, bakeryLocation, 0.01);
        const distanceInKm = parseFloat((distance / 1000).toFixed(2));

        return {
          ...product,
          todayPrice: getTodayPrice(product),
          discountPercentage: calculateDiscountPercentage(product.productPrice, getTodayPrice(product)),
          distanceInKm,
        };
      });

      res.status(200).json({
        status: 200,
        data: modifiedProducts,
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

      const modifiedProducts = products.map((product) => ({
        ...product,
        todayPrice: getTodayPrice(product),
      }));

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

      const bakery = await productServices.findBakeryByProductId(productId);

      const ratings = await ratingServices.findRatingByBakery(bakery?.bakeryId as number);

      const totalRatings = ratings.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = ratings.length > 0 ? (totalRatings / ratings.length).toFixed(1) : '0.0';
      const reviewCount = ratings.filter((r) => r.review !== '').length;

      res.status(200).json({
        status: 200,
        data: { bakery, prevRating: { averageRating, reviewCount } },
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
