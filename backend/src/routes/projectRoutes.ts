import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import * as projectController from '../controllers/projectController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(projectController.getProjects));
router.post('/', asyncHandler(projectController.createProject));
router.get('/:id', asyncHandler(projectController.getProjectById));
router.put('/:id', asyncHandler(projectController.updateProject));
router.delete('/:id', asyncHandler(projectController.deleteProject));

export default router;
