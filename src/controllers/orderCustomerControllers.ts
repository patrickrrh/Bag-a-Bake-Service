import { NextFunction, Request, Response } from "express";
import { OrderCustomerServices } from "../services/orderCustomerServices";

const orderCustomerServices = new OrderCustomerServices();

export class OrderCustomerController {

    public async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId, orderTotalPrice, orderDetail, bakeryId } = req.body
            if (( !userId || !orderTotalPrice || !orderDetail )) {
                res.status(400)
                throw new Error('All fields must be filled')
            }
            const order = await orderCustomerServices.createOrder({
                userId,
                orderDetail,
                bakeryId
            });
            res.status(201).json(order);
        } catch (error) {
            console.log("[src][controllers][OrderCustomerController][createOrder] ", error);
            next(error);
        }
    }

    public async getOrderByStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { orderStatus } = req.body
            const orders = await orderCustomerServices.getOrderByStatus(orderStatus);

            console.log(orders)

            const result = orders.map(order => {
                const totalQuantity = order.orderDetail.reduce(
                    (sum, detail) => sum + detail.productQuantity,
                    0
                );
    
                const totalOrderPrice = order.orderDetail.reduce(
                    (sum, detail) => sum + detail.productQuantity * detail.product.productPrice.toNumber(), 
                    0
                );
    
                return { 
                    ...order, 
                    totalQuantity, 
                    totalOrderPrice 
                };
            });

            res.status(200).json({
                status: 200,
                data: result
            });
        } catch (error) {
            console.log("[src][controllers][OrderCustomerController][getOrderByStatus] ", error);
            next(error);
        }
    }
}