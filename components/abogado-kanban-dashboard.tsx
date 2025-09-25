"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  MessageSquare,
  Filter,
  Search,
  User,
  Home,
  DollarSign,
  Calendar,
  MoreHorizontal,
  Plus,
  Edit3,
  Trash2,
  ArrowUpDown,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Send,
  Shield,
  TrendingUp,
  Users,
  Building,
    XCircle,
    ArrowLeft,
    ArrowRight,
    FileEdit,
    Download,
    Printer,
    MapPin,
} from "lucide-react";
import {
  ExpedienteCompraventa,
  EstadoExpediente,
  ESTADOS_FLUJO,
  getExpedientesByEstado,
  getExpedientesByAbogado,
  updateExpedienteEstado,
  addComentarioExpediente,
} from "@/lib/expedientes-data";
import { expedientesMock } from "@/lib/expedientes-data";
import {
  aiValidationService,
  ExpedienteValidationReport,
} from "@/lib/ai-validation-service";

interface AbogadoKanbanDashboardProps {
  licenciadoId: string;
}

interface KanbanColumn {
  id: EstadoExpediente;
  title: string;
  color: string;
  icon: React.ReactNode;
}

const KANBAN_COLUMNS: KanbanColumn[] = [
  {
    id: "EXPEDIENTE_PRELIMINAR",
    title: "Expediente preliminar",
    color: "bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-md rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300",
    icon: null,
  },
  {
    id: "PROYECTO_ESCRITURA",
    title: "Proyecto de escritura",
    color: "bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-md rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300",
    icon: null,
  },
  {
    id: "LISTO_PARA_FIRMA",
    title: "Firma agendada",
    color: "bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-md rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300",
    icon: null,
  },
  {
    id: "COMPLETADO",
    title: "Post firma",
    color: "bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-md rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300",
    icon: null,
  },
];

const TRAMITE_TYPES = [
  {
    id: "todos",
    name: "Todos",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "compraventa",
    name: "Compraventas",
    icon: <Home className="h-4 w-4" />,
  },
  {
    id: "testamento",
    name: "Testamentos",
    icon: <FileText className="h-4 w-4" />,
  },
  { id: "donacion", name: "Donaciones", icon: <Users className="h-4 w-4" /> },
  { id: "permutas", name: "Permutas", icon: <Building className="h-4 w-4" /> },
  {
    id: "creditos_hipotecarios",
    name: "Créditos Hipotecarios",
    icon: <DollarSign className="h-4 w-4" />,
  },
  { id: "poderes", name: "Poderes", icon: <Shield className="h-4 w-4" /> },
  {
    id: "otros",
    name: "Otros",
    icon: <FileText className="h-4 w-4" />,
    submenu: [
      {
        id: "mutuo",
        name: "Contrato de Mutuo",
        icon: <DollarSign className="h-3 w-3" />,
      },
      {
        id: "adeudo",
        name: "Reconocimiento de Adeudo",
        icon: <FileText className="h-3 w-3" />,
      },
      {
        id: "adjudicaciones_hereditarias",
        name: "Adjudicaciones Hereditarias",
        icon: <Users className="h-3 w-3" />,
      },
      {
        id: "adjudicaciones",
        name: "Adjudicaciones",
        icon: <Building className="h-3 w-3" />,
      },
      {
        id: "sociedades",
        name: "Constitución de Sociedades",
        icon: <Building className="h-3 w-3" />,
      },
      {
        id: "liquidacion_copropiedad",
        name: "Liquidación de Copropiedad",
        icon: <Building className="h-3 w-3" />,
      },
      {
        id: "cesion_derechos",
        name: "Cesión de Derechos",
        icon: <FileText className="h-3 w-3" />,
      },
      {
        id: "servidumbre",
        name: "Constitución de Servidumbre",
        icon: <Building className="h-3 w-3" />,
      },
      {
        id: "convenios_modificatorios",
        name: "Convenios Modificatorios",
        icon: <FileText className="h-3 w-3" />,
      },
      {
        id: "elevacion_judicial",
        name: "Elevación judicial a escritura pública",
        icon: <FileText className="h-3 w-3" />,
      },
      {
        id: "dacion_pago",
        name: "Dación en pago",
        icon: <DollarSign className="h-3 w-3" />,
      },
      {
        id: "formalizacion_contrato",
        name: "Formalización de contrato privado",
        icon: <FileText className="h-3 w-3" />,
      },
      {
        id: "fideicomisos",
        name: "Fideicomisos",
        icon: <Shield className="h-3 w-3" />,
      },
      {
        id: "inicio_sucesion",
        name: "Inicio de Sucesión",
        icon: <Users className="h-3 w-3" />,
      },
      {
        id: "cancelacion_hipoteca",
        name: "Cancelación de Hipoteca",
        icon: <DollarSign className="h-3 w-3" />,
      },
      {
        id: "protocolizacion_acta",
        name: "Protocolización de Acta de Asamblea",
        icon: <FileText className="h-3 w-3" />,
      },
      {
        id: "cambio_regimen_matrimonial",
        name: "Cambio de Régimen Matrimonial",
        icon: <Users className="h-3 w-3" />,
      },
      {
        id: "cotejos",
        name: "Cotejos",
        icon: <FileText className="h-3 w-3" />,
      },
      {
        id: "fe_hechos",
        name: "Fe de Hechos",
        icon: <FileText className="h-3 w-3" />,
      },
      {
        id: "rectificacion_escrituras",
        name: "Rectificación de Escrituras",
        icon: <FileText className="h-3 w-3" />,
      },
    ],
  },
];

export function AbogadoKanbanDashboard({
  licenciadoId,
}: AbogadoKanbanDashboardProps) {
  const [expedientes, setExpedientes] = useState<ExpedienteCompraventa[]>([]);
  const [filteredExpedientes, setFilteredExpedientes] = useState<
    ExpedienteCompraventa[]
  >([]);
  const [selectedTramiteTypes, setSelectedTramiteTypes] = useState<string[]>(["todos"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExpediente, setSelectedExpediente] =
    useState<ExpedienteCompraventa | null>(null);
  const [showExpedienteModal, setShowExpedienteModal] = useState(false);
  const [showComentarioModal, setShowComentarioModal] = useState(false);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [tipoComentario, setTipoComentario] = useState<
    "general" | "observacion" | "requerimiento"
  >("general");
  const [showContactModal, setShowContactModal] = useState(false);
  const [showValidatedDocuments, setShowValidatedDocuments] = useState(false);
  const [draggedExpediente, setDraggedExpediente] = useState<string | null>(
    null
  );
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentModalData, setPaymentModalData] = useState<{
    expediente: ExpedienteCompraventa | null;
    saldoPendiente: number;
    total: number;
  }>({ expediente: null, saldoPendiente: 0, total: 0 });
  const [validationReports, setValidationReports] = useState<
    Record<string, ExpedienteValidationReport>
  >({});
  const [validatingExpedientes, setValidatingExpedientes] = useState<
    Set<string>
  >(new Set());
  const [forceUpdate, setForceUpdate] = useState(0);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [documentStates, setDocumentStates] = useState<Record<string, Record<string, string>>>({});
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [highlightedText, setHighlightedText] = useState("");
  const [contractApprovals, setContractApprovals] = useState<Record<string, {
    comprador: boolean;
    vendedor: boolean;
    notificacionesEnviadas: boolean;
  }>>({});
  const [tramitePagado, setTramitePagado] = useState<Record<string, boolean>>({});
  const [fechasFirmaProgramadas, setFechasFirmaProgramadas] = useState<Record<string, {
    fecha: string;
    hora: string;
    lugar: string;
    sala: string;
  }>>({
    // Datos demostrativos para expedientes en LISTO_PARA_FIRMA
    'exp-001': {
      fecha: '2024-09-29',
      hora: '10:00',
      lugar: 'Notaría #3 - Oficina Principal',
      sala: 'Sala de Juntas A'
    }
  });
  const [pagosPorParte, setPagosPorParte] = useState<Record<string, {
    comprador: boolean;
    vendedor: boolean;
  }>>({
    // Datos demostrativos: comprador pagado, vendedor pendiente
    'exp-001': {
      comprador: true,
      vendedor: false
    }
  });

  // Datos reales del contrato para búsqueda y validación
  const contractSearchData = [
    {
      id: "instrumento-numero",
      text: "INSTRUMENTO NÚMERO TREINTA Y DOS MIL SEISCIENTOS OCHENTA Y NUEVE",
      type: "Número de Instrumento",
      description: "Verificar que el número de instrumento sea correcto",
      location: "Encabezado del contrato"
    },
    {
      id: "nombre-comprador",
      text: "JONATHAN RUBEN HERNANDEZ GONZALEZ",
      type: "Nombre del Comprador",
      description: "Verificar nombre completo del comprador",
      location: "Sección EL COMPRADOR"
    },
    {
      id: "nombre-vendedor",
      text: "MARÍA ELENA RODRÍGUEZ GARCÍA",
      type: "Nombre del Vendedor", 
      description: "Verificar nombre completo del vendedor",
      location: "Sección EL VENDEDOR"
    },
    {
      id: "direccion-inmueble",
      text: "CALLE PRIVADA DE LAS FLORES #123, COLONIA CENTRO",
      type: "Dirección del Inmueble",
      description: "Verificar dirección completa del inmueble",
      location: "Descripción del inmueble"
    },
    {
      id: "valor-venta",
      text: "$2,950,000.00",
      type: "Valor de Venta",
      description: "Verificar monto total de la operación",
      location: "Cláusula de precio"
    },
    {
      id: "fecha-contrato",
      text: "15 de Enero de 2025",
      type: "Fecha del Contrato",
      description: "Verificar fecha de celebración del contrato",
      location: "Fecha de firma"
    },
    {
      id: "superficie-terreno",
      text: "300.00 metros cuadrados",
      type: "Superficie del Terreno",
      description: "Verificar medidas del terreno",
      location: "Descripción física"
    },
    {
      id: "clave-catastral",
      text: "123-456-789-012-345-678",
      type: "Clave Catastral",
      description: "Verificar clave catastral del inmueble",
      location: "Datos registrales"
    },
    {
      id: "estado-civil-comprador",
      text: "CASADO",
      type: "Estado Civil del Comprador",
      description: "Verificar estado civil para efectos legales",
      location: "Datos del comprador"
    },
    {
      id: "forma-pago",
      text: "CONTADO",
      type: "Forma de Pago",
      description: "Verificar modalidad de pago acordada",
      location: "Condiciones de pago"
    }
  ];
  const [manualValidations, setManualValidations] = useState<
    Record<string, Record<string, { approved: boolean; reason?: string }>>
  >({});
  const [revalidatingExpedientes, setRevalidatingExpedientes] = useState<
    Set<string>
  >(new Set());
  const [contractValidations, setContractValidations] = useState<
    Record<string, Record<string, { approved: boolean; reason?: string }>>
  >({});
  const [isApplyingCorrection, setIsApplyingCorrection] = useState(false);
  const [isCommunicating, setIsCommunicating] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointmentDate, setSelectedAppointmentDate] = useState("");
  const [selectedAppointmentTime, setSelectedAppointmentTime] = useState("");
  const [selectedMeetingRoom, setSelectedMeetingRoom] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [rescheduleRoom, setRescheduleRoom] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [showEscrituraModal, setShowEscrituraModal] = useState(false);
  const [selectedDocumentInfo, setSelectedDocumentInfo] = useState<{title: string, type: string, expediente: string} | null>(null);
  const [selectedTaxInfo, setSelectedTaxInfo] = useState<{title: string, expediente: string, details: any} | null>(null);

  // Lista completa de documentos para compraventa con documentos reales
  const documentosCompraventa = [
    {
      id: "doc-001",
      categoria: "Documentos del Comprador",
      nombre: "Identificación Oficial",
      descripcion: "INE o pasaporte vigente",
      archivo: "http://localhost:3000/documentos_legales/Identificacion_Oficial.pdf",
      estado: "pendiente",
      requerido: true,
      fechaSubida: null,
    },
    {
      id: "doc-002",
      categoria: "Documentos del Comprador",
      nombre: "CURP",
      descripcion: "Clave Única de Registro de Población",
      archivo: "http://localhost:3000/documentos_legales/CURP.pdf",
      estado: "pendiente",
      requerido: true,
      fechaSubida: null,
    },
    {
      id: "doc-003",
      categoria: "Documentos del Comprador",
      nombre: "RFC y Constancia de Situación Fiscal (CSF)",
      descripcion: "Registro Federal de Contribuyentes y constancia de situación fiscal",
      archivo: "http://localhost:3000/documentos_legales/RFC_y_Constancia_Situacion_Fiscal.pdf",
      estado: "pendiente",
      requerido: true,
      fechaSubida: null,
    },
    {
      id: "doc-004",
      categoria: "Documentos del Comprador",
      nombre: "Acta de Nacimiento",
      descripcion: "Acta de nacimiento reciente o legible",
      archivo: "http://localhost:3000/documentos_legales/Acta_de_Nacimiento.pdf",
      estado: "pendiente",
      requerido: true,
      fechaSubida: null,
    },
    {
      id: "doc-005",
      categoria: "Documentos del Comprador",
      nombre: "Comprobante de Domicilio",
      descripcion: "Agua/luz/estado de cuenta, no mayor a 3 meses",
      archivo: "http://localhost:3000/documentos_legales/Comprobante_de_Domicilio.pdf",
      estado: "pendiente",
      requerido: true,
      fechaSubida: null,
    },
    {
      id: "doc-006",
      categoria: "Documentos del Comprador",
      nombre: "Datos Bancarios",
      descripcion: "CLABE y banco para dispersión y comprobación de fondos",
      archivo: null,
      estado: "pendiente",
      requerido: true,
      fechaSubida: null,
    },
    {
      id: "doc-007",
      categoria: "Documentos del Comprador",
      nombre: "Acta de Matrimonio",
      descripcion: "Acta de matrimonio (si aplica)",
      archivo: null,
      estado: "pendiente",
      requerido: false,
      fechaSubida: null,
    },
    {
      id: "doc-008",
      categoria: "Documentos del Comprador",
      nombre: "Carta Oferta / Condiciones del Banco",
      descripcion: "Carta oferta o condiciones del banco",
      archivo: null,
      estado: "pendiente",
      requerido: true,
      fechaSubida: null,
    },
    {
      id: "doc-009",
      categoria: "Documentos del Comprador",
      nombre: "Avalúo Bancario",
      descripcion: "Avalúo bancario (si el banco lo exige; a veces lo gestiona el banco)",
      archivo: null,
      estado: "pendiente",
      requerido: false,
      fechaSubida: null,
    },
    {
      id: "doc-010",
      categoria: "Documentos del Comprador",
      nombre: "Pólizas Requeridas por el Crédito",
      descripcion: "Pólizas de vida/daños, si aplican",
      archivo: null,
      estado: "pendiente",
      requerido: false,
      fechaSubida: null,
    },
    {
      id: "doc-011",
      categoria: "Documentos del Comprador",
      nombre: "Instrucciones de Dispersión del Banco",
      descripcion: "Instrucciones de dispersión del banco y datos del representante que firmará la hipoteca",
      archivo: null,
      estado: "pendiente",
      requerido: true,
      fechaSubida: null,
    },
    {
      id: "doc-vendedor-001",
      categoria: "Documentos del Vendedor",
      nombre: "Identificación oficial vigente",
      descripcion: "INE o pasaporte vigente del vendedor",
      archivo: null,
      estado: "pendiente",
      requerido: true,
      fechaSubida: null,
    },
    {
      id: "doc-vendedor-002",
      categoria: "Documentos del Vendedor",
      nombre: "CURP",
      descripcion: "Clave Única de Registro de Población del vendedor",
      archivo: null,
      estado: "pendiente",
      requerido: true,
      fechaSubida: null,
    },
    {
      id: "doc-vendedor-003",
      categoria: "Documentos del Vendedor",
      nombre: "RFC y Constancia de Situación Fiscal (CSF)",
      descripcion: "Registro Federal de Contribuyentes y constancia de situación fiscal del vendedor",
      archivo: null,
      estado: "pendiente",
      requerido: true,
      fechaSubida: null,
    },
    {
      id: "doc-vendedor-004",
      categoria: "Documentos del Vendedor",
      nombre: "Acta de nacimiento",
      descripcion: "Acta de nacimiento del vendedor",
      archivo: null,
      estado: "pendiente",
      requerido: true,
      fechaSubida: null,
    },
    {
      id: "doc-vendedor-005",
      categoria: "Documentos del Vendedor",
      nombre: "Comprobante de domicilio (≤ 3 meses)",
      descripcion: "Comprobante de domicilio no mayor a 3 meses del vendedor",
      archivo: null,
      estado: "pendiente",
      requerido: true,
      fechaSubida: null,
    },
    {
      id: "doc-vendedor-006",
      categoria: "Documentos del Vendedor",
      nombre: "Documento de estado civil (según corresponda)",
      descripcion: "Acta de matrimonio, divorcio o soltería según corresponda",
      archivo: null,
      estado: "pendiente",
      requerido: true,
      fechaSubida: null,
    },
    {
      id: "doc-vendedor-007",
      categoria: "Documentos del Vendedor",
      nombre: "Datos bancarios (CLABE y banco)",
      descripcion: "Datos bancarios para dispersión y comprobación de fondos",
      archivo: null,
      estado: "pendiente",
      requerido: true,
      fechaSubida: null,
    },
    {
      id: "doc-inmueble-001",
      categoria: "Documentos del Inmueble",
      nombre: "Escritura/título de propiedad",
      descripcion: "Escritura pública o título de propiedad que acredita la propiedad",
      archivo: null,
      estado: "pendiente",
      requerido: true,
      fechaSubida: null,
    },
    {
      id: "doc-inmueble-002",
      categoria: "Documentos del Inmueble",
      nombre: "Certificado de libertad de gravámenes / certificado registral (RPP)",
      descripcion: "Certificado que acredita que el inmueble está libre de gravámenes",
      archivo: null,
      estado: "pendiente",
      requerido: true,
      fechaSubida: null,
    },
    {
      id: "doc-inmueble-003",
      categoria: "Documentos del Inmueble",
      nombre: "Predial al corriente",
      descripcion: "Comprobante de pago de predial al corriente",
      archivo: null,
      estado: "pendiente",
      requerido: true,
      fechaSubida: null,
    },
    {
      id: "doc-inmueble-004",
      categoria: "Documentos del Inmueble",
      nombre: "Agua al corriente / constancia de no adeudo",
      descripcion: "Comprobante de pago de agua al corriente o constancia de no adeudo",
      archivo: null,
      estado: "pendiente",
      requerido: true,
      fechaSubida: null,
    },
    {
      id: "doc-inmueble-005",
      categoria: "Documentos del Inmueble",
      nombre: "Clave/cuenta catastral",
      descripcion: "Clave o cuenta catastral del inmueble",
      archivo: null,
      estado: "pendiente",
      requerido: true,
      fechaSubida: null,
    },
    {
      id: "doc-inmueble-006",
      categoria: "Documentos del Inmueble",
      nombre: "Avalúo vigente",
      descripcion: "Avalúo comercial vigente del inmueble",
      archivo: null,
      estado: "pendiente",
      requerido: true,
      fechaSubida: null,
    },
  ];

  // Lista de PDFs dummy disponibles para rotación
  const dummyPDFs = [
    "http://localhost:3000/documentos_legales/Acta_de_Nacimiento.pdf",
    "http://localhost:3000/documentos_legales/Comprobante_de_Domicilio.pdf",
    "http://localhost:3000/documentos_legales/1_Acta_de_Nacimiento_HEGJ860702HMCRNN07.pdf",
    "http://localhost:3000/documentos_legales/2_Identificación_Oficial.pdf",
    "http://localhost:3000/documentos_legales/3_Cédula_profesional.pdf",
    "http://localhost:3000/documentos_legales/4_Comprobante_de_domicilio_Luz.pdf",
    "http://localhost:3000/documentos_legales/7_CEDULA_DE_IDENTIFICACION_FISCAL.pdf",
    "http://localhost:3000/documentos_legales/10._Constancia_de_situación_Fiscal.pdf",
    "http://localhost:3000/documentos_legales/11_RFC.pdf",
    "http://localhost:3000/documentos_legales/12_EstadoDeCuentaBanorte.pdf"
  ];

  // Función para obtener PDF dummy basado en el ID del documento
  const getDummyPDF = (documentId: string) => {
    const index = documentId.split('-')[1]; // Extraer número del ID (ej: "doc-005" -> "005")
    const numericIndex = parseInt(index) - 1; // Convertir a índice (0-based)
    return dummyPDFs[numericIndex % dummyPDFs.length]; // Rotar entre PDFs disponibles
  };

  // Función para contar documentos pendientes y rechazados basándose en los estados del overview
  const getDocumentStatusCount = (expedienteId: string) => {
    // Usar los documentos de compraventa que se muestran en el overview
    let pending = 0;
    let rejected = 0;
    let validated = 0;

    documentosCompraventa.forEach(doc => {
      const expedienteDocumentStates = documentStates[expedienteId] || {};
      const documentState = expedienteDocumentStates[doc.id];
      
      if (documentState === "aceptado") {
        validated++;
      } else if (documentState === "rechazado") {
        rejected++;
      } else {
        // Si no hay estado específico, usar el estado del documento
        if (doc.estado === "validado") {
          validated++;
        } else {
          pending++;
        }
      }
    });

    return { pending, rejected, validated, total: pending + rejected };
  };

  // Función para verificar si todos los documentos están validados
  const areAllDocumentsValidated = (expedienteId: string) => {
    const docCount = getDocumentStatusCount(expedienteId);
    const todosValidados = docCount.validated === documentosCompraventa.length;
    
    console.log(`📋 Verificación de documentos para ${expedienteId}:`, {
      validados: docCount.validated,
      total: documentosCompraventa.length,
      todosValidados
    });
    
    return todosValidados;
  };

  // Función para obtener el estado real del expediente (considerando validación de documentos)
  const getRealExpedienteStatus = (expediente: ExpedienteCompraventa) => {
    // Si no todos los documentos están validados, el estado real es EXPEDIENTE_PRELIMINAR
    if (!areAllDocumentsValidated(expediente.id)) {
      return "EXPEDIENTE_PRELIMINAR";
    }
    
    // Si todos los documentos están validados y el expediente está en EXPEDIENTE_PRELIMINAR,
    // mostrar como PROYECTO_ESCRITURA
    if (expediente.estado === "EXPEDIENTE_PRELIMINAR") {
      return "PROYECTO_ESCRITURA";
    }
    
    // Si todos los documentos están validados, usar el estado original del expediente
    return expediente.estado;
  };

  // Función para verificar y actualizar automáticamente el estado del expediente
  const checkAndUpdateExpedienteStatus = (expedienteId: string) => {
    console.log(`🔍 Verificando expediente ${expedienteId} para transición automática`);
    
    const expediente = expedientes.find(exp => exp.id === expedienteId);
    if (!expediente) {
      console.log(`❌ Expediente ${expedienteId} no encontrado`);
      return;
    }

    const todosValidados = areAllDocumentsValidated(expedienteId);
    
    console.log(`📊 Expediente ${expedienteId}:`, {
      estado: expediente.estado,
      todosValidados,
      cumpleCondicion: todosValidados && expediente.estado === "EXPEDIENTE_PRELIMINAR"
    });

    // Si todos los documentos están validados y el expediente está en EXPEDIENTE_PRELIMINAR,
    // actualizar automáticamente a PROYECTO_ESCRITURA (esto moverá la tarjeta automáticamente)
    if (todosValidados && expediente.estado === "EXPEDIENTE_PRELIMINAR") {
      console.log(`✅ TRANSICIÓN AUTOMÁTICA: ${expedienteId} → PROYECTO_ESCRITURA`);
      console.log(`📊 Estado ANTES de actualizar:`, expediente.estado);
      
      // Actualizar el estado del expediente (esto hará que se mueva a la columna correcta)
      setExpedientes(prev => {
        const updated = prev.map(exp => 
          exp.id === expedienteId 
            ? { ...exp, estado: "PROYECTO_ESCRITURA" as EstadoExpediente }
            : exp
        );
        console.log(`🔄 Expedientes actualizados:`, updated.map(e => `${e.id}: ${e.estado}`));
        return updated;
      });
      
      // Actualizar también el expediente seleccionado si es el mismo
      if (selectedExpediente && selectedExpediente.id === expedienteId) {
        setSelectedExpediente(prev => prev ? { ...prev, estado: "PROYECTO_ESCRITURA" } : null);
      }
      
      // Agregar comentario automático
      addComentarioExpediente(
        expedienteId,
        "TRANSICIÓN AUTOMÁTICA: Todos los documentos han sido validados. El expediente ha pasado a la etapa de Proyecto de Escritura.",
        "Sistema",
        "general"
      );
    } else {
      console.log(`⏳ Expediente ${expedienteId} no cumple condiciones para transición automática`);
    }
  };

  // Funciones para navegación en el contrato
  const handleNextSearch = () => {
    if (currentSearchIndex < contractSearchData.length - 1) {
      setCurrentSearchIndex(currentSearchIndex + 1);
      setHighlightedText(contractSearchData[currentSearchIndex + 1].text);
    }
  };

  const handlePreviousSearch = () => {
    if (currentSearchIndex > 0) {
      setCurrentSearchIndex(currentSearchIndex - 1);
      setHighlightedText(contractSearchData[currentSearchIndex - 1].text);
    }
  };

  const handleGoToText = () => {
    const currentItem = contractSearchData[currentSearchIndex];
    console.log(`Navegando a: ${currentItem.text} en ${currentItem.location}`);
    
    // Crear overlay con resaltado amarillo sobre el PDF
    const pdfContainer = document.querySelector('.pdf-viewer-container');
    if (pdfContainer) {
      // Limpiar highlights anteriores
      const existingHighlights = pdfContainer.querySelectorAll('.pdf-highlight');
      existingHighlights.forEach(highlight => highlight.remove());
      
      // Obtener dimensiones del contenedor
      const containerRect = pdfContainer.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;
      
      // Crear nuevo highlight con posicionamiento más preciso
      const highlight = document.createElement('div');
      highlight.className = 'pdf-highlight';
      highlight.style.cssText = `
        position: absolute;
        background-color: rgba(255, 235, 59, 0.6);
        border: 2px solid #ffc107;
        border-radius: 3px;
        pointer-events: none;
        z-index: 10;
        animation: highlightPulse 3s ease-in-out;
        box-shadow: 0 0 10px rgba(255, 193, 7, 0.5);
      `;
      
      // Posiciones más precisas basadas en la estructura real del contrato PDF
      // Usando coordenadas más específicas para mejor alineación
      const positions = {
        'instrumento-numero': { 
          top: `${Math.round(containerHeight * 0.08)}px`, 
          left: `${Math.round(containerWidth * 0.28)}px`, 
          width: `${Math.round(containerWidth * 0.44)}px`, 
          height: `${Math.round(containerHeight * 0.045)}px` 
        },
        'nombre-comprador': { 
          top: `${Math.round(containerHeight * 0.21)}px`, 
          left: `${Math.round(containerWidth * 0.15)}px`, 
          width: `${Math.round(containerWidth * 0.32)}px`, 
          height: `${Math.round(containerHeight * 0.035)}px` 
        },
        'nombre-vendedor': { 
          top: `${Math.round(containerHeight * 0.175)}px`, 
          left: `${Math.round(containerWidth * 0.15)}px`, 
          width: `${Math.round(containerWidth * 0.32)}px`, 
          height: `${Math.round(containerHeight * 0.035)}px` 
        },
        'direccion-inmueble': { 
          top: `${Math.round(containerHeight * 0.31)}px`, 
          left: `${Math.round(containerWidth * 0.12)}px`, 
          width: `${Math.round(containerWidth * 0.52)}px`, 
          height: `${Math.round(containerHeight * 0.055)}px` 
        },
        'valor-venta': { 
          top: `${Math.round(containerHeight * 0.405)}px`, 
          left: `${Math.round(containerWidth * 0.18)}px`, 
          width: `${Math.round(containerWidth * 0.65)}px`, 
          height: `${Math.round(containerHeight * 0.075)}px` 
        },
        'fecha-contrato': { 
          top: `${Math.round(containerHeight * 0.87)}px`, 
          left: `${Math.round(containerWidth * 0.68)}px`, 
          width: `${Math.round(containerWidth * 0.28)}px`, 
          height: `${Math.round(containerHeight * 0.035)}px` 
        },
        'superficie-terreno': { 
          top: `${Math.round(containerHeight * 0.27)}px`, 
          left: `${Math.round(containerWidth * 0.12)}px`, 
          width: `${Math.round(containerWidth * 0.36)}px`, 
          height: `${Math.round(containerHeight * 0.035)}px` 
        },
        'clave-catastral': { 
          top: `${Math.round(containerHeight * 0.35)}px`, 
          left: `${Math.round(containerWidth * 0.12)}px`, 
          width: `${Math.round(containerWidth * 0.46)}px`, 
          height: `${Math.round(containerHeight * 0.035)}px` 
        },
        'estado-civil-comprador': { 
          top: `${Math.round(containerHeight * 0.23)}px`, 
          left: `${Math.round(containerWidth * 0.58)}px`, 
          width: `${Math.round(containerWidth * 0.18)}px`, 
          height: `${Math.round(containerHeight * 0.03)}px` 
        },
        'forma-pago': { 
          top: `${Math.round(containerHeight * 0.445)}px`, 
          left: `${Math.round(containerWidth * 0.18)}px`, 
          width: `${Math.round(containerWidth * 0.65)}px`, 
          height: `${Math.round(containerHeight * 0.055)}px` 
        }
      };
      
      const position = positions[currentItem.id as keyof typeof positions] || { 
        top: `${Math.round(containerHeight * 0.2)}px`, 
        left: `${Math.round(containerWidth * 0.2)}px`, 
        width: `${Math.round(containerWidth * 0.6)}px`, 
        height: `${Math.round(containerHeight * 0.08)}px` 
      };
      
      Object.assign(highlight.style, position);
      
      pdfContainer.appendChild(highlight);
      
      // Remover el highlight después de 6 segundos (más tiempo para ver mejor)
      setTimeout(() => {
        if (highlight.parentNode) {
          highlight.remove();
        }
      }, 6000);
      
      // Scroll suave hacia el área resaltada
      const iframe = pdfContainer.querySelector('iframe');
      if (iframe) {
        iframe.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      // Mostrar información adicional en consola para debugging
      console.log(`Resaltando: ${currentItem.text}`);
      console.log(`Posición:`, position);
    }
  };

  // Inicializar el texto destacado cuando se abre el modal del contrato
  useEffect(() => {
    if (selectedDocument?.id === "contrato-borrador" && contractSearchData.length > 0) {
      setHighlightedText(contractSearchData[0].text);
      setCurrentSearchIndex(0);
    }
  }, [selectedDocument?.id]);

  // Función para abrir documento
  const handleOpenDocument = (documento: any) => {
    if (!documento) {
      alert("Este documento aún no ha sido subido");
      return;
    }
    
    // Si tiene archivo real, usarlo; si no, usar PDF dummy
    const documentoConArchivo = {
      ...documento,
      archivo: documento.archivo || getDummyPDF(documento.id)
    };
    
    console.log("Abriendo documento:", documentoConArchivo);
    setSelectedDocument(documentoConArchivo);
    setShowDocumentViewer(true);
  };

  // Función para aceptar documento
  const handleAcceptDocument = () => {
    if (selectedDocument && selectedExpediente) {
      setDocumentStates(prev => ({
        ...prev,
        [selectedExpediente.id]: {
          ...prev[selectedExpediente.id],
          [selectedDocument.id]: "aceptado"
        }
      }));
      setShowDocumentViewer(false);
      
      // Verificar si todos los documentos están validados para transición automática
      setTimeout(() => {
        checkAndUpdateExpedienteStatus(selectedExpediente.id);
      }, 100);
    }
  };

  // Función para rechazar documento
  const handleRejectDocument = () => {
    if (selectedDocument && selectedExpediente) {
      setDocumentStates(prev => ({
        ...prev,
        [selectedExpediente.id]: {
          ...prev[selectedExpediente.id],
          [selectedDocument.id]: "rechazado"
        }
      }));
      setShowDocumentViewer(false);
    }
  };

  // Función para aprobar/rechazar validación manual
  const handleManualValidation = (
    expedienteId: string,
    documentType: string,
    approved: boolean,
    reason?: string
  ) => {
    console.log(
      `🔍 VALIDACIÓN MANUAL INICIADA: ${expedienteId} - ${documentType} - ${approved ? "APROBADO" : "RECHAZADO"}`
    );

    setManualValidations((prev) => {
      const updated = {
      ...prev,
      [expedienteId]: {
        ...prev[expedienteId],
        [documentType]: { approved, reason },
      },
      };
      console.log(`📝 Validaciones manuales actualizadas para ${expedienteId}:`, updated[expedienteId]);
      return updated;
    });

    // Agregar comentario sobre la decisión manual
    const accion = approved ? "aprobó" : "rechazó";
    const razonTexto = reason ? ` Razón: ${reason}` : "";
    const comentario = `REVISIÓN MANUAL: El Licenciado ${accion} la validación de "${documentType}".${razonTexto}`;

    addComentarioExpediente(
      expedienteId,
      comentario,
      "Licenciado",
      approved ? "general" : "requerimiento"
    );

    // Verificar si todas las validaciones están completas
    const report = validationReports[expedienteId];
    console.log(`📊 Reporte de validación para ${expedienteId}:`, report);
    
    if (report) {
      const manualDecisions = manualValidations[expedienteId] || {};
      console.log(`📋 Decisiones manuales para ${expedienteId}:`, manualDecisions);
      
      const allValidated = report.validations.every(
        (v) => manualDecisions[v.documentType] !== undefined
      );
      console.log(`✅ Todas las validaciones completas para ${expedienteId}:`, allValidated);

      if (allValidated) {
        const allApproved = report.validations.every(
          (v) => manualDecisions[v.documentType]?.approved === true
        );
        console.log(`🎯 Todas las validaciones aprobadas para ${expedienteId}:`, allApproved);

        if (!allApproved) {
          // Regresar a expediente preliminar si no está 100% aprobado
          updateExpedienteEstado(expedienteId, "EXPEDIENTE_PRELIMINAR", "licenciado-1");
          
          // Actualizar estado local inmediatamente
          setExpedientes(prev => {
            const updated = prev.map(exp => 
              exp.id === expedienteId 
                ? { ...exp, estado: "EXPEDIENTE_PRELIMINAR" as EstadoExpediente }
                : exp
            );
            console.log(`📋 Regresando ${expedienteId} a EXPEDIENTE_PRELIMINAR:`, updated.find(e => e.id === expedienteId)?.estado);
            return updated;
          });
          
          // Forzar re-render
          setForceUpdate(prev => prev + 1);
          
          // Cerrar modal para que el usuario pueda ver el movimiento
          setShowExpedienteModal(false);

          // Generar comentario para el cliente
          const problemasRechazados = report.validations
            .filter((v) => manualDecisions[v.documentType]?.approved === false)
            .map(
              (v) =>
                `• ${v.documentType}: ${
                  manualDecisions[v.documentType]?.reason ||
                  "Requiere corrección"
                }`
            )
            .join("\n");

          const comentarioCliente = `CORRECCIONES REQUERIDAS

Se requieren las siguientes correcciones antes de continuar:

${problemasRechazados}

Por favor, proporciona los documentos corregidos o la información solicitada.`;

          addComentarioExpediente(
            expedienteId,
            comentarioCliente,
            "Notaría",
            "requerimiento"
          );
        } else {
          // Si todas las validaciones están aprobadas, mover a PROYECTO_ESCRITURA
          console.log(`🚀 MOVIENDO EXPEDIENTE ${expedienteId} A PROYECTO_ESCRITURA`);
          
          // Actualizar estado local PRIMERO
          setExpedientes(prev => {
            const updated = prev.map(exp => 
              exp.id === expedienteId 
                ? { ...exp, estado: "PROYECTO_ESCRITURA" as EstadoExpediente }
                : exp
            );
            console.log(`📋 Estado actualizado para ${expedienteId}:`, updated.find(e => e.id === expedienteId)?.estado);
            return updated;
          });
          
          // Luego actualizar en la base de datos
          updateExpedienteEstado(expedienteId, "PROYECTO_ESCRITURA", "licenciado-1");
          
          // Cerrar modal para que el usuario pueda ver el movimiento
          setShowExpedienteModal(false);
          
          // Agregar comentario de aprobación
          addComentarioExpediente(
            expedienteId,
            "✅ Todas las validaciones han sido aprobadas. El expediente ha sido movido a 'Proyecto de Escritura' para continuar con la preparación del documento notarial.",
            "Licenciado",
            "general"
          );
        }
      }
    }
  };

  // Función para revalidar expediente
  const handleRevalidation = async (expedienteId: string) => {
    console.log(`Iniciando REVALIDACIÓN para expediente ${expedienteId}`);

    // Limpiar validaciones manuales previas
    setManualValidations((prev) => ({
      ...prev,
      [expedienteId]: {},
    }));

    // Agregar a lista de revalidación
    setRevalidatingExpedientes((prev) => new Set([...prev, expedienteId]));
    setValidatingExpedientes((prev) => new Set([...prev, expedienteId]));

    try {
      // Ejecutar revalidación IA (siempre 100% exitosa)
      const validationReport = await aiValidationService.validateExpediente(
        expedienteId,
        true // isRevalidation = true
      );

      // Guardar el reporte
      aiValidationService.saveValidation(validationReport);

      // Actualizar estado local
      setValidationReports((prev) => ({
        ...prev,
        [expedienteId]: validationReport,
      }));

      // Agregar comentario de revalidación exitosa
      addComentarioExpediente(
        expedienteId,
        "REVALIDACIÓN COMPLETADA: Todos los documentos han sido corregidos y aprobados exitosamente.",
        "IA Assistant",
        "general"
      );

      console.log(
        `Revalidación completada exitosamente para ${expedienteId}`
      );
    } catch (error) {
      console.error(`Error en revalidación para ${expedienteId}:`, error);
    } finally {
      // Remover de listas de validación
      setValidatingExpedientes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(expedienteId);
        return newSet;
      });
      setRevalidatingExpedientes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(expedienteId);
        return newSet;
      });
    }
  };

  // Datos de pagos simulados para la demo
  const pagosDemoExpediente = [
    {
      id: "pago-001",
      monto: 12500, // Pago completo del comprador
      metodo: "Transferencia Bancaria",
      referencia: "NP3-COMP-001-2025",
      tipo: "completo",
      fecha: "2025-01-15T16:45:00Z",
      estado: "confirmado",
      concepto: "Pago completo de honorarios notariales y derechos registrales",
      comprobante: "/documentos_legales/Comprobante_Pago_12500.md",
      banco: "BBVA México",
      autorizacion: "789456123",
      parte: "comprador"
    },
    {
      id: "pago-002",
      monto: 12500, // Pago del vendedor (pendiente)
      metodo: "Pendiente",
      referencia: "NP3-VEND-001-2025",
      tipo: "pendiente",
      fecha: null,
      estado: "pendiente",
      concepto: "Pago de honorarios notariales y derechos registrales",
      comprobante: null,
      banco: null,
      autorizacion: null,
      parte: "vendedor"
    },
  ];

  // Calcular totales de pago
  const costoTotalExpediente = 25000; // Costo total del trámite
  const totalPagado = pagosDemoExpediente
    .filter(pago => pago.estado === "confirmado")
    .reduce((sum, pago) => sum + pago.monto, 0);
  const saldoPendiente = costoTotalExpediente - totalPagado;
  const porcentajePagado = (totalPagado / costoTotalExpediente) * 100;

  // Calcular montos por parte
  const montoPorParte = costoTotalExpediente / 2; // Cada parte paga 50%
  const pagoComprador = pagosDemoExpediente.find(p => p.parte === "comprador");
  const pagoVendedor = pagosDemoExpediente.find(p => p.parte === "vendedor");
  
  // Montos pagados por cada parte
  const montoPagadoComprador = pagoComprador?.estado === "confirmado" ? pagoComprador.monto : 0;
  const montoPagadoVendedor = pagoVendedor?.estado === "confirmado" ? pagoVendedor.monto : 0;
  
  // Montos pendientes por cada parte
  const montoPendienteComprador = montoPorParte - montoPagadoComprador;
  const montoPendienteVendedor = montoPorParte - montoPagadoVendedor;

  // Función para obtener el título del trámite según su tipo
  const getTramiteTitle = (expediente: ExpedienteCompraventa) => {
    const tipo = expediente.tipoTramite || "desconocido";
    switch (tipo) {
      case "compraventa":
        return `Compraventa - ${expediente.inmueble.tipo}`;
      case "testamento":
        return `Testamento Público Abierto`;
      case "donacion":
        return `Donación - ${expediente.inmueble.tipo}`;
      case "poder":
        return `Poder Notarial`;
      case "mutuo":
        return `Contrato de Mutuo`;
      default:
        return `Trámite ${tipo}`;
    }
  };

  // Función para obtener la descripción del trámite
  const getTramiteDescription = (expediente: ExpedienteCompraventa) => {
    const tipo = expediente.tipoTramite || "desconocido";
    switch (tipo) {
      case "compraventa":
        return `${expediente.comprador.nombre} ${expediente.comprador.apellidoPaterno} → ${expediente.vendedor.nombre} ${expediente.vendedor.apellidoPaterno}`;
      case "testamento":
        return `Testador: ${expediente.comprador.nombre} ${expediente.comprador.apellidoPaterno}`;
      case "donacion":
        return `${expediente.vendedor.nombre} ${expediente.vendedor.apellidoPaterno} → ${expediente.comprador.nombre} ${expediente.comprador.apellidoPaterno}`;
      case "poder":
        return `Poderdante: ${expediente.comprador.nombre} ${expediente.comprador.apellidoPaterno}`;
      default:
        return `${expediente.comprador.nombre} ${expediente.comprador.apellidoPaterno}`;
    }
  };

  // Función para obtener el icono del trámite
  const getTramiteIcon = (tipoTramite: string) => {
    switch (tipoTramite) {
      case "compraventa":
        return <Home className="h-4 w-4 text-gray-600" />;
      case "testamento":
        return <FileText className="h-4 w-4 text-gray-600" />;
      case "donacion":
        return <Users className="h-4 w-4 text-gray-600" />;
      case "poder":
        return <Shield className="h-4 w-4 text-orange-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  useEffect(() => {
    // Cargar expedientes del licenciado
    const expedientesLicenciado = getExpedientesByAbogado(licenciadoId || "");
    console.log(
      `Expedientes cargados para licenciado ${licenciadoId || 'No especificado'}:`,
      expedientesLicenciado
    );
    console.log(`Total expedientes: ${expedientesLicenciado.length}`);
    expedientesLicenciado.forEach((exp) => {
      console.log(
        `  - ${exp.numeroSolicitud}: ${exp.tipoTramite} (${exp.estado}) - Asignado a: ${exp.licenciadoAsignado || 'No asignado'}`
      );
    });
    setExpedientes(expedientesLicenciado);
    setFilteredExpedientes(expedientesLicenciado);
    
    // Cargar validaciones existentes para cada expediente
    const existingValidations: Record<string, ExpedienteValidationReport> = {};
    expedientesLicenciado.forEach(expediente => {
      const validationHistory = aiValidationService.getValidationHistory(expediente.id);
      if (validationHistory.length > 0) {
        // Tomar la validación más reciente
        existingValidations[expediente.id] = validationHistory[validationHistory.length - 1];
        console.log(`📋 Cargada validación existente para ${expediente.id}:`, existingValidations[expediente.id]);
      }
    });
    setValidationReports(existingValidations);
    
    // Para propósitos de prueba, generar validaciones de prueba para algunos expedientes
    if (Object.keys(existingValidations).length === 0) {
      console.log(`🧪 Generando validaciones de prueba para demostración...`);
      const testValidations: Record<string, ExpedienteValidationReport> = {};
      
      // Generar validación de prueba para el primer expediente (exp-001)
      const testExpediente = expedientesLicenciado.find(exp => exp.id === "exp-001");
      if (testExpediente) {
        const testReport: ExpedienteValidationReport = {
          expedienteId: "exp-001",
          overallScore: 100,
          status: "passed",
          validations: [
            {
              documentType: "INE vs Escritura",
              result: { isValid: true, confidence: 95, issues: [] },
              validatedAt: new Date().toISOString(),
              validatedBy: "ai"
            },
            {
              documentType: "Avalúo",
              result: { isValid: true, confidence: 91, issues: [] },
              validatedAt: new Date().toISOString(),
              validatedBy: "ai"
            },
            {
              documentType: "Escritura Pública",
              result: { isValid: true, confidence: 93, issues: [] },
              validatedAt: new Date().toISOString(),
              validatedBy: "ai"
            },
            {
              documentType: "CLG",
              result: { isValid: true, confidence: 96, issues: [] },
              validatedAt: new Date().toISOString(),
              validatedBy: "ai"
            }
          ],
          summary: "✅ Validación completada exitosamente. Todos los documentos están en orden.",
          recommendedActions: ["Proceder a la siguiente etapa del proceso"]
        };
        
        testValidations["exp-001"] = testReport;
        aiValidationService.saveValidation(testReport);
        console.log(`🧪 Validación de prueba creada para exp-001`);
      }
      
      setValidationReports(testValidations);
    }
  }, [licenciadoId || ""]);

  useEffect(() => {
    // Filtrar expedientes
    let filtered = expedientes;

    // Filtrar por tipo de trámite
    if (!selectedTramiteTypes.includes("todos")) {
      console.log(`Filtrando por tipos: ${selectedTramiteTypes.join(", ")}`);
      console.log(
        `Expedientes antes del filtro:`,
        expedientes.map((e) => `${e.numeroSolicitud}: ${e.tipoTramite}`)
      );
      filtered = filtered.filter((exp) => {
        return exp.tipoTramite && selectedTramiteTypes.includes(exp.tipoTramite);
      });
      console.log(`Expedientes después del filtro: ${filtered.length}`);
      filtered.forEach((exp) => {
        console.log(`  ${exp.numeroSolicitud}: ${exp.tipoTramite}`);
      });
    }
    // Si es "todos", no filtrar por tipo

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (exp) =>
          exp.numeroSolicitud
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          exp.comprador.nombre
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          exp.comprador.apellidoPaterno
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          exp.vendedor.nombre
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          exp.vendedor.apellidoPaterno
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Ordenar por fecha
    filtered.sort((a, b) => {
      const dateA = new Date(a.fechaUltimaActualizacion).getTime();
      const dateB = new Date(b.fechaUltimaActualizacion).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredExpedientes(filtered);
  }, [expedientes, selectedTramiteTypes, searchTerm, sortOrder]);

  const handleDragStart = (e: React.DragEvent, expedienteId: string) => {
    setDraggedExpediente(expedienteId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // Función para ejecutar validación IA automática
  const executeAIValidation = async (expedienteId: string) => {
    console.log(`[INICIO] Validación IA para expediente ${expedienteId}`);
    console.log(
      `Estado actual del expediente:`,
      expedientes.find((e) => e.id === expedienteId)
    );

    // Agregar a la lista de expedientes en validación
    setValidatingExpedientes((prev) => {
      console.log(`Agregando ${expedienteId} a lista de validación`);
      return new Set([...prev, expedienteId]);
    });

    try {
      console.log(`Ejecutando validación IA para ${expedienteId}...`);

      // Ejecutar validación IA
      const validationReport = await aiValidationService.validateExpediente(
        expedienteId
      );

      console.log(`Reporte de validación generado:`, validationReport);

      // Guardar el reporte
      aiValidationService.saveValidation(validationReport);

      // Actualizar estado local
      setValidationReports((prev) => ({
        ...prev,
        [expedienteId]: validationReport,
      }));

      console.log(
        `Validación IA completada exitosamente para ${expedienteId}`
      );
    } catch (error) {
      console.error(`Error en validación IA para ${expedienteId}:`, error);
      console.error(`Stack trace:`, error);

      // NO agregar comentario de error automáticamente
      // El Licenciado debe poder ver que la validación falló y decidir qué hacer
      console.log(
        `Validación IA falló para ${expedienteId}, pero no se agrega comentario automático`
      );
    } finally {
      // Remover de la lista de validación
      setValidatingExpedientes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(expedienteId);
        return newSet;
      });
    }
  };

  const handleDrop = async (
    e: React.DragEvent,
    nuevoEstado: EstadoExpediente
  ) => {
    e.preventDefault();

    if (!draggedExpediente) return;

    // Validar si se puede mover a "LISTO_PARA_FIRMA"
    if (nuevoEstado === "LISTO_PARA_FIRMA") {
      const expediente = expedientes.find(
        (exp) => exp.id === draggedExpediente
      );
      if (!expediente) return;

      // Verificar si el pago está completo (saldo pendiente = 0 O trámite marcado como pagado)
      const pagoCompleto = expediente.costos.saldoPendiente === 0 || tramitePagado[draggedExpediente];
      if (!pagoCompleto) {
        // Mostrar modal de pago pendiente
        setPaymentModalData({
          expediente: expediente,
          saldoPendiente: expediente.costos.saldoPendiente,
          total: expediente.costos.total,
        });
        setShowPaymentModal(true);
        setDraggedExpediente(null);
        return;
      }
    }

    // Actualizar estado del expediente
    const success = updateExpedienteEstado(
      draggedExpediente,
      nuevoEstado,
      licenciadoId || ""
    );

    if (success) {
      // Actualizar solo el expediente específico en lugar de refrescar toda la lista
      setExpedientes(prev => prev.map(exp => 
        exp.id === draggedExpediente 
          ? { ...exp, estado: nuevoEstado }
          : exp
      ));

      // VALIDACIÓN IA AUTOMÁTICA: Si se mueve a EXPEDIENTE_PRELIMINAR, ejecutar validación IA
      if (nuevoEstado === "EXPEDIENTE_PRELIMINAR") {
        console.log(
          `Tarjeta movida a EXPEDIENTE_PRELIMINAR - Iniciando validación IA automática para ${draggedExpediente}`
        );

        // Ejecutar validación IA de forma asíncrona con un pequeño delay
        setTimeout(() => {
          console.log(
            `Ejecutando validación IA después de delay para ${draggedExpediente}`
          );
          executeAIValidation(draggedExpediente);
        }, 1000);
      }
    }

    setDraggedExpediente(null);
  };

  const handleExpedienteClick = (expediente: ExpedienteCompraventa) => {
    setSelectedExpediente(expediente);
    setShowExpedienteModal(true);
    
    // Si el expediente está en PROYECTO_ESCRITURA, marcar automáticamente todos los documentos como validados
    if (expediente.estado === "PROYECTO_ESCRITURA") {
      console.log(`📋 Expediente ${expediente.id} está en PROYECTO_ESCRITURA - Marcando documentos como validados automáticamente`);
      
      // Marcar todos los documentos de compraventa como validados
      const expedienteDocumentStates = documentStates[expediente.id] || {};
      const updatedDocumentStates = { ...expedienteDocumentStates };
      
      // Marcar todos los documentos de compraventa como validados usando los IDs reales
      documentosCompraventa.forEach(doc => {
        updatedDocumentStates[doc.id] = "aceptado";
      });
      
      // Actualizar el estado de los documentos
      setDocumentStates(prev => ({
        ...prev,
        [expediente.id]: updatedDocumentStates
      }));
      
      console.log(`✅ Documentos marcados como validados para ${expediente.id}`);
    }
  };

  const handleTramiteTypeToggle = (tramiteType: string) => {
    console.log("Toggle tramite type:", tramiteType);
    setSelectedTramiteTypes(prev => {
      console.log("Current selection:", prev);
      
      // Si se selecciona "todos", limpiar todo y dejar solo "todos"
      if (tramiteType === "todos") {
        console.log("Selecting 'todos' - clearing all others");
        return ["todos"];
      }
      
      // Si ya está seleccionado, quitarlo
      if (prev.includes(tramiteType)) {
        const newSelection = prev.filter(type => type !== tramiteType);
        console.log("➖ Removing from selection:", newSelection);
        // Si no queda nada seleccionado, volver a "todos"
        return newSelection.length === 0 ? ["todos"] : newSelection;
      }
      
      // Si no está seleccionado, agregarlo (y quitar "todos" si está)
      const newSelection = [...prev.filter(type => type !== "todos"), tramiteType];
      console.log("➕ Adding to selection:", newSelection);
      return newSelection;
    });
  };

  const handleAddComentario = () => {
    if (!selectedExpediente || !nuevoComentario.trim()) return;

    const success = addComentarioExpediente(
      selectedExpediente.id,
      nuevoComentario,
      licenciadoId || "",
      tipoComentario
    );

    if (success) {
      // Actualizar estado local - solo actualizar desde los datos mock
      const expedienteActualizado = expedientesMock.find(
        (exp) => exp.id === selectedExpediente.id
      );
      if (expedienteActualizado) {
        setExpedientes((prev) =>
          prev.map((exp) =>
            exp.id === selectedExpediente.id ? expedienteActualizado : exp
          )
        );

        setSelectedExpediente(expedienteActualizado);
      }

      setNuevoComentario("");
      setShowComentarioModal(false);
    }
  };

  const getExpedientesByColumn = (estado: EstadoExpediente) => {
    console.log(`🔄 getExpedientesByColumn llamado para ${estado} - Total expedientes: ${expedientes.length}`);
    const filtered = expedientes.filter((exp: ExpedienteCompraventa) => {
      return exp.estado === estado;
    });
    console.log(`📋 Resultado para ${estado}:`, filtered.map(e => `${e.id}: ${e.estado}`));
    return filtered;
  };

  // Función de prueba para mover expediente manualmente
  const testMoveExpediente = (expedienteId: string) => {
    console.log(`🧪 PRUEBA: Moviendo expediente ${expedienteId} a PROYECTO_ESCRITURA`);
    setExpedientes(prev => {
      const updated = prev.map(exp => 
        exp.id === expedienteId 
          ? { ...exp, estado: "PROYECTO_ESCRITURA" as EstadoExpediente }
          : exp
      );
      console.log(`🧪 Estado actualizado en prueba:`, updated.find(e => e.id === expedienteId)?.estado);
      return updated;
    });
  };

  // Función para manejar validación del contrato
  const handleContractValidation = (
    expedienteId: string,
    fieldId: string,
    approved: boolean,
    reason?: string
  ) => {
    console.log(`📋 Validación de contrato: ${expedienteId} - ${fieldId} - ${approved ? "APROBADO" : "RECHAZADO"}`);

    setContractValidations(prev => {
      const updated = {
        ...prev,
        [expedienteId]: {
          ...prev[expedienteId],
          [fieldId]: { approved, reason },
        },
      };
      console.log(`📝 Validaciones de contrato actualizadas para ${expedienteId}:`, updated[expedienteId]);
      return updated;
    });

    // Agregar comentario sobre la decisión
    const accion = approved ? "aprobó" : "rechazó";
    const razonTexto = reason ? ` Razón: ${reason}` : "";
    const comentario = `VALIDACIÓN DE CONTRATO: El Licenciado ${accion} la validación de "${fieldId}".${razonTexto}`;

    addComentarioExpediente(
      expedienteId,
      comentario,
      "Licenciado",
      approved ? "general" : "requerimiento"
    );

    // Verificar si se han validado todos los campos del contrato
    const updatedValidations = {
      ...contractValidations[expedienteId],
      [fieldId]: { approved, reason },
    };
    
    const totalValidated = Object.values(updatedValidations).length;
    const allValidated = totalValidated === contractSearchData.length;
    
    if (allValidated) {
      console.log(`🎯 ¡TODAS LAS VALIDACIONES DEL CONTRATO COMPLETADAS! Cerrando automáticamente.`);
      
      // Agregar comentario final
      addComentarioExpediente(
        expedienteId,
        "✅ VALIDACIÓN COMPLETA: Todas las 10 partes del contrato han sido validadas exitosamente. El contrato está listo para continuar con el proceso.",
        "Licenciado",
        "general"
      );
      
      // Cerrar inmediatamente el modal de validación del contrato
      setTimeout(() => {
        setShowDocumentViewer(false);
        setSelectedDocument(null);
        setCurrentSearchIndex(0);
        setHighlightedText("");
        console.log(`🏠 Modal de validación del contrato cerrado automáticamente`);
      }, 1000);
      
    } else {
      // Avanzar automáticamente al siguiente campo si no es el último
      if (currentSearchIndex < contractSearchData.length - 1) {
        const nextIndex = currentSearchIndex + 1;
        setCurrentSearchIndex(nextIndex);
        setHighlightedText(contractSearchData[nextIndex].text);
        console.log(`🔄 Avanzando automáticamente al siguiente campo: ${contractSearchData[nextIndex].type}`);
      } else {
        // Si estamos en el último campo y lo validamos, cerrar automáticamente
        console.log(`🎯 Último campo validado. Cerrando modal automáticamente.`);
        
        // Agregar comentario final
        addComentarioExpediente(
          expedienteId,
          "✅ VALIDACIÓN COMPLETA: Todas las 10 partes del contrato han sido validadas exitosamente. El contrato está listo para continuar con el proceso.",
          "Licenciado",
          "general"
        );
        
        // Cerrar inmediatamente el modal
        setTimeout(() => {
          setShowDocumentViewer(false);
          setSelectedDocument(null);
          setCurrentSearchIndex(0);
          setHighlightedText("");
          console.log(`🏠 Modal cerrado automáticamente al validar el último campo`);
        }, 1000);
      }
    }
  };

  // Función para contar validaciones del contrato
  const getContractValidationCount = (expedienteId: string) => {
    const validations = contractValidations[expedienteId] || {};
    const totalFields = contractSearchData.length;
    const approvedCount = Object.values(validations).filter(v => v.approved === true).length;
    const rejectedCount = Object.values(validations).filter(v => v.approved === false).length;
    const pendingCount = totalFields - approvedCount - rejectedCount;

    return {
      total: totalFields,
      approved: approvedCount,
      rejected: rejectedCount,
      pending: pendingCount
    };
  };

  // Función para mover expediente automáticamente (misma lógica que el botón rojo que funcionaba)
  const handleAutoMoveExpediente = (expedienteId: string) => {
    console.log(`🚀 MOVIENDO EXPEDIENTE ${expedienteId} A PROYECTO_ESCRITURA`);
    
    // Actualizar estado local PRIMERO (igual que el botón rojo)
    setExpedientes(prev => {
      const updated = prev.map(exp => 
        exp.id === expedienteId 
          ? { ...exp, estado: "PROYECTO_ESCRITURA" as EstadoExpediente }
          : exp
      );
      console.log(`📋 Estado actualizado para ${expedienteId}:`, updated.find(e => e.id === expedienteId)?.estado);
      return updated;
    });
    
    // Actualizar también el expediente seleccionado en el modal para mantener la sesión activa
    setSelectedExpediente(prev => prev ? {
      ...prev,
      estado: "PROYECTO_ESCRITURA" as EstadoExpediente
    } : null);
    
    // Marcar automáticamente todos los documentos como validados al mover a PROYECTO_ESCRITURA
    console.log(`📋 Marcando documentos como validados para ${expedienteId} al mover a PROYECTO_ESCRITURA`);
    
    const expedienteDocumentStates = documentStates[expedienteId] || {};
    const updatedDocumentStates = { ...expedienteDocumentStates };
    
    // Marcar todos los documentos de compraventa como validados usando los IDs reales
    documentosCompraventa.forEach(doc => {
      updatedDocumentStates[doc.id] = "aceptado";
    });
    
    // Actualizar el estado de los documentos
    setDocumentStates(prev => ({
      ...prev,
      [expedienteId]: updatedDocumentStates
    }));
    
    console.log(`✅ Documentos marcados como validados para ${expedienteId}`);
    
    // Luego actualizar en la base de datos
    updateExpedienteEstado(expedienteId, "PROYECTO_ESCRITURA", "licenciado-1");
    
    // NO cerrar el modal - mantener la sesión de trabajo activa
    // setShowExpedienteModal(false);
    
    // Agregar comentario de aprobación
    addComentarioExpediente(
      expedienteId,
      "✅ Todas las validaciones han sido aprobadas. El expediente ha sido movido a 'Proyecto de Escritura' para continuar con la preparación del documento notarial.",
      "Licenciado",
      "general"
    );
    
    // Mostrar notificación temporal de cambio de estado
    setTimeout(() => {
      // La notificación se mostrará automáticamente por el cambio de estado en el modal
      console.log(`📢 Expediente ${expedienteId} movido a PROYECTO_ESCRITURA - Modal actualizado`);
    }, 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Función para notificar a las partes del contrato
  const handleNotifyParties = (expedienteId: string) => {
    setContractApprovals(prev => ({
      ...prev,
      [expedienteId]: {
        ...prev[expedienteId],
        notificacionesEnviadas: true
      }
    }));
    
    // Aquí se podría integrar con un servicio de notificaciones real
    console.log(`Notificaciones enviadas a las partes del expediente ${expedienteId}`);
  };

  // Función para marcar aprobación de una parte
  const handleToggleApproval = (expedienteId: string, parte: 'comprador' | 'vendedor') => {
    setContractApprovals(prev => ({
      ...prev,
      [expedienteId]: {
        ...prev[expedienteId],
        [parte]: !prev[expedienteId]?.[parte] || false
      }
    }));
  };

  // Función para simular aprobación automática de ambas partes en Proyecto de escritura
  const handleAutoApproveBothParties = (expedienteId: string) => {
    setContractApprovals(prev => ({
      ...prev,
      [expedienteId]: {
        ...prev[expedienteId],
        comprador: true,
        vendedor: true
      }
    }));
    console.log(`✅ Aprobaciones automáticas simuladas para ${expedienteId} - Ambas partes han aprobado`);
  };

  // Función para marcar trámite como pagado
  const handleMarkAsPaid = (expedienteId: string) => {
    setTramitePagado(prev => ({
      ...prev,
      [expedienteId]: true
    }));
    console.log(`Trámite ${expedienteId} marcado como pagado`);
  };

  // Función para verificar y marcar automáticamente como pagado si ambos pagos están completos
  const checkAndMarkAsPaid = (expedienteId: string) => {
    // Usar un timeout para asegurar que el estado se haya actualizado
    setTimeout(() => {
      setPagosPorParte(prevPagos => {
        setTramitePagado(prevTramite => {
          const compradorPagado = prevPagos[expedienteId]?.comprador;
          const vendedorPagado = prevPagos[expedienteId]?.vendedor;
          const yaMarcado = prevTramite[expedienteId];
          
          if (compradorPagado && vendedorPagado && !yaMarcado) {
            console.log(`Ambos pagos completados para ${expedienteId}, marcando trámite como pagado automáticamente`);
            return {
              ...prevTramite,
              [expedienteId]: true
            };
          }
          return prevTramite;
        });
        return prevPagos;
      });
    }, 50);
  };

  // Función para marcar pago de una parte específica
  const handleMarkParteAsPaid = (expedienteId: string, parte: 'comprador' | 'vendedor') => {
    setPagosPorParte(prev => ({
      ...prev,
      [expedienteId]: {
        ...prev[expedienteId],
        [parte]: true
      }
    }));
    console.log(`Pago de ${parte} marcado como completado para expediente ${expedienteId}`);
    
    // Verificar si ambos pagos están completos y marcar automáticamente como pagado
    checkAndMarkAsPaid(expedienteId);
  };

  const renderExpedienteCard = (expediente: ExpedienteCompraventa) => {
    // Contar documentos que están subidos (no solo validados)
    const documentosCompletados = expediente.documentos.filter(
      (doc: any) => doc.estado === "validado" || doc.estado === "subido"
    ).length;
    const totalDocumentos = expediente.documentos.length;
    const progresoDocumentos =
      totalDocumentos > 0 ? (documentosCompletados / totalDocumentos) * 100 : 0;

    // Estado de validación IA
    const isValidating = validatingExpedientes.has(expediente.id);
    const validationReport = validationReports[expediente.id];
    const hasValidation = validationReport !== undefined;

    // Calcular estado del pago
    const pagoCompleto = expediente.costos.saldoPendiente === 0;
    const tienePagosParciales = expediente.pagos.length > 0;

    return (
      <Card
        key={expediente.id}
        className={`cursor-pointer hover:shadow-lg transition-all duration-300 mb-3 border hover:shadow-xl group hover:scale-[1.02] relative overflow-hidden ${
          expediente.tipoTramite === "compraventa" 
            ? "bg-gradient-to-br from-indigo-50 via-indigo-100/50 to-purple-50 border-indigo-200/60 hover:border-indigo-300"
            : expediente.tipoTramite === "testamento"
            ? "bg-gradient-to-br from-purple-50 via-purple-100/50 to-pink-50 border-purple-200/60 hover:border-purple-300"
            : expediente.tipoTramite === "donacion"
            ? "bg-gradient-to-br from-pink-50 via-pink-100/50 to-rose-50 border-pink-200/60 hover:border-pink-300"
            : expediente.tipoTramite === "poder"
            ? "bg-gradient-to-br from-amber-50 via-amber-100/50 to-orange-50 border-amber-200/60 hover:border-amber-300"
            : "bg-gradient-to-br from-slate-50 via-slate-100/50 to-gray-50 border-slate-200/60 hover:border-slate-300"
        }`}
        draggable
        onDragStart={(e) => handleDragStart(e, expediente.id)}
        onClick={() => handleExpedienteClick(expediente)}
      >
        {/* Patrón decorativo sutil en la tarjeta */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-pink-200/20 to-orange-200/20 rounded-full blur-lg"></div>
        <CardHeader className="pb-2 relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-sm font-semibold text-slate-800 mb-1">
                  {getTramiteTitle(expediente)}
                </CardTitle>
              <CardDescription className="text-xs text-slate-500 mb-2">
                {expediente.numeroSolicitud}
              </CardDescription>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <span>
                {getTramiteDescription(expediente)}
                </span>
            </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 relative z-10">
          <div className="space-y-2">
            <div className="text-xs text-slate-500">
                {expediente.tipoTramite === "testamento"
                  ? `Bienes: ${expediente.inmueble.tipo}`
                  : expediente.tipoTramite === "donacion"
                  ? `Donación: ${expediente.inmueble.tipo} - ${expediente.inmueble.superficie}m²`
                  : `${expediente.inmueble.tipo} - ${expediente.inmueble.superficie}m²`}
            </div>

            {expediente.comentarios.length > 0 && (
              <div className="text-xs text-slate-500">
                  {expediente.comentarios.length} comentario
                  {expediente.comentarios.length !== 1 ? "s" : ""}
              </div>
            )}

            {/* Indicadores de Validación IA - Solo mostrar en EXPEDIENTE_PRELIMINAR */}
            {(isValidating || hasValidation) && expediente.estado === "EXPEDIENTE_PRELIMINAR" && (
              <div className="pt-2 border-t border-slate-200">
                {isValidating && (
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="animate-pulse">
                      IA validando...
                    </span>
                  </div>
                )}

                {hasValidation && !isValidating && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <div
                        className={`flex items-center gap-1 ${
                          validationReport.status === "passed"
                            ? "text-gray-600"
                            : validationReport.status === "warning"
                            ? "text-gray-500"
                            : "text-gray-700"
                        }`}
                      >
                        {validationReport.status === "passed" && (
                          <CheckCircle className="h-3 w-3" />
                        )}
                        {validationReport.status === "warning" && (
                          <AlertCircle className="h-3 w-3" />
                        )}
                        {validationReport.status === "failed" && (
                          <AlertCircle className="h-3 w-3" />
                        )}
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs px-1 py-0 ${
                          validationReport.status === "passed"
                            ? "bg-gray-100 text-gray-700 border-gray-300"
                            : validationReport.status === "warning"
                            ? "bg-gray-100 text-gray-600 border-gray-300"
                            : "bg-gray-100 text-gray-800 border-gray-300"
                        }`}
                      >
                        {(() => {
                          const docCount = getDocumentStatusCount(expediente.id);
                          const totalDocs = documentosCompraventa.length;
                          
                          if (docCount.validated === totalDocs) {
                            return "Aprobado";
                          } else if (docCount.rejected > 0) {
                            return `${docCount.total} pendientes`;
                          } else {
                            return `${docCount.pending} pendientes`;
                          }
                        })()}
                      </Badge>
                    </div>

                    {validationReport.status !== "passed" && (
                      <div className="text-xs text-gray-600">
                        {
                          validationReport.validations.filter(
                            (v) => !v.result.isValid
                          ).length
                        }{" "}
                        validación
                        {validationReport.validations.filter(
                          (v) => !v.result.isValid
                        ).length !== 1
                          ? "es"
                          : ""}{" "}
                        pendiente
                        {validationReport.validations.filter(
                          (v) => !v.result.isValid
                        ).length !== 1
                          ? "s"
                          : ""}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Indicador de estado para Proyecto de escritura */}
            {expediente.estado === "PROYECTO_ESCRITURA" && (
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 text-gray-600">
                    <FileText className="h-3 w-3" />
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs px-2 py-1 ${
                      contractApprovals[expediente.id]?.comprador && contractApprovals[expediente.id]?.vendedor
                          ? "bg-gray-100 text-gray-700 border-gray-300"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                  >
                    {(() => {
                      const approvals = contractApprovals[expediente.id];
                      if (!approvals) {
                        return "0/2 aprobaciones";
                      }
                      
                      const compradorAprobado = approvals.comprador;
                      const vendedorAprobado = approvals.vendedor;
                      const totalAprobaciones = (compradorAprobado ? 1 : 0) + (vendedorAprobado ? 1 : 0);
                      
                      return `${totalAprobaciones}/2 aprobaciones`;
                    })()}
                  </Badge>
                </div>
              </div>
            )}

            {/* Indicador de estado para Firma agendada */}
            {expediente.estado === "LISTO_PARA_FIRMA" && (
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 text-gray-600">
                    <CheckCircle className="h-3 w-3" />
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-700 border-gray-300"
                  >
                    Firma agendada
                  </Badge>
                </div>
              </div>
            )}

            {/* Indicador sutil para expedientes listos para proyecto de escritura */}
            {(() => {
              const docCount = getDocumentStatusCount(expediente.id);
              const totalDocs = documentosCompraventa.length;
              const todosDocumentosValidados = docCount.validated === totalDocs && totalDocs > 0;
              const estaEnExpedientePreliminar = expediente.estado === "EXPEDIENTE_PRELIMINAR";
              
              // Mostrar un indicador sutil si todos los documentos están validados
              if (todosDocumentosValidados && estaEnExpedientePreliminar) {
                return (
                  <div className="pt-2 border-t border-slate-200">
                    <div className="flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                );
              }
              
              return null;
            })()}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderExpedienteModal = () => {
    if (!selectedExpediente) return null;

    return (
      <Dialog open={showExpedienteModal} onOpenChange={setShowExpedienteModal}>
        <DialogContent className="modal-expediente-ancho flex flex-col">
          <DialogHeader className="flex-shrink-0 pb-1 bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 pl-6">
            <DialogTitle className="text-base text-blue-900">
              Expediente {selectedExpediente.numeroSolicitud}
            </DialogTitle>
            <DialogDescription className="text-xs text-blue-700">
              Compraventa de {selectedExpediente.inmueble.tipo} - {selectedExpediente.inmueble.superficie}m²
            </DialogDescription>
            
            {/* Indicador compacto de status */}
            <div className="flex items-center gap-3 mt-2 pt-2 border-t border-blue-100">
              <span className="text-xs font-medium text-blue-600">Estado:</span>
              <div className="flex items-center gap-2">
                {KANBAN_COLUMNS.map((column) => {
                  const realStatus = getRealExpedienteStatus(selectedExpediente);
                  const isActive = realStatus === column.id;
                  return (
                    <div key={column.id} className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${
                        isActive 
                          ? column.id === "EXPEDIENTE_PRELIMINAR" 
                            ? "bg-blue-500"
                            : column.id === "PROYECTO_ESCRITURA"
                            ? "bg-yellow-500"
                            : column.id === "LISTO_PARA_FIRMA"
                            ? "bg-green-500"
                            : "bg-purple-500"
                          : "bg-gray-300"
                      }`}></div>
                      <span className={`text-xs ${
                        isActive ? "font-medium text-blue-800" : "text-gray-500"
                      }`}>
                        {column.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 pr-2">
            <Tabs defaultValue="informacion" className="space-y-2">
                <TabsList className="grid w-full grid-cols-3 h-7 bg-blue-50 border border-blue-200">
                <TabsTrigger value="informacion" className="text-xs py-0.5 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900 text-blue-700">
                    Trámite
                </TabsTrigger>
                <TabsTrigger value="pagos" className="text-xs py-0.5 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900 text-blue-700">
                  Pagos
                </TabsTrigger>
                <TabsTrigger value="historial" className="text-xs py-0.5 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900 text-blue-700">
                  Historial
                </TabsTrigger>
              </TabsList>

              <TabsContent value="informacion" className="space-y-2">
                {/* Información general - Sin contenedor */}
                <div className="grid grid-cols-2 gap-4 text-sm py-3 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100 px-4">
                      <div>
                        <span className="text-blue-600 text-xs font-medium">Comprador:</span>
                        <p className="font-medium text-sm text-blue-900">
                          {selectedExpediente.comprador.nombre} {selectedExpediente.comprador.apellidoPaterno}
                        </p>
                      </div>
                      <div>
                        <span className="text-blue-600 text-xs font-medium">Vendedor:</span>
                        <p className="font-medium text-sm text-blue-900">
                          {selectedExpediente.vendedor.nombre} {selectedExpediente.vendedor.apellidoPaterno}
                        </p>
                      </div>
                    </div>

                {/* Borrador del Contrato - Solo mostrar si NO está en EXPEDIENTE_PRELIMINAR ni en COMPLETADO */}
                {selectedExpediente.estado !== "EXPEDIENTE_PRELIMINAR" && selectedExpediente.estado !== "COMPLETADO" && (
                <div className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-blue-200 via-blue-50 to-white border border-blue-200 rounded-lg hover:bg-gradient-to-r hover:from-blue-300 hover:via-blue-100 hover:to-blue-50 cursor-pointer transition-all duration-200 shadow-sm"
                           onClick={() => {
                             const documentoContrato = {
                               id: "contrato-borrador",
                               nombre: "Contrato de Compraventa - Borrador",
                             descripcion: "Documento en expediente preliminar - Generado automáticamente",
                               archivo: "http://localhost:3000/documentos_legales/Contrato_Compraventa_Borrador.pdf",
                               estado: "pendiente",
                               requerido: true,
                               fechaSubida: null,
                             };
                             handleOpenDocument(documentoContrato);
                           }}>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-200 to-blue-300 rounded flex items-center justify-center shadow-sm">
                      <FileText className="h-3 w-3 text-blue-800" />
                          </div>
                    <div>
                      <h4 className="font-medium text-sm text-blue-900">Contrato de Compraventa</h4>
                      <Badge variant="outline" className="text-xs bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border-blue-300 mt-1 shadow-sm">
                        <Clock className="h-2 w-2 mr-1" />
                          {selectedExpediente.estado === "PROYECTO_ESCRITURA" ? "Proyecto de escritura" : 
                           selectedExpediente.estado === "LISTO_PARA_FIRMA" ? "Firma agendada" : "Expediente preliminar"}
                              </Badge>
                            </div>
                        </div>
                  <Button variant="outline" size="sm" className="text-xs h-7 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border-blue-300 hover:bg-gradient-to-r hover:from-blue-200 hover:to-blue-100 shadow-sm">
                    <Eye className="h-3 w-3 mr-1" />
                    Ver
                          </Button>
                      </div>
                )}

                {/* Información de fecha programada para Firma agendada */}
                {selectedExpediente.estado === "LISTO_PARA_FIRMA" && (
                  <div className="mt-4 space-y-3">
                    {/* Información de la cita programada */}
                    {fechasFirmaProgramadas[selectedExpediente.id] && (
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-green-600" />
                          <h4 className="text-sm font-medium text-green-900">Cita de Firma Programada</h4>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-gray-600" />
                            <span className="text-gray-700">
                              <strong>Fecha:</strong> {new Date(fechasFirmaProgramadas[selectedExpediente.id].fecha).toLocaleDateString('es-MX', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-gray-600" />
                            <span className="text-gray-700">
                              <strong>Hora:</strong> {fechasFirmaProgramadas[selectedExpediente.id].hora}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-gray-600" />
                            <span className="text-gray-700">
                              <strong>Lugar:</strong> {fechasFirmaProgramadas[selectedExpediente.id].lugar}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building className="h-3 w-3 text-gray-600" />
                            <span className="text-gray-700">
                              <strong>Sala:</strong> {fechasFirmaProgramadas[selectedExpediente.id].sala}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button
                        onClick={() => {
                          console.log(`✅ Firma completada para ${selectedExpediente.numeroSolicitud}`);
                          addComentarioExpediente(selectedExpediente.id, "✅ FIRMA COMPLETADA: La firma del contrato de compraventa se ha realizado exitosamente. El expediente ha sido completado.", "Licenciado", "general");
                          
                          // Mover expediente a "Post firma"
                          const success = updateExpedienteEstado(selectedExpediente.id, "COMPLETADO", licenciadoId || "");
                          if (success) {
                            setExpedientes(prev => prev.map(exp => 
                              exp.id === selectedExpediente.id 
                                ? { ...exp, estado: "COMPLETADO" as EstadoExpediente }
                                : exp
                            ));
                            setSelectedExpediente(prev => prev ? { ...prev, estado: "COMPLETADO" as EstadoExpediente } : null);
                          }
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm h-8"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Firma Completada
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => setShowRescheduleModal(true)}
                        className="flex-1 border-orange-300 text-orange-600 hover:bg-orange-50 text-sm h-8"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Reprogramar Firma
                      </Button>
                    </div>
                  </div>
                )}

                {/* Sección de Post Firma para expedientes completados */}
                {selectedExpediente.estado === "COMPLETADO" && (
                  <div className="mt-4 space-y-4">
                    {/* Resumen discreto */}
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span className="font-medium">Documentación Post Firma:</span>
                      <span>4 Documentos</span>
                      <span>•</span>
                      <span>2 Impuestos</span>
                      <span>•</span>
                      <span className="text-orange-600">4 Pendientes</span>
                      <span>•</span>
                      <span className="text-green-600">0 Completados</span>
                    </div>

                    {/* Secciones por entidad */}
                    <div className="space-y-4">
                      {/* RPPC de B.C. */}
                      <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-900">RPPC de B.C.</span>
                            <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300 text-xs">
                              Pendiente
                            </Badge>
                            </div>
                            <Button
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-6 px-3"
                            onClick={async (event) => {
                              console.log(`📄💰 Procesando documentos e impuestos RPPC para ${selectedExpediente.numeroSolicitud}`);
                              const button = event?.target as HTMLButtonElement;
                              const originalText = button.textContent;
                              button.textContent = 'Procesando...';
                              button.disabled = true;
                              await new Promise(resolve => setTimeout(resolve, 3000));
                              console.log(`✅ Documentos e impuestos RPPC procesados exitosamente para ${selectedExpediente.numeroSolicitud}`);
                              button.textContent = '✓ Completado';
                              button.className = 'bg-green-600 hover:bg-green-700 text-white text-xs h-6 px-3';
                              setTimeout(() => {
                                button.textContent = originalText;
                                button.disabled = false;
                                button.className = 'bg-blue-600 hover:bg-blue-700 text-white text-xs h-6 px-3';
                              }, 2000);
                            }}
                          >
                            <FileEdit className="h-3 w-3 mr-1" />
                            Procesar Todo
                          </Button>
                          </div>
                        
                        {/* Tabla compacta */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs py-1 border-b border-gray-100">
                            <span className="text-gray-500">Escritura Pública</span>
                            <Button
                              size="sm"
                              variant="outline" 
                              className="text-xs h-5 px-2"
                              onClick={() => {
                                setSelectedDocumentInfo({
                                  title: "Escritura Pública",
                                  type: "document",
                                  expediente: selectedExpediente.numeroSolicitud
                                });
                                setShowDocumentModal(true);
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between text-xs py-1 border-b border-gray-100">
                            <span className="text-gray-500">Certificado de Libertad</span>
                            <Button 
                              size="sm"
                              variant="outline" 
                              className="text-xs h-5 px-2"
                              onClick={() => {
                                setSelectedDocumentInfo({
                                  title: "Certificado de Libertad",
                                  type: "document",
                                  expediente: selectedExpediente.numeroSolicitud
                                });
                                setShowDocumentModal(true);
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between text-xs py-1">
                            <span className="text-gray-500">Impuesto Sobre Adquisición</span>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs h-5 px-2"
                              onClick={() => {
                                setSelectedTaxInfo({
                                  title: "Impuesto Sobre Adquisición",
                                  expediente: selectedExpediente.numeroSolicitud,
                                  details: {
                                    icon: "💰",
                                    propertyValue: "$1,200,000.00",
                                    taxRate: "2.5%",
                                    total: "$30,000.00"
                                  }
                                });
                                setShowTaxModal(true);
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                          </div>


                      {/* SAT */}
                      <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium text-gray-900">SAT</span>
                            <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300 text-xs">
                              Pendiente
                            </Badge>
                          </div>
                          <Button
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-6 px-3"
                            onClick={async (event) => {
                              console.log(`📄💰 Procesando documentos e impuestos SAT para ${selectedExpediente.numeroSolicitud}`);
                              const button = event?.target as HTMLButtonElement;
                              const originalText = button.textContent;
                              button.textContent = 'Procesando...';
                              button.disabled = true;
                              await new Promise(resolve => setTimeout(resolve, 3000));
                              console.log(`✅ Documentos e impuestos SAT procesados exitosamente para ${selectedExpediente.numeroSolicitud}`);
                              button.textContent = '✓ Completado';
                              button.className = 'bg-green-600 hover:bg-green-700 text-white text-xs h-6 px-3';
                              setTimeout(() => {
                                button.textContent = originalText;
                                button.disabled = false;
                                button.className = 'bg-blue-600 hover:bg-blue-700 text-white text-xs h-6 px-3';
                              }, 2000);
                            }}
                          >
                            <FileEdit className="h-3 w-3 mr-1" />
                            Procesar Todo
                          </Button>
                        </div>
                        
                        {/* Tabla compacta */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs py-1 border-b border-gray-100">
                            <span className="text-gray-500">Declaración de Venta</span>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs h-5 px-2"
                              onClick={() => {
                                setSelectedDocumentInfo({
                                  title: "Declaración de Venta",
                                  type: "document",
                                  expediente: selectedExpediente.numeroSolicitud
                                });
                                setShowDocumentModal(true);
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between text-xs py-1 border-b border-gray-100">
                            <span className="text-gray-500">Constancia de Situación Fiscal</span>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs h-5 px-2"
                              onClick={() => {
                                setSelectedDocumentInfo({
                                  title: "Constancia de Situación Fiscal",
                                  type: "document",
                                  expediente: selectedExpediente.numeroSolicitud
                                });
                                setShowDocumentModal(true);
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between text-xs py-1">
                            <span className="text-gray-500">ISR por Venta</span>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs h-5 px-2"
                              onClick={() => {
                                setSelectedTaxInfo({
                                  title: "ISR por Venta de Inmueble",
                                  expediente: selectedExpediente.numeroSolicitud,
                                  details: {
                                    icon: "🏛️",
                                    saleValue: "$1,200,000.00",
                                    acquisitionCost: "$800,000.00",
                                    profit: "$400,000.00",
                                    taxRate: "25%",
                                    total: "$100,000.00"
                                  }
                                });
                                setShowTaxModal(true);
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contrato de Compraventa - Al final de Post Firma */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <h5 className="font-semibold text-gray-900">Contrato de Compraventa</h5>
                        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                          Firmado
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-gray-700">Escritura Final</span>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs h-6 px-2"
                            onClick={() => {
                              console.log(`📄 Abriendo Escritura Final para ${selectedExpediente.numeroSolicitud}`);
                              setShowEscrituraModal(true);
                            }}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Ver PDF
                          </Button>
                        </div>
                        
                        <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded border border-blue-200">
                          <div className="flex items-center gap-1 mb-1">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span className="font-medium text-green-700">Estado de la Escritura</span>
                          </div>
                          <p>Escritura firmada exitosamente el {new Date().toLocaleDateString('es-MX')}. Documento legalmente válido y registrado.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                      {/* Funcionalidad adicional para Proyecto de escritura */}
                      {selectedExpediente.estado === "PROYECTO_ESCRITURA" && (
                        <div className="border-t pt-4 space-y-4">
                          {/* Estado de comunicación con las partes - Solo mostrar si el contrato está validado pero no todo aprobado */}
                          {(() => {
                            const contractCount = getContractValidationCount(selectedExpediente.id);
                            const approvals = contractApprovals[selectedExpediente.id];
                            const bothApproved = approvals?.comprador && approvals?.vendedor;
                            
                            if (contractCount.approved === contractCount.total && !bothApproved) {
                              return (
                                <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium text-green-900">
                                        Borrador enviado a las partes
                                      </span>
                                      <span className="text-xs text-green-700 mt-1">
                                        El draft del contrato ya se hizo llegar a ambas partes. Han sido notificados y estamos esperando la aprobación de ambos lados para programar la cita de firma.
                                      </span>
                            </div>
                          </div>
                                </div>
                              );
                            }
                            return null;
                          })()}

                          {/* Botón para agendar cita de firma - Mostrar cuando ambas partes están aprobadas */}
                          {contractApprovals[selectedExpediente.id]?.comprador && contractApprovals[selectedExpediente.id]?.vendedor && (
                            <div className="mb-4">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                  setShowAppointmentModal(true);
                              }}
                              size="sm"
                                className="w-full bg-green-600 hover:bg-green-700 text-white text-xs"
                              >
                                <Calendar className="h-3 w-3 mr-1" />
                                Agendar cita para firma
                            </Button>
                          </div>
                          )}

                          {/* Aprobaciones de las partes - Compacto */}
                          <div 
                            className="space-y-2 cursor-pointer hover:bg-blue-50/50 transition-colors duration-200 rounded-lg p-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Solo activar si no están aprobadas ambas partes
                              if (!contractApprovals[selectedExpediente.id]?.comprador || !contractApprovals[selectedExpediente.id]?.vendedor) {
                                handleAutoApproveBothParties(selectedExpediente.id);
                              }
                            }}
                            title={(!contractApprovals[selectedExpediente.id]?.comprador || !contractApprovals[selectedExpediente.id]?.vendedor) ? "Click para simular aprobación de ambas partes" : ""}
                          >
                            <h4 className="text-sm font-medium text-blue-900 bg-gradient-to-r from-blue-50 to-white px-3 py-2 rounded-lg border border-blue-100">Aprobaciones</h4>
                            
                            {/* Comprador */}
                            <div className="flex items-center justify-between p-2 bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">Comprador</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {contractApprovals[selectedExpediente.id]?.comprador ? (
                                  <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                                    <CheckCircle className="h-2 w-2 mr-1" />
                                    Aprobado
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">
                                    <Clock className="h-2 w-2 mr-1" />
                                    Pendiente
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Vendedor */}
                            <div className="flex items-center justify-between p-2 bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">Vendedor</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {contractApprovals[selectedExpediente.id]?.vendedor ? (
                                  <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                                    <CheckCircle className="h-2 w-2 mr-1" />
                                    Aprobado
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">
                                    <Clock className="h-2 w-2 mr-1" />
                                    Pendiente
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Resumen de aprobaciones - Compacto */}
                            {contractApprovals[selectedExpediente.id]?.comprador && contractApprovals[selectedExpediente.id]?.vendedor && (
                              <div className="space-y-2">
                                <div className="p-2 bg-gradient-to-r from-green-50 to-blue-50 rounded border border-green-200">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <p className="text-sm font-medium text-green-900">
                                      ¡Aprobado por ambas partes!
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                {/* Documentos de Compraventa - Compacto - Solo mostrar si NO está completado */}
                {selectedExpediente.estado !== "COMPLETADO" && (
                <div className="py-1 bg-gradient-to-br from-blue-200 via-blue-100 to-blue-50 rounded-lg border border-blue-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2 px-3 pt-1">
                    <h3 className="text-base font-semibold text-blue-900 drop-shadow-sm">Documentos de Compraventa</h3>
                    <div className="flex items-center gap-3">
                      {/* Botón para mover expediente automáticamente - Solo mostrar si está en EXPEDIENTE_PRELIMINAR */}
                      {selectedExpediente.estado === "EXPEDIENTE_PRELIMINAR" && (
                        <button
                          onClick={() => handleAutoMoveExpediente(selectedExpediente.id)}
                          className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 cursor-pointer transition-colors"
                        >
                          <span>Validar todos</span>
                        </button>
                )}
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 text-xs shadow-sm">
                          {(() => {
                            const docCount = getDocumentStatusCount(selectedExpediente?.id || "");
                            return `${docCount.validated} de ${documentosCompraventa.length} validados`;
                          })()}
                        </Badge>
                      </div>
                      </div>
                      
                    <div className="space-y-4">
                      {/* Agrupar por categoría */}
                      {[
                        "Documentos del Comprador",
                        "Documentos del Vendedor",
                        "Documentos del Inmueble",
                      ].map((categoria) => {
                        const docsCategoria = documentosCompraventa.filter(
                          (doc) => doc.categoria === categoria
                        );
                        
                        // Separar documentos validados de pendientes
                        const expedienteDocumentStates = documentStates[selectedExpediente.id] || {};
                        const docsValidados = docsCategoria.filter(doc => 
                          expedienteDocumentStates[doc.id] === "aceptado" || doc.estado === "validado"
                        );
                        const docsPendientes = docsCategoria.filter(doc => 
                          !(expedienteDocumentStates[doc.id] === "aceptado" || doc.estado === "validado")
                        );
                        
                        return (
                          <div key={categoria} className="space-y-2">
                            <h3 className="font-semibold text-blue-900 border-b border-blue-300 pb-1 bg-gradient-to-r from-blue-200 via-blue-100 to-blue-50 px-3 py-2 rounded-t-lg shadow-sm">
                              {categoria}
                              <Badge
                                variant="outline"
                                className="ml-auto text-xs bg-blue-100 text-blue-700 border-blue-300 shadow-sm"
                              >
                                {docsValidados.length}/{docsCategoria.length}
                              </Badge>
                              {(categoria === "Documentos del Comprador" || categoria === "Documentos del Vendedor") && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setShowContactModal(true)}
                                  className="ml-2 text-xs bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200 shadow-sm"
                                >
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  Contactar
                                </Button>
                              )}
                            </h3>
                            
                            {/* Documentos pendientes (siempre visibles) */}
                            {docsPendientes.length > 0 && (
                              <div className="space-y-0.5">
                                {docsPendientes.map((doc) => (
                                <div
                                  key={doc.id}
                                    className="flex items-center justify-between py-1.5 px-3 border-b border-blue-100 hover:bg-blue-50 cursor-pointer transition-colors"
                                    onClick={() => handleOpenDocument(doc)}
                                  >
                                    <div className="flex items-center gap-2 flex-1">
                                      {doc.requerido && (
                                        <span className="text-red-500 text-xs">*</span>
                                      )}
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                          <span className="text-sm font-medium text-blue-900">
                                          {doc.nombre}
                                        </span>
                                        {!doc.requerido && (
                                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                                            Opcional
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                      <Badge variant="outline" className={`text-xs ${
                                        expedienteDocumentStates[doc.id] === "rechazado"
                                          ? "bg-red-100 text-red-700 border-red-200"
                                          : doc.estado === "subido"
                                          ? "bg-blue-100 text-blue-700 border-blue-200"
                                          : "bg-yellow-100 text-yellow-700 border-yellow-200"
                                      }`}>
                                        {expedienteDocumentStates[doc.id] === "rechazado" ? (
                                          <><XCircle className="h-2 w-2 mr-1" />Rechazado</>
                                        ) : doc.estado === "subido" ? (
                                          <><Clock className="h-2 w-2 mr-1" />Subido</>
                                        ) : (
                                          <><AlertCircle className="h-2 w-2 mr-1" />Pendiente</>
                                        )}
                                      </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                            )}
                            
                            
                          </div>
                        );
                      })}
                    </div>
                </div>
                )}
                
                {/* Sección separada de documentos validados - Solo mostrar si NO está completado */}
                {selectedExpediente.estado !== "COMPLETADO" && (() => {
                  const expedienteDocumentStates = documentStates[selectedExpediente.id] || {};
                  const todosLosDocsValidados = documentosCompraventa.filter(doc => 
                    expedienteDocumentStates[doc.id] === "aceptado" || doc.estado === "validado"
                  );
                  
                  if (todosLosDocsValidados.length > 0) {
                    return (
                      <div className="mt-6 pt-4">
                        <button
                          onClick={() => setShowValidatedDocuments(!showValidatedDocuments)}
                          className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-lg border border-green-300 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">
                              Documentos validados ({todosLosDocsValidados.length})
                            </span>
                          </div>
                          <ChevronDown className={`h-4 w-4 text-green-600 transition-transform ${
                            showValidatedDocuments ? 'rotate-180' : ''
                          }`} />
                        </button>
                        
                        {showValidatedDocuments && (
                          <div className="mt-3 space-y-1">
                            {todosLosDocsValidados.map((doc) => (
                              <div
                                key={doc.id}
                                className="flex items-center justify-between py-2 px-4 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 cursor-pointer transition-colors rounded"
                                onClick={() => handleOpenDocument(doc)}
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                                    <CheckCircle className="h-3 w-3 text-green-600" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium text-green-700">
                                        {doc.nombre}
                                      </span>
                                      <Badge variant="outline" className="text-xs bg-green-100 text-green-600 border-green-300">
                                        {doc.categoria}
                                      </Badge>
                                      {!doc.requerido && (
                                        <Badge variant="outline" className="text-xs bg-green-50 text-green-500 border-green-200">
                                          Opcional
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <Badge variant="outline" className="text-xs bg-green-100 text-green-600 border-green-300">
                                  <CheckCircle className="h-2 w-2 mr-1" />
                                  Validado
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                })()}
              </TabsContent>

              <TabsContent value="validaciones" className="space-y-6">
                <Card className="bg-gradient-to-br from-indigo-50 via-purple-50/50 to-pink-50 border-indigo-200/60">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Validaciones de Inteligencia Artificial
                        </CardTitle>
                        <CardDescription>
                          Resultados de validación automática de documentos
                        </CardDescription>
                      </div>
                      {validationReports[selectedExpediente.id] && (
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleRevalidation(selectedExpediente.id)
                          }
                          disabled={validatingExpedientes.has(
                            selectedExpediente.id
                          )}
                          className="flex items-center gap-2"
                        >
                          {validatingExpedientes.has(selectedExpediente.id) ? (
                            <>
                              <div className="animate-spin">
                                <Shield className="h-4 w-4" />
                              </div>
                              {revalidatingExpedientes.has(
                                selectedExpediente.id
                              )
                                ? "Revalidando..."
                                : "Validando..."}
                            </>
                          ) : (
                            <>
                              <Shield className="h-4 w-4" />
                              Revalidar Documentos
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {validationReports[selectedExpediente.id] ? (
                      <div className="space-y-4">
                        {/* Resumen general */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                validationReports[selectedExpediente.id]
                                  .status === "passed"
                                  ? "bg-gray-100"
                                  : validationReports[selectedExpediente.id]
                                      .status === "warning"
                                  ? "bg-yellow-100"
                                  : "bg-red-100"
                              }`}
                            >
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                Validación{" "}
                                {validationReports[selectedExpediente.id]
                                  .status === "passed"
                                  ? "Exitosa"
                                  : validationReports[selectedExpediente.id]
                                      .status === "warning"
                                  ? "Con Observaciones"
                                  : "Fallida"}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {
                                  validationReports[
                                    selectedExpediente.id
                                  ].validations.filter((v) => v.result.isValid)
                                    .length
                                }{" "}
                                de{" "}
                                {
                                  validationReports[selectedExpediente.id]
                                    .validations.length
                                }{" "}
                                documentos aprobados
                              </p>
                            </div>
                          </div>
                          <Badge
                            className={
                              validationReports[selectedExpediente.id]
                                .status === "passed"
                                ? "bg-gray-100 text-gray-800"
                                : validationReports[selectedExpediente.id]
                                    .status === "warning"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {
                              validationReports[selectedExpediente.id]
                                .overallScore
                            }
                            % Completado
                          </Badge>
                        </div>

                        {/* Tabla de resultados */}
                        <div className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-50 px-6 py-4 border-b">
                            <h4 className="font-semibold text-gray-900 text-lg">
                              Resultados por Documento
                            </h4>
                          </div>
                          <div className="divide-y">
                            {validationReports[
                              selectedExpediente.id
                            ].validations.map((validation, index) => {
                              // Mapear a documento real
                              const documentoReal = documentosCompraventa.find(
                                (doc) =>
                                  doc.nombre
                                    .toLowerCase()
                                    .includes(
                                      validation.documentType.toLowerCase()
                                    ) ||
                                  (validation.documentType ===
                                    "INE vs Escritura" &&
                                    doc.nombre.includes("INE")) ||
                                  (validation.documentType === "Avalúo" &&
                                    doc.nombre.includes("Avalúo")) ||
                                  (validation.documentType ===
                                    "Escritura Pública" &&
                                    doc.nombre.includes("Escritura")) ||
                                  (validation.documentType === "CLG" &&
                                    doc.nombre.includes("CLG"))
                              );

                              return (
                                <div
                                  key={index}
                                  className="p-6 hover:bg-gray-50 transition-colors"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                      <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                          validation.result.isValid
                                            ? "bg-gray-100"
                                            : "bg-red-100"
                                        }`}
                                      >
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <h5 className="font-medium text-gray-900">
                                            {validation.documentType}
                                          </h5>
                                          <Badge
                                            variant="outline"
                                            className={
                                              validation.result.isValid
                                                ? "bg-gray-100 text-gray-700 border-gray-300"
                                                : "bg-gray-100 text-gray-700 border-gray-300"
                                            }
                                          >
                                            {validation.result.isValid
                                              ? "Aprobado"
                                              : "Requiere Atención"}
                                          </Badge>
                                        </div>
                                        {validation.result.issues.length >
                                          0 && (
                                          <p className="text-sm text-gray-600 mb-1">
                                            {
                                              validation.result.issues[0]
                                                .message
                                            }
                                          </p>
                                        )}
                                        {validation.result.suggestions &&
                                          validation.result.suggestions.length >
                                            0 && (
                                            <p className="text-xs text-gray-600">
                                              {" "}
                                              {validation.result.suggestions[0]}
                                            </p>
                                          )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {documentoReal && (
                                        <Button
                                          variant="outline"
                                          size="default"
                                          onClick={() =>
                                            handleOpenDocument(
                                              documentoReal.archivo
                                            )
                                          }
                                          className="text-sm"
                                        >
                                          <Eye className="h-4 w-4 mr-2" />
                                          Ver Documento
                                        </Button>
                                      )}

                                      {/* Botones de aprobación/rechazo manual */}
                                      {!manualValidations[
                                        selectedExpediente.id
                                      ]?.[validation.documentType] ? (
                                        <div className="flex gap-2">
                                          <Button
                                            variant="outline"
                                            size="default"
                                            onClick={() =>
                                              handleManualValidation(
                                                selectedExpediente.id,
                                                validation.documentType,
                                                true
                                              )
                                            }
                                            className="text-sm bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-100"
                                          >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Aprobar
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="default"
                                            onClick={() => {
                                              const reason = prompt(
                                                "¿Por qué rechazas esta validación?"
                                              );
                                              if (reason) {
                                                handleManualValidation(
                                                  selectedExpediente.id,
                                                  validation.documentType,
                                                  false,
                                                  reason
                                                );
                                              }
                                            }}
                                            className="text-sm bg-gray-100 text-gray-700 border-gray-300 hover:bg-red-100"
                                          >
                                            <AlertCircle className="h-4 w-4 mr-2" />
                                            Rechazar
                                          </Button>
                                        </div>
                                      ) : (
                                        <Badge
                                          className={
                                            manualValidations[
                                              selectedExpediente.id
                                            ][validation.documentType].approved
                                              ? "bg-gray-100 text-gray-800 border-gray-300"
                                              : "bg-gray-100 text-gray-800 border-gray-300"
                                          }
                                        >
                                          {manualValidations[
                                            selectedExpediente.id
                                          ][validation.documentType].approved
                                            ? "Aprobado"
                                            : "Rechazado"}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Acciones recomendadas */}
                        {validationReports[selectedExpediente.id]
                          .recommendedActions.length > 0 && (
                          <div className="bg-gray-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                              <TrendingUp className="h-4 w-4" />
                              Acciones Recomendadas
                            </h4>
                            <ul className="text-sm text-gray-800 space-y-1">
                              {validationReports[
                                selectedExpediente.id
                              ].recommendedActions.map((action, idx) => (
                                <li key={idx}>• {action}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Sin Validaciones IA
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Este expediente aún no ha sido validado por IA
                        </p>
                        <p className="text-sm text-gray-500">
                          Arrastra la tarjeta a "Expediente preliminar" para activar la
                          validación automática
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Comentarios */}
                <Card className="bg-gradient-to-br from-indigo-50 via-purple-50/50 to-pink-50 border-indigo-200/60">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Comentarios</CardTitle>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSortOrder(
                              sortOrder === "newest" ? "oldest" : "newest"
                            )
                          }
                          className="flex items-center gap-2"
                        >
                          {sortOrder === "newest" ? (
                            <>
                              <ArrowDown className="h-3 w-3" />
                              Más reciente
                            </>
                          ) : (
                            <>
                              <ArrowUp className="h-3 w-3" />
                              Más antiguo
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setShowComentarioModal(true)}
                          className="bg-gray-600 hover:bg-gray-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedExpediente.comentarios
                        .sort((a: any, b: any) => {
                          const dateA = new Date(a.fecha).getTime();
                          const dateB = new Date(b.fecha).getTime();
                          return sortOrder === "newest"
                            ? dateB - dateA
                            : dateA - dateB;
                        })
                        .map((comentario: any) => (
                          <div
                            key={comentario.id}
                            className="p-3 border rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">
                                {comentario.usuario}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDate(comentario.fecha)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">
                              {comentario.comentario}
                            </p>
                          </div>
                        ))}
                      {selectedExpediente.comentarios.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">
                          No hay comentarios aún
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pagos" className="space-y-6">
                {/* Pagos */}
                <Card className="bg-gradient-to-br from-indigo-50 via-purple-50/50 to-pink-50 border-indigo-200/60">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Estado de Pagos
                      </CardTitle>
                      {selectedExpediente.pagos.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSortOrder(
                              sortOrder === "newest" ? "oldest" : "newest"
                            )
                          }
                          className="flex items-center gap-2"
                        >
                          {sortOrder === "newest" ? (
                            <>
                              <ArrowDown className="h-3 w-3" />
                              Más reciente
                            </>
                          ) : (
                            <>
                              <ArrowUp className="h-3 w-3" />
                              Más antiguo
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Resumen financiero */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <Label className="text-sm font-medium text-gray-600">
                            Costo Total
                          </Label>
                          <p className="text-xl font-bold text-gray-900 mt-1">
                            {formatCurrency(costoTotalExpediente)}
                          </p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <Label className="text-sm font-medium text-gray-600">
                            Total Pagado
                          </Label>
                          <p className="text-xl font-bold text-gray-700 mt-1">
                            {formatCurrency(totalPagado)}
                          </p>
                        </div>
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                          <Label className="text-sm font-medium text-red-600">
                            Saldo Pendiente
                          </Label>
                          <p className="text-xl font-bold text-red-700 mt-1">
                            {formatCurrency(saldoPendiente)}
                          </p>
                        </div>
                      </div>

                      {/* Barra de progreso */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            Progreso de Pagos
                          </span>
                          <span className="font-medium">
                            {porcentajePagado.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${porcentajePagado}%` }}
                          />
                        </div>
                      </div>

                      {/* Historial de pagos */}
                      <div>
                        <Label className="text-lg font-semibold text-gray-900 mb-4 block">
                          Historial de Pagos
                        </Label>
                        <div className="space-y-3">
                          {pagosDemoExpediente.map((pago) => (
                            <div
                              key={pago.id}
                              className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3 flex-1">
                                  <div
                                    className={`w-4 h-4 rounded-full mt-1 ${
                                      pago.estado === "confirmado"
                                        ? "bg-gray-500"
                                        : pago.estado === "pendiente"
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                    }`}
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <p className="text-lg font-semibold text-gray-900">
                                        {formatCurrency(pago.monto)}
                                      </p>
                                      <Badge
                                        className={
                                          pago.estado === "confirmado"
                                            ? "bg-gray-100 text-gray-800 border-gray-300"
                                            : pago.estado === "pendiente"
                                            ? "bg-gray-100 text-gray-800 border-gray-300"
                                            : "bg-gray-100 text-gray-800 border-gray-300"
                                        }
                                      >
                                        {pago.estado === "confirmado" && (
                                          <CheckCircle className="h-3 w-3 mr-1" />
                                        )}
                                        {pago.estado === "pendiente" && (
                                          <Clock className="h-3 w-3 mr-1" />
                                        )}
                                        {pago.estado.charAt(0).toUpperCase() +
                                          pago.estado.slice(1)}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                      {pago.concepto}
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-500">
                                      <div>
                                        <span className="font-medium">
                                          Fecha:
                                        </span>{" "}
                                        {pago.fecha ? new Date(
                                          pago.fecha
                                        ).toLocaleDateString("es-MX", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        }) : "Pendiente"}
                                      </div>
                                      <div>
                                        <span className="font-medium">
                                          Método:
                                        </span>{" "}
                                        {pago.metodo}
                                      </div>
                                      <div>
                                        <span className="font-medium">
                                          Banco:
                                        </span>{" "}
                                        {pago.banco}
                                      </div>
                                      <div>
                                        <span className="font-medium">
                                          Referencia:
                                        </span>{" "}
                                        {pago.referencia}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleOpenDocument(pago.comprobante)
                                    }
                                    className="text-xs"
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    Ver Comprobante
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Próximos pagos */}
                      <div>
                        <Label className="text-lg font-semibold text-gray-900 mb-4 block">
                          Próximos Pagos Programados
                        </Label>
                        <div className="space-y-3">
                          <div className="border rounded-lg p-4 bg-yellow-50 border-yellow-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-gray-900">
                                  Segundo Pago (30%)
                                </p>
                                <p className="text-sm text-gray-600">
                                  Avance de trámite y preparación de documentos
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Vence: 30 de enero de 2025
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-yellow-700">
                                  $7,500.00
                                </p>
                                <Badge className="bg-gray-100 text-gray-800 border-gray-300">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Pendiente
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="border rounded-lg p-4 bg-orange-50 border-orange-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-gray-900">
                                  Pago Final (40%)
                                </p>
                                <p className="text-sm text-gray-600">
                                  Liquidación final y gastos de escrituración
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Al momento de la firma
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-orange-700">
                                  $10,000.00
                                </p>
                                <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Por confirmar
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Desglose de pagos por parte */}
                      <div>
                        <Label className="text-lg font-semibold text-gray-900 mb-4 block">
                          Desglose por Parte
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Comprador */}
                          <div className="border rounded-lg p-4 bg-gray-50 border-green-200">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-600" />
                                <h4 className="font-semibold text-gray-900">Comprador</h4>
                              </div>
                              {pagosPorParte[selectedExpediente.id]?.comprador ? (
                                <Badge className="bg-gray-100 text-gray-800 border-gray-300">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Pagado
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Pendiente
                                </Badge>
                              )}
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Total asignado:</span>
                                <span className="font-medium">{formatCurrency(montoPorParte)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Pagado:</span>
                                <span className="font-medium text-gray-600">
                                  {formatCurrency(montoPagadoComprador)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Pendiente:</span>
                                <span className="font-medium text-red-600">
                                  {formatCurrency(montoPendienteComprador)}
                                </span>
                              </div>
                              <div className="mt-3">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-gray-600 h-2 rounded-full transition-all duration-500"
                                    style={{ 
                                      width: `${pagosPorParte[selectedExpediente.id]?.comprador 
                                        ? 100 
                                        : (montoPagadoComprador / montoPorParte) * 100
                                      }%` 
                                    }}
                                  />
                                </div>
                                <p className="text-xs text-gray-500 mt-1 text-center">
                                  {pagosPorParte[selectedExpediente.id]?.comprador 
                                    ? "100.0% completado"
                                    : `${((montoPagadoComprador / montoPorParte) * 100).toFixed(1)}% completado`
                                  }
                                </p>
                              </div>
                              {!pagosPorParte[selectedExpediente.id]?.comprador && (
                                <div className="mt-3">
                                  <Button
                                    size="sm"
                                    onClick={() => handleMarkParteAsPaid(selectedExpediente.id, 'comprador')}
                                    className="w-full bg-gray-600 hover:bg-gray-700 text-white"
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Marcar como Pagado
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Vendedor */}
                          <div className="border rounded-lg p-4 bg-purple-50 border-purple-200">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-600" />
                                <h4 className="font-semibold text-gray-900">Vendedor</h4>
                              </div>
                              {pagosPorParte[selectedExpediente.id]?.vendedor ? (
                                <Badge className="bg-gray-100 text-gray-800 border-gray-300">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Pagado
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Pendiente
                                </Badge>
                              )}
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Total asignado:</span>
                                <span className="font-medium">{formatCurrency(montoPorParte)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Pagado:</span>
                                <span className="font-medium text-gray-600">
                                  {formatCurrency(montoPagadoVendedor)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Pendiente:</span>
                                <span className="font-medium text-red-600">
                                  {formatCurrency(montoPendienteVendedor)}
                                </span>
                              </div>
                              <div className="mt-3">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-gray-600 h-2 rounded-full transition-all duration-500"
                                    style={{ 
                                      width: `${pagosPorParte[selectedExpediente.id]?.vendedor 
                                        ? 100 
                                        : (montoPagadoVendedor / montoPorParte) * 100
                                      }%` 
                                    }}
                                  />
                                </div>
                                <p className="text-xs text-gray-500 mt-1 text-center">
                                  {pagosPorParte[selectedExpediente.id]?.vendedor 
                                    ? "100.0% completado"
                                    : `${((montoPagadoVendedor / montoPorParte) * 100).toFixed(1)}% completado`
                                  }
                                </p>
                              </div>
                              {!pagosPorParte[selectedExpediente.id]?.vendedor && (
                                <div className="mt-3">
                                  <Button
                                    size="sm"
                                    onClick={() => handleMarkParteAsPaid(selectedExpediente.id, 'vendedor')}
                                    className="w-full bg-gray-600 hover:bg-gray-700 text-white"
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Marcar como Pagado
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* El trámite se marca automáticamente como pagado cuando ambos pagos están completos */}

                      {/* Resumen de estado de pagos */}
                      {pagosPorParte[selectedExpediente.id]?.comprador || pagosPorParte[selectedExpediente.id]?.vendedor ? (
                        <div className="bg-gray-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Estado de Pagos por Parte
                          </h4>
                          <div className="text-sm text-gray-800 space-y-1">
                            <p>
                              • Comprador: {pagosPorParte[selectedExpediente.id]?.comprador ? 'Pagado' : 'Pendiente'}
                            </p>
                            <p>
                              • Vendedor: {pagosPorParte[selectedExpediente.id]?.vendedor ? 'Pagado' : 'Pendiente'}
                            </p>
                            {pagosPorParte[selectedExpediente.id]?.comprador && pagosPorParte[selectedExpediente.id]?.vendedor && (
                              <p className="font-medium text-gray-700">
                                ¡Ambas partes han completado sus pagos!
                              </p>
                            )}
                          </div>
                        </div>
                      ) : null}

                      {/* Estado de pago completo */}
                      {tramitePagado[selectedExpediente.id] && (
                        <div className="bg-gray-50 border rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-900">Trámite Completamente Pagado</span>
                          </div>
                        </div>
                      )}

                      {/* Notas importantes - Compacto */}
                      <div className="bg-gray-50 border rounded-lg p-3">
                        <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Notas Importantes
                        </h4>
                        <ul className="text-xs text-gray-700 space-y-1">
                          <li>• Pagos antes de fechas límite</li>
                          <li>• Pago final al momento de firma</li>
                          <li>• Comprobantes disponibles para descarga</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="historial" className="space-y-6">
                {/* Historial */}
                <Card className="bg-gradient-to-br from-indigo-50 via-purple-50/50 to-pink-50 border-indigo-200/60">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Historial del Expediente
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSortOrder(
                            sortOrder === "newest" ? "oldest" : "newest"
                          )
                        }
                        className="flex items-center gap-2"
                      >
                        {sortOrder === "newest" ? (
                          <>
                            <ArrowDown className="h-3 w-3" />
                            Más reciente
                          </>
                        ) : (
                          <>
                            <ArrowUp className="h-3 w-3" />
                            Más antiguo
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedExpediente.historial
                        .sort((a: any, b: any) => {
                          const dateA = new Date(a.fecha).getTime();
                          const dateB = new Date(b.fecha).getTime();
                          return sortOrder === "newest"
                            ? dateB - dateA
                            : dateA - dateB;
                        })
                        .map((evento: any) => (
                          <div key={evento.id} className="flex gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-3 h-3 bg-gray-500 rounded-full mt-2"></div>
                            </div>
                            <div className="flex-1 pb-4 border-b border-gray-100 last:border-b-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="text-sm font-medium text-gray-900">
                                  {evento.accion}
                                </h4>
                                <span className="text-xs text-gray-500">
                                  {formatDate(evento.fecha)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {evento.detalles}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">
                                  Por: {evento.usuario}
                                </span>
                                {evento.estadoAnterior &&
                                  evento.estadoNuevo && (
                                    <>
                                      <span className="text-xs text-gray-400">
                                        •
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {evento.estadoAnterior} →{" "}
                                        {evento.estadoNuevo}
                                      </Badge>
                                    </>
                                  )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const renderComentarioModal = () => {
    return (
      <Dialog open={showComentarioModal} onOpenChange={setShowComentarioModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Comentario</DialogTitle>
            <DialogDescription>
              Agrega un comentario al expediente{" "}
              {selectedExpediente?.numeroSolicitud}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="comentario">Comentario</Label>
              <Textarea
                id="comentario"
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                placeholder="Escribe tu comentario aquí..."
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleAddComentario}
                className="flex-1 bg-gray-600 hover:bg-gray-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Agregar Comentario
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowComentarioModal(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const renderContactModal = () => {
    return (
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-600">
              <MessageSquare className="h-5 w-5" />
              Mensajería Interna
            </DialogTitle>
            <DialogDescription>
              Enviar mensaje interno para el expediente{" "}
              {selectedExpediente?.numeroSolicitud}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Selector de destinatario */}
            <div>
              <Label htmlFor="destinatario">Destinatario</Label>
              <Select defaultValue="comprador">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comprador">
                    {selectedExpediente?.comprador.nombre} {selectedExpediente?.comprador.apellidoPaterno} {selectedExpediente?.comprador.apellidoMaterno} (Comprador)
                  </SelectItem>
                  <SelectItem value="vendedor">
                    {selectedExpediente?.vendedor.nombre} {selectedExpediente?.vendedor.apellidoPaterno} {selectedExpediente?.vendedor.apellidoMaterno} (Vendedor)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Asunto */}
            <div>
              <Label htmlFor="asunto">Asunto</Label>
              <Input
                id="asunto"
                placeholder="Ej: Documentos faltantes, Actualización de estado, etc."
                className="w-full"
              />
            </div>

            {/* Mensaje */}
            <div>
              <Label htmlFor="mensaje">Mensaje</Label>
              <Textarea
                id="mensaje"
                placeholder="Escribe tu mensaje aquí..."
                className="min-h-[150px]"
                rows={6}
              />
            </div>

            {/* Adjuntos */}
            <div>
              <Label>Adjuntos (Opcional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <p className="text-sm text-gray-600 mb-1">
                  Arrastra archivos aquí o haz clic para seleccionar
                </p>
                <p className="text-xs text-gray-500">
                  PDF, DOC, DOCX, JPG, PNG (máx. 10MB)
                </p>
                <Input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="hidden"
                />
              </div>
            </div>

            {/* Prioridad */}
            <div>
              <Label htmlFor="prioridad">Prioridad</Label>
              <Select defaultValue="normal">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baja">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      Baja
                    </div>
                  </SelectItem>
                  <SelectItem value="normal">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      Normal
                    </div>
                  </SelectItem>
                  <SelectItem value="alta">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Alta
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowContactModal(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                // Simular envío de mensaje
                alert("Mensaje enviado correctamente al inbox del usuario");
                setShowContactModal(false);
              }}
              className="bg-gray-600 hover:bg-gray-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar Mensaje
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const renderPaymentModal = () => {
    return (
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Pago Pendiente
            </DialogTitle>
            <DialogDescription>
              No se puede mover este expediente a "Listo para Firma" porque el
              pago no está completo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {paymentModalData.expediente && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  {paymentModalData.expediente.numeroSolicitud}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total requerido:</span>
                    <span className="font-medium">
                      {formatCurrency(paymentModalData.total)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saldo pendiente:</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(paymentModalData.saldoPendiente)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Acción requerida:</strong> El cliente debe completar el
                pago de {formatCurrency(paymentModalData.saldoPendiente)} antes
                de que este expediente pueda ser movido a "Listo para Firma".
              </AlertDescription>
            </Alert>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowPaymentModal(false)}
            >
              Entendido
            </Button>
            <Button
              onClick={() => {
                setShowPaymentModal(false);
                // Aquí se podría abrir el módulo de pagos o contactar al cajero
              }}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Contactar Cajero
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filtros y búsqueda */}
      <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-4">
          {/* Filtro por tipo de trámite - Botones modernos */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-slate-600 mr-2">Filtrar:</span>
            
            {TRAMITE_TYPES.filter(tipo => !tipo.submenu && tipo.id !== "todos").map((tipo) => (
              <button
                key={tipo.id}
                onClick={() => handleTramiteTypeToggle(tipo.id)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedTramiteTypes.includes(tipo.id)
                    ? "bg-slate-800 text-white shadow-md"
                    : "bg-white/70 text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {tipo.icon}
                {tipo.name}
              </button>
            ))}
            
            {/* Botón "Todos" */}
            <button
              onClick={() => handleTramiteTypeToggle("todos")}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedTramiteTypes.includes("todos")
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white/70 text-slate-600 hover:bg-gray-50 border border-slate-200"
              }`}
            >
              <FileText className="h-4 w-4" />
              Todos
            </button>
            </div>

            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                placeholder="Buscar expedientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/70 border-white/30 text-slate-700 placeholder-slate-400 focus:bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-200 transition-all duration-200"
                />
              </div>
            </div>
          </div>
      </div>

      {/* Kanban Board */}
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50/50 to-pink-50 rounded-2xl p-6 min-h-[600px] relative overflow-hidden">
        {/* Patrón de fondo decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10 max-w-6xl mx-auto">
        {KANBAN_COLUMNS.map((column) => {
          const expedientesEnColumna = getExpedientesByColumn(column.id);

          return (
            <div
              key={column.id}
                className="bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-md rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 p-4 min-h-[500px] min-w-[280px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gradient-to-r from-slate-200 to-slate-300">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-800 text-sm">{column.title}</h3>
                  </div>
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                  {expedientesEnColumna.length}
                  </div>
              </div>

              <div className="space-y-3">
                {expedientesEnColumna.map((expediente) =>
                  renderExpedienteCard(expediente)
                )}

                {expedientesEnColumna.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <div className="w-8 h-8 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg"></div>
                      </div>
                      <p className="text-sm text-slate-500 font-medium">No hay expedientes</p>
                      <p className="text-xs text-slate-400 mt-1">Arrastra aquí para agregar</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Modales */}
      {renderExpedienteModal()}

      {/* Modal de Comentarios */}
      <Dialog open={showComentarioModal} onOpenChange={setShowComentarioModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Comentario</DialogTitle>
            <DialogDescription>
              Agrega un comentario al expediente{" "}
              {selectedExpediente?.numeroSolicitud}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="comentario">Comentario</Label>
              <Textarea
                id="comentario"
                placeholder="Escribe tu comentario aquí..."
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowComentarioModal(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddComentario}>Agregar Comentario</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de contacto */}
      {renderContactModal()}

      {/* Modal de pago pendiente */}
      {renderPaymentModal()}

      {/* Modal de Visualización de Documentos */}
      <Dialog open={showDocumentViewer} onOpenChange={setShowDocumentViewer}>
        <DialogContent 
          className="modal-expediente-ancho flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50"
        >

          <div className="flex-1 flex overflow-hidden">
              {/* Panel izquierdo - Visualizador de documento */}
              <div className={`${selectedExpediente?.estado === "LISTO_PARA_FIRMA" ? "w-full" : "w-3/5"} flex flex-col pdf-viewer-container relative`}>
                {/* Barra de herramientas para Firma agendada */}
                {selectedExpediente?.estado === "LISTO_PARA_FIRMA" && (
                  <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-gray-900">Contrato de Compraventa</h3>
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 text-xs">
                        Firma agendada
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7"
                        onClick={() => {
                          // Simular descarga del documento
                          console.log(`📥 Descargando contrato para ${selectedExpediente?.numeroSolicitud}`);
                          const link = document.createElement('a');
                          link.href = selectedDocument?.archivo || '';
                          link.download = `Contrato_Compraventa_${selectedExpediente?.numeroSolicitud}.pdf`;
                          link.click();
                        }}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Descargar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7"
                        onClick={() => {
                          // Simular impresión del documento
                          console.log(`🖨️ Imprimiendo contrato para ${selectedExpediente?.numeroSolicitud}`);
                          window.print();
                        }}
                      >
                        <Printer className="h-3 w-3 mr-1" />
                        Imprimir
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="flex-1 overflow-hidden bg-gray-50 relative">
              <iframe
                    src={selectedDocument?.archivo || ""}
                    className="w-full h-full border-0"
                title="Documento PDF"
              />
                </div>
              </div>

                {/* Panel derecho - Solo mostrar si NO está en Listo para firma */}
                {selectedExpediente?.estado !== "LISTO_PARA_FIRMA" && (
                <div className="w-2/5 bg-gradient-to-br from-blue-50 to-white border-l border-blue-200 flex flex-col">
                  <div className="p-3 border-b border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                      <h3 className="text-base font-semibold text-blue-900">
                        {selectedDocument?.id === "contrato-borrador" ? "Validación del Contrato" : "Extracción de Datos con IA"}
                      </h3>
                        {selectedDocument?.id === "contrato-borrador" && selectedExpediente && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 text-xs">
                            {(() => {
                              const contractCount = getContractValidationCount(selectedExpediente.id);
                              return `${contractCount.approved} de ${contractCount.total} validados`;
                            })()}
                          </Badge>
                )}
                      </div>
                      {selectedDocument?.id !== "contrato-borrador" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white text-xs"
                            onClick={handleAcceptDocument}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Aceptar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-600 hover:bg-red-50 text-xs"
                            onClick={handleRejectDocument}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Rechazar
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      {selectedDocument?.id === "contrato-borrador" 
                        ? "Validación guiada del borrador del contrato de compraventa"
                        : "Datos extraídos del documento"
                      }
                    </p>
          </div>

                  {selectedDocument?.id === "contrato-borrador" ? (
                    /* Panel de Validación Guiada para el Contrato */
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                      {/* Botón de validación del contrato */}
                      {selectedExpediente && (
                        <Button 
                          className="bg-green-600 hover:bg-green-700 text-white text-sm w-full h-8"
                          onClick={() => {
                            const currentField = contractSearchData[currentSearchIndex];
                            if (currentField && selectedExpediente) {
                              handleContractValidation(selectedExpediente.id, currentField.id, true);
                            }
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Validar
                        </Button>
                )}
                      
                      {/* Sección de búsqueda */}
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-2">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs text-blue-700">Buscar en el documento:</p>
                          <span className="text-xs text-blue-800 font-medium">
                            {contractSearchData[currentSearchIndex]?.type}
                          </span>
                        </div>
                        <div className={`bg-gradient-to-r border rounded p-1.5 ${
                          (() => {
                            if (!selectedExpediente) return "from-blue-100 to-blue-200 border-blue-300";
                            const currentField = contractSearchData[currentSearchIndex];
                            const validation = contractValidations[selectedExpediente.id]?.[currentField?.id];
                            if (validation?.approved === true) {
                              return "from-green-100 to-green-200 border-green-300";
                            } else if (validation?.approved === false) {
                              return "from-red-100 to-red-200 border-red-300";
                            }
                            return "from-blue-100 to-blue-200 border-blue-300";
                          })()
                        }`}>
                          <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-blue-900">
                            "{highlightedText}"
                          </p>
                            {(() => {
                              if (!selectedExpediente) return null;
                              const currentField = contractSearchData[currentSearchIndex];
                              const validation = contractValidations[selectedExpediente.id]?.[currentField?.id];
                              if (validation?.approved === true) {
                                return <CheckCircle className="h-3 w-3 text-green-600" />;
                              } else if (validation?.approved === false) {
                                return <XCircle className="h-3 w-3 text-red-600" />;
                              }
                              return null;
                            })()}
                        </div>
                        </div>
                        <div className="mt-1">
                          <p className="text-xs text-blue-600 mb-0.5">
                            {contractSearchData[currentSearchIndex]?.location}
                          </p>
                          <p className="text-xs text-blue-700">
                            {contractSearchData[currentSearchIndex]?.description}
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="mt-1 text-xs bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200 h-6"
                          onClick={handleGoToText}
                        >
                          <Eye className="h-2 w-2 mr-1" />
                          Ir al Texto
                        </Button>
                      </div>

                      {/* Navegación */}
                      <div className="flex items-center justify-between">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          disabled={currentSearchIndex === 0}
                          className="text-xs bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200 h-6"
                          onClick={handlePreviousSearch}
                        >
                          <ArrowLeft className="h-2 w-2 mr-1" />
                          Anterior
                        </Button>
                        <div className="flex flex-col items-center">
                        <span className="text-xs text-blue-600">
                          {currentSearchIndex + 1} de {contractSearchData.length}
                        </span>
                          {selectedExpediente && (
                            <span className="text-xs text-green-600 font-medium">
                              {(() => {
                                const contractCount = getContractValidationCount(selectedExpediente.id);
                                return `${contractCount.approved} validados`;
                              })()}
                            </span>
                )}
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          disabled={currentSearchIndex === contractSearchData.length - 1}
                          className="text-xs bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200 h-6"
                          onClick={handleNextSearch}
                        >
                          Siguiente
                          <ArrowRight className="h-2 w-2 ml-1" />
                        </Button>
                      </div>


                      {/* Panel de edición */}
                      <div className="mt-2 p-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
                        <h6 className="text-xs font-medium text-blue-900 mb-1">Editor de Documento</h6>
                        <div className="space-y-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-800 mb-0.5">
                              Campo a editar:
                            </label>
                            <select 
                              className="w-full px-2 py-1 border border-blue-300 rounded text-xs h-6"
                              value={contractSearchData[currentSearchIndex]?.type || ""}
                              onChange={(e) => {
                                const selectedIndex = contractSearchData.findIndex(item => item.type === e.target.value);
                                if (selectedIndex !== -1) {
                                  setCurrentSearchIndex(selectedIndex);
                                  setHighlightedText(contractSearchData[selectedIndex].text);
                                }
                              }}
                            >
                              {contractSearchData.map((item, index) => (
                                <option key={item.id} value={item.type}>
                                  {item.type}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-800 mb-0.5">
                              Valor actual:
                            </label>
                            <input
                              type="text"
                              value={highlightedText}
                              className="w-full px-2 py-1 border border-blue-300 rounded text-xs bg-gray-100 h-6"
                              readOnly
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-800 mb-0.5">
                              Nuevo valor:
                            </label>
                            <input
                              type="text"
                              placeholder="Ingrese el valor corregido..."
                              className="w-full px-2 py-1 border border-blue-300 rounded text-xs h-6"
                            />
                          </div>
                           <Button 
                             size="sm" 
                             className="bg-gray-600 hover:bg-gray-700 text-white text-xs w-full h-6"
                             disabled={isApplyingCorrection}
                             onClick={async () => {
                               const currentField = contractSearchData[currentSearchIndex];
                               if (currentField && selectedExpediente) {
                                 setIsApplyingCorrection(true);
                                 
                                 // Simular carga de 2-3 segundos
                                 await new Promise(resolve => setTimeout(resolve, 2500));
                                 
                                 // Simular aplicación de corrección
                                 console.log(`🔧 Aplicando corrección al campo ${currentField.type}...`);
                                 console.log(`✅ Corrección aplicada exitosamente al documento`);
                                 
                                 // Agregar comentario sobre la corrección aplicada
                                 addComentarioExpediente(
                                   selectedExpediente.id,
                                   `CORRECCIÓN APLICADA: Se corrigió el campo "${currentField.type}" en el contrato. El documento ha sido actualizado con la nueva información.`,
                                   "Licenciado",
                                   "general"
                                 );
                                 
                                 // Marcar como validado después de aplicar la corrección
                                 handleContractValidation(selectedExpediente.id, currentField.id, true, "Corrección aplicada al documento");
                                 
                                 setIsApplyingCorrection(false);
                               }
                             }}
                           >
                             {isApplyingCorrection ? (
                               <>
                                 <div className="animate-spin rounded-full h-2 w-2 border-b-2 border-white mr-1"></div>
                                 Aplicando...
                               </>
                             ) : (
                               <>
                            <FileEdit className="h-2 w-2 mr-1" />
                            Aplicar Corrección
                               </>
                )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Panel original de extracción de datos para otros documentos */
                    <div className="flex-1 overflow-y-auto p-3 space-y-4">
                      {/* Tipo de participante */}
                      <div>
                        <label className="block text-xs font-medium text-blue-700 mb-1">
                          Tipo de participante *
                        </label>
                        <div className="grid grid-cols-2 gap-1">
                          {["Comprador", "Conyuge", "Vendedor", "Representante"].map((tipo) => (
                            <button
                              key={tipo}
                              className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                                tipo === "Comprador" 
                                  ? "bg-blue-100 text-blue-700 border-blue-300" 
                                  : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                              }`}
                            >
                              <User className="h-2 w-2 inline mr-1" />
                              {tipo}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Nombre completo */}
                      <div>
                        <label className="block text-xs font-medium text-blue-700 mb-1">
                          Nombre completo *
                        </label>
                        <input
                          type="text"
                          value="JONATHAN RUBEN HERNANDEZ GONZALEZ"
                          className="w-full px-2 py-1 border border-blue-200 rounded-md text-xs bg-blue-50 text-blue-800"
                          readOnly
                        />
                      </div>

                      {/* Fecha de nacimiento y Edad */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-blue-700 mb-1">
                            Fecha de nacimiento
                          </label>
                          <input
                            type="text"
                            value="02/07/1986"
                            className="w-full px-2 py-1 border border-blue-200 rounded-md text-xs bg-blue-50 text-blue-800"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-blue-700 mb-1">
                            Edad
                          </label>
                          <input
                            type="text"
                            value="38 años"
                            className="w-full px-2 py-1 border border-blue-200 rounded-md text-xs bg-blue-50 text-blue-800"
                            readOnly
                          />
                        </div>
                      </div>

                      {/* Género y Lugar de nacimiento */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-blue-700 mb-1">
                            Género
                          </label>
                          <input
                            type="text"
                            value="HOMBRE"
                            className="w-full px-2 py-1 border border-blue-200 rounded-md text-xs bg-blue-50 text-blue-800"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-blue-700 mb-1">
                            Lugar de nacimiento
                          </label>
                          <input
                            type="text"
                            value="NEZAHUALCOYOTL, MEXICO"
                            className="w-full px-2 py-1 border border-blue-200 rounded-md text-xs bg-blue-50 text-blue-800"
                            readOnly
                          />
                        </div>
                      </div>

                      {/* Nacionalidad y Estado civil */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-blue-700 mb-1">
                            Nacionalidad
                          </label>
                          <input
                            type="text"
                            value="MEXICANA"
                            className="w-full px-2 py-1 border border-blue-200 rounded-md text-xs bg-blue-50 text-blue-800"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-blue-700 mb-1">
                            Estado civil actual
                          </label>
                          <select className="w-full px-2 py-1 border border-blue-200 rounded-md text-xs bg-blue-50 text-blue-800">
                            <option value="SOLTERO">SOLTERO</option>
                            <option value="CASADO" selected>CASADO</option>
                            <option value="DIVORCIADO">DIVORCIADO</option>
                            <option value="VIUDO">VIUDO</option>
                            <option value="UNION_LIBRE">UNIÓN LIBRE</option>
                          </select>
                        </div>
                      </div>

                      {/* Número de acta y CURP */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-blue-700 mb-1">
                            Número de acta
                          </label>
                          <input
                            type="text"
                            value="2710"
                            className="w-full px-2 py-1 border border-blue-200 rounded-md text-xs bg-blue-50 text-blue-800"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-blue-700 mb-1">
                            CURP
                          </label>
                          <input
                            type="text"
                            value="HEGJ860702HMCRNN07"
                            className="w-full px-2 py-1 border border-blue-200 rounded-md text-xs bg-blue-50 text-blue-800"
                            readOnly
                          />
                        </div>
                      </div>

                      {/* Registro civil y Fecha de registro */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-blue-700 mb-1">
                            Registro civil
                          </label>
                          <input
                            type="text"
                            value="NEZAHUALCOYOTL, MEXICO"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fecha de registro
                          </label>
                          <input
                            type="text"
                            value="14/08/1986"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            readOnly
                          />
                        </div>
                      </div>

                      {/* Información de los padres */}
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Datos de los Padres</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Nombre del padre
                            </label>
                            <input
                              type="text"
                              value="FEDERICO HERNANDEZ ORNELAS"
                              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                              readOnly
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Nombre de la madre
                            </label>
                            <input
                              type="text"
                              value="ARACELI GONZALEZ ESPINOSA"
                              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      {/* Información adicional del documento */}
                      <div className="bg-gray-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Datos del Documento</h4>
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Identificador Electrónico
                              </label>
                              <input
                                type="text"
                                value="15058000320220010615"
                                className="w-full px-2 py-1 border border-blue-300 rounded text-xs"
                                readOnly
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Oficialía
                              </label>
                              <input
                                type="text"
                                value="0003"
                                className="w-full px-2 py-1 border border-blue-300 rounded text-xs"
                                readOnly
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Fecha de Certificación
                            </label>
                            <input
                              type="text"
                              value="25 de Abril de 2022"
                              className="w-full px-2 py-1 border border-blue-300 rounded text-xs"
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      {/* Información adicional */}
                      <div className="bg-gray-50 p-3 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-gray-700">
                            IA Procesando...
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          La inteligencia artificial está analizando el acta de nacimiento para extraer información adicional.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                )}
          </div>

          <div className="flex justify-end items-center px-1 py-0 border-t border-gray-50 bg-transparent">
            <div className="flex gap-0">
              {selectedExpediente?.estado === "LISTO_PARA_FIRMA" ? (
                // Botones para Listo para firma - Solo PDF con opciones de imprimir y descargar
                <>
                  <button
                    onClick={() => window.print()}
                    className="text-gray-300 hover:text-gray-500 text-xs h-3 w-3 opacity-30 hover:opacity-100 transition-opacity"
                    title="Imprimir"
                  >
                    <FileText className="h-2 w-2" />
                  </button>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = selectedDocument?.archivo || "";
                      link.download = selectedDocument?.nombre || "contrato.pdf";
                      link.click();
                    }}
                    className="text-gray-300 hover:text-gray-500 text-xs h-3 w-3 opacity-30 hover:opacity-100 transition-opacity"
                    title="Descargar"
                  >
                    <FileText className="h-2 w-2" />
                  </button>
                  <button
                    onClick={() => setShowDocumentViewer(false)}
                    className="text-gray-300 hover:text-gray-500 text-xs h-3 w-3 opacity-30 hover:opacity-100 transition-opacity"
                    title="Cerrar"
                  >
                    ×
                  </button>
                </>
              ) : selectedDocument?.id === "contrato-borrador" ? (
                // Botones para contrato borrador en otras columnas
                <button
                  onClick={() => setShowDocumentViewer(false)}
                  className="text-gray-300 hover:text-gray-500 text-xs h-3 w-3 opacity-30 hover:opacity-100 transition-opacity"
                  title="Cerrar"
                >
                  ×
                </button>
              ) : (
                // Botones para otros documentos
                <>
                  <button
                    onClick={() => window.open(selectedDocument?.archivo || "", "_blank")}
                    className="text-gray-300 hover:text-gray-500 text-xs h-3 w-3 opacity-30 hover:opacity-100 transition-opacity"
                    title="Abrir"
                  >
                    <Eye className="h-2 w-2" />
                  </button>
                  <button
                    onClick={() => setShowDocumentViewer(false)}
                    className="text-gray-300 hover:text-gray-500 text-xs h-3 w-3 opacity-30 hover:opacity-100 transition-opacity"
                    title="Cerrar"
                  >
                    ×
                  </button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para agendar cita de firma */}
      <Dialog open={showAppointmentModal} onOpenChange={setShowAppointmentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Agendar Cita para Firma
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Selecciona la fecha y hora disponible para la firma del contrato de compraventa.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Información del expediente */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 text-sm">Expediente: {selectedExpediente?.numeroSolicitud}</h4>
              <p className="text-xs text-blue-700 mt-1">
                Compraventa de casa - {selectedExpediente?.comprador.nombre} {selectedExpediente?.comprador.apellidoPaterno}
              </p>
            </div>

            {/* Selector de fecha */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Fecha disponible:</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedAppointmentDate}
                onChange={(e) => setSelectedAppointmentDate(e.target.value)}
              >
                <option value="">Seleccionar fecha</option>
                <option value="2024-09-29">Domingo, 29 de Septiembre 2024</option>
                <option value="2024-09-30">Lunes, 30 de Septiembre 2024</option>
                <option value="2024-10-01">Martes, 1 de Octubre 2024</option>
                <option value="2024-10-02">Miércoles, 2 de Octubre 2024</option>
                <option value="2024-10-03">Jueves, 3 de Octubre 2024</option>
                <option value="2024-10-04">Viernes, 4 de Octubre 2024</option>
                <option value="2024-10-07">Lunes, 7 de Octubre 2024</option>
                <option value="2024-10-08">Martes, 8 de Octubre 2024</option>
                <option value="2024-10-09">Miércoles, 9 de Octubre 2024</option>
                <option value="2024-10-10">Jueves, 10 de Octubre 2024</option>
                <option value="2024-10-11">Viernes, 11 de Octubre 2024</option>
                <option value="2024-10-14">Lunes, 14 de Octubre 2024</option>
                <option value="2024-10-15">Martes, 15 de Octubre 2024</option>
              </select>
            </div>

            {/* Selector de hora */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Hora disponible:</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedAppointmentTime}
                onChange={(e) => setSelectedAppointmentTime(e.target.value)}
              >
                <option value="">Seleccionar hora</option>
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

            {/* Selector de sala de juntas */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Sala de juntas disponible:</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedMeetingRoom}
                onChange={(e) => setSelectedMeetingRoom(e.target.value)}
              >
                <option value="">Seleccionar sala</option>
                <option value="Sala de Juntas A">Sala de Juntas A - Capacidad: 8 personas</option>
                <option value="Sala de Juntas B">Sala de Juntas B - Capacidad: 6 personas</option>
                <option value="Sala de Juntas C">Sala de Juntas C - Capacidad: 10 personas</option>
                <option value="Sala Principal">Sala Principal - Capacidad: 15 personas</option>
                <option value="Oficina del Notario">Oficina del Notario - Capacidad: 4 personas</option>
              </select>
            </div>

            {/* Nota adicional */}
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <p className="text-xs text-yellow-800">
                <strong>Nota:</strong> La cita será confirmada una vez que ambas partes confirmen su disponibilidad.
              </p>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAppointmentModal(false)}
              className="text-sm"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                // Validar que se hayan seleccionado fecha, hora y sala
                if (!selectedAppointmentDate || !selectedAppointmentTime || !selectedMeetingRoom) {
                  alert("Por favor selecciona una fecha, hora y sala de juntas para la cita.");
                  return;
                }

                // Simular agendamiento de cita
                console.log(`📅 Cita agendada para el expediente ${selectedExpediente?.id} el ${selectedAppointmentDate} a las ${selectedAppointmentTime} en ${selectedMeetingRoom}`);
                
                // Actualizar las fechas de firma programadas
                if (selectedExpediente) {
                  setFechasFirmaProgramadas(prev => ({
                    ...prev,
                    [selectedExpediente.id]: {
                      fecha: selectedAppointmentDate,
                      hora: selectedAppointmentTime,
                      lugar: "Notaría #3 - Oficina Principal",
                      sala: selectedMeetingRoom
                    }
                  }));
                  
                  // Forzar re-render para mostrar la información actualizada inmediatamente
                  setForceUpdate(prev => prev + 1);
                }
                
                // Agregar comentario al expediente
                if (selectedExpediente) {
                  const fechaFormateada = new Date(selectedAppointmentDate).toLocaleDateString('es-MX', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  });
                  addComentarioExpediente(
                    selectedExpediente.id,
                    `📅 CITA AGENDADA: Firma programada para el ${fechaFormateada} a las ${selectedAppointmentTime} en ${selectedMeetingRoom}, Notaría #3 - Oficina Principal.`,
                    "Licenciado",
                    "general"
                  );
                }
                
                // Mover expediente a "Listo para firma"
                if (selectedExpediente) {
                  const success = updateExpedienteEstado(
                    selectedExpediente.id,
                    "LISTO_PARA_FIRMA",
                    licenciadoId || ""
                  );
                  
                  if (success) {
                    setExpedientes(prev => prev.map(exp => 
                      exp.id === selectedExpediente.id 
                        ? { ...exp, estado: "LISTO_PARA_FIRMA" as EstadoExpediente }
                        : exp
                    ));
                    
                    // Actualizar el expediente seleccionado para reflejar el cambio de estado
                    setSelectedExpediente(prev => prev ? { ...prev, estado: "LISTO_PARA_FIRMA" as EstadoExpediente } : null);
                  }
                }
                
                // Limpiar los selectores y cerrar el modal
                setSelectedAppointmentDate("");
                setSelectedAppointmentTime("");
                setSelectedMeetingRoom("");
                setShowAppointmentModal(false);
              }}
              disabled={!selectedAppointmentDate || !selectedAppointmentTime || !selectedMeetingRoom}
              className="bg-green-600 hover:bg-green-700 text-white text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Confirmar Cita
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para reprogramar cita de firma */}
      <Dialog open={showRescheduleModal} onOpenChange={setShowRescheduleModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Reprogramar Cita de Firma
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Selecciona una nueva fecha, hora y sala de juntas para la firma del contrato de compraventa.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Información del expediente */}
            <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
              <h4 className="font-medium text-orange-900 text-sm">Expediente: {selectedExpediente?.numeroSolicitud}</h4>
              <p className="text-xs text-orange-700 mt-1">
                Compraventa de casa - {selectedExpediente?.comprador.nombre} {selectedExpediente?.comprador.apellidoPaterno}
              </p>
            </div>

            {/* Selector de nueva fecha */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nueva fecha disponible:</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
              >
                <option value="">Seleccionar nueva fecha</option>
                <option value="2024-10-14">Lunes, 14 de Octubre 2024</option>
                <option value="2024-10-15">Martes, 15 de Octubre 2024</option>
                <option value="2024-10-16">Miércoles, 16 de Octubre 2024</option>
                <option value="2024-10-17">Jueves, 17 de Octubre 2024</option>
                <option value="2024-10-18">Viernes, 18 de Octubre 2024</option>
                <option value="2024-10-21">Lunes, 21 de Octubre 2024</option>
                <option value="2024-10-22">Martes, 22 de Octubre 2024</option>
                <option value="2024-10-23">Miércoles, 23 de Octubre 2024</option>
                <option value="2024-10-24">Jueves, 24 de Octubre 2024</option>
                <option value="2024-10-25">Viernes, 25 de Octubre 2024</option>
              </select>
            </div>

            {/* Selector de nueva hora */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nueva hora disponible:</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={rescheduleTime}
                onChange={(e) => setRescheduleTime(e.target.value)}
              >
                <option value="">Seleccionar nueva hora</option>
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

            {/* Selector de nueva sala de juntas */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nueva sala de juntas disponible:</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={rescheduleRoom}
                onChange={(e) => setRescheduleRoom(e.target.value)}
              >
                <option value="">Seleccionar nueva sala</option>
                <option value="Sala de Juntas A">Sala de Juntas A - Capacidad: 8 personas</option>
                <option value="Sala de Juntas B">Sala de Juntas B - Capacidad: 6 personas</option>
                <option value="Sala de Juntas C">Sala de Juntas C - Capacidad: 10 personas</option>
                <option value="Sala Principal">Sala Principal - Capacidad: 15 personas</option>
                <option value="Oficina del Notario">Oficina del Notario - Capacidad: 4 personas</option>
              </select>
            </div>

            {/* Campo de motivo */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Motivo de reprogramación:</label>
              <textarea 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                rows={3}
                placeholder="Especifica el motivo de la reprogramación..."
                value={rescheduleReason}
                onChange={(e) => setRescheduleReason(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowRescheduleModal(false)} className="text-sm">
              Cancelar
            </Button>
            <Button
              onClick={() => {
                // Validar que se hayan seleccionado fecha, hora y sala
                if (!rescheduleDate || !rescheduleTime || !rescheduleRoom) {
                  alert("Por favor selecciona una nueva fecha, hora y sala de juntas para reprogramar la cita.");
                  return;
                }

                console.log(`📅 Cita reprogramada para el expediente ${selectedExpediente?.numeroSolicitud} el ${rescheduleDate} a las ${rescheduleTime} en ${rescheduleRoom}`);
                
                // Actualizar las fechas de firma programadas
                if (selectedExpediente) {
                  setFechasFirmaProgramadas(prev => ({
                    ...prev,
                    [selectedExpediente.id]: {
                      fecha: rescheduleDate,
                      hora: rescheduleTime,
                      lugar: "Notaría #3 - Oficina Principal",
                      sala: rescheduleRoom
                    }
                  }));
                  
                  // Forzar re-render para mostrar la información actualizada inmediatamente
                  setForceUpdate(prev => prev + 1);
                }
                
                // Agregar comentario al expediente con motivo
                if (selectedExpediente) {
                  const fechaFormateada = new Date(rescheduleDate).toLocaleDateString('es-MX', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  });
                  
                  const motivoText = rescheduleReason ? ` Motivo: ${rescheduleReason}` : "";
                  addComentarioExpediente(
                    selectedExpediente.id, 
                    `📅 CITA REPROGRAMADA: Nueva fecha programada para el ${fechaFormateada} a las ${rescheduleTime} en ${rescheduleRoom}, Notaría #3 - Oficina Principal.${motivoText}`, 
                    "Licenciado", 
                    "general"
                  );
                }
                
                // Limpiar los campos y cerrar el modal
                setRescheduleDate("");
                setRescheduleTime("");
                setRescheduleRoom("");
                setRescheduleReason("");
                setShowRescheduleModal(false);
              }}
              disabled={!rescheduleDate || !rescheduleTime || !rescheduleRoom}
              className="bg-orange-600 hover:bg-orange-700 text-white text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Confirmar Reprogramación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para ver documentos PDF */}
      <Dialog open={showDocumentModal} onOpenChange={setShowDocumentModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {selectedDocumentInfo?.title} - {selectedDocumentInfo?.expediente}
            </DialogTitle>
          </DialogHeader>
          
          <div className="bg-gray-100 p-8 text-center rounded border">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-gray-600 mb-4">Vista previa del documento PDF</p>
            <p className="text-sm text-gray-500">{selectedDocumentInfo?.title}</p>
            <p className="text-sm text-gray-500">Expediente: {selectedDocumentInfo?.expediente}</p>
            <div className="mt-4 flex gap-2 justify-center">
              <Button
                onClick={() => {
                  window.open('/formatos/compraventa.pdf', '_blank');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Abrir PDF Completo
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDocumentModal(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para ver recibos de impuestos */}
      <Dialog open={showTaxModal} onOpenChange={setShowTaxModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Recibo de {selectedTaxInfo?.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="bg-gray-50 p-4 rounded border">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{selectedTaxInfo?.details?.icon}</div>
              <p className="font-semibold text-gray-800">{selectedTaxInfo?.title}</p>
              <p className="text-sm text-gray-600">Expediente: {selectedTaxInfo?.expediente}</p>
            </div>
            
            <div className="bg-white p-3 rounded border">
              {selectedTaxInfo?.details?.propertyValue && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Valor del Inmueble:</span>
                  <span className="font-semibold">{selectedTaxInfo.details.propertyValue}</span>
                </div>
              )}
              {selectedTaxInfo?.details?.saleValue && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Valor de Venta:</span>
                  <span className="font-semibold">{selectedTaxInfo.details.saleValue}</span>
                </div>
              )}
              {selectedTaxInfo?.details?.acquisitionCost && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Costo de Adquisición:</span>
                  <span className="font-semibold">{selectedTaxInfo.details.acquisitionCost}</span>
                </div>
              )}
              {selectedTaxInfo?.details?.profit && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Ganancia:</span>
                  <span className="font-semibold">{selectedTaxInfo.details.profit}</span>
                </div>
              )}
              {selectedTaxInfo?.details?.taxRate && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Tasa de Impuesto:</span>
                  <span className="font-semibold">{selectedTaxInfo.details.taxRate}</span>
                </div>
              )}
              {selectedTaxInfo?.details?.year && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Año Fiscal:</span>
                  <span className="font-semibold">{selectedTaxInfo.details.year}</span>
                </div>
              )}
              <hr className="my-2" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-800">Total a Pagar:</span>
                <span className="text-lg font-bold text-red-600">{selectedTaxInfo?.details?.total}</span>
              </div>
            </div>
            
            <div className="mt-4 flex gap-2 justify-center">
              <Button
                onClick={() => {
                  alert(`Simulando pago del ${selectedTaxInfo?.title}...`);
                }}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Simular Pago
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowTaxModal(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para vista previa de la Escritura Final */}
      <Dialog open={showEscrituraModal} onOpenChange={setShowEscrituraModal}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden p-0 !max-w-7xl">
          <DialogHeader className="px-6 py-4 border-b border-gray-200">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Escritura Final - {selectedExpediente?.numeroSolicitud}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col h-[calc(95vh-80px)]">
            {/* Barra de herramientas */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Escritura Final</span>
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 text-xs">
                  Firmada
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7"
                  onClick={() => {
                    // Descargar el PDF
                    const link = document.createElement('a');
                    link.href = '/Escritura.pdf';
                    link.download = `Escritura_Final_${selectedExpediente?.numeroSolicitud}.pdf`;
                    link.click();
                  }}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Descargar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7"
                  onClick={() => {
                    // Imprimir el PDF
                    window.open('/Escritura.pdf', '_blank');
                  }}
                >
                  <Printer className="h-3 w-3 mr-1" />
                  Imprimir
                </Button>
              </div>
            </div>
            
            {/* Visor de PDF */}
            <div className="flex-1 bg-gray-100 relative">
              <iframe
                src="/Escritura.pdf"
                className="w-full h-full border-0"
                title="Escritura Final"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
