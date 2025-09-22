import { mockUsers } from "./auth";

export type EstatusSolicitud =
  | "ARMANDO_EXPEDIENTE"
  | "EN_REVISION_INTERNA"
  | "BORRADOR_PARA_REVISION_CLIENTE"
  | "APROBADO_PARA_FIRMA"
  | "LISTO_PARA_ENTREGA"
  | "COMPLETADO";

export interface DocumentoSolicitud {
  id: number;
  nombre: string;
  descripcion: string;
  subido: boolean;
  archivo?: string | File;
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

// Array para almacenar todas las solicitudes
export const solicitudes: Solicitud[] = [
  {
    numeroSolicitud: "NT3-2025-00123",
    tipoTramite: "Testamento Público Abierto",
    estatusActual: "ARMANDO_EXPEDIENTE",
    documentosRequeridos: [
      {
        id: 1,
        nombre: "Identificación Oficial Vigente",
        descripcion: "INE, Pasaporte o Cédula Profesional",
        subido: true,
        archivo: "2 Identificación Oficial.pdf",
        fechaSubida: "2025-01-15",
      },
      {
        id: 2,
        nombre: "Comprobante de Domicilio",
        descripcion: "Recibo de luz, agua o teléfono no mayor a 3 meses",
        subido: true,
        archivo: "4 Comprobante de domicilio Luz.pdf",
        fechaSubida: "2025-01-16",
      },
      {
        id: 3,
        nombre: "Lista de Bienes y Propiedades",
        descripcion: "Relación de los bienes a incluir en el testamento",
        subido: true,
        archivo: "lista de bienes y propiedades.pdf",
        fechaSubida: "2025-01-17",
      },
      {
        id: 4,
        nombre: "Acta de Nacimiento",
        descripcion: "Copia certificada del acta de nacimiento",
        subido: true,
        archivo: "1 Acta_de_Nacimiento_HEGJ860702HMCRNN07.pdf",
        fechaSubida: "2025-01-18",
      },
      {
        id: 5,
        nombre: "Comprobante de Estado Civil",
        descripcion:
          "Acta de matrimonio, divorcio o soltería según corresponda",
        subido: false,
      },
      {
        id: 6,
        nombre: "Comprobante de Pago",
        descripcion: "Comprobante de pago del trámite",
        subido: true,
        archivo: "12 EstadoDeCuentaBanorte.pdf",
        fechaSubida: "2025-01-19",
      },
    ],
    historial: [
      {
        estatus: "Solicitud Creada",
        fecha: "2025-01-10",
        descripcion:
          "Se ha creado la solicitud y se ha enviado la confirmación al cliente",
      },
      {
        estatus: "Documentos Iniciales Recibidos",
        fecha: "2025-01-15",
        descripcion: "Se recibió la identificación oficial del cliente",
      },
    ],
    fechaCreacion: "2025-01-10",
    fechaUltimaActualizacion: "2025-01-15",
    cliente: {
      id: "user-1",
      nombre: "Juan Carlos Pérez García",
      email: "juan.perez@email.com",
      telefono: "+52 664 123 4567",
    },
    notario: {
      id: "licenciado-1",
      nombre: "Carlos López Martínez",
      email: "carlos.lopez@notaria3tijuana.com",
      telefono: "+52 664 555 1111",
    },
    costoTotal: 15000,
    pagosRealizados: 5000,
    saldoPendiente: 10000,
  },
  // Solicitudes de ejemplo para el licenciado
  {
    numeroSolicitud: "NT3-2025-00124",
    tipoTramite: "Escritura de Compraventa",
    estatusActual: "EN_REVISION_INTERNA",
    documentosRequeridos: [
      {
        id: 1,
        nombre: "Identificación Oficial Vigente",
        descripcion: "INE, Pasaporte o Cédula Profesional",
        subido: true,
        archivo: "2 Identificación Oficial.pdf",
        fechaSubida: "2025-01-12",
      },
      {
        id: 2,
        nombre: "Comprobante de Domicilio",
        descripcion: "Recibo de luz, agua o teléfono no mayor a 3 meses",
        subido: true,
        archivo: "4 Comprobante de domicilio Luz.pdf",
        fechaSubida: "2025-01-13",
      },
      {
        id: 3,
        nombre: "Escritura de Propiedad",
        descripcion: "Documento que acredite la propiedad del inmueble",
        subido: true,
        archivo: "datos de beneficiarios.pdf",
        fechaSubida: "2025-01-14",
      },
      {
        id: 4,
        nombre: "Avalúo del Inmueble",
        descripcion: "Avalúo vigente del inmueble a vender",
        subido: true,
        archivo: "11 RFC.pdf",
        fechaSubida: "2025-01-15",
      },
      {
        id: 5,
        nombre: "Comprobante de Ingresos",
        descripcion: "Comprobantes de ingresos de los últimos 3 meses",
        subido: false,
      },
    ],
    historial: [
      {
        estatus: "Solicitud Creada",
        fecha: "2025-01-05",
        descripcion: "Se ha creado la solicitud para escritura de compraventa",
      },
      {
        estatus: "Documentos Iniciales Recibidos",
        fecha: "2025-01-12",
        descripcion: "Se recibieron los documentos iniciales del cliente",
      },
      {
        estatus: "En Revisión Interna",
        fecha: "2025-01-16",
        descripcion: "Los documentos están siendo revisados por el notario",
      },
    ],
    fechaCreacion: "2025-01-05",
    fechaUltimaActualizacion: "2025-01-16",
    cliente: {
      id: "user-2",
      nombre: "Ana María López Hernández",
      email: "ana.lopez@email.com",
      telefono: "+52 664 234 5678",
    },
    notario: {
      id: "licenciado-1",
      nombre: "Carlos López Martínez",
      email: "carlos.lopez@notaria3tijuana.com",
      telefono: "+52 664 555 1111",
    },
    costoTotal: 25000,
    pagosRealizados: 15000,
    saldoPendiente: 10000,
  },
  {
    numeroSolicitud: "NT3-2025-00125",
    tipoTramite: "Poder Notarial General",
    estatusActual: "BORRADOR_PARA_REVISION_CLIENTE",
    documentosRequeridos: [
      {
        id: 1,
        nombre: "Identificación Oficial Vigente",
        descripcion: "INE, Pasaporte o Cédula Profesional",
        subido: true,
        archivo: "3 Cédula profesional.pdf",
        fechaSubida: "2025-01-08",
      },
      {
        id: 2,
        nombre: "Comprobante de Domicilio",
        descripcion: "Recibo de luz, agua o teléfono no mayor a 3 meses",
        subido: true,
        archivo: "4 Comprobante de domicilio Luz.pdf",
        fechaSubida: "2025-01-09",
      },
      {
        id: 3,
        nombre: "Identificación del Apoderado",
        descripcion: "INE del apoderado",
        subido: true,
        archivo: "2 Identificación Oficial.pdf",
        fechaSubida: "2025-01-10",
      },
      {
        id: 4,
        nombre: "Acta de Nacimiento",
        descripcion: "Copia certificada del acta de nacimiento",
        subido: true,
        archivo: "1 Acta_de_Nacimiento_HEGJ860702HMCRNN07.pdf",
        fechaSubida: "2025-01-11",
      },
    ],
    historial: [
      {
        estatus: "Solicitud Creada",
        fecha: "2025-01-03",
        descripcion: "Se ha creado la solicitud para poder notarial",
      },
      {
        estatus: "Documentos Completos",
        fecha: "2025-01-11",
        descripcion: "Todos los documentos requeridos han sido recibidos",
      },
      {
        estatus: "Borrador para Revisión Cliente",
        fecha: "2025-01-17",
        descripcion:
          "El borrador del poder está listo para revisión del cliente",
      },
    ],
    fechaCreacion: "2025-01-03",
    fechaUltimaActualizacion: "2025-01-17",
    cliente: {
      id: "user-3",
      nombre: "Roberto Carlos Silva",
      email: "roberto.silva@email.com",
      telefono: "+52 664 345 6789",
    },
    notario: {
      id: "licenciado-1",
      nombre: "Carlos López Martínez",
      email: "carlos.lopez@notaria3tijuana.com",
      telefono: "+52 664 555 1111",
    },
    costoTotal: 8000,
    pagosRealizados: 8000,
    saldoPendiente: 0,
  },
  {
    numeroSolicitud: "NT3-2025-00126",
    tipoTramite: "Testamento Público Cerrado",
    estatusActual: "APROBADO_PARA_FIRMA",
    documentosRequeridos: [
      {
        id: 1,
        nombre: "Identificación Oficial Vigente",
        descripcion: "INE, Pasaporte o Cédula Profesional",
        subido: true,
        archivo: "2 Identificación Oficial.pdf",
        fechaSubida: "2024-12-20",
      },
      {
        id: 2,
        nombre: "Comprobante de Domicilio",
        descripcion: "Recibo de luz, agua o teléfono no mayor a 3 meses",
        subido: true,
        archivo: "4 Comprobante de domicilio Luz.pdf",
        fechaSubida: "2024-12-21",
      },
      {
        id: 3,
        nombre: "Acta de Nacimiento",
        descripcion: "Copia certificada del acta de nacimiento",
        subido: true,
        archivo: "1 Acta_de_Nacimiento_HEGJ860702HMCRNN07.pdf",
        fechaSubida: "2024-12-22",
      },
      {
        id: 4,
        nombre: "Comprobante de Estado Civil",
        descripcion:
          "Acta de matrimonio, divorcio o soltería según corresponda",
        subido: true,
        archivo: "CURP_HEGJ860702HMCRNN07.pdf",
        fechaSubida: "2024-12-23",
      },
      {
        id: 5,
        nombre: "Lista de Bienes y Propiedades",
        descripcion: "Relación de los bienes a incluir en el testamento",
        subido: true,
        archivo: "lista de bienes y propiedades.pdf",
        fechaSubida: "2024-12-24",
      },
    ],
    historial: [
      {
        estatus: "Solicitud Creada",
        fecha: "2024-12-15",
        descripcion: "Se ha creado la solicitud para testamento cerrado",
      },
      {
        estatus: "Documentos Completos",
        fecha: "2024-12-24",
        descripcion: "Todos los documentos han sido recibidos y revisados",
      },
      {
        estatus: "Revisión Interna Completada",
        fecha: "2025-01-10",
        descripcion: "La revisión interna ha sido completada exitosamente",
      },
      {
        estatus: "Aprobado para Firma",
        fecha: "2025-01-18",
        descripcion: "El testamento está listo para la firma del cliente",
      },
    ],
    fechaCreacion: "2024-12-15",
    fechaUltimaActualizacion: "2025-01-18",
    cliente: {
      id: "user-4",
      nombre: "Patricia Elena Morales",
      email: "patricia.morales@email.com",
      telefono: "+52 664 456 7890",
    },
    notario: {
      id: "licenciado-1",
      nombre: "Carlos López Martínez",
      email: "carlos.lopez@notaria3tijuana.com",
      telefono: "+52 664 555 1111",
    },
    costoTotal: 18000,
    pagosRealizados: 18000,
    saldoPendiente: 0,
  },
  {
    numeroSolicitud: "NT3-2025-00127",
    tipoTramite: "Escritura de Donación",
    estatusActual: "LISTO_PARA_ENTREGA",
    documentosRequeridos: [
      {
        id: 1,
        nombre: "Identificación Oficial Vigente",
        descripcion: "INE, Pasaporte o Cédula Profesional",
        subido: true,
        archivo: "2 Identificación Oficial.pdf",
        fechaSubida: "2024-11-10",
      },
      {
        id: 2,
        nombre: "Comprobante de Domicilio",
        descripcion: "Recibo de luz, agua o teléfono no mayor a 3 meses",
        subido: true,
        archivo: "4 Comprobante de domicilio Luz.pdf",
        fechaSubida: "2024-11-11",
      },
      {
        id: 3,
        nombre: "Escritura de Propiedad",
        descripcion: "Documento que acredite la propiedad del inmueble",
        subido: true,
        archivo: "datos de beneficiarios.pdf",
        fechaSubida: "2024-11-12",
      },
      {
        id: 4,
        nombre: "Avalúo del Inmueble",
        descripcion: "Avalúo vigente del inmueble a donar",
        subido: true,
        archivo: "11 RFC.pdf",
        fechaSubida: "2024-11-13",
      },
      {
        id: 5,
        nombre: "Comprobante de Ingresos",
        descripcion: "Comprobantes de ingresos de los últimos 3 meses",
        subido: true,
        archivo: "12 EstadoDeCuentaBanorte.pdf",
        fechaSubida: "2024-11-14",
      },
    ],
    historial: [
      {
        estatus: "Solicitud Creada",
        fecha: "2024-11-05",
        descripcion: "Se ha creado la solicitud para escritura de donación",
      },
      {
        estatus: "Documentos Completos",
        fecha: "2024-11-14",
        descripcion: "Todos los documentos han sido recibidos",
      },
      {
        estatus: "Revisión Interna Completada",
        fecha: "2024-12-01",
        descripcion: "La revisión interna ha sido completada",
      },
      {
        estatus: "Borrador Aprobado",
        fecha: "2024-12-15",
        descripcion: "El borrador ha sido aprobado por el cliente",
      },
      {
        estatus: "Firma Realizada",
        fecha: "2025-01-05",
        descripcion: "La escritura ha sido firmada por todas las partes",
      },
      {
        estatus: "Listo para Entrega",
        fecha: "2025-01-19",
        descripcion: "La escritura está lista para ser entregada al cliente",
      },
    ],
    fechaCreacion: "2024-11-05",
    fechaUltimaActualizacion: "2025-01-19",
    cliente: {
      id: "user-5",
      nombre: "Miguel Ángel Torres",
      email: "miguel.torres@email.com",
      telefono: "+52 664 567 8901",
    },
    notario: {
      id: "licenciado-1",
      nombre: "Carlos López Martínez",
      email: "carlos.lopez@notaria3tijuana.com",
      telefono: "+52 664 555 1111",
    },
    costoTotal: 20000,
    pagosRealizados: 20000,
    saldoPendiente: 0,
  },
  {
    numeroSolicitud: "NT3-2025-00128",
    tipoTramite: "Testamento Público Abierto",
    estatusActual: "EN_REVISION_INTERNA",
    documentosRequeridos: [
      {
        id: 1,
        nombre: "Identificación Oficial Vigente",
        descripcion: "INE, Pasaporte o Cédula Profesional",
        subido: true,
        archivo: "2 Identificación Oficial.pdf",
        fechaSubida: "2024-10-01",
      },
      {
        id: 2,
        nombre: "Comprobante de Domicilio",
        descripcion: "Recibo de luz, agua o teléfono no mayor a 3 meses",
        subido: true,
        archivo: "4 Comprobante de domicilio Luz.pdf",
        fechaSubida: "2024-10-02",
      },
      {
        id: 3,
        nombre: "Acta de Nacimiento",
        descripcion: "Copia certificada del acta de nacimiento",
        subido: true,
        archivo: "1 Acta_de_Nacimiento_HEGJ860702HMCRNN07.pdf",
        fechaSubida: "2024-10-03",
      },
      {
        id: 4,
        nombre: "Comprobante de Estado Civil",
        descripcion:
          "Acta de matrimonio, divorcio o soltería según corresponda",
        subido: true,
        archivo: "CURP_HEGJ860702HMCRNN07.pdf",
        fechaSubida: "2024-10-04",
      },
      {
        id: 5,
        nombre: "Lista de Bienes y Propiedades",
        descripcion: "Relación de los bienes a incluir en el testamento",
        subido: true,
        archivo: "lista de bienes y propiedades.pdf",
        fechaSubida: "2024-10-05",
      },
    ],
    historial: [
      {
        estatus: "Solicitud Creada",
        fecha: "2024-09-25",
        descripcion: "Se ha creado la solicitud para testamento abierto",
      },
      {
        estatus: "Documentos Completos",
        fecha: "2024-10-05",
        descripcion: "Todos los documentos han sido recibidos",
      },
      {
        estatus: "Revisión Interna Completada",
        fecha: "2024-10-20",
        descripcion: "La revisión interna ha sido completada",
      },
      {
        estatus: "Borrador Aprobado",
        fecha: "2024-11-05",
        descripcion: "El borrador ha sido aprobado por el cliente",
      },
      {
        estatus: "Firma Realizada",
        fecha: "2024-11-20",
        descripcion: "El testamento ha sido firmado",
      },
      {
        estatus: "Entregado al Cliente",
        fecha: "2024-12-01",
        descripcion: "El testamento ha sido entregado al cliente",
      },
      {
        estatus: "Completado",
        fecha: "2024-12-01",
        descripcion: "El trámite ha sido completado exitosamente",
      },
    ],
    fechaCreacion: "2024-09-25",
    fechaUltimaActualizacion: "2024-12-01",
    cliente: {
      id: "user-6",
      nombre: "Carmen Rosa Jiménez",
      email: "carmen.jimenez@email.com",
      telefono: "+52 664 678 9012",
    },
    notario: {
      id: "licenciado-1",
      nombre: "Carlos López Martínez",
      email: "carlos.lopez@notaria3tijuana.com",
      telefono: "+52 664 555 1111",
    },
    costoTotal: 15000,
    pagosRealizados: 15000,
    saldoPendiente: 0,
  },
  // Solicitudes asignadas al notario (Dra. María Elena Rodríguez)
  {
    numeroSolicitud: "NT3-2025-00129",
    tipoTramite: "Testamento Público Abierto",
    estatusActual: "EN_REVISION_INTERNA",
    documentosRequeridos: [
      {
        id: 1,
        nombre: "Identificación Oficial Vigente",
        descripcion: "INE, Pasaporte o Cédula Profesional",
        subido: true,
        archivo: "2 Identificación Oficial.pdf",
        fechaSubida: "2025-01-18",
      },
      {
        id: 2,
        nombre: "Comprobante de Domicilio",
        descripcion: "Recibo de luz, agua o teléfono no mayor a 3 meses",
        subido: true,
        archivo: "4 Comprobante de domicilio Luz.pdf",
        fechaSubida: "2025-01-19",
      },
      {
        id: 3,
        nombre: "Acta de Nacimiento",
        descripcion: "Copia certificada del acta de nacimiento",
        subido: true,
        archivo: "1 Acta_de_Nacimiento_HEGJ860702HMCRNN07.pdf",
        fechaSubida: "2025-01-20",
      },
      {
        id: 4,
        nombre: "Comprobante de Estado Civil",
        descripcion:
          "Acta de matrimonio, divorcio o soltería según corresponda",
        subido: false,
      },
      {
        id: 5,
        nombre: "Lista de Bienes y Propiedades",
        descripcion: "Relación de los bienes a incluir en el testamento",
        subido: true,
        archivo: "lista de bienes y propiedades.pdf",
        fechaSubida: "2025-01-19",
      },
      {
        id: 6,
        nombre: "Comprobante de Pago",
        descripcion: "Comprobante de pago del trámite",
        subido: true,
        archivo: "12 EstadoDeCuentaBanorte.pdf",
        fechaSubida: "2025-01-20",
      },
    ],
    historial: [
      {
        estatus: "Solicitud Creada",
        fecha: "2025-01-15",
        descripcion: "Se ha creado la solicitud para testamento abierto",
      },
      {
        estatus: "Documentos Iniciales Recibidos",
        fecha: "2025-01-20",
        descripcion: "Se recibieron los documentos iniciales del cliente",
      },
      {
        estatus: "En Revisión Interna",
        fecha: "2025-01-21",
        descripcion: "Los documentos están siendo revisados por el notario",
      },
    ],
    fechaCreacion: "2025-09-05", // Verde (0-14 días)
    fechaUltimaActualizacion: "2025-01-21",
    cliente: {
      id: "user-7",
      nombre: "Isabel Cristina Vega",
      email: "isabel.vega@email.com",
      telefono: "+52 664 789 0123",
    },
    notario: {
      id: "notario-1",
      nombre: "Dra. María Elena Rodríguez",
      email: "maria.rodriguez@notaria3tijuana.com",
      telefono: "+52 664 987 6543",
    },
    costoTotal: 15000,
    pagosRealizados: 10000,
    saldoPendiente: 5000,
  },
  {
    numeroSolicitud: "NT3-2025-00130",
    tipoTramite: "Escritura de Compraventa",
    estatusActual: "BORRADOR_PARA_REVISION_CLIENTE",
    documentosRequeridos: [
      {
        id: 1,
        nombre: "Identificación Oficial Vigente",
        descripcion: "INE, Pasaporte o Cédula Profesional",
        subido: true,
        archivo: "2 Identificación Oficial.pdf",
        fechaSubida: "2025-01-12",
      },
      {
        id: 2,
        nombre: "Comprobante de Domicilio",
        descripcion: "Recibo de luz, agua o teléfono no mayor a 3 meses",
        subido: true,
        archivo: "4 Comprobante de domicilio Luz.pdf",
        fechaSubida: "2025-01-13",
      },
      {
        id: 3,
        nombre: "Escritura de Propiedad",
        descripcion: "Documento que acredite la propiedad del inmueble",
        subido: true,
        archivo: "datos de beneficiarios.pdf",
        fechaSubida: "2025-01-14",
      },
      {
        id: 4,
        nombre: "Avalúo del Inmueble",
        descripcion: "Avalúo vigente del inmueble a vender",
        subido: true,
        archivo: "11 RFC.pdf",
        fechaSubida: "2025-01-15",
      },
      {
        id: 5,
        nombre: "Comprobante de Ingresos",
        descripcion: "Comprobantes de ingresos de los últimos 3 meses",
        subido: true,
        archivo: "12 EstadoDeCuentaBanorte.pdf",
        fechaSubida: "2025-01-16",
      },
    ],
    historial: [
      {
        estatus: "Solicitud Creada",
        fecha: "2025-01-10",
        descripcion: "Se ha creado la solicitud para escritura de compraventa",
      },
      {
        estatus: "Documentos Completos",
        fecha: "2025-01-16",
        descripcion: "Todos los documentos han sido recibidos",
      },
      {
        estatus: "Revisión Interna Completada",
        fecha: "2025-01-18",
        descripcion: "La revisión interna ha sido completada",
      },
      {
        estatus: "Borrador para Revisión Cliente",
        fecha: "2025-01-22",
        descripcion: "El borrador está listo para revisión del cliente",
      },
    ],
    fechaCreacion: "2025-09-08", // Verde (0-14 días)
    fechaUltimaActualizacion: "2025-01-22",
    cliente: {
      id: "user-8",
      nombre: "Fernando Alberto Mendoza",
      email: "fernando.mendoza@email.com",
      telefono: "+52 664 890 1234",
    },
    notario: {
      id: "notario-1",
      nombre: "Dra. María Elena Rodríguez",
      email: "maria.rodriguez@notaria3tijuana.com",
      telefono: "+52 664 987 6543",
    },
    costoTotal: 25000,
    pagosRealizados: 25000,
    saldoPendiente: 0,
  },
  {
    numeroSolicitud: "NT3-2025-00131",
    tipoTramite: "Poder Notarial General",
    estatusActual: "APROBADO_PARA_FIRMA",
    documentosRequeridos: [
      {
        id: 1,
        nombre: "Identificación Oficial Vigente",
        descripcion: "INE, Pasaporte o Cédula Profesional",
        subido: true,
        archivo: "2 Identificación Oficial.pdf",
        fechaSubida: "2025-01-08",
      },
      {
        id: 2,
        nombre: "Comprobante de Domicilio",
        descripcion: "Recibo de luz, agua o teléfono no mayor a 3 meses",
        subido: true,
        archivo: "4 Comprobante de domicilio Luz.pdf",
        fechaSubida: "2025-01-09",
      },
      {
        id: 3,
        nombre: "Identificación del Apoderado",
        descripcion: "INE del apoderado",
        subido: true,
        archivo: "2 Identificación Oficial.pdf",
        fechaSubida: "2025-01-10",
      },
      {
        id: 4,
        nombre: "Acta de Nacimiento",
        descripcion: "Copia certificada del acta de nacimiento",
        subido: true,
        archivo: "1 Acta_de_Nacimiento_HEGJ860702HMCRNN07.pdf",
        fechaSubida: "2025-01-11",
      },
    ],
    historial: [
      {
        estatus: "Solicitud Creada",
        fecha: "2025-01-05",
        descripcion: "Se ha creado la solicitud para poder notarial",
      },
      {
        estatus: "Documentos Completos",
        fecha: "2025-01-11",
        descripcion: "Todos los documentos han sido recibidos",
      },
      {
        estatus: "Revisión Interna Completada",
        fecha: "2025-01-15",
        descripcion: "La revisión interna ha sido completada",
      },
      {
        estatus: "Borrador Aprobado",
        fecha: "2025-01-20",
        descripcion: "El borrador ha sido aprobado por el cliente",
      },
      {
        estatus: "Aprobado para Firma",
        fecha: "2025-01-23",
        descripcion: "El poder está listo para la firma del cliente",
      },
    ],
    fechaCreacion: "2025-08-20", // Amarillo (15+ días)
    fechaUltimaActualizacion: "2025-01-23",
    cliente: {
      id: "user-9",
      nombre: "Sandra Patricia Ruiz",
      email: "sandra.ruiz@email.com",
      telefono: "+52 664 901 2345",
    },
    notario: {
      id: "notario-1",
      nombre: "Dra. María Elena Rodríguez",
      email: "maria.rodriguez@notaria3tijuana.com",
      telefono: "+52 664 987 6543",
    },
    costoTotal: 8000,
    pagosRealizados: 8000,
    saldoPendiente: 0,
  },
  {
    numeroSolicitud: "NT3-2025-00132",
    tipoTramite: "Testamento Público Cerrado",
    estatusActual: "LISTO_PARA_ENTREGA",
    documentosRequeridos: [
      {
        id: 1,
        nombre: "Identificación Oficial Vigente",
        descripcion: "INE, Pasaporte o Cédula Profesional",
        subido: true,
        archivo: "2 Identificación Oficial.pdf",
        fechaSubida: "2024-12-20",
      },
      {
        id: 2,
        nombre: "Comprobante de Domicilio",
        descripcion: "Recibo de luz, agua o teléfono no mayor a 3 meses",
        subido: true,
        archivo: "4 Comprobante de domicilio Luz.pdf",
        fechaSubida: "2024-12-21",
      },
      {
        id: 3,
        nombre: "Acta de Nacimiento",
        descripcion: "Copia certificada del acta de nacimiento",
        subido: true,
        archivo: "1 Acta_de_Nacimiento_HEGJ860702HMCRNN07.pdf",
        fechaSubida: "2024-12-22",
      },
      {
        id: 4,
        nombre: "Comprobante de Estado Civil",
        descripcion:
          "Acta de matrimonio, divorcio o soltería según corresponda",
        subido: true,
        archivo: "CURP_HEGJ860702HMCRNN07.pdf",
        fechaSubida: "2024-12-23",
      },
      {
        id: 5,
        nombre: "Lista de Bienes y Propiedades",
        descripcion: "Relación de los bienes a incluir en el testamento",
        subido: true,
        archivo: "lista de bienes y propiedades.pdf",
        fechaSubida: "2024-12-24",
      },
    ],
    historial: [
      {
        estatus: "Solicitud Creada",
        fecha: "2024-12-15",
        descripcion: "Se ha creado la solicitud para testamento cerrado",
      },
      {
        estatus: "Documentos Completos",
        fecha: "2024-12-24",
        descripcion: "Todos los documentos han sido recibidos",
      },
      {
        estatus: "Revisión Interna Completada",
        fecha: "2025-01-05",
        descripcion: "La revisión interna ha sido completada",
      },
      {
        estatus: "Borrador Aprobado",
        fecha: "2025-01-10",
        descripcion: "El borrador ha sido aprobado por el cliente",
      },
      {
        estatus: "Firma Realizada",
        fecha: "2025-01-15",
        descripcion: "El testamento ha sido firmado",
      },
      {
        estatus: "Listo para Entrega",
        fecha: "2025-01-24",
        descripcion: "El testamento está listo para ser entregado al cliente",
      },
    ],
    fechaCreacion: "2025-08-15", // Amarillo (15+ días)
    fechaUltimaActualizacion: "2025-01-24",
    cliente: {
      id: "user-10",
      nombre: "Ricardo José Herrera",
      email: "ricardo.herrera@email.com",
      telefono: "+52 664 012 3456",
    },
    notario: {
      id: "notario-1",
      nombre: "Dra. María Elena Rodríguez",
      email: "maria.rodriguez@notaria3tijuana.com",
      telefono: "+52 664 987 6543",
    },
    costoTotal: 18000,
    pagosRealizados: 18000,
    saldoPendiente: 0,
  },
  {
    numeroSolicitud: "NT3-2025-00133",
    tipoTramite: "Escritura de Compraventa",
    estatusActual: "EN_REVISION_INTERNA",
    documentosRequeridos: [
      {
        id: 1,
        nombre: "Identificación Oficial Vigente",
        descripcion: "INE, Pasaporte o Cédula Profesional",
        subido: true,
        archivo: "2 Identificación Oficial.pdf",
        fechaSubida: "2024-11-10",
      },
      {
        id: 2,
        nombre: "Comprobante de Domicilio",
        descripcion: "Recibo de luz, agua o teléfono no mayor a 3 meses",
        subido: true,
        archivo: "4 Comprobante de domicilio Luz.pdf",
        fechaSubida: "2024-11-11",
      },
      {
        id: 3,
        nombre: "Escritura de Propiedad",
        descripcion: "Documento que acredite la propiedad del inmueble",
        subido: true,
        archivo: "datos de beneficiarios.pdf",
        fechaSubida: "2024-11-12",
      },
      {
        id: 4,
        nombre: "Avalúo del Inmueble",
        descripcion: "Avalúo vigente del inmueble a donar",
        subido: true,
        archivo: "11 RFC.pdf",
        fechaSubida: "2024-11-13",
      },
      {
        id: 5,
        nombre: "Comprobante de Ingresos",
        descripcion: "Comprobantes de ingresos de los últimos 3 meses",
        subido: true,
        archivo: "12 EstadoDeCuentaBanorte.pdf",
        fechaSubida: "2024-11-14",
      },
    ],
    historial: [
      {
        estatus: "Solicitud Creada",
        fecha: "2024-11-05",
        descripcion: "Se ha creado la solicitud para escritura de donación",
      },
      {
        estatus: "Documentos Completos",
        fecha: "2024-11-14",
        descripcion: "Todos los documentos han sido recibidos",
      },
      {
        estatus: "Revisión Interna Completada",
        fecha: "2024-12-01",
        descripcion: "La revisión interna ha sido completada",
      },
      {
        estatus: "Borrador Aprobado",
        fecha: "2024-12-15",
        descripcion: "El borrador ha sido aprobado por el cliente",
      },
      {
        estatus: "Firma Realizada",
        fecha: "2025-01-05",
        descripcion: "La escritura ha sido firmada por todas las partes",
      },
      {
        estatus: "Entregado al Cliente",
        fecha: "2025-01-20",
        descripcion: "La escritura ha sido entregada al cliente",
      },
      {
        estatus: "Completado",
        fecha: "2025-01-25",
        descripcion: "El trámite ha sido completado exitosamente",
      },
    ],
    fechaCreacion: "2025-07-25", // Rojo (30+ días)
    fechaUltimaActualizacion: "2025-01-25",
    cliente: {
      id: "user-11",
      nombre: "Jonathan Ruben Hernandez Gonzalez",
      email: "jon@jon.com",
      telefono: "+52 556 976 1320",
    },
    notario: {
      id: "notario-1",
      nombre: "Dra. María Elena Rodríguez",
      email: "maria.rodriguez@notaria3tijuana.com",
      telefono: "+52 664 987 6543",
    },
    costoTotal: 20000,
    pagosRealizados: 20000,
    saldoPendiente: 0,
  },
];

// Mantener compatibilidad con el código existente
export const mockSolicitud = solicitudes[0];

// Función para obtener una solicitud por número (simula API call)
export const getSolicitudByNumber = async (
  numeroSolicitud: string
): Promise<Solicitud | null> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const solicitud = solicitudes.find(
    (s) => s.numeroSolicitud === numeroSolicitud
  );
  return solicitud || null;
};

// Función para actualizar el estatus de una solicitud
export const updateSolicitudStatus = async (
  numeroSolicitud: string,
  nuevoEstatus: EstatusSolicitud
): Promise<boolean> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 500));

  const solicitud = solicitudes.find(
    (s) => s.numeroSolicitud === numeroSolicitud
  );
  if (solicitud) {
    solicitud.estatusActual = nuevoEstatus;
    solicitud.fechaUltimaActualizacion = new Date().toISOString().split("T")[0];
    solicitud.historial.push({
      estatus: nuevoEstatus.replace(/_/g, " "),
      fecha: new Date().toISOString().split("T")[0],
      descripcion: `El estatus ha sido actualizado a: ${nuevoEstatus.replace(
        /_/g,
        " "
      )}`,
    });
    return true;
  }

  return false;
};

// Función para subir un documento
export const uploadDocumento = async (
  numeroSolicitud: string,
  documentoId: number,
  archivo: File
): Promise<boolean> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 800));

  const solicitud = solicitudes.find(
    (s) => s.numeroSolicitud === numeroSolicitud
  );
  if (solicitud) {
    const documento = solicitud.documentosRequeridos.find(
      (doc) => doc.id === documentoId
    );
    if (documento) {
      documento.subido = true;
      documento.archivo = archivo; // Guardar el archivo real
      documento.fechaSubida = new Date().toISOString().split("T")[0];
      return true;
    }
  }

  return false;
};

