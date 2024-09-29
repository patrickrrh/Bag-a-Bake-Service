import { RefreshToken } from '@prisma/client';
import { hashToken } from '../utilities/hashToken';
import databaseService from '../script';

interface RefreshTokenInput {
    jti: string;
    refreshToken: string;
    userId: number;
}

export class AuthServices {
    public async addRefreshTokenToWhitelist(input: RefreshTokenInput): Promise<RefreshToken> {
        try {
            return databaseService.getClient().refreshToken.create({
                data: {
                    jti: input.jti,
                    hashedToken: hashToken(input.refreshToken),
                    userId: input.userId,
                }
            })
        } catch (error) {
            console.log("[src][services][AuthServices][addRefreshTokenToWhitelist] ", error)
            throw new Error("Failed to add refresh token to whitelist")
        }
    }

    public async findRefreshTokenById(jti: string): Promise<RefreshToken | null> {
        try {
            return databaseService.getClient().refreshToken.findUnique({
                where: {
                    jti: jti
                }
            })
        } catch (error) {
            console.log("[src][services][AuthServices][findRefreshTokenById] ", error)
            throw new Error("Failed to find refresh token")
        }
    }

    public async deleteRefreshToken(jti: string): Promise<void> {
        try {
            await databaseService.getClient().refreshToken.update({
                where: {
                    jti: jti,
                },
                data: {
                    revoked: true
                },
            });
        } catch (error) {
            console.log("[src][services][AuthServices][deleteRefreshToken] ", error)
            throw new Error("Failed to delete refresh token")
        }
    }

    //function to invalidate refresh token
    public async revokeTokens(userId: number): Promise<void> {
        try {
            await databaseService.getClient().refreshToken.updateMany({
                where: {
                    userId: userId
                },
                data: {
                    revoked: true
                },
            })
        } catch (error) {
            console.log("[src][services][AuthServices][revokeTokens] ", error)
            throw new Error("Failed to revoke tokens")
        }  
    }
}