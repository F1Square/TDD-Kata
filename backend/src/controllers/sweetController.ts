import { Response } from 'express';
import { Sweet } from '../models/Sweet';
import { Order } from '../models/Order';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { getDummyImageUrl, getAvailableCategories } from '../utils/dummyImages';

export const addSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, category, price, quantity, description } = req.body;

    // Validate input
    if (!name || !category || price === undefined || quantity === undefined) {
      res.status(400).json({ message: 'Name, category, price, and quantity are required' });
      return;
    }

    if (price < 0 || quantity < 0) {
      res.status(400).json({ message: 'Price and quantity must be non-negative' });
      return;
    }

    // Generate dummy image based on category
    const imageUrl = getDummyImageUrl(category);

    // Create sweet
    const sweet = new Sweet({
      name,
      category,
      price,
      quantity,
      description,
      imageUrl
    });

    await sweet.save();

    res.status(201).json({
      message: 'Sweet added successfully',
      sweet
    });
  } catch (error) {
    console.error('Add sweet error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllSweets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sweets = await Sweet.find().sort({ createdAt: -1 });
    res.status(200).json({ sweets });
  } catch (error) {
    console.error('Get sweets error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const searchSweets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    
    // Build search filter
    const filter: any = {};
    
    if (name) {
      filter.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    }
    
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sweets = await Sweet.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ sweets });
  } catch (error) {
    console.error('Search sweets error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, category, price, quantity, description } = req.body;

    // Validate input
    if (price !== undefined && price < 0) {
      res.status(400).json({ message: 'Price must be non-negative' });
      return;
    }

    if (quantity !== undefined && quantity < 0) {
      res.status(400).json({ message: 'Quantity must be non-negative' });
      return;
    }

    // Generate new dummy image if category is being updated
    const updateData: any = { name, category, price, quantity, description };
    if (category) {
      updateData.imageUrl = getDummyImageUrl(category);
    }

    const sweet = await Sweet.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!sweet) {
      res.status(404).json({ message: 'Sweet not found' });
      return;
    }

    res.status(200).json({
      message: 'Sweet updated successfully',
      sweet
    });
  } catch (error) {
    console.error('Update sweet error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const sweet = await Sweet.findByIdAndDelete(id);

    if (!sweet) {
      res.status(404).json({ message: 'Sweet not found' });
      return;
    }

    res.status(200).json({ message: 'Sweet deleted successfully' });
  } catch (error) {
    console.error('Delete sweet error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const purchaseSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity = 1 } = req.body;

    if (quantity <= 0) {
      res.status(400).json({ message: 'Quantity must be positive' });
      return;
    }

    const sweet = await Sweet.findById(id);
    if (!sweet) {
      res.status(404).json({ message: 'Sweet not found' });
      return;
    }

    if (sweet.quantity < quantity) {
      res.status(400).json({ 
        message: 'Insufficient stock',
        available: sweet.quantity
      });
      return;
    }

    // Get user info for the order
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Calculate total price
    const totalPrice = sweet.price * quantity;

    // Create order record
    const order = new Order({
      userId: req.userId,
      items: [{
        sweetId: sweet._id,
        sweetName: sweet.name,
        quantity,
        price: sweet.price,
        totalPrice
      }],
      totalAmount: totalPrice,
      status: 'completed',
      customerEmail: user.email,
      customerUsername: user.username
    });

    await order.save();

    // Decrease quantity
    sweet.quantity -= quantity;
    await sweet.save();

    res.status(200).json({
      message: 'Purchase successful',
      sweet,
      purchasedQuantity: quantity,
      order: {
        id: order._id,
        totalAmount: order.totalAmount,
        orderDate: order.orderDate
      }
    });
  } catch (error) {
    console.error('Purchase sweet error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const restockSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      res.status(400).json({ message: 'Quantity must be positive' });
      return;
    }

    const sweet = await Sweet.findById(id);

    if (!sweet) {
      res.status(404).json({ message: 'Sweet not found' });
      return;
    }

    // Increase quantity
    sweet.quantity += quantity;
    await sweet.save();

    res.status(200).json({
      message: 'Restock successful',
      sweet,
      restockedQuantity: quantity
    });
  } catch (error) {
    console.error('Restock sweet error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get available categories with dummy images
export const getCategories = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const categories = getAvailableCategories();
    res.status(200).json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};