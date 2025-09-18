// Servicio de OCR para extracción de datos de documentos
import {
  DatosExtraidosOCR,
  DocumentoTipo,
  Persona,
  Inmueble,
  Gravamen,
  Domicilio,
} from "./compraventa-types";

export interface OCRResult {
  success: boolean;
  data?: DatosExtraidosOCR;
  error?: string;
  confidence?: number;
}

export class OCRService {
  private static instance: OCRService;

  public static getInstance(): OCRService {
    if (!OCRService.instance) {
      OCRService.instance = new OCRService();
    }
    return OCRService.instance;
  }

  /**
   * Procesa un documento y extrae datos usando OCR
   */
  async procesarDocumento(
    archivo: File,
    tipoDocumento: DocumentoTipo
  ): Promise<OCRResult> {
    try {
      // Simular delay de procesamiento
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // En un sistema real, aquí se integraría con servicios como:
      // - Google Cloud Vision API
      // - Azure Computer Vision
      // - AWS Textract
      // - Tesseract.js para procesamiento local

      const datosExtraidos = await this.simularExtraccionOCR(
        archivo,
        tipoDocumento
      );

      return {
        success: true,
        data: datosExtraidos,
        confidence: datosExtraidos.confianza,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Error desconocido en OCR",
      };
    }
  }

  /**
   * Simula la extracción de datos OCR para diferentes tipos de documentos
   */
  private async simularExtraccionOCR(
    archivo: File,
    tipoDocumento: DocumentoTipo
  ): Promise<DatosExtraidosOCR> {
    const nombreArchivo = archivo.name.toLowerCase();

    switch (tipoDocumento) {
      case "identificacion_comprador":
      case "identificacion_vendedor":
        return this.simularExtraccionINE(nombreArchivo);

      case "avaluo_inmueble":
        return this.simularExtraccionAvaluo(nombreArchivo);

      case "escritura_propiedad":
        return this.simularExtraccionEscritura(nombreArchivo);

      case "certificado_libertad_gravamen":
        return this.simularExtraccionCLG(nombreArchivo);

      case "comprobante_domicilio_comprador":
      case "comprobante_domicilio_vendedor":
        return this.simularExtraccionDomicilio(nombreArchivo);

      default:
        return this.simularExtraccionGenerica(nombreArchivo);
    }
  }

  private simularExtraccionINE(nombreArchivo: string): DatosExtraidosOCR {
    const camposExtraidos = [
      "nombre",
      "apellidoPaterno",
      "apellidoMaterno",
      "fechaNacimiento",
      "curp",
      "domicilio",
    ];
    const camposFaltantes = ["rfc", "telefono", "email"];

    return {
      tipoDocumento: nombreArchivo.includes("comprador")
        ? "identificacion_comprador"
        : "identificacion_vendedor",
      datosPersonales: {
        nombre: "Juan Carlos",
        apellidoPaterno: "Pérez",
        apellidoMaterno: "García",
        fechaNacimiento: "1986-07-02",
        curp: "HEGJ860702HMCRNN07",
        domicilio: {
          calle: "Av. Revolución",
          numeroExterior: "1234",
          colonia: "Centro",
          municipio: "Tijuana",
          estado: "Baja California",
          codigoPostal: "22000",
          pais: "México",
        },
      },
      confianza: 95,
      camposExtraidos,
      camposFaltantes,
    };
  }

  private simularExtraccionAvaluo(nombreArchivo: string): DatosExtraidosOCR {
    const camposExtraidos = [
      "valorAvaluo",
      "fechaAvaluo",
      "avaluador",
      "numeroAvaluo",
    ];
    const camposFaltantes = ["superficie", "ubicacion"];

    return {
      tipoDocumento: "avaluo_inmueble",
      datosAvaluo: {
        valorAvaluo: 2500000,
        fechaAvaluo: "2024-12-15",
        avaluador: "Ing. María Elena Rodríguez",
        numeroAvaluo: "AV-2024-001234",
      },
      confianza: 88,
      camposExtraidos,
      camposFaltantes,
    };
  }

  private simularExtraccionEscritura(nombreArchivo: string): DatosExtraidosOCR {
    const camposExtraidos = [
      "numeroEscritura",
      "fechaEscritura",
      "ubicacion",
      "superficie",
    ];
    const camposFaltantes = ["notarioEscritura", "numeroNotario"];

    return {
      tipoDocumento: "escritura_propiedad",
      datosInmueble: {
        numeroEscritura: "12345",
        fechaEscritura: "2015-03-20",
        ubicacion: {
          calle: "Calle 5 de Febrero",
          numeroExterior: "567",
          colonia: "Zona Río",
          municipio: "Tijuana",
          estado: "Baja California",
          codigoPostal: "22320",
          pais: "México",
        },
        superficie: 120,
      },
      confianza: 92,
      camposExtraidos,
      camposFaltantes,
    };
  }

