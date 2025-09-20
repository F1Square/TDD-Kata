import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, User, LoginRequest, RegisterRequest } from '../services/authService';
import { config } from '../config/config';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateAndRestoreSession = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        const token = authService.getToken();
        
        if (currentUser && token) {
          // Validate token with backend
          const validatedUser = await authService.validateToken();
          setUser(validatedUser);
        } else {
          // No stored user or token, ensure clean state
          authService.logout();
          setUser(null);
        }
      } catch (error) {
        // Token validation failed - clear everything and redirect to auth
        console.warn('Session validation failed, clearing auth state');
        authService.logout();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    validateAndRestoreSession();
  }, []);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.register(userData);
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};