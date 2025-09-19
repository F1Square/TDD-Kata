import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import cloudinary from '../config/cloudinary';
import multer from 'multer';

// Configure multer for memory storage
const storage = multer.memoryStorage();
export const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export const uploadImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log('Image upload request received');
    
    if (!req.file) {
      console.log('No file in request');
      res.status(400).json({ message: 'No image file provided' });
      return;
    }

    console.log('File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Validate file size
    if (req.file.size > 5 * 1024 * 1024) {
      res.status(400).json({ message: 'File size too large. Maximum 5MB allowed.' });
      return;
    }

    // Convert buffer to base64
    const base64String = req.file.buffer.toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${base64String}`;

    console.log('Uploading to Cloudinary...');

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'sweet-shop',
      resource_type: 'image',
      transformation: [
        { width: 600, height: 400, crop: 'fill', quality: 'auto' }
      ]
    });

    console.log('Cloudinary upload successful:', result.secure_url);

    res.status(200).json({
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url,
      publicId: result.public_id
    });
  } catch (error: any) {
    console.error('Image upload error:', error);
    res.status(500).json({ 
      message: 'Failed to upload image',
      error: error.message 
    });
  }
};

export const deleteImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      res.status(400).json({ message: 'Public ID is required' });
      return;
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      res.status(200).json({ message: 'Image deleted successfully' });
    } else {
      res.status(400).json({ message: 'Failed to delete image' });
    }
  } catch (error) {
    console.error('Image delete error:', error);
    res.status(500).json({ message: 'Failed to delete image' });
  }
};