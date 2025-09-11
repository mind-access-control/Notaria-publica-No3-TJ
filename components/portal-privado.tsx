"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  FileText,
  Upload,
  CheckCircle,
  Clock,
  User,
  Mail,
  Phone,
  Building,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  DollarSign,
  Shield,
  Search,
  Archive,
} from "lucide-react";

interface UserData {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  tipoUsuario: "individual" | "empresarial";
  empresa?: string;
}

interface Documento {
  id: string;
  nombre: string;
  tipo: string;
  fechaSubida: string;
  estado: "pendiente" | "revisando" | "revisado" | "aprobado" | "rechazado";
  url?: string;
}

interface Tramite {
  id: string;
  nombre: string;
  estado:
    | "iniciado"
    | "documentos_pendientes"
    | "datos_pendientes"
    | "revision_notario"
    | "firma_pendiente"
    | "pago_pendiente"
    | "en_proceso"
    | "firma"
    | "en_espera_firma"
    | "completado";
  fechaInicio: string;
  fechaEstimada: string;
  progreso: number;
  documentos: Documento[];
  costo: string;
  descripcion: string;
  datosRequeridos: string[];
  documentosRequeridos: string[];
  etapaActual: string;
  siguienteEtapa: string;
  pagado: boolean;
  pagoParcial?: number;
  archivado?: boolean;
}

const TRAMITES_DISPONIBLES = [
  {
    id: "compraventas",
    nombre: "Compraventas",
    descripcion: "Compraventa de bienes inmuebles",
    costo: "$15,000 - $25,000",
  },
  {
    id: "donaciones",
    nombre: "Donaciones",
    descripcion: "Donación de bienes",
    costo: "$8,000 - $15,000",
  },
  {
    id: "permutas",
    nombre: "Permutas",
    descripcion: "Permuta de bienes inmuebles",
    costo: "$12,000 - $20,000",
  },
  {
    id: "creditos_hipotecarios",
    nombre: "Créditos Hipotecarios / Infonavit / Fovissste",
    descripcion: "Constitución de hipoteca",
    costo: "$10,000 - $18,000",
  },
  {
    id: "contrato_mutuo",
    nombre: "Contrato de Mutuo",
    descripcion: "Préstamo con garantía",
    costo: "$5,000 - $12,000",
  },
  {
    id: "reconocimiento_adeudo",
    nombre: "Reconocimiento de Adeudo",
    descripcion: "Reconocimiento de deuda",
    costo: "$3,000 - $8,000",
  },
  {
    id: "adjudicaciones_hereditarias",
    nombre: "Adjudicaciones Hereditarias",
    descripcion:
      "Testamentaria / Intestamentaria / continuación de Juicios Sucesorios",
    costo: "$8,000 - $20,000",
  },
  {
    id: "adjudicaciones",
    nombre: "Adjudicaciones",
    descripcion: "Adjudicación de bienes",
    costo: "$6,000 - $15,000",
  },
  {
    id: "constitucion_sociedades",
    nombre: "Constitución de Sociedades",
    descripcion: "Creación de empresa",
    costo: "$10,000 - $25,000",
  },
  {
    id: "liquidacion_copropiedad",
    nombre: "Liquidación de Copropiedad",
    descripcion: "División de copropiedad",
    costo: "$8,000 - $18,000",
  },
  {
    id: "cesion_derechos",
    nombre: "Cesión de Derechos",
    descripcion: "Cesión de derechos hereditarios",
    costo: "$5,000 - $12,000",
  },
  {
    id: "constitucion_servidumbre",
    nombre: "Constitución de Servidumbre",
    descripcion: "Servidumbre de paso",
    costo: "$4,000 - $10,000",
  },
  {
    id: "convenios_modificatorios",
    nombre: "Convenios Modificatorios",
    descripcion: "Modificación de contratos",
    costo: "$3,000 - $8,000",
  },
  {
    id: "elevacion_judicial",
    nombre: "Elevación judicial a escritura pública",
    descripcion: "Elevación de sentencia",
    costo: "$5,000 - $15,000",
  },
  {
    id: "dacion_pago",
    nombre: "Dación en pago",
    descripcion: "Pago con bienes",
    costo: "$6,000 - $12,000",
  },
  {
    id: "formalizacion_contrato",
    nombre: "Formalización de contrato privado",
    descripcion: "Titulación en propiedad",
    costo: "$8,000 - $18,000",
  },
  {
    id: "fideicomisos",
    nombre: "Fideicomisos",
    descripcion: "Constitución / transmisión / extinción",
    costo: "$10,000 - $25,000",
  },
  {
    id: "inicio_sucesion",
    nombre: "Inicio de Sucesión",
    descripcion: "Testamentaria / Intestamentaria",
    costo: "$8,000 - $20,000",
  },
  {
    id: "cancelacion_hipoteca",
    nombre: "Cancelación de Hipoteca",
    descripcion: "Liberación de hipoteca",
    costo: "$3,000 - $8,000",
  },
  {
    id: "protocolizacion_acta",
    nombre: "Protocolización de Acta de Asamblea",
    descripcion: "Protocolización de actas",
    costo: "$2,000 - $6,000",
  },
  {
    id: "cambio_regimen_matrimonial",
    nombre: "Cambio de Régimen Matrimonial",
    descripcion: "Cambio de régimen",
    costo: "$5,000 - $12,000",
  },
  {
    id: "cotejos",
    nombre: "Cotejos",
    descripcion: "Cotejo de documentos",
    costo: "$1,000 - $3,000",
  },
  {
    id: "fe_hechos",
    nombre: "Fe de Hechos",
    descripcion: "Constancia de hechos",
    costo: "$2,000 - $5,000",
  },
  {
    id: "poderes",
    nombre: "Poderes",
    descripcion: "Otorgamiento de poderes",
    costo: "$3,000 - $8,000",
  },
  {
    id: "rectificacion_escrituras",
    nombre: "Rectificación de Escrituras",
    descripcion: "Corrección de escrituras",
    costo: "$4,000 - $10,000",
  },
  {
    id: "testamentos",
    nombre: "Testamentos",
    descripcion: "Testamento público",
    costo: "$3,000 - $8,000",
  },
];

export function PortalPrivado({
  userData,
  onLogout,
}: {
  userData: UserData;
  onLogout: () => void;
}) {
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [activeTab, setActiveTab] = useState("tramites");
  const [selectedTramite, setSelectedTramite] = useState<Tramite | null>(null);
  const [showNuevoTramite, setShowNuevoTramite] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [dateInputs, setDateInputs] = useState<Record<string, string>>({});
  const [paymentBlocked, setPaymentBlocked] = useState(false);
  const [paymentRequired, setPaymentRequired] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showSignatureAppointmentModal, setShowSignatureAppointmentModal] =
    useState(false);
  const [availableAppointments, setAvailableAppointments] = useState<
    Array<{ id: string; fecha: string; hora: string; disponible: boolean }>
  >([]);
  const [selectedAppointment, setSelectedAppointment] = useState<string>("");
  const [appointmentPage, setAppointmentPage] = useState(0);
  const [showArchived, setShowArchived] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  useEffect(() => {
    // Cargar trámites y documentos del usuario desde localStorage
    const storedTramites = localStorage.getItem(`tramites_${userData.id}`);
    if (storedTramites) {
      setTramites(JSON.parse(storedTramites));
    }

    const storedDocs = localStorage.getItem(`documentos_${userData.id}`);
    if (storedDocs) {
      setDocumentos(JSON.parse(storedDocs));
    }
  }, [userData.id]);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "completado":
        return "bg-green-100 text-green-800";
      case "iniciado":
        return "bg-blue-100 text-blue-800";
      case "documentos_pendientes":
        return "bg-yellow-100 text-yellow-800";
      case "datos_pendientes":
        return "bg-orange-100 text-orange-800";
      case "revision_notario":
        return "bg-purple-100 text-purple-800";
      case "firma_pendiente":
        return "bg-indigo-100 text-indigo-800";
      case "firma":
        return "bg-cyan-100 text-cyan-800";
      case "en_espera_firma":
        return "bg-emerald-100 text-emerald-800";
      case "pago_pendiente":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDocumentoEstadoColor = (estado: string) => {
    switch (estado) {
      case "aprobado":
        return "bg-green-100 text-green-800";
      case "revisando":
        return "bg-yellow-100 text-yellow-800";
      case "rechazado":
        return "bg-red-100 text-red-800";
      case "pendiente":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case "completado":
        return "Completado";
      case "iniciado":
        return "Iniciado";
      case "documentos_pendientes":
        return "Esperando Documentos";
      case "datos_pendientes":
        return "Faltan Datos";
      case "revision_notario":
        return "Revisión del Notario";
      case "firma_pendiente":
        return "Pendiente de Firma";
      case "firma":
        return "Listo para Firma";
      case "en_espera_firma":
        return "Cita Agendada";
      case "pago_pendiente":
        return "Pendiente de Pago";
      default:
        return estado;
    }
  };

  const getEtapaDescripcion = (estado: string) => {
    switch (estado) {
      case "iniciado":
        return "Tu trámite ha sido iniciado. Necesitas completar los datos personales y subir los documentos requeridos.";
      case "documentos_pendientes":
        return "Faltan documentos por subir. Revisa la lista de documentos requeridos y súbelos.";
      case "datos_pendientes":
        return "Necesitas completar algunos datos personales requeridos para el trámite.";
      case "revision_notario":
        return "El notario está revisando tu documentación. Te contactaremos si necesitamos algo más.";
      case "firma_pendiente":
        return "Tu documentación está lista. Necesitas acudir a la notaría para firmar los documentos.";
      case "pago_pendiente":
        return "El trámite está listo. Necesitas realizar el pago para completar el proceso.";
      case "completado":
        return "¡Felicidades! Tu trámite ha sido completado exitosamente.";
      default:
        return "Estado no reconocido";
    }
  };

  const iniciarTramite = (tramiteId: string) => {
    const tramiteInfo = TRAMITES_DISPONIBLES.find((t) => t.id === tramiteId);
    if (!tramiteInfo) return;

    // Generar número de solicitud único
    const numeroSolicitud = `NT3-2025-${String(Date.now()).slice(-5)}`;
    
    // Redirigir a la nueva página de estatus de solicitud
    window.location.href = `/solicitud/${numeroSolicitud}`;
  };

  // Función para simular extracción de datos por OCR
  const getOCRExtractedValue = (dato: string, tramiteNombre: string) => {
    // Simular datos extraídos por OCR basados en el tipo de trámite
    const datosSimulados: Record<string, string> = {
      "Nombre completo": userData.nombre,
      Email: userData.email,
      Teléfono: userData.telefono,
      "Fecha de nacimiento": "15/03/1985",
      "Lugar de nacimiento": "Tijuana, B.C.",
      "Estado civil": "Soltero",
      Ocupación: "Ingeniero",
      "Domicilio actual": "Av. Revolución 123, Tijuana, B.C.",
    };

    return datosSimulados[dato] || "";
  };

  // Función para manejar subida de documentos individuales
  const handleDocumentUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    docName: string,
    index: number
  ) => {
    const file = event.target.files?.[0];
    if (!file || !selectedTramite) return;

    // Verificar si puede subir documentos
    if (!canUploadDocuments(selectedTramite)) {
      setPaymentRequired(true);
      setShowPaymentModal(true);
      return;
    }

    // Crear nuevo documento
    const nuevoDocumento: Documento = {
      id: Date.now().toString(),
      nombre: file.name,
      tipo: docName,
      fechaSubida: new Date().toISOString(),
      estado: "aprobado",
      url: URL.createObjectURL(file),
    };

    // Actualizar trámite con el nuevo documento
    const documentosActualizados = [...selectedTramite.documentos];

    // Buscar si ya existe un documento de este tipo y reemplazarlo
    // Usar una búsqueda más flexible que incluya palabras clave
    const existingIndex = documentosActualizados.findIndex((d) => {
      const tipoLower = d.tipo.toLowerCase();
      const docNameLower = docName.toLowerCase();

      // Buscar por coincidencia exacta o por palabras clave
      return (
        tipoLower === docNameLower ||
        tipoLower.includes(docNameLower) ||
        docNameLower.includes(tipoLower) ||
        // Buscar por palabras clave específicas
        (docNameLower.includes("identificacion") &&
          tipoLower.includes("identificacion")) ||
        (docNameLower.includes("domicilio") &&
          tipoLower.includes("domicilio")) ||
        (docNameLower.includes("nacimiento") &&
          tipoLower.includes("nacimiento")) ||
        (docNameLower.includes("estado") && tipoLower.includes("estado"))
      );
    });

    if (existingIndex >= 0) {
      documentosActualizados[existingIndex] = nuevoDocumento;
    } else {
      documentosActualizados.push(nuevoDocumento);
    }

    // Calcular progreso basado en documentos completados
    const documentosCompletados = documentosActualizados.filter(
      (d) => d.estado === "aprobado"
    ).length;
    const totalDocumentos = selectedTramite.documentosRequeridos.length;
    const progresoDocumentos = Math.min(
      (documentosCompletados / totalDocumentos) * 25,
      25
    ); // Máximo 25% por documentos

    const tramiteActualizado = {
      ...selectedTramite,
      documentos: documentosActualizados,
      progreso: Math.max(progresoDocumentos, selectedTramite.progreso), // No reducir el progreso
    };

    // Actualizar estado
    setSelectedTramite(tramiteActualizado);

    // Debug: mostrar información del documento
    console.log("Documento subido:", nuevoDocumento);
    console.log("Documentos actualizados:", documentosActualizados);
    console.log("Progreso actualizado:", tramiteActualizado.progreso);

    // Actualizar lista de trámites
    const tramitesActualizados = tramites.map((t) =>
      t.id === selectedTramite.id ? tramiteActualizado : t
    );
    setTramites(tramitesActualizados);
    localStorage.setItem(
      `tramites_${userData.id}`,
      JSON.stringify(tramitesActualizados)
    );

    // Simular procesamiento OCR
    setTimeout(() => {
      console.log(`Procesando documento ${file.name} con OCR...`);
    }, 1000);
  };

  // Función para clasificar automáticamente un documento por su nombre
  const clasificarDocumento = (
    fileName: string,
    documentosRequeridos: string[]
  ) => {
    const fileNameLower = fileName.toLowerCase();

    // Mapeo inteligente de palabras clave a tipos de documentos
    const mapeoDocumentos = {
      // Identificación oficial
      identificacion: [
        "identificacion",
        "identidad",
        "credencial",
        "licencia",
        "pasaporte",
        "cédula",
        "cedula",
        "ine",
        "ife",
      ],
      domicilio: [
        "domicilio",
        "comprobante domicilio",
        "servicio",
        "luz",
        "agua",
        "telefono",
        "teléfono",
        "gas",
        "predial",
        "cfe",
      ],
      nacimiento: [
        "nacimiento",
        "acta nacimiento",
        "certificado nacimiento",
        "partida nacimiento",
      ],
      estado: [
        "estado civil",
        "acta matrimonio",
        "acta divorcio",
        "certificado solteria",
        "constancia soltero",
      ],
      curp: ["curp", "clave única", "clave unica"],
      rfc: ["rfc", "registro federal", "homoclave"],
      comprobante: [
        "comprobante",
        "ingresos",
        "sueldo",
        "salario",
        "nómina",
        "nomina",
        "recibo",
      ],
      acta: ["acta", "partida", "certificado"],
      certificado: ["certificado", "diploma", "título", "titulo"],
      constancia: ["constancia", "carta", "oficio"],
    };

    // Buscar coincidencias inteligentes
    for (const [tipoDoc, palabrasClave] of Object.entries(mapeoDocumentos)) {
      for (const palabra of palabrasClave) {
        if (fileNameLower.includes(palabra)) {
          // Buscar el documento requerido que coincida con este tipo
          for (const docRequerido of documentosRequeridos) {
            const docLower = docRequerido.toLowerCase();
            if (
              docLower.includes(tipoDoc) ||
              (tipoDoc === "identificacion" &&
                (docLower.includes("identificacion") ||
                  docLower.includes("identidad"))) ||
              (tipoDoc === "domicilio" &&
                (docLower.includes("domicilio") ||
                  docLower.includes("comprobante"))) ||
              (tipoDoc === "nacimiento" &&
                (docLower.includes("nacimiento") ||
                  docLower.includes("acta"))) ||
              (tipoDoc === "estado" &&
                (docLower.includes("estado") || docLower.includes("civil"))) ||
              (tipoDoc === "curp" && docLower.includes("curp")) ||
              (tipoDoc === "rfc" && docLower.includes("rfc")) ||
              (tipoDoc === "comprobante" &&
                (docLower.includes("comprobante") ||
                  docLower.includes("ingresos"))) ||
              (tipoDoc === "acta" &&
                (docLower.includes("acta") || docLower.includes("partida"))) ||
              (tipoDoc === "certificado" && docLower.includes("certificado")) ||
              (tipoDoc === "constancia" && docLower.includes("constancia"))
            ) {
              console.log(
                `Documento "${fileName}" clasificado como "${docRequerido}" por palabra clave "${palabra}"`
              );
              return docRequerido;
            }
          }
        }
      }
    }

    // Buscar coincidencias directas con nombres de documentos requeridos
    for (const docRequerido of documentosRequeridos) {
      const docLower = docRequerido.toLowerCase();

      // Buscar coincidencias exactas o parciales
      if (
        docLower.includes(fileNameLower) ||
        fileNameLower.includes(docLower)
      ) {
        console.log(
          `Documento "${fileName}" clasificado como "${docRequerido}" por coincidencia directa`
        );
        return docRequerido;
      }

      // Buscar por palabras individuales
      const palabrasDoc = docLower.split(" ");
      const palabrasFile = fileNameLower.split(" ");

      for (const palabraDoc of palabrasDoc) {
        if (palabraDoc.length > 3) {
          // Solo palabras de más de 3 caracteres
          for (const palabraFile of palabrasFile) {
            if (
              palabraFile.includes(palabraDoc) ||
              palabraDoc.includes(palabraFile)
            ) {
              console.log(
                `Documento "${fileName}" clasificado como "${docRequerido}" por palabra "${palabraDoc}"`
              );
              return docRequerido;
            }
          }
        }
      }
    }

    // Si no se encuentra coincidencia, usar el primer documento requerido disponible
    console.log(
      `Documento "${fileName}" no pudo ser clasificado, usando primer documento requerido`
    );
    return documentosRequeridos[0] || "Documento subido";
  };

  // Función para subida de documentos en bulk
  const handleBulkDocumentUpload = async (files: FileList) => {
    if (!selectedTramite) return;

    // Verificar si puede subir documentos
    if (!canUploadDocuments(selectedTramite)) {
      setPaymentRequired(true);
      setShowPaymentModal(true);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setProcessingStatus("Subiendo y clasificando documentos...");

    const nuevosDocumentos: Documento[] = [];
    const totalFiles = files.length;
    let documentosProcesados = 0;

    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];
      const progress = Math.round(((i + 1) / totalFiles) * 100);
      setUploadProgress(progress);
      setProcessingStatus(`Procesando ${file.name}...`);

      // Simular subida
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Clasificar el documento automáticamente
      const tipoClasificado = clasificarDocumento(
        file.name,
        selectedTramite.documentosRequeridos
      );

      const nuevoDocumento: Documento = {
        id: Date.now().toString() + i,
        nombre: file.name,
        tipo: tipoClasificado,
        fechaSubida: new Date().toISOString(),
        estado: "aprobado",
        url: URL.createObjectURL(file),
      };

      // Verificar si ya existe un documento de este tipo
      const existingIndex = selectedTramite.documentos.findIndex((d) => {
        const tipoLower = d.tipo.toLowerCase();
        const tipoClasificadoLower = tipoClasificado.toLowerCase();
        return (
          tipoLower === tipoClasificadoLower ||
          tipoLower.includes(tipoClasificadoLower) ||
          tipoClasificadoLower.includes(tipoLower)
        );
      });

      if (existingIndex >= 0) {
        // Reemplazar documento existente
        selectedTramite.documentos[existingIndex] = nuevoDocumento;
        documentosProcesados++;
      } else {
        // Agregar nuevo documento
        nuevosDocumentos.push(nuevoDocumento);
        documentosProcesados++;
      }
    }

    // Actualizar trámite
    const documentosActualizados = [
      ...selectedTramite.documentos,
      ...nuevosDocumentos,
    ];

    // Calcular progreso basado en documentos completados
    const documentosCompletados = documentosActualizados.filter(
      (d) => d.estado === "aprobado"
    ).length;
    const totalDocumentos = selectedTramite.documentosRequeridos.length;
    const progresoDocumentos = Math.min(
      (documentosCompletados / totalDocumentos) * 25,
      25
    ); // Máximo 25% por documentos

    const tramiteActualizado = {
      ...selectedTramite,
      documentos: documentosActualizados,
      progreso: Math.max(progresoDocumentos, selectedTramite.progreso), // No reducir el progreso
    };

    setSelectedTramite(tramiteActualizado);

    const tramitesActualizados = tramites.map((t) =>
      t.id === selectedTramite.id ? tramiteActualizado : t
    );
    setTramites(tramitesActualizados);
    localStorage.setItem(
      `tramites_${userData.id}`,
      JSON.stringify(tramitesActualizados)
    );

    setIsUploading(false);
    setUploadProgress(0);
    setProcessingStatus("");
  };

  // Función para manejar cambios en datos personales
  const handleDataChange = (campo: string, valor: string) => {
    // Aquí se guardarían los datos en el estado del trámite
    console.log(`Campo ${campo} actualizado: ${valor}`);
  };

  // Función para guardar datos
  const handleSaveData = () => {
    if (!selectedTramite) return;

    // Solo permitir guardar si se han subido documentos
    const documentosSubidos = selectedTramite.documentosRequeridos.filter(
      (doc) =>
        selectedTramite.documentos.some(
          (d) => d.tipo === doc && d.estado !== "pendiente"
        )
    );

    if (documentosSubidos.length === 0) {
      alert("Debes subir al menos un documento antes de guardar los datos.");
      return;
    }

    // Los datos ya están pre-llenados por OCR, no necesitamos validación estricta
    // Solo verificamos que se hayan subido documentos (ya validado arriba)

    // Cambiar a estado de revisión
    const tramiteActualizado: Tramite = {
      ...selectedTramite,
      estado: "revision_notario",
      etapaActual: "Revisión de información",
      siguienteEtapa: "Aprobación de datos",
      progreso: Math.min(selectedTramite.progreso + 5, 100), // Solo 5% por guardar datos
    };

    setSelectedTramite(tramiteActualizado as Tramite);

    const tramitesActualizados = tramites.map((t) =>
      t.id === selectedTramite.id ? (tramiteActualizado as Tramite) : t
    );
    setTramites(tramitesActualizados);
    localStorage.setItem(
      `tramites_${userData.id}`,
      JSON.stringify(tramitesActualizados)
    );

    // Mostrar modal de revisión
    setShowReviewModal(true);
  };

  // Función para archivar un trámite
  const handleArchiveTramite = (tramiteId: string) => {
    const tramitesActualizados = tramites.map((t) =>
      t.id === tramiteId ? { ...t, archivado: true } : t
    );
    setTramites(tramitesActualizados);
    localStorage.setItem(
      `tramites_${userData.id}`,
      JSON.stringify(tramitesActualizados)
    );

    // Si el trámite archivado estaba seleccionado, cerrarlo
    if (selectedTramite?.id === tramiteId) {
      setSelectedTramite(null);
    }
  };

  // Función para desarchivar un trámite
  const handleUnarchiveTramite = (tramiteId: string) => {
    const tramitesActualizados = tramites.map((t) =>
      t.id === tramiteId ? { ...t, archivado: false } : t
    );
    setTramites(tramitesActualizados);
    localStorage.setItem(
      `tramites_${userData.id}`,
      JSON.stringify(tramitesActualizados)
    );
  };

  // Función para simular la aprobación del notario
  const handleNotaryApproval = () => {
    if (!selectedTramite) return;

    const tramiteAprobado: Tramite = {
      ...selectedTramite,
      estado: "firma",
      etapaActual: "Documentos aprobados",
      siguienteEtapa: "Firma de documentos",
      progreso: Math.min(selectedTramite.progreso + 20, 100), // 20% por aprobación
    };

    // Marcar todos los documentos del trámite como aprobados
    const documentosActualizados = tramiteAprobado.documentos.map((doc) => ({
      ...doc,
      estado: "aprobado" as const,
    }));

    // Actualizar el trámite con los documentos aprobados
    tramiteAprobado.documentos = documentosActualizados;

    // Actualizar trámite
    const tramitesActualizados = tramites.map((t) =>
      t.id === selectedTramite.id ? tramiteAprobado : t
    );
    setTramites(tramitesActualizados);
    localStorage.setItem(
      `tramites_${userData.id}`,
      JSON.stringify(tramitesActualizados)
    );

    setSelectedTramite(tramiteAprobado);
    setShowReviewModal(false);
    setShowApprovalModal(true);
  };

  // Función para manejar fechas
  const handleDateChange = (campo: string, date: Date | undefined) => {
    if (date) {
      const formattedDate = date.toLocaleDateString("es-MX");
      setDateInputs((prev) => ({ ...prev, [campo]: formattedDate }));
      handleDataChange(campo, formattedDate);
    }
  };

  // Función para procesar pago
  const handlePayment = () => {
    if (!selectedTramite) return;

    const tramiteActualizado: Tramite = {
      ...selectedTramite,
      estado: "en_proceso",
      etapaActual: "Documentos y datos completados",
      siguienteEtapa: "Revisión notarial",
      progreso: Math.min(selectedTramite.progreso + 20, 100),
      pagado: true,
      pagoParcial: 12500, // 50% del costo total
    };

    setSelectedTramite(tramiteActualizado);
    setPaymentRequired(false);
    setPaymentBlocked(false);

    const tramitesActualizados = tramites.map((t) =>
      t.id === selectedTramite.id ? tramiteActualizado : t
    );
    setTramites(tramitesActualizados);
    localStorage.setItem(
      `tramites_${userData.id}`,
      JSON.stringify(tramitesActualizados)
    );

    setShowPaymentModal(false);
    alert(
      "¡Pago procesado exitosamente! Ahora puedes continuar con tu trámite. Se ha desbloqueado la funcionalidad de documentos y datos personales."
    );
  };

  // Función para verificar si es campo de fecha
  const isDateField = (fieldName: string) => {
    const lowerField = fieldName.toLowerCase();
    return (
      lowerField.includes("fecha") ||
      (lowerField.includes("nacimiento") && !lowerField.includes("lugar")) ||
      lowerField.includes("date")
    );
  };

  // Función para verificar si el pago es requerido
  const checkPaymentRequired = (tramite: Tramite) => {
    // Pago requerido al 40% de progreso (después de subir algunos documentos)
    if (tramite.progreso >= 40 && tramite.progreso < 60 && !tramite.pagado) {
      setPaymentRequired(true);
      setPaymentBlocked(true);
      return true;
    }
    return false;
  };

  // Función para verificar si puede subir documentos
  const canUploadDocuments = (tramite: Tramite) => {
    // Permitir subir documentos solo hasta el 25% sin pago
    if (tramite.progreso < 25) return true;

    // Después del 25%, requiere pago
    if (tramite.progreso >= 25 && tramite.pagado) return true;

    return false;
  };

  // Función para verificar si puede continuar con el trámite
  const canContinueTramite = (tramite: Tramite) => {
    // Si no ha pagado y ha alcanzado el 25%, no puede continuar
    if (tramite.progreso >= 25 && !tramite.pagado) return false;

    return true;
  };

  // Función para generar citas disponibles
  const generateAvailableAppointments = (page: number = 0) => {
    const appointments = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 1 + page * 3); // Empezar desde mañana + offset por página

    const horarios = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

    for (let i = 0; i < 3; i++) {
      const fecha = new Date(startDate);
      fecha.setDate(startDate.getDate() + i);

      const horario = horarios[Math.floor(Math.random() * horarios.length)];

      appointments.push({
        id: `appointment-${page}-${i}`,
        fecha: fecha.toLocaleDateString("es-MX", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        hora: horario,
        disponible: Math.random() > 0.3, // 70% de probabilidad de estar disponible
      });
    }

    return appointments;
  };

  // Función para manejar la visualización de documentos revisados
  const handleDocumentView = (documento: Documento) => {
    // Solo mostrar modal de citas si el trámite está en estado "revision_notario" o "firma" y el documento está aprobado
    if (
      documento.estado === "aprobado" &&
      selectedTramite &&
      (selectedTramite.estado === "revision_notario" ||
        selectedTramite.estado === "firma")
    ) {
      const appointments = generateAvailableAppointments(appointmentPage);
      setAvailableAppointments(appointments);
      setShowSignatureAppointmentModal(true);
      return;
    }

    // Si no está revisado o no es el estado correcto, abrir normalmente
    if (documento.url) {
      window.open(documento.url, "_blank");
    }
  };

  // Separar trámites en pendientes y archivados
  const tramitesPendientes = tramites.filter((tramite) => !tramite.archivado);

  const tramitesArchivados = tramites.filter(
    (tramite) => tramite.archivado === true
  );

  const tramitesFiltrados = TRAMITES_DISPONIBLES.filter(
    (tramite) =>
      tramite.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tramite.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBulkUpload = async (files: FileList) => {
    setIsUploading(true);
    setUploadProgress(0);
    setProcessingStatus("Subiendo documentos...");

    const newDocuments: Documento[] = [];
    const totalFiles = files.length;

    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];
      const progress = Math.round(((i + 1) / totalFiles) * 100);
      setUploadProgress(progress);

      // Simular subida de archivo
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newDoc: Documento = {
        id: Date.now().toString() + i,
        nombre: file.name,
        tipo: "Pendiente de clasificación",
        fechaSubida: new Date().toISOString(),
        estado: "revisando",
        url: URL.createObjectURL(file),
      };

      newDocuments.push(newDoc);
    }

    // Actualizar documentos
    const updatedDocs = [...documentos, ...newDocuments];
    setDocumentos(updatedDocs);
    localStorage.setItem(
      `documentos_${userData.id}`,
      JSON.stringify(updatedDocs)
    );

    setProcessingStatus("Procesando con OCR y clasificando...");

    // Simular procesamiento con OCR
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simular clasificación automática
    const classifiedDocs = newDocuments.map((doc) => {
      const fileName = doc.nombre.toLowerCase();
      let tipo = "Otros";

      if (
        fileName.includes("identificacion") ||
        fileName.includes("ine") ||
        fileName.includes("pasaporte")
      ) {
        tipo = "Identificación";
      } else if (
        fileName.includes("domicilio") ||
        fileName.includes("comprobante")
      ) {
        tipo = "Domicilio";
      } else if (
        fileName.includes("escritura") ||
        fileName.includes("titulo")
      ) {
        tipo = "Propiedad";
      } else if (fileName.includes("avaluo") || fileName.includes("avaluo")) {
        tipo = "Avalúo";
      } else if (
        fileName.includes("bienes") ||
        fileName.includes("inventario")
      ) {
        tipo = "Bienes";
      } else if (
        fileName.includes("beneficiario") ||
        fileName.includes("heredero")
      ) {
        tipo = "Beneficiarios";
      }

      return {
        ...doc,
        tipo,
        estado: "aprobado" as const,
      };
    });

    // Actualizar con documentos clasificados
    const finalDocs = [...documentos, ...classifiedDocs];
    setDocumentos(finalDocs);
    localStorage.setItem(
      `documentos_${userData.id}`,
      JSON.stringify(finalDocs)
    );

    setIsUploading(false);
    setUploadProgress(0);
    setProcessingStatus("");
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleBulkUpload(files);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del Portal */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-emerald-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Portal Privado
                </h1>
                <p className="text-sm text-gray-600">
                  Bienvenido, {userData.nombre}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={onLogout} variant="outline">
                Cerrar Sesión
              </Button>
              <Button
                onClick={() => {
                  if (
                    confirm(
                      "¿Estás seguro de que quieres resetear todos los datos? Esta acción no se puede deshacer."
                    )
                  ) {
                    // Limpiar localStorage
                    localStorage.removeItem(`tramites_${userData.id}`);
                    localStorage.removeItem(`documentos_${userData.id}`);
                    localStorage.removeItem("userData");
                    localStorage.removeItem("isAuthenticated");

                    // Resetear estados
                    setTramites([]);
                    setDocumentos([]);
                    setSelectedTramite(null);
                    setShowNuevoTramite(false);
                    setShowPaymentModal(false);
                    setShowSignatureAppointmentModal(false);
                    setShowArchived(false);

                    alert(
                      "¡Datos reseteados exitosamente! La página se recargará."
                    );
                    window.location.reload();
                  }
                }}
                variant="destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Resetear Datos
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tramites">Mis Trámites</TabsTrigger>
            <TabsTrigger value="perfil">Mi Perfil</TabsTrigger>
          </TabsList>

          {/* Mis Trámites */}
          <TabsContent value="tramites" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold">Mis Trámites</h2>
                <div className="flex gap-2">
                  <Button
                    variant={!showArchived ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowArchived(false)}
                  >
                    Pendientes ({tramitesPendientes.length})
                  </Button>
                  <Button
                    variant={showArchived ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowArchived(true)}
                  >
                    Archivados ({tramitesArchivados.length})
                  </Button>
                </div>
              </div>
              <Button
                onClick={() => setShowNuevoTramite(true)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Iniciar Trámite
              </Button>
            </div>

            {/* Trámites en Proceso o Archivados */}
            {(showArchived ? tramitesArchivados : tramitesPendientes).length >
            0 ? (
              <div className="space-y-4">
                {(showArchived ? tramitesArchivados : tramitesPendientes).map(
                  (tramite) => (
                    <Card
                      key={tramite.id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedTramite(tramite)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                              <FileText className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">
                                {tramite.nombre}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {tramite.descripcion}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Iniciado:{" "}
                                {new Date(
                                  tramite.fechaInicio
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge className={getEstadoColor(tramite.estado)}>
                              {getEstadoTexto(tramite.estado)}
                            </Badge>
                            <div className="text-right">
                              <div className="text-sm font-medium">
                                {tramite.progreso}%
                              </div>
                              <Progress
                                value={tramite.progreso}
                                className="w-20"
                              />
                            </div>
                            {tramite.progreso >= 100 && !showArchived && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleArchiveTramite(tramite.id);
                                }}
                                className="text-gray-600 hover:text-gray-800"
                              >
                                <Archive className="h-4 w-4 mr-1" />
                                Archivar
                              </Button>
                            )}
                            {showArchived && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUnarchiveTramite(tramite.id);
                                }}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Archive className="h-4 w-4 mr-1" />
                                Restaurar
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            {getEtapaDescripcion(tramite.estado)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {showArchived
                        ? "No tienes trámites archivados"
                        : "No tienes trámites pendientes"}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {showArchived
                        ? "Los trámites completados aparecerán aquí."
                        : "Inicia un nuevo trámite notarial para comenzar el proceso"}
                    </p>
                    {!showArchived && (
                      <Button
                        onClick={() => setShowNuevoTramite(true)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Iniciar Trámite
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Modal para seleccionar nuevo trámite */}
            {showNuevoTramite && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">Seleccionar Trámite</h3>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowNuevoTramite(false);
                        setSearchTerm("");
                      }}
                    >
                      ✕
                    </Button>
                  </div>

                  {/* Buscador */}
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar trámite por nombre o descripción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-12 text-lg"
                      />
                    </div>
                    {searchTerm && (
                      <p className="text-sm text-gray-600 mt-2">
                        {tramitesFiltrados.length} trámite(s) encontrado(s)
                      </p>
                    )}
                  </div>

                  {/* Lista de trámites */}
                  <div className="space-y-4">
                    {tramitesFiltrados.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tramitesFiltrados.map((tramite) => (
                          <Card
                            key={tramite.id}
                            className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-emerald-300"
                            onClick={() => iniciarTramite(tramite.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <h4 className="font-semibold text-lg leading-tight">
                                  {tramite.nombre}
                                </h4>
                                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                  <FileText className="h-4 w-4 text-emerald-600" />
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {tramite.descripcion}
                              </p>
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-emerald-600">
                                  {tramite.costo}
                                </p>
                                <Button
                                  size="sm"
                                  className="bg-emerald-600 hover:bg-emerald-700"
                                >
                                  Seleccionar
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                          No se encontraron trámites
                        </h4>
                        <p className="text-gray-600 mb-4">
                          Intenta con otros términos de búsqueda
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setSearchTerm("")}
                        >
                          Limpiar búsqueda
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Vista Detallada del Trámite */}
          {selectedTramite && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">
                    {selectedTramite.nombre}
                  </h3>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedTramite(null)}
                  >
                    ✕
                  </Button>
                </div>

                {/* Barra de Progreso Superior */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      Progreso del Trámite
                    </span>
                    <span className="text-sm text-gray-600">
                      {selectedTramite.progreso}%
                    </span>
                  </div>
                  <Progress
                    value={selectedTramite.progreso}
                    className="w-full h-3"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Iniciado</span>
                    <span>Documentos</span>
                    <span>Datos</span>
                    <span>Revisión</span>
                    <span>Firma</span>
                    <span>Completado</span>
                  </div>
                </div>

                {/* Bloqueo de Pago */}
                {!canContinueTramite(selectedTramite) && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-600 text-sm font-bold">
                            !
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-red-800">
                          Pago Requerido para Continuar
                        </h3>
                        <p className="text-sm text-red-700 mt-1">
                          Para poder continuar con tu trámite, necesitas
                          realizar un pago de al menos el 50% del costo total.
                        </p>
                        <div className="mt-3">
                          <Button
                            onClick={() => setShowPaymentModal(true)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            <DollarSign className="h-4 w-4 mr-2" />
                            Realizar Pago Ahora
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Tabs defaultValue="estado" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="estado">Estado</TabsTrigger>
                    <TabsTrigger
                      value="documentos"
                      disabled={!canContinueTramite(selectedTramite)}
                    >
                      Documentos
                    </TabsTrigger>
                    <TabsTrigger
                      value="datos"
                      disabled={!canContinueTramite(selectedTramite)}
                    >
                      Datos Personales
                    </TabsTrigger>
                  </TabsList>

                  {/* Datos Personales */}
                  <TabsContent value="datos" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Información Personal</CardTitle>
                        <CardDescription>
                          Los datos se han extraído automáticamente de tus
                          documentos. Revisa y completa la información faltante.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedTramite.datosRequeridos.map(
                            (dato, index) => {
                              // Simular datos extraídos por OCR
                              const valorOCR = getOCRExtractedValue(
                                dato,
                                selectedTramite.nombre
                              );
                              const isDate = isDateField(dato);
                              const isEstadoCivil = dato
                                .toLowerCase()
                                .includes("estado civil");

                              return (
                                <div key={index} className="space-y-2">
                                  <label className="text-sm font-medium">
                                    {dato}
                                  </label>
                                  {isDate ? (
                                    <Input
                                      type="date"
                                      placeholder={`Selecciona ${dato.toLowerCase()}`}
                                      defaultValue={valorOCR}
                                      onChange={(e) =>
                                        handleDataChange(dato, e.target.value)
                                      }
                                    />
                                  ) : isEstadoCivil ? (
                                    <Select
                                      defaultValue={valorOCR}
                                      onValueChange={(value) =>
                                        handleDataChange(dato, value)
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecciona estado civil" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Soltero">
                                          Soltero
                                        </SelectItem>
                                        <SelectItem value="Casado">
                                          Casado
                                        </SelectItem>
                                        <SelectItem value="Divorciado">
                                          Divorciado
                                        </SelectItem>
                                        <SelectItem value="Viudo">
                                          Viudo
                                        </SelectItem>
                                        <SelectItem value="Unión libre">
                                          Unión libre
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <Input
                                      placeholder={`Ingresa ${dato.toLowerCase()}`}
                                      defaultValue={valorOCR}
                                      onChange={(e) =>
                                        handleDataChange(dato, e.target.value)
                                      }
                                    />
                                  )}
                                  {valorOCR && (
                                    <p className="text-xs text-green-600 flex items-center gap-1">
                                      <CheckCircle className="h-3 w-3" />
                                      Extraído automáticamente
                                    </p>
                                  )}
                                </div>
                              );
                            }
                          )}
                        </div>
                        <div className="mt-6 flex gap-3">
                          <Button
                            className="bg-emerald-600 hover:bg-emerald-700"
                            onClick={handleSaveData}
                          >
                            Guardar Datos
                          </Button>
                          {selectedTramite.progreso >= 60 && (
                            <Button
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => setShowPaymentModal(true)}
                            >
                              Proceder al Pago
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Estado del Trámite */}
                  <TabsContent value="estado" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Estado del Trámite</CardTitle>
                        <CardDescription>
                          Seguimiento del progreso de tu trámite
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <h4 className="font-medium mb-2">Etapa Actual</h4>
                              <p className="text-sm text-gray-600">
                                {selectedTramite.etapaActual}
                              </p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <h4 className="font-medium mb-2">
                                Siguiente Etapa
                              </h4>
                              <p className="text-sm text-gray-600">
                                {selectedTramite.siguienteEtapa}
                              </p>
                            </div>
                          </div>

                          <div className="p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-medium mb-2 text-blue-900">
                              Estado Actual
                            </h4>
                            <p className="text-sm text-blue-700">
                              {getEtapaDescripcion(selectedTramite.estado)}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 border rounded-lg">
                              <h4 className="font-medium mb-2">
                                Fecha de Inicio
                              </h4>
                              <p className="text-sm text-gray-600">
                                {new Date(
                                  selectedTramite.fechaInicio
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="p-4 border rounded-lg">
                              <h4 className="font-medium mb-2">
                                Fecha Estimada
                              </h4>
                              <p className="text-sm text-gray-600">
                                {new Date(
                                  selectedTramite.fechaEstimada
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="p-4 bg-emerald-50 rounded-lg">
                            <h4 className="font-medium mb-2 text-emerald-900">
                              Documentos Completados
                            </h4>
                            <p className="text-sm text-emerald-700">
                              {
                                selectedTramite.documentos.filter(
                                  (d) => d.estado === "aprobado"
                                ).length
                              }{" "}
                              de {selectedTramite.documentosRequeridos.length}{" "}
                              documentos subidos
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Documentos */}
                  <TabsContent value="documentos" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Documentos Requeridos</CardTitle>
                        <CardDescription>
                          Sube los documentos necesarios para tu trámite. Los
                          datos se extraerán automáticamente con OCR.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Botón para heredar documentos */}
                          {tramites.length > 1 && (
                            <div className="p-4 bg-yellow-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium text-yellow-900">
                                    Herencia de Documentos
                                  </h4>
                                  <p className="text-sm text-yellow-700">
                                    Puedes reutilizar documentos de otros
                                    trámites
                                  </p>
                                </div>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    // Función para heredar documentos con clasificación inteligente
                                    const documentosHeredados = tramites
                                      .filter(
                                        (t) => t.id !== selectedTramite.id
                                      )
                                      .flatMap((t) => t.documentos)
                                      .filter((d) => d.estado === "aprobado");

                                    // Clasificar y filtrar documentos que correspondan al trámite actual
                                    const documentosCompatibles =
                                      documentosHeredados.filter((doc) => {
                                        const tipoLower =
                                          doc.tipo.toLowerCase();
                                        const documentosRequeridosLower =
                                          selectedTramite.documentosRequeridos.map(
                                            (d) => d.toLowerCase()
                                          );

                                        // Mapeo inteligente de palabras clave
                                        const mapeoDocumentos = {
                                          identificacion: [
                                            "identificacion",
                                            "identidad",
                                            "credencial",
                                            "licencia",
                                            "pasaporte",
                                            "cédula",
                                            "cedula",
                                            "ine",
                                            "ife",
                                          ],
                                          domicilio: [
                                            "domicilio",
                                            "comprobante domicilio",
                                            "servicio",
                                            "luz",
                                            "agua",
                                            "telefono",
                                            "teléfono",
                                            "gas",
                                            "predial",
                                            "cfe",
                                          ],
                                          nacimiento: [
                                            "nacimiento",
                                            "acta nacimiento",
                                            "certificado nacimiento",
                                            "partida nacimiento",
                                          ],
                                          estado: [
                                            "estado civil",
                                            "acta matrimonio",
                                            "acta divorcio",
                                            "certificado solteria",
                                            "constancia soltero",
                                          ],
                                          curp: [
                                            "curp",
                                            "clave única",
                                            "clave unica",
                                          ],
                                          rfc: [
                                            "rfc",
                                            "registro federal",
                                            "homoclave",
                                          ],
                                          comprobante: [
                                            "comprobante",
                                            "ingresos",
                                            "sueldo",
                                            "salario",
                                            "nómina",
                                            "nomina",
                                            "recibo",
                                          ],
                                          acta: [
                                            "acta",
                                            "partida",
                                            "certificado",
                                          ],
                                          certificado: [
                                            "certificado",
                                            "diploma",
                                            "título",
                                            "titulo",
                                          ],
                                          constancia: [
                                            "constancia",
                                            "carta",
                                            "oficio",
                                          ],
                                        };

                                        // Buscar coincidencias inteligentes
                                        for (const [
                                          tipoDoc,
                                          palabrasClave,
                                        ] of Object.entries(mapeoDocumentos)) {
                                          for (const palabra of palabrasClave) {
                                            if (tipoLower.includes(palabra)) {
                                              // Verificar si este tipo de documento es requerido en el trámite actual
                                              const esRequerido =
                                                documentosRequeridosLower.some(
                                                  (req) =>
                                                    req.includes(tipoDoc) ||
                                                    req.includes(palabra) ||
                                                    palabrasClave.some((p) =>
                                                      req.includes(p)
                                                    )
                                                );
                                              if (esRequerido) {
                                                console.log(
                                                  `Documento heredado: "${doc.nombre}" -> "${tipoDoc}" (compatible)`
                                                );
                                                return true;
                                              }
                                            }
                                          }
                                        }

                                        // Buscar coincidencias directas
                                        const esCompatible =
                                          documentosRequeridosLower.some(
                                            (req) =>
                                              tipoLower.includes(req) ||
                                              req.includes(tipoLower) ||
                                              tipoLower === req
                                          );

                                        if (esCompatible) {
                                          console.log(
                                            `Documento heredado: "${doc.nombre}" -> coincidencia directa`
                                          );
                                          return true;
                                        }

                                        console.log(
                                          `Documento no compatible: "${doc.nombre}" (${doc.tipo})`
                                        );
                                        return false;
                                      });

                                    if (documentosCompatibles.length > 0) {
                                      // Calcular progreso basado en documentos heredados
                                      const documentosCompletados =
                                        selectedTramite.documentos.filter(
                                          (d) => d.estado === "aprobado"
                                        ).length + documentosCompatibles.length;
                                      const totalDocumentos =
                                        selectedTramite.documentosRequeridos
                                          .length;
                                      const progresoDocumentos = Math.min(
                                        (documentosCompletados /
                                          totalDocumentos) *
                                          25,
                                        25
                                      );

                                      const tramiteActualizado = {
                                        ...selectedTramite,
                                        documentos: [
                                          ...selectedTramite.documentos,
                                          ...documentosCompatibles,
                                        ],
                                        progreso: Math.max(
                                          progresoDocumentos,
                                          selectedTramite.progreso
                                        ),
                                      };

                                      setSelectedTramite(tramiteActualizado);

                                      const tramitesActualizados = tramites.map(
                                        (t) =>
                                          t.id === selectedTramite.id
                                            ? tramiteActualizado
                                            : t
                                      );
                                      setTramites(tramitesActualizados);
                                      localStorage.setItem(
                                        `tramites_${userData.id}`,
                                        JSON.stringify(tramitesActualizados)
                                      );

                                      alert(
                                        `Se heredaron ${documentosCompatibles.length} documentos compatibles de ${documentosHeredados.length} disponibles.`
                                      );
                                    } else {
                                      alert(
                                        "No se encontraron documentos compatibles para heredar."
                                      );
                                    }
                                  }}
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  Heredar Documentos
                                </Button>
                              </div>
                            </div>
                          )}

                          {selectedTramite.documentosRequeridos.map(
                            (doc, index) => {
                              const documentoSubido =
                                selectedTramite.documentos.find((d) => {
                                  const tipoLower = d.tipo.toLowerCase();
                                  const docNameLower = doc.toLowerCase();

                                  // Mapeo inteligente de palabras clave
                                  const mapeoDocumentos = {
                                    identificacion: [
                                      "identificacion",
                                      "identidad",
                                      "credencial",
                                      "licencia",
                                      "pasaporte",
                                      "cédula",
                                      "cedula",
                                      "ine",
                                      "ife",
                                    ],
                                    domicilio: [
                                      "domicilio",
                                      "comprobante domicilio",
                                      "servicio",
                                      "luz",
                                      "agua",
                                      "telefono",
                                      "teléfono",
                                      "gas",
                                      "predial",
                                      "cfe",
                                    ],
                                    nacimiento: [
                                      "nacimiento",
                                      "acta nacimiento",
                                      "certificado nacimiento",
                                      "partida nacimiento",
                                    ],
                                    estado: [
                                      "estado civil",
                                      "acta matrimonio",
                                      "acta divorcio",
                                      "certificado solteria",
                                      "constancia soltero",
                                    ],
                                    curp: [
                                      "curp",
                                      "clave única",
                                      "clave unica",
                                    ],
                                    rfc: [
                                      "rfc",
                                      "registro federal",
                                      "homoclave",
                                    ],
                                    comprobante: [
                                      "comprobante",
                                      "ingresos",
                                      "sueldo",
                                      "salario",
                                      "nómina",
                                      "nomina",
                                      "recibo",
                                    ],
                                    acta: ["acta", "partida", "certificado"],
                                    certificado: [
                                      "certificado",
                                      "diploma",
                                      "título",
                                      "titulo",
                                    ],
                                    constancia: [
                                      "constancia",
                                      "carta",
                                      "oficio",
                                    ],
                                  };

                                  // Buscar coincidencias inteligentes
                                  for (const [
                                    tipoDoc,
                                    palabrasClave,
                                  ] of Object.entries(mapeoDocumentos)) {
                                    for (const palabra of palabrasClave) {
                                      if (
                                        docNameLower.includes(palabra) &&
                                        tipoLower.includes(tipoDoc)
                                      ) {
                                        return true;
                                      }
                                    }
                                  }

                                  // Buscar coincidencias directas
                                  return (
                                    tipoLower === docNameLower ||
                                    tipoLower.includes(docNameLower) ||
                                    docNameLower.includes(tipoLower)
                                  );
                                });
                              return (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                                >
                                  <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-gray-500" />
                                    <div>
                                      <span className="font-medium">{doc}</span>
                                      {documentoSubido && (
                                        <p className="text-xs text-gray-500">
                                          Subido:{" "}
                                          {new Date(
                                            documentoSubido.fechaSubida
                                          ).toLocaleDateString()}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {documentoSubido ? (
                                      <>
                                        <Badge className="bg-green-100 text-green-800">
                                          Completado
                                        </Badge>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() =>
                                            handleDocumentView(documentoSubido)
                                          }
                                        >
                                          <Eye className="h-3 w-3" />
                                        </Button>
                                        <input
                                          type="file"
                                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                          onChange={(e) =>
                                            handleDocumentUpload(e, doc, index)
                                          }
                                          className="hidden"
                                          id={`replace-${index}`}
                                        />
                                        <label
                                          htmlFor={`replace-${index}`}
                                          className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs cursor-pointer"
                                        >
                                          Reemplazar
                                        </label>
                                      </>
                                    ) : (
                                      <>
                                        <Badge variant="outline">
                                          Pendiente
                                        </Badge>
                                        <input
                                          type="file"
                                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                          onChange={(e) =>
                                            handleDocumentUpload(e, doc, index)
                                          }
                                          className="hidden"
                                          id={`upload-${index}`}
                                        />
                                        <label
                                          htmlFor={`upload-${index}`}
                                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-xs cursor-pointer"
                                        >
                                          <Upload className="h-3 w-3 inline mr-1" />
                                          Subir
                                        </label>
                                      </>
                                    )}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>

                        {/* Subida en bulk */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                Subida Múltiple
                              </h4>
                              <p className="text-sm text-gray-600">
                                Sube varios documentos a la vez
                              </p>
                            </div>
                            <input
                              type="file"
                              multiple
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              onChange={(e) =>
                                e.target.files &&
                                handleBulkDocumentUpload(e.target.files)
                              }
                              className="hidden"
                              id="bulk-document-upload"
                            />
                            <label
                              htmlFor="bulk-document-upload"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-flex items-center gap-2"
                            >
                              <Upload className="h-4 w-4" />
                              Subir Múltiples
                            </label>
                          </div>

                          {/* Progreso de subida */}
                          {isUploading && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                  {processingStatus}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {uploadProgress}%
                                </span>
                              </div>
                              <Progress
                                value={uploadProgress}
                                className="w-full"
                              />
                            </div>
                          )}
                        </div>

                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">
                              Clasificación Inteligente + OCR
                            </span>
                          </div>
                          <p className="text-xs text-blue-700">
                            Los documentos se clasifican automáticamente por su
                            nombre y los datos personales se extraen usando
                            tecnología OCR.
                          </p>
                          <div className="mt-2 text-xs text-blue-600">
                            <p>
                              • Identificación: INE, IFE, Pasaporte, Licencia
                            </p>
                            <p>• Domicilio: CFE, Agua, Teléfono, Predial</p>
                            <p>• Nacimiento: Acta, Partida, Certificado</p>
                            <p>• Otros: CURP, RFC, Comprobantes</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}

          {/* Modal de Pago */}
          {showPaymentModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Procesar Pago</h3>
                  <Button
                    variant="outline"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Resumen del Trámite</h4>
                    <p className="text-sm text-gray-600">
                      {selectedTramite?.nombre}
                    </p>
                    <p className="text-sm text-gray-600">
                      Costo Total: {selectedTramite?.costo}
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2 text-blue-900">
                      Pago Parcial Requerido
                    </h4>
                    <p className="text-sm text-blue-700">
                      Has alcanzado el límite de documentos sin pago (25%). Para
                      continuar con el trámite, necesitas realizar un pago
                      parcial del 50% del costo total.
                    </p>
                    <p className="text-lg font-bold text-blue-900 mt-2">
                      Pago requerido: $12,500
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Métodos de Pago Disponibles</h4>

                    {/* Transferencia Bancaria */}
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <input
                          type="radio"
                          name="payment"
                          value="transfer"
                          id="transfer"
                        />
                        <label htmlFor="transfer" className="font-medium">
                          Transferencia Bancaria
                        </label>
                      </div>
                      <div className="ml-6 space-y-2 text-sm">
                        <div className="p-3 bg-gray-50 rounded">
                          <p className="font-medium">Banco: BBVA Bancomer</p>
                          <p>Cuenta: 0123456789</p>
                          <p>CLABE: 012345678901234567</p>
                          <p>Titular: Notaría Pública No. 3 de Tijuana</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded">
                          <p className="font-medium">Banco: Santander</p>
                          <p>Cuenta: 0145678901</p>
                          <p>CLABE: 014567890123456789</p>
                          <p>Titular: Notaría Pública No. 3 de Tijuana</p>
                        </div>
                        <p className="text-xs text-gray-600">
                          * Envía el comprobante de transferencia a:
                          pagos@notaria3tijuana.com
                        </p>
                      </div>
                    </div>

                    {/* Pago en Efectivo */}
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <input
                          type="radio"
                          name="payment"
                          value="cash"
                          id="cash"
                        />
                        <label htmlFor="cash" className="font-medium">
                          Pago en Efectivo (Oficina)
                        </label>
                      </div>
                      <div className="ml-6 space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Fecha preferida
                          </label>
                          <Input
                            type="date"
                            className="mt-1"
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Hora preferida
                          </label>
                          <select className="w-full mt-1 p-2 border rounded-lg bg-white">
                            <option value="">Selecciona una hora</option>
                            <option value="09:00">9:00 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="12:00">12:00 PM</option>
                            <option value="14:00">2:00 PM</option>
                            <option value="15:00">3:00 PM</option>
                            <option value="16:00">4:00 PM</option>
                            <option value="17:00">5:00 PM</option>
                          </select>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600">
                            <strong>Horarios disponibles:</strong>
                            <br />
                            Lunes a Viernes: 9:00 AM - 6:00 PM
                            <br />
                            Sábados: 9:00 AM - 2:00 PM
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Tarjeta de Crédito/Débito */}
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <input
                          type="radio"
                          name="payment"
                          value="card"
                          id="card"
                          defaultChecked
                        />
                        <label htmlFor="card" className="font-medium">
                          Tarjeta de Crédito/Débito
                        </label>
                      </div>
                      <div className="ml-6 text-sm text-gray-600">
                        <p>Procesamiento seguro con Stripe</p>
                        <p className="text-xs">
                          Aceptamos Visa, Mastercard, American Express
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      onClick={handlePayment}
                    >
                      Confirmar Pago
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowPaymentModal(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal de Revisión por Notario */}
          {showReviewModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Revisión en Proceso</h3>
                  <Button
                    variant="outline"
                    onClick={() => setShowReviewModal(false)}
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-bold">
                          ⏳
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-900">
                          Información enviada para revisión
                        </h4>
                        <p className="text-sm text-blue-700">
                          El Lic. Carlos Mendoza está revisando tu información y
                          documentos.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                      <span className="text-sm">Verificando documentos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-100 rounded-full"></div>
                      <span className="text-sm text-gray-500">
                        Validando datos personales
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-100 rounded-full"></div>
                      <span className="text-sm text-gray-500">
                        Preparando para firma
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowReviewModal(false)}
                      className="flex-1"
                    >
                      Cerrar
                    </Button>
                    <Button
                      onClick={handleNotaryApproval}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      Simular Aprobación
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal de Aprobación */}
          {showApprovalModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">¡Documentos Aprobados!</h3>
                  <Button
                    variant="outline"
                    onClick={() => setShowApprovalModal(false)}
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm font-bold">
                          ✓
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-green-900">
                          Revisión completada
                        </h4>
                        <p className="text-sm text-green-700">
                          El Lic. Carlos Mendoza ha aprobado todos tus
                          documentos. Ahora puedes agendar tu cita para la
                          firma.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      </div>
                      <span className="text-sm">Documentos verificados</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      </div>
                      <span className="text-sm">
                        Datos personales validados
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      </div>
                      <span className="text-sm">Listo para firma</span>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">
                      <strong>Próximo paso:</strong> Haz clic en "Agendar Cita
                      Ahora" para ver las opciones disponibles de citas para la
                      firma de tus documentos.
                    </p>
                  </div>

                  <Button
                    onClick={() => {
                      setShowApprovalModal(false);
                      // Abrir automáticamente el modal de citas
                      const appointments = generateAvailableAppointments(0);
                      setAvailableAppointments(appointments);
                      setShowSignatureAppointmentModal(true);
                    }}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Agendar Cita Ahora
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Modal de Citas para Firma */}
          {showSignatureAppointmentModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">
                    Cita para Firma de Documentos
                  </h3>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowSignatureAppointmentModal(false);
                      setSelectedAppointment("");
                      setAppointmentPage(0);
                    }}
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm font-bold">
                          ✓
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-green-900">
                          ¡Tu documento ya fue revisado!
                        </h4>
                        <p className="text-sm text-green-700">
                          Tu documento está listo para firma. Selecciona una de
                          las citas disponibles:
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">
                      Citas Disponibles
                    </h4>

                    <div className="grid gap-3">
                      {availableAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedAppointment === appointment.id
                              ? "border-blue-500 bg-blue-50"
                              : appointment.disponible
                              ? "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                              : "border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed"
                          }`}
                          onClick={() => {
                            if (appointment.disponible) {
                              setSelectedAppointment(appointment.id);
                            }
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-4 h-4 rounded-full border-2 ${
                                  selectedAppointment === appointment.id
                                    ? "border-blue-500 bg-blue-500"
                                    : "border-gray-300"
                                }`}
                              >
                                {selectedAppointment === appointment.id && (
                                  <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {appointment.fecha}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {appointment.hora}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {appointment.disponible ? (
                                <Badge className="bg-green-100 text-green-800">
                                  Disponible
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-gray-500"
                                >
                                  Ocupado
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {availableAppointments.filter((a) => a.disponible)
                      .length === 0 && (
                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-yellow-700">
                          No hay citas disponibles en estas fechas. Busca otras
                          opciones.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const newPage = appointmentPage + 1;
                        setAppointmentPage(newPage);
                        const newAppointments =
                          generateAvailableAppointments(newPage);
                        setAvailableAppointments(newAppointments);
                        setSelectedAppointment("");
                      }}
                      className="flex-1"
                    >
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Buscar Otras Fechas
                    </Button>

                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      disabled={!selectedAppointment}
                      onClick={() => {
                        const appointment = availableAppointments.find(
                          (a) => a.id === selectedAppointment
                        );
                        if (appointment && selectedTramite) {
                          // Actualizar el estado del trámite a "en_espera_firma"
                          const tramitesActualizados = tramites.map((t) =>
                            t.id === selectedTramite.id
                              ? {
                                  ...t,
                                  estado: "en_espera_firma" as const,
                                  etapaActual: "Cita agendada para firma",
                                  siguienteEtapa: "Firma de documentos",
                                }
                              : t
                          );
                          setTramites(tramitesActualizados);
                          localStorage.setItem(
                            `tramites_${userData.id}`,
                            JSON.stringify(tramitesActualizados)
                          );

                          setShowSignatureAppointmentModal(false);
                          setSelectedAppointment("");
                          setAppointmentPage(0);
                          alert(
                            `¡Cita agendada exitosamente!\n\nFecha: ${appointment.fecha}\nHora: ${appointment.hora}\n\nTe enviaremos un recordatorio por WhatsApp y correo electrónico.`
                          );
                        }
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirmar Cita
                    </Button>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">
                      <strong>Nota:</strong> Una vez confirmada tu cita,
                      recibirás un recordatorio 24 horas antes por WhatsApp y
                      correo electrónico. Si necesitas reagendar, puedes hacerlo
                      con al menos 2 horas de anticipación.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mi Perfil */}
          <TabsContent value="perfil" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>
                  Gestiona tu información de cuenta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Nombre Completo
                    </label>
                    <div className="flex items-center gap-2 p-3 border rounded-lg">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{userData.nombre}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Correo Electrónico
                    </label>
                    <div className="flex items-center gap-2 p-3 border rounded-lg">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{userData.email}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Teléfono</label>
                    <div className="flex items-center gap-2 p-3 border rounded-lg">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{userData.telefono}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Tipo de Usuario
                    </label>
                    <div className="flex items-center gap-2 p-3 border rounded-lg">
                      {userData.tipoUsuario === "empresarial" ? (
                        <Building className="h-4 w-4 text-gray-500" />
                      ) : (
                        <User className="h-4 w-4 text-gray-500" />
                      )}
                      <span className="capitalize">{userData.tipoUsuario}</span>
                    </div>
                  </div>
                  {userData.empresa && (
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Empresa</label>
                      <div className="flex items-center gap-2 p-3 border rounded-lg">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span>{userData.empresa}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="pt-4">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Información
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
