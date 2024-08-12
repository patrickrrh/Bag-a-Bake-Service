import bcrypt from 'bcrypt';

export function hashToken(token: string): string {
    return bcrypt.hashSync(token, 12);
}