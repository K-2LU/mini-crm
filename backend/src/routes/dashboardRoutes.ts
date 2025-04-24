import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import * as dashboardController from '../controllers/dashboardController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(dashboardController.getDashboard));

export default router;
