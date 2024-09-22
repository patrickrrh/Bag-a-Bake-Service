import jwt from 'jsonwebtoken';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'default_as';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default_rs';

export function generateAccessToken(idPengguna: number): string {
    return jwt.sign({ idPengguna }, JWT_ACCESS_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(idPengguna: number, jti: string): string {
    return jwt.sign({ idPengguna, jti }, JWT_REFRESH_SECRET, { expiresIn: '30d' });
}

export function generateTokens(idPengguna: number, jti: string): { accessToken: string, refreshToken: string } {
    const accessToken = generateAccessToken(idPengguna);
    const refreshToken = generateRefreshToken(idPengguna, jti);

    return { 
        accessToken, 
        refreshToken
    };
}