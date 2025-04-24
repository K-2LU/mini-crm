import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import * as reminderController from '../controllers/reminderController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(reminderController.getReminders));
router.post('/', asyncHandler(reminderController.createReminder));
router.get('/:id', asyncHandler(reminderController.getReminderById));
router.put('/:id', asyncHandler(reminderController.updateReminder));
router.delete('/:id', asyncHandler(reminderController.deleteReminder));

export default router;
