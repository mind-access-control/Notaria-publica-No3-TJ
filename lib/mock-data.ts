export type EstatusSolicitud = 
  'ARMANDO_EXPEDIENTE' | 
  'EN_REVISION_INTERNA' | 
  'BORRADOR_PARA_REVISION_CLIENTE' | 
  'APROBADO_PARA_FIRMA' | 
  'LISTO_PARA_ENTREGA' |
  'COMPLETADO';

export interface DocumentoSolicitud {
  id: number;
  nombre: string;
  descripcion: string;
  subido: boolean;
  archivo?: string;
  fechaSubida?: string;
}

export interface HistorialEstatus {
  estatus: string;
  fecha: string;
  descripcion?: string;
}

export interface Solicitud {
  numeroSolicitud: string;
  tipoTramite: string;
  estatusActual: EstatusSolicitud;
  documentosRequeridos: DocumentoSolicitud[];
  historial: HistorialEstatus[];
  fechaCreacion: string;
  fechaUltimaActualizacion: string;
  cliente: {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
  };
  notario: {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
  };
  costoTotal: number;
  pagosRealizados: number;
  saldoPendiente: number;
}

export const mockSolicitud: Solicitud = {
  numeroSolicitud: 'NT3-2025-00123',
  tipoTramite: 'Testamento Público Abierto',
  estatusActual: 'ARMANDO_EXPEDIENTE',
  documentosRequeridos: [
    { 
      id: 1, 
      nombre: 'Identificación Oficial Vigente', 
      descripcion: 'INE, Pasaporte o Cédula Profesional', 
      subido: true,
      archivo: 'INE_123456789.pdf',
      fechaSubida: '2025-01-15'
    },
    { 
      id: 2, 
      nombre: 'Comprobante de Domicilio', 
      descripcion: 'Recibo de luz, agua o teléfono no mayor a 3 meses', 
      subido: false 
    },
    { 
      id: 3, 
      nombre: 'Lista de Bienes y Propiedades', 
      descripcion: 'Relación de los bienes a incluir en el testamento', 
      subido: false 
    },
    { 
      id: 4, 
      nombre: 'Acta de Nacimiento', 
      descripcion: 'Copia certificada del acta de nacimiento', 
      subido: false 
    },
    { 
      id: 5, 
      nombre: 'Comprobante de Estado Civil', 
      descripcion: 'Acta de matrimonio, divorcio o soltería según corresponda', 
      subido: false 
    }
  ],
  historial: [
    { 
      estatus: 'Solicitud Creada', 
      fecha: '2025-01-10',
      descripcion: 'Se ha creado la solicitud y se ha enviado la confirmación al cliente'
    },
    { 
      estatus: 'Documentos Iniciales Recibidos', 
      fecha: '2025-01-15',
      descripcion: 'Se recibió la identificación oficial del cliente'
    }
  ],
  fechaCreacion: '2025-01-10',
  fechaUltimaActualizacion: '2025-01-15',
  cliente: {
    id: 'user-1',
    nombre: 'Juan Carlos Pérez García',
    email: 'juan.perez@email.com',
    telefono: '+52 664 123 4567'
  },
  notario: {
    id: 'notario-1',
    nombre: 'Dra. María Elena Rodríguez',
    email: 'maria.rodriguez@notaria3tijuana.com',
    telefono: '+52 664 987 6543'
  },
  costoTotal: 15000,
  pagosRealizados: 5000,
  saldoPendiente: 10000
};

// Función para obtener una solicitud por número (simula API call)
export const getSolicitudByNumber = async (numeroSolicitud: string): Promise<Solicitud | null> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (numeroSolicitud === mockSolicitud.numeroSolicitud) {
    return mockSolicitud;
  }
  
  return null;
};

// Función para actualizar el estatus de una solicitud
export const updateSolicitudStatus = async (numeroSolicitud: string, nuevoEstatus: EstatusSolicitud): Promise<boolean> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (numeroSolicitud === mockSolicitud.numeroSolicitud) {
    mockSolicitud.estatusActual = nuevoEstatus;
    mockSolicitud.fechaUltimaActualizacion = new Date().toISOString().split('T')[0];
    mockSolicitud.historial.push({
      estatus: nuevoEstatus.replace(/_/g, ' '),
      fecha: new Date().toISOString().split('T')[0],
      descripcion: `El estatus ha sido actualizado a: ${nuevoEstatus.replace(/_/g, ' ')}`
    });
    return true;
  }
  
  return false;
};

// Función para subir un documento
export const uploadDocumento = async (numeroSolicitud: string, documentoId: number, archivo: File): Promise<boolean> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (numeroSolicitud === mockSolicitud.numeroSolicitud) {
    const documento = mockSolicitud.documentosRequeridos.find(doc => doc.id === documentoId);
    if (documento) {
      documento.subido = true;
      documento.archivo = archivo.name;
      documento.fechaSubida = new Date().toISOString().split('T')[0];
      return true;
    }
  }
  
  return false;
};

// Función para crear una nueva solicitud
export const createSolicitud = async (userId: string, tipoTramite: string): Promise<Solicitud | null> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generar número de solicitud único
  const numeroSolicitud = `NT3-2025-${String(Date.now()).slice(-5)}`;
  
  // Obtener información del usuario (en un sistema real esto vendría de la base de datos)
  const user = mockUsers.find(u => u.id === userId);
  if (!user) return null;
  
  // Obtener información del notario asignado
  const notario = mockUsers.find(u => u.role === 'notario');
  if (!notario) return null;
  
  // Configuración de documentos según el tipo de trámite
  const getDocumentosRequeridos = (tipo: string): DocumentoSolicitud[] => {
    const documentosBase = [
      { id: 1, nombre: 'Identificación Oficial Vigente', descripcion: 'INE, Pasaporte o Cédula Profesional', subido: false },
      { id: 2, nombre: 'Comprobante de Domicilio', descripcion: 'Recibo de luz, agua o teléfono no mayor a 3 meses', subido: false }
    ];
    
    switch (tipo) {
      case 'testamento':
        return [
          ...documentosBase,
          { id: 3, nombre: 'Acta de Nacimiento', descripcion: 'Copia certificada del acta de nacimiento', subido: false },
          { id: 4, nombre: 'Comprobante de Estado Civil', descripcion: 'Acta de matrimonio, divorcio o soltería según corresponda', subido: false },
          { id: 5, nombre: 'Lista de Bienes y Propiedades', descripcion: 'Relación de los bienes a incluir en el testamento', subido: false }
        ];
      case 'compraventa':
        return [
          ...documentosBase,
          { id: 3, nombre: 'Escritura de Propiedad', descripcion: 'Documento que acredite la propiedad del inmueble', subido: false },
          { id: 4, nombre: 'Avalúo del Inmueble', descripcion: 'Avalúo vigente del inmueble a vender', subido: false },
          { id: 5, nombre: 'Comprobante de Ingresos', descripcion: 'Comprobantes de ingresos de los últimos 3 meses', subido: false }
        ];
      case 'poder':
        return [
          ...documentosBase,
          { id: 3, nombre: 'Identificación del Apoderado', descripcion: 'INE del apoderado', subido: false },
          { id: 4, nombre: 'Acta de Nacimiento', descripcion: 'Copia certificada del acta de nacimiento', subido: false }
        ];
      default:
        return documentosBase;
    }
  };
  
  // Obtener costo según el tipo de trámite
  const getCosto = (tipo: string): number => {
    switch (tipo) {
      case 'testamento': return 15000;
      case 'compraventa': return 25000;
      case 'poder': return 8000;
      default: return 10000;
    }
  };
  
  const nuevaSolicitud: Solicitud = {
    numeroSolicitud,
    tipoTramite,
    estatusActual: 'ARMANDO_EXPEDIENTE',
    documentosRequeridos: getDocumentosRequeridos(tipoTramite),
    historial: [
      {
        estatus: 'Solicitud Creada',
        fecha: new Date().toISOString().split('T')[0],
        descripcion: `Se ha creado la solicitud ${numeroSolicitud} para ${tipoTramite}`
      }
    ],
    fechaCreacion: new Date().toISOString().split('T')[0],
    fechaUltimaActualizacion: new Date().toISOString().split('T')[0],
    cliente: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      telefono: user.telefono
    },
    notario: {
      id: notario.id,
      nombre: notario.nombre,
      email: notario.email,
      telefono: notario.telefono
    },
    costoTotal: getCosto(tipoTramite),
    pagosRealizados: 0,
    saldoPendiente: getCosto(tipoTramite)
  };
  
  // En un sistema real, aquí se guardaría en la base de datos
  // Por ahora, solo retornamos la solicitud creada
  
  return nuevaSolicitud;
};
