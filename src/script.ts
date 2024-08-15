import { PrismaClient } from '@prisma/client';

class DatabaseService {
    private prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient();
    }

    public getClient(): PrismaClient {
        return this.prisma
    }
}

const databaseService = new DatabaseService();
export default databaseService;