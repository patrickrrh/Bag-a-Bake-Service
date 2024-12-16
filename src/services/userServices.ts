import bycrpt from 'bcrypt';
import { User } from '@prisma/client';
import databaseService from '../script';
import { json } from 'express';

export interface CreateUserInput {
    roleId: number;
    userName: string;
    userImage?: string | null;
    userPhoneNumber?: string;
    email: string;
    password: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    pushToken?: string;
}

export class UserServices {
    public async findUserByEmail(email: string): Promise<User | null> {
        try {
            return await databaseService.getClient().user.findUnique({
                where: {
                    email
                }
            })
        } catch (error) {
            console.log("[src][services][UserServices][findUserByEmail]", error);
            throw new Error("Failed to find user");
        }
    }
    

    public async createUser(user: CreateUserInput): Promise<User> {
        user.password = bycrpt.hashSync(user.password, 12);
        try {
            return await databaseService.getClient().user.create({
                data: user
            })
        } catch (error) {
            console.log("[src][services][UserServices][createUser]", error)
            throw new Error("Failed to create user")
        }
    }

    public async findUserById(userId: number): Promise<User | null> {
        try {
            return await databaseService.getClient().user.findUnique({
                where: {
                    userId
                },
                include: {
                    bakery: {
                        include: {
                            payment: true
                        }
                    }
                }
            })
        } catch (error) {
            console.log("[src][services][UserServices][findUserById]", error)
            throw new Error("Failed to find user")
        }
    }

    public async updateUserPassword(email: string, password: string): Promise<User> {
        try {
            password = bycrpt.hashSync(password, 12);
            return await databaseService.getClient().user.update({
                where: {
                    email
                },
                data: {
                    password
                }
            })
        } catch (error) {
            console.log("[src][services][UserServices][updateUserPassword]", error)
            throw new Error("Failed to update user password")
        }
    }

    public async updateUserById(userId: number, updateData: Partial<User>): Promise<User | null> {
        try {
            return await databaseService.getClient().user.update({
                where: { userId },
                data: updateData
            });
        } catch (error) {
            console.log("[src][services][UserServices][updateUserById] ", error);
            throw error;
        }
    }
    public async findSellerByBakeryId(bakeryId: number): Promise<User | null> {
        try {
            const bakery = await databaseService.getClient().bakery.findUnique({
                where: {
                    bakeryId
                },
                include: {
                    user: true,
                }
            });

            return bakery ? bakery.user : null;
        } catch (error) {
            console.log("[src][services][UserServices][findSellerByBakeryId]", error);
            throw new Error("Failed to find user");
        }
    }

    public async findBuyerByOrderId(orderId: number): Promise<User | null> {
        try {
            const order = await databaseService.getClient().order.findUnique({
                where: {
                    orderId
                },
                include: {
                    user: true,
                }
            });

            return order ? order.user : null;
        } catch (error) {
            console.log("[src][services][UserServices][findBuyerByOrderId]", error);
            throw new Error("Failed to find user");
        }
    }

    public async findSellerByOrderId(orderId: number): Promise<User | null> {
        try {
            const order = await databaseService.getClient().order.findUnique({
                where: {
                    orderId
                },
                include: {
                    bakery: {
                        include: {
                            user: true,
                        }
                    }
                }
            });

            return order ? order.bakery.user : null;
        } catch (error) {
            console.log("[src][services][UserServices][findSellerByOrderId]", error);
            throw new Error("Failed to find user");
        }
    }


    public async updateUserCancelled(userId: number, isCancelled: number): Promise<void> {
        try {
            await databaseService.getClient().user.update({
                where: { userId },
                data: {
                    isCancelled,
                }
            });
        } catch (error) {
            console.log("[src][services][UserServices][updateUserCancelled]", error);
            throw new Error("Failed to update user cancellation status");
        }
    }

    public async findUsersWithCancelledThreshold(threshold: number): Promise<User[]> {
        if (threshold < 0) {
            console.log("[src][services][UserServices][findUsersWithCancelledThreshold] Threshold must be a non-negative number");
            throw new Error("Threshold must be a non-negative number");
        }
    
        try {
            return await databaseService.getClient().user.findMany({
                where: {
                    isCancelled: {
                        gte: threshold,
                    }
                }
            });
        } catch (error) {
            console.log("[src][services][UserServices][findUsersWithCancelledThreshold]", error);
            throw new Error("Failed to find users with the specified cancellation threshold");
        }
    }

    public async updatePushToken(userId: number, pushToken: string): Promise<User | null> {
        try {
            return await databaseService.getClient().user.update({
                where: {
                    userId
                },
                data: {
                    pushToken
                }
            })
        } catch (error) {
            console.log("[src][services][UserServices][updatePushToken]", error)
            throw new Error(`Failed to update push token ${error}`)
        }
    }
}