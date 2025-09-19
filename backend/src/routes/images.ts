import { Router } from 'express';
import { uploadImage, deleteImage, upload } from '../controllers/imageController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Upload image (admin only)
router.post('/upload', authenticateToken, requireAdmin, upload.single('image'), uploadImage);

// Delete image (admin only)
router.delete('/delete', authenticateToken, requireAdmin, deleteImage);

export default router;