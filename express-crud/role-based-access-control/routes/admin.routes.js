// routes/adminRoutes.js
import express from 'express';
import { authenticateUser } from '../middleware/auth';
import { AdminController } from '../controllers/AdminController';

const adminRouter = express.Router();

adminRouter.get('/dashboard', authenticateUser(['admin']), AdminController.getDashboard);

export default adminRouter;
