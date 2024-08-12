import { RefreshToken } from '@prisma/client';
import db from '../script';
import { hashToken } from '../utilities/hashToken';

interface AddRefreshTokenInput {
    jti: string;
    refreshToken: string;
    idPengguna: number;
}

export async function addRefreshTokenToWhitelist({jti, refreshToken, idPengguna}: AddRefreshTokenInput): Promise<RefreshToken> {
    try {
        return await db.refreshToken.create({
            data: {
                jti: jti,
                hashedToken: hashToken(refreshToken),
                idPengguna: idPengguna,
            }
        })
    } catch (error) {
        throw new Error("Failed to add refresh token to whitelist")
    }
}

export async function findRefreshTokenById(jti: string): Promise<RefreshToken | null> {
    try {
        return await db.refreshToken.findUnique({
            where: {
                jti: jti
            }
        })
    } catch (error) {
        throw new Error("Failed to find refresh token")
    }
}

export async function deleteRefreshToken(jti: string): Promise<void> {
    try {
        await db.refreshToken.update({
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

export async function revokeTokens(idPengguna: number): Promise<void> {
    try {
        await db.refreshToken.updateMany({
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