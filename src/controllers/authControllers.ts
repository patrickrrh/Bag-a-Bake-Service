import { NextFunction, Request, Response } from "express";
import { generateTokens } from "../utilities/jwt";
import { v4 as uuidv4 } from 'uuid';
import { CreateUserInput, UserServices } from "../services/userServices";
import { AuthServices } from "../services/authServices";
import { CreateBakeryInput, BakeryServices } from "../services/bakeryServices";
import bycrpt from 'bcrypt';
import jwt from "jsonwebtoken";

const userServices = new UserServices();
const authServices = new AuthServices();
const bakeryServices = new BakeryServices();

export class AuthController {
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
                console.log("[src][controllers][AuthController][signUp] Email has already been taken");
                res.status(400).json({ error: 'Email has already been taken' });
                return;
            }

            const user = await userServices.createUser(userData);

            if (user.roleId === 2) {
                const bakeryData: CreateBakeryInput = {
                    userId: user.userId,
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
                    userId: user.userId,
                    regionId: req.body.bakeryRegionId,
                })
            }

            const jti = uuidv4();
            const { accessToken, refreshToken } = generateTokens(user.userId, jti);
            await authServices.addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.userId });

            res.status(201).json({ accessToken, refreshToken });
        } catch (error) {
            console.log("[src][controllers][AuthController][signUp] ", error);
            next(error);
        }
    }

    public async signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body

            const checkExistingUser = await userServices.findUserByEmail(email);
            if (!checkExistingUser) {
                console.log("[src][controllers][AuthController][signIn] Email is not registered");
                res.status(400).json({ error: 'Email is not registered' });
                return;
            }

            const checkPassword = await bycrpt.compare(password, checkExistingUser.password);
            if (!checkPassword) {
                console.log("[src][controllers][AuthController][signIn] Password is incorrect");
                res.status(400).json({ error: 'Password is incorrect' });
                return;
            }

            const jti = uuidv4();
            const { accessToken, refreshToken } = generateTokens(checkExistingUser.userId, jti);
            await authServices.addRefreshTokenToWhitelist({ jti, refreshToken, userId: checkExistingUser.userId });

            res.status(200).json({ accessToken, refreshToken });
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
}