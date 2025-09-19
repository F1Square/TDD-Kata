import { config } from '../config/config';

const API_BASE_URL = config.API_BASE_URL;

// Types matching backend
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

class AuthService {
  private token: string | null = localStorage.getItem('auth_token');

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return this.token;
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('current_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  setCurrentUser(user: User) {
    localStorage.setItem('current_user', JSON.stringify(user));
  }

  removeCurrentUser() {
    localStorage.removeItem('current_user');
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data: AuthResponse = await response.json();
    this.setToken(data.token);
    this.setCurrentUser(data.user);
    return data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data: AuthResponse = await response.json();
    this.setToken(data.token);
    this.setCurrentUser(data.user);
    return data;
  }

  logout() {
    this.removeToken();
    this.removeCurrentUser();
  }
}

export const authService = new AuthService();