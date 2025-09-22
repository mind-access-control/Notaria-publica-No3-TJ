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
    id: "RECIBIDO",
    title: "Recibido",
    color: "bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-md rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300",
    icon: null,
  },
  {
    id: "EN_VALIDACION",
    title: "En validación",
    color: "bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-md rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300",
    icon: null,
  },
  {
    id: "EN_PREPARACION",
    title: "Proyecto de escritura",
    color: "bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-md rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300",
    icon: null,
  },
  {
    id: "LISTO_PARA_FIRMA",
    title: "Listo para firma",
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
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [documentStates, setDocumentStates] = useState<Record<string, string>>({});
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [highlightedText, setHighlightedText] = useState("");
  const [contractApprovals, setContractApprovals] = useState<Record<string, {
    comprador: boolean;
    vendedor: boolean;
    notificacionesEnviadas: boolean;
  }>>({});
  const [tramitePagado, setTramitePagado] = useState<Record<string, boolean>>({});
  const [pagosPorParte, setPagosPorParte] = useState<Record<string, {
    comprador: boolean;
    vendedor: boolean;
  }>>({});

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
      const documentState = documentStates[doc.id];
      
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
    if (selectedDocument) {
      setDocumentStates(prev => ({
        ...prev,
        [selectedDocument.id]: "aceptado"
      }));
      setShowDocumentViewer(false);
    }
  };

  // Función para rechazar documento
  const handleRejectDocument = () => {
    if (selectedDocument) {
      setDocumentStates(prev => ({
        ...prev,
        [selectedDocument.id]: "rechazado"
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
    setManualValidations((prev) => ({
      ...prev,
      [expedienteId]: {
        ...prev[expedienteId],
        [documentType]: { approved, reason },
      },
    }));

    // Agregar comentario sobre la decisión manual
    const accion = approved ? "aprobó" : "rechazó";
    const razonTexto = reason ? ` Razón: ${reason}` : "";
    const comentario = `👨‍💼 REVISIÓN MANUAL: El Licenciado ${accion} la validación de "${documentType}".${razonTexto}`;

    addComentarioExpediente(
      expedienteId,
      comentario,
      "Licenciado",
      approved ? "general" : "requerimiento"
    );

    // Verificar si todas las validaciones están completas
    const report = validationReports[expedienteId];
    if (report) {
      const manualDecisions = manualValidations[expedienteId] || {};
      const allValidated = report.validations.every(
        (v) => manualDecisions[v.documentType] !== undefined
      );

      if (allValidated) {
        const allApproved = report.validations.every(
          (v) => manualDecisions[v.documentType]?.approved === true
        );

        if (!allApproved) {
          // Regresar a validación si no está 100% aprobado
          updateExpedienteEstado(expedienteId, "EN_VALIDACION", "licenciado-1");

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

          const comentarioCliente = `📋 CORRECCIONES REQUERIDAS

Se requieren las siguientes correcciones antes de continuar:

${problemasRechazados}

Por favor, proporciona los documentos corregidos o la información solicitada.`;

          addComentarioExpediente(
            expedienteId,
            comentarioCliente,
            "Notaría",
            "requerimiento"
          );
        }
      }
    }
  };

  // Función para revalidar expediente
  const handleRevalidation = async (expedienteId: string) => {
    console.log(`🔄 Iniciando REVALIDACIÓN para expediente ${expedienteId}`);

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
        "🔄 REVALIDACIÓN COMPLETADA: Todos los documentos han sido corregidos y aprobados exitosamente.",
        "IA Assistant",
        "general"
      );

      console.log(
        `✅ Revalidación completada exitosamente para ${expedienteId}`
      );
    } catch (error) {
      console.error(`❌ Error en revalidación para ${expedienteId}:`, error);
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
      monto: 7500,
      metodo: "Transferencia Bancaria",
      referencia: "NP3-COMP-001-2025",
      tipo: "parcial",
      fecha: "2025-01-15T16:45:00Z",
      estado: "confirmado",
      concepto: "Anticipo de honorarios notariales y derechos registrales",
      comprobante: "/documentos_legales/Comprobante_Pago_7500.md",
      banco: "BBVA México",
      autorizacion: "789456123",
    },
  ];

  // Calcular totales de pago
  const costoTotalExpediente = 25000; // Costo total del trámite
  const totalPagado = pagosDemoExpediente.reduce(
    (sum, pago) => sum + pago.monto,
    0
  );
  const saldoPendiente = costoTotalExpediente - totalPagado;
  const porcentajePagado = (totalPagado / costoTotalExpediente) * 100;

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
        return <Home className="h-4 w-4 text-blue-600" />;
      case "testamento":
        return <FileText className="h-4 w-4 text-blue-600" />;
      case "donacion":
        return <Users className="h-4 w-4 text-purple-600" />;
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
      `📋 Expedientes cargados para licenciado ${licenciadoId || 'No especificado'}:`,
      expedientesLicenciado
    );
    console.log(`📊 Total expedientes: ${expedientesLicenciado.length}`);
    expedientesLicenciado.forEach((exp) => {
      console.log(
        `  - ${exp.numeroSolicitud}: ${exp.tipoTramite} (${exp.estado}) - Asignado a: ${exp.licenciadoAsignado || 'No asignado'}`
      );
    });
    setExpedientes(expedientesLicenciado);
    setFilteredExpedientes(expedientesLicenciado);
  }, [licenciadoId || ""]);

  useEffect(() => {
    // Filtrar expedientes
    let filtered = expedientes;

    // Filtrar por tipo de trámite
    if (!selectedTramiteTypes.includes("todos")) {
      console.log(`🏷️ Filtrando por tipos: ${selectedTramiteTypes.join(", ")}`);
      console.log(
        `📋 Expedientes antes del filtro:`,
        expedientes.map((e) => `${e.numeroSolicitud}: ${e.tipoTramite}`)
      );
      filtered = filtered.filter((exp) => {
        return selectedTramiteTypes.includes(exp.tipoTramite);
      });
      console.log(`📝 Expedientes después del filtro: ${filtered.length}`);
      filtered.forEach((exp) => {
        console.log(`  ✅ ${exp.numeroSolicitud}: ${exp.tipoTramite}`);
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
    console.log(`🤖 [INICIO] Validación IA para expediente ${expedienteId}`);
    console.log(
      `📍 Estado actual del expediente:`,
      expedientes.find((e) => e.id === expedienteId)
    );

    // Agregar a la lista de expedientes en validación
    setValidatingExpedientes((prev) => {
      console.log(`📝 Agregando ${expedienteId} a lista de validación`);
      return new Set([...prev, expedienteId]);
    });

    try {
      console.log(`🔄 Ejecutando validación IA para ${expedienteId}...`);

      // Ejecutar validación IA
      const validationReport = await aiValidationService.validateExpediente(
        expedienteId
      );

      console.log(`📊 Reporte de validación generado:`, validationReport);

      // Guardar el reporte
      aiValidationService.saveValidation(validationReport);

      // Actualizar estado local
      setValidationReports((prev) => ({
        ...prev,
        [expedienteId]: validationReport,
      }));

      console.log(
        `✅ Validación IA completada exitosamente para ${expedienteId}`
      );
    } catch (error) {
      console.error(`❌ Error en validación IA para ${expedienteId}:`, error);
      console.error(`📍 Stack trace:`, error);

      // NO agregar comentario de error automáticamente
      // El Licenciado debe poder ver que la validación falló y decidir qué hacer
      console.log(
        `⚠️ Validación IA falló para ${expedienteId}, pero no se agrega comentario automático`
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
      // Refrescar expedientes desde el backend para obtener el historial actualizado
      const expedientesActualizados = getExpedientesByAbogado(licenciadoId || "");
      setExpedientes(expedientesActualizados);

      // 🤖 VALIDACIÓN IA AUTOMÁTICA: Si se mueve a EN_VALIDACION, ejecutar validación IA
      if (nuevoEstado === "EN_VALIDACION") {
        console.log(
          `🤖 Tarjeta movida a EN_VALIDACION - Iniciando validación IA automática para ${draggedExpediente}`
        );

        // Ejecutar validación IA de forma asíncrona con un pequeño delay
        setTimeout(() => {
          console.log(
            `⏰ Ejecutando validación IA después de delay para ${draggedExpediente}`
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
  };

  const handleTramiteTypeToggle = (tramiteType: string) => {
    console.log("🔄 Toggle tramite type:", tramiteType);
    setSelectedTramiteTypes(prev => {
      console.log("📋 Current selection:", prev);
      
      // Si se selecciona "todos", limpiar todo y dejar solo "todos"
      if (tramiteType === "todos") {
        console.log("✅ Selecting 'todos' - clearing all others");
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
    return filteredExpedientes.filter(
      (exp: ExpedienteCompraventa) => exp.estado === estado
    );
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

  // Función para marcar trámite como pagado
  const handleMarkAsPaid = (expedienteId: string) => {
    setTramitePagado(prev => ({
      ...prev,
      [expedienteId]: true
    }));
    console.log(`Trámite ${expedienteId} marcado como pagado`);
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

            {/* 🤖 Indicadores de Validación IA - Solo mostrar si NO está en Proyecto de escritura o Listo para firma */}
            {(isValidating || hasValidation) && expediente.estado !== "EN_PREPARACION" && expediente.estado !== "LISTO_PARA_FIRMA" && (
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
                            ? "text-blue-600"
                            : validationReport.status === "warning"
                            ? "text-yellow-600"
                            : "text-red-600"
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
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : validationReport.status === "warning"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {(() => {
                          const docCount = getDocumentStatusCount(expediente.id);
                          const totalDocs = documentosCompraventa.length;
                          
                          if (docCount.validated === totalDocs) {
                            return "✅ Aprobado";
                          } else if (docCount.rejected > 0) {
                            return `❌ ${docCount.total} pendientes`;
                          } else {
                            return `⚠️ ${docCount.pending} pendientes`;
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
            {expediente.estado === "EN_PREPARACION" && (
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 text-blue-600">
                    <FileText className="h-3 w-3" />
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs px-2 py-1 ${
                      contractApprovals[expediente.id]?.comprador && contractApprovals[expediente.id]?.vendedor
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-yellow-50 text-yellow-700 border-yellow-200"
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

            {/* Indicador de estado para Listo para firma */}
            {expediente.estado === "LISTO_PARA_FIRMA" && (
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-3 w-3" />
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-1 bg-green-50 text-green-700 border-green-200"
                  >
                    ✅ Listo para firma
                  </Badge>
                </div>
              </div>
            )}

            {/* Botón para proceder a proyecto de escritura cuando todos los documentos estén validados */}
            {(() => {
              const docCount = getDocumentStatusCount(expediente.id);
              const totalDocs = documentosCompraventa.length;
              const todosDocumentosValidados = docCount.validated === totalDocs && totalDocs > 0;
              const estaEnValidacion = expediente.estado === "EN_VALIDACION";
              
              return todosDocumentosValidados && estaEnValidacion && (
                <div className="pt-2 border-t border-slate-200">
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Mover expediente a EN_PREPARACION (Proyecto de escritura)
                      const success = updateExpedienteEstado(
                        expediente.id,
                        "EN_PREPARACION",
                        licenciadoId || ""
                      );
                      if (success) {
                        // Refrescar expedientes
                        const expedientesActualizados = getExpedientesByAbogado(licenciadoId || "");
                        setExpedientes(expedientesActualizados);
                      }
                    }}
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    Proceder a proyecto de escritura
                  </Button>
                </div>
              );
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
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>
              Expediente {selectedExpediente.numeroSolicitud}
            </DialogTitle>
            <DialogDescription>
              Compraventa de {selectedExpediente.inmueble.tipo} -{" "}
              {selectedExpediente.inmueble.superficie}m²
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 pr-2">
            <Tabs defaultValue="informacion" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3 h-12">
                <TabsTrigger value="informacion" className="text-xs">
                    Trámite
                </TabsTrigger>
                <TabsTrigger value="pagos" className="text-xs">
                  Pagos
                </TabsTrigger>
                <TabsTrigger value="historial" className="text-xs">
                  Historial
                </TabsTrigger>
              </TabsList>

              <TabsContent value="informacion" className="space-y-6">
                {/* Información general */}
                <Card className="bg-gradient-to-br from-indigo-50 via-purple-50/50 to-pink-50 border-indigo-200/60">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Información General
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Comprador
                        </Label>
                        <p className="text-sm">
                          {selectedExpediente.comprador.nombre}{" "}
                          {selectedExpediente.comprador.apellidoPaterno}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Vendedor
                        </Label>
                        <p className="text-sm">
                          {selectedExpediente.vendedor.nombre}{" "}
                          {selectedExpediente.vendedor.apellidoPaterno}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Valor de Venta
                        </Label>
                        <p className="text-sm font-medium text-blue-600">
                          {formatCurrency(
                            selectedExpediente.inmueble.valorVenta
                          )}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Costo Total
                        </Label>
                        <p className="text-sm font-medium">
                          {formatCurrency(selectedExpediente.costos.total)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Borrador del Contrato */}
                <Card className="bg-gradient-to-br from-indigo-50 via-purple-50/50 to-pink-50 border-indigo-200/60">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Borrador del Contrato de Compraventa
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Sección principal del documento */}
                      <div className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow cursor-pointer group"
                           onClick={() => {
                             // Abrir el PDF del borrador del contrato
                             const documentoContrato = {
                               id: "contrato-borrador",
                               nombre: "Contrato de Compraventa - Borrador",
                               descripcion: "Documento en validación - Generado automáticamente",
                               archivo: "http://localhost:3000/documentos_legales/Contrato_Compraventa_Borrador.pdf",
                               estado: "pendiente",
                               requerido: true,
                               fechaSubida: null,
                             };
                             handleOpenDocument(documentoContrato);
                           }}>
                        <div className="flex-shrink-0">
                          <div className="w-16 h-20 bg-white border-2 border-gray-200 rounded flex items-center justify-center overflow-hidden">
                            <Image 
                              src="/document-preview.svg" 
                              alt="Vista previa del contrato" 
                              width={48} 
                              height={60}
                              className="object-contain"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            Contrato de Compraventa - Borrador
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Documento en validación - Generado automáticamente
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              <Clock className="h-3 w-3 mr-1" />
                              En Validación
                              </Badge>
                            <span className="text-xs text-gray-500">
                              Última actualización: {new Date().toLocaleDateString()}
                            </span>
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                          <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver PDF
                          </Button>
                        </div>
                      </div>

                      {/* Funcionalidad adicional para Proyecto de escritura */}
                      {selectedExpediente.estado === "EN_PREPARACION" && (
                        <div className="border-t pt-4 space-y-4">
                          {/* Botón de notificación */}
                          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <MessageSquare className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-blue-900">Notificar a las partes</p>
                                <p className="text-sm text-blue-700">
                                  Enviar borrador para revisión y aprobación
                                </p>
                              </div>
                            </div>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNotifyParties(selectedExpediente.id);
                              }}
                              disabled={contractApprovals[selectedExpediente.id]?.notificacionesEnviadas}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              {contractApprovals[selectedExpediente.id]?.notificacionesEnviadas ? (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Notificaciones Enviadas
                                </>
                              ) : (
                                <>
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Enviar Notificaciones
                                </>
                              )}
                            </Button>
                          </div>

                          {/* Aprobaciones de las partes */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-900">Aprobaciones de las partes</h4>
                            
                            {/* Comprador */}
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                  <User className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">Comprador</p>
                                  <p className="text-sm text-gray-600">
                                    {selectedExpediente.comprador.nombre} {selectedExpediente.comprador.apellidoPaterno}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {contractApprovals[selectedExpediente.id]?.comprador ? (
                                  <Badge className="bg-green-100 text-green-800 border-green-200">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Aprobado
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Pendiente
                                  </Badge>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleApproval(selectedExpediente.id, 'comprador');
                                  }}
                                >
                                  {contractApprovals[selectedExpediente.id]?.comprador ? 'Desmarcar' : 'Marcar'}
                                </Button>
                              </div>
                            </div>

                            {/* Vendedor */}
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                  <User className="h-4 w-4 text-purple-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">Vendedor</p>
                                  <p className="text-sm text-gray-600">
                                    {selectedExpediente.vendedor.nombre} {selectedExpediente.vendedor.apellidoPaterno}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {contractApprovals[selectedExpediente.id]?.vendedor ? (
                                  <Badge className="bg-green-100 text-green-800 border-green-200">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Aprobado
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Pendiente
                                  </Badge>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleApproval(selectedExpediente.id, 'vendedor');
                                  }}
                                >
                                  {contractApprovals[selectedExpediente.id]?.vendedor ? 'Desmarcar' : 'Marcar'}
                                </Button>
                              </div>
                            </div>

                            {/* Resumen de aprobaciones */}
                            {contractApprovals[selectedExpediente.id]?.comprador && contractApprovals[selectedExpediente.id]?.vendedor && (
                              <div className="space-y-3">
                                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <p className="font-medium text-green-900">
                                      ¡Borrador aprobado por ambas partes!
                                    </p>
                                  </div>
                                  <p className="text-sm text-green-700 mt-1">
                                    El contrato está listo para proceder a la siguiente etapa.
                                  </p>
                                </div>
                                
                                {/* Botón para mover a Listo para firma */}
                                <div className="flex justify-center">
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Mover expediente a LISTO_PARA_FIRMA
                                      const success = updateExpedienteEstado(
                                        selectedExpediente.id,
                                        "LISTO_PARA_FIRMA",
                                        licenciadoId || ""
                                      );
                                      if (success) {
                                        // Refrescar expedientes
                                        const expedientesActualizados = getExpedientesByAbogado(licenciadoId || "");
                                        setExpedientes(expedientesActualizados);
                                        // Cerrar el modal
                                        setShowExpedienteModal(false);
                                      }
                                    }}
                                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium px-6 py-2"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Documento listo para firma
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Documentos de Compraventa */}
                <Card className="bg-gradient-to-br from-indigo-50 via-purple-50/50 to-pink-50 border-indigo-200/60">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Documentos de Compraventa
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700"
                        >
                          {(() => {
                            const docCount = getDocumentStatusCount(selectedExpediente?.id || "");
                            return `${docCount.validated} de ${documentosCompraventa.length} validados`;
                          })()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Agrupar por categoría */}
                      {[
                        "Documentos del Comprador",
                        "Documentos del Vendedor",
                        "Documentos del Inmueble",
                      ].map((categoria) => {
                        const docsCategoria = documentosCompraventa.filter(
                          (doc) => doc.categoria === categoria
                        );
                        return (
                          <div key={categoria} className="space-y-3">
                            <h3 className="font-semibold text-gray-900 border-b pb-2">
                              {categoria}
                              <Badge
                                variant="outline"
                                className="ml-auto text-xs"
                              >
                                {
                                  docsCategoria.filter(
                                    (d) => d.estado === "validado"
                                  ).length
                                }
                                /{docsCategoria.length}
                              </Badge>
                              {(categoria === "Documentos del Comprador" || categoria === "Documentos del Vendedor") && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setShowContactModal(true)}
                                  className="ml-2 text-xs"
                                >
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  Contactar
                                </Button>
                              )}
                            </h3>
                            <div className="grid gap-2">
                              {docsCategoria.map((doc) => (
                                <div
                                  key={doc.id}
                                  className="flex items-center justify-between p-3 border rounded-lg hover:shadow-sm transition-shadow cursor-pointer group"
                                  onClick={() =>
                                    handleOpenDocument(doc)
                                  }
                                >
                                  <div className="flex items-center gap-3 flex-1">
                                    <div className="flex items-center gap-2">
                                      {doc.requerido && (
                                        <span className="text-red-500 text-xs">
                                          *
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                          {doc.nombre}
                                        </span>
                                        {!doc.requerido && (
                                          <Badge
                                            variant="outline"
                                            className="text-xs bg-gray-50 text-gray-600"
                                          >
                                            Opcional
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-xs text-gray-600 mt-1">
                                        {doc.descripcion}
                                      </p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        Subido:{" "}
                                        {new Date(
                                          doc.fechaSubida
                                        ).toLocaleDateString("es-MX", {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className={
                                        documentStates[doc.id] === "aceptado"
                                          ? "bg-blue-100 text-blue-800 border-blue-200"
                                          : documentStates[doc.id] === "rechazado"
                                          ? "bg-red-100 text-red-800 border-red-200"
                                          : doc.estado === "validado"
                                          ? "bg-blue-100 text-blue-800 border-blue-200"
                                          : doc.estado === "subido"
                                          ? "bg-blue-100 text-blue-800 border-blue-200"
                                          : "bg-yellow-100 text-yellow-800 border-yellow-200"
                                      }
                                    >
                                      {documentStates[doc.id] === "aceptado" && (
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                      )}
                                      {documentStates[doc.id] === "rechazado" && (
                                        <XCircle className="h-3 w-3 mr-1" />
                                      )}
                                      {!documentStates[doc.id] && doc.estado === "validado" && (
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                      )}
                                      {!documentStates[doc.id] && doc.estado === "subido" && (
                                        <Clock className="h-3 w-3 mr-1" />
                                      )}
                                      {!documentStates[doc.id] && doc.estado === "pendiente" && (
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                      )}
                                      {documentStates[doc.id] === "aceptado"
                                        ? "Validado"
                                        : documentStates[doc.id] === "rechazado"
                                        ? "Rechazado"
                                        : doc.estado.charAt(0).toUpperCase() +
                                        doc.estado.slice(1)}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
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
                                  ? "bg-blue-100"
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
                                ? "bg-blue-100 text-blue-800"
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
                                            ? "bg-blue-100"
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
                                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                                : "bg-red-50 text-red-700 border-red-200"
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
                                            <p className="text-xs text-blue-600">
                                              💡{" "}
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
                                            className="text-sm bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
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
                                            className="text-sm bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
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
                                              ? "bg-blue-100 text-blue-800 border-blue-200"
                                              : "bg-red-100 text-red-800 border-red-200"
                                          }
                                        >
                                          {manualValidations[
                                            selectedExpediente.id
                                          ][validation.documentType].approved
                                            ? "✅ Aprobado"
                                            : "❌ Rechazado"}
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
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                              <TrendingUp className="h-4 w-4" />
                              Acciones Recomendadas
                            </h4>
                            <ul className="text-sm text-blue-800 space-y-1">
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
                          Arrastra la tarjeta a "En Validación" para activar la
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
                          className="bg-blue-600 hover:bg-blue-700"
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
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <Label className="text-sm font-medium text-blue-600">
                            Total Pagado
                          </Label>
                          <p className="text-xl font-bold text-blue-700 mt-1">
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
                                        ? "bg-blue-500"
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
                                            ? "bg-blue-100 text-blue-800 border-blue-200"
                                            : pago.estado === "pendiente"
                                            ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                            : "bg-red-100 text-red-800 border-red-200"
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
                                        {new Date(
                                          pago.fecha
                                        ).toLocaleDateString("es-MX", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
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
                                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
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
                          <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <User className="h-5 w-5 text-green-600" />
                                <h4 className="font-semibold text-green-900">Comprador</h4>
                              </div>
                              {pagosPorParte[selectedExpediente.id]?.comprador ? (
                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Pagado
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Pendiente
                                </Badge>
                              )}
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Total asignado:</span>
                                <span className="font-medium">{formatCurrency(costoTotalExpediente * 0.5)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Pagado:</span>
                                <span className="font-medium text-green-600">
                                  {tramitePagado[selectedExpediente.id] 
                                    ? formatCurrency(costoTotalExpediente * 0.5)
                                    : formatCurrency(totalPagado * 0.5)
                                  }
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Pendiente:</span>
                                <span className="font-medium text-red-600">
                                  {tramitePagado[selectedExpediente.id] 
                                    ? formatCurrency(0)
                                    : formatCurrency(saldoPendiente * 0.5)
                                  }
                                </span>
                              </div>
                              <div className="mt-3">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                                    style={{ 
                                      width: `${tramitePagado[selectedExpediente.id] 
                                        ? 100 
                                        : (totalPagado / costoTotalExpediente) * 100
                                      }%` 
                                    }}
                                  />
                                </div>
                                <p className="text-xs text-gray-500 mt-1 text-center">
                                  {tramitePagado[selectedExpediente.id] 
                                    ? "100.0% completado"
                                    : `${((totalPagado / costoTotalExpediente) * 100).toFixed(1)}% completado`
                                  }
                                </p>
                              </div>
                              {!pagosPorParte[selectedExpediente.id]?.comprador && (
                                <div className="mt-3">
                                  <Button
                                    size="sm"
                                    onClick={() => handleMarkParteAsPaid(selectedExpediente.id, 'comprador')}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white"
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
                                <User className="h-5 w-5 text-purple-600" />
                                <h4 className="font-semibold text-purple-900">Vendedor</h4>
                              </div>
                              {pagosPorParte[selectedExpediente.id]?.vendedor ? (
                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Pagado
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Pendiente
                                </Badge>
                              )}
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Total asignado:</span>
                                <span className="font-medium">{formatCurrency(costoTotalExpediente * 0.5)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Pagado:</span>
                                <span className="font-medium text-green-600">
                                  {tramitePagado[selectedExpediente.id] 
                                    ? formatCurrency(costoTotalExpediente * 0.5)
                                    : formatCurrency(totalPagado * 0.5)
                                  }
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Pendiente:</span>
                                <span className="font-medium text-red-600">
                                  {tramitePagado[selectedExpediente.id] 
                                    ? formatCurrency(0)
                                    : formatCurrency(saldoPendiente * 0.5)
                                  }
                                </span>
                              </div>
                              <div className="mt-3">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                                    style={{ 
                                      width: `${tramitePagado[selectedExpediente.id] 
                                        ? 100 
                                        : (totalPagado / costoTotalExpediente) * 100
                                      }%` 
                                    }}
                                  />
                                </div>
                                <p className="text-xs text-gray-500 mt-1 text-center">
                                  {tramitePagado[selectedExpediente.id] 
                                    ? "100.0% completado"
                                    : `${((totalPagado / costoTotalExpediente) * 100).toFixed(1)}% completado`
                                  }
                                </p>
                              </div>
                              {!pagosPorParte[selectedExpediente.id]?.vendedor && (
                                <div className="mt-3">
                                  <Button
                                    size="sm"
                                    onClick={() => handleMarkParteAsPaid(selectedExpediente.id, 'vendedor')}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
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

                      {/* Botón para marcar trámite completo como pagado */}
                      {!tramitePagado[selectedExpediente.id] && 
                       pagosPorParte[selectedExpediente.id]?.comprador && 
                       pagosPorParte[selectedExpediente.id]?.vendedor && (
                        <div className="flex justify-center">
                          <Button
                            onClick={() => handleMarkAsPaid(selectedExpediente.id)}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium px-6 py-2"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Marcar Trámite Completo como Pagado
                          </Button>
                        </div>
                      )}

                      {/* Resumen de estado de pagos */}
                      {pagosPorParte[selectedExpediente.id]?.comprador || pagosPorParte[selectedExpediente.id]?.vendedor ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Estado de Pagos por Parte
                          </h4>
                          <div className="text-sm text-blue-800 space-y-1">
                            <p>
                              • Comprador: {pagosPorParte[selectedExpediente.id]?.comprador ? '✅ Pagado' : '⏳ Pendiente'}
                            </p>
                            <p>
                              • Vendedor: {pagosPorParte[selectedExpediente.id]?.vendedor ? '✅ Pagado' : '⏳ Pendiente'}
                            </p>
                            {pagosPorParte[selectedExpediente.id]?.comprador && pagosPorParte[selectedExpediente.id]?.vendedor && (
                              <p className="font-medium text-green-700">
                                🎉 ¡Ambas partes han completado sus pagos!
                              </p>
                            )}
                          </div>
                        </div>
                      ) : null}

                      {/* Estado de pago completo */}
                      {tramitePagado[selectedExpediente.id] && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <h4 className="font-semibold text-green-900">Trámite Completamente Pagado</h4>
                          </div>
                          <p className="text-sm text-green-700 mt-1">
                            Todos los pagos han sido confirmados y el trámite está listo para continuar.
                          </p>
                        </div>
                      )}

                      {/* Notas importantes */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Notas Importantes
                        </h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>
                            • Los pagos deben realizarse antes de las fechas
                            límite
                          </li>
                          <li>
                            • El pago final se debe liquidar al momento de la
                            firma
                          </li>
                          <li>
                            • Todos los comprobantes están disponibles para
                            descarga
                          </li>
                          <li>• Los pagos anticipados no son reembolsables</li>
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
                              <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
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
                className="flex-1 bg-blue-600 hover:bg-blue-700"
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
            <DialogTitle className="flex items-center gap-2 text-blue-600">
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
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
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
              className="bg-blue-600 hover:bg-blue-700"
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
              className="bg-blue-600 hover:bg-blue-700"
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
                  : "bg-white/70 text-slate-600 hover:bg-blue-50 border border-slate-200"
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
        {KANBAN_COLUMNS.map((column) => {
          const expedientesEnColumna = getExpedientesByColumn(column.id);

          return (
            <div
              key={column.id}
                className="bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-md rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 p-4 min-h-[500px]"
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
          className="modal-expediente-ancho flex flex-col"
        >
          <DialogHeader className="p-4 border-b">
            <DialogTitle>
              Visualización de Documento
            </DialogTitle>
            <DialogDescription>
              {selectedDocument?.nombre || "Documento legal para trámite de compraventa"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 flex overflow-hidden">
              {/* Panel izquierdo - Visualizador de documento */}
              <div className={`${selectedExpediente?.estado === "LISTO_PARA_FIRMA" ? "w-full" : "w-3/5"} flex flex-col pdf-viewer-container relative`}>
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
                <div className="w-2/5 bg-white border-l border-gray-200 flex flex-col">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedDocument?.id === "contrato-borrador" ? "Validación del Contrato" : "Extracción de Datos con IA"}
                      </h3>
                      {selectedDocument?.id !== "contrato-borrador" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={handleAcceptDocument}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Aceptar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-600 hover:bg-red-50"
                            onClick={handleRejectDocument}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Rechazar documento
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedDocument?.id === "contrato-borrador" 
                        ? "Validación guiada del borrador del contrato de compraventa"
                        : "Datos extraídos del Acta de Nacimiento"
                      }
                    </p>
          </div>

                  {selectedDocument?.id === "contrato-borrador" ? (
                    /* Panel de Validación Guiada para el Contrato */
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {/* Sección de búsqueda */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-gray-600">Buscar en el documento:</p>
                          <span className="text-xs text-blue-600 font-medium">
                            {contractSearchData[currentSearchIndex]?.type}
                          </span>
                        </div>
                        <div className="bg-yellow-100 border border-yellow-300 rounded p-3">
                          <p className="text-sm font-semibold text-gray-800">
                            "{highlightedText}"
                          </p>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">
                            📍 {contractSearchData[currentSearchIndex]?.location}
                          </p>
                          <p className="text-xs text-gray-600">
                            {contractSearchData[currentSearchIndex]?.description}
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="mt-2 text-xs"
                          onClick={handleGoToText}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Ir al Texto
                        </Button>
                      </div>

                      {/* Navegación */}
                      <div className="flex items-center justify-between">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          disabled={currentSearchIndex === 0}
                          className="text-xs"
                          onClick={handlePreviousSearch}
                        >
                          <ArrowLeft className="h-3 w-3 mr-1" />
                          Anterior
                        </Button>
                        <span className="text-xs text-gray-500">
                          {currentSearchIndex + 1} de {contractSearchData.length}
                        </span>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          disabled={currentSearchIndex === contractSearchData.length - 1}
                          className="text-xs"
                          onClick={handleNextSearch}
                        >
                          Siguiente
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>

                      {/* Botones de acción */}
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs flex-1">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Marcar como Revisado
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 text-xs flex-1">
                          <XCircle className="h-3 w-3 mr-1" />
                          Requiere Corrección
                        </Button>
                      </div>

                      {/* Panel de edición */}
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h6 className="text-sm font-medium text-blue-900 mb-3">Editor de Documento</h6>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-blue-800 mb-1">
                              Campo a editar:
                            </label>
                            <select 
                              className="w-full px-2 py-1 border border-blue-300 rounded text-xs"
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
                            <label className="block text-xs font-medium text-blue-800 mb-1">
                              Valor actual:
                            </label>
                            <input
                              type="text"
                              value={highlightedText}
                              className="w-full px-2 py-1 border border-blue-300 rounded text-xs bg-blue-100"
                              readOnly
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-blue-800 mb-1">
                              Nuevo valor:
                            </label>
                            <input
                              type="text"
                              placeholder="Ingrese el valor corregido..."
                              className="w-full px-2 py-1 border border-blue-300 rounded text-xs"
                            />
                          </div>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs w-full">
                            <FileEdit className="h-3 w-3 mr-1" />
                            Aplicar Corrección
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Panel original de extracción de datos para otros documentos */
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                      {/* Tipo de participante */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de participante *
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {["Comprador", "Conyuge", "Vendedor", "Representante"].map((tipo) => (
                            <button
                              key={tipo}
                              className={`px-3 py-2 text-xs rounded-full border transition-colors ${
                                tipo === "Comprador" 
                                  ? "bg-purple-100 text-purple-700 border-purple-300" 
                                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                              }`}
                            >
                              <User className="h-3 w-3 inline mr-1" />
                              {tipo}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Nombre completo */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre completo *
                        </label>
                        <input
                          type="text"
                          value="JONATHAN RUBEN HERNANDEZ GONZALEZ"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          readOnly
                        />
                      </div>

                      {/* Fecha de nacimiento y Edad */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fecha de nacimiento
                          </label>
                          <input
                            type="text"
                            value="02/07/1986"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Edad
                          </label>
                          <input
                            type="text"
                            value="38 años"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            readOnly
                          />
                        </div>
                      </div>

                      {/* Género y Lugar de nacimiento */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Género
                          </label>
                          <input
                            type="text"
                            value="HOMBRE"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lugar de nacimiento
                          </label>
                          <input
                            type="text"
                            value="NEZAHUALCOYOTL, MEXICO"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            readOnly
                          />
                        </div>
                      </div>

                      {/* Nacionalidad y Estado civil */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nacionalidad
                          </label>
                          <input
                            type="text"
                            value="MEXICANA"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estado civil actual
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                            <option value="SOLTERO">SOLTERO</option>
                            <option value="CASADO" selected>CASADO</option>
                            <option value="DIVORCIADO">DIVORCIADO</option>
                            <option value="VIUDO">VIUDO</option>
                            <option value="UNION_LIBRE">UNIÓN LIBRE</option>
                          </select>
                        </div>
                      </div>

                      {/* Número de acta y CURP */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Número de acta
                          </label>
                          <input
                            type="text"
                            value="2710"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CURP
                          </label>
                          <input
                            type="text"
                            value="HEGJ860702HMCRNN07"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            readOnly
                          />
                        </div>
                      </div>

                      {/* Registro civil y Fecha de registro */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="text-sm font-semibold text-blue-700 mb-3">Datos del Documento</h4>
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-medium text-blue-600 mb-1">
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
                              <label className="block text-xs font-medium text-blue-600 mb-1">
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
                            <label className="block text-xs font-medium text-blue-600 mb-1">
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
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-blue-700">
                            IA Procesando...
                          </span>
                        </div>
                        <p className="text-xs text-blue-600">
                          La inteligencia artificial está analizando el acta de nacimiento para extraer información adicional.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                )}
          </div>

          <div className="flex justify-between items-center p-4 border-t bg-gray-50">
            <div className="text-sm text-gray-600">
              💡 Documento real utilizado para demostración
            </div>
            <div className="flex gap-2">
              {selectedExpediente?.estado === "LISTO_PARA_FIRMA" ? (
                // Botones para Listo para firma - Solo PDF con opciones de imprimir y descargar
                <>
                  <Button
                    variant="outline"
                    onClick={() => window.print()}
                    className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Imprimir
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = selectedDocument?.archivo || "";
                      link.download = selectedDocument?.nombre || "contrato.pdf";
                      link.click();
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDocumentViewer(false)}
                  >
                    Cerrar
                  </Button>
                </>
              ) : selectedDocument?.id === "contrato-borrador" ? (
                // Botones para contrato borrador en otras columnas
                <Button
                  variant="outline"
                  onClick={() => setShowDocumentViewer(false)}
                >
                  Cerrar
                </Button>
              ) : (
                // Botones para otros documentos
                <>
                  <Button
                    variant="outline"
                    onClick={() => window.open(selectedDocument?.archivo || "", "_blank")}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Abrir en Nueva Pestaña
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDocumentViewer(false)}
                  >
                    Cerrar
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
