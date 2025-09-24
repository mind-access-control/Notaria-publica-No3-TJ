"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSolicitudByNumber, Solicitud, solicitudes } from "@/lib/mock-data";
import { useAuth } from "@/contexts/auth-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StatusTracker } from "@/components/status-tracker";
import { PendingActions } from "@/components/pending-actions";
import { SolicitudHistory } from "@/components/solicitud-history";
import { SolicitudHeader } from "@/components/solicitud-header";
import { SolicitudInfo } from "@/components/solicitud-info";
import { SolicitudReview } from "@/components/solicitud-review";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NotificationModal } from "@/components/notification-modal";
import { SimpleDocumentViewer } from "@/components/simple-document-viewer";
import { AdvancedDocumentViewer } from "@/components/advanced-document-viewer";
import {
  validateDocumentsWithAI,
  ValidationResult,
  Inconsistency,
  CorrectionSuggestion,
} from "@/lib/ai-validation";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Shield,
  LogIn,
  Upload,
  Eye,
  Trash2,
  Edit,
  Save,
  X,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";

export default function SolicitudStatusPage() {
  const params = useParams();
  const router = useRouter();
  const numeroSolicitud = params.numeroSolicitud as string;
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    canAccessSolicitud,
  } = useAuth();

  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [notificationModal, setNotificationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  useEffect(() => {
    const fetchSolicitud = async () => {
      // Esperar a que termine la autenticación
      if (authLoading) return;

      // Solicitud especial de demostración - no requiere autenticación
      if (numeroSolicitud === "NT3-2025-00123") {
        try {
          setIsLoading(true);
          // Crear solicitud simulada para demostración
          const solicitudDemo: Solicitud = {
            numeroSolicitud: "NT3-2025-00123",
            tipoTramite: "Compraventa de Inmuebles",
            costoTotal: 25000,
            saldoPendiente: 0,
            pagosRealizados: 25000,
            estatusActual: "EN_REVISION_INTERNA",
            documentosRequeridos: [
              {
                nombre: "Identificación oficial",
                descripcion: "INE vigente",
                subido: true,
                archivo: {
                  name: "INE.pdf",
                  url: "/sample-documents/identificacion.pdf",
                },
                extractedData: {
                  documentType: "INE",
                  data: { nombre: "HERNANDEZ GONZALEZ JONATHAN RUBEN" },
                },
                validado: true,
              },
              {
                nombre: "CURP",
                descripcion: "Clave Única de Registro de Población",
                subido: true,
                archivo: {
                  name: "CURP.pdf",
                  url: "/sample-documents/identificacion.pdf",
                },
                extractedData: {
                  documentType: "CURP",
                  data: { curp: "HEGR850315HBCNNS01" },
                },
                validado: true,
              },
              {
                nombre: "Comprobante de domicilio",
                descripcion: "No mayor a 3 meses",
                subido: true,
                archivo: {
                  name: "Comprobante_Domicilio.pdf",
                  url: "/sample-documents/comprobante_domicilio.pdf",
                },
                extractedData: {
                  documentType: "DOMICILIO",
                  data: { direccion: "Av. Revolución 1234, Centro, Tijuana" },
                },
                validado: true,
              },
              {
                nombre: "Acta de nacimiento",
                descripcion: "Certificada",
                subido: true,
                archivo: {
                  name: "Acta_Nacimiento.pdf",
                  url: "/sample-documents/acta_nacimiento.pdf",
                },
                extractedData: {
                  documentType: "ACTA_NACIMIENTO",
                  data: { fechaNacimiento: "15/03/1985" },
                },
                validado: true,
              },
              {
                nombre: "RFC y Constancia de Situación Fiscal (CSF)",
                descripcion: "Del SAT",
                subido: true,
                archivo: {
                  name: "RFC_CSF.pdf",
                  url: "/sample-documents/identificacion.pdf",
                },
                extractedData: {
                  documentType: "RFC",
                  data: { rfc: "HEGR850315ABC" },
                },
                validado: true,
              },
              {
                nombre: "Datos bancarios",
                descripcion: "Estado de cuenta o comprobante",
                subido: true,
                archivo: {
                  name: "Datos_Bancarios.pdf",
                  url: "/sample-documents/identificacion.pdf",
                },
                extractedData: {
                  documentType: "DATOS_BANCARIOS",
                  data: { banco: "BBVA", cuenta: "1234567890" },
                },
                validado: true,
              },
            ],
            historial: [
              {
                estatus: "ARMANDO_EXPEDIENTE",
                fecha: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split("T")[0],
                descripcion: "Trámite iniciado. Pendiente de subir documentos.",
                usuario: "Sistema",
              },
              {
                estatus: "PAGO_PENDIENTE",
                fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split("T")[0],
                descripcion:
                  "Todos los documentos han sido subidos y validados. Pago realizado exitosamente.",
                usuario: "Sistema",
              },
              {
                estatus: "EN_REVISION_INTERNA",
                fecha: new Date().toISOString().split("T")[0],
                descripcion:
                  "Solicitud enviada a revisión interna. Licenciado asignado revisando documentos.",
                usuario: "Sistema",
              },
            ],
            fechaCreacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
            fechaUltimaActualizacion: new Date().toISOString().split("T")[0],
            cliente: {
              id: "user-hardcoded",
              nombre: "HERNANDEZ GONZALEZ JONATHAN RUBEN",
              email: "juan.perez@email.com",
              telefono: "+52 664 123 4567",
            },
            notario: {
              id: "notario-1",
              nombre: "Dra. María Elena Rodríguez",
              email: "maria.rodriguez@notaria3tijuana.com",
              telefono: "+52 664 987 6543",
            },
          };

          setSolicitud(solicitudDemo);
          setIsLoading(false);
          return;
        } catch (error) {
          console.error("Error cargando solicitud demo:", error);
          setError("Error al cargar la solicitud de demostración");
          setIsLoading(false);
          return;
        }
      }

      // Si no está autenticado, redirigir al login
      if (!isAuthenticated) {
        router.push(
          `/login?redirect=${encodeURIComponent(window.location.pathname)}`
        );
        return;
      }

      // Verificar si el usuario puede acceder a esta solicitud
      if (!canAccessSolicitud(numeroSolicitud)) {
        setAccessDenied(true);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await getSolicitudByNumber(numeroSolicitud);

        if (data) {
          setSolicitud(data);
        } else {
          setError("Solicitud no encontrada");
        }
      } catch (err) {
        setError("Error al cargar la solicitud");
        console.error("Error fetching solicitud:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (numeroSolicitud) {
      fetchSolicitud();
    }
  }, [
    numeroSolicitud,
    isAuthenticated,
    authLoading,
    canAccessSolicitud,
    router,
  ]);

  const handleStatusUpdate = (nuevoEstatus: string) => {
    if (!solicitud) return;

    // Verificar si se puede avanzar de estatus
    const documentosSubidos = solicitud.documentosRequeridos.filter(
      (doc) => doc.subido
    ).length;
    const documentosRequeridos = solicitud.documentosRequeridos.length;
    const todosDocumentosSubidos = documentosSubidos === documentosRequeridos;
    const sinSaldoPendiente = solicitud.saldoPendiente === 0;
    const tienePagoParcial = solicitud.pagosRealizados > 0;

    // Permitir cambio si:
    // 1. Todos los documentos están subidos Y
    // 2. (No hay saldo pendiente O hay pago parcial)
    const puedeAvanzar =
      todosDocumentosSubidos && (sinSaldoPendiente || tienePagoParcial);

    if (!puedeAvanzar) {
      let mensaje = "No se puede avanzar de estatus.";
      if (!todosDocumentosSubidos) {
        mensaje += " Faltan documentos por subir.";
      }
      if (!sinSaldoPendiente && !tienePagoParcial) {
        mensaje += " Hay saldo pendiente sin pago parcial.";
      }

      setNotificationModal({
        isOpen: true,
        title: "No se puede avanzar",
        message: mensaje,
        type: "warning",
      });
      return;
    }

    // Si va a "EN_REVISION_INTERNA", actualizar primero y luego redirigir
    if (nuevoEstatus === "EN_REVISION_INTERNA") {
      // Actualizar el estado local primero
      const solicitudActualizada = {
        ...solicitud,
        estatusActual: nuevoEstatus as any,
        fechaUltimaActualizacion: new Date().toISOString().split("T")[0],
      };

      setSolicitud(solicitudActualizada);

      // Actualizar en el array de solicitudes del mock data
      const solicitudIndex = solicitudes.findIndex(
        (s) => s.numeroSolicitud === solicitud.numeroSolicitud
      );
      if (solicitudIndex !== -1) {
        solicitudes[solicitudIndex] = solicitudActualizada;
      }

      setNotificationModal({
        isOpen: true,
        title: "¡Trámite Enviado a Revisión!",
        message:
          "Tu trámite ha sido enviado a revisión interna. Te notificaremos cuando haya avances. ¿Deseas regresar a tu cuenta para ver tus solicitudes o iniciar otro trámite?",
        type: "success",
        onConfirm: () => {
          // Redirigir según el rol del usuario
          if (user?.role === "admin") {
            router.push("/admin");
          } else if (user?.role === "abogado" || user?.role === "notario") {
            router.push("/abogado");
          } else {
            router.push("/mi-cuenta");
          }
        },
      });
      return;
    }

    setSolicitud({
      ...solicitud,
      estatusActual: nuevoEstatus as any,
      fechaUltimaActualizacion: new Date().toISOString().split("T")[0],
    });
  };

  const handleSolicitudUpdate = (solicitudActualizada: Solicitud) => {
    setSolicitud(solicitudActualizada);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">
                {authLoading
                  ? "Verificando credenciales..."
                  : "Cargando información de la solicitud..."}
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20">
          <div className="max-w-2xl mx-auto px-4 py-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Acceso Denegado
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                No tienes permisos para acceder a esta solicitud
              </p>

              <Card className="max-w-md mx-auto">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-4">
                        Solicitud: <strong>{numeroSolicitud}</strong>
                      </p>
                      <p className="text-sm text-gray-600 mb-6">
                        Usuario actual: <strong>{user?.nombre}</strong> (
                        {user?.role})
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={() => router.push("/login")}
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Cambiar de Usuario
                      </Button>

                      <Button
                        onClick={() => router.push("/")}
                        variant="outline"
                        className="w-full"
                      >
                        Ir al Inicio
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !solicitud) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <Alert variant="destructive" className="max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error || "No se pudo cargar la información de la solicitud"}
              </AlertDescription>
            </Alert>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Si es notario o abogado, mostrar vista de revisión
  if (user?.role === "notario" || user?.role === "abogado") {
    return (
      <SolicitudReview
        solicitud={solicitud}
        onStatusUpdate={handleStatusUpdate}
        onCorrection={(section, message) => {
          console.log(`Corrección para ${section}:`, message);
          // Aquí se implementaría la lógica para enviar correcciones
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header simplificado */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {solicitud.tipoTramite}
                </h1>
                <p className="text-gray-600">
                  Solicitud #{solicitud.numeroSolicitud} •{" "}
                  {solicitud.cliente.nombre}
                </p>
              </div>
            </div>
          </div>

          {/* Flujo de dos pasos */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-8">
              {/* Paso 1: Subir documentos */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    solicitud.estatusActual === "ARMANDO_EXPEDIENTE" ||
                    solicitud.estatusActual === "EN_REVISION_INTERNA" ||
                    solicitud.estatusActual === "COMPLETADO"
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  <FileText className="h-5 w-5" />
                </div>
                <span
                  className={`font-medium ${
                    solicitud.estatusActual === "ARMANDO_EXPEDIENTE" ||
                    solicitud.estatusActual === "EN_REVISION_INTERNA" ||
                    solicitud.estatusActual === "COMPLETADO"
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  Subir documentos
                </span>
              </div>

              {/* Línea conectora */}
              <div
                className={`h-0.5 w-16 ${
                  solicitud.estatusActual === "EN_REVISION_INTERNA" ||
                  solicitud.estatusActual === "COMPLETADO"
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              ></div>

              {/* Paso 2: Validar información */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    solicitud.estatusActual === "EN_REVISION_INTERNA" ||
                    solicitud.estatusActual === "COMPLETADO"
                      ? "bg-purple-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <span
                  className={`font-medium ${
                    solicitud.estatusActual === "EN_REVISION_INTERNA" ||
                    solicitud.estatusActual === "COMPLETADO"
                      ? "text-purple-600"
                      : "text-gray-500"
                  }`}
                >
                  Validación automática
                </span>
              </div>
            </div>
          </div>

          {/* Contenido principal según el paso actual */}
          {solicitud.estatusActual === "ARMANDO_EXPEDIENTE" ? (
            <DocumentUploadStep
              solicitud={solicitud}
              onSolicitudUpdate={handleSolicitudUpdate}
            />
          ) : (
            <AIValidationStep
              solicitud={solicitud}
              onSolicitudUpdate={handleSolicitudUpdate}
            />
          )}
        </div>
      </div>
      <Footer />

      {/* Modal de notificación */}
      <NotificationModal
        isOpen={notificationModal.isOpen}
        onClose={() =>
          setNotificationModal((prev) => ({ ...prev, isOpen: false }))
        }
        title={notificationModal.title}
        message={notificationModal.message}
        type={notificationModal.type}
        onConfirm={notificationModal.onConfirm}
        showCancel={!!notificationModal.onConfirm}
        confirmText="Sí, continuar"
        cancelText="Cancelar"
      />
    </div>
  );
}

// Componente para el paso de subir documentos (sin cambios)
function DocumentUploadStep({
  solicitud,
  onSolicitudUpdate,
}: {
  solicitud: any;
  onSolicitudUpdate: (solicitud: any) => void;
}) {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionComplete, setExtractionComplete] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<any>(null);

  // Función helper para verificar si un archivo coincide con un documento requerido
  const doesFileMatchDocument = (
    fileName: string,
    docName: string
  ): boolean => {
    const fileNameLower = fileName.toLowerCase();
    const docNameLower = docName.toLowerCase();

    // Lógica de coincidencia por nombre
    if (
      docNameLower.includes("identificacion") &&
      (fileNameLower.includes("ine") ||
        fileNameLower.includes("identificacion"))
    )
      return true;
    if (docNameLower.includes("curp") && fileNameLower.includes("curp"))
      return true;
    if (
      docNameLower.includes("domicilio") &&
      (fileNameLower.includes("domicilio") ||
        fileNameLower.includes("comprobante"))
    )
      return true;
    if (
      docNameLower.includes("acta") &&
      (fileNameLower.includes("acta") || fileNameLower.includes("nacimiento"))
    )
      return true;
    if (
      docNameLower.includes("rfc") &&
      (fileNameLower.includes("rfc") || fileNameLower.includes("fiscal"))
    )
      return true;
    if (
      docNameLower.includes("bancario") &&
      (fileNameLower.includes("bancario") || fileNameLower.includes("cuenta"))
    )
      return true;

    return false;
  };

  const handleFileUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = ".pdf,.jpg,.jpeg,.png";
    input.onchange = (e: any) => {
      const files = Array.from(e.target.files);
      const newFiles = files.map((file: any, index: number) => ({
        id: `file-${Date.now()}-${index}`,
        name: file.name,
        type: file.type,
        size: file.size,
        status: "uploaded",
        url: URL.createObjectURL(file),
      }));
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    };
    input.click();
  };

  const handleExtractInformation = async () => {
    setIsExtracting(true);

    // Simular proceso de OCR con diferentes estados
    const filesWithExtraction = uploadedFiles.map((file, index) => {
      // Simular diferentes estados de procesamiento
      let extractionStatus = "TERMINADO";
      let documentType = "OTRO";

      if (
        file.name.toLowerCase().includes("ine") ||
        file.name.toLowerCase().includes("identificacion")
      ) {
        documentType = "INE";
        extractionStatus = index === 0 ? "EXTRAYENDO" : "TERMINADO";
      } else if (file.name.toLowerCase().includes("curp")) {
        documentType = "CURP";
        extractionStatus = "TERMINADO";
      } else if (
        file.name.toLowerCase().includes("domicilio") ||
        file.name.toLowerCase().includes("comprobante")
      ) {
        documentType = "DOMICILIO";
        extractionStatus = "TERMINADO";
      } else if (
        file.name.toLowerCase().includes("acta") ||
        file.name.toLowerCase().includes("nacimiento")
      ) {
        documentType = "ACTA_NACIMIENTO";
        extractionStatus = "TERMINADO";
      } else if (
        file.name.toLowerCase().includes("rfc") ||
        file.name.toLowerCase().includes("fiscal")
      ) {
        documentType = "RFC";
        extractionStatus = "TERMINADO";
      } else if (
        file.name.toLowerCase().includes("bancario") ||
        file.name.toLowerCase().includes("cuenta")
      ) {
        documentType = "DATOS_BANCARIOS";
        extractionStatus = "TERMINADO";
      } else {
        extractionStatus =
          index === uploadedFiles.length - 1 ? "NO_IDENTIFICADO" : "TERMINADO";
      }

      return {
        ...file,
        status: "extracted",
        extractionStatus,
        documentType,
        extractedData:
          extractionStatus === "TERMINADO"
            ? {
                documentType,
                confidence: Math.random() * 0.3 + 0.7, // 70-100%
                data: {
                  nombre: "GRACIELA RODRIGUEZ LOPEZ",
                  fechaNacimiento: "01/12/1988",
                  domicilio: "CUARZO 105, COLONIA SAN PEDRITO PEÑUELAS",
                },
              }
            : null,
      };
    });

    // Simular tiempo de procesamiento
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setUploadedFiles(filesWithExtraction);
    setIsExtracting(false);
    setExtractionComplete(true);
  };

  const handleDeleteFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const handleEditFile = (fileId: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.jpg,.jpeg,.png";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const newFile = {
          id: fileId, // Mantener el mismo ID
          name: file.name,
          type: file.type,
          size: file.size,
          status: "uploaded",
          url: URL.createObjectURL(file),
        };
        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === fileId ? newFile : f))
        );
      }
    };
    input.click();
  };

  const handleViewDocument = (file: any) => {
    setViewingDocument(file);
  };

  const handleCloseDocumentViewer = () => {
    setViewingDocument(null);
  };

  const handleConfirmDocuments = () => {
    // Actualizar solicitud con documentos subidos y su información extraída
    const updatedSolicitud = {
      ...solicitud,
      estatusActual: "EN_REVISION_INTERNA",
      documentosRequeridos: solicitud.documentosRequeridos.map((doc: any) => {
        const uploadedFile = uploadedFiles.find((f) =>
          doesFileMatchDocument(f.name, doc.nombre)
        );
        return {
          ...doc,
          subido: !!uploadedFile, // Solo true si realmente hay un archivo
          archivo: uploadedFile,
          extractedData: uploadedFile?.extractedData || null,
          validado: false, // Inicialmente no validado hasta que se revise
        };
      }),
      fechaUltimaActualizacion: new Date().toISOString().split("T")[0],
    };
    onSolicitudUpdate(updatedSolicitud);
  };

  return (
    <div
      className={
        extractionComplete ? "w-full" : "grid grid-cols-1 lg:grid-cols-2 gap-8"
      }
    >
      {/* Lista de documentos requeridos - Solo visible antes de extraer */}
      {!extractionComplete && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Documentos Requeridos
            </h3>
            <Button
              onClick={handleFileUpload}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Upload className="h-4 w-4 mr-2" />
              Subir documentos
            </Button>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                {solicitud.documentosRequeridos.map(
                  (doc: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-sm">{doc.nombre}</p>
                          <p className="text-xs text-gray-500">
                            {doc.descripcion}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {uploadedFiles.some((f) =>
                          doesFileMatchDocument(f.name, doc.nombre)
                        ) ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Área de subida y gestión de documentos */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Documentos Subidos
        </h3>

        {uploadedFiles.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                Arrastra y suelta tus documentos aquí
              </p>
              <Button
                onClick={handleFileUpload}
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                <Upload className="h-4 w-4 mr-2" />
                Seleccionar archivos
              </Button>
            </CardContent>
          </Card>
        ) : !extractionComplete ? (
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-white border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-gray-500">Subido</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewDocument(file)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteFile(file.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <Button
                  onClick={handleExtractInformation}
                  disabled={isExtracting}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isExtracting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Extrayendo información...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Extraer información
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              {/* Tabla de documentos procesados */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Documento
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Etiqueta
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estatus
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {uploadedFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-blue-600 mr-3" />
                            <div className="text-sm font-medium text-gray-900">
                              {file.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {file.documentType && file.documentType !== "OTRO" ? (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                              {file.documentType}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              file.extractionStatus === "TERMINADO"
                                ? "bg-green-100 text-green-800"
                                : file.extractionStatus === "EXTRAYENDO"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {file.extractionStatus}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditFile(file.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4 text-gray-400" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewDocument(file)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4 text-gray-400" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteFile(file.id)}
                              className={`h-8 w-8 p-0 ${
                                file.extractionStatus === "TERMINADO"
                                  ? "text-purple-500"
                                  : "text-gray-400"
                              }`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t bg-gray-50">
                <Button
                  onClick={handleConfirmDocuments}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Confirmar documentos
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal simple para visualizar documentos */}
      <SimpleDocumentViewer
        isOpen={!!viewingDocument}
        onClose={handleCloseDocumentViewer}
        document={viewingDocument}
      />
    </div>
  );
}

// Nuevo componente para validación automática con IA
function AIValidationStep({
  solicitud,
  onSolicitudUpdate,
}: {
  solicitud: any;
  onSolicitudUpdate: (solicitud: any) => void;
}) {
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationComplete, setValidationComplete] = useState(false);

  // Función para ejecutar validación automática con IA
  const handleAIValidation = async () => {
    setIsValidating(true);

    // Simular tiempo de procesamiento de IA
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Obtener documentos con información extraída
    const documentsWithData = solicitud.documentosRequeridos
      .filter((doc: any) => doc.extractedData?.data)
      .map((doc: any) => ({
        documentType: doc.extractedData.documentType,
        data: doc.extractedData.data,
      }));

    // Ejecutar validación con IA
    const result = validateDocumentsWithAI(documentsWithData);
    setValidationResult(result);
    setValidationComplete(true);
    setIsValidating(false);

    console.log("Resultado de validación IA:", result);
  };

  // Extraer información de documentos procesados
  const extractedInfo = solicitud.documentosRequeridos
    .filter((doc: any) => doc.extractedData?.data)
    .map((doc: any) => ({
      id: doc.id,
      nombre: doc.nombre,
      tipo: doc.extractedData.documentType,
      datos: doc.extractedData.data,
      validado: doc.validado,
      archivo: doc.archivo,
    }));

  return (
    <div className="space-y-6">
      {/* Sistema de validación automática con IA */}
      {!validationComplete ? (
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Validación Automática de Documentos
            </h3>
            <p className="text-sm text-gray-600">
              Nuestro sistema de IA validará automáticamente la consistencia de
              tus documentos
            </p>
          </div>

          <Card>
            <CardContent className="p-6 text-center">
              {!isValidating ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Listo para validar
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Documentos detectados: {extractedInfo.length}
                    </p>
                  </div>
                  <Button
                    onClick={handleAIValidation}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Iniciar Validación con IA
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Validando documentos...
                    </h4>
                    <p className="text-gray-600">
                      La IA está analizando la consistencia de tus documentos
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div>
          {/* Resultados de la validación */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Resultados de Validación
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  validationResult?.isValid ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span
                className={`text-sm font-medium ${
                  validationResult?.isValid ? "text-green-700" : "text-red-700"
                }`}
              >
                Puntuación: {validationResult?.overallScore}%
              </span>
            </div>
          </div>

          {/* Inconsistencias detectadas */}
          {validationResult?.inconsistencies &&
            validationResult.inconsistencies.length > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <h4 className="text-lg font-semibold text-red-900">
                      Inconsistencias Detectadas
                    </h4>
                  </div>

                  <div className="space-y-4">
                    {validationResult.inconsistencies.map(
                      (inconsistency, index) => (
                        <div
                          key={index}
                          className="border border-red-200 rounded-lg p-4 bg-white"
                        >
                          <div className="flex items-start gap-3">
                            <AlertTriangle
                              className={`h-5 w-5 mt-0.5 ${
                                inconsistency.severity === "critical"
                                  ? "text-red-600"
                                  : inconsistency.severity === "high"
                                  ? "text-orange-600"
                                  : inconsistency.severity === "medium"
                                  ? "text-yellow-600"
                                  : "text-blue-600"
                              }`}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    inconsistency.severity === "critical"
                                      ? "bg-red-100 text-red-800"
                                      : inconsistency.severity === "high"
                                      ? "bg-orange-100 text-orange-800"
                                      : inconsistency.severity === "medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {inconsistency.severity.toUpperCase()}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {inconsistency.documents.join(" vs ")}
                                </span>
                              </div>
                              <p className="text-sm text-gray-900 font-medium">
                                {inconsistency.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Sugerencias de corrección */}
          {validationResult?.suggestions &&
            validationResult.suggestions.length > 0 && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="h-5 w-5 text-yellow-600" />
                    <h4 className="text-lg font-semibold text-yellow-900">
                      Recomendaciones de Corrección
                    </h4>
                  </div>

                  <div className="space-y-4">
                    {validationResult.suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="border border-yellow-200 rounded-lg p-4 bg-white"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h5 className="font-semibold text-gray-900">
                              {suggestion.institution}
                            </h5>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                suggestion.urgency === "high"
                                  ? "bg-red-100 text-red-800"
                                  : suggestion.urgency === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {suggestion.urgency === "high"
                                ? "URGENTE"
                                : suggestion.urgency === "medium"
                                ? "IMPORTANTE"
                                : "BAJA PRIORIDAD"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">
                            <strong>Acción requerida:</strong>{" "}
                            {suggestion.action}
                          </p>
                          <p className="text-sm text-gray-600">
                            {suggestion.description}
                          </p>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>
                              Tiempo estimado: {suggestion.estimatedTime}
                            </span>
                            {suggestion.cost && (
                              <span>Costo: {suggestion.cost}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Botón de continuar o corregir */}
          {validationResult?.isValid ? (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-900">
                        ¡Validación Exitosa!
                      </h3>
                      <p className="text-sm text-green-700">
                        Todos los documentos han sido validados correctamente
                        por la IA. Puedes continuar con el pago.
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-green-600 mb-2">
                      Costo total: $25,000
                    </div>
                    <Button
                      onClick={() => {
                        // Actualizar estado a PAGO_PENDIENTE
                        const updatedSolicitud = {
                          ...solicitud,
                          estatusActual: "PAGO_PENDIENTE",
                          fechaUltimaActualizacion: new Date()
                            .toISOString()
                            .split("T")[0],
                        };
                        onSolicitudUpdate(updatedSolicitud);
                        // Redirigir a la página de pago
                        window.location.href = `/solicitud/${solicitud.numeroSolicitud}/pago`;
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Realizar Pago
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-red-900 mb-2">
                    Correcciones Requeridas
                  </h3>
                  <p className="text-sm text-red-700 mb-4">
                    Se han detectado inconsistencias que requieren corrección
                    antes de continuar. Revisa las recomendaciones anteriores y
                    vuelve a subir los documentos corregidos.
                  </p>
                  <Button
                    onClick={() => {
                      // Regresar al paso anterior para corregir documentos
                      const updatedSolicitud = {
                        ...solicitud,
                        estatusActual: "ARMANDO_EXPEDIENTE",
                        fechaUltimaActualizacion: new Date()
                          .toISOString()
                          .split("T")[0],
                      };
                      onSolicitudUpdate(updatedSolicitud);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Volver a Subir Documentos
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
