"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const hashToken_1 = require("../utilities/hashToken");
const script_1 = __importDefault(require("../script"));
class AuthServices {
    addRefreshTokenToWhitelist(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return script_1.default.getClient().refreshToken.create({
                    data: {
                        jti: input.jti,
                        hashedToken: (0, hashToken_1.hashToken)(input.refreshToken),
                        userId: input.userId,
                    }
                });
            }
            catch (error) {
                console.log("[src][services][AuthServices][addRefreshTokenToWhitelist] ", error);
                throw new Error("Failed to add refresh token to whitelist");
            }
        });
    }
    findRefreshTokenById(jti) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return script_1.default.getClient().refreshToken.findUnique({
                    where: {
                        jti: jti
                    }
                });
            }
            catch (error) {
                console.log("[src][services][AuthServices][findRefreshTokenById] ", error);
                throw new Error("Failed to find refresh token");
            }
        });
    }
    deleteRefreshToken(jti) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield script_1.default.getClient().refreshToken.update({
                    where: {
                        jti: jti,
                    },
                    data: {
                        revoked: true
                    },
                });
            }
            catch (error) {
                console.log("[src][services][AuthServices][deleteRefreshToken] ", error);
                throw new Error("Failed to delete refresh token");
            }
        });
    }
    //function to invalidate refresh token
    revokeTokens(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield script_1.default.getClient().refreshToken.updateMany({
                    where: {
                        userId: userId
                    },
                    data: {
                        revoked: true
                    },
                });
            }
            catch (error) {
                console.log("[src][services][AuthServices][revokeTokens] ", error);
                throw new Error("Failed to revoke tokens");
            }
        });
    }
}
exports.AuthServices = AuthServices;
