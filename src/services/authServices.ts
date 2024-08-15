import { RefreshToken } from '@prisma/client';
import { hashToken } from '../utilities/hashToken';
import databaseService from '../script';

interface RefreshTokenInput {
    jti: string;
    refreshToken: string;
    idPengguna: number;
}

export class AuthServices {
    public async addRefreshTokenToWhitelist(input: RefreshTokenInput): Promise<RefreshToken> {
        try {
            return databaseService.getClient().refreshToken.create({
                data: {
                    jti: input.jti,
                    hashedToken: hashToken(input.refreshToken),
                    idPengguna: input.idPengguna,
                }
            })
        } catch (error) {
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
            throw new Error("Failed to delete refresh token")
        }
    }

    public async revokeTokens(idPengguna: number): Promise<void> {
        try {
            await databaseService.getClient().refreshToken.updateMany({
                where: {
                    idPengguna: idPengguna
                },
                data: {
                    revoked: true
                },
            })
        } catch (error) {
            throw new Error("Failed to revoke tokens")
        }  
    }
}