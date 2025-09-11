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
    nombre: string;
    email: string;
    telefono: string;
  };
  notario: {
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
    nombre: 'Juan Carlos Pérez García',
    email: 'juan.perez@email.com',
    telefono: '+52 664 123 4567'
  },
  notario: {
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
