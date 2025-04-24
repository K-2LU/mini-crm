import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import * as clientController from '../controllers/clientController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(clientController.getClients));
router.post('/', asyncHandler(clientController.createClient));
router.get('/:id', asyncHandler(clientController.getClientById));
router.put('/:id', asyncHandler(clientController.updateClient));
router.delete('/:id', asyncHandler(clientController.deleteClient));

export default router;
