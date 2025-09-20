import { authService } from './authService';

import { config } from '../config/config';

const API_BASE_URL = config.API_BASE_URL;

export interface Sweet {
  id?: string;
  _id?: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SweetResponse {
  message: string;
  sweet?: Sweet;
  sweets?: Sweet[];
}

export interface PurchaseRequest {
  quantity?: number;
}

export interface RestockRequest {
  quantity: number;
}

class SweetService {
  private getHeaders() {
    const token = authService.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  async getAllSweets(): Promise<Sweet[]> {
    const response = await fetch(`${API_BASE_URL}/sweets`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch sweets');
    }

    const data = await response.json();
    return data.sweets || [];
  }

  async searchSweets(params: {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Sweet[]> {
    const searchParams = new URLSearchParams();
    
    if (params.name) searchParams.append('name', params.name);
    if (params.category) searchParams.append('category', params.category);
    if (params.minPrice) searchParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString());

    const response = await fetch(`${API_BASE_URL}/sweets/search?${searchParams}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to search sweets');
    }

    const data = await response.json();
    return data.sweets || [];
  }

  async addSweet(sweet: Omit<Sweet, 'id' | '_id' | 'createdAt' | 'updatedAt'>): Promise<Sweet> {
    const response = await fetch(`${API_BASE_URL}/sweets`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(sweet),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add sweet');
    }

    const data = await response.json();
    return data.sweet;
  }

  async updateSweet(id: string, sweet: Partial<Sweet>): Promise<Sweet> {
    const response = await fetch(`${API_BASE_URL}/sweets/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(sweet),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update sweet');
    }

    const data = await response.json();
    return data.sweet;
  }

  async deleteSweet(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/sweets/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete sweet');
    }
  }

  async purchaseSweet(id: string, quantity: number = 1): Promise<{ sweet: Sweet; purchasedQuantity: number }> {
    const response = await fetch(`${API_BASE_URL}/sweets/${id}/purchase`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to purchase sweet');
    }

    const data = await response.json();
    return {
      sweet: data.sweet,
      purchasedQuantity: data.purchasedQuantity,
    };
  }

  async restockSweet(id: string, quantity: number): Promise<{ sweet: Sweet; restockedQuantity: number }> {
    const response = await fetch(`${API_BASE_URL}/sweets/${id}/restock`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to restock sweet');
    }

    const data = await response.json();
    return {
      sweet: data.sweet,
      restockedQuantity: data.restockedQuantity,
    };
  }

  async getCategories(): Promise<Array<{category: string, imageUrl: string}>> {
    const response = await fetch(`${API_BASE_URL}/sweets/categories`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch categories');
    }

    const data = await response.json();
    return data.categories;
  }
}

export const sweetService = new SweetService();