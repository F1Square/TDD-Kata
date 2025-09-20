import { config } from '../config/config';
import { authService } from './authService';

const API_BASE_URL = config.API_BASE_URL;

export interface OrderItem {
  sweetId: string;
  sweetName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  orderDate: string;
  customerEmail: string;
  customerUsername: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderStats {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
}

class OrderService {
  private getAuthHeader() {
    const token = authService.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async getAllOrders(): Promise<Order[]> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'GET',
      headers: this.getAuthHeader()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch orders');
    }

    const data = await response.json();
    return data.orders;
  }

  async getUserOrders(): Promise<Order[]> {
    const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
      method: 'GET',
      headers: this.getAuthHeader()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch user orders');
    }

    const data = await response.json();
    return data.orders;
  }

  async getOrderById(id: string): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'GET',
      headers: this.getAuthHeader()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch order');
    }

    const data = await response.json();
    return data.order;
  }

  async updateOrderStatus(id: string, status: 'pending' | 'completed' | 'cancelled'): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: this.getAuthHeader(),
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update order status');
    }

    const data = await response.json();
    return data.order;
  }

  async getOrderStats(): Promise<{ stats: OrderStats; recentOrders: Order[] }> {
    const response = await fetch(`${API_BASE_URL}/orders/stats`, {
      method: 'GET',
      headers: this.getAuthHeader()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch order statistics');
    }

    return response.json();
  }
}

export const orderService = new OrderService();