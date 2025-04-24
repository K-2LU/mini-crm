import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import * as logController from '../controllers/logController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(logController.getLogs));
router.post('/', asyncHandler(logController.createLog));
router.get('/:id', asyncHandler(logController.getLogById));
router.put('/:id', asyncHandler(logController.updateLog));
router.delete('/:id', asyncHandler(logController.deleteLog));

export default router;
