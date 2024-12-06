"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashToken = hashToken;
const bcrypt_1 = __importDefault(require("bcrypt"));
function hashToken(token) {
    return bcrypt_1.default.hashSync(token, 12);
}
