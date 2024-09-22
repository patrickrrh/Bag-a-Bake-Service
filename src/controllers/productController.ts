import { NextFunction, Request, Response } from "express";
import { ProductServices } from "../services/productServices";
import { CreateProductInput } from "../services/productServices"; 

const productServices = new ProductServices();

export class ProductController {
    public async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> { 
        try {
            const productData: CreateProductInput = req.body;

            if (!productData.namaProduk ||
                !productData.harga ||
                !productData.gambarProduk ||
                !productData.deskripsiProduk ||
                !productData.tanggalKedaluwarsa ||
                !productData.stok ||
                !productData.potonganHarga || 
                productData.potonganHarga.length === 0 ||
                !productData.idToko ||
                !productData.idKategori
            ) {
                res.status(400).send("Missing required fields");
                return;
            }

            for (const potongan of productData.potonganHarga) {
                if (!potongan.jumlah) {
                    res.status(400).send("Invalid data in Potongan Harga");
                    return;
                }
            }

            const createdProduct = await productServices.createProduct(productData);

            res.status(201).json(createdProduct);
        } catch (error) {
            next(error);
        }
    }

    public async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> { 

        try {
            const {idProduk} = req.body;
            const createdProduct = await productServices.findProductById(idProduk);

            if (!createdProduct) {
                res.status(400).send("Product ID Not Found");
                return;
            }

            res.status(200).json(createdProduct);
        } catch (error) {
            next(error);
        }
    }

    public async updateProductById(req: Request, res: Response, next: NextFunction): Promise<void> { 
        try {
            const { idProduk } = req.body;
            const productData: CreateProductInput = req.body;

            if (!idProduk ||
                !productData.namaProduk ||
                !productData.harga ||
                !productData.gambarProduk ||
                !productData.deskripsiProduk ||
                !productData.tanggalKedaluwarsa ||
                !productData.stok ||
                !productData.potonganHarga || 
                productData.potonganHarga.length === 0 ||
                !productData.idToko ||
                !productData.idKategori
            ) {
                res.status(400).send("Missing required fields");
                return;
            }

            for (const potongan of productData.potonganHarga) {
                if (!potongan.jumlah) {
                    res.status(400).send("Invalid data in Potongan Harga");
                    return;
                }
            }

            const updatedProduct = await productServices.updateProductById(idProduk, productData);

            if (!updatedProduct) {
                res.status(400).send("Product ID Not Found");
                return;
            }

            res.status(200).json(updatedProduct);
        } catch (error) {
            next(error);
        }
    }

    public async searchProductByKeyword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { keyword } = req.query;

            if (!keyword || typeof keyword !== 'string') {
                res.status(400).send("Keyword is required");
                return;
            }

            const foundProducts = await productServices.searchProductByKeyword(keyword);

            if (foundProducts.length === 0) {
                res.status(404).send("No products found");
                return;
            }

            res.status(200).json(foundProducts);
        } catch (error) {
            next(error);
        }
    }

    public async deleteProductById(req: Request, res: Response, next: NextFunction): Promise<void> { 
        try {
            const { idProduk } = req.body;

            if (!idProduk) {
                res.status(400).send("Product ID is required");
                return;
            }

            const deletedProduct = await productServices.deleteProductById(idProduk);

            if (!deletedProduct) {
                res.status(404).send("Product not found or could not be deleted");
                return;
            }

            res.status(200).send("Product deleted successfully");
        } catch (error) {
            next(error);
        }
    }

    public async getProductsByCategory(req: Request, res: Response, next: NextFunction): Promise<void> { 
        try {
            const { categoryName } = req.body;

            if (!categoryName) {
                res.status(400).send("Category name is required");
                return;
            }

            const products = await productServices.findProductsByCategory(categoryName);

            res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }
    
}