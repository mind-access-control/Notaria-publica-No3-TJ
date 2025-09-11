"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, AuthResponse, authenticateUser, getUserByToken, registerUser } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (userData: Omit<User, 'id' | 'fechaCreacion' | 'ultimoAcceso'>) => Promise<AuthResponse>;
  logout: () => void;
  canAccessSolicitud: (numeroSolicitud: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token guardado al cargar la página
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const userData = await getUserByToken(token);
          if (userData) {
            setUser(userData);
          } else {
            // Token inválido, limpiar
            localStorage.removeItem('authToken');
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authenticateUser(credentials);
      
      if (response.success && response.user && response.token) {
        setUser(response.user);
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userData', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Omit<User, 'id' | 'fechaCreacion' | 'ultimoAcceso'>): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await registerUser(userData);
      
      if (response.success && response.user && response.token) {
        setUser(response.user);
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userData', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  const canAccessSolicitud = (numeroSolicitud: string): boolean => {
    if (!user) return false;
    
    if (user.role === 'admin') return true;
    if (user.role === 'notario') {
      return user.solicitudesAsignadas?.includes(numeroSolicitud) || false;
    }
    if (user.role === 'cliente') {
      // En un sistema real, esto verificaría en la base de datos
      return true;
    }
    
    return false;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    canAccessSolicitud
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
