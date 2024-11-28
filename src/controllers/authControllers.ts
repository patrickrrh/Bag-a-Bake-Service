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
import { generateMailContent, generateOTP, otpStore } from "../utilities/otpHandler";
import { CreatePaymentInput, PaymentServices } from "../services/paymentServices";

const userServices = new UserServices();
const authServices = new AuthServices();
const bakeryServices = new BakeryServices();
const paymentServices = new PaymentServices();

export class AuthController {

    public async isEmailRegistered(req: Request, res: Response, next: NextFunction): Promise<boolean> {
        try {
            const { email } = req.body
            const user = await userServices.findUserByEmail(email.toLowerCase());
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
            const user = await userServices.findUserByEmail(email.toLowerCase());
            if (!user) {
                console.log("[src][controllers][AuthController][checkAccount] Email is not registered");
                res.status(404).json({ error: 'Email tidak terdaftar' });
                return false;
            }

            const checkPassword = await bycrpt.compare(password, user.password);
            if (!checkPassword) {
                console.log("[src][controllers][AuthController][checkAccount] Password is incorrect");
                res.status(400).json({ error: 'Kata sandi salah' });
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
                email: req.body.email.toLowerCase(),
                password: req.body.password,
                address: req.body.address,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                pushToken: req.body.pushToken
            };

            console.log("user data", userData.pushToken)

            const checkExistingUser = await userServices.findUserByEmail(userData.email.toLowerCase());
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
                    bakeryAddress: req.body.bakeryAddress,
                    bakeryLatitude: req.body.bakeryLatitude,
                    bakeryLongitude: req.body.bakeryLongitude
                };

                const newBakery = await bakeryServices.createBakery({
                    ...bakeryData,
                    userId: newUser.userId,
                })

                const paymentDataArray: CreatePaymentInput[] = req.body.paymentMethods.map((payment: any) => ({
                    bakeryId: newBakery.bakeryId,
                    paymentMethod: payment.paymentMethod,
                    paymentService: payment.paymentService,
                    paymentDetail: payment.paymentDetail
                }));

                await paymentServices.insertPayment(paymentDataArray);
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

            res.status(200).json({
                status: 200,
                data: { accessToken, refreshToken: newRefreshToken }
            });
        } catch (error) {
            console.log("[src][controllers][AuthController][refreshAuthentication] ", error);
            next(error);
        }
    }

    public async sendOTP(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email } = req.body;

            if (!email) {
                console.log("[src][controllers][AuthController][resetPassword] Missing email");
                res.status(400).json({ error: 'Missing email' });
                return;
            }

            const findUser = await userServices.findUserByEmail(email.toLowerCase());

            if (!findUser) {
                console.log("[src][controllers][AuthController][resetPassword] User not found");
                res.status(404).json({
                    status: 404,
                    error: 'Email tidak ditemukan'
                });
                return;
            }

            const otp = generateOTP();
            const expiresAt = Date.now() + 60 * 1000;
            otpStore[email.toLowerCase()] = { otp, expiresAt };

            const info = sendMail(email.toLowerCase(), "Permintaan Ubah Kata Sandi", generateMailContent(otp, findUser.userName));

            if (info) {
                console.log("[src][controllers][AuthController][resetPassword] Email sent successfully");
                res.status(200).json({
                    status: 200,
                    message: 'Kode OTP berhasil dikirim, silakan cek email Anda'
                });
            } else {
                console.log("[src][controllers][AuthController][resetPassword] Failed to send email");
                res.status(500).json({
                    status: 500,
                    error: 'Gagal mengirim email'
                });
            }
        } catch (error) {
            console.log("[src][controllers][AuthController][resetPassword] ", error);
            next(error);
        }
    }

    public async verifyOTP(req: Request, res: Response, next: NextFunction): Promise<boolean> {
        try {
            const { email, inputOTP } = req.body;

            console.log("email disini: ", email);
            console.log("otp disini: ", inputOTP);

            if (!email || !inputOTP) {
                console.log("[src][controllers][AuthController][verifyOTP] Missing email or OTP");
                res.status(400).json({ error: 'Missing email or OTP' });
                return false;
            }

            const storedOTP = otpStore[email.toLowerCase()];
            console.log("otp disini: ", storedOTP);
            if (!storedOTP) {
                console.log("[src][controllers][AuthController][verifyOTP] OTP not found");
                res.status(404).json({
                    status: 404,
                    error: 'Kode OTP tidak ditemukan'
                });
                return false;
            }

            const { otp, expiresAt } = storedOTP;
            if (Date.now() > expiresAt) {
                delete otpStore[email];
                console.log("[src][controllers][AuthController][verifyOTP] OTP has expired");
                res.status(400).json({
                    status: 400,
                    error: 'Kode OTP tidak valid, silakan kirim ulang'
                });
                return false;
            }

            if (inputOTP === otp) {
                delete otpStore[email];
                console.log("[src][controllers][AuthController][verifyOTP] OTP is valid");
                res.status(200).json({
                    status: 200,
                    message: 'OTP is valid'
                });
                return true;
            } else {
                console.log("[src][controllers][AuthController][verifyOTP] Invalid OTP");
                res.status(400).json({
                    status: 400,
                    error: 'Kode OTP tidak valid'
                });
                return false;
            }
        } catch (error) {
            console.log("[src][controllers][AuthController][verifyOTP] ", error);
            next(error);
            return false;
        }
    }

    public async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                console.log("[src][controllers][AuthController][changePassword] Missing email or password");
                res.status(400).json({
                    status: 400,
                    error: 'Missing email or password'
                });
                return;
            }

            const findUser = await userServices.findUserByEmail(email.toLowerCase());

            if (!findUser) {
                console.log("[src][controllers][AuthController][changePassword] User not found");
                res.status(404).json({
                    status: 404,
                    error: 'Email tidak ditemukan'
                });
                return;
            }

            // await authServices.revokeTokens(findUser.userId);

            await userServices.updateUserPassword(email.toLowerCase(), password);

            res.status(200).json({
                status: 200,
                message: 'Password berhasil diubah'
            })
        } catch (error) {
            console.log("[src][controllers][AuthController][changePassword] ", error);
            next(error);
        }
    }

    public async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId, ...updateData } = req.body;

            const updatedUser = await userServices.updateUserById(parseInt(userId), updateData);

            if (!updatedUser) {
                console.log("[src][controllers][AuthController][updateUser] User not found");
                res.status(404).json({ error: 'User not found' });
                return;
            }

            console.log("[src][controllers][AuthController][updateUser] User updated successfully");
            res.status(200).json({ message: 'User updated successfully', user: updatedUser });
        } catch (error) {
            console.log("[src][controllers][AuthController][updateUser] ", error);
            next(error);
        }
    }

    public async revokeTokens(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId } = req.body;

            await authServices.revokeTokens(userId);

            console.log("[src][controllers][AuthController][revokeTokens] Tokens revoked successfully");
            res.status(200).json({ status: 200,message: 'Tokens revoked successfully' });
        } catch (error) {
            console.log("[src][controllers][AuthController][revokeTokens] ", error);
            next(error);
        }
    }
}