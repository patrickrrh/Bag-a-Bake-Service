import { NextFunction, Request, Response } from "express";
import { generateTokens } from "../utilities/jwt";
import { v4 as uuidv4 } from 'uuid';
import { UserServices } from "../services/userServices";
import { AuthServices } from "../services/authServices";
import { TokoServices } from "../services/tokoServices";
import bycrpt from 'bcrypt';
import jwt from "jsonwebtoken";

const userServices = new UserServices();
const authServices = new AuthServices();
const tokoServices = new TokoServices();

export class AuthController {
    public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { idPeran, namaPengguna, noTeleponPengguna, email, password, alamatPengguna, namaToko, gambarToko, deskripsiToko, jamBuka, jamTutup, alamatToko, noTeleponToko } = req.body
            // if (( !idPeran || !namaPengguna || !noTeleponPengguna || !email || !password || !alamatPengguna || !namaToko || !gambarToko || !deskripsiToko || !jamBuka || !jamTutup || !alamatToko || !noTeleponToko)) {
            //     res.status(400).json({ error: 'All fields must be filled' });
            //     return;
            // }

            const checkExistingUser = await userServices.findUserByEmail(email);
            if (checkExistingUser) {
                res.status(400).json({ error: 'Email has already been taken' });
                return;
            }

            const pengguna = await userServices.createUser({
                idPeran,
                email,
                namaPengguna,
                noTeleponPengguna,
                password,
                alamatPengguna
            });

            if (pengguna.idPeran === 2) {
                await tokoServices.createToko({
                    idPengguna: pengguna.idPengguna,
                    namaToko,
                    gambarToko,
                    deskripsiToko,
                    jamBuka,
                    jamTutup,
                    alamatToko,
                    noTeleponToko
                })
            }

            const jti = uuidv4();
            const { accessToken, refreshToken } = generateTokens(pengguna.idPengguna, jti);
            await authServices.addRefreshTokenToWhitelist({ jti, refreshToken, idPengguna: pengguna.idPengguna });

            res.status(201).json({ accessToken, refreshToken });
        } catch (error) {
            next(error);
        }
    }

    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body
            // if (!email || !password) {
            //     res.status(400).json({ error: 'All fields must be filled' });
            //     return;
            // }

            const checkExistingUser = await userServices.findUserByEmail(email);
            if (!checkExistingUser) {
                res.status(400).json({ error: 'Email is not registered' });
                return;
            }

            const checkPassword = await bycrpt.compare(password, checkExistingUser.password);
            if (!checkPassword) {
                res.status(400).json({ error: 'Password is incorrect' });
                return;
            }

            const jti = uuidv4();
            const { accessToken, refreshToken } = generateTokens(checkExistingUser.idPengguna, jti);
            await authServices.addRefreshTokenToWhitelist({ jti, refreshToken, idPengguna: checkExistingUser.idPengguna });

            res.status(200).json({ accessToken, refreshToken });
        } catch (error) {
            next(error);
        }
    }

    public async refreshAuthentication(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { refreshToken } = req.body
            if (!refreshToken) {
                res.status(400).json({ error: 'Missing refresh token' })
                return;
            }

            const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as { idPengguna: number, jti: string };
            const getRefreshToken = await authServices.findRefreshTokenById(payload.jti);
            if (!getRefreshToken || getRefreshToken.revoked === true) {
                res.status(401).json({ error: 'Unauthorized' })
                return;
            }

            const getUser = await userServices.findUserById(payload.idPengguna);
            if (!getUser) {
                res.status(401).json({ error: 'Unauthorized' })
                return;
            }

            await authServices.deleteRefreshToken(payload.jti);
            const jti = uuidv4();
            const { accessToken, refreshToken: newRefreshToken } = generateTokens(getUser.idPengguna, jti);
            await authServices.addRefreshTokenToWhitelist({ jti, refreshToken: newRefreshToken, idPengguna: getUser.idPengguna });

            res.status(200).json({ accessToken, refreshToken: newRefreshToken });
        } catch (error) {
            next(error);
        }
    }
}