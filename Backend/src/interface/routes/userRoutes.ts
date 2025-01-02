import express from 'express';
import { userController } from '../controllers/userController';
import upload from '../../utils/multer';
import authMiddleware from '../middlewares/auth';

const userRouter = express.Router();

userRouter.put('/change-avatar',authMiddleware, upload.single('profileImage'),userController.editAvatar)
userRouter.put('/update-user',authMiddleware, userController.updateUser)

export default userRouter