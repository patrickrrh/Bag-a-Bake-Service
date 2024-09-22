import bycrpt from 'bcrypt';
import { Pengguna } from '@prisma/client';
import databaseService from '../script';

interface CreateUserInput {
    idPeran: number;
    namaPengguna: string;
    email: string;
    password: string;
    noTeleponPengguna: string;
    alamatPengguna: string;
}

export class UserServices {
    public async findUserByEmail(email: string): Promise<Pengguna | null> {
        if (!email) {
            throw new Error('Email is required');
        }

        try {
            return databaseService.getClient().pengguna.findUnique({
                where: {
                    email
                }
            })
        } catch (error) {
            throw new Error("Failed to find user")
        }
    }

    public async createUser(pengguna: CreateUserInput): Promise<Pengguna> {
        pengguna.password = bycrpt.hashSync(pengguna.password, 12);

        try {
            return await databaseService.getClient().pengguna.create({
                data: pengguna
            })
        } catch (error) {
            throw new Error("Failed to create user")
        }
    }

    public async findUserById(idPengguna: number): Promise<Pengguna | null> {
        if (!idPengguna) {
            throw new Error('Id pengguna is required');
        }
    
        try {
            return await databaseService.getClient().pengguna.findUnique({
                where: { idPengguna }
            })
        } catch (error) {
            throw new Error("Failed to find user")
        }
    }
}