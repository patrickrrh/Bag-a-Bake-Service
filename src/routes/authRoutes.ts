import express from 'express';
import { AuthController } from '../controllers/authControllers';

const router = express.Router();

const authController = new AuthController();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refreshToken", authController.refreshAuthentication);

export default router