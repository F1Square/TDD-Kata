import express from 'express';
import { 
  addSweet, 
  getAllSweets, 
  searchSweets, 
  updateSweet, 
  deleteSweet,
  purchaseSweet,
  restockSweet
} from '../controllers/sweetController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// POST /api/sweets - Add a new sweet (Admin only)
router.post('/', requireAdmin, addSweet);

// GET /api/sweets - Get all sweets
router.get('/', getAllSweets);

// GET /api/sweets/search - Search sweets
router.get('/search', searchSweets);

// PUT /api/sweets/:id - Update sweet (Admin only)
router.put('/:id', requireAdmin, updateSweet);

// DELETE /api/sweets/:id - Delete sweet (Admin only)
router.delete('/:id', requireAdmin, deleteSweet);

// POST /api/sweets/:id/purchase - Purchase sweet
router.post('/:id/purchase', purchaseSweet);

// POST /api/sweets/:id/restock - Restock sweet (Admin only)
router.post('/:id/restock', requireAdmin, restockSweet);

export default router;