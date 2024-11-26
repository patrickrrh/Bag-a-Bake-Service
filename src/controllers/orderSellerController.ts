import { NextFunction, Request, Response } from "express";
import { OrderSellerServices } from "../services/orderSellerServices";
import { calculateDiscountPercentage, getPriceOnOrderDate } from "../utilities/productUtils";
import { ProductServices } from "../services/productServices";
import { UserServices } from "../services/userServices";
import { sendNotifications } from "../utilities/notificationHandler";

const orderSellerServices = new OrderSellerServices();
const productServices = new ProductServices();
const userServices = new UserServices();

export class OrderSellerController {
    public async findLatestPendingOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { bakeryId } = req.body

            const latestPendingOrder = await orderSellerServices.findLatestPendingOrder(bakeryId);

            const updatedOrderDetails = latestPendingOrder?.orderDetail.map((detail) => ({
                ...detail,
                totalDetailPrice: detail.productQuantity * getPriceOnOrderDate(detail.product, latestPendingOrder.orderDate).toNumber(),
                discountPercentage: calculateDiscountPercentage(detail.product.productPrice, getPriceOnOrderDate(detail.product, latestPendingOrder.orderDate)),
            }));

            const totalOrderPrice = latestPendingOrder?.orderDetail.reduce(
                (sum, detail) => sum + detail.productQuantity * getPriceOnOrderDate(detail.product, latestPendingOrder.orderDate).toNumber(), 0
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

    public async findLatestPaymentOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { bakeryId } = req.body

            const latestPaymentOrder = await orderSellerServices.findLatestPaymentOrder(bakeryId);

            const updatedOrderDetails = latestPaymentOrder?.orderDetail.map((detail) => ({
                ...detail,
                totalDetailPrice: detail.productQuantity * getPriceOnOrderDate(detail.product, latestPaymentOrder.orderDate).toNumber(),
                discountPercentage: calculateDiscountPercentage(detail.product.productPrice, getPriceOnOrderDate(detail.product, latestPaymentOrder.orderDate)),
            }));

            const totalOrderPrice = latestPaymentOrder?.orderDetail.reduce(
                (sum, detail) => sum + detail.productQuantity * getPriceOnOrderDate(detail.product, latestPaymentOrder.orderDate).toNumber(), 0
            )

            res.status(200).json({
                status: 200,
                data: { ...latestPaymentOrder, orderDetail: updatedOrderDetails, totalOrderPrice }
            })
        } catch (error) {
            console.log("[src][controllers][OrderSellerController][findLatestPaymentOrder] ", error)
            next(error)
        }
    }

    public async findLatestOngoingOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { bakeryId } = req.body

            const latestOngoingOrder = await orderSellerServices.findLatestOngoingOrder(bakeryId);

            const updatedOrderDetails = latestOngoingOrder?.orderDetail.map((detail) => ({
                ...detail,
                totalDetailPrice: detail.productQuantity * getPriceOnOrderDate(detail.product, latestOngoingOrder.orderDate).toNumber(),
                discountPercentage: calculateDiscountPercentage(detail.product.productPrice, getPriceOnOrderDate(detail.product, latestOngoingOrder.orderDate)),
            }));

            const totalOrderPrice = latestOngoingOrder?.orderDetail.reduce(
                (sum, detail) => sum + detail.productQuantity * getPriceOnOrderDate(detail.product, latestOngoingOrder.orderDate).toNumber(), 0
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

    public async countAllOnPaymentOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { bakeryId } = req.body

            const countAllOnPaymentOrder = await orderSellerServices.countAllOnPaymentOrder(bakeryId);
            res.status(200).json({
                status: 200,
                data: countAllOnPaymentOrder
            })
        } catch (error) {
            console.log("[src][controllers][OrderSellerController][countAllOnPaymentOrder] ", error)
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
                orderStatus = orderStatus === 4 ? [4, 5] : [orderStatus];
            }

            const allOrder = await orderSellerServices.findAllOrderByStatus(orderStatus, bakeryId);

            const newOrderData = await Promise.all(
                allOrder.map(async (order) => {
                    const updatedOrderDetails = order.orderDetail.map((detail) => ({
                        ...detail,
                        totalDetailPrice: detail.productQuantity * getPriceOnOrderDate(detail.product, order.orderDate).toNumber(),
                        discountPercentage: calculateDiscountPercentage(detail.product.productPrice, getPriceOnOrderDate(detail.product, order.orderDate)),
                    }));

                    const totalOrderPrice = order.orderDetail.reduce(
                        (sum, detail) => sum + detail.productQuantity * getPriceOnOrderDate(detail.product, order.orderDate).toNumber(), 0
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
            const { orderId, orderStatus, paymentStartedAt } = req.body

            if (!orderId || !orderStatus) {
                res.status(400).json({
                    status: 400,
                    message: "Missing orderId or orderStatus"
                })
            }

            await orderSellerServices.actionOrder(orderId, orderStatus, paymentStartedAt);

            if (orderStatus === 2) {
                const orderDetails = await orderSellerServices.findOrderDetailsByOrderId(orderId);

                if (orderDetails.length === 0) {
                    res.status(404).json({
                        status: 404,
                        message: "Order details not found",
                    });
                    return;
                }

                await Promise.all(
                    orderDetails.map(async (detail) => {
                        const product = await productServices.findProductById(detail.productId);
                        const updatedProductStock = Number(product?.productStock) - detail.productQuantity
                        await productServices.updateProductStock(detail.productId, updatedProductStock);
                    })
                )
            }

            const buyer = await userServices.findBuyerByOrderId(orderId);

            if (buyer?.pushToken) {
                if (orderStatus === 2) {
                    await sendNotifications(buyer.pushToken, 'Pesanan Diterima', 'Silakan selesaikan pembayaran sebelum waktu yang ditentukan');
                } else if (orderStatus === 5) {
                    await sendNotifications(buyer.pushToken, 'Pesanan Dibatalkan', 'Maaf, bakeri membatalkan pesanan Anda');
                } else {
                    await sendNotifications(buyer.pushToken, 'Status Pesanan', 'Silakan cek status pesanan Anda');
                }
            }

            res.status(200).json({
                status: 200,
                message: "Success"
            })
        } catch (error) {
            console.log("[src][controllers][OrderSellerController][actionOrder] ", error)
            next(error)
        }
    }

    public async cancelOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { orderId } = req.body

            await orderSellerServices.actionOrder(orderId, 5);

            const orderDetails = await orderSellerServices.findOrderDetailByOrderId(orderId);

            if (!orderDetails) {
                res.status(404).json({ message: "Order details not found" });
                return;
            }

            await Promise.all(
                orderDetails.orderDetail.map(async (detail) => {
                    const currentProduct = await productServices.findProductById(detail.productId);
                    const updatedProductStock = Number(currentProduct?.productStock) + detail.productQuantity;
                    await productServices.updateProductStock(detail.productId, updatedProductStock);
                })
            )

            const buyer = await userServices.findBuyerByOrderId(orderId);

            if (buyer?.pushToken) {
                await sendNotifications(buyer.pushToken, 'Pesanan Dibatalkan', 'Maaf, bakeri membatalkan pesanan Anda');
            }

            res.status(200).json({
                status: 200,
                message: "Success"
            })
        } catch (error) {
            console.log("[src][controllers][OrderSellerController][cancelOrder] ", error)
            next(error)
        }
    }
}