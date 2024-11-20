import express from 'express';
import { AuthController } from '../controllers/authControllers';

const router = express.Router();

const authController = new AuthController();

router.post("/sign_up", authController.signUp);
router.post("/sign_in", authController.signIn);
router.post("/refresh_token", authController.refreshAuthentication);
router.post("/is_email_registered", authController.isEmailRegistered);
router.post("/check_account", authController.checkAccount);
router.post("/send/otp", authController.sendOTP);
router.post("/verify/otp", authController.verifyOTP);
router.put("/change/password", authController.changePassword);
router.put("/update/user", authController.updateUser);
router.put("/revoke/tokens", authController.revokeTokens);

export default router