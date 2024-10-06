import express from 'express';
import { AuthController } from '../controllers/authControllers';

const router = express.Router();

const authController = new AuthController();

router.post("/sign_up", authController.signUp);
router.post("/sign_in", authController.signIn);
router.post("/refresh_token", authController.refreshAuthentication);
router.post("/check_existing_email", authController.checkExistingEmail);

export default router