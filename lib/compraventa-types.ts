// Tipos específicos para el sistema de compraventa de bienes inmuebles

export interface Persona {
  id?: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  lugarNacimiento: string;
  estadoCivil: "soltero" | "casado" | "divorciado" | "viudo" | "union_libre";
  nacionalidad: string;
  curp: string;
  rfc: string;
  telefono: string;
  email: string;
  domicilio: Domicilio;
  ocupacion: string;
  tipoIdentificacion: "INE" | "Pasaporte" | "Cedula_Profesional";
  numeroIdentificacion: string;
  esComprador: boolean;
  esVendedor: boolean;
}

export interface Domicilio {
  calle: string;
  numeroExterior: string;
  numeroInterior?: string;
  colonia: string;
  municipio: string;
  estado: string;
  codigoPostal: string;
  pais: string;
}

export interface Inmueble {
  id?: string;
  tipo: "casa" | "departamento" | "terreno" | "local_comercial" | "oficina";
  superficie: number;
  superficieUnidad: "m2" | "hectareas";
  ubicacion: Domicilio;
  descripcion: string;
  numeroEscritura?: string;
  fechaEscritura?: string;
  notarioEscritura?: string;
  numeroNotario?: string;
  valorAvaluo: number;
  valorVenta: number;
  tieneGravamen: boolean;
  gravamenes: Gravamen[];
}

export interface Gravamen {
  tipo: "hipoteca" | "embargo" | "prohibicion" | "otro";
  descripcion: string;
  monto?: number;
  acreedor?: string;
  fecha?: string;
}

export interface DocumentoCompraventa {
  id: string;
  tipo: DocumentoTipo;
  nombre: string;
  archivo?: File;
  url?: string;
  fechaSubida: string;
  estado: "pendiente" | "subido" | "validado" | "rechazado";
  datosExtraidos?: DatosExtraidosOCR;
  observaciones?: string;
  validadoPor?: string;
  fechaValidacion?: string;
}

export type DocumentoTipo =
  | "identificacion_comprador"
  | "identificacion_vendedor"
  | "avaluo_inmueble"
  | "escritura_propiedad"
  | "certificado_libertad_gravamen"
  | "comprobante_pago"
  | "comprobante_domicilio_comprador"
  | "comprobante_domicilio_vendedor"
  | "acta_nacimiento_comprador"
  | "acta_nacimiento_vendedor"
  | "constancia_predial"
  | "constancia_agua";

export interface DatosExtraidosOCR {
  tipoDocumento: DocumentoTipo;
  datosPersonales?: {
    nombre?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    fechaNacimiento?: string;
    curp?: string;
    rfc?: string;
    domicilio?: Domicilio;
  };
  datosInmueble?: {
    ubicacion?: Domicilio;
    superficie?: number;
    valor?: number;
    numeroEscritura?: string;
    fechaEscritura?: string;
  };
  datosAvaluo?: {
    valorAvaluo?: number;
    fechaAvaluo?: string;
    avaluador?: string;
    numeroAvaluo?: string;
  };
  datosCLG?: {
    numeroCLG?: string;
    fechaCLG?: string;
    gravamenes?: Gravamen[];
    estado?: "sin_gravamen" | "con_gravamen";
  };
  confianza: number; // 0-100, nivel de confianza en la extracción
  camposExtraidos: string[];
  camposFaltantes: string[];
}

export interface ExpedienteCompraventa {
  id: string;
  numeroSolicitud: string;
  fechaCreacion: string;
  fechaUltimaActualizacion: string;
  estado: EstadoExpediente;
  tipoTramite?: string;

  // Datos de las partes
  comprador: Persona;
  vendedor: Persona;

  // Datos del inmueble
  inmueble: Inmueble;

  // Documentos
  documentos: DocumentoCompraventa[];

  // Información del proceso
  abogadoAsignado?: string;
  notarioAsignado?: string;
  cajeroAsignado?: string;

  // Costos y pagos
  costos: CostosCompraventa;
  pagos: PagoCompraventa[];

  // Historial y comentarios
  historial: HistorialExpediente[];
  comentarios: ComentarioExpediente[];

  // Validaciones IA
  validacionesIA: ValidacionIA[];

  // Escritura generada
  escrituraGenerada?: EscrituraGenerada;
}

export type EstadoExpediente =
  | "RECIBIDO"
  | "EN_VALIDACION"
  | "EN_PREPARACION"
  | "LISTO_PARA_FIRMA"
  | "COMPLETADO"
  | "CANCELADO";

export interface CostosCompraventa {
  costoBase: number;
  aranceles: number;
  impuestos: number;
  gastos: number;
  total: number;
  saldoPendiente: number;
  concepto: string;
}

export interface PagoCompraventa {
  id: string;
  monto: number;
  fecha: string;
  metodo: "efectivo" | "transferencia" | "cheque";
  referencia?: string;
  estado: "pendiente" | "confirmado" | "rechazado";
  confirmadoPor?: string;
  observaciones?: string;
}

export interface HistorialExpediente {
  id: string;
  fecha: string;
  accion: string;
  usuario: string;
  detalles: string;
  estadoAnterior?: EstadoExpediente;
  estadoNuevo?: EstadoExpediente;
}

export interface ComentarioExpediente {
  id: string;
  fecha: string;
  usuario: string;
  comentario: string;
  tipo: "general" | "observacion" | "requerimiento";
}

export interface ValidacionIA {
  id: string;
  tipo:
    | "validacion_datos"
    | "validacion_avaluo"
    | "validacion_propiedad"
    | "validacion_clg"
    | "validacion_antilavado";
  fecha: string;
  resultado: "aprobado" | "rechazado" | "requiere_revision";
  confianza: number;
  detalles: string;
  observaciones?: string;
  documentoRelacionado?: string;
}

export interface EscrituraGenerada {
  id: string;
  numeroEscritura: string;
  libro: string;
  foja: string;
  fechaGeneracion: string;
  estado: "borrador" | "revision_cliente" | "aprobado" | "firmado";
  url?: string;
  version: number;
  cambios: CambioEscritura[];
}

export interface CambioEscritura {
  id: string;
  fecha: string;
  usuario: string;
  tipo: "creacion" | "edicion" | "aprobacion" | "rechazo";
  descripcion: string;
  camposModificados: string[];
}

// Configuración de documentos requeridos por tipo de trámite
export const DOCUMENTOS_COMPRAVENTA: DocumentoTipo[] = [
  "identificacion_comprador",
  "identificacion_vendedor",
  "avaluo_inmueble",
  "escritura_propiedad",
  "certificado_libertad_gravamen",
  "comprobante_pago",
  "comprobante_domicilio_comprador",
  "comprobante_domicilio_vendedor",
];

// Estados del flujo de trabajo
export const ESTADOS_FLUJO: { [key in EstadoExpediente]: string } = {
  RECIBIDO: "Recibido",
  EN_VALIDACION: "En Validación",
  EN_PREPARACION: "En Preparación",
  LISTO_PARA_FIRMA: "Listo para Firma",
  COMPLETADO: "Completado",
  CANCELADO: "Cancelado",
};

// Configuración de validaciones IA
export interface ConfiguracionValidacionIA {
  validacionAvaluo: {
    porcentajeMinimo: number; // Porcentaje mínimo del valor de venta vs avalúo
    porcentajeMaximo: number; // Porcentaje máximo del valor de venta vs avalúo
  };
  validacionAntilavado: {
    limiteEfectivo: number; // Límite en pesos mexicanos
  };
  validacionPropiedad: {
    camposRequeridos: string[];
  };
}
