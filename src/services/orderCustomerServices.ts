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

    public async getOrderByStatus(orderStatus: number, userId: number): Promise<OrderWithDetails[]> {
        try {
            const orders = await databaseService.getClient().order.findMany({
                where: { 
                    orderStatus,
                    userId
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
            });

            return orders;
        } catch (err) {
            throw new Error("Failed to retrieve orders by status");
        }
    }
    

    public async getOrderDetailById(orderId: number): Promise<OrderWithDetails | null> {
        try {
            const order = await databaseService.getClient().order.findUnique({
                where: { orderId },
                include: {
                    orderDetail: {
                        include: {
                            product: true, // Include product to access productPrice
                        },
                    },
                },
            });
            return order;
        } catch (err) {
            throw new Error("Failed to retrieve order details by ID");
        }
    }
    
    public async cancelOrder(orderId: number): Promise<Order | null> {
        try {
            return await databaseService.getClient().order.update({
                where: { orderId },
                data: { orderStatus: 4 },
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
}