// Función para crear una nueva solicitud
export const createSolicitud = async (
  userId: string,
  tipoTramite: string
): Promise<Solicitud | null> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Generar número de solicitud único
  const numeroSolicitud = `NT3-2025-${String(Date.now()).slice(-5)}`;

  // Obtener información del usuario (en un sistema real esto vendría de la base de datos)
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) return null;

  // Obtener información del notario asignado
  const notario = mockUsers.find((u) => u.role === "notario");
  if (!notario) return null;

  // Configuración de documentos según el tipo de trámite
  const getDocumentosRequeridos = (tipo: string): DocumentoSolicitud[] => {
    const documentosBase = [
      {
        id: 1,
        nombre: "Identificación Oficial Vigente",
        descripcion: "INE, Pasaporte o Cédula Profesional",
        subido: false,
      },
      {
        id: 2,
        nombre: "Comprobante de Domicilio",
        descripcion: "Recibo de luz, agua o teléfono no mayor a 3 meses",
        subido: false,
      },
    ];

    switch (tipo) {
      case "testamento":
        return [
          ...documentosBase,
          {
            id: 3,
            nombre: "Acta de Nacimiento",
            descripcion: "Copia certificada del acta de nacimiento",
            subido: false,
          },
          {
            id: 4,
            nombre: "Comprobante de Estado Civil",
            descripcion:
              "Acta de matrimonio, divorcio o soltería según corresponda",
            subido: false,
          },
          {
            id: 5,
            nombre: "Lista de Bienes y Propiedades",
            descripcion: "Relación de los bienes a incluir en el testamento",
            subido: false,
          },
        ];
      case "compraventa":
        return [
          ...documentosBase,
          {
            id: 3,
            nombre: "Escritura de Propiedad",
            descripcion: "Documento que acredite la propiedad del inmueble",
            subido: false,
          },
          {
            id: 4,
            nombre: "Avalúo del Inmueble",
            descripcion: "Avalúo vigente del inmueble a vender",
            subido: false,
          },
          {
            id: 5,
            nombre: "Comprobante de Ingresos",
            descripcion: "Comprobantes de ingresos de los últimos 3 meses",
            subido: false,
          },
        ];
      case "poder":
        return [
          ...documentosBase,
          {
            id: 3,
            nombre: "Identificación del Apoderado",
            descripcion: "INE del apoderado",
            subido: false,
          },
          {
            id: 4,
            nombre: "Acta de Nacimiento",
            descripcion: "Copia certificada del acta de nacimiento",
            subido: false,
          },
        ];
      default:
        return documentosBase;
    }
  };

  // Obtener costo según el tipo de trámite
  const getCosto = (tipo: string): number => {
    switch (tipo) {
      case "testamento":
        return 15000;
      case "compraventa":
        return 25000;
      case "poder":
        return 8000;
      default:
        return 10000;
    }
  };

  const nuevaSolicitud: Solicitud = {
    numeroSolicitud,
    tipoTramite,
    estatusActual: "ARMANDO_EXPEDIENTE",
    documentosRequeridos: getDocumentosRequeridos(tipoTramite),
    historial: [
      {
        estatus: "Solicitud Creada",
        fecha: new Date().toISOString().split("T")[0],
        descripcion: `Se ha creado la solicitud ${numeroSolicitud} para ${tipoTramite}`,
      },
    ],
    fechaCreacion: new Date().toISOString().split("T")[0],
    fechaUltimaActualizacion: new Date().toISOString().split("T")[0],
    cliente: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      telefono: user.telefono,
    },
    notario: {
      id: notario.id,
      nombre: notario.nombre,
      email: notario.email,
      telefono: notario.telefono,
    },
    costoTotal: getCosto(tipoTramite),
    pagosRealizados: 0,
    saldoPendiente: getCosto(tipoTramite),
  };

  // Agregar la nueva solicitud al array
  solicitudes.push(nuevaSolicitud);

  console.log("📝 Nueva solicitud creada:", nuevaSolicitud.numeroSolicitud);
  console.log("📊 Total de solicitudes:", solicitudes.length);

  return nuevaSolicitud;
};

// Función para obtener solicitudes de un usuario (objetos completos)
export const getUserSolicitudes = async (
  userId: string
): Promise<Solicitud[]> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Obtener el usuario para determinar su rol
  const user = mockUsers.find((u) => u.id === userId);

  let userSolicitudes: Solicitud[] = [];

  if (user?.role === "cliente") {
    // Para clientes, devolver sus propias solicitudes
    userSolicitudes = solicitudes.filter((s) => s.cliente.id === userId);
  } else if (user?.role === "licenciado" || user?.role === "notario") {
    // Para licenciados/notarios, devolver las solicitudes asignadas a ellos
    userSolicitudes = solicitudes.filter((s) => s.notario.id === userId);
  } else if (user?.role === "admin") {
    // Para admin, devolver todas las solicitudes
    userSolicitudes = solicitudes;
  }

  console.log(
    "🔍 Buscando solicitudes para usuario:",
    userId,
    "rol:",
    user?.role
  );
  console.log("📊 Total de solicitudes en el sistema:", solicitudes.length);
  console.log("📋 Solicitudes del usuario:", userSolicitudes.length);

  return userSolicitudes;
};
