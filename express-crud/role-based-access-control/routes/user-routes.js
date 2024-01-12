// routes/userRoutes.js
import express from 'express';
import { authenticateUser } from '../middleware/auth';
import { UserController } from '../controllers/UserController';

const userRouter = express.Router();

userRouter.get('/profile', authenticateUser(['user', 'admin']), UserController.getProfile);

export default userRouter;
