import { Router } from 'express';
import {
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats
} from '../controllers/orderController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Get all orders (admin only)
router.get('/', authenticateToken, requireAdmin, getAllOrders);

// Get order statistics (admin only)
router.get('/stats', authenticateToken, requireAdmin, getOrderStats);

// Get user's own orders
router.get('/my-orders', authenticateToken, getUserOrders);

// Get specific order by ID
router.get('/:id', authenticateToken, getOrderById);

// Update order status (admin only)
router.put('/:id/status', authenticateToken, requireAdmin, updateOrderStatus);

export default router;