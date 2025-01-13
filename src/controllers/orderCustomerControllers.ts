import { NextFunction, Request, Response } from "express";
import { OrderCustomerServices } from "../services/orderCustomerServices";
import { RatingServices } from "../services/ratingServices";
import { calculateDiscountPercentage, getPriceOnOrderDate } from "../utilities/productUtils";
import { UserServices } from "../services/userServices";
import { sendNotifications } from "../utilities/notificationHandler";
import { OrderSellerServices } from "../services/orderSellerServices";
import cron from 'node-cron';
import { ProductServices } from "../services/productServices";
import { BakeryServices } from "../services/bakeryServices";
import path from "path";
import fs from "fs";

const orderCustomerServices = new OrderCustomerServices();
const ratingServices = new RatingServices();
const userServices = new UserServices();
const productServices = new ProductServices();
const bakeryServices = new BakeryServices();
const orderSellerServices = new OrderSellerServices();

export class OrderCustomerController {
    constructor() {
        this.scheduleDeactiveUnpaidOrders();
        this.scheduleResetIsCancelled();
    }

    private scheduleResetIsCancelled() {
        cron.schedule('0 0 * * *', async () => {
            console.log("Running daily reset at 00:00...");
            try {
                const usersToReset = await userServices.findUsersWithCancelledThreshold(3); 

                for (const user of usersToReset) {
                    await userServices.updateUserCancelled(user.userId, 0); 
                    console.log(`User ${user.userId}'s isCancelled count reset.`);
                }
            } catch (error) {
                console.error("Error during daily reset:", error);
            }
        });
    }

    private scheduleDeactiveUnpaidOrders() {
        cron.schedule("* * * * *", async () => {
            try {
                const paymentDueAt = new Date(Date.now() - 15 * 60 * 1000);

                const orderToDeactive = await orderCustomerServices.findOnPaymentOrders(paymentDueAt);

                if (orderToDeactive.length === 0) {
                    return;
                }

                for (const order of orderToDeactive) {
                    await orderCustomerServices.deactiveUnpaidOrders(order.orderId);

                    await Promise.all(
                        order.orderDetail.map(async (detail) => {
                            const currentProduct = await productServices.findProductById(detail.productId);
                            const updatedProductStock = Number(currentProduct?.productStock) + detail.productQuantity;
                            await productServices.updateProductStock(detail.productId, updatedProductStock);
                        })
                    )

                    const seller = await userServices.findSellerByBakeryId(order.bakeryId);

                    if (seller?.pushToken) {
                        await sendNotifications(seller.pushToken, 'Pesanan Dibatalkan', 'Pesanan dibatalkan secara otomatis karena pembeli belum melakukan pembayaran');
                    }

                    const buyer = await userServices.findBuyerByOrderId(order.orderId);

                    if (buyer?.pushToken) {
                        await sendNotifications(buyer.pushToken, 'Pesanan Dibatalkan', 'Pesanan dibatalkan secara otomatis karena belum melakukan pembayaran');
                    }
                }
            } catch (error) {
                console.error("[src][controllers][OrderCustomerController][scheduleDeactiveUnpaidOrders] Error: ", error);
            }
        })
    }

    public async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId, orderDetail, bakeryId } = req.body

            if ((!userId || !orderDetail || !bakeryId)) {
                res.status(400)
                throw new Error('All fields must be filled')
            }

            const user = await userServices.findUserById(userId);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            if (user.isCancelled > 3) {
                res.status(403).json({
                    status: 403,
                    message: "You cannot create a new order because your account has exceeded the cancellation limit."
                });
                return;
            }

            const bakery = await bakeryServices.findBakeryById(bakeryId);

            if (!bakery || !bakery.closingTime) {
                res.status(404).send('Bakery not found or closing time not set');
                return;
            }

            const currentTime = new Date();
            const closingTime = new Date();
            const [closingHour, closingMinute] = bakery.closingTime.split(':').map(Number);
            closingTime.setHours(closingHour, closingMinute, 0, 0);

            if (currentTime > closingTime) {
                res.status(404).json({
                    status: 404,
                    message: 'The bakery is closed. Please try again during business hours.'
                });
                return;
            }

            const order = await orderCustomerServices.createOrder({
                userId,
                orderDetail,
                bakeryId
            });

            const seller = await userServices.findSellerByBakeryId(bakeryId);

            if (seller?.pushToken) {
                await sendNotifications(seller.pushToken, 'Pesanan Baru', 'Anda memiliki pesanan baru');
            }

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
            let { orderStatus, userId } = req.body

            if (!Array.isArray(orderStatus)) {
                orderStatus = orderStatus === 4 ? [4, 5] : [orderStatus];
            }

            const statusOrderDirection = orderStatus.includes(4) || orderStatus.includes(5) ? "desc" : "asc";

            const orders = await orderCustomerServices.getOrderByStatus(orderStatus, userId, statusOrderDirection);

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
                    const averageRating = prevRating.length > 0 ? (totalRatings / prevRating.length).toFixed(1) : '0.0';
                    const reviewCount = prevRating.filter((r) => r.review !== '').length;

                    const updatedOrderDetails = order.orderDetail.map((detail) => {
                        const orderDatePrice = getPriceOnOrderDate(detail.product, order.orderDate);
                        return {
                            ...detail,
                            product: {
                                ...detail.product,
                                orderDatePrice
                            },
                            totalDetailPrice: detail.productQuantity * orderDatePrice.toNumber(),
                            discountPercentage: calculateDiscountPercentage(detail.product.productPrice, orderDatePrice),
                        }
                    });

                    const totalOrderQuantity = order.orderDetail.reduce(
                        (sum, detail) => sum + detail.productQuantity, 0
                    )
                    const totalOrderPrice = order.orderDetail.reduce(
                        (sum, detail) => sum + detail.productQuantity * getPriceOnOrderDate(detail.product, order.orderDate).toNumber(), 0
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

    public async cancelOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { orderId, bakeryId, isUpdateStock } = req.body;
            const order = await orderCustomerServices.cancelOrder(orderId);

            if (!order) {
                res.status(404).json({ message: "Order not found" });
                return;
            }

            if (isUpdateStock) {
                const orderDetail = await orderSellerServices.findOrderDetailByOrderId(orderId);

                if (!orderDetail) {
                    res.status(404).json({ message: "Order details not found" });
                    return;
                }
    
                await Promise.all(
                    orderDetail.orderDetail.map(async (detail) => {
                        const currentProduct = await productServices.findProductById(detail.productId);
                        const updatedProductStock = Number(currentProduct?.productStock) + detail.productQuantity;
                        await productServices.updateProductStock(detail.productId, updatedProductStock);
                    })
                )
            }

            const seller = await userServices.findSellerByBakeryId(bakeryId);
            if (seller?.pushToken) {
                await sendNotifications(seller.pushToken, 'Pesanan Dibatalkan', 'Maaf, pembeli telah membatalkan pesanan');
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

    public async submitProofOfPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { orderId, bakeryId } = req.body;

            let proofOfPaymentImage = '';            
            const encodedProofOfPayment = req.body.proofOfPayment;
            if (encodedProofOfPayment) {
                const buffer = Buffer.from(encodedProofOfPayment, 'base64');
                const fileName = `proofOfPayment-${Date.now()}.jpeg`;

                const filePath = path.join(__dirname, '../../../public_html/uploads/proof-of-payment', fileName);
                fs.writeFileSync(filePath, buffer);

                proofOfPaymentImage = path.join(fileName);
            }


            await orderCustomerServices.submitProofOfPayment(orderId, proofOfPaymentImage);

            const seller = await userServices.findSellerByBakeryId(bakeryId);

            if (seller?.pushToken) {
                await sendNotifications(seller.pushToken, 'Pembayaran Berhasil', 'Harap cek pembayaran dan melakukan konfirmasi');
            }

            res.status(200).json({
                status: 200,
                message: "Proof of payment submitted successfully",
            });
        } catch (error) {
            console.log("[src][controllers][OrderCustomerController][submitProofOfPayment] ", error);
            next(error);
        }
    }
}