// Sistema de persistencia para solicitudes
// Simula una base de datos local usando localStorage

export interface SolicitudPersistente {
  numeroSolicitud: string;
  tipoTramite: string;
  fechaCreacion: string;
  costoTotal: number;
  saldoPendiente: number;
  documentos: DocumentoPersistente[];
  historial: HistorialPersistente[];
  estado: string;
  ultimaActualizacion: string;
  pagos: PagoPersistente[];
}

export interface DocumentoPersistente {
  id: string;
  nombre: string;
  descripcion: string;
  requerido: boolean;
  subido: boolean;
  fechaSubida: string | null;
  datosExtraidos: any;
  archivoBase64?: string; // Para persistir el archivo como base64
}

export interface HistorialPersistente {
  id: string;
  fecha: string;
  accion: string;
  detalles: string;
  usuario: string;
  estadoAnterior?: string;
  estadoNuevo?: string;
}

export interface PagoPersistente {
  id: string;
  monto: number;
  metodo: string;
  referencia?: string;
  tipo: "parcial" | "total";
  fecha: string;
  estado: "confirmado" | "pendiente" | "rechazado";
}

class SolicitudesPersistence {
  private static instance: SolicitudesPersistence;
  private readonly STORAGE_KEY = "notaria_solicitudes";

  public static getInstance(): SolicitudesPersistence {
    if (!SolicitudesPersistence.instance) {
      SolicitudesPersistence.instance = new SolicitudesPersistence();
    }
    return SolicitudesPersistence.instance;
  }

