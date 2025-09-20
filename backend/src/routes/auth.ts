import express from 'express';
import { register, login, getUserStats, validateToken } from '../controllers/authController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/validate - Validate token
router.get('/validate', authenticateToken, validateToken);

// GET /api/auth/stats (admin only)
router.get('/stats', authenticateToken, requireAdmin, getUserStats);

export default router;