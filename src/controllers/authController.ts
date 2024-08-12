import { NextFunction, Request, Response } from "express";
import { createUser, findUserByEmail } from "../services/userServices";
import { generateTokens } from "../utilities/jwt";
import { v4 as uuidv4 } from 'uuid';
import { addRefreshTokenToWhitelist } from "../services/authServices";

export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const { idPeran, namaPengguna, noTeleponPengguna, email, password, alamatPengguna } = req.body
        if (( !idPeran || !namaPengguna || !noTeleponPengguna || !email || !password || !alamatPengguna)) {
            res.status(400)
            throw new Error('All fields must be filled')
        }

        const checkExistingUser = await findUserByEmail(email);
        if (checkExistingUser) {
            res.status(400)
            throw new Error('Email has already been taken')
        }

        const pengguna = await createUser({
            idPeran,
            email,
            namaPengguna,
            noTeleponPengguna,
            password,
            alamatPengguna
        });
        const jti = uuidv4();
        const { accessToken, refreshToken } = generateTokens(pengguna.idPengguna, jti);
        await addRefreshTokenToWhitelist({ jti, refreshToken, idPengguna: pengguna.idPengguna });

        res.status(201).json({ accessToken, refreshToken });
    } catch (error) {
        next(error);
    }
}