import { NextFunction, Request, Response } from "express";
import { generateTokens } from "../utilities/jwt";
import { v4 as uuidv4 } from 'uuid';
import { CreateUserInput, UserServices } from "../services/userServices";
import { AuthServices } from "../services/authServices";
import { CreateBakeryInput, BakeryServices } from "../services/bakeryServices";
import bycrpt from 'bcrypt';
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import databaseService from "../script";
import { sendMail } from "../config/mailer";

const userServices = new UserServices();
const authServices = new AuthServices();
const bakeryServices = new BakeryServices();

export class AuthController {

    public async isEmailRegistered(req: Request, res: Response, next: NextFunction): Promise<boolean> {
        try {
            const { email } = req.body
            const user = await userServices.findUserByEmail(email);
            if (user) {
                console.log("[src][controllers][AuthController][isEmailRegistered] Email is used");
                res.status(400).json({ error: 'Email sudah terdaftar' });
                return true;
            }

            res.status(200).send();
            return true;
        } catch (error) {
            console.log("[src][controllers][AuthController][isEmailRegistered] ", error);
            next(error);
            return true;
        }
    }

    public async checkAccount(req: Request, res: Response, next: NextFunction): Promise<User | boolean> {
        try {
            const { email, password } = req.body
            const user = await userServices.findUserByEmail(email);
            if (!user) {
                console.log("[src][controllers][AuthController][checkAccount] Email is not registered");
                res.status(404).json({ error: 'Email tidak terdaftar' });
                return false;
            }

            const checkPassword = await bycrpt.compare(password, user.password);
            if (!checkPassword) {
                console.log("[src][controllers][AuthController][checkAccount] Password is incorrect");
                res.status(400).json({ error: 'Password salah' });
                return false;
            }

            res.status(200).json({ data: user });
            return user;
        } catch (error) {
            console.log("[src][controllers][AuthController][checkAccount] ", error);
            next(error);
            return false;
        }
    }

    public async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userData: CreateUserInput = {
                roleId: req.body.roleId,
                userName: req.body.userName,
                userImage: req.body.userImage,
                userPhoneNumber: req.body.userPhoneNumber,
                email: req.body.email,
                password: req.body.password,
                regionId: req.body.regionId,
            };

            const checkExistingUser = await userServices.findUserByEmail(userData.email);
            if (checkExistingUser) {
                return;
            }

            const newUser = await userServices.createUser(userData);

            if (newUser.roleId === 2) {
                const bakeryData: CreateBakeryInput = {
                    userId: newUser.userId,
                    bakeryName: req.body.bakeryName,
                    bakeryImage: req.body.bakeryImage,
                    bakeryDescription: req.body.bakeryDescription,
                    bakeryPhoneNumber: req.body.bakeryPhoneNumber,
                    openingTime: req.body.openingTime,
                    closingTime: req.body.closingTime,
                    regionId: req.body.regionId,
                };

                await bakeryServices.createBakery({
                    ...bakeryData,
                    userId: newUser.userId,
                    regionId: req.body.bakeryRegionId,
                })
            }

            const user = await userServices.findUserById(newUser.userId);

            const jti = uuidv4();
            const { accessToken, refreshToken } = generateTokens(newUser.userId, jti);
            await authServices.addRefreshTokenToWhitelist({ jti, refreshToken, userId: newUser.userId });

            res.status(201).json({ accessToken, refreshToken, user });
        } catch (error) {
            console.log("[src][controllers][AuthController][signUp] ", error);
            next(error);
        }
    }

    public signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { userId } = req.body

            const user = await userServices.findUserById(userId);
            if (!user) {
                console.log("[src][controllers][AuthController][signIn] User not found");
                res.status(404).json({ error: 'User not found' });
                return;
            }

            const jti = uuidv4();
            const { accessToken, refreshToken } = generateTokens(userId, jti);
            await authServices.addRefreshTokenToWhitelist({ jti, refreshToken, userId: userId });

            res.status(200).json({ accessToken, refreshToken, user });
        } catch (error) {
            console.log("[src][controllers][AuthController][signIn] ", error);
            next(error);
        }
    }

    public async refreshAuthentication(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { refreshToken } = req.body
            if (!refreshToken) {
                console.log("[src][controllers][AuthController][refreshAuthentication] Missing refresh token");
                res.status(400).json({ error: 'Missing refresh token' })
                return;
            }

            const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as { userId: number, jti: string };
            const getRefreshToken = await authServices.findRefreshTokenById(payload.jti);
            if (!getRefreshToken || getRefreshToken.revoked === true) {
                console.log("[src][controllers][AuthController][refreshAuthentication] Refresh token is invalid");
                res.status(401).json({ error: 'Unauthorized' })
                return;
            }

            const getUser = await userServices.findUserById(payload.userId);
            if (!getUser) {
                console.log("[src][controllers][AuthController][refreshAuthentication] User not found");
                res.status(401).json({ error: 'Unauthorized' })
                return;
            }

            await authServices.deleteRefreshToken(payload.jti);
            const jti = uuidv4();
            const { accessToken, refreshToken: newRefreshToken } = generateTokens(getUser.userId, jti);
            await authServices.addRefreshTokenToWhitelist({ jti, refreshToken: newRefreshToken, userId: getUser.userId });

            res.status(200).json({ accessToken, refreshToken: newRefreshToken });
        } catch (error) {
            console.log("[src][controllers][AuthController][refreshAuthentication] ", error);
            next(error);
        }
    }

    public async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email } = req.body;

            if (!email) {
                console.log("[src][controllers][AuthController][resetPassword] Missing email");
                res.status(400).json({ error: 'Missing email' });
                return;
            }

            const findUser = await userServices.findUserByEmail(email);

            if (!findUser) {
                console.log("[src][controllers][AuthController][resetPassword] User not found");
                res.status(404).json({ error: 'User not found' });
                return;
            }

            const info = sendMail(email, "Permintaan Ubah Kata Sandi", 'test');

            if (info) {
                console.log("[src][controllers][AuthController][resetPassword] Email sent successfully");
                res.status(200).json({ message: 'OTP sent successfully, please check your email' });
            } else {
                console.log("[src][controllers][AuthController][resetPassword] Failed to send email");
                res.status(500).json({ error: 'Failed to send email' });
            }
        } catch (error) {
            console.log("[src][controllers][AuthController][resetPassword] ", error);
            next(error);
        }
    }
}