"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = isAuthenticated;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function isAuthenticated(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization) {
        res.status(401);
        throw new Error('Unauthorized');
    }
    try {
        const token = authorization.split(' ')[1];
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
        req.body.userId = payload.userId;
        next();
    }
    catch (error) {
        res.status(401);
        throw new Error('Unauthorized');
    }
}
