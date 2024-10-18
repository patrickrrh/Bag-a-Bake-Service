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

    public async getOrderByStatus(orderStatus: number): Promise<OrderWithDetails[]> {
        try {
            const orders = await databaseService.getClient().order.findMany({
                where: { orderStatus },
                include: {
                    orderDetail: {
                        include: {
                            product: true, // Include related Product model
                        },
                    },
                    bakery: true, // Include bakery details if needed
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
