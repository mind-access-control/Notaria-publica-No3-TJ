"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  LoginCredentials,
  AuthResponse,
  authenticateUser,
  getUserByToken,
  registerUser,
} from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    credentials: LoginCredentials,
    redirectTo?: string
  ) => Promise<AuthResponse>;
  register: (
    userData: Omit<User, "id" | "fechaCreacion" | "ultimoAcceso">
  ) => Promise<AuthResponse>;
  logout: () => void;
  canAccessSolicitud: (numeroSolicitud: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
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
        const token = localStorage.getItem("authToken");
        console.log("AuthContext - Token encontrado:", !!token);
        if (token) {
          const userData = await getUserByToken(token);
          console.log("AuthContext - Datos de usuario obtenidos:", !!userData);
          if (userData) {
            setUser(userData);
          } else {
            // Token inválido, limpiar
            console.log("AuthContext - Token inválido, limpiando");
            localStorage.removeItem("authToken");
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        localStorage.removeItem("authToken");
      } finally {
        setIsLoading(false);
        console.log("AuthContext - Carga completada");
      }
    };

    checkAuth();
  }, []);

  const login = async (
    credentials: LoginCredentials,
    redirectTo?: string
  ): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authenticateUser(credentials);

      if (response.success && response.user && response.token) {
        setUser(response.user);
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("userData", JSON.stringify(response.user));

        // Redirigir después del login exitoso
        if (redirectTo) {
          // Usar setTimeout para asegurar que el estado se actualice antes de redirigir
          setTimeout(() => {
            window.location.href = redirectTo;
          }, 100);
        } else {
          // Redirección por defecto según el rol del usuario
          setTimeout(() => {
            if (response.user?.role === "admin") {
              window.location.href = "/admin";
            } else if (
              response.user?.role === "notario" ||
              response.user?.role === "abogado"
            ) {
              window.location.href = "/abogado";
            } else {
              window.location.href = "/mi-cuenta";
            }
          }, 100);
        }
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: "Error interno del servidor",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    userData: Omit<User, "id" | "fechaCreacion" | "ultimoAcceso">
  ): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await registerUser(userData);

      if (response.success && response.user && response.token) {
        setUser(response.user);
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("userData", JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: "Error interno del servidor",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  };

  const canAccessSolicitud = (numeroSolicitud: string): boolean => {
    if (!user) return false;

    // Para admin, permitir acceso a todas las solicitudes
    if (user.role === "admin") return true;

    // Para notarios y abogados, permitir acceso a todas las solicitudes asignadas
    if (user.role === "notario" || user.role === "abogado") {
      return true; // Temporalmente permitir acceso a todas las solicitudes
    }

    // Para clientes, permitir acceso a sus propias solicitudes
    if (user.role === "cliente") {
      return true; // En un sistema real, esto verificaría en la base de datos
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
    canAccessSolicitud,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
