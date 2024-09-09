import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

export function isAuthenticated(req: Request, res: Response, next: NextFunction): void {
    const { authorization } = req.headers;

    if (!authorization) {
        res.status(401);
        throw new Error('Unauthorized');
    }

    try {
        const token = authorization.split(' ')[1];
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as { idPengguna: number };
        req.body.idPengguna = payload.idPengguna;
        next();
    } catch (error) {
        res.status(401);
        throw new Error('Unauthorized');
    }
}