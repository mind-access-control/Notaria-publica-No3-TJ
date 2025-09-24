// Sistema de validación inteligente de documentos
export interface ValidationResult {
  isValid: boolean;
  inconsistencies: Inconsistency[];
  suggestions: CorrectionSuggestion[];
  overallScore: number; // 0-100
}

export interface Inconsistency {
  type:
    | "name_mismatch"
    | "date_mismatch"
    | "address_mismatch"
    | "document_missing"
    | "data_incomplete";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  documents: string[];
  field: string;
}

export interface CorrectionSuggestion {
  institution: string;
  action: string;
  description: string;
  urgency: "low" | "medium" | "high";
  estimatedTime: string;
  cost?: string;
}

export interface DocumentData {
  documentType: string;
  data: {
    nombre?: string;
    fechaNacimiento?: string;
    domicilio?: string;
    curp?: string;
    claveElector?: string;
    direccion?: string;
    codigoPostal?: string;
    colonia?: string;
    municipio?: string;
    estado?: string;
    lugarNacimiento?: string;
    nombrePadre?: string;
    nombreMadre?: string;
    rfc?: string;
    nombreTitular?: string;
    numeroCuenta?: string;
    clabe?: string;
    banco?: string;
    sucursal?: string;
    sexo?: string;
    entidadNacimiento?: string;
  };
}

// Función principal de validación
export function validateDocumentsWithAI(
  documents: DocumentData[]
): ValidationResult {
  const inconsistencies: Inconsistency[] = [];
  const suggestions: CorrectionSuggestion[] = [];

  // 1. Validar nombres entre documentos
  const nameInconsistencies = validateNames(documents);
  inconsistencies.push(...nameInconsistencies);

  // 2. Validar fechas de nacimiento
  const dateInconsistencies = validateBirthDates(documents);
  inconsistencies.push(...dateInconsistencies);

  // 3. Validar direcciones
  const addressInconsistencies = validateAddresses(documents);
  inconsistencies.push(...addressInconsistencies);

  // 4. Validar CURP
  const curpInconsistencies = validateCURP(documents);
  inconsistencies.push(...curpInconsistencies);

  // 5. Generar sugerencias de corrección
  const correctionSuggestions = generateCorrectionSuggestions(inconsistencies);
  suggestions.push(...correctionSuggestions);

  // 6. Calcular puntuación general
  const overallScore = calculateOverallScore(inconsistencies);

  return {
    isValid:
      inconsistencies.filter(
        (i) => i.severity === "critical" || i.severity === "high"
      ).length === 0,
    inconsistencies,
    suggestions,
    overallScore,
  };
}

// Validación de nombres
function validateNames(documents: DocumentData[]): Inconsistency[] {
  const inconsistencies: Inconsistency[] = [];
  const names = documents
    .filter((doc) => doc.data.nombre)
    .map((doc) => ({
      document: doc.documentType,
      name: normalizeName(doc.data.nombre!),
    }));

  if (names.length < 2) return inconsistencies;

  // Comparar nombres
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      const similarity = calculateNameSimilarity(names[i].name, names[j].name);

      if (similarity < 0.8) {
        // Menos del 80% de similitud
        inconsistencies.push({
          type: "name_mismatch",
          severity: similarity < 0.5 ? "critical" : "high",
          description: `Los nombres no coinciden entre ${names[i].document} y ${names[j].document}`,
          documents: [names[i].document, names[j].document],
          field: "nombre",
        });
      }
    }
  }

  return inconsistencies;
}

// Validación de fechas de nacimiento
function validateBirthDates(documents: DocumentData[]): Inconsistency[] {
  const inconsistencies: Inconsistency[] = [];
  const dates = documents
    .filter((doc) => doc.data.fechaNacimiento)
    .map((doc) => ({
      document: doc.documentType,
      date: doc.data.fechaNacimiento!,
    }));

  if (dates.length < 2) return inconsistencies;

  // Comparar fechas
  for (let i = 0; i < dates.length; i++) {
    for (let j = i + 1; j < dates.length; j++) {
      if (dates[i].date !== dates[j].date) {
        inconsistencies.push({
          type: "date_mismatch",
          severity: "high",
          description: `Las fechas de nacimiento no coinciden entre ${dates[i].document} y ${dates[j].document}`,
          documents: [dates[i].document, dates[j].document],
          field: "fechaNacimiento",
        });
      }
    }
  }

  return inconsistencies;
}

// Validación de direcciones
function validateAddresses(documents: DocumentData[]): Inconsistency[] {
  const inconsistencies: Inconsistency[] = [];
  const addresses = documents
    .filter((doc) => doc.data.domicilio || doc.data.direccion)
    .map((doc) => ({
      document: doc.documentType,
      address: normalizeAddress(doc.data.domicilio || doc.data.direccion!),
    }));

  if (addresses.length < 2) return inconsistencies;

  // Comparar direcciones
  for (let i = 0; i < addresses.length; i++) {
    for (let j = i + 1; j < addresses.length; j++) {
      const similarity = calculateAddressSimilarity(
        addresses[i].address,
        addresses[j].address
      );

      if (similarity < 0.7) {
        // Menos del 70% de similitud
        inconsistencies.push({
          type: "address_mismatch",
          severity: similarity < 0.4 ? "high" : "medium",
          description: `Las direcciones no coinciden entre ${addresses[i].document} y ${addresses[j].document}`,
          documents: [addresses[i].document, addresses[j].document],
          field: "domicilio",
        });
      }
    }
  }

  return inconsistencies;
}

// Validación de CURP
function validateCURP(documents: DocumentData[]): Inconsistency[] {
  const inconsistencies: Inconsistency[] = [];
  const curps = documents
    .filter((doc) => doc.data.curp)
    .map((doc) => ({
      document: doc.documentType,
      curp: doc.data.curp!.toUpperCase(),
    }));

  if (curps.length < 2) return inconsistencies;

  // Comparar CURPs
  for (let i = 0; i < curps.length; i++) {
    for (let j = i + 1; j < curps.length; j++) {
      if (curps[i].curp !== curps[j].curp) {
        inconsistencies.push({
          type: "name_mismatch",
          severity: "critical",
          description: `Los CURPs no coinciden entre ${curps[i].document} y ${curps[j].document}`,
          documents: [curps[i].document, curps[j].document],
          field: "curp",
        });
      }
    }
  }

  return inconsistencies;
}

// Generar sugerencias de corrección
function generateCorrectionSuggestions(
  inconsistencies: Inconsistency[]
): CorrectionSuggestion[] {
  const suggestions: CorrectionSuggestion[] = [];

  inconsistencies.forEach((inconsistency) => {
    switch (inconsistency.type) {
      case "name_mismatch":
        if (inconsistency.documents.some((doc) => doc.includes("INE"))) {
          suggestions.push({
            institution: "Instituto Nacional Electoral (INE)",
            action: "Solicitar corrección de datos",
            description:
              "Debes acudir al INE para corregir el nombre en tu credencial de elector",
            urgency: inconsistency.severity === "critical" ? "high" : "medium",
            estimatedTime: "5-10 días hábiles",
            cost: "$0 (gratuito)",
          });
        }
        if (inconsistency.documents.some((doc) => doc.includes("ACTA"))) {
          suggestions.push({
            institution: "Registro Civil",
            action: "Solicitar corrección de acta",
            description:
              "Debes acudir al Registro Civil para corregir el nombre en tu acta de nacimiento",
            urgency: inconsistency.severity === "critical" ? "high" : "medium",
            estimatedTime: "10-15 días hábiles",
            cost: "$200-500 MXN",
          });
        }
        break;

      case "date_mismatch":
        suggestions.push({
          institution: "Registro Civil",
          action: "Solicitar corrección de fecha",
          description:
            "Debes acudir al Registro Civil para corregir la fecha de nacimiento en tu acta",
          urgency: "high",
          estimatedTime: "10-15 días hábiles",
          cost: "$200-500 MXN",
        });
        break;

      case "address_mismatch":
        suggestions.push({
          institution: "Servicio Postal Mexicano (SEPOMEX)",
          action: "Verificar código postal",
          description:
            "Verifica que tu dirección esté correctamente registrada en SEPOMEX",
          urgency: "medium",
          estimatedTime: "2-3 días hábiles",
          cost: "$0 (gratuito)",
        });
        break;

      case "curp_mismatch":
        suggestions.push({
          institution: "Registro Nacional de Población (RENAPO)",
          action: "Solicitar corrección de CURP",
          description: "Debes acudir a RENAPO para corregir tu CURP",
          urgency: "critical",
          estimatedTime: "15-20 días hábiles",
          cost: "$0 (gratuito)",
        });
        break;
    }
  });

  return suggestions;
}

// Funciones auxiliares
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[áàäâ]/g, "a")
    .replace(/[éèëê]/g, "e")
    .replace(/[íìïî]/g, "i")
    .replace(/[óòöô]/g, "o")
    .replace(/[úùüû]/g, "u")
    .replace(/ñ/g, "n")
    .replace(/[^a-z\s]/g, "")
    .trim();
}

function normalizeAddress(address: string): string {
  return address
    .toLowerCase()
    .replace(/[áàäâ]/g, "a")
    .replace(/[éèëê]/g, "e")
    .replace(/[íìïî]/g, "i")
    .replace(/[óòöô]/g, "o")
    .replace(/[úùüû]/g, "u")
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

function calculateNameSimilarity(name1: string, name2: string): number {
  const words1 = name1.split(" ");
  const words2 = name2.split(" ");

  let matches = 0;
  let totalWords = Math.max(words1.length, words2.length);

  words1.forEach((word1) => {
    if (
      words2.some(
        (word2) =>
          word1 === word2 || word1.includes(word2) || word2.includes(word1)
      )
    ) {
      matches++;
    }
  });

  return matches / totalWords;
}

function calculateAddressSimilarity(
  address1: string,
  address2: string
): number {
  const words1 = address1.split(" ");
  const words2 = address2.split(" ");

  let matches = 0;
  let totalWords = Math.max(words1.length, words2.length);

  words1.forEach((word1) => {
    if (
      words2.some(
        (word2) =>
          word1 === word2 || word1.includes(word2) || word2.includes(word1)
      )
    ) {
      matches++;
    }
  });

  return matches / totalWords;
}

function calculateOverallScore(inconsistencies: Inconsistency[]): number {
  if (inconsistencies.length === 0) return 100;

  let score = 100;

  inconsistencies.forEach((inconsistency) => {
    switch (inconsistency.severity) {
      case "critical":
        score -= 30;
        break;
      case "high":
        score -= 20;
        break;
      case "medium":
        score -= 10;
        break;
      case "low":
        score -= 5;
        break;
    }
  });

  return Math.max(0, score);
}
