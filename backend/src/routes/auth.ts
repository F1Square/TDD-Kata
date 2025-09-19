import express from 'express';
import { register, login, getUserStats } from '../controllers/authController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

export default router;