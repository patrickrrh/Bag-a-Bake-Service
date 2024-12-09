import express from 'express';
import { AuthController } from '../controllers/authControllers';
import createUploadMiddleware from '../middlewares/uploadMiddlewares';

const router = express.Router();

const authController = new AuthController();

router.post("/sign_up_user", authController.signUpUser);
router.post("/sign_up_bakery", authController.signUpBakery);
router.post("/sign_in", authController.signIn);
router.post("/refresh_token", authController.refreshAuthentication);
router.post("/is_email_registered", authController.isEmailRegistered);
router.post("/check_account", authController.checkAccount);
router.post("/send/otp", authController.sendOTP);
router.post("/send/sign_up/otp", authController.sendSignUpOTP);
router.post("/verify/otp", authController.verifyOTP);
router.put("/change/password", authController.changePassword);
router.put("/update/user", authController.updateUser);
router.put("/revoke/tokens", authController.revokeTokens);
router.post("/refresh/user_status", authController.refreshUserStatus);

export default router