  // Obtener todas las solicitudes
  public getSolicitudes(): SolicitudPersistente[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error al cargar solicitudes:", error);
      return [];
    }
  }

  // Obtener una solicitud específica
  public getSolicitud(numeroSolicitud: string): SolicitudPersistente | null {
    const solicitudes = this.getSolicitudes();
    return (
      solicitudes.find((s) => s.numeroSolicitud === numeroSolicitud) || null
    );
  }

  // Guardar una solicitud
  public saveSolicitud(solicitud: SolicitudPersistente): void {
    try {
      const solicitudes = this.getSolicitudes();
      const index = solicitudes.findIndex(
        (s) => s.numeroSolicitud === solicitud.numeroSolicitud
      );

      if (index >= 0) {
        solicitudes[index] = solicitud;
      } else {
        solicitudes.push(solicitud);
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(solicitudes));
    } catch (error) {
      console.error("Error al guardar solicitud:", error);
    }
  }

  // Actualizar documentos de una solicitud
  public updateDocumentos(
    numeroSolicitud: string,
    documentos: DocumentoPersistente[]
  ): void {
    const solicitud = this.getSolicitud(numeroSolicitud);
    if (solicitud) {
      solicitud.documentos = documentos;
      solicitud.ultimaActualizacion = new Date().toISOString();
      this.saveSolicitud(solicitud);
    }
  }

  // Agregar pago a una solicitud
  public addPago(numeroSolicitud: string, pago: PagoPersistente): void {
    const solicitud = this.getSolicitud(numeroSolicitud);
    if (solicitud) {
      solicitud.pagos = solicitud.pagos || [];
      solicitud.pagos.push(pago);

      // Actualizar saldo pendiente
      const totalPagado = solicitud.pagos
        .filter((p) => p.estado === "confirmado")
        .reduce((sum, p) => sum + p.monto, 0);

      solicitud.saldoPendiente = Math.max(
        0,
        solicitud.costoTotal - totalPagado
      );
      solicitud.ultimaActualizacion = new Date().toISOString();

      // Agregar al historial
      this.addHistorial(numeroSolicitud, {
        id: `hist-${Date.now()}`,
        fecha: new Date().toISOString(),
        accion: `Pago ${pago.tipo} realizado`,
        detalles: `Pago de ${pago.monto.toLocaleString("es-MX", {
          style: "currency",
          currency: "MXN",
        })} por ${pago.metodo}`,
        usuario: "Cliente",
        estadoNuevo:
          solicitud.saldoPendiente === 0 ? "PAGO_COMPLETO" : "PAGO_PARCIAL",
      });

      this.saveSolicitud(solicitud);
    }
  }

  // Agregar entrada al historial
  public addHistorial(
    numeroSolicitud: string,
    entrada: HistorialPersistente
  ): void {
    const solicitud = this.getSolicitud(numeroSolicitud);
    if (solicitud) {
      solicitud.historial = solicitud.historial || [];
      solicitud.historial.push(entrada);
      solicitud.ultimaActualizacion = new Date().toISOString();
      this.saveSolicitud(solicitud);
    }
  }

  // Actualizar estado de la solicitud
  public updateEstado(numeroSolicitud: string, nuevoEstado: string): void {
    const solicitud = this.getSolicitud(numeroSolicitud);
    if (solicitud) {
      const estadoAnterior = solicitud.estado;
      solicitud.estado = nuevoEstado;
      solicitud.ultimaActualizacion = new Date().toISOString();

      // Agregar al historial
      this.addHistorial(numeroSolicitud, {
        id: `hist-${Date.now()}`,
        fecha: new Date().toISOString(),
        accion: "Estado actualizado",
        detalles: `Estado cambiado de ${estadoAnterior} a ${nuevoEstado}`,
        usuario: "Sistema",
        estadoAnterior,
        estadoNuevo: nuevoEstado,
      });

      this.saveSolicitud(solicitud);
    }
  }

  // Convertir archivo a base64 para persistencia
  public async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  // Convertir base64 a archivo para visualización
  public base64ToFile(
    base64: string,
    filename: string,
    mimeType: string
  ): File {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || mimeType;
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  // Inicializar datos de ejemplo si no existen
  public initializeDefaultData(): void {
    const solicitudes = this.getSolicitudes();
    if (solicitudes.length === 0) {
      const solicitudEjemplo: SolicitudPersistente = {
        numeroSolicitud: "NT3-2025-17905",
        tipoTramite: "compraventa",
        fechaCreacion: "2025-01-18T10:00:00Z",
        costoTotal: 25000,
        saldoPendiente: 25000,
        documentos: [
          {
            id: "doc-1",
            nombre: "INE del Comprador",
            descripcion: "Identificación oficial del comprador",
            requerido: true,
            subido: false,
            fechaSubida: null,
            datosExtraidos: null,
          },
          {
            id: "doc-2",
            nombre: "INE del Vendedor",
            descripcion: "Identificación oficial del vendedor",
            requerido: true,
            subido: false,
            fechaSubida: null,
            datosExtraidos: null,
          },
          {
            id: "doc-3",
            nombre: "Avalúo del Inmueble",
            descripcion: "Avalúo oficial del inmueble",
            requerido: true,
            subido: false,
            fechaSubida: null,
            datosExtraidos: null,
          },
          {
            id: "doc-4",
            nombre: "Escritura Pública",
            descripcion: "Escritura pública de la propiedad",
            requerido: true,
            subido: false,
            fechaSubida: null,
            datosExtraidos: null,
          },
          {
            id: "doc-5",
            nombre: "Certificado de Libertad de Gravamen",
            descripcion: "CLG del inmueble",
            requerido: true,
            subido: false,
            fechaSubida: null,
            datosExtraidos: null,
          },
        ],
        historial: [
          {
            id: "hist-1",
            fecha: "2025-01-18T10:00:00Z",
            accion: "Solicitud creada",
            detalles:
              "Se creó la solicitud NT3-2025-17905 para compraventa de inmueble",
            usuario: "Cliente",
          },
        ],
        estado: "ARMANDO_EXPEDIENTE",
        ultimaActualizacion: "2025-01-18T10:00:00Z",
        pagos: [],
      };

      this.saveSolicitud(solicitudEjemplo);
    }
  }
}

export const solicitudesPersistence = SolicitudesPersistence.getInstance();
