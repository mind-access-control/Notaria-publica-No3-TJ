// Sistema de persistencia robusto usando IndexedDB
// Más confiable que localStorage para datos complejos

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
  archivoBase64?: string;
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

class IndexedDBPersistence {
  private static instance: IndexedDBPersistence;
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = "NotariaDB";
  private readonly DB_VERSION = 1;
  private readonly STORE_NAME = "solicitudes";

  public static getInstance(): IndexedDBPersistence {
    if (!IndexedDBPersistence.instance) {
      IndexedDBPersistence.instance = new IndexedDBPersistence();
    }
    return IndexedDBPersistence.instance;
  }

  // Inicializar la base de datos
  public async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => {
        console.error("Error abriendo IndexedDB:", request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log("IndexedDB inicializada correctamente");
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Crear store si no existe
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, {
            keyPath: "numeroSolicitud",
          });
          store.createIndex("estado", "estado", { unique: false });
          store.createIndex("fechaCreacion", "fechaCreacion", {
            unique: false,
          });
        }
      };
    });
  }

  // Verificar si la base de datos está lista
  private async ensureDB(): Promise<void> {
    if (!this.db) {
      await this.init();
    }
  }

  // Obtener todas las solicitudes
  public async getSolicitudes(): Promise<SolicitudPersistente[]> {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Base de datos no inicializada"));
        return;
      }

      const transaction = this.db.transaction([this.STORE_NAME], "readonly");
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = () => {
        console.error("Error obteniendo solicitudes:", request.error);
        reject(request.error);
      };
    });
  }

  // Obtener una solicitud específica
  public async getSolicitud(
    numeroSolicitud: string
  ): Promise<SolicitudPersistente | null> {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Base de datos no inicializada"));
        return;
      }

      const transaction = this.db.transaction([this.STORE_NAME], "readonly");
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(numeroSolicitud);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        console.error("Error obteniendo solicitud:", request.error);
        reject(request.error);
      };
    });
  }

  // Guardar una solicitud
  public async saveSolicitud(solicitud: SolicitudPersistente): Promise<void> {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Base de datos no inicializada"));
        return;
      }

      const transaction = this.db.transaction([this.STORE_NAME], "readwrite");
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.put(solicitud);

      request.onsuccess = () => {
        console.log("Solicitud guardada:", solicitud.numeroSolicitud);
        resolve();
      };

      request.onerror = () => {
        console.error("Error guardando solicitud:", request.error);
        reject(request.error);
      };
    });
  }

  // Actualizar documentos de una solicitud
  public async updateDocumentos(
    numeroSolicitud: string,
    documentos: DocumentoPersistente[]
  ): Promise<void> {
    const solicitud = await this.getSolicitud(numeroSolicitud);
    if (solicitud) {
      solicitud.documentos = documentos;
      solicitud.ultimaActualizacion = new Date().toISOString();
      await this.saveSolicitud(solicitud);
    }
  }

  // Agregar pago a una solicitud
  public async addPago(
    numeroSolicitud: string,
    pago: PagoPersistente
  ): Promise<void> {
    const solicitud = await this.getSolicitud(numeroSolicitud);
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
      await this.addHistorial(numeroSolicitud, {
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

      await this.saveSolicitud(solicitud);
    }
  }

  // Agregar entrada al historial
  public async addHistorial(
    numeroSolicitud: string,
    entrada: HistorialPersistente
  ): Promise<void> {
    const solicitud = await this.getSolicitud(numeroSolicitud);
    if (solicitud) {
      solicitud.historial = solicitud.historial || [];
      solicitud.historial.push(entrada);
      solicitud.ultimaActualizacion = new Date().toISOString();
      await this.saveSolicitud(solicitud);
    }
  }

  // Actualizar estado de la solicitud
  public async updateEstado(
    numeroSolicitud: string,
    nuevoEstado: string
  ): Promise<void> {
    const solicitud = await this.getSolicitud(numeroSolicitud);
    if (solicitud) {
      const estadoAnterior = solicitud.estado;
      solicitud.estado = nuevoEstado;
      solicitud.ultimaActualizacion = new Date().toISOString();

      // Agregar al historial
      await this.addHistorial(numeroSolicitud, {
        id: `hist-${Date.now()}`,
        fecha: new Date().toISOString(),
        accion: "Estado actualizado",
        detalles: `Estado cambiado de ${estadoAnterior} a ${nuevoEstado}`,
        usuario: "Sistema",
        estadoAnterior,
        estadoNuevo: nuevoEstado,
      });

      await this.saveSolicitud(solicitud);
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

  // Generar número de solicitud único
  public generateSolicitudNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `NT3-${year}-${month}${day}${random}`;
  }

  // Crear una nueva solicitud
  public async createSolicitud(
    numeroSolicitud: string,
    tipoTramite: string,
    costoTotal: number = 25000
  ): Promise<void> {
    await this.ensureDB();

    const solicitudNueva: SolicitudPersistente = {
      numeroSolicitud,
      tipoTramite,
      fechaCreacion: new Date().toISOString(),
      costoTotal,
      saldoPendiente: costoTotal,
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
          id: `hist-${Date.now()}`,
          fecha: new Date().toISOString(),
          accion: "Solicitud creada",
          detalles: `Se creó la solicitud ${numeroSolicitud} para ${tipoTramite}`,
          usuario: "Cliente",
        },
      ],
      estado: "ARMANDO_EXPEDIENTE",
      ultimaActualizacion: new Date().toISOString(),
      pagos: [],
    };

    await this.saveSolicitud(solicitudNueva);
    console.log("Nueva solicitud creada:", numeroSolicitud);
  }

  // Inicializar datos de ejemplo si no existen
  public async initializeDefaultData(): Promise<void> {
    await this.ensureDB();

    const solicitudes = await this.getSolicitudes();
    if (solicitudes.length === 0) {
      // Crear una solicitud de ejemplo
      await this.createSolicitud("NT3-2025-17905", "compraventa", 25000);
      console.log("Datos de ejemplo inicializados en IndexedDB");
    }
  }

  // Limpiar todos los datos (para testing)
  public async clearAllData(): Promise<void> {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Base de datos no inicializada"));
        return;
      }

      const transaction = this.db.transaction([this.STORE_NAME], "readwrite");
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        console.log("Todos los datos eliminados");
        resolve();
      };

      request.onerror = () => {
        console.error("Error eliminando datos:", request.error);
        reject(request.error);
      };
    });
  }
}

export const indexedDBPersistence = IndexedDBPersistence.getInstance();
