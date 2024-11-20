import jwt from 'jsonwebtoken';

export function generateAccessToken(userId: number): string {
    return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET as string, { expiresIn: '15m' });
}

export function generateRefreshToken(userId: number, jti: string): string {
    return jwt.sign({ userId, jti }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '30d' });
}

export function generateTokens(userId: number, jti: string): { accessToken: string, refreshToken: string } {
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId, jti);

    return { 
        accessToken, 
        refreshToken
    };
}