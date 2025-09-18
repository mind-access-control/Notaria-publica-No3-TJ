export type UserRole = "cliente" | "notario" | "abogado" | "cajero" | "admin";

export interface User {
  id: string;
  email: string;
  telefono: string;
  nombre: string;
  password: string; // En producción esto debería estar hasheado
  role: UserRole;
  activo: boolean;
  fechaCreacion: string;
  ultimoAcceso?: string;
  solicitudesAsignadas?: string[]; // Para notarios y abogados
  permisos?: string[]; // Permisos específicos del usuario
  especialidades?: string[]; // Para abogados y notarios
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

// Usuarios mock para el POC
export const mockUsers: User[] = [
  {
    id: "user-1",
    email: "cliente@notaria3tijuana.com",
    telefono: "+52 664 123 4567",
    nombre: "Juan Carlos Pérez García",
    password: "cliente123",
    role: "cliente",
    activo: true,
    fechaCreacion: "2025-01-01",
    ultimoAcceso: "2025-01-15",
  },
  {
    id: "notario-1",
    email: "maria.rodriguez@notaria3tijuana.com",
    telefono: "+52 664 987 6543",
    nombre: "Dra. María Elena Rodríguez",
    password: "notario123",
    role: "notario",
    activo: true,
    fechaCreacion: "2025-01-01",
    ultimoAcceso: "2025-01-15",
    solicitudesAsignadas: [
      "NT3-2025-00129",
      "NT3-2025-00130",
      "NT3-2025-00131",
      "NT3-2025-00132",
      "NT3-2025-00133",
    ],
  },
  {
    id: "abogado-1",
    email: "abogado@notaria3tijuana.com",
    telefono: "+52 664 555 1111",
    nombre: "Carlos López Martínez",
    password: "abogado123",
    role: "abogado",
    activo: true,
    fechaCreacion: "2025-01-01",
    ultimoAcceso: "2025-01-15",
    solicitudesAsignadas: [
      "NT3-2025-00129",
      "NT3-2025-00130",
      "NT3-2025-00131",
      "NT3-2025-00132",
      "NT3-2025-00133",
    ],
  },
  {
    id: "cajero-1",
    email: "cajero@notaria3tijuana.com",
    telefono: "+52 664 555 2222",
    nombre: "Ana García López",
    password: "cajero123",
    role: "cajero",
    activo: true,
    fechaCreacion: "2025-01-01",
    ultimoAcceso: "2025-01-15",
    permisos: [
      "gestionar_pagos",
      "ver_expedientes",
      "generar_reportes_financieros",
    ],
  },
  {
    id: "admin-1",
    email: "admin@notaria3tijuana.com",
    telefono: "+52 664 555 0000",
    nombre: "Administrador Sistema",
    password: "admin123",
    role: "admin",
    activo: true,
    fechaCreacion: "2025-01-01",
    ultimoAcceso: "2025-01-15",
    permisos: ["*"], // Todos los permisos
  },
];

// Función para autenticar usuario
export const authenticateUser = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const user = mockUsers.find(
    (u) =>
      u.email === credentials.email &&
      u.password === credentials.password &&
      u.activo
  );

  if (!user) {
    return {
      success: false,
      error: "Credenciales inválidas o usuario inactivo",
    };
  }

  // Actualizar último acceso
  user.ultimoAcceso = new Date().toISOString();

  // Generar token simple (en producción usar JWT)
  const token = btoa(JSON.stringify({ userId: user.id, role: user.role }));

  return {
    success: true,
    user,
    token,
  };
};

// Función para obtener usuario por token
export const getUserByToken = async (token: string): Promise<User | null> => {
  try {
    const decoded = JSON.parse(atob(token));
    const user = mockUsers.find((u) => u.id === decoded.userId && u.activo);
    return user || null;
  } catch {
    return null;
  }
};

// Función para verificar si un usuario puede acceder a una solicitud
export const canAccessSolicitud = (
  user: User,
  numeroSolicitud: string
): boolean => {
  if (user.role === "admin") {
    return true; // Admin puede ver todas las solicitudes
  }

  if (user.role === "notario") {
    return user.solicitudesAsignadas?.includes(numeroSolicitud) || false;
  }

  if (user.role === "cliente") {
    // En un sistema real, esto verificaría en la base de datos si el cliente es el dueño
    // Para el POC, verificamos si la solicitud mock pertenece al usuario
    if (numeroSolicitud === "NT3-2025-00123" && user.id === "user-1") {
      return true;
    }
    // Para solicitudes recién creadas, asumimos que pertenecen al usuario actual
    // En un sistema real, esto se verificaría consultando la base de datos
    return true;
  }

  return false;
};

// Función para obtener solicitudes de un usuario
export const getUserSolicitudes = (user: User): string[] => {
  // Importar el array de solicitudes dinámicamente para evitar dependencias circulares
  const { solicitudes } = require("./mock-data");

  if (user.role === "admin") {
    // Admin ve todas las solicitudes
    return solicitudes.map((s) => s.numeroSolicitud);
  }

  if (user.role === "notario") {
    return user.solicitudesAsignadas || [];
  }

  if (user.role === "cliente") {
    // Cliente ve solo sus propias solicitudes
    return solicitudes
      .filter((s) => s.cliente.id === user.id)
      .map((s) => s.numeroSolicitud);
  }

  return [];
};

// Función para registrar nuevo usuario
export const registerUser = async (
  userData: Omit<User, "id" | "fechaCreacion" | "ultimoAcceso">
): Promise<AuthResponse> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Verificar si el email ya existe
  const existingUser = mockUsers.find((u) => u.email === userData.email);
  if (existingUser) {
    return {
      success: false,
      error: "El email ya está registrado",
    };
  }

  // Crear nuevo usuario
  const newUser: User = {
    ...userData,
    id: `user-${Date.now()}`,
    fechaCreacion: new Date().toISOString(),
    solicitudesAsignadas: userData.role === "notario" ? [] : undefined,
  };

  // Agregar a la lista de usuarios (en producción esto iría a la base de datos)
  mockUsers.push(newUser);

  // Generar token
  const token = btoa(
    JSON.stringify({ userId: newUser.id, role: newUser.role })
  );

  return {
    success: true,
    user: newUser,
    token,
  };
};
