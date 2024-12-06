"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.generateTokens = generateTokens;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateAccessToken(userId) {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
}
function generateRefreshToken(userId, jti) {
    return jsonwebtoken_1.default.sign({ userId, jti }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
}
function generateTokens(userId, jti) {
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId, jti);
    return {
        accessToken,
        refreshToken
    };
}
