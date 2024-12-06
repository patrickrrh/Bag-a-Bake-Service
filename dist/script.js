"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
class DatabaseService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    getClient() {
        return this.prisma;
    }
}
const databaseService = new DatabaseService();
exports.default = databaseService;
