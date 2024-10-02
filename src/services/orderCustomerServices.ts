import databaseService from '../script';
import { DetailPesanan, Pesanan } from '@prisma/client';

interface CreateInputOrderCustomer {
    idPengguna: number;
    statusPesanan: number;
    totalHarga: number;
    detailPesanan: DetailPesanan[];
}

export class OrderCustomerServices {
    public async createOrder(order: CreateInputOrderCustomer): Promise<Pesanan> {
        try {
            return await databaseService.getClient().pesanan.create({
                data: {
                    idPengguna: order.idPengguna,
                    statusPesanan: order.statusPesanan,
                    totalHarga: order.totalHarga,
                    detailPesanan: {
                        create: order.detailPesanan.map(detail => ({
                            idProduk: detail.idProduk,
                            jumlah: detail.jumlah,
                            jumlahHarga: detail.jumlahHarga,
                        }))
                    }
                },
                include: {
                    detailPesanan: true,
                }
            });
        } catch (err) {
            throw new Error("Failed to create order");
        }
    }
    
    public async getOrderByStatus(statusPesanan: number): Promise<Pesanan[]> {
        try {
            const orders = await databaseService.getClient().pesanan.findMany({
                where: {
                    statusPesanan: statusPesanan,
                },
                include: {
                    detailPesanan: true,
                },
            });
            return orders;
        } catch (err) {
            throw new Error("Failed to retrieve orders by status");
        }
    }
    
    public async getOrderDetailById(idPesanan: number): Promise<Pesanan | null> {
        try {
            const order = await databaseService.getClient().pesanan.findUnique({
                where: {
                    idPesanan: idPesanan,
                },
                include: {
                    detailPesanan: true,
                },
            });
            return order;
        } catch (err) {
            throw new Error("Failed to retrieve order details by ID");
        }
    }
}
