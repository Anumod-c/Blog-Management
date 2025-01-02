import express from 'express';

import { authController } from '../controllers/authController';

const authRouter = express.Router();

authRouter.post('/register',authController.register)
authRouter.post('/verify-email',authController.verifyEmail)
authRouter.post('/login',authController.email)
authRouter.post('/refresh-token', authController.refreshToken)

export default authRouter