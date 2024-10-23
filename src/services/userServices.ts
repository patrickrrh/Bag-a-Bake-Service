import bycrpt from 'bcrypt';
import { User } from '@prisma/client';
import databaseService from '../script';
import { json } from 'express';

export interface CreateUserInput {
    roleId: number;
    regionId?: number;
    userName: string;
    userImage?: string;
    userPhoneNumber?: string;
    email: string;
    password: string;
}

export class UserServices {
    public async findUserByEmail(email: string): Promise<User | null> {
        if (!email) {
            console.log("[src][services][UserServices][findUserByEmail] Email is required")
            throw new Error('Email is required');
        }

        try {
            return databaseService.getClient().user.findUnique({
                where: {
                    email
                }
            })
        } catch (error) {
            console.log("[src][services][UserServices][findUserByEmail]", error)
            throw new Error("Failed to find user")
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
        if (!userId) {
            console.log("[src][services][UserServices][findUserById] User ID is required")
            throw new Error('User ID is required');
        }
    
        try {
            return await databaseService.getClient().user.findUnique({
                where: { 
                    userId
                 },
                 include: {
                    regionUser: true
                 }
            })
        } catch (error) {
            console.log("[src][services][UserServices][findUserById]", error)
            throw new Error("Failed to find user")
        }
    }
}