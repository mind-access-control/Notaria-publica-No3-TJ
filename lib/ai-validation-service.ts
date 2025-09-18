// Servicio de Validación Inteligente para Expedientes
// Simula validaciones automáticas de IA para documentos notariales

export interface ValidationResult {
  isValid: boolean;
  confidence: number; // 0-100%
  issues: ValidationIssue[];
  suggestions?: string[];
}

export interface ValidationIssue {
  id: string;
  type: "error" | "warning" | "info";
  field: string;
  message: string;
  severity: "high" | "medium" | "low";
  autoFixable?: boolean;
}

export interface DocumentValidation {
  documentType: string;
  result: ValidationResult;
  validatedAt: string;
  validatedBy: "ai" | "human";
}

export interface ExpedienteValidationReport {
  expedienteId: string;
  overallScore: number; // 0-100%
  status: "passed" | "failed" | "warning";
  validations: DocumentValidation[];
  summary: string;
  recommendedActions: string[];
  estimatedCompletionTime?: string;
}

class AIValidationService {
  private static instance: AIValidationService;

  public static getInstance(): AIValidationService {
    if (!AIValidationService.instance) {
      AIValidationService.instance = new AIValidationService();
    }
    return AIValidationService.instance;
  }

  // Validar INE vs Escritura
  private async validateINEvsEscritura(
    expedienteId: string
  ): Promise<ValidationResult> {
    // Simular procesamiento de IA
    await this.simulateAIProcessing(2000);

    // Generar resultado aleatorio para demo
    const randomScore = Math.random();

    if (randomScore > 0.8) {
      return {
        isValid: true,
        confidence: 95,
        issues: [],
        suggestions: [
          "✅ Los datos del INE coinciden perfectamente con la escritura pública",
          "✅ Nombres, apellidos y CURP verificados exitosamente",
        ],
      };
    } else if (randomScore > 0.6) {
      return {
        isValid: false,
        confidence: 87,
        issues: [
          {
            id: "ine-name-mismatch",
            type: "warning",
            field: "segundo_apellido",
            message:
              "❌ El segundo apellido en el INE no coincide exactamente con la escritura",
            severity: "medium",
            autoFixable: true,
          },
        ],
        suggestions: [
          "🔍 Revisar INE del comprador - posible error de captura",
          "📞 Contactar al cliente para verificar apellidos correctos",
        ],
      };
    } else {
      return {
        isValid: false,
        confidence: 92,
        issues: [
          {
            id: "ine-data-major-mismatch",
            type: "error",
            field: "datos_personales",
            message:
              "❌ Los nombres en el INE NO coinciden con los de la escritura",
            severity: "high",
            autoFixable: false,
          },
        ],
        suggestions: [
          "🚨 Revisar INE del comprador urgentemente",
          "📋 Solicitar documentos de identidad adicionales",
          "⚠️ Posible problema de identidad - requiere validación manual",
        ],
      };
    }
  }

  // Validar Avalúo
  private async validateAvaluo(
    expedienteId: string
  ): Promise<ValidationResult> {
    await this.simulateAIProcessing(1500);

    const randomScore = Math.random();
    const valorAvaluo = 2500000; // Ejemplo
    const limiteFiscal = 2800000; // Ejemplo
    const porcentajeLimite = ((valorAvaluo / limiteFiscal) * 100).toFixed(1);

    if (randomScore > 0.7) {
      return {
        isValid: true,
        confidence: 91,
        issues: [],
        suggestions: [
          `✅ Avalúo dentro del límite fiscal permitido (${porcentajeLimite}% del límite)`,
          "✅ Código QR del avalúo verificado exitosamente",
          "✅ Perito valuador certificado y vigente",
        ],
      };
    } else if (randomScore > 0.4) {
      return {
        isValid: false,
        confidence: 88,
        issues: [
          {
            id: "avaluo-near-limit",
            type: "warning",
            field: "valor_avaluo",
            message: `⚠️ El avalúo está cerca del límite fiscal (${porcentajeLimite}% del límite permitido)`,
            severity: "medium",
            autoFixable: false,
          },
        ],
        suggestions: [
          "📊 Revisar cálculos de impuestos por proximidad al límite",
          "🔍 Verificar avalúo con perito valuador",
          "📄 Ver avalúo completo para análisis detallado",
        ],
      };
    } else {
      return {
        isValid: false,
        confidence: 94,
        issues: [
          {
            id: "qr-code-invalid",
            type: "error",
            field: "codigo_qr_avaluo",
            message: "❌ El código QR del avalúo NO pudo ser verificado",
            severity: "high",
            autoFixable: false,
          },
          {
            id: "avaluo-expired",
            type: "error",
            field: "fecha_avaluo",
            message:
              "❌ El avalúo tiene más de 6 meses de antigüedad (vencido)",
            severity: "high",
            autoFixable: false,
          },
        ],
        suggestions: [
          "🚨 Solicitar avalúo actualizado al cliente",
          "📞 Contactar al perito valuador para nueva valuación",
          "📄 Revisar avalúo actual para confirmar fecha",
        ],
      };
    }
  }

  // Validar Escritura Pública
  private async validateEscrituraPublica(
    expedienteId: string
  ): Promise<ValidationResult> {
    await this.simulateAIProcessing(1800);

    const randomScore = Math.random();

    if (randomScore > 0.75) {
      return {
        isValid: true,
        confidence: 93,
        issues: [],
        suggestions: [
          "✅ Escritura pública válida y correctamente registrada",
          "✅ Propietario actual verificado en Registro Público",
          "✅ Superficie del inmueble coincide con avalúo",
        ],
      };
    } else {
      return {
        isValid: false,
        confidence: 89,
        issues: [
          {
            id: "escritura-gravamen",
            type: "warning",
            field: "gravamenes",
            message:
              "⚠️ Se detectó un gravamen menor registrado en la escritura",
            severity: "medium",
            autoFixable: false,
          },
          {
            id: "escritura-superficie",
            type: "info",
            field: "superficie",
            message: "ℹ️ Diferencia de 2m² entre escritura y avalúo (menor)",
            severity: "low",
            autoFixable: true,
          },
        ],
        suggestions: [
          "🔍 Verificar estatus actual del gravamen detectado",
          "📏 Confirmar medidas exactas con medición física",
          "📄 Revisar escritura completa para detalles del gravamen",
        ],
      };
    }
  }

  // Validar CLG (Certificado de Libertad de Gravamen)
  private async validateCLG(expedienteId: string): Promise<ValidationResult> {
    await this.simulateAIProcessing(1200);

    const randomScore = Math.random();

    if (randomScore > 0.8) {
      return {
        isValid: true,
        confidence: 96,
        issues: [],
        suggestions: [
          "✅ CLG vigente (expedido hace 15 días)",
          "✅ Inmueble completamente libre de gravámenes",
          "✅ No se detectaron cargas, hipotecas o embargos",
        ],
      };
    } else {
      return {
        isValid: false,
        confidence: 91,
        issues: [
          {
            id: "clg-outdated",
            type: "error",
            field: "fecha_clg",
            message: "❌ El CLG tiene más de 30 días de expedición (vencido)",
            severity: "high",
            autoFixable: false,
          },
        ],
        suggestions: [
          "🚨 Solicitar CLG actualizado urgentemente",
          "📅 Verificar que no hayan surgido nuevos gravámenes",
          "📄 Revisar CLG actual para confirmar fecha de expedición",
        ],
      };
    }
  }

