import bycrpt from 'bcrypt';
import db from '../script';
import { Pengguna } from '@prisma/client';

interface CreateUserInput {
    email: string;
    namaPengguna: string;
    password: string;
    noTeleponPengguna: string;
    alamatPengguna: string;
    idPeran: number;
}

export async function findUserByEmail(email: string): Promise<Pengguna | null> {
    if (!email) {
        throw new Error('Email is required');
    }

    try {
        return await db.pengguna.findUnique({
            where: { 
                email
             }
        })
    } catch (error) {
        throw new Error("Failed to find user")
    }
}

export async function createUser(pengguna: CreateUserInput): Promise<Pengguna> {
    pengguna.password = bycrpt.hashSync(pengguna.password, 12);

    try {
        return await db.pengguna.create({
            data: pengguna
        })
    } catch (error) {
        throw new Error("Failed to create user")
    }
}

export async function findUserById(idPengguna: number): Promise<Pengguna | null> {
    if (!idPengguna) {
        throw new Error('Id pengguna is required');
    }

    try {
        return await db.pengguna.findUnique({
            where: { idPengguna }
        })
    } catch (error) {
        throw new Error("Failed to find user")
    }
}