  private simularExtraccionCLG(nombreArchivo: string): DatosExtraidosOCR {
    const camposExtraidos = ["numeroCLG", "fechaCLG", "estado"];
    const camposFaltantes = ["gravamenes"];

    return {
      tipoDocumento: "certificado_libertad_gravamen",
      datosCLG: {
        numeroCLG: "CLG-2024-567890",
        fechaCLG: "2024-11-30",
        estado: "sin_gravamen",
        gravamenes: [],
      },
      confianza: 98,
      camposExtraidos,
      camposFaltantes,
    };
  }

  private simularExtraccionDomicilio(nombreArchivo: string): DatosExtraidosOCR {
    const camposExtraidos = ["domicilio"];
    const camposFaltantes = ["fechaEmision"];

    return {
      tipoDocumento: nombreArchivo.includes("comprador")
        ? "comprobante_domicilio_comprador"
        : "comprobante_domicilio_vendedor",
      datosPersonales: {
        domicilio: {
          calle: "Blvd. Agua Caliente",
          numeroExterior: "890",
          colonia: "Chapultepec",
          municipio: "Tijuana",
          estado: "Baja California",
          codigoPostal: "22420",
          pais: "México",
        },
      },
      confianza: 85,
      camposExtraidos,
      camposFaltantes,
    };
  }

  private simularExtraccionGenerica(nombreArchivo: string): DatosExtraidosOCR {
    return {
      tipoDocumento: "comprobante_pago",
      confianza: 70,
      camposExtraidos: ["fecha", "monto"],
      camposFaltantes: ["referencia", "metodo"],
    };
  }

  /**
   * Valida la calidad de los datos extraídos
   */
  validarCalidadDatos(datos: DatosExtraidosOCR): {
    esValido: boolean;
    errores: string[];
    advertencias: string[];
  } {
    const errores: string[] = [];
    const advertencias: string[] = [];

    // Validar confianza mínima
    if (datos.confianza < 70) {
      advertencias.push("Confianza baja en la extracción de datos");
    }

    // Validar campos críticos según el tipo de documento
    switch (datos.tipoDocumento) {
      case "identificacion_comprador":
      case "identificacion_vendedor":
        if (
          !datos.datosPersonales?.nombre ||
          !datos.datosPersonales?.apellidoPaterno
        ) {
          errores.push("Nombre y apellido paterno son obligatorios");
        }
        if (!datos.datosPersonales?.curp) {
          advertencias.push("CURP no detectada");
        }
        break;

      case "avaluo_inmueble":
        if (!datos.datosAvaluo?.valorAvaluo) {
          errores.push("Valor del avalúo es obligatorio");
        }
        break;

      case "escritura_propiedad":
        if (!datos.datosInmueble?.numeroEscritura) {
          errores.push("Número de escritura es obligatorio");
        }
        break;

      case "certificado_libertad_gravamen":
        if (!datos.datosCLG?.numeroCLG) {
          errores.push("Número de CLG es obligatorio");
        }
        break;
    }

    return {
      esValido: errores.length === 0,
      errores,
      advertencias,
    };
  }

  /**
   * Compara datos extraídos con datos ingresados manualmente
   */
  compararDatos(
    datosOCR: DatosExtraidosOCR,
    datosManuales: any
  ): {
    coincidencias: string[];
    discrepancias: string[];
    sugerencias: string[];
  } {
    const coincidencias: string[] = [];
    const discrepancias: string[] = [];
    const sugerencias: string[] = [];

    // Implementar lógica de comparación según el tipo de documento
    // Por ahora, simular comparación básica

    if (datosOCR.datosPersonales?.nombre && datosManuales.nombre) {
      if (
        datosOCR.datosPersonales.nombre.toLowerCase() ===
        datosManuales.nombre.toLowerCase()
      ) {
        coincidencias.push("Nombre coincide");
      } else {
        discrepancias.push("Nombre no coincide");
        sugerencias.push("Verificar ortografía o formato del nombre");
      }
    }

    return {
      coincidencias,
      discrepancias,
      sugerencias,
    };
  }
}

// Instancia singleton
export const ocrService = OCRService.getInstance();
