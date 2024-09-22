import { Kategori, ListPotonganHarga, Produk, Toko } from '@prisma/client';
import databaseService from '../script';

export interface CreateProductInput {
    namaProduk: string;
    harga: number;
    gambarProduk: string;
    deskripsiProduk: string;
    tanggalKedaluwarsa: Date;
    stok: number;
    potonganHarga: ListPotonganHarga[];
    idToko: number;
    idKategori: number;
}

export class ProductServices {
 
    public async createProduct(produk: CreateProductInput): Promise<Produk> {

        try {
            return await databaseService.getClient().produk.create({
                data: {
                    namaProduk: produk.namaProduk,
                    harga: produk.harga,
                    gambarProduk: produk.gambarProduk,
                    deskripsiProduk: produk.deskripsiProduk,
                    tanggalKedaluwarsa: produk.tanggalKedaluwarsa,
                    stok: produk.stok,
                    potonganHarga: {
                        create: produk.potonganHarga.map(potongan => ({
                            jumlah: potongan.jumlah
                        }))
                    },
                    idToko: produk.idToko,
                    idKategori: produk.idKategori
                    
                },
                include: {
                    potonganHarga: true,
                }
            }, )
        } catch (error) {
            throw new Error("Failed to create user")
        }
    }

    public async findProductById(idProduk: number): Promise<Produk | null> {
        if (!idProduk) {
            throw new Error('Id Product is required');
        }
    
        try {
            return await databaseService.getClient().produk.findUnique({
                where: { idProduk }
            })
        } catch (error) {
            throw new Error("Failed to find product")
        }
    }

    public async updateProductById(idProduk: number, produk: CreateProductInput): Promise<Produk | null> {

        if (!idProduk) {
            throw new Error('Id Product is required');
        }
    
        try {
            const updatedProduct = await databaseService.getClient().produk.update({
                where: { idProduk },
                data: {
                    namaProduk: produk.namaProduk,
                    harga: produk.harga,
                    gambarProduk: produk.gambarProduk,
                    deskripsiProduk: produk.deskripsiProduk,
                    tanggalKedaluwarsa: produk.tanggalKedaluwarsa,
                    stok: produk.stok,
                    potonganHarga: {
                        deleteMany: {},  
                        create: produk.potonganHarga.map(potongan => ({
                            jumlah: potongan.jumlah
                        }))
                    },
                    idToko: produk.idToko,
                    idKategori: produk.idKategori
                },
                include: {
                    potonganHarga: true,
                }
            });

            return updatedProduct;
        } catch (error) {
            throw new Error("Failed to update product");
        }
    }
    
    public async searchProductByKeyword(keyword: string): Promise<Produk[]> {
        try {
            const normalizedKeyword = keyword.trim().replace(/\s+/g, ' ');
            const keywordsArray = normalizedKeyword.split(' ');  
            
            return await databaseService.getClient().produk.findMany({
                where: {
                    OR: keywordsArray.map(word => ({
                        OR: [
                            {
                                namaProduk: {
                                    contains: word,
                                    mode: 'insensitive'
                                }
                            },
                            {
                                deskripsiProduk: {
                                    contains: word,
                                    mode: 'insensitive'
                                }
                            }
                        ]
                    })),
                    isActive: 1
                },
                include: {
                    potonganHarga: true,
                    kategori: true,
                    toko: true
                }
            });
        } catch (error) {
            throw new Error("Failed to search for products");
        }
    }

    public async deleteProductById(idProduk: number): Promise<Produk | null> {
        try {
            const existingProduct = await this.findProductById(idProduk);
            if (!existingProduct) {
                return null;
            }

            await databaseService.getClient().listPotonganHarga.deleteMany({
                where: { idProduk }
            });

            return await databaseService.getClient().produk.delete({
                where: { idProduk }
            });

        } catch (error) {
            throw new Error("Failed to delete product");
        }
    }
    
    public async findProductsByCategory(categoryName: string): Promise<Produk[]> {
        try {
            return await databaseService.getClient().produk.findMany({
                where: {
                    kategori: {
                        namaKategori: {
                            contains: categoryName, 
                        }
                    }
                },
                include: {
                    potonganHarga: true,
                    kategori: true, 
                }
            });
        } catch (error) {
            throw new Error("Failed to find products by category");
        }
    }
}