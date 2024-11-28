import databaseService from '../script';
import { OrderDetail, Order } from '@prisma/client';
import { Prisma } from '@prisma/client';

type OrderWithDetails = Prisma.OrderGetPayload<{
    include: {
        orderDetail: {
            include: {
                product: true;
            };
        };
    };
}>;

interface CreateInputOrderCustomer {
    userId: number;
    orderDetail: OrderDetail[];
    bakeryId: number;
}

export class OrderCustomerServices {
    public async createOrder(order: CreateInputOrderCustomer): Promise<Order> {
        try {
            return await databaseService.getClient().order.create({
                data: {
                    userId: order.userId,
                    orderDetail: {
                        create: order.orderDetail.map(detail => ({
                            productId: detail.productId,
                            productQuantity: detail.productQuantity,
                        }))
                    },
                    bakeryId: order.bakeryId,
                    orderStatus: 1
                },
                include: {
                    orderDetail: true,
                }
            });
        } catch (err) {
            throw new Error("Failed to create order");
        }
    }

    public async getOrderByStatus(orderStatus: number[], userId: number, statusOrderDirection: "asc" | "desc"): Promise<OrderWithDetails[]> {
        try {
            const orders = await databaseService.getClient().order.findMany({
                where: { 
                    userId,
                    orderStatus: {
                        in: orderStatus
                    }
                },
                include: {
                    orderDetail: {
                        include: {
                            product: {
                                include: {
                                    discount: true
                                }
                            },
                        },
                    },
                    bakery: true
                },
                orderBy: {
                    orderId: statusOrderDirection
                }
            });

            return orders;
        } catch (err) {
            throw new Error("Failed to retrieve orders by status");
        }
    }
    
    public async cancelOrder(orderId: number): Promise<Order | null> {
        try {
            return await databaseService.getClient().order.update({
                where: { orderId },
                data: { orderStatus: 5 },
            });
        } catch (err) {
            throw new Error("Failed to cancel order");
        }
    }

    public async submitProofOfPayment(orderId: number, proofOfPayment: string): Promise<void> {
        try {
            await databaseService.getClient().order.update({
                where: { orderId },
                data: { proofOfPayment },
            })
        } catch (error) {
            throw new Error("Failed to submit proof of payment");
        }
    }

    public async findOnPaymentOrders(paymentDueAt: Date): Promise<OrderWithDetails[]> {
        try {
            return await databaseService.getClient().order.findMany({
                where: {
                    orderStatus: 2,
                    paymentStartedAt: { lte: paymentDueAt },
                    proofOfPayment: null
                },
                include: {
                    orderDetail: {
                        include: {
                            product: true
                        }
                    }
                }
            })
        } catch (error) {
            throw new Error("Failed to find on payment orders");
        }
    }

    public async deactiveUnpaidOrders(orderId: number): Promise<void> {
        try {
            await databaseService.getClient().order.update({
                where: { orderId },
                data: { orderStatus: 5 },
            })
        } catch (error) {
            throw new Error("Failed to deactive order");
        }
    }
}
