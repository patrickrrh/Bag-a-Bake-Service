"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const jwt_1 = require("../utilities/jwt");
const uuid_1 = require("uuid");
const userServices_1 = require("../services/userServices");
const authServices_1 = require("../services/authServices");
const bakeryServices_1 = require("../services/bakeryServices");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mailer_1 = require("../config/mailer");
const otpHandler_1 = require("../utilities/otpHandler");
const paymentServices_1 = require("../services/paymentServices");
const mailHandler_1 = require("../utilities/mailHandler");
const userServices = new userServices_1.UserServices();
const authServices = new authServices_1.AuthServices();
const bakeryServices = new bakeryServices_1.BakeryServices();
const paymentServices = new paymentServices_1.PaymentServices();
class AuthController {
    constructor() {
        this.signIn = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, pushToken } = req.body;
                const user = yield userServices.findUserById(userId);
                if (!user) {
                    console.log("[src][controllers][AuthController][signIn] User not found");
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                yield userServices.updatePushToken(userId, pushToken);
                const jti = (0, uuid_1.v4)();
                const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(userId, jti);
                yield authServices.addRefreshTokenToWhitelist({ jti, refreshToken, userId: userId });
                res.status(200).json({ accessToken, refreshToken, user });
            }
            catch (error) {
                console.log("[src][controllers][AuthController][signIn] ", error);
                next(error);
            }
        });
    }
    isEmailRegistered(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield userServices.findUserByEmail(email.toLowerCase());
                if (user) {
                    console.log("[src][controllers][AuthController][isEmailRegistered] Email is used");
                    res.status(400).json({ error: 'Email sudah terdaftar' });
                    return true;
                }
                res.status(200).send();
                return true;
            }
            catch (error) {
                console.log("[src][controllers][AuthController][isEmailRegistered] ", error);
                next(error);
                return true;
            }
        });
    }
    checkAccount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield userServices.findUserByEmail(email.toLowerCase());
                if (!user) {
                    console.log("[src][controllers][AuthController][checkAccount] Email is not registered");
                    res.status(404).json({ error: 'Email tidak terdaftar' });
                    return false;
                }
                const checkPassword = yield bcrypt_1.default.compare(password, user.password);
                if (!checkPassword) {
                    console.log("[src][controllers][AuthController][checkAccount] Password is incorrect");
                    res.status(400).json({ error: 'Kata sandi salah' });
                    return false;
                }
                res.status(200).json({ data: user });
                return user;
            }
            catch (error) {
                console.log("[src][controllers][AuthController][checkAccount] ", error);
                next(error);
                return false;
            }
        });
    }
    signUpUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = {
                    roleId: req.body.roleId,
                    userName: req.body.userName,
                    userImage: req.body.userImage,
                    userPhoneNumber: req.body.userPhoneNumber,
                    email: req.body.email.toLowerCase(),
                    password: req.body.password,
                    address: req.body.address,
                    latitude: req.body.latitude,
                    longitude: req.body.longitude,
                    pushToken: req.body.pushToken,
                };
                const checkExistingUser = yield userServices.findUserByEmail(userData.email.toLowerCase());
                if (checkExistingUser) {
                    return;
                }
                const newUser = yield userServices.createUser(userData);
                const user = yield userServices.findUserById(newUser.userId);
                const jti = (0, uuid_1.v4)();
                const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(newUser.userId, jti);
                yield authServices.addRefreshTokenToWhitelist({ jti, refreshToken, userId: newUser.userId });
                res.status(201).json({ accessToken, refreshToken, user });
            }
            catch (error) {
                console.log("[src][controllers][AuthController][signUpUser] ", error);
                next(error);
            }
        });
    }
    signUpBakery(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bakeryData = {
                    userId: req.body.userId,
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
                const newBakery = yield bakeryServices.createBakery(bakeryData);
                const paymentDataArray = req.body.paymentMethods.map((payment) => ({
                    bakeryId: newBakery.bakeryId,
                    paymentMethod: payment.paymentMethod,
                    paymentService: payment.paymentService,
                    paymentDetail: payment.paymentDetail
                }));
                yield paymentServices.insertPayment(paymentDataArray);
                const info = (0, mailer_1.sendMail)("support@bagabake.com", "Pendaftaran Bakeri Baru", (0, mailHandler_1.generateNewBakeryMailContent)(bakeryData.bakeryName));
                if (info) {
                    console.log("[src][controllers][AuthController][signUpBakery] Email sent successfully");
                    res.status(201).json({
                        status: 201,
                        message: 'Berhasil membuat bakeri dan mengirim email'
                    });
                }
                else {
                    console.log("[src][controllers][AuthController][signUpBakery] Failed to send email");
                    res.status(500).json({
                        status: 500,
                        error: 'Gagal mengirim email'
                    });
                }
            }
            catch (error) {
                console.log("[src][controllers][AuthController][signUpBakery] ", error);
                next(error);
            }
        });
    }
    refreshAuthentication(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.body;
                if (!refreshToken) {
                    console.log("[src][controllers][AuthController][refreshAuthentication] Missing refresh token");
                    res.status(400).json({ error: 'Missing refresh token' });
                    return;
                }
                const payload = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
                const getRefreshToken = yield authServices.findRefreshTokenById(payload.jti);
                if (!getRefreshToken || getRefreshToken.revoked === true) {
                    console.log("[src][controllers][AuthController][refreshAuthentication] Refresh token is invalid");
                    res.status(401).json({ error: 'Unauthorized' });
                    return;
                }
                const getUser = yield userServices.findUserById(payload.userId);
                if (!getUser) {
                    console.log("[src][controllers][AuthController][refreshAuthentication] User not found");
                    res.status(401).json({ error: 'Unauthorized' });
                    return;
                }
                yield authServices.deleteRefreshToken(payload.jti);
                const jti = (0, uuid_1.v4)();
                const { accessToken, refreshToken: newRefreshToken } = (0, jwt_1.generateTokens)(getUser.userId, jti);
                yield authServices.addRefreshTokenToWhitelist({ jti, refreshToken: newRefreshToken, userId: getUser.userId });
                res.status(200).json({
                    status: 200,
                    data: { accessToken, refreshToken: newRefreshToken, user: getUser }
                });
            }
            catch (error) {
                console.log("[src][controllers][AuthController][refreshAuthentication] ", error);
                next(error);
            }
        });
    }
    sendOTP(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                if (!email) {
                    console.log("[src][controllers][AuthController][resetPassword] Missing email");
                    res.status(400).json({ error: 'Missing email' });
                    return;
                }
                const findUser = yield userServices.findUserByEmail(email.toLowerCase());
                if (!findUser) {
                    console.log("[src][controllers][AuthController][resetPassword] User not found");
                    res.status(404).json({
                        status: 404,
                        error: 'Email tidak ditemukan'
                    });
                    return;
                }
                const otp = (0, otpHandler_1.generateOTP)();
                const expiresAt = Date.now() + 60 * 1000;
                otpHandler_1.otpStore[email.toLowerCase()] = { otp, expiresAt };
                const info = (0, mailer_1.sendMail)(email.toLowerCase(), "Permintaan Ubah Kata Sandi", (0, otpHandler_1.generateMailContent)(otp, findUser.userName));
                if (info) {
                    console.log("[src][controllers][AuthController][resetPassword] Email sent successfully");
                    res.status(200).json({
                        status: 200,
                        message: 'Kode OTP berhasil dikirim, silakan cek email Anda'
                    });
                }
                else {
                    console.log("[src][controllers][AuthController][resetPassword] Failed to send email");
                    res.status(500).json({
                        status: 500,
                        error: 'Gagal mengirim email'
                    });
                }
            }
            catch (error) {
                console.log("[src][controllers][AuthController][resetPassword] ", error);
                next(error);
            }
        });
    }
    sendSignUpOTP(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, userName } = req.body;
                if (!email) {
                    console.log("[src][controllers][AuthController][sendSignUpOTP] Missing email");
                    res.status(400).json({ error: 'Missing email' });
                    return;
                }
                const otp = (0, otpHandler_1.generateOTP)();
                const expiresAt = Date.now() + 60 * 1000;
                otpHandler_1.otpStore[email.toLowerCase()] = { otp, expiresAt };
                const info = (0, mailer_1.sendMail)(email.toLowerCase(), "Kode OTP Registrasi", (0, otpHandler_1.generateMailContent)(otp, userName));
                if (info) {
                    console.log("[src][controllers][AuthController][sendSignUpOTP] Email sent successfully");
                    res.status(200).json({
                        status: 200,
                        message: 'Kode OTP berhasil dikirim, silakan cek email Anda'
                    });
                }
                else {
                    console.log("[src][controllers][AuthController][sendSignUpOTP] Failed to send email");
                    res.status(500).json({
                        status: 500,
                        error: 'Gagal mengirim email'
                    });
                }
            }
            catch (error) {
                console.log("[src][controllers][AuthController][sendSignUpOTP] ", error);
                next(error);
            }
        });
    }
    verifyOTP(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, inputOTP } = req.body;
                if (!email || !inputOTP) {
                    console.log("[src][controllers][AuthController][verifyOTP] Missing email or OTP");
                    res.status(400).json({ error: 'Missing email or OTP' });
                    return false;
                }
                const storedOTP = otpHandler_1.otpStore[email.toLowerCase()];
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
                    delete otpHandler_1.otpStore[email];
                    console.log("[src][controllers][AuthController][verifyOTP] OTP has expired");
                    res.status(400).json({
                        status: 400,
                        error: 'Kode OTP tidak valid, silakan kirim ulang'
                    });
                    return false;
                }
                if (inputOTP === otp) {
                    delete otpHandler_1.otpStore[email];
                    console.log("[src][controllers][AuthController][verifyOTP] OTP is valid");
                    res.status(200).json({
                        status: 200,
                        message: 'OTP is valid'
                    });
                    return true;
                }
                else {
                    console.log("[src][controllers][AuthController][verifyOTP] Invalid OTP");
                    res.status(400).json({
                        status: 400,
                        error: 'Kode OTP tidak valid'
                    });
                    return false;
                }
            }
            catch (error) {
                console.log("[src][controllers][AuthController][verifyOTP] ", error);
                next(error);
                return false;
            }
        });
    }
    changePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const findUser = yield userServices.findUserByEmail(email.toLowerCase());
                if (!findUser) {
                    console.log("[src][controllers][AuthController][changePassword] User not found");
                    res.status(404).json({
                        status: 404,
                        error: 'Email tidak ditemukan'
                    });
                    return;
                }
                // await authServices.revokeTokens(findUser.userId);
                yield userServices.updateUserPassword(email.toLowerCase(), password);
                res.status(200).json({
                    status: 200,
                    message: 'Password berhasil diubah'
                });
            }
            catch (error) {
                console.log("[src][controllers][AuthController][changePassword] ", error);
                next(error);
            }
        });
    }
    updateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _a = req.body, { userId } = _a, updateData = __rest(_a, ["userId"]);
                const updatedUser = yield userServices.updateUserById(parseInt(userId), updateData);
                if (!updatedUser) {
                    console.log("[src][controllers][AuthController][updateUser] User not found");
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                console.log("[src][controllers][AuthController][updateUser] User updated successfully");
                res.status(200).json({ message: 'User updated successfully', user: updatedUser });
            }
            catch (error) {
                console.log("[src][controllers][AuthController][updateUser] ", error);
                next(error);
            }
        });
    }
    revokeTokens(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                yield authServices.revokeTokens(userId);
                console.log("[src][controllers][AuthController][revokeTokens] Tokens revoked successfully");
                res.status(200).json({ status: 200, message: 'Tokens revoked successfully' });
            }
            catch (error) {
                console.log("[src][controllers][AuthController][revokeTokens] ", error);
                next(error);
            }
        });
    }
    refreshUserStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.body;
                if (!refreshToken) {
                    console.log("[src][controllers][AuthController][refreshUserStatus] Missing refresh token");
                    res.status(400).json({ error: 'Missing refresh token' });
                    return;
                }
                const payload = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
                const getRefreshToken = yield authServices.findRefreshTokenById(payload.jti);
                if (!getRefreshToken || getRefreshToken.revoked === true) {
                    console.log("[src][controllers][AuthController][refreshUserStatus] Refresh token is invalid");
                    res.status(401).json({ error: 'Unauthorized' });
                    return;
                }
                const getUser = yield userServices.findUserById(payload.userId);
                if (!getUser) {
                    console.log("[src][controllers][AuthController][refreshUserStatus] User not found");
                    res.status(401).json({ error: 'Unauthorized' });
                    return;
                }
                console.log("get user", getUser);
                res.status(200).json({
                    status: 200,
                    user: getUser
                });
            }
            catch (error) {
                console.log("[src][controllers][AuthController][refreshUserStatus] ", error);
                next(error);
            }
        });
    }
}
exports.AuthController = AuthController;
