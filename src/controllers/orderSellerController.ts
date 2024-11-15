import { NextFunction, Request, Response } from "express";
import { OrderSellerServices } from "../services/orderSellerServices";

const orderSellerServices = new OrderSellerServices();

export class OrderSellerController {
    public async findLatestPendingOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { bakeryId } = req.body

            const latestPendingOrder = await orderSellerServices.findLatestPendingOrder(bakeryId);

            const updatedOrderDetails = latestPendingOrder?.orderDetail.map((detail) => ({
                ...detail,
                totalDetailPrice: detail.productQuantity * detail.product.productPrice.toNumber(),
            }));

            const totalOrderPrice = latestPendingOrder?.orderDetail.reduce(
                (sum, detail) => sum + detail.productQuantity * detail.product.productPrice.toNumber(), 0
            )

            res.status(200).json({
                status: 200,
                data: { ...latestPendingOrder, orderDetail: updatedOrderDetails, totalOrderPrice }
            })
        } catch (error) {
            console.log("[src][controllers][OrderSellerController][findLatestPendingOrder] ", error)
            next(error)
        }
    }

    public async findLatestOngoingOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { bakeryId } = req.body

            const latestOngoingOrder = await orderSellerServices.findLatestOngoingOrder(bakeryId);

            const updatedOrderDetails = latestOngoingOrder?.orderDetail.map((detail) => ({
                ...detail,
                totalDetailPrice: detail.productQuantity * detail.product.productPrice.toNumber(),
            }));

            const totalOrderPrice = latestOngoingOrder?.orderDetail.reduce(
                (sum, detail) => sum + detail.productQuantity * detail.product.productPrice.toNumber(), 0
            )

            res.status(200).json({
                status: 200,
                data: { ...latestOngoingOrder, orderDetail: updatedOrderDetails, totalOrderPrice }
            })
        } catch (error) {
            console.log("[src][controllers][OrderSellerController][findLatestOngoingOrder] ", error)
            next(error)
        }
    }

    public async countAllPendingOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { bakeryId } = req.body

            const countAllPendingOrder = await orderSellerServices.countAllPendingOrder(bakeryId);
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
            const { bakeryId } = req.body

            const countAllOngoingOrder = await orderSellerServices.countAllOngoingOrder(bakeryId);
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
            let { orderStatus, bakeryId } = req.body

            if (!Array.isArray(orderStatus)) {
                orderStatus = orderStatus === 3 ? [3, 4] : [orderStatus];
            }
            
            const allOrder = await orderSellerServices.findAllOrderByStatus(orderStatus, bakeryId);

            const newOrderData = await Promise.all(
                allOrder.map(async (order) => {
                    const updatedOrderDetails = order.orderDetail.map((detail) => ({
                        ...detail,
                        totalDetailPrice: detail.productQuantity * detail.product.productPrice.toNumber(),
                    }));

                    const totalOrderPrice = order.orderDetail.reduce(
                        (sum, detail) => sum + detail.productQuantity * detail.product.productPrice.toNumber(), 0
                    )

                    return { ...order, orderDetail: updatedOrderDetails, totalOrderPrice };
                })
            )

            res.status(200).json({
                status: 200,
                data: newOrderData
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