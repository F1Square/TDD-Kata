import { config } from '../config/config';

const API_BASE_URL = config.API_BASE_URL;

export const imageService = {
  // Upload image to Cloudinary via backend
  uploadImage: async (file: File): Promise<{ imageUrl: string; publicId: string }> => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/images/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload image');
    }

    const data = await response.json();
    return {
      imageUrl: data.imageUrl,
      publicId: data.publicId
    };
  },

  // Delete image from Cloudinary
  deleteImage: async (publicId: string): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/images/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ publicId })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete image');
    }
  }
};