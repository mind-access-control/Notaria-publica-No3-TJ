"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Users,
  Calendar,
  DollarSign,
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Filter,
  Download,
  Send,
  Archive,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Mock data para expedientes
const expedientesMock = [
  {
    id: "EXP-002",
    cliente: "Ana Martínez Ruiz",
    telefono: "664-123-4567",
    email: "ana.martinez@email.com",
    folio: "EXP-2024-002",
    observaciones: "Cliente preferencial, proceso expedito",
    estado: "Completado",
    progreso: 100,
    fechaCreacion: "2024-01-10",
    ultimaActividad: "2024-01-18",
    notarioAsignado: "Dr. Roberto Notario",
    fechaVencimiento: "2024-01-25",
    prioridad: "baja",
    documentos: 6,
    totalDocumentos: 6,
    costos: {
      total: 2500,
      pagado: 2500,
      pendiente: 0,
    },
    tramites: [
      {
        id: "TRM-001",
        tipo: "Compraventa",
        formato: {
          id: "compraventa-testamento",
          nombre: "Formato Testamento (Personalizado)",
          archivo: "FORMATO-TESTAMENTO-2019.pdf"
        },
        estado: "Completado",
        progreso: 100,
        fechaInicio: "2024-01-10",
        fechaFin: "2024-01-18",
        documentos: 6,
        costos: {
          total: 2500,
          pagado: 2500,
          pendiente: 0,
        },
        cita: {
          fecha: "2024-01-18",
          hora: "14:00",
          notario: "Dr. Roberto Notario",
          estado: "Completada",
        },
      }
    ],
  },
  {
    id: "EXP-007",
    cliente: "María González López",
    telefono: "664-987-6543",
    email: "maria.gonzalez@email.com",
    folio: "EXP-2024-007",
    observaciones: "Testamento simple, cliente de edad avanzada",
    estado: "Completado",
    progreso: 100,
    fechaCreacion: "2024-01-05",
    ultimaActividad: "2024-01-12",
    notarioAsignado: "Lic. Ana García",
    fechaVencimiento: "2024-01-15",
    prioridad: "baja",
    documentos: 4,
    totalDocumentos: 4,
    costos: {
      total: 1800,
      pagado: 1800,
      pendiente: 0,
    },
    tramites: [
      {
        id: "TRM-007",
        tipo: "Testamento",
        formato: {
          id: "testamento-simple",
          nombre: "Formato Testamento Simple",
          archivo: "FORMATO-TESTAMENTO-2019.pdf"
        },
        estado: "Completado",
        progreso: 100,
        fechaInicio: "2024-01-05",
        fechaFin: "2024-01-12",
        documentos: 4,
        costos: {
          total: 1800,
          pagado: 1800,
          pendiente: 0,
        },
        cita: {
          fecha: "2024-01-12",
          hora: "10:30",
          notario: "Lic. Ana García",
          estado: "Completada",
        },
      }
    ],
  },
  {
    id: "EXP-008",
    cliente: "Carlos Mendoza Torres",
    telefono: "664-555-1234",
    email: "carlos.mendoza@email.com",
    folio: "EXP-2024-008",
    observaciones: "Poder notarial para representación legal",
    estado: "Completado",
    progreso: 100,
    fechaCreacion: "2024-01-02",
    ultimaActividad: "2024-01-08",
    notarioAsignado: "Lic. Carlos Mendoza",
    fechaVencimiento: "2024-01-10",
    prioridad: "media",
    documentos: 3,
    totalDocumentos: 3,
    costos: {
      total: 1200,
      pagado: 1200,
      pendiente: 0,
    },
    tramites: [
      {
        id: "TRM-008",
        tipo: "Poder",
        formato: {
          id: "poder-general",
          nombre: "Formato Poder General",
          archivo: "compraventa.pdf"
        },
        estado: "Completado",
        progreso: 100,
        fechaInicio: "2024-01-02",
        fechaFin: "2024-01-08",
        documentos: 3,
        costos: {
          total: 1200,
          pagado: 1200,
          pendiente: 0,
        },
        cita: {
          fecha: "2024-01-08",
          hora: "16:00",
          notario: "Lic. Carlos Mendoza",
          estado: "Completada",
        },
      }
    ],
  },
  {
    id: "EXP-006",
    cliente: "Elena Morales Castro",
    telefono: "664-444-5555",
    email: "elena.morales@email.com",
    folio: "EXP-2024-006",
    observaciones: "Testamento simple, cliente de edad avanzada",
    estado: "Pendiente",
    progreso: 10,
    fechaCreacion: "2024-01-25",
    ultimaActividad: "2024-01-25",
    notarioAsignado: null,
    fechaVencimiento: "2024-02-20",
    prioridad: "media",
    documentos: 0,
    totalDocumentos: 4,
    costos: {
      total: 1200,
      pagado: 0,
      pendiente: 1200,
    },
    tramites: [
      {
        id: "TRM-006",
        tipo: "Testamento",
        formato: {
          id: "testamento-simple",
          nombre: "Formato Testamento Simple",
          archivo: "FORMATO-TESTAMENTO-2019.pdf"
        },
        estado: "Pendiente",
        progreso: 10,
        fechaInicio: "2024-01-25",
        fechaFin: null,
        documentos: 0,
        costos: {
          total: 1200,
          pagado: 0,
          pendiente: 1200,
        },
        cita: null,
      }
    ],
  },
  {
    id: "EXP-001",
    cliente: "Juan Pérez García",
    telefono: "664-987-6543",
    email: "juan.perez@email.com",
    folio: "EXP-2024-001",
    observaciones: "Testamento complejo con múltiples beneficiarios",
    estado: "En revisión",
    progreso: 75,
    fechaCreacion: "2024-01-15",
    ultimaActividad: "2024-01-20",
    notarioAsignado: "Lic. Ana García",
    fechaVencimiento: "2024-01-28",
    prioridad: "urgente",
    documentos: 8,
    totalDocumentos: 10,
    costos: {
      total: 3300,
      pagado: 3300,
      pendiente: 0,
    },
    tramites: [
      {
        id: "TRM-002",
        tipo: "Testamento",
        formato: {
          id: "testamento-estandar",
          nombre: "Testamento Estándar",
          archivo: "FORMATO-TESTAMENTO-2019.pdf"
        },
        estado: "En revisión",
        progreso: 75,
        fechaInicio: "2024-01-15",
        fechaFin: null,
        documentos: 8,
        costos: {
          total: 3300,
          pagado: 3300,
          pendiente: 0,
        },
        cita: {
          fecha: "2024-01-25",
          hora: "10:00",
          notario: "Dr. Roberto Notario",
          estado: "Programada",
        },
      }
    ],
  },
  {
    id: "EXP-003",
    cliente: "Roberto Silva",
    telefono: "664-555-1234",
    email: "roberto.silva@email.com",
    folio: "EXP-2024-003",
    observaciones: "Poder general para gestión de propiedades",
    estado: "Pendiente",
    progreso: 45,
    fechaCreacion: "2024-01-22",
    ultimaActividad: "2024-01-22",
    notarioAsignado: null,
    fechaVencimiento: "2024-01-30",
    prioridad: "urgente",
    documentos: 2,
    totalDocumentos: 4,
    costos: {
      total: 1200,
      pagado: 600,
      pendiente: 600,
    },
    tramites: [
      {
        id: "TRM-003",
        tipo: "Poder",
        formato: {
          id: "poder-estandar",
          nombre: "Poder Estándar",
          archivo: "FORMATO-TESTAMENTO-2019.pdf"
        },
        estado: "Pendiente",
        progreso: 45,
        fechaInicio: "2024-01-22",
        fechaFin: null,
        documentos: 2,
        costos: {
          total: 1200,
          pagado: 600,
          pendiente: 600,
        },
        cita: {
          fecha: "2024-01-28",
          hora: "11:00",
          notario: "Lic. Ana García",
          estado: "Pendiente",
        },
      }
    ],
  },
  {
    id: "EXP-004",
    cliente: "María González",
    telefono: "664-777-8888",
    email: "maria.gonzalez@email.com",
    folio: "EXP-2024-004",
    observaciones: "Donación de inmueble familiar",
    estado: "En revisión",
    progreso: 60,
    fechaCreacion: "2024-01-20",
    ultimaActividad: "2024-01-23",
    notarioAsignado: "Dr. Roberto Notario",
    fechaVencimiento: "2024-01-29",
    prioridad: "urgente",
    documentos: 5,
    totalDocumentos: 8,
    costos: {
      total: 1800,
      pagado: 1800,
      pendiente: 0,
    },
    tramites: [
      {
        id: "TRM-004",
        tipo: "Donación",
        formato: {
          id: "donacion-estandar",
          nombre: "Donación Estándar",
          archivo: "FORMATO-TESTAMENTO-2019.pdf"
        },
        estado: "En revisión",
        progreso: 60,
        fechaInicio: "2024-01-20",
        fechaFin: null,
        documentos: 5,
        costos: {
          total: 1800,
          pagado: 1800,
          pendiente: 0,
        },
        cita: {
          fecha: "2024-01-26",
          hora: "15:00",
          notario: "Dr. Roberto Notario",
          estado: "Programada",
        },
      }
    ],
  },
  {
    id: "EXP-005",
    cliente: "Carlos López",
    telefono: "664-999-0000",
    email: "carlos.lopez@email.com",
    folio: "EXP-2024-005",
    observaciones: "Fideicomiso empresarial complejo",
    estado: "Pendiente",
    progreso: 30,
    fechaCreacion: "2024-01-24",
    ultimaActividad: "2024-01-24",
    notarioAsignado: null,
    fechaVencimiento: "2024-03-20",
    prioridad: "baja",
    documentos: 1,
    totalDocumentos: 12,
    costos: {
      total: 5000,
      pagado: 1500,
      pendiente: 3500,
    },
    tramites: [
      {
        id: "TRM-005",
        tipo: "Fideicomiso",
        formato: {
          id: "fideicomiso-estandar",
          nombre: "Fideicomiso Estándar",
          archivo: "FORMATO-TESTAMENTO-2019.pdf"
        },
        estado: "Pendiente",
        progreso: 30,
        fechaInicio: "2024-01-24",
        fechaFin: null,
        documentos: 1,
        costos: {
          total: 5000,
          pagado: 1500,
          pendiente: 3500,
        },
        cita: {
          fecha: "2024-01-30",
          hora: "09:00",
          notario: "Lic. Ana García",
          estado: "Pendiente",
        },
      }
    ],
  },
  {
    id: "EXP-006",
    cliente: "Patricia Herrera",
    telefono: "664-111-2222",
    email: "patricia.herrera@email.com",
    folio: "EXP-2024-006",
    observaciones: "Caso complejo con múltiples trámites para sucesión",
    estado: "En proceso",
    progreso: 65,
    fechaCreacion: "2024-01-12",
    ultimaActividad: "2024-01-25",
    notarioAsignado: "Lic. Ana García",
    fechaVencimiento: "2024-02-10",
    prioridad: "media",
    documentos: 15,
    totalDocumentos: 20,
    costos: {
      total: 7500,
      pagado: 4500,
      pendiente: 3000,
    },
    tramites: [
      {
        id: "TRM-006A",
        tipo: "Testamento",
        formato: {
          id: "testamento-estandar",
          nombre: "Testamento Estándar",
          archivo: "FORMATO-TESTAMENTO-2019.pdf"
        },
        estado: "Completado",
        progreso: 100,
        fechaInicio: "2024-01-12",
        fechaFin: "2024-01-20",
        documentos: 8,
        costos: {
          total: 3000,
          pagado: 3000,
          pendiente: 0,
        },
        cita: {
          fecha: "2024-01-20",
          hora: "14:00",
          notario: "Dr. Roberto Notario",
          estado: "Completada",
        },
      },
      {
        id: "TRM-006B",
        tipo: "Compraventa",
        formato: {
          id: "compraventa-estandar",
          nombre: "Compraventa Estándar",
          archivo: "compraventa.pdf"
        },
        estado: "En revisión",
        progreso: 45,
        fechaInicio: "2024-01-22",
        fechaFin: null,
        documentos: 7,
        costos: {
          total: 4500,
          pagado: 1500,
          pendiente: 3000,
        },
        cita: {
          fecha: "2024-01-30",
          hora: "16:00",
          notario: "Lic. Ana García",
          estado: "Programada",
        },
      }
    ],
  },
];

export default function ExpedientesPage() {
  const router = useRouter();
  const [expedientes, setExpedientes] = useState<any[]>(expedientesMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [filterTramite, setFilterTramite] = useState("todos");
  const [activeTab, setActiveTab] = useState("todos");
  const [expedientesColapsados, setExpedientesColapsados] = useState<Set<string>>(new Set(expedientesMock.map(exp => exp.id)));
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedExpediente, setSelectedExpediente] = useState<any>(null);
  const [isFormatModalOpen, setIsFormatModalOpen] = useState(false);
  const [expedienteParaCambiarFormato, setExpedienteParaCambiarFormato] = useState<any>(null);
  const [isAddTramiteModalOpen, setIsAddTramiteModalOpen] = useState(false);
  const [isProgramarCitaModalOpen, setIsProgramarCitaModalOpen] = useState(false);
  const [isGenerarReporteModalOpen, setIsGenerarReporteModalOpen] = useState(false);
  const [isAsignarNotarioModalOpen, setIsAsignarNotarioModalOpen] = useState(false);
  const [expedienteParaAsignar, setExpedienteParaAsignar] = useState<any>(null);
  const [notarioSeleccionado, setNotarioSeleccionado] = useState("");
  
  // Lista de notarios disponibles
  const notariosDisponibles = [
    { id: "roberto", nombre: "Dr. Roberto Notario", especialidad: "Testamentos y Compraventas" },
    { id: "ana", nombre: "Lic. Ana García", especialidad: "Poderes y Donaciones" },
    { id: "carlos", nombre: "Lic. Carlos Mendoza", especialidad: "Fideicomisos y Sociedades" },
  ];

  // Función para calcular prioridad basada en fecha de vencimiento
  const calcularPrioridad = (expediente: any) => {
    if (expediente.estado === "Completado") {
      return "completado";
    }
    // Usar la prioridad definida en los datos mock
    return expediente.prioridad || "baja";
  };

  const [newExpediente, setNewExpediente] = useState({
    cliente: "",
    tramite: "",
    telefono: "",
    email: "",
  });
  const [newTramite, setNewTramite] = useState({
    tipo: "",
    formato: "",
  });
  const [nuevaCita, setNuevaCita] = useState({
    fecha: "",
    hora: "",
    notario: "",
    sala: "",
  });

  // Filtrar expedientes
  const filteredExpedientes = expedientes.filter((expediente) => {
    const matchesSearch =
      expediente.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expediente.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEstado =
      filterEstado === "todos" || expediente.estado === filterEstado;
    const matchesTramite =
      filterTramite === "todos" || 
      expediente.tramites?.some((tramite: any) => tramite.tipo === filterTramite);

    return matchesSearch && matchesEstado && matchesTramite;
  });

  // Calcular prioridad para cada expediente y agrupar
  const expedientesConPrioridad = filteredExpedientes.map(expediente => ({
    ...expediente,
    prioridadCalculada: calcularPrioridad(expediente)
  }));

  // Agrupar por prioridad
  const expedientesPorPrioridad = {
    todos: expedientesConPrioridad
      .filter(exp => exp.prioridadCalculada !== "completado")
      .sort((a, b) => {
        const prioridadOrder = { urgente: 1, media: 2, baja: 3 };
        return prioridadOrder[a.prioridadCalculada as keyof typeof prioridadOrder] - 
               prioridadOrder[b.prioridadCalculada as keyof typeof prioridadOrder];
      }),
    urgente: expedientesConPrioridad.filter(exp => exp.prioridadCalculada === "urgente"),
    media: expedientesConPrioridad.filter(exp => exp.prioridadCalculada === "media"),
    baja: expedientesConPrioridad.filter(exp => exp.prioridadCalculada === "baja"),
    completado: expedientesConPrioridad.filter(exp => exp.prioridadCalculada === "completado"),
  };

  // Agrupar por estado para tabs (mantener compatibilidad)
  const expedientesPorEstado = {
    todos: filteredExpedientes,
    pendientes: expedientes.filter((e) => e.estado === "Pendiente"),
    enRevision: expedientes.filter((e) => e.estado === "En revisión"),
    completados: expedientes.filter((e) => e.estado === "Completado"),
  };

  const handleVerExpediente = (expediente: any) => {
    // Navegar a la página de detalle del expediente
    router.push(`/admin/expedientes/${expediente.id}`);
  };

  const handleEliminarExpediente = (expediente: any) => {
    setSelectedExpediente(expediente);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedExpediente) {
      setExpedientes((prev: any[]) =>
        prev.filter((e) => e.id !== selectedExpediente.id)
      );
      setIsDeleteModalOpen(false);
      setSelectedExpediente(null);
    }
  };

  const handleCreateExpediente = () => {
    if (newExpediente.cliente && newExpediente.tramite) {
      // Obtener formato por defecto para el trámite
      const formatoDefault = formatosDisponibles[newExpediente.tramite as keyof typeof formatosDisponibles]?.[0] || {
        id: "sin-formato",
        nombre: "Sin formato",
        archivo: ""
      };

      const nuevoExpediente = {
        id: `EXP-${String(expedientes.length + 1).padStart(3, "0")}`,
        cliente: newExpediente.cliente,
        telefono: newExpediente.telefono || "",
        email: newExpediente.email || "",
        folio: `EXP-2024-${String(expedientes.length + 1).padStart(3, "0")}`,
        observaciones: "",
        estado: "Pendiente",
        progreso: 0,
        fechaCreacion: new Date().toISOString().split("T")[0],
        ultimaActividad: new Date().toISOString().split("T")[0],
        documentos: 0,
        totalDocumentos: 8,
        costos: {
          total: 0,
          pagado: 0,
          pendiente: 0,
        },
        tramites: [
          {
            id: `TRM-${String(expedientes.length + 1).padStart(3, "0")}`,
            tipo: newExpediente.tramite,
            formato: formatoDefault,
            estado: "Pendiente",
            progreso: 0,
            fechaInicio: new Date().toISOString().split("T")[0],
            fechaFin: null,
            documentos: 0,
            costos: {
              total: 0,
              pagado: 0,
              pendiente: 0,
            },
            cita: {
              fecha: "",
              hora: "",
              notario: "",
              estado: "Sin programar",
            },
          }
        ],
      };

      setExpedientes((prev: any[]) => [nuevoExpediente, ...prev]);
      setNewExpediente({ cliente: "", tramite: "", telefono: "", email: "" });
      setIsCreateModalOpen(false);
    }
  };

  const handleArchivar = (expediente: any) => {
    if (confirm(`¿Estás seguro de que quieres archivar el expediente ${expediente.folio}?`)) {
      setExpedientes((prev: any[]) =>
      prev.map((e) =>
        e.id === expediente.id ? { ...e, estado: "Archivado" } : e
      )
    );
      console.log('Expediente archivado:', expediente.id);
    }
  };

  const tramitesDisponibles = [
    "Testamento",
    "Compraventa",
    "Poder",
    "Donación",
    "Fideicomiso",
    "Sociedad",
    "Hipoteca",
    "Permuta",
    "Adjudicación",
    "Otro",
  ];

  // Formatos disponibles por trámite (usando solo archivos que existen)
  const formatosDisponibles = {
    "Testamento": [
      { id: "testamento-estandar", nombre: "Testamento Estándar", archivo: "FORMATO-TESTAMENTO-2019.pdf", descripcion: "Formato estándar para testamentos públicos" },
      { id: "testamento-personalizado", nombre: "Formato Testamento 2019", archivo: "FORMATO-TESTAMENTO-2019.pdf", descripcion: "Formato personalizado actualizado 2019" }
    ],
    "Compraventa": [
      { id: "compraventa-estandar", nombre: "Compraventa Estándar", archivo: "compraventa.pdf", descripcion: "Formato estándar para compraventas" },
      { id: "compraventa-testamento", nombre: "Formato Testamento (Personalizado)", archivo: "FORMATO-TESTAMENTO-2019.pdf", descripcion: "Formato personalizado basado en testamento" }
    ],
    "Poder": [
      { id: "poder-estandar", nombre: "Poder Estándar", archivo: "FORMATO-TESTAMENTO-2019.pdf", descripcion: "Formato estándar para poderes notariales" },
      { id: "poder-general", nombre: "Poder General", archivo: "compraventa.pdf", descripcion: "Poder general para pleitos y cobranzas" }
    ],
    "Donación": [
      { id: "donacion-estandar", nombre: "Donación Estándar", archivo: "FORMATO-TESTAMENTO-2019.pdf", descripcion: "Formato estándar para donaciones" },
      { id: "donacion-inmueble", nombre: "Donación de Inmueble", archivo: "compraventa.pdf", descripcion: "Formato específico para donación de inmuebles" }
    ],
    "Fideicomiso": [
      { id: "fideicomiso-estandar", nombre: "Fideicomiso Estándar", archivo: "FORMATO-TESTAMENTO-2019.pdf", descripcion: "Formato estándar para fideicomisos" }
    ],
    "Sociedad": [
      { id: "sociedad-estandar", nombre: "Sociedad Estándar", archivo: "FORMATO-TESTAMENTO-2019.pdf", descripcion: "Formato estándar para constituciones de sociedad" }
    ],
    "Hipoteca": [
      { id: "hipoteca-estandar", nombre: "Hipoteca Estándar", archivo: "compraventa.pdf", descripcion: "Formato estándar para hipotecas" }
    ],
    "Permuta": [
      { id: "permuta-estandar", nombre: "Permuta Estándar", archivo: "compraventa.pdf", descripcion: "Formato estándar para permutas" }
    ],
    "Adjudicación": [
      { id: "adjudicacion-estandar", nombre: "Adjudicación Estándar", archivo: "FORMATO-TESTAMENTO-2019.pdf", descripcion: "Formato estándar para adjudicaciones" }
    ]
  };

  const handleCambiarFormato = (expediente: any) => {
    setExpedienteParaCambiarFormato(expediente);
    setIsFormatModalOpen(true);
  };

  const handleConfirmarCambioFormato = (nuevoFormato: any) => {
    if (expedienteParaCambiarFormato) {
      setExpedientes((prev: any[]) =>
        prev.map((e) =>
          e.id === expedienteParaCambiarFormato.id
            ? { ...e, formato: nuevoFormato }
            : e
        )
      );
      setIsFormatModalOpen(false);
      setExpedienteParaCambiarFormato(null);
    }
  };

  const handleVisualizarDocumento = (archivo: string) => {
    try {
      const url = `/documentos_legales/${archivo}`;
      const newWindow = window.open(url, '_blank');
      
      // Verificar si la ventana se abrió correctamente
      if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
        // Si no se pudo abrir, usar documento de respaldo
        window.open('/documentos_legales/documento-generico.pdf', '_blank');
      }
    } catch (error) {
      console.error('Error al abrir el documento:', error);
      // Fallback: mostrar documento genérico si hay error
      window.open('/documentos_legales/documento-generico.pdf', '_blank');
    }
  };

  const handleAgregarTramite = (expediente: any) => {
    setSelectedExpediente(expediente);
    setNewTramite({ tipo: "", formato: "" });
    setIsAddTramiteModalOpen(true);
  };

  const handleProgramarCita = (expediente: any) => {
    setSelectedExpediente(expediente);
    setNuevaCita({ fecha: "", hora: "", notario: "", sala: "" });
    setIsProgramarCitaModalOpen(true);
  };

  const handleDesactivarExpediente = (expediente: any) => {
    setExpedientes((prev) =>
      prev.map((e) =>
        e.id === expediente.id 
          ? { ...e, estado: "Desactivado", activo: false } 
          : e
      )
    );
    console.log('Expediente desactivado:', expediente.id);
  };

  const toggleExpedienteColapso = (expedienteId: string) => {
    console.log('Toggle colapso para expediente:', expedienteId);
    setExpedientesColapsados((prev) => {
      const nuevoSet = new Set(prev);
      if (nuevoSet.has(expedienteId)) {
        nuevoSet.delete(expedienteId);
        console.log('Expediente expandido:', expedienteId);
      } else {
        nuevoSet.add(expedienteId);
        console.log('Expediente colapsado:', expedienteId);
      }
      return nuevoSet;
    });
  };

  const handleGenerarReporte = (expediente: any) => {
    setSelectedExpediente(expediente);
    setIsGenerarReporteModalOpen(true);
  };

  const handleConfirmarAgregarTramite = () => {
    if (selectedExpediente && newTramite.tipo && newTramite.formato) {
      const nuevoTramite = {
        id: `TRM-${Date.now()}`,
        tipo: newTramite.tipo,
        formato: {
          id: newTramite.formato,
          nombre: formatosDisponibles[newTramite.tipo as keyof typeof formatosDisponibles]?.find(f => f.id === newTramite.formato)?.nombre || "Formato Estándar",
          archivo: formatosDisponibles[newTramite.tipo as keyof typeof formatosDisponibles]?.find(f => f.id === newTramite.formato)?.archivo || "FORMATO-TESTAMENTO-2019.pdf"
        },
        estado: "Pendiente",
        progreso: 0,
        fechaInicio: new Date().toISOString().split("T")[0],
        fechaFin: null,
        documentos: 0,
        costos: {
          total: 0,
          pagado: 0,
          pendiente: 0,
        },
        cita: {
          fecha: "",
          hora: "",
          notario: "",
          estado: "Sin programar",
        },
      };

      setExpedientes((prev: any[]) =>
        prev.map((e) =>
          e.id === selectedExpediente.id
            ? { ...e, tramites: [...(e.tramites || []), nuevoTramite] }
            : e
        )
      );

      setNewTramite({ tipo: "", formato: "" });
      setIsAddTramiteModalOpen(false);
      setSelectedExpediente(null);
    }
  };

  const handleConfirmarProgramarCita = () => {
    if (selectedExpediente && nuevaCita.fecha && nuevaCita.hora && nuevaCita.notario) {
      setExpedientes((prev: any[]) =>
        prev.map((e) =>
          e.id === selectedExpediente.id
            ? {
                ...e,
                tramites: e.tramites?.map((t: any) => ({
                  ...t,
                  cita: {
                    ...t.cita,
                    fecha: nuevaCita.fecha,
                    hora: nuevaCita.hora,
                    notario: nuevaCita.notario,
                    sala: nuevaCita.sala,
                    estado: "Programada",
                  },
                })),
              }
            : e
        )
      );

      setNuevaCita({ fecha: "", hora: "", notario: "", sala: "" });
      setIsProgramarCitaModalOpen(false);
      setSelectedExpediente(null);
    }
  };

  const handleConfirmarGenerarReporte = (tipoReporte: string) => {
    if (selectedExpediente) {
      // Simular generación de reporte
      const reporteData = {
        expediente: selectedExpediente,
        tipo: tipoReporte,
        fecha: new Date().toISOString(),
      };
      
      console.log('Generando reporte:', reporteData);
      
      // Simular descarga de PDF
      const element = document.createElement("a");
      const file = new Blob(
        [
          `REPORTE DE EXPEDIENTE\n\n` +
          `Expediente: ${selectedExpediente.folio}\n` +
          `Cliente: ${selectedExpediente.cliente}\n` +
          `Estado: ${selectedExpediente.estado}\n` +
          `Progreso: ${selectedExpediente.progreso}%\n` +
          `Trámites: ${selectedExpediente.tramites?.length || 0}\n` +
          `Documentos: ${selectedExpediente.documentos}/${selectedExpediente.totalDocumentos}\n` +
          `Fecha de creación: ${selectedExpediente.fechaCreacion}\n` +
          `Última actividad: ${selectedExpediente.ultimaActividad}\n\n` +
          `Tipo de reporte: ${tipoReporte}\n` +
          `Generado el: ${new Date().toLocaleDateString("es-MX")}`,
        ],
        { type: "text/plain" }
      );
      element.href = URL.createObjectURL(file);
      element.download = `reporte_${selectedExpediente.folio}_${tipoReporte.toLowerCase()}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      setIsGenerarReporteModalOpen(false);
      setSelectedExpediente(null);
    }
  };

  const handleAsignarNotario = (expediente: any) => {
    setExpedienteParaAsignar(expediente);
    setNotarioSeleccionado(expediente.notarioAsignado || "");
    setIsAsignarNotarioModalOpen(true);
  };

  const handleConfirmarAsignacionNotario = () => {
    if (expedienteParaAsignar && notarioSeleccionado) {
      setExpedientes((prev: any[]) =>
        prev.map((exp: any) =>
          exp.id === expedienteParaAsignar.id
            ? { ...exp, notarioAsignado: notariosDisponibles.find(n => n.id === notarioSeleccionado)?.nombre || null }
            : exp
        )
      );
      setIsAsignarNotarioModalOpen(false);
      setExpedienteParaAsignar(null);
      setNotarioSeleccionado("");
    }
  };

  // Funciones para colores y estilos de prioridad
  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "urgente":
        return "bg-red-100 text-red-800 border-red-200";
      case "media":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "baja":
        return "bg-green-100 text-green-800 border-green-200";
      case "completado":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPrioridadIcon = (prioridad: string) => {
    switch (prioridad) {
      case "urgente":
        return <AlertTriangle className="h-4 w-4" />;
      case "media":
        return <Clock className="h-4 w-4" />;
      case "baja":
        return <CheckCircle className="h-4 w-4" />;
      case "completado":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getPrioridadText = (prioridad: string) => {
    switch (prioridad) {
      case "urgente":
        return "Alta Prioridad";
      case "media":
        return "Prioridad Media";
      case "baja":
        return "Baja Prioridad";
      case "completado":
        return "Finalizado";
      default:
        return "Sin Clasificar";
    }
  };

  const getCardBackgroundColor = (prioridad: string) => {
    switch (prioridad) {
      case "urgente":
        return "bg-red-50 border-red-200 hover:bg-red-100";
      case "media":
        return "bg-yellow-50 border-yellow-200 hover:bg-yellow-100";
      case "baja":
        return "bg-green-50 border-green-200 hover:bg-green-100";
      case "completado":
        return "bg-blue-50 border-blue-200 hover:bg-blue-100";
      default:
        return "bg-gray-50 border-gray-200 hover:bg-gray-100";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Expedientes
          </h1>
          <p className="text-gray-600">
            Administra todos los expedientes notariales
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => router.push("/admin")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al Dashboard</span>
          </Button>
          <Button
            onClick={() => router.push("/admin/expedientes/nuevo")}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Expediente</span>
          </Button>
        </div>
      </div>


      {/* Filtros y Búsqueda integrados */}
      <div className="bg-gray-50 rounded-lg p-4 border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por cliente o ID de expediente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-40 bg-white">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="En revisión">En revisión</SelectItem>
                  <SelectItem value="Completado">Completado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterTramite} onValueChange={setFilterTramite}>
              <SelectTrigger className="w-40 bg-white">
                  <SelectValue placeholder="Trámite" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los trámites</SelectItem>
                {tramitesDisponibles.map((tramite: any) => (
                    <SelectItem key={tramite} value={tramite}>
                      {tramite}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
      </div>

      {/* Tabs de Estados */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="todos" className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-600" />
            Todos ({expedientesConPrioridad.filter(exp => exp.prioridadCalculada !== "completado").length})
          </TabsTrigger>
          <TabsTrigger value="urgente" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            Alta Prioridad ({expedientesPorPrioridad.urgente.length})
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-yellow-600" />
            Prioridad Media ({expedientesPorPrioridad.media.length})
          </TabsTrigger>
          <TabsTrigger value="baja" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            Baja Prioridad ({expedientesPorPrioridad.baja.length})
          </TabsTrigger>
          <TabsTrigger value="completado" className="flex items-center gap-2">
            <Archive className="h-4 w-4 text-blue-600" />
            Archivo ({expedientesPorPrioridad.completado.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {(activeTab === "todos" 
              ? expedientesPorPrioridad.todos 
              : activeTab === "completado"
              ? expedientesPorPrioridad.completado
              : expedientesPorPrioridad[activeTab as keyof typeof expedientesPorPrioridad]
            ).map((expediente, index) => (
              <Card
                key={expediente.id}
                className={`hover:shadow-lg transition-all duration-200 ${getCardBackgroundColor(expediente.prioridadCalculada)}`}
              >
                <CardContent className="p-0">
                  {/* Header clickeable */}
                  <div 
                    className="p-6 cursor-pointer hover:bg-opacity-80 transition-colors select-none"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleExpedienteColapso(expediente.id);
                    }}
                  >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 rounded-full text-sm font-bold">
                            {index + 1}
                          </div>
                        <h3 className="text-lg font-semibold">
                          {expediente.cliente}
                        </h3>
                          <Badge
                            className={`${getPrioridadColor(expediente.prioridadCalculada)} flex items-center gap-1`}
                          >
                            {getPrioridadIcon(expediente.prioridadCalculada)}
                            {getPrioridadText(expediente.prioridadCalculada)}
                          </Badge>
                        <Badge
                          variant={
                            expediente.estado === "Completado"
                              ? "default"
                              : expediente.estado === "En revisión"
                              ? "secondary"
                              : expediente.estado === "Archivado"
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {expediente.estado}
                        </Badge>
                          <div className="flex flex-wrap gap-1">
                            {expediente.tramites?.map((tramite: any, index: any) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tramite.tipo}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Botón de colapso */}
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpedienteColapso(expediente.id);
                          }}
                        >
                          {expedientesColapsados.has(expediente.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronUp className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Contenido colapsable */}
                  {!expedientesColapsados.has(expediente.id) && (
                    <div className="px-6 pb-6 border-t">
                      <div className="pt-4">

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">ID Expediente</p>
                          <p className="font-medium">{expediente.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Progreso</p>
                          <div className="flex items-center space-x-2">
                            <Progress
                              value={expediente.progreso}
                              className="w-20 h-2"
                            />
                            <span className="text-sm font-medium">
                              {expediente.progreso}%
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Notario Asignado</p>
                          <p className="font-medium text-sm">
                            {expediente.notarioAsignado ? (
                              <span className="text-green-600">{expediente.notarioAsignado}</span>
                            ) : (
                              <span className="text-red-500">Sin asignar</span>
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Fecha Vencimiento</p>
                          <p className="font-medium text-sm">
                            {expediente.fechaVencimiento ? (
                              <span className={
                                expediente.prioridadCalculada === "urgente" 
                                  ? "text-red-600 font-semibold" 
                                  : expediente.prioridadCalculada === "media"
                                  ? "text-yellow-600 font-semibold"
                                  : "text-gray-600"
                              }>
                                {expediente.fechaVencimiento}
                              </span>
                            ) : (
                              <span className="text-gray-400">Sin fecha</span>
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Documentos</p>
                          <p className="font-medium">
                            {expediente.documentos}/{expediente.totalDocumentos}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Trámites</p>
                          <p className="font-medium text-sm">
                            {expediente.tramites?.length || 0} trámite(s)
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Costo Total</p>
                          <p className="font-medium">
                            ${expediente.costos.total.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <span>Creación: {expediente.fechaCreacion}</span>
                          <span>
                            Última actividad: {expediente.ultimaActividad}
                          </span>
                        </div>
                        {expediente.tramites?.some((t: any) => t.cita?.fecha) && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Próxima cita: {expediente.tramites?.find((t: any) => t.cita?.fecha)?.cita?.fecha} {expediente.tramites?.find((t: any) => t.cita?.fecha)?.cita?.hora}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Sección de Trámites */}
                      {expediente.tramites && expediente.tramites.length > 0 && (
                        <div className="mt-4 border-t pt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-3">Trámites del Expediente</h4>
                          <div className="space-y-3">
                            {expediente.tramites.map((tramite: any, index: any) => (
                              <div key={index} className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                    <span className="font-medium text-sm">{tramite.tipo}</span>
                                    <Badge 
                                      variant={tramite.estado === "Completado" ? "default" : 
                                              tramite.estado === "En revisión" ? "secondary" : "outline"}
                                      className="text-xs"
                                    >
                                      {tramite.estado}
                                    </Badge>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {tramite.progreso}%
                      </div>
                    </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600">
                                  <div>
                                    <span className="font-medium">Formato:</span> {tramite.formato?.nombre}
                                  </div>
                                  <div>
                                    <span className="font-medium">Documentos:</span> {tramite.documentos}
                                  </div>
                                  <div>
                                    <span className="font-medium">Costo:</span> ${tramite.costos.total.toLocaleString()}
                                  </div>
                                  <div>
                                    <span className="font-medium">Inicio:</span> {tramite.fechaInicio}
                                  </div>
                                </div>

                                {tramite.cita && (
                                  <div className="mt-2 flex items-center gap-1 text-xs text-gray-600">
                                    <Calendar className="h-3 w-3" />
                                    <span>Cita: {tramite.cita.fecha} {tramite.cita.hora}</span>
                                    <Badge variant="outline" className="text-xs ml-2">
                                      {tramite.cita.estado}
                                    </Badge>
                                  </div>
                                )}

                                {tramite.formato?.archivo && (
                                  <div className="mt-2">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleVisualizarDocumento(tramite.formato.archivo)}
                                      className="h-6 text-xs"
                                    >
                                      <Eye className="h-3 w-3 mr-1" />
                                      Ver Documento
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                        </div>

                        <div className="flex items-center space-x-2 mt-4">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleVerExpediente(expediente)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ver detalles del expediente</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAsignarNotario(expediente)}
                            >
                              <Users className="h-4 w-4 mr-1" />
                              {expediente.notarioAsignado ? "Cambiar Notario" : "Asignar Notario"}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{expediente.notarioAsignado ? "Cambiar notario asignado" : "Asignar notario al expediente"}</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAgregarTramite(expediente)}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Agregar Trámite
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Agregar nuevo trámite al expediente</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleProgramarCita(expediente)}
                            >
                              <Calendar className="h-4 w-4 mr-1" />
                              Programar Cita
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Programar cita para el expediente</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleGenerarReporte(expediente)}
                            >
                              <BarChart3 className="h-4 w-4 mr-1" />
                              Reporte
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Generar reporte del expediente</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleArchivar(expediente)}
                      >
                        <Archive className="h-4 w-4 mr-1" />
                        Archivar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDesactivarExpediente(expediente)}
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Desactivar
                      </Button>
                    </div>
                  </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {(activeTab === "todos" 
              ? expedientesPorPrioridad.todos 
              : activeTab === "completado"
              ? expedientesPorPrioridad.completado
              : expedientesPorPrioridad[activeTab as keyof typeof expedientesPorPrioridad]
            ).length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  {activeTab === "completado" ? (
                    <Archive className="h-12 w-12 mx-auto text-blue-400 mb-4" />
                  ) : (
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {activeTab === "completado" ? "Archivo vacío" : "No hay expedientes"}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {activeTab === "todos"
                      ? "No se encontraron expedientes con los filtros aplicados"
                      : activeTab === "completado"
                      ? "No hay expedientes completados en el archivo"
                      : `No hay expedientes en estado "${activeTab}"`}
                  </p>
                  {activeTab !== "completado" && (
                  <Button
                    onClick={() => router.push("/admin/expedientes/nuevo")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primer Expediente
                  </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal para Crear Expediente Rápido */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crear Expediente Rápido</DialogTitle>
            <DialogDescription>
              Crea un expediente básico que podrás completar después
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cliente">Cliente</Label>
              <Input
                id="cliente"
                value={newExpediente.cliente}
                onChange={(e) =>
                  setNewExpediente((prev) => ({
                    ...prev,
                    cliente: e.target.value,
                  }))
                }
                placeholder="Nombre del cliente"
              />
            </div>
            <div>
              <Label htmlFor="tramite">Trámite</Label>
              <Select
                value={newExpediente.tramite}
                onValueChange={(value) =>
                  setNewExpediente((prev) => ({ ...prev, tramite: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un trámite" />
                </SelectTrigger>
                <SelectContent>
                  {tramitesDisponibles.map((tramite: any) => (
                    <SelectItem key={tramite} value={tramite}>
                      {tramite}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="telefono">Teléfono (opcional)</Label>
              <Input
                id="telefono"
                value={newExpediente.telefono}
                onChange={(e) =>
                  setNewExpediente((prev) => ({
                    ...prev,
                    telefono: e.target.value,
                  }))
                }
                placeholder="Teléfono de contacto"
              />
            </div>
            <div>
              <Label htmlFor="email">Email (opcional)</Label>
              <Input
                id="email"
                type="email"
                value={newExpediente.email}
                onChange={(e) =>
                  setNewExpediente((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                placeholder="Correo electrónico"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreateExpediente}>Crear Expediente</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Confirmar Eliminación */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar este expediente? Esta acción
              no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          {selectedExpediente && (
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="font-medium text-red-900">
                Expediente: {selectedExpediente.id}
              </p>
              <p className="text-red-700">
                Cliente: {selectedExpediente.cliente}
              </p>
              <p className="text-red-700">
                Trámite: {selectedExpediente.tramite}
              </p>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Eliminar Expediente
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Cambiar Formato */}
      <Dialog open={isFormatModalOpen} onOpenChange={setIsFormatModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cambiar Formato</DialogTitle>
            <DialogDescription>
              Selecciona un nuevo formato para este expediente.
            </DialogDescription>
          </DialogHeader>
          {expedienteParaCambiarFormato && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">
                  {expedienteParaCambiarFormato.cliente}
                </h4>
                <p className="text-sm text-blue-700">
                  {expedienteParaCambiarFormato.tramite} - {expedienteParaCambiarFormato.id}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Formato actual: {expedienteParaCambiarFormato.formato?.nombre || "Sin formato"}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Nuevo Formato</Label>
                <Select onValueChange={(value) => {
                  const formato = formatosDisponibles[expedienteParaCambiarFormato.tramite as keyof typeof formatosDisponibles]
                    ?.find(f => f.id === value);
                  if (formato) {
                    handleConfirmarCambioFormato(formato);
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un formato" />
                  </SelectTrigger>
                  <SelectContent>
                    {formatosDisponibles[expedienteParaCambiarFormato.tramite as keyof typeof formatosDisponibles]?.map((formato) => (
                      <SelectItem key={formato.id} value={formato.id}>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <div>
                              <div className="font-medium">{formato.nombre}</div>
                              <div className="text-xs text-gray-500">{formato.descripcion}</div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVisualizarDocumento(formato.archivo);
                            }}
                            className="ml-2 h-6 w-6 p-0"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsFormatModalOpen(false)}
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Agregar Trámite */}
      <Dialog open={isAddTramiteModalOpen} onOpenChange={setIsAddTramiteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Trámite</DialogTitle>
            <DialogDescription>
              Agrega un nuevo trámite al expediente {selectedExpediente?.folio}.
            </DialogDescription>
          </DialogHeader>
          {selectedExpediente && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">
                  {selectedExpediente.cliente}
                </h4>
                <p className="text-sm text-blue-700">
                  {selectedExpediente.folio}
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Tipo de Trámite</Label>
                  <Select onValueChange={(value) => setNewTramite(prev => ({ ...prev, tipo: value, formato: "" }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo de trámite" />
                    </SelectTrigger>
                    <SelectContent>
                      {tramitesDisponibles.map((tramite: any) => (
                        <SelectItem key={tramite} value={tramite}>
                          {tramite}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {newTramite.tipo && (
                  <div>
                    <Label>Formato</Label>
                    <Select onValueChange={(value) => setNewTramite(prev => ({ ...prev, formato: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el formato" />
                      </SelectTrigger>
                      <SelectContent>
                        {formatosDisponibles[newTramite.tipo as keyof typeof formatosDisponibles]?.map((formato) => (
                          <SelectItem key={formato.id} value={formato.id}>
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span>{formato.nombre}</span>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleVisualizarDocumento(formato.archivo);
                                }}
                                className="ml-2 h-6 w-6 p-0"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsAddTramiteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmarAgregarTramite}
              disabled={!newTramite.tipo || !newTramite.formato}
            >
              Agregar Trámite
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Programar Cita */}
      <Dialog open={isProgramarCitaModalOpen} onOpenChange={setIsProgramarCitaModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Programar Cita</DialogTitle>
            <DialogDescription>
              Programa una cita para el expediente {selectedExpediente?.folio}.
            </DialogDescription>
          </DialogHeader>
          {selectedExpediente && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">
                  {selectedExpediente.cliente}
                </h4>
                <p className="text-sm text-blue-700">
                  {selectedExpediente.folio}
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Fecha</Label>
                  <Input
                    type="date"
                    value={nuevaCita.fecha}
                    onChange={(e) => setNuevaCita(prev => ({ ...prev, fecha: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Hora</Label>
                  <Input
                    type="time"
                    value={nuevaCita.hora}
                    onChange={(e) => setNuevaCita(prev => ({ ...prev, hora: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Notario</Label>
                  <Select onValueChange={(value) => setNuevaCita(prev => ({ ...prev, notario: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el notario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dr. Roberto Notario">Dr. Roberto Notario</SelectItem>
                      <SelectItem value="Lic. Ana García">Lic. Ana García</SelectItem>
                      <SelectItem value="Lic. Carlos Mendoza">Lic. Carlos Mendoza</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Sala</Label>
                  <Select onValueChange={(value) => setNuevaCita(prev => ({ ...prev, sala: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la sala" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sala A">Sala A</SelectItem>
                      <SelectItem value="Sala B">Sala B</SelectItem>
                      <SelectItem value="Sala C">Sala C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsProgramarCitaModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmarProgramarCita}
              disabled={!nuevaCita.fecha || !nuevaCita.hora || !nuevaCita.notario}
            >
              Programar Cita
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Generar Reporte */}
      <Dialog open={isGenerarReporteModalOpen} onOpenChange={setIsGenerarReporteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generar Reporte</DialogTitle>
            <DialogDescription>
              Selecciona el tipo de reporte para el expediente {selectedExpediente?.folio}.
            </DialogDescription>
          </DialogHeader>
          {selectedExpediente && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">
                  {selectedExpediente.cliente}
                </h4>
                <p className="text-sm text-blue-700">
                  {selectedExpediente.folio}
                </p>
              </div>
              
              <div className="space-y-2">
                <Button
                  onClick={() => handleConfirmarGenerarReporte("Resumen General")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Resumen General
                </Button>
                <Button
                  onClick={() => handleConfirmarGenerarReporte("Documentos")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Lista de Documentos
                </Button>
                <Button
                  onClick={() => handleConfirmarGenerarReporte("Costos")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Desglose de Costos
                </Button>
                <Button
                  onClick={() => handleConfirmarGenerarReporte("Historial")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Historial de Actividades
                </Button>
                <Button
                  onClick={() => handleConfirmarGenerarReporte("Completo")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Reporte Completo
                </Button>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setIsGenerarReporteModalOpen(false)}
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Asignar Notario */}
      <Dialog open={isAsignarNotarioModalOpen} onOpenChange={setIsAsignarNotarioModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Asignar Notario</DialogTitle>
            <DialogDescription>
              {expedienteParaAsignar ? (
                <>
                  Asigna un notario al expediente {expedienteParaAsignar.folio}.
                  <br />
                  <span className="font-medium">Cliente: {expedienteParaAsignar.cliente}</span>
                </>
              ) : (
                "Selecciona un notario para el expediente."
              )}
            </DialogDescription>
          </DialogHeader>
          {expedienteParaAsignar && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">
                  {expedienteParaAsignar.cliente}
                </h4>
                <p className="text-sm text-blue-700">
                  {expedienteParaAsignar.folio}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Estado: {expedienteParaAsignar.estado} ({expedienteParaAsignar.progreso}%)
                </p>
              </div>
              
              <div className="space-y-3">
                <Label>Notario Actual</Label>
                <p className="text-sm text-gray-600">
                  {expedienteParaAsignar.notarioAsignado || "Sin asignar"}
                </p>
                
                <Label>Seleccionar Notario</Label>
                <Select value={notarioSeleccionado} onValueChange={setNotarioSeleccionado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un notario" />
                  </SelectTrigger>
                  <SelectContent>
                    {notariosDisponibles.map((notario) => (
                      <SelectItem key={notario.id} value={notario.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{notario.nombre}</span>
                          <span className="text-xs text-gray-500">{notario.especialidad}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsAsignarNotarioModalOpen(false);
                setExpedienteParaAsignar(null);
                setNotarioSeleccionado("");
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmarAsignacionNotario}
              disabled={!notarioSeleccionado}
            >
              {expedienteParaAsignar?.notarioAsignado ? "Cambiar Notario" : "Asignar Notario"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
