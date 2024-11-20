import { NextFunction, Request, Response } from "express";
import { OrderCustomerServices } from "../services/orderCustomerServices";
import { RatingServices } from "../services/ratingServices";
import { calculateDiscountPercentage, getTodayPrice } from "../utilities/productUtils";

const orderCustomerServices = new OrderCustomerServices();
const ratingServices = new RatingServices();

export class OrderCustomerController {

    public async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId, orderDetail, bakeryId } = req.body

            if (( !userId || !orderDetail || !bakeryId )) {
                res.status(400)
                throw new Error('All fields must be filled')
            }
            const order = await orderCustomerServices.createOrder({
                userId,
                orderDetail,
                bakeryId
            });

            res.status(200).json({
                status: 200,
                data: order
            });
        } catch (error) {
            console.log("[src][controllers][OrderCustomerController][createOrder] ", error);
            next(error);
        }
    }

    public async getOrderByStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { orderStatus, userId } = req.body
            const orders = await orderCustomerServices.getOrderByStatus(orderStatus, userId);

            if (orders.length === 0) {
                res.status(404).json({ 
                    status: 404, 
                    message: "No orders found"
                });
                return;
            }

            const newOrderData = await Promise.all(
                orders.map(async (order) => {
                    const isRated = await ratingServices.checkIsOrderRated(order.orderId);
                    const prevRating = await ratingServices.findRatingByBakery(order.bakeryId);

                    const totalRatings = prevRating.reduce((sum, r) => sum + r.rating, 0);
                    const averageRating = prevRating.length > 0 ? totalRatings / prevRating.length : 0;
                    const reviewCount = prevRating.filter((r) => r.review !== '').length;

                    const updatedOrderDetails = order.orderDetail.map((detail) => {
                        const todayPrice = getTodayPrice(detail.product);
                        return {
                            ...detail,
                            product: {
                                ...detail.product,
                                todayPrice
                            },
                            totalDetailPrice: detail.productQuantity * todayPrice.toNumber(),
                            discountPercentage: calculateDiscountPercentage(detail.product.productPrice, todayPrice),
                        }
                    });

                    const totalOrderQuantity = order.orderDetail.reduce(
                        (sum, detail) => sum + detail.productQuantity, 0
                    )
                    const totalOrderPrice = order.orderDetail.reduce(
                        (sum, detail) => sum + detail.productQuantity * getTodayPrice(detail.product).toNumber(), 0
                    )

                    return { ...order, orderDetail: updatedOrderDetails, isRated, prevRating: { averageRating, reviewCount }, totalOrderQuantity, totalOrderPrice };
                })
            )

            res.status(200).json({
                status: 200,
                data: newOrderData
            });
        } catch (error) {
            console.log("[src][controllers][OrderCustomerController][getOrderByStatus] ", error);
            next(error);
        }
    }

    public async getOrderDetailById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { orderId } = req.body;
            const order = await orderCustomerServices.getOrderDetailById(orderId);
    
            if (!order) {
                res.status(404).json({ message: "Order not found" });
                return;
            }
    
            // Calculate totalOrderPrice
            const totalOrderPrice = order.orderDetail.reduce(
                (sum, detail) => sum + detail.productQuantity * detail.product.productPrice.toNumber(),
                0
            );
    
            const result = {
                ...order,
                totalOrderPrice,
            };
    
            res.status(200).json({
                status: 200,
                data: result,
            });
        } catch (error) {
            console.log("[src][controllers][OrderCustomerController][getOrderDetailById] ", error);
            next(error);
        }
    }

    public async cancelOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { orderId } = req.body;
            const order = await orderCustomerServices.cancelOrder(orderId);
    
            if (!order) {
                res.status(404).json({ message: "Order not found" });
                return;
            }
    
            res.status(200).json({
                status: 200,
                data: order,
            });
        } catch (error) {
            console.log("[src][controllers][OrderCustomerController][cancelOrder] ", error);
            next(error);
        }
    }
}