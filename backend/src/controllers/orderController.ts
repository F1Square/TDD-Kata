import { Response } from 'express';
import { Order } from '../models/Order';
import { AuthRequest } from '../middleware/auth';

export const getAllOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate('userId', 'username email')
      .populate('items.sweetId', 'name category')
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate('items.sweetId', 'name category')
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate('userId', 'username email')
      .populate('items.sweetId', 'name category');

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'completed', 'cancelled'].includes(status)) {
      res.status(400).json({ message: 'Invalid status' });
      return;
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('userId', 'username email')
     .populate('items.sweetId', 'name category');

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.status(200).json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getOrderStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ status: 'completed' });
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

    const totalRevenue = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const recentOrders = await Order.find()
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      stats: {
        totalOrders,
        completedOrders,
        pendingOrders,
        cancelledOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      },
      recentOrders
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};