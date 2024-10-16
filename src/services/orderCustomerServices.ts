import databaseService from '../script';
import { OrderDetail, Order } from '@prisma/client';

interface CreateInputOrderCustomer {
    userId: number;
    orderTotalPrice: number;
    orderDetail: OrderDetail[];
    bakeryId: number;
}

export class OrderCustomerServices {
    public async createOrder(order: CreateInputOrderCustomer): Promise<Order> {
        try {
            return await databaseService.getClient().order.create({
                data: {
                    userId: order.userId,
                    orderTotalPrice: order.orderTotalPrice,
                    orderDetail: {
                        create: order.orderDetail.map(detail => ({
                            productId: detail.productId,
                            productQuantity: detail.productQuantity,
                            productTotalPrice: detail.productTotalPrice,
                        }))
                    },
                    bakeryId: order.bakeryId
                },
                include: {
                    orderDetail: true,
                }
            });
        } catch (err) {
            throw new Error("Failed to create order");
        }
    }

    public async getOrderByStatus(orderStatus: number): Promise<Order[]> {
        try {
            const orders = await databaseService.getClient().order.findMany({
                where: {
                    orderStatus: orderStatus,
                },
                include: {
                    orderDetail: true,
                    bakery: true
                },
            });
            return orders;
        } catch (err) {
            throw new Error("Failed to retrieve orders by status");
        }
    }

    public async getOrderDetailById(orderId: number): Promise<Order | null> {
        try {
            const order = await databaseService.getClient().order.findUnique({
                where: {
                    orderId: orderId,
                },
                include: {
                    orderDetail: true,
                },
            });
            return order;
        } catch (err) {
            throw new Error("Failed to retrieve order details by ID");
        }
    }
}
