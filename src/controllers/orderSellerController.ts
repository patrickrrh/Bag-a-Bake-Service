import { NextFunction, Request, Response } from "express";
import { OrderSellerServices } from "../services/orderSellerServices";

const orderSellerServices = new OrderSellerServices();

export class OrderSellerController {
    public async findLatestPendingOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const latestPendingOrder = await orderSellerServices.findLatestPendingOrder();
            res.status(200).json({
                status: 200,
                data: latestPendingOrder
            })
        } catch (error) {
            console.log("[src][controllers][OrderSellerController][findLatestPendingOrder] ", error)
            next(error)
        }
    }

    public async findLatestOngoingOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const latestOngoingOrder = await orderSellerServices.findLatestOngoingOrder();
            res.status(200).json({
                status: 200,
                data: latestOngoingOrder
            })
        } catch (error) {
            console.log("[src][controllers][OrderSellerController][findLatestOngoingOrder] ", error)
            next(error)
        }
    }

    public async countAllPendingOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const countAllPendingOrder = await orderSellerServices.countAllPendingOrder();
            res.status(200).json({
                status: 200,
                data: countAllPendingOrder
            })
        } catch (error) {
            console.log("[src][controllers][OrderSellerController][countAllPendingOrder] ", error)
            next(error)
        }
    }

    public async countAllOngoingOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const countAllOngoingOrder = await orderSellerServices.countAllOngoingOrder();
            res.status(200).json({
                status: 200,
                data: countAllOngoingOrder
            })
        } catch (error) {
            console.log("[src][controllers][OrderSellerController][countAllOngoingOrder] ", error)
            next(error)
        }
    }

    public async findAllOrderByStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let { orderStatus } = req.body

            if (!Array.isArray(orderStatus)) {
                orderStatus = orderStatus === 3 ? [3, 4] : [orderStatus];
            }
            
            const allOrder = await orderSellerServices.findAllOrderByStatus(orderStatus);
            res.status(200).json({
                status: 200,
                data: allOrder
            })
        } catch (error) {
            console.log("[src][controllers][OrderSellerController][findAllOrderByStatus] ", error)
            next(error)
        }
    }

    public async actionOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { orderId, orderStatus } = req.body

            if (!orderId || !orderStatus) {
                res.status(400).json({
                    status: 400,
                    message: "Missing orderId or orderStatus"
                })
            }

            await orderSellerServices.actionOrder(orderId, orderStatus);
            res.status(200).json({
                status: 200,
                message: "Success"
            })

        } catch (error) {
            console.log("[src][controllers][OrderSellerController][actionOrder] ", error)
            next(error)
        }
    }  
}