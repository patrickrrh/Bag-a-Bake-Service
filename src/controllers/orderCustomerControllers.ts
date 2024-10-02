import { NextFunction, Request, Response } from "express";
import { OrderCustomerServices } from "../services/orderCustomerServices";

const orderCustomerServices = new OrderCustomerServices();

export class OrderCustomerController {

    public async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { idPengguna, statusPesanan, totalHarga, detailPesanan } = req.body
            if (( !idPengguna || !statusPesanan || !totalHarga || !detailPesanan )) {
                res.status(400)
                throw new Error('All fields must be filled')
            }
            const order = await orderCustomerServices.createOrder({
                idPengguna,
                statusPesanan,
                totalHarga,
                detailPesanan
            });
            res.status(201).json(order);
        } catch (error) {
            next(error);
        }
    }
}