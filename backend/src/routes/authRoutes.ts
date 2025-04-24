import express, { Router } from 'express';
import { login, signup, me } from '../controllers/authController';
import { authenticate } from '../middlewares/authMiddleware';

const router: Router = express.Router();

router.post('/signup', signup as express.RequestHandler);
router.post('/login', login as express.RequestHandler);
router.get('/me', authenticate, me as express.RequestHandler);

export default router;
