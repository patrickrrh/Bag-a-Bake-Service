import { Order } from "@prisma/client";
import databaseService from "../script";
import { Or } from "@prisma/client/runtime/library";

export class OrderSellerServices {
    public async findLatestPendingOrder(): Promise<Order | null> {
        try {
            return await databaseService.getClient().order.findFirst({
                where: {
                    orderStatus: 1
                },
                include: {
                    user: true,
                    orderDetail: {
                        include: {
                            product: true
                        }
                    }
                }
            })
        } catch (error) {
            console.log("[src][services][OrderSellerServices][findLatestPendingOrder] ", error)
            throw new Error("Failed to get latest pending order")
        }
    }

    public async findLatestOngoingOrder(): Promise<Order | null> {
        try {
            return await databaseService.getClient().order.findFirst({
                where: {
                    orderStatus: 2
                },
                include: {
                    user: true,
                    orderDetail: {
                        include: {
                            product: true
                        }
                    }
                }
            })
        } catch (error) {
            console.log("[src][services][OrderSellerServices][findLatestOngoingOrder] ", error)
            throw new Error("Failed to get latest ongoing order")
        }
    }

    public async countAllPendingOrder(): Promise<number> {
        try {
            return await databaseService.getClient().order.count({
                where: {
                    orderStatus: 1
                }
            })
        } catch (error) {
            console.log("[src][services][OrderSellerServices][countAllPendingOrder] ", error)
            throw new Error("Failed to count all pending order")
        }
    }

    public async countAllOngoingOrder(): Promise<number> {
        try {
            return await databaseService.getClient().order.count({
                where: {
                    orderStatus: 2
                }
            })
        } catch (error) {
            console.log("[src][services][OrderSellerServices][countAllOngoingOrder] ", error)
            throw new Error("Failed to count all ongoing order")
        }
    }

    public async findAllOrderByStatus(orderStatus: number): Promise<Order[]> {
        try {
            return await databaseService.getClient().order.findMany({
                where: {
                    orderStatus: orderStatus
                },
                include: {
                    user: true,
                    orderDetail: {
                        include: {
                            product: true
                        }
                    }
                }
            })
        } catch (error) {
            console.log("[src][services][OrderSellerServices][findAllPendingOrder] ", error)
            throw new Error("Failed to get all pending order")
        }
    }
}