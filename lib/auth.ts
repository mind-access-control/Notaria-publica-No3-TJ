export type UserRole = 'cliente' | 'notario' | 'admin';

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
  solicitudesAsignadas?: string[]; // Para notarios
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
    id: 'user-1',
    email: 'juan.perez@email.com',
    telefono: '+52 664 123 4567',
    nombre: 'Juan Carlos Pérez García',
    password: 'cliente123',
    role: 'cliente',
    activo: true,
    fechaCreacion: '2025-01-01',
    ultimoAcceso: '2025-01-15'
  },
  {
    id: 'notario-1',
    email: 'maria.rodriguez@notaria3tijuana.com',
    telefono: '+52 664 987 6543',
    nombre: 'Dra. María Elena Rodríguez',
    password: 'notario123',
    role: 'notario',
    activo: true,
    fechaCreacion: '2025-01-01',
    ultimoAcceso: '2025-01-15',
    solicitudesAsignadas: ['NT3-2025-00123']
  },
  {
    id: 'admin-1',
    email: 'admin@notaria3tijuana.com',
    telefono: '+52 664 555 0000',
    nombre: 'Administrador Sistema',
    password: 'admin123',
    role: 'admin',
    activo: true,
    fechaCreacion: '2025-01-01',
    ultimoAcceso: '2025-01-15'
  }
];

// Función para autenticar usuario
export const authenticateUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = mockUsers.find(
    u => u.email === credentials.email && 
         u.password === credentials.password && 
         u.activo
  );
  
  if (!user) {
    return {
      success: false,
      error: 'Credenciales inválidas o usuario inactivo'
    };
  }
  
  // Actualizar último acceso
  user.ultimoAcceso = new Date().toISOString();
  
  // Generar token simple (en producción usar JWT)
  const token = btoa(JSON.stringify({ userId: user.id, role: user.role }));
  
  return {
    success: true,
    user,
    token
  };
};

// Función para obtener usuario por token
export const getUserByToken = async (token: string): Promise<User | null> => {
  try {
    const decoded = JSON.parse(atob(token));
    const user = mockUsers.find(u => u.id === decoded.userId && u.activo);
    return user || null;
  } catch {
    return null;
  }
};

// Función para verificar si un usuario puede acceder a una solicitud
export const canAccessSolicitud = (user: User, numeroSolicitud: string): boolean => {
  if (user.role === 'admin') {
    return true; // Admin puede ver todas las solicitudes
  }
  
  if (user.role === 'notario') {
    return user.solicitudesAsignadas?.includes(numeroSolicitud) || false;
  }
  
  if (user.role === 'cliente') {
    // En un sistema real, esto verificaría en la base de datos si el cliente es el dueño
    // Para el POC, verificamos si la solicitud mock pertenece al usuario
    if (numeroSolicitud === 'NT3-2025-00123' && user.id === 'user-1') {
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
  if (user.role === 'admin') {
    // Admin ve todas las solicitudes
    return ['NT3-2025-00123', 'NT3-2025-00124', 'NT3-2025-00125'];
  }
  
  if (user.role === 'notario') {
    return user.solicitudesAsignadas || [];
  }
  
  if (user.role === 'cliente') {
    // En un sistema real, esto consultaría la base de datos
    return ['NT3-2025-00123'];
  }
  
  return [];
};

// Función para registrar nuevo usuario
export const registerUser = async (userData: Omit<User, 'id' | 'fechaCreacion' | 'ultimoAcceso'>): Promise<AuthResponse> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Verificar si el email ya existe
  const existingUser = mockUsers.find(u => u.email === userData.email);
  if (existingUser) {
    return {
      success: false,
      error: 'El email ya está registrado'
    };
  }
  
  // Crear nuevo usuario
  const newUser: User = {
    ...userData,
    id: `user-${Date.now()}`,
    fechaCreacion: new Date().toISOString(),
    solicitudesAsignadas: userData.role === 'notario' ? [] : undefined
  };
  
  // Agregar a la lista de usuarios (en producción esto iría a la base de datos)
  mockUsers.push(newUser);
  
  // Generar token
  const token = btoa(JSON.stringify({ userId: newUser.id, role: newUser.role }));
  
  return {
    success: true,
    user: newUser,
    token
  };
};