  // Función principal de validación
  public async validateExpediente(
    expedienteId: string,
    isRevalidation: boolean = false
  ): Promise<ExpedienteValidationReport> {
    console.log(
      `🤖 Iniciando ${
        isRevalidation ? "RE-VALIDACIÓN" : "validación"
      } IA para expediente ${expedienteId}`
    );

    let ineValidation, avaluoValidation, escrituraValidation, clgValidation;

    if (isRevalidation) {
      // Para revalidaciones, simular que todo está perfecto
      console.log(
        `🔄 Ejecutando REVALIDACIÓN - todos los documentos serán aprobados...`
      );
      await this.simulateAIProcessing(1500);

      const perfectValidation: ValidationResult = {
        isValid: true,
        confidence: 98,
        issues: [],
        suggestions: ["✅ Documento corregido y aprobado exitosamente"],
      };

      ineValidation = perfectValidation;
      avaluoValidation = perfectValidation;
      escrituraValidation = perfectValidation;
      clgValidation = perfectValidation;
    } else {
      // Validación normal con resultados aleatorios
      console.log(`🔄 Ejecutando validaciones individuales...`);
      [ineValidation, avaluoValidation, escrituraValidation, clgValidation] =
        await Promise.all([
          this.validateINEvsEscritura(expedienteId),
          this.validateAvaluo(expedienteId),
          this.validateEscrituraPublica(expedienteId),
          this.validateCLG(expedienteId),
        ]);
    }

    console.log(`✅ Validaciones individuales completadas`);

    const validations: DocumentValidation[] = [
      {
        documentType: "INE vs Escritura",
        result: ineValidation,
        validatedAt: new Date().toISOString(),
        validatedBy: "ai",
      },
      {
        documentType: "Avalúo",
        result: avaluoValidation,
        validatedAt: new Date().toISOString(),
        validatedBy: "ai",
      },
      {
        documentType: "Escritura Pública",
        result: escrituraValidation,
        validatedAt: new Date().toISOString(),
        validatedBy: "ai",
      },
      {
        documentType: "CLG",
        result: clgValidation,
        validatedAt: new Date().toISOString(),
        validatedBy: "ai",
      },
    ];

    // Calcular score general basado en validaciones reales
    const totalValidations = validations.length;
    const validValidations = validations.filter((v) => v.result.isValid).length;
    const overallScore = Math.round(
      (validValidations / totalValidations) * 100
    );

    // Determinar status general basado en las validaciones reales
    const hasErrors = validations.some((v) =>
      v.result.issues.some((i) => i.type === "error")
    );
    const hasWarnings = validations.some((v) =>
      v.result.issues.some((i) => i.type === "warning")
    );

    let status: "passed" | "failed" | "warning";
    if (hasErrors) {
      status = "failed";
    } else if (hasWarnings) {
      status = "warning";
    } else {
      status = "passed";
    }

    // Generar resumen y recomendaciones
    const allIssues = validations.flatMap((v) => v.result.issues);
    const errorCount = allIssues.filter((i) => i.type === "error").length;
    const warningCount = allIssues.filter((i) => i.type === "warning").length;

    let summary: string;
    if (status === "passed") {
      summary = `✅ Validación completada exitosamente. Todos los documentos están en orden.`;
    } else if (status === "warning") {
      summary = `⚠️ Validación completada con ${warningCount} advertencia${
        warningCount > 1 ? "s" : ""
      }. Revisar observaciones.`;
    } else {
      summary = `❌ Validación falló con ${errorCount} error${
        errorCount > 1 ? "es" : ""
      } y ${warningCount} advertencia${warningCount > 1 ? "s" : ""}.`;
    }

    // Generar recomendaciones
    const recommendedActions: string[] = [];
    if (status === "failed") {
      recommendedActions.push("Resolver errores críticos antes de continuar");
      recommendedActions.push(
        "Contactar al cliente para documentos faltantes o incorrectos"
      );
    }
    if (hasWarnings) {
      recommendedActions.push(
        "Revisar advertencias y determinar si requieren acción"
      );
    }
    if (status === "passed") {
      recommendedActions.push("Proceder a la siguiente etapa del proceso");
      recommendedActions.push("Notificar al cliente sobre el progreso");
    }

    // Estimar tiempo de finalización
    let estimatedCompletionTime: string | undefined;
    if (status === "passed") {
      estimatedCompletionTime = "2-3 días hábiles";
    } else if (status === "warning") {
      estimatedCompletionTime = "3-5 días hábiles";
    } else {
      estimatedCompletionTime = "5-10 días hábiles (pendiente de correcciones)";
    }

    const report: ExpedienteValidationReport = {
      expedienteId,
      overallScore,
      status,
      validations,
      summary,
      recommendedActions,
      estimatedCompletionTime,
    };

    console.log(`🤖 Validación IA completada para ${expedienteId}:`, report);
    return report;
  }

  // Simular procesamiento de IA con delay
  private async simulateAIProcessing(delay: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Obtener validaciones previas (para persistencia)
  public getValidationHistory(
    expedienteId: string
  ): ExpedienteValidationReport[] {
    // En una implementación real, esto vendría de una base de datos
    const stored = localStorage.getItem(`validation_${expedienteId}`);
    return stored ? JSON.parse(stored) : [];
  }

  // Guardar validación (para persistencia)
  public saveValidation(report: ExpedienteValidationReport): void {
    const history = this.getValidationHistory(report.expedienteId);
    history.push(report);
    localStorage.setItem(
      `validation_${report.expedienteId}`,
      JSON.stringify(history)
    );
  }
}

export const aiValidationService = AIValidationService.getInstance();
