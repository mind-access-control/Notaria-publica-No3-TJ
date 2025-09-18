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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  ArrowUp,
  ArrowDown,
  Send,
  Shield,
  TrendingUp,
  Users,
  Building,
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
  abogadoId: string;
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
    color: "bg-blue-50 border-blue-200",
    icon: <FileText className="h-4 w-4 text-blue-600" />,
  },
  {
    id: "EN_VALIDACION",
    title: "En Validación",
    color: "bg-yellow-50 border-yellow-200",
    icon: <Clock className="h-4 w-4 text-yellow-600" />,
  },
  {
    id: "EN_PREPARACION",
    title: "En Preparación",
    color: "bg-orange-50 border-orange-200",
    icon: <Edit3 className="h-4 w-4 text-orange-600" />,
  },
  {
    id: "LISTO_PARA_FIRMA",
    title: "Listo para Firma",
    color: "bg-green-50 border-green-200",
    icon: <CheckCircle className="h-4 w-4 text-green-600" />,
  },
  {
    id: "COMPLETADO",
    title: "Completado",
    color: "bg-emerald-50 border-emerald-200",
    icon: <Shield className="h-4 w-4 text-emerald-600" />,
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
  abogadoId,
}: AbogadoKanbanDashboardProps) {
  const [expedientes, setExpedientes] = useState<ExpedienteCompraventa[]>([]);
  const [filteredExpedientes, setFilteredExpedientes] = useState<
    ExpedienteCompraventa[]
  >([]);
  const [selectedTramiteType, setSelectedTramiteType] =
    useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExpediente, setSelectedExpediente] =
    useState<ExpedienteCompraventa | null>(null);
  const [showExpedienteModal, setShowExpedienteModal] = useState(false);
  const [showComentarioModal, setShowComentarioModal] = useState(false);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [tipoComentario, setTipoComentario] = useState<
    "general" | "observacion" | "requerimiento"
  >("general");
  const [draggedExpediente, setDraggedExpediente] = useState<string | null>(
    null
  );
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [showSubmenu, setShowSubmenu] = useState<string | null>(null);
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
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [manualValidations, setManualValidations] = useState<
    Record<string, Record<string, { approved: boolean; reason?: string }>>
  >({});
  const [revalidatingExpedientes, setRevalidatingExpedientes] = useState<
    Set<string>
  >(new Set());

  // Lista completa de documentos para compraventa con documentos reales
  const documentosCompraventa = [
    {
      id: "doc-comprador-ine",
      categoria: "Documentos del Comprador",
      nombre: "INE del Comprador",
      descripcion: "Identificación oficial vigente del comprador",
      archivo: "/documentos_legales/2 Identificación Oficial.pdf",
      estado: "validado",
      requerido: true,
      fechaSubida: "2025-01-15T10:30:00Z",
    },
    {
      id: "doc-comprador-acta",
      categoria: "Documentos del Comprador",
      nombre: "Acta de Nacimiento del Comprador",
      descripcion: "Acta de nacimiento certificada del comprador",
      archivo:
        "/documentos_legales/1 Acta_de_Nacimiento_HEGJ860702HMCRNN07.pdf",
      estado: "validado",
      requerido: true,
      fechaSubida: "2025-01-15T10:32:00Z",
    },
    {
      id: "doc-comprador-curp",
      categoria: "Documentos del Comprador",
      nombre: "CURP del Comprador",
      descripcion: "Clave Única de Registro de Población",
      archivo: "/documentos_legales/CURP_HEGJ860702HMCRNN07.pdf",
      estado: "validado",
      requerido: true,
      fechaSubida: "2025-01-15T10:35:00Z",
    },
    {
      id: "doc-comprador-rfc",
      categoria: "Documentos del Comprador",
      nombre: "RFC del Comprador",
      descripcion: "Registro Federal de Contribuyentes",
      archivo: "/documentos_legales/11 RFC.pdf",
      estado: "validado",
      requerido: true,
      fechaSubida: "2025-01-15T10:38:00Z",
    },
    {
      id: "doc-comprador-domicilio",
      categoria: "Documentos del Comprador",
      nombre: "Comprobante de Domicilio del Comprador",
      descripcion: "Comprobante de domicilio no mayor a 3 meses",
      archivo: "/documentos_legales/4 Comprobante de domicilio Luz.pdf",
      estado: "validado",
      requerido: true,
      fechaSubida: "2025-01-15T10:40:00Z",
    },
    {
      id: "doc-comprador-estado-cuenta",
      categoria: "Documentos del Comprador",
      nombre: "Estado de Cuenta del Comprador",
      descripcion: "Estado de cuenta bancario para verificar solvencia",
      archivo: "/documentos_legales/12 EstadoDeCuentaBanorte.pdf",
      estado: "validado",
      requerido: false,
      fechaSubida: "2025-01-15T10:45:00Z",
    },
    {
      id: "doc-vendedor-ine",
      categoria: "Documentos del Vendedor",
      nombre: "INE del Vendedor",
      descripcion: "Identificación oficial vigente del vendedor",
      archivo: "/documentos_legales/2 Identificación Oficial.pdf",
      estado: "validado",
      requerido: true,
      fechaSubida: "2025-01-15T11:00:00Z",
    },
    {
      id: "doc-vendedor-acta",
      categoria: "Documentos del Vendedor",
      nombre: "Acta de Nacimiento del Vendedor",
      descripcion: "Acta de nacimiento certificada del vendedor",
      archivo:
        "/documentos_legales/1 Acta_de_Nacimiento_HEGJ860702HMCRNN07.pdf",
      estado: "validado",
      requerido: true,
      fechaSubida: "2025-01-15T11:05:00Z",
    },
    {
      id: "doc-vendedor-rfc",
      categoria: "Documentos del Vendedor",
      nombre: "RFC del Vendedor",
      descripcion: "Registro Federal de Contribuyentes del vendedor",
      archivo: "/documentos_legales/7 CEDULA DE IDENTIFICACION FISCAL.pdf",
      estado: "validado",
      requerido: true,
      fechaSubida: "2025-01-15T11:10:00Z",
    },
    {
      id: "doc-inmueble-escritura",
      categoria: "Documentos del Inmueble",
      nombre: "Escritura Pública del Inmueble",
      descripcion: "Escritura pública que acredita la propiedad",
      archivo: "/documentos_legales/Copia_de_32689.docx.md",
      estado: "validado",
      requerido: true,
      fechaSubida: "2025-01-15T11:15:00Z",
    },
    {
      id: "doc-inmueble-avaluo",
      categoria: "Documentos del Inmueble",
      nombre: "Avalúo del Inmueble",
      descripcion: "Avalúo comercial vigente (no mayor a 6 meses)",
      archivo: "/documentos_legales/Avaluo M0332025.pdf",
      estado: "validado",
      requerido: true,
      fechaSubida: "2025-01-15T11:20:00Z",
    },
    {
      id: "doc-inmueble-clg",
      categoria: "Documentos del Inmueble",
      nombre: "Certificado de Libertad de Gravamen (CLG)",
      descripcion:
        "Certificado que acredita que el inmueble está libre de gravámenes",
      archivo: "/documentos_legales/CLG_Certificado_Libertad_Gravamen.md",
      estado: "validado",
      requerido: true,
      fechaSubida: "2025-01-15T11:25:00Z",
    },
  ];

  // Función para abrir documento
  const handleOpenDocument = (archivo: string) => {
    setSelectedDocument(archivo);
    setShowDocumentViewer(true);
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
    const comentario = `👨‍💼 REVISIÓN MANUAL: El abogado ${accion} la validación de "${documentType}".${razonTexto}`;

    addComentarioExpediente(
      expedienteId,
      comentario,
      "Abogado",
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
          updateExpedienteEstado(expedienteId, "EN_VALIDACION", "abogado-1");

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
        return <Home className="h-4 w-4 text-emerald-600" />;
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
    // Cargar expedientes del abogado
    const expedientesAbogado = getExpedientesByAbogado(abogadoId);
    console.log(
      `📋 Expedientes cargados para abogado ${abogadoId}:`,
      expedientesAbogado
    );
    console.log(`📊 Total expedientes: ${expedientesAbogado.length}`);
    expedientesAbogado.forEach((exp) => {
      console.log(
        `  - ${exp.numeroSolicitud}: ${exp.tipoTramite} (${exp.estado}) - Asignado a: ${exp.abogadoAsignado}`
      );
    });
    setExpedientes(expedientesAbogado);
    setFilteredExpedientes(expedientesAbogado);
  }, [abogadoId]);

  useEffect(() => {
    // Filtrar expedientes
    let filtered = expedientes;

    // Filtrar por tipo de trámite
    if (selectedTramiteType !== "todos") {
      console.log(`🏷️ Filtrando por tipo: ${selectedTramiteType}`);
      console.log(
        `📋 Expedientes antes del filtro:`,
        expedientes.map((e) => `${e.numeroSolicitud}: ${e.tipoTramite}`)
      );
      filtered = filtered.filter((exp) => {
        return exp.tipoTramite === selectedTramiteType;
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
  }, [expedientes, selectedTramiteType, searchTerm, sortOrder]);

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
      // El abogado debe poder ver que la validación falló y decidir qué hacer
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

      // Verificar si el pago está completo
      const pagoCompleto = expediente.costos.saldoPendiente === 0;
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
      abogadoId
    );

    if (success) {
      // Refrescar expedientes desde el backend para obtener el historial actualizado
      const expedientesActualizados = getExpedientesByAbogado(abogadoId);
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

  const handleAddComentario = () => {
    if (!selectedExpediente || !nuevoComentario.trim()) return;

    const success = addComentarioExpediente(
      selectedExpediente.id,
      nuevoComentario,
      abogadoId,
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
        className="cursor-pointer hover:shadow-md transition-shadow mb-3"
        draggable
        onDragStart={(e) => handleDragStart(e, expediente.id)}
        onClick={() => handleExpedienteClick(expediente)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {getTramiteIcon(expediente.tipoTramite || "")}
                <CardTitle className="text-sm font-medium text-gray-900">
                  {getTramiteTitle(expediente)}
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-gray-600">
                {expediente.numeroSolicitud}
              </CardDescription>
              <CardDescription className="text-xs text-gray-500 mt-1">
                {getTramiteDescription(expediente)}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-1">
              {/* El estado se define por la columna */}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Home className="h-3 w-3" />
              <span>
                {expediente.tipoTramite === "testamento"
                  ? `Bienes: ${expediente.inmueble.tipo}`
                  : expediente.tipoTramite === "donacion"
                  ? `Donación: ${expediente.inmueble.tipo} - ${expediente.inmueble.superficie}m²`
                  : `${expediente.inmueble.tipo} - ${expediente.inmueble.superficie}m²`}
              </span>
            </div>

            {expediente.comentarios.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
                <MessageSquare className="h-3 w-3" />
                <span>
                  {expediente.comentarios.length} comentario
                  {expediente.comentarios.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}

            {/* 🤖 Indicadores de Validación IA */}
            {(isValidating || hasValidation) && (
              <div className="pt-2 border-t border-gray-100">
                {isValidating && (
                  <div className="flex items-center gap-2 text-xs text-blue-600">
                    <div className="animate-spin">
                      <Shield className="h-3 w-3" />
                    </div>
                    <span className="font-medium">IA validando...</span>
                  </div>
                )}

                {hasValidation && !isValidating && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <div
                        className={`flex items-center gap-1 ${
                          validationReport.status === "passed"
                            ? "text-green-600"
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
                        <span className="font-medium">
                          IA: {validationReport.overallScore}%
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs px-1 py-0 ${
                          validationReport.status === "passed"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : validationReport.status === "warning"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {validationReport.status === "passed" && "✅ Aprobado"}
                        {validationReport.status === "warning" &&
                          "⚠️ Observaciones"}
                        {validationReport.status === "failed" && "❌ Errores"}
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
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              Expediente {selectedExpediente.numeroSolicitud}
            </DialogTitle>
            <DialogDescription>
              Compraventa de {selectedExpediente.inmueble.tipo} -{" "}
              {selectedExpediente.inmueble.superficie}m²
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 pr-2">
            <Tabs defaultValue="informacion" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5 h-12">
                <TabsTrigger value="informacion" className="text-xs">
                  Info
                </TabsTrigger>
                <TabsTrigger value="documentos" className="text-xs">
                  Documentos
                </TabsTrigger>
                <TabsTrigger
                  value="validaciones"
                  className="flex items-center gap-1 text-xs"
                >
                  <Shield className="h-3 w-3" />
                  IA
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
                <Card>
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
                        <p className="text-sm font-medium text-emerald-600">
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

                {/* Comentarios */}
                <Card>
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
                          className="bg-emerald-600 hover:bg-emerald-700"
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
                            <Badge variant="outline" className="text-xs mt-2">
                              {comentario.tipo}
                            </Badge>
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

              <TabsContent value="documentos" className="space-y-6">
                {/* Documentos de Compraventa */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5 text-emerald-600" />
                        Documentos de Compraventa
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-emerald-50 text-emerald-700"
                        >
                          {
                            documentosCompraventa.filter(
                              (d) => d.estado === "validado"
                            ).length
                          }{" "}
                          de {documentosCompraventa.length} validados
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
                            <h3 className="font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                              {categoria === "Documentos del Comprador" && (
                                <User className="h-4 w-4 text-blue-600" />
                              )}
                              {categoria === "Documentos del Vendedor" && (
                                <Users className="h-4 w-4 text-purple-600" />
                              )}
                              {categoria === "Documentos del Inmueble" && (
                                <Building className="h-4 w-4 text-orange-600" />
                              )}
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
                            </h3>
                            <div className="grid gap-2">
                              {docsCategoria.map((doc) => (
                                <div
                                  key={doc.id}
                                  className="flex items-center justify-between p-3 border rounded-lg hover:shadow-sm transition-shadow cursor-pointer group"
                                  onClick={() =>
                                    handleOpenDocument(doc.archivo)
                                  }
                                >
                                  <div className="flex items-center gap-3 flex-1">
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4 text-gray-600" />
                                      {doc.requerido && (
                                        <span className="text-red-500 text-xs">
                                          *
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
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
                                        doc.estado === "validado"
                                          ? "bg-green-100 text-green-800 border-green-200"
                                          : doc.estado === "subido"
                                          ? "bg-blue-100 text-blue-800 border-blue-200"
                                          : "bg-yellow-100 text-yellow-800 border-yellow-200"
                                      }
                                    >
                                      {doc.estado === "validado" && (
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                      )}
                                      {doc.estado === "subido" && (
                                        <Clock className="h-3 w-3 mr-1" />
                                      )}
                                      {doc.estado === "pendiente" && (
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                      )}
                                      {doc.estado.charAt(0).toUpperCase() +
                                        doc.estado.slice(1)}
                                    </Badge>
                                    <Eye className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
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

              {/* Nueva pestaña de Validaciones IA */}
              <TabsContent value="validaciones" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Shield className="h-5 w-5 text-emerald-600" />
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
                                  ? "bg-green-100"
                                  : validationReports[selectedExpediente.id]
                                      .status === "warning"
                                  ? "bg-yellow-100"
                                  : "bg-red-100"
                              }`}
                            >
                              {validationReports[selectedExpediente.id]
                                .status === "passed" && (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              )}
                              {validationReports[selectedExpediente.id]
                                .status === "warning" && (
                                <AlertCircle className="h-5 w-5 text-yellow-600" />
                              )}
                              {validationReports[selectedExpediente.id]
                                .status === "failed" && (
                                <AlertCircle className="h-5 w-5 text-red-600" />
                              )}
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
                                ? "bg-green-100 text-green-800"
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
                                            ? "bg-green-100"
                                            : "bg-red-100"
                                        }`}
                                      >
                                        {validation.result.isValid ? (
                                          <CheckCircle className="h-4 w-4 text-green-600" />
                                        ) : (
                                          <AlertCircle className="h-4 w-4 text-red-600" />
                                        )}
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
                                                ? "bg-green-50 text-green-700 border-green-200"
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
                                            className="text-sm bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
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
                                              ? "bg-green-100 text-green-800 border-green-200"
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
                        <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
              </TabsContent>

              <TabsContent value="pagos" className="space-y-6">
                {/* Pagos */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-emerald-600" />
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
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <Label className="text-sm font-medium text-green-600">
                            Total Pagado
                          </Label>
                          <p className="text-xl font-bold text-green-700 mt-1">
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
                            className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
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
                                        ? "bg-green-500"
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
                                            ? "bg-green-100 text-green-800 border-green-200"
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
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="h-5 w-5 text-emerald-600" />
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
                              <div className="w-3 h-3 bg-emerald-500 rounded-full mt-2"></div>
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
              <Label htmlFor="tipo-comentario">Tipo de Comentario</Label>
              <Select
                value={tipoComentario}
                onValueChange={(value: any) => setTipoComentario(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="observacion">Observación</SelectItem>
                  <SelectItem value="requerimiento">Requerimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
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
              className="bg-emerald-600 hover:bg-emerald-700"
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
      {/* Header con filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                Dashboard Kanban - Abogado
              </CardTitle>
              <CardDescription>
                Gestiona tus expedientes de manera eficiente
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-600">
                  {filteredExpedientes.length}
                </div>
                <div className="text-sm text-gray-600">Expedientes</div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Filtro por tipo de trámite */}
            <div className="flex flex-wrap gap-2 relative">
              {TRAMITE_TYPES.map((tipo) => (
                <div key={tipo.id} className="relative">
                  <Button
                    variant={
                      selectedTramiteType === tipo.id ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => {
                      if (tipo.submenu) {
                        setShowSubmenu(
                          showSubmenu === tipo.id ? null : tipo.id
                        );
                      } else {
                        setSelectedTramiteType(tipo.id);
                        setShowSubmenu(null);
                      }
                    }}
                    className={`flex items-center gap-2 text-xs transition-all ${
                      selectedTramiteType === tipo.id
                        ? "bg-emerald-600 text-white shadow-md"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {tipo.icon}
                    <span className="hidden sm:inline">{tipo.name}</span>
                    {tipo.submenu && (
                      <ArrowDown
                        className={`h-3 w-3 transition-transform ${
                          showSubmenu === tipo.id ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </Button>

                  {/* Submenu */}
                  {tipo.submenu && showSubmenu === tipo.id && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-64 max-h-80 overflow-y-auto">
                      <div className="p-2 space-y-1">
                        {tipo.submenu.map((subitem) => (
                          <Button
                            key={subitem.id}
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedTramiteType(subitem.id);
                              setShowSubmenu(null);
                            }}
                            className={`w-full justify-start text-xs ${
                              selectedTramiteType === subitem.id
                                ? "bg-emerald-100 text-emerald-700"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            {subitem.icon}
                            <span className="ml-2">{subitem.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por número, cliente o vendedor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {KANBAN_COLUMNS.map((column) => {
          const expedientesEnColumna = getExpedientesByColumn(column.id);

          return (
            <div
              key={column.id}
              className={`${column.color} rounded-lg border-2 border-dashed p-4 min-h-[500px]`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="flex items-center gap-2 mb-4">
                {column.icon}
                <h3 className="font-medium text-gray-900">{column.title}</h3>
                <Badge variant="outline" className="ml-auto">
                  {expedientesEnColumna.length}
                </Badge>
              </div>

              <div className="space-y-3">
                {expedientesEnColumna.map((expediente) =>
                  renderExpedienteCard(expediente)
                )}

                {expedientesEnColumna.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No hay expedientes</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
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
              <Label htmlFor="tipo-comentario">Tipo de Comentario</Label>
              <Select
                value={tipoComentario}
                onValueChange={(value: any) => setTipoComentario(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="observacion">Observación</SelectItem>
                  <SelectItem value="requerimiento">Requerimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>

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

      {/* Modal de pago pendiente */}
      {renderPaymentModal()}

      {/* Modal de Visualización de Documentos */}
      <Dialog open={showDocumentViewer} onOpenChange={setShowDocumentViewer}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              Visualización de Documento
            </DialogTitle>
            <DialogDescription>
              Documento legal para trámite de compraventa
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            {selectedDocument && (
              <iframe
                src={selectedDocument}
                className="w-full h-full border rounded-lg"
                title="Documento PDF"
              />
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-600">
              💡 Documento real utilizado para demostración
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  selectedDocument && window.open(selectedDocument, "_blank")
                }
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
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
