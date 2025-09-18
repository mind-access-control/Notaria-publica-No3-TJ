"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Solicitud, getUserSolicitudes } from "@/lib/mock-data";
import {
  Cita,
  getCitasAbogado,
  getCitasHoy,
  getProximasCitas,
} from "@/lib/citas-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Calendar,
  DollarSign,
  User,
  Settings,
  LogOut,
  Search,
  Filter,
  Download,
  Edit,
  ChevronRight,
  AlertTriangle,
  Bell,
  X,
  Save,
  RotateCcw,
  CalendarDays,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AbogadoPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState<Solicitud[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [showFloatingNotification, setShowFloatingNotification] =
    useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedMainDocument, setSelectedMainDocument] = useState<any>(null);
  const [reviewPoints, setReviewPoints] = useState<{
    [key: string]: "pending" | "reviewed" | "needs_correction";
  }>({});
  const [showReviewPoints, setShowReviewPoints] = useState(true);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [highlightedElement, setHighlightedElement] =
    useState<HTMLElement | null>(null);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [citasHoy, setCitasHoy] = useState<Cita[]>([]);
  const [proximasCitas, setProximasCitas] = useState<Cita[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [citasCargando, setCitasCargando] = useState(false);

  // Puntos estratégicos de revisión
  const strategicReviewPoints = [
    {
      id: "datos_personales",
      title: "Datos Personales",
      description:
        "Verificar nombres completos, fechas de nacimiento y datos de identificación",
      textToHighlight:
        "INSTRUMENTO NÚMERO TREINTA Y DOS MIL SEISCIENTOS OCHENTA Y NUEVE",
      position: { top: "10%", left: "5%" },
    },
    {
      id: "datos_inmueble",
      title: "Datos del Inmueble",
      description:
        "Revisar dirección completa, superficie, valor y características del bien",
      textToHighlight:
        "VOLUMEN ORDINARIO NÚMERO MIL TRESCIENTOS NOVENTA Y SIETE",
      position: { top: "25%", left: "5%" },
    },
    {
      id: "fecha_instrumento",
      title: "Fecha del Instrumento",
      description:
        "Verificar que la fecha del instrumento sea correcta y esté bien escrita",
      textToHighlight: "En la ciudad de Tijuana, Baja California",
      position: { top: "40%", left: "5%" },
    },
    {
      id: "clausulas_importantes",
      title: "Cláusulas Importantes",
      description:
        "Verificar condiciones especiales, obligaciones y derechos de las partes",
      textToHighlight: "EL CONTRATO DE COMPRAVENTA",
      position: { top: "55%", left: "5%" },
    },
    {
      id: "datos_comprador",
      title: "Datos del Comprador",
      description:
        "Revisar información completa del comprador: nombre, domicilio, identificación",
      textToHighlight: "COMPRADOR",
      position: { top: "70%", left: "5%" },
    },
    {
      id: "datos_vendedor",
      title: "Datos del Vendedor",
      description:
        "Revisar información completa del vendedor: nombre, domicilio, identificación",
      textToHighlight: "VENDEDOR",
      position: { top: "85%", left: "5%" },
    },
    {
      id: "precio_venta",
      title: "Precio de Venta",
      description:
        "Verificar que el precio de venta esté correctamente especificado en números y letras",
      textToHighlight: "PRECIO DE VENTA",
      position: { top: "100%", left: "5%" },
    },
    {
      id: "firmas_notario",
      title: "Firmas y Notario",
      description: "Confirmar firma del notario, fecha y número de instrumento",
      textToHighlight: "Doctor Xavier Ibañez Veramendi",
      position: { top: "115%", left: "5%" },
    },
    {
      id: "testigos",
      title: "Testigos",
      description:
        "Verificar que los testigos estén correctamente identificados y firmen",
      textToHighlight: "TESTIGOS",
      position: { top: "130%", left: "5%" },
    },
    {
      id: "revision_final",
      title: "Revisión Final",
      description:
        "Verificación final de que todos los datos estén correctos y completos",
      textToHighlight: "INSTRUMENTO NÚMERO",
      position: { top: "145%", left: "5%" },
    },
  ];

  const handleReviewPoint = (
    pointId: string,
    status: "pending" | "reviewed" | "needs_correction"
  ) => {
    setReviewPoints((prev) => ({
      ...prev,
      [pointId]: status,
    }));

    // Si se marca como revisado, automáticamente pasar al siguiente punto
    if (
      status === "reviewed" &&
      currentReviewIndex < strategicReviewPoints.length - 1
    ) {
      setTimeout(() => {
        setCurrentReviewIndex(currentReviewIndex + 1);
      }, 500); // Pequeño delay para que el usuario vea el cambio
    }
  };

  const getReviewStatusIcon = (status: string) => {
    switch (status) {
      case "reviewed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "needs_correction":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const handleNextReviewPoint = () => {
    if (currentReviewIndex < strategicReviewPoints.length - 1) {
      setCurrentReviewIndex(currentReviewIndex + 1);
      scrollToText(
        strategicReviewPoints[currentReviewIndex + 1].textToHighlight
      );
    }
  };

  const handlePreviousReviewPoint = () => {
    if (currentReviewIndex > 0) {
      setCurrentReviewIndex(currentReviewIndex - 1);
      scrollToText(
        strategicReviewPoints[currentReviewIndex - 1].textToHighlight
      );
    }
  };

  const scrollToText = (textToFind: string) => {
    // Limpiar resaltado anterior
    if (highlightedElement) {
      highlightedElement.style.backgroundColor = "";
      highlightedElement.style.outline = "";
    }

    // Intentar hacer scroll al texto específico en el iframe
    const iframe = document.querySelector(
      'iframe[title*="Escritura"]'
    ) as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      try {
        // Buscar el texto en el documento del iframe
        const iframeDoc =
          iframe.contentDocument || iframe.contentWindow.document;

        // Buscar texto más específico usando rangos de texto
        const walker = iframeDoc.createTreeWalker(
          iframeDoc.body,
          NodeFilter.SHOW_TEXT,
          null
        );

        let found = false;
        let node;
        while ((node = walker.nextNode())) {
          const textNode = node as Text;
          const text = textNode.textContent || "";

          if (text.includes(textToFind)) {
            found = true;
            // Crear un rango para seleccionar solo la parte específica
            const range = iframeDoc.createRange();
            const startIndex = text.indexOf(textToFind);
            const endIndex = startIndex + textToFind.length;

            range.setStart(textNode, startIndex);
            range.setEnd(textNode, endIndex);

            // Crear un span para resaltar solo esa parte
            const span = iframeDoc.createElement("span");
            span.style.backgroundColor = "yellow";
            span.style.padding = "2px 4px";
            span.style.borderRadius = "3px";
            span.style.fontWeight = "bold";

            try {
              range.surroundContents(span);
              setHighlightedElement(span as HTMLElement);

              // Hacer scroll al elemento resaltado
              span.scrollIntoView({ behavior: "smooth", block: "center" });
              break;
            } catch (e) {
              // Si no se puede rodear el contenido, resaltar el elemento padre
              const parent = textNode.parentElement;
              if (parent) {
                parent.style.backgroundColor = "yellow";
                parent.style.padding = "2px 4px";
                parent.style.borderRadius = "3px";
                setHighlightedElement(parent);
                parent.scrollIntoView({ behavior: "smooth", block: "center" });
                break;
              }
            }
          }
        }

        // Si no se encontró el texto específico, buscar texto parcial
        if (!found) {
          const partialText = textToFind.split(" ")[0]; // Tomar solo la primera palabra
          const walker2 = iframeDoc.createTreeWalker(
            iframeDoc.body,
            NodeFilter.SHOW_TEXT,
            null
          );

          while ((node = walker2.nextNode())) {
            const textNode = node as Text;
            const text = textNode.textContent || "";

            if (text.includes(partialText)) {
              const parent = textNode.parentElement;
              if (parent) {
                parent.style.backgroundColor = "yellow";
                parent.style.padding = "2px 4px";
                parent.style.borderRadius = "3px";
                setHighlightedElement(parent);
                parent.scrollIntoView({ behavior: "smooth", block: "center" });
                break;
              }
            }
          }
        }
      } catch (error) {
        console.log("No se pudo acceder al contenido del iframe:", error);
      }
    }
  };

  const canCompleteReview = () => {
    return Object.values(reviewPoints).every((status) => status === "reviewed");
  };

  // Funciones para manejar citas
  const cargarCitas = async () => {
    if (!user) return;

    setCitasCargando(true);
    try {
      const [citasData, citasHoyData, proximasData] = await Promise.all([
        getCitasAbogado(user.id),
        getCitasHoy(user.id),
        getProximasCitas(user.id),
      ]);

      setCitas(citasData);
      setCitasHoy(citasHoyData);
      setProximasCitas(proximasData);
    } catch (error) {
      console.error("Error cargando citas:", error);
    } finally {
      setCitasCargando(false);
    }
  };

  const cargarCitasPorFecha = async (fecha: string) => {
    if (!user) return;

    setCitasCargando(true);
    try {
      const citasData = await getCitasAbogado(user.id, fecha);
      setCitas(citasData);
    } catch (error) {
      console.error("Error cargando citas por fecha:", error);
    } finally {
      setCitasCargando(false);
    }
  };

  const getEstadoCitaColor = (estado: string) => {
    switch (estado) {
      case "PROGRAMADA":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "EN_CURSO":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "COMPLETADA":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELADA":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEstadoCitaIcon = (estado: string) => {
    switch (estado) {
      case "PROGRAMADA":
        return <Clock className="h-4 w-4" />;
      case "EN_CURSO":
        return <AlertCircle className="h-4 w-4" />;
      case "COMPLETADA":
        return <CheckCircle className="h-4 w-4" />;
      case "CANCELADA":
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatFechaCita = (fecha: string) => {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatHoraCita = (hora: string) => {
    const [horas, minutos] = hora.split(":");
    return `${horas}:${minutos}`;
  };

  const esCitaProxima = (cita: Cita) => {
    const ahora = new Date();
    const fechaCita = new Date(`${cita.fecha} ${cita.hora}`);
    const diferenciaHoras =
      (fechaCita.getTime() - ahora.getTime()) / (1000 * 60 * 60);

    return (
      diferenciaHoras <= 2 &&
      diferenciaHoras >= 0 &&
      cita.estado === "PROGRAMADA"
    );
  };

  // Verificar autenticación
  useEffect(() => {
    if (
      !isLoading &&
      (!isAuthenticated ||
        (user?.role !== "notario" && user?.role !== "abogado"))
    ) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Scroll automático cuando cambia el punto de revisión
  useEffect(() => {
    if (showDocumentModal && strategicReviewPoints[currentReviewIndex]) {
      setTimeout(() => {
        scrollToText(strategicReviewPoints[currentReviewIndex].textToHighlight);
      }, 500);
    }
  }, [currentReviewIndex, showDocumentModal]);

  // Limpiar resaltado cuando se cierra el modal
  useEffect(() => {
    if (!showDocumentModal && highlightedElement) {
      highlightedElement.style.backgroundColor = "";
      highlightedElement.style.outline = "";
      setHighlightedElement(null);
    }
  }, [showDocumentModal, highlightedElement]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const cargarSolicitudes = async () => {
      try {
        // Para notarios/abogados, obtener todas las solicitudes (en un sistema real sería solo las asignadas)
        const userSolicitudes = await getUserSolicitudes(user.id);
        setSolicitudes(userSolicitudes);

        // Simular notificación de nueva solicitud asignada después de 15 segundos
        setTimeout(() => {
          const nuevaNotificacion = {
            id: Date.now(),
            tipo: "nueva_solicitud",
            titulo: "Nueva Solicitud Asignada",
            mensaje: `Se te ha asignado la solicitud #NT3-2025-00134 - Testamento Público Abierto`,
            fecha: new Date().toLocaleString("es-MX"),
            leida: false,
            solicitudId: "NT3-2025-00134",
          };

          setNotifications((prev) => [nuevaNotificacion, ...prev]);
          setHasNewNotification(true);
          setShowFloatingNotification(true);

          // Ocultar notificación flotante después de 5 segundos
          setTimeout(() => {
            setShowFloatingNotification(false);
          }, 5000);
        }, 15000);
      } catch (error) {
        console.error("Error cargando solicitudes:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarSolicitudes();
    cargarCitas();
  }, [isAuthenticated, user]);

  // Cargar citas cuando cambie la fecha seleccionada
  useEffect(() => {
    if (user && fechaSeleccionada) {
      cargarCitasPorFecha(fechaSeleccionada);
    }
  }, [fechaSeleccionada, user]);

  // Verificar citas próximas cada minuto
  useEffect(() => {
    if (!user) return;

    const verificarCitasProximas = () => {
      const ahora = new Date();
      const citasProximas = citas.filter((cita) => {
        const fechaCita = new Date(`${cita.fecha} ${cita.hora}`);
        const diferenciaMinutos =
          (fechaCita.getTime() - ahora.getTime()) / (1000 * 60);

        // Notificar si la cita está en los próximos 30 minutos
        return (
          diferenciaMinutos <= 30 &&
          diferenciaMinutos >= 0 &&
          cita.estado === "PROGRAMADA"
        );
      });

      if (citasProximas.length > 0) {
        citasProximas.forEach((cita) => {
          const nuevaNotificacion = {
            id: `cita-${cita.id}-${Date.now()}`,
            tipo: "cita_proxima",
            titulo: "Cita Próxima",
            mensaje: `Tienes una cita con ${
              cita.cliente.nombre
            } a las ${formatHoraCita(cita.hora)} en ${cita.sala}`,
            fecha: new Date().toLocaleString("es-MX"),
            leida: false,
            citaId: cita.id,
            solicitudId: cita.numeroSolicitud,
          };

          setNotifications((prev) => [nuevaNotificacion, ...prev]);
          setHasNewNotification(true);
          setShowFloatingNotification(true);

          // Ocultar notificación flotante después de 10 segundos
          setTimeout(() => {
            setShowFloatingNotification(false);
          }, 10000);
        });
      }
    };

    // Verificar inmediatamente
    verificarCitasProximas();

    // Verificar cada minuto
    const interval = setInterval(verificarCitasProximas, 60000);

    return () => clearInterval(interval);
  }, [citas, user]);

  const getStatusColor = (estatus: string) => {
    switch (estatus) {
      case "EN_REVISION_INTERNA":
        return "bg-blue-100 text-blue-800";
      case "DOCUMENTOS_PENDIENTES":
        return "bg-yellow-100 text-yellow-800";
      case "PAGO_PENDIENTE":
        return "bg-orange-100 text-orange-800";
      case "COMPLETADO":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (estatus: string) => {
    switch (estatus) {
      case "EN_REVISION_INTERNA":
        return <Clock className="h-4 w-4" />;
      case "DOCUMENTOS_PENDIENTES":
        return <FileText className="h-4 w-4" />;
      case "PAGO_PENDIENTE":
        return <DollarSign className="h-4 w-4" />;
      case "COMPLETADO":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatStatusText = (estatus: string) =>
    estatus
      .replace(/_/g, " ")
      .toLowerCase()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  // Función para calcular urgencia basada en días transcurridos
  const getUrgencyStatus = (fechaCreacion: string) => {
    const fechaCreacionDate = new Date(fechaCreacion);
    const hoy = new Date();
    const diasTranscurridos = Math.floor(
      (hoy.getTime() - fechaCreacionDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diasTranscurridos > 30) return "urgent"; // Rojo
    if (diasTranscurridos > 15) return "warning"; // Amarillo
    return "normal"; // Verde
  };

  // Función para obtener el color de fondo de la fila según urgencia
  const getRowBackgroundColor = (fechaCreacion: string) => {
    const urgency = getUrgencyStatus(fechaCreacion);
    switch (urgency) {
      case "urgent":
        return "bg-red-50 border-l-4 border-red-500"; // Rojo intenso para muy urgente
      case "warning":
        return "bg-yellow-50 border-l-4 border-yellow-500"; // Amarillo para advertencia
      default:
        return "bg-green-50 border-l-4 border-green-500"; // Verde para normal
    }
  };

  // Función para obtener el color del badge de urgencia
  const getUrgencyColor = (fechaCreacion: string) => {
    const urgency = getUrgencyStatus(fechaCreacion);
    switch (urgency) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-green-100 text-green-800 border-green-200";
    }
  };

  // Función para obtener el icono de urgencia
  const getUrgencyIcon = (fechaCreacion: string) => {
    const urgency = getUrgencyStatus(fechaCreacion);
    switch (urgency) {
      case "urgent":
        return <AlertTriangle className="h-4 w-4" />;
      case "warning":
        return <Clock className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  // Función para obtener el texto del tooltip del botón de documento
  const getDocumentTooltipText = (tipoTramite: string) => {
    if (tipoTramite.includes("Testamento")) {
      return "Ver Testamento";
    } else if (tipoTramite.includes("Escritura")) {
      return "Ver Escritura";
    } else if (tipoTramite.includes("Poder")) {
      return "Ver Poder Notarial";
    } else if (tipoTramite.includes("Donación")) {
      return "Ver Escritura de Donación";
    } else {
      return "Ver Documento Legal";
    }
  };

  // Función para obtener el documento principal según el tipo de trámite
  const getMainDocument = (solicitud: Solicitud) => {
    const tramiteType = solicitud.tipoTramite.toLowerCase();

    if (tramiteType.includes("compraventa")) {
      return {
        nombre: "Documentos de Compraventa",
        archivo: "compraventa.pdf",
        descripcion: "Documentos requeridos para el trámite de compraventa",
        tipo: "compraventa",
        documentos: [
          { id: 1, nombre: "Identificación Oficial", descripcion: "INE o pasaporte vigente", subido: true },
          { id: 2, nombre: "CURP", descripcion: "Clave Única de Registro de Población", subido: true },
          { id: 3, nombre: "RFC y Constancia de Situación Fiscal (CSF)", descripcion: "Registro Federal de Contribuyentes y constancia de situación fiscal", subido: true },
          { id: 4, nombre: "Acta de Nacimiento", descripcion: "Acta de nacimiento reciente o legible", subido: true },
          { id: 5, nombre: "Comprobante de Domicilio", descripcion: "Agua/luz/estado de cuenta, no mayor a 3 meses", subido: true },
          { id: 6, nombre: "Datos Bancarios", descripcion: "CLABE y banco para dispersión y comprobación de fondos", subido: true },
          { id: 7, nombre: "Acta de Matrimonio", descripcion: "Acta de matrimonio (si aplica)", subido: true },
          { id: 8, nombre: "Carta oferta", descripcion: "Carta oferta o condiciones del banco", subido: true },
          { id: 9, nombre: "Avalúo Bancario", descripcion: "Avalúo bancario (si el banco lo exige; a veces lo gestiona el banco)", subido: true },
          { id: 10, nombre: "Pólizas Requeridas por el Crédito", descripcion: "Pólizas de vida/daños, si aplican", subido: true },
          { id: 11, nombre: "Instrucciones de Dispersión del Banco", descripcion: "Instrucciones de dispersión del banco y datos del representante que firmará la hipoteca", subido: true }
        ]
      };
    } else if (tramiteType.includes("testamento")) {
      return {
        nombre: "Testamento Público Abierto",
        archivo: "Copia_de_32689.docx.md",
        descripcion: "Documento notarial final del testamento",
        tipo: "testamento",
      };
    } else if (tramiteType.includes("escritura")) {
      return {
        nombre: "Escritura de Donación",
        archivo: "Copia_de_32689.docx.md",
        descripcion: "Documento notarial final de la escritura",
        tipo: "escritura",
      };
    } else if (tramiteType.includes("donación")) {
      return {
        nombre: "Escritura de Donación",
        archivo: "Copia_de_32689.docx.md",
        descripcion: "Documento notarial final de la donación",
        tipo: "donacion",
      };
    }

    return {
      nombre: "Documento Principal",
      archivo: "Copia_de_32689.docx.md",
      descripcion: "Documento notarial final",
      tipo: "general",
    };
  };

  // Función para determinar si una solicitud puede ser trabajada
  const canWorkOnSolicitud = (solicitud: Solicitud, index: number) => {
    return index === 0; // Solo la primera solicitud (más urgente) puede ser trabajada
  };

  // Función para calcular porcentaje de avance
  const getProgressPercentage = (solicitud: Solicitud) => {
    const documentosSubidos = solicitud.documentosRequeridos.filter(
      (doc) => doc.subido
    ).length;
    const totalDocumentos = solicitud.documentosRequeridos.length;
    const porcentajeDocumentos = (documentosSubidos / totalDocumentos) * 50; // 50% por documentos

    // 50% adicional basado en el estatus
    let porcentajeEstatus = 0;
    switch (solicitud.estatusActual) {
      case "ARMANDO_EXPEDIENTE":
        porcentajeEstatus = 10;
        break;
      case "EN_REVISION_INTERNA":
        porcentajeEstatus = 25;
        break;
      case "BORRADOR_PARA_REVISION_CLIENTE":
        porcentajeEstatus = 40;
        break;
      case "APROBADO_PARA_FIRMA":
        porcentajeEstatus = 60;
        break;
      case "LISTO_PARA_ENTREGA":
        porcentajeEstatus = 80;
        break;
      case "COMPLETADO":
        porcentajeEstatus = 100;
        break;
      default:
        porcentajeEstatus = 0;
    }

    return Math.min(100, Math.round(porcentajeDocumentos + porcentajeEstatus));
  };

  // Mostrar todas las solicitudes ordenadas por urgencia (excluyendo completadas)
  useEffect(() => {
    if (solicitudes.length > 0) {
      // Filtrar solicitudes no completadas y ordenar por urgencia
      const nonCompletedSolicitudes = solicitudes.filter(
        (solicitud) => solicitud.estatusActual !== "COMPLETADO"
      );

      const sortedSolicitudes = [...nonCompletedSolicitudes].sort((a, b) => {
        const urgencyA = getUrgencyStatus(a.fechaCreacion);
        const urgencyB = getUrgencyStatus(b.fechaCreacion);

        const urgencyOrder = { urgent: 0, warning: 1, normal: 2 };
        return urgencyOrder[urgencyA] - urgencyOrder[urgencyB];
      });

      setFilteredSolicitudes(sortedSolicitudes);
    }
  }, [solicitudes]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando credenciales...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado o no es notario/abogado, no mostrar nada (se redirigirá)
  if (
    !isAuthenticated ||
    (user?.role !== "notario" && user?.role !== "abogado")
  ) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background flex">
        {/* Contenido principal */}
        <div className="flex-1 overflow-hidden">
          <div className="w-full px-6 py-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Panel de {user.role === "notario" ? "Abogado" : "Abogado"}
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Bienvenido, {user.nombre}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {user.role === "notario" ? "Notario" : "Abogado"}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configuración
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      try {
                        setIsLoggingOut(true);
                        await logout();
                        router.push("/");
                      } finally {
                        setIsLoggingOut(false);
                      }
                    }}
                    className="text-red-600"
                    disabled={isLoggingOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="solicitudes" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="solicitudes"
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Mis Solicitudes Asignadas
                </TabsTrigger>
                <TabsTrigger value="citas" className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Mis Citas
                </TabsTrigger>
                <TabsTrigger
                  value="estadisticas"
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Estadísticas
                </TabsTrigger>
              </TabsList>

              {/* Tab: Mis Solicitudes Asignadas */}
              <TabsContent value="solicitudes" className="space-y-6">
                {/* Header con filtros */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Solicitudes Asignadas
                    </h2>
                    <p className="text-sm text-gray-600">
                      {filteredSolicitudes.length} solicitud
                      {filteredSolicitudes.length !== 1 ? "es" : ""} asignada
                      {filteredSolicitudes.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Indicador de colores de urgencia */}
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 font-medium">
                      Indicador de urgencia:
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                      <span className="text-gray-600">Urgente (30+ días)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                      <span className="text-gray-600">
                        Advertencia (15+ días)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                      <span className="text-gray-600">Normal (0-14 días)</span>
                    </div>
                  </div>

                  {/* Botón de notificaciones */}
                  <div className="flex items-center gap-4">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setShowNotifications(!showNotifications)
                          }
                          className="relative"
                        >
                          <Bell className="h-4 w-4" />
                          {hasNewNotification && (
                            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Ver notificaciones</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando solicitudes...</p>
                  </div>
                ) : filteredSolicitudes.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {solicitudes.length === 0
                          ? "No tienes solicitudes asignadas"
                          : "No se encontraron solicitudes con los filtros aplicados"}
                      </h3>
                      <p className="text-gray-600">
                        {solicitudes.length === 0
                          ? "Las solicitudes que te sean asignadas aparecerán aquí"
                          : "Intenta ajustar los filtros de búsqueda"}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <div className="w-full">
                      <div className="overflow-x-auto">
                        <Table className="w-full min-w-max">
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead className="w-20">Solicitud</TableHead>
                              <TableHead className="w-28">Cliente</TableHead>
                              <TableHead className="w-32">
                                Tipo de Trámite
                              </TableHead>
                              <TableHead className="w-24">Estatus</TableHead>
                              <TableHead className="w-24">Progreso</TableHead>
                              <TableHead className="w-20">
                                Fecha Creación
                              </TableHead>
                              <TableHead className="w-20">
                                Última Actualización
                              </TableHead>
                              <TableHead className="w-16">Acciones</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredSolicitudes.map((solicitud, index) => (
                              <TableRow
                                key={solicitud.numeroSolicitud}
                                className={`${getRowBackgroundColor(
                                  solicitud.fechaCreacion
                                )} hover:opacity-80 transition-opacity ${
                                  index === 0
                                    ? "ring-2 ring-blue-500 ring-opacity-50"
                                    : ""
                                }`}
                              >
                                <TableCell>
                                  <div className="font-medium text-emerald-600">
                                    #{solicitud.numeroSolicitud}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    $
                                    {solicitud.costoTotal.toLocaleString(
                                      "es-MX"
                                    )}
                                  </div>
                                </TableCell>

                                <TableCell>
                                  <div className="font-medium">
                                    {solicitud.cliente.nombre}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {solicitud.cliente.email}
                                  </div>
                                </TableCell>

                                <TableCell>
                                  <div className="font-medium">
                                    {solicitud.tipoTramite}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {
                                      solicitud.documentosRequeridos.filter(
                                        (doc) => doc.subido
                                      ).length
                                    }
                                    /{solicitud.documentosRequeridos.length}{" "}
                                    documentos
                                  </div>
                                </TableCell>

                                <TableCell>
                                  <Badge
                                    className={getStatusColor(
                                      solicitud.estatusActual
                                    )}
                                  >
                                    <div className="flex items-center gap-1">
                                      {getStatusIcon(solicitud.estatusActual)}
                                      {formatStatusText(
                                        solicitud.estatusActual
                                      )}
                                    </div>
                                  </Badge>
                                </TableCell>

                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                                        style={{
                                          width: `${getProgressPercentage(
                                            solicitud
                                          )}%`,
                                        }}
                                      ></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">
                                      {getProgressPercentage(solicitud)}%
                                    </span>
                                  </div>
                                </TableCell>

                                <TableCell>
                                  <div className="text-sm">
                                    {solicitud.fechaCreacion}
                                  </div>
                                </TableCell>

                                <TableCell>
                                  <div className="text-sm">
                                    {solicitud.fechaUltimaActualizacion}
                                  </div>
                                </TableCell>

                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        {canWorkOnSolicitud(
                                          solicitud,
                                          index
                                        ) ? (
                                          <Link
                                            href={`/solicitud/${solicitud.numeroSolicitud}`}
                                          >
                                            <Button variant="outline" size="sm">
                                              <Eye className="h-4 w-4" />
                                            </Button>
                                          </Link>
                                        ) : (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={true}
                                            className="opacity-50 cursor-not-allowed"
                                          >
                                            <Eye className="h-4 w-4" />
                                          </Button>
                                        )}
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>
                                          {canWorkOnSolicitud(solicitud, index)
                                            ? "Ver Trámite"
                                            : "Completa la solicitud anterior primero"}
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                              console.log(
                                                "Botón de documento clickeado",
                                                solicitud.numeroSolicitud
                                              );
                                              if (
                                                canWorkOnSolicitud(
                                                  solicitud,
                                                  index
                                                )
                                              ) {
                                                const mainDoc =
                                                  getMainDocument(solicitud);
                                                console.log(
                                                  "Documento principal:",
                                                  mainDoc
                                                );
                                                setSelectedMainDocument(
                                                  mainDoc
                                                );
                                                setShowDocumentModal(true);
                                              } else {
                                                console.log(
                                                  "Solicitud no puede ser trabajada"
                                                );
                                              }
                                            }}
                                            className={`${
                                              !canWorkOnSolicitud(
                                                solicitud,
                                                index
                                              )
                                                ? "opacity-50 cursor-not-allowed pointer-events-none"
                                                : ""
                                            }`}
                                          >
                                            <FileText className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>
                                          {canWorkOnSolicitud(solicitud, index)
                                            ? getDocumentTooltipText(
                                                solicitud.tipoTramite
                                              )
                                            : `${getDocumentTooltipText(
                                                solicitud.tipoTramite
                                              )} - Bloqueado hasta completar la solicitud anterior`}
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </Card>
                )}
              </TabsContent>

              {/* Tab: Mis Citas */}
              <TabsContent value="citas" className="space-y-6">
                {/* Header con filtros */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Mis Citas
                    </h2>
                    <p className="text-sm text-gray-600">
                      {citas.length} cita{citas.length !== 1 ? "s" : ""} para{" "}
                      {fechaSeleccionada ===
                      new Date().toISOString().split("T")[0]
                        ? "hoy"
                        : formatFechaCita(fechaSeleccionada)}
                    </p>
                  </div>

                  {/* Selector de fecha */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <Input
                        type="date"
                        value={fechaSeleccionada}
                        onChange={(e) => setFechaSeleccionada(e.target.value)}
                        className="w-40"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFechaSeleccionada(
                          new Date().toISOString().split("T")[0]
                        )
                      }
                    >
                      Hoy
                    </Button>
                  </div>
                </div>

                {/* Alertas de citas próximas */}
                {proximasCitas.length > 0 && (
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <div>
                          <h4 className="font-semibold text-yellow-800">
                            Citas Próximas
                          </h4>
                          <p className="text-sm text-yellow-700">
                            Tienes {proximasCitas.length} cita
                            {proximasCitas.length !== 1 ? "s" : ""} en las
                            próximas 2 horas
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {citasCargando ? (
                  <div className="text-center py-12">
                    <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando citas...</p>
                  </div>
                ) : citas.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No tienes citas programadas
                      </h3>
                      <p className="text-gray-600">
                        {fechaSeleccionada ===
                        new Date().toISOString().split("T")[0]
                          ? "No tienes citas para hoy"
                          : `No tienes citas para ${formatFechaCita(
                              fechaSeleccionada
                            )}`}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <div className="w-full">
                      <div className="overflow-x-auto">
                        <Table className="w-full min-w-max">
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead className="w-20">Hora</TableHead>
                              <TableHead className="w-32">Cliente</TableHead>
                              <TableHead className="w-40">
                                Tipo de Trámite
                              </TableHead>
                              <TableHead className="w-24">Sala</TableHead>
                              <TableHead className="w-20">Duración</TableHead>
                              <TableHead className="w-24">Estado</TableHead>
                              <TableHead className="w-20">Solicitud</TableHead>
                              <TableHead className="w-16">Acciones</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {citas.map((cita) => (
                              <TableRow
                                key={cita.id}
                                className={`${
                                  esCitaProxima(cita)
                                    ? "bg-yellow-50 border-l-4 border-yellow-500"
                                    : "hover:bg-gray-50"
                                } transition-colors`}
                              >
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium text-gray-900">
                                      {formatHoraCita(cita.hora)}
                                    </span>
                                  </div>
                                  {esCitaProxima(cita) && (
                                    <Badge
                                      variant="outline"
                                      className="mt-1 text-xs border-yellow-400 text-yellow-700"
                                    >
                                      <AlertTriangle className="h-3 w-3 mr-1" />
                                      Próxima
                                    </Badge>
                                  )}
                                </TableCell>

                                <TableCell>
                                  <div className="font-medium text-gray-900">
                                    {cita.cliente.nombre}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {cita.cliente.email}
                                  </div>
                                </TableCell>

                                <TableCell>
                                  <div className="font-medium text-gray-900">
                                    {cita.tipoTramite}
                                  </div>
                                  {cita.notas && (
                                    <div className="text-sm text-gray-500 mt-1">
                                      {cita.notas}
                                    </div>
                                  )}
                                </TableCell>

                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700">
                                      {cita.sala}
                                    </span>
                                  </div>
                                </TableCell>

                                <TableCell>
                                  <span className="text-sm text-gray-700">
                                    {cita.duracion} min
                                  </span>
                                </TableCell>

                                <TableCell>
                                  <Badge
                                    className={getEstadoCitaColor(cita.estado)}
                                  >
                                    <div className="flex items-center gap-1">
                                      {getEstadoCitaIcon(cita.estado)}
                                      {cita.estado.replace("_", " ")}
                                    </div>
                                  </Badge>
                                </TableCell>

                                <TableCell>
                                  <div className="font-medium text-emerald-600">
                                    #{cita.numeroSolicitud}
                                  </div>
                                </TableCell>

                                <TableCell>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Link
                                        href={`/solicitud/${cita.numeroSolicitud}`}
                                      >
                                        <Button variant="outline" size="sm">
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                      </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Ver Solicitud</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </Card>
                )}
              </TabsContent>

              {/* Tab: Estadísticas */}
              <TabsContent value="estadisticas" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    Estadísticas de Trabajo
                  </h2>

                  {/* Métricas principales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Total Asignadas
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                              {filteredSolicitudes.length}
                            </p>
                          </div>
                          <FileText className="h-8 w-8 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Citas Hoy
                            </p>
                            <p className="text-2xl font-bold text-blue-600">
                              {citasHoy.length}
                            </p>
                          </div>
                          <CalendarDays className="h-8 w-8 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Citas Próximas
                            </p>
                            <p className="text-2xl font-bold text-yellow-600">
                              {proximasCitas.length}
                            </p>
                          </div>
                          <AlertTriangle className="h-8 w-8 text-yellow-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Urgentes
                            </p>
                            <p className="text-2xl font-bold text-red-600">
                              {
                                filteredSolicitudes.filter(
                                  (s) =>
                                    getUrgencyStatus(s.fechaCreacion) ===
                                    "urgent"
                                ).length
                              }
                            </p>
                          </div>
                          <AlertTriangle className="h-8 w-8 text-red-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Advertencia
                            </p>
                            <p className="text-2xl font-bold text-yellow-600">
                              {
                                filteredSolicitudes.filter(
                                  (s) =>
                                    getUrgencyStatus(s.fechaCreacion) ===
                                    "warning"
                                ).length
                              }
                            </p>
                          </div>
                          <AlertCircle className="h-8 w-8 text-yellow-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Normal
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                              {
                                filteredSolicitudes.filter(
                                  (s) =>
                                    getUrgencyStatus(s.fechaCreacion) ===
                                    "normal"
                                ).length
                              }
                            </p>
                          </div>
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Distribución por estatus y citas */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Distribución por Estatus</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {[
                            {
                              status: "ARMANDO_EXPEDIENTE",
                              label: "Armando Expediente",
                              color: "bg-gray-500",
                            },
                            {
                              status: "EN_REVISION_INTERNA",
                              label: "En Revisión Interna",
                              color: "bg-blue-500",
                            },
                            {
                              status: "BORRADOR_PARA_REVISION_CLIENTE",
                              label: "Borrador para Revisión",
                              color: "bg-yellow-500",
                            },
                            {
                              status: "APROBADO_PARA_FIRMA",
                              label: "Aprobado para Firma",
                              color: "bg-orange-500",
                            },
                            {
                              status: "LISTO_PARA_ENTREGA",
                              label: "Listo para Entrega",
                              color: "bg-purple-500",
                            },
                            {
                              status: "COMPLETADO",
                              label: "Completado",
                              color: "bg-green-500",
                            },
                          ].map(({ status, label, color }) => {
                            const count = filteredSolicitudes.filter(
                              (s) => s.estatusActual === status
                            ).length;
                            const percentage =
                              filteredSolicitudes.length > 0
                                ? (count / filteredSolicitudes.length) * 100
                                : 0;

                            return (
                              <div
                                key={status}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-3 h-3 rounded-full ${color}`}
                                  ></div>
                                  <span className="text-sm font-medium">
                                    {label}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600">
                                    {count}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    ({percentage.toFixed(1)}%)
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Distribución por Urgencia</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {[
                            {
                              urgency: "urgent",
                              label: "Urgente (30+ días)",
                              color: "bg-red-500",
                            },
                            {
                              urgency: "warning",
                              label: "Advertencia (15+ días)",
                              color: "bg-yellow-500",
                            },
                            {
                              urgency: "normal",
                              label: "Normal (0-14 días)",
                              color: "bg-green-500",
                            },
                          ].map(({ urgency, label, color }) => {
                            const count = filteredSolicitudes.filter(
                              (s) =>
                                getUrgencyStatus(s.fechaCreacion) === urgency
                            ).length;
                            const percentage =
                              filteredSolicitudes.length > 0
                                ? (count / filteredSolicitudes.length) * 100
                                : 0;

                            return (
                              <div
                                key={urgency}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-3 h-3 rounded-full ${color}`}
                                  ></div>
                                  <span className="text-sm font-medium">
                                    {label}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600">
                                    {count}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    ({percentage.toFixed(1)}%)
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Estado de Citas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {[
                            {
                              estado: "PROGRAMADA",
                              label: "Programadas",
                              color: "bg-blue-500",
                            },
                            {
                              estado: "EN_CURSO",
                              label: "En Curso",
                              color: "bg-yellow-500",
                            },
                            {
                              estado: "COMPLETADA",
                              label: "Completadas",
                              color: "bg-green-500",
                            },
                            {
                              estado: "CANCELADA",
                              label: "Canceladas",
                              color: "bg-red-500",
                            },
                          ].map(({ estado, label, color }) => {
                            const count = citas.filter(
                              (c) => c.estado === estado
                            ).length;
                            const percentage =
                              citas.length > 0
                                ? (count / citas.length) * 100
                                : 0;

                            return (
                              <div
                                key={estado}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-3 h-3 rounded-full ${color}`}
                                  ></div>
                                  <span className="text-sm font-medium">
                                    {label}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600">
                                    {count}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    ({percentage.toFixed(1)}%)
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Sidebar de Notificaciones */}
        <div
          className={`bg-white border-l border-gray-200 flex flex-col transition-all duration-300 ${
            showNotifications ? "w-80" : "w-12"
          }`}
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {showNotifications && (
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  ALERTAS
                </h3>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
                className="ml-auto"
              >
                {showNotifications ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4 rotate-180" />
                )}
              </Button>
            </div>
          </div>

          {showNotifications && (
            <div className="flex-1 overflow-y-auto p-4">
              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No hay notificaciones</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification, index) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${
                        notification.tipo === "nueva_solicitud"
                          ? "bg-blue-50 border-blue-200"
                          : notification.tipo === "cita_proxima"
                          ? "bg-yellow-50 border-yellow-200"
                          : notification.tipo === "rechazada"
                          ? "bg-red-50 border-red-200"
                          : "bg-green-50 border-green-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-600">
                              {notifications.length - index}.
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {notification.titulo}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">
                            {notification.mensaje}
                          </p>
                          <p className="text-xs text-gray-500">
                            {notification.fecha}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => {
                            setNotifications((prev) =>
                              prev.filter((n) => n.id !== notification.id)
                            );
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notificación flotante */}
        {showFloatingNotification && (
          <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-green-100 border border-green-300 rounded-lg p-4 shadow-lg max-w-sm">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">
                    ¡Nueva solicitud asignada!
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    Se te ha asignado la solicitud #NT3-2025-00134 - Testamento
                    Público Abierto
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-green-600 hover:text-green-800"
                  onClick={() => setShowFloatingNotification(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal grande para ver documento principal tipo DocuSign */}
        <Dialog open={showDocumentModal} onOpenChange={setShowDocumentModal}>
          <DialogContent
            className="max-w-[98vw] max-h-[95vh] w-full h-full p-0"
            style={{
              width: "98vw",
              height: "95vh",
              maxWidth: "98vw",
              maxHeight: "95vh",
            }}
            showCloseButton={false}
          >
            {/* ELIMINADO COMPLETAMENTE: DialogHeader - ya no existe */}
            
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Barra de herramientas superior - ULTRA COMPACTA */}
              <div className="bg-gray-100 border-b px-2 py-1 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-medium">Página 1 de 1</span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                      -
                    </Button>
                    <span className="text-xs w-8 text-center">100%</span>
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                      +
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReviewPoints(!showReviewPoints)}
                    className="h-5 px-2 text-xs hover:bg-gray-200"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    {showReviewPoints ? "Ocultar" : "Mostrar"}
                  </Button>
                  <Button variant="ghost" size="sm" className="h-5 px-2 text-xs hover:bg-gray-200">
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Rotar
                  </Button>
                  <Button variant="ghost" size="sm" className="h-5 px-2 text-xs hover:bg-gray-200">
                    <Download className="h-3 w-3 mr-1" />
                    Descargar
                  </Button>
                  <Button
                    onClick={() => setShowDocumentModal(false)}
                    variant="ghost"
                    size="sm"
                    className="h-5 px-2 text-xs hover:bg-gray-200"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Cerrar
                  </Button>
                </div>
              </div>

              {/* Área principal del documento */}
              <div
                className="flex-1 flex overflow-hidden"
                style={{ width: "100%" }}
              >
                {/* Panel de herramientas lateral */}
                <div className="w-20 bg-gray-50 border-r flex flex-col items-center py-4 space-y-4 flex-shrink-0">
                  <Button variant="outline" size="sm" className="w-12 h-12 p-0">
                    <FileText className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="sm" className="w-12 h-12 p-0">
                    <Edit className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="sm" className="w-12 h-12 p-0">
                    <Save className="h-5 w-5" />
                  </Button>
                  <Separator className="w-10" />
                  <Button variant="outline" size="sm" className="w-12 h-12 p-0">
                    <Download className="h-5 w-5" />
                  </Button>
                </div>

                {/* Visor del documento */}
                <div
                  className="flex-1 relative bg-gray-100"
                  style={{ width: "100%" }}
                >
                  <div className="h-full w-full overflow-hidden">
                    {selectedMainDocument?.tipo === "compraventa" ? (
                      // Vista de documentos de compraventa con layout de dos columnas
                      <div className="h-full w-full flex">
                        {/* Panel izquierdo - Lista de documentos */}
                        <div className="w-1/2 p-4 overflow-y-auto border-r border-gray-200">
                          <div className="mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 mb-1">
                              {selectedMainDocument.nombre}
                            </h2>
                            <p className="text-sm text-gray-600">
                              {selectedMainDocument.descripcion}
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            {selectedMainDocument.documentos?.map((doc: any) => (
                              <div
                                key={doc.id}
                                className="bg-white rounded-md border border-gray-200 p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center">
                                      <FileText className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h3 className="text-sm font-medium text-gray-900 truncate">
                                        {doc.nombre}
                                      </h3>
                                      <p className="text-xs text-gray-500 truncate">
                                        {doc.descripcion}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Badge 
                                      variant={doc.subido ? "default" : "secondary"}
                                      className={`text-xs ${doc.subido ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                                    >
                                      {doc.subido ? "✓" : "⏳"}
                                    </Badge>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                                    >
                                      <Eye className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Panel derecho - Visor de documentos */}
                        <div className="w-1/2 flex flex-col">
                          <div className="p-4 border-b border-gray-200">
                            <h3 className="text-sm font-medium text-gray-900">Visor de Documentos</h3>
                          </div>
                          <div className="flex-1 relative">
                            <iframe
                              src="/documentos_legales/Contrato_Compraventa_Tijuana_Dummy_FirmasEspaciadas%20(1).docx.pdf"
                              className="w-full h-full border-0"
                              title="Contrato de Compraventa"
                              style={{
                                width: "100%",
                                height: "100%",
                                minWidth: "100%",
                                maxWidth: "100%",
                                display: "block",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Vista normal con iframe para otros tipos de documentos
                      <iframe
                        src={`/documentos_legales/${encodeURIComponent(
                          selectedMainDocument?.archivo || ""
                        )}`}
                        className="w-full h-full border-0"
                        title={selectedMainDocument?.nombre}
                        style={{
                          width: "100%",
                          height: "100%",
                          minWidth: "100%",
                          maxWidth: "100%",
                          display: "block",
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Panel de revisión lateral */}
                {showReviewPoints &&
                  strategicReviewPoints[currentReviewIndex] && (
                    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-lg text-blue-800">
                            {strategicReviewPoints[currentReviewIndex].title}
                          </h4>
                          {getReviewStatusIcon(
                            reviewPoints[
                              strategicReviewPoints[currentReviewIndex].id
                            ] || "pending"
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          {
                            strategicReviewPoints[currentReviewIndex]
                              .description
                          }
                        </p>

                        {/* Texto a resaltar */}
                        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mb-4">
                          <p className="text-xs font-medium text-yellow-800 mb-1">
                            Buscar en el documento:
                          </p>
                          <p className="text-sm font-semibold text-yellow-900 mb-2">
                            "
                            {
                              strategicReviewPoints[currentReviewIndex]
                                .textToHighlight
                            }
                            "
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              scrollToText(
                                strategicReviewPoints[currentReviewIndex]
                                  .textToHighlight
                              )
                            }
                            className="w-full text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Ir al Texto
                          </Button>
                        </div>
                      </div>

                      <div className="flex-1 p-4">
                        {/* Navegación */}
                        <div className="flex items-center justify-between mb-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handlePreviousReviewPoint}
                            disabled={currentReviewIndex === 0}
                            className="text-sm px-3 py-2"
                          >
                            ← Anterior
                          </Button>
                          <span className="text-sm text-gray-500 font-medium">
                            {currentReviewIndex + 1} de{" "}
                            {strategicReviewPoints.length}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleNextReviewPoint}
                            disabled={
                              currentReviewIndex ===
                              strategicReviewPoints.length - 1
                            }
                            className="text-sm px-3 py-2"
                          >
                            Siguiente →
                          </Button>
                        </div>

                        {/* Botones de acción */}
                        <div className="space-y-3">
                          <Button
                            size="lg"
                            variant={
                              reviewPoints[
                                strategicReviewPoints[currentReviewIndex].id
                              ] === "reviewed"
                                ? "default"
                                : "outline"
                            }
                            className="w-full text-sm py-3"
                            onClick={() =>
                              handleReviewPoint(
                                strategicReviewPoints[currentReviewIndex].id,
                                "reviewed"
                              )
                            }
                          >
                            ✓ Marcar como Revisado
                          </Button>
                          <Button
                            size="lg"
                            variant={
                              reviewPoints[
                                strategicReviewPoints[currentReviewIndex].id
                              ] === "needs_correction"
                                ? "destructive"
                                : "outline"
                            }
                            className="w-full text-sm py-3"
                            onClick={() =>
                              handleReviewPoint(
                                strategicReviewPoints[currentReviewIndex].id,
                                "needs_correction"
                              )
                            }
                          >
                            ✗ Requiere Corrección
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
              </div>

              {/* Panel de resumen de revisión */}
              <div className="bg-gray-50 border-t px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">
                      Revisión Secuencial:
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">
                        Punto {currentReviewIndex + 1} de{" "}
                        {strategicReviewPoints.length}:{" "}
                        {strategicReviewPoints[currentReviewIndex]?.title}
                      </span>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              ((currentReviewIndex + 1) /
                                strategicReviewPoints.length) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {Object.values(reviewPoints).some(
                      (status) => status === "needs_correction"
                    ) && (
                      <Badge variant="destructive" className="text-xs">
                        Requiere Corrección
                      </Badge>
                    )}
                    {canCompleteReview() && (
                      <Badge variant="default" className="text-xs bg-green-600">
                        Revisión Completa
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      disabled={!canCompleteReview()}
                      onClick={() => {
                        if (canCompleteReview()) {
                          // Cambiar estatus de la solicitud
                          const solicitudActual = filteredSolicitudes[0]; // Asumiendo que es la primera
                          if (solicitudActual) {
                            // Aquí podrías actualizar el estatus en tu sistema
                            console.log(
                              `Finalizando revisión de solicitud ${solicitudActual.numeroSolicitud}`
                            );
                            // Cambiar a siguiente estatus (ej: "APROBADO_PARA_FIRMA")
                          }
                          // Cerrar el modal
                          setShowDocumentModal(false);
                          // Limpiar estados
                          setCurrentReviewIndex(0);
                          setReviewPoints({});
                          setHighlightedElement(null);
                        }
                      }}
                    >
                      <Save className="h-3 w-3 mr-1" />
                      {canCompleteReview()
                        ? "Finalizar Revisión"
                        : "Revisar Todos los Puntos"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
