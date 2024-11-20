import { Order, OrderDetail, Prisma } from "@prisma/client";
import databaseService from "../script";
import { Or } from "@prisma/client/runtime/library";

type OrderWithDetails = Prisma.OrderGetPayload<{
    include: {
        orderDetail: {
            include: {
                product: true;
            };
        };
    }
}>

export class OrderSellerServices {
    public async findLatestPendingOrder(bakeryId: number): Promise<OrderWithDetails | null> {
        try {
            return await databaseService.getClient().order.findFirst({
                where: {
                    orderStatus: 1,
                    bakeryId
                },
                include: {
                    user: true,
                    orderDetail: {
                        include: {
                            product: {
                                include: {
                                    discount: true
                                }
                            }
                        }
                    }
                }
            })
        } catch (error) {
            console.log("[src][services][OrderSellerServices][findLatestPendingOrder] ", error)
            throw new Error("Failed to get latest pending order")
        }
    }

    public async findLatestOngoingOrder(bakeryId: number): Promise<OrderWithDetails | null> {
        try {
            return await databaseService.getClient().order.findFirst({
                where: {
                    orderStatus: 2,
                    bakeryId
                },
                include: {
                    user: true,
                    orderDetail: {
                        include: {
                            product: {
                                include: {
                                    discount: true
                                }
                            }
                        }
                    }
                }
            })
        } catch (error) {
            console.log("[src][services][OrderSellerServices][findLatestOngoingOrder] ", error)
            throw new Error("Failed to get latest ongoing order")
        }
    }

    public async countAllPendingOrder(bakeryId: number): Promise<number> {
        try {
            return await databaseService.getClient().order.count({
                where: {
                    orderStatus: 1,
                    bakeryId
                }
            })
        } catch (error) {
            console.log("[src][services][OrderSellerServices][countAllPendingOrder] ", error)
            throw new Error("Failed to count all pending order")
        }
    }

    public async countAllOngoingOrder(bakeryId: number): Promise<number> {
        try {
            return await databaseService.getClient().order.count({
                where: {
                    orderStatus: 2,
                    bakeryId
                }
            })
        } catch (error) {
            console.log("[src][services][OrderSellerServices][countAllOngoingOrder] ", error)
            throw new Error("Failed to count all ongoing order")
        }
    }

    public async findAllOrderByStatus(orderStatus: number[], bakeryId: number): Promise<OrderWithDetails[]> {
        try {
            return await databaseService.getClient().order.findMany({
                where: {
                    bakeryId,
                    orderStatus: {
                        in: orderStatus
                    }
                },
                include: {
                    user: true,
                    orderDetail: {
                        include: {
                            product: {
                                include: {
                                    discount: true
                                }
                            }
                        }
                    }
                }
            })
        } catch (error) {
            console.log("[src][services][OrderSellerServices][findAllPendingOrder] ", error)
            throw new Error("Failed to get all pending order")
        }
    }

    public async actionOrder(orderId: number, orderStatus: number): Promise<void> {
        try {
            await databaseService.getClient().order.update({
                where: {
                    orderId
                },
                data: {
                    orderStatus
                }
            })
        } catch (error) {
            console.log("[src][services][OrderSellerServices][actionOrder] ", error)
            throw new Error("Failed to action order")
        }
    }

    public async findOrderDetailByOrderId(orderId: number): Promise<OrderDetail[]> {
        try {
            return await databaseService.getClient().orderDetail.findMany({
                where: {
                    orderId
                }
            })
        } catch (error) {
            console.log("[src][services][OrderSellerServices][findOrderDetailByOrderId] ", error)
            throw new Error("Failed to find order detail")
        }
    }
}