import { NextFunction, Request, Response } from "express";
import { generateTokens } from "../utilities/jwt";
import { v4 as uuidv4 } from 'uuid';
import { UserServices } from "../services/userServices";
import { AuthServices } from "../services/authServices";
import bycrpt from 'bcrypt';

const userServices = new UserServices();
const authServices = new AuthServices();

export class AuthController {
    public async register(req: Request, res: Response, next: NextFunction): Promise<void> { 
        try {
            const { idPeran, namaPengguna, noTeleponPengguna, email, password, alamatPengguna } = req.body
            if (( !idPeran || !namaPengguna || !noTeleponPengguna || !email || !password || !alamatPengguna )) {
                res.status(400)
                throw new Error('All fields must be filled')
            }
    
            const checkExistingUser = await userServices.findUserByEmail(email);
            if (checkExistingUser) {
                res.status(400)
                throw new Error('Email has already been taken')
            }
    
            const pengguna = await userServices.createUser({
                idPeran,
                email,
                namaPengguna,
                noTeleponPengguna,
                password,
                alamatPengguna
            });
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
            if (!email || !password) {
                res.status(400)
                throw new Error('All fields must be filled')
            }

            const checkExistingUser = await userServices.findUserByEmail(email);
            if (!checkExistingUser) {
                res.status(400)
                throw new Error('Email is not registered')
            }

            const checkPassword = await bycrpt.compare(password, checkExistingUser.password);
            if (!checkPassword) {
                res.status(400)
                throw new Error('Password is incorrect')
            }

            const jti = uuidv4();
            const { accessToken, refreshToken } = generateTokens(checkExistingUser.idPengguna, jti);
            await authServices.addRefreshTokenToWhitelist({ jti, refreshToken, idPengguna: checkExistingUser.idPengguna });

            res.status(200).json({ accessToken, refreshToken });
        } catch (error) {
            next(error);
        }
    }
}