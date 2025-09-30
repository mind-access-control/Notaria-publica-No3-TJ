"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSolicitudByNumber, Solicitud, solicitudes } from "@/lib/mock-data";
import { useAuth } from "@/contexts/auth-context";
import { formatPesoMexicano } from "@/lib/formatters";
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

          {/* Contenido principal - solo mostrar DocumentUploadStep */}
          <DocumentUploadStep
            solicitud={solicitud}
            onSolicitudUpdate={handleSolicitudUpdate}
          />
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalPhase, setModalPhase] = useState<"validating" | "success">(
    "validating"
  );

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

      // Iniciar validación automática después de subir documentos
      setTimeout(() => {
        handleAutomaticValidation();
      }, 1000);
    };
    input.click();
  };

  // Función para iniciar validación manual si es necesario
  const handleStartValidation = () => {
    if (uploadedFiles.length > 0) {
      handleAutomaticValidation();
    }
  };

  // Nueva función para validación automática
  const handleAutomaticValidation = async () => {
    if (uploadedFiles.length === 0) return;

    setIsExtracting(true);
    setExtractionComplete(false);

    // Paso 1: Extraer información de documentos
    const filesWithExtraction = uploadedFiles.map((file, index) => {
      let documentType = "OTRO";

      if (
        file.name.toLowerCase().includes("ine") ||
        file.name.toLowerCase().includes("identificacion")
      ) {
        documentType = "INE";
      } else if (file.name.toLowerCase().includes("curp")) {
        documentType = "CURP";
      } else if (
        file.name.toLowerCase().includes("domicilio") ||
        file.name.toLowerCase().includes("comprobante")
      ) {
        documentType = "DOMICILIO";
      } else if (
        file.name.toLowerCase().includes("acta") ||
        file.name.toLowerCase().includes("nacimiento")
      ) {
        documentType = "ACTA_NACIMIENTO";
      } else if (
        file.name.toLowerCase().includes("rfc") ||
        file.name.toLowerCase().includes("fiscal")
      ) {
        documentType = "RFC";
      } else if (
        file.name.toLowerCase().includes("bancario") ||
        file.name.toLowerCase().includes("cuenta")
      ) {
        documentType = "DATOS_BANCARIOS";
      }

      return {
        ...file,
        status: "extracted",
        extractionStatus: "TERMINADO",
        documentType,
        extractedData: {
          documentType,
          confidence: Math.random() * 0.3 + 0.7, // 70-100%
          data: {
            nombre: "GRACIELA RODRIGUEZ LOPEZ",
            fechaNacimiento: "01/12/1988",
            domicilio: "CUARZO 105, COLONIA SAN PEDRITO PEÑUELAS",
          },
        },
      };
    });

    // Simular tiempo de extracción
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setUploadedFiles(filesWithExtraction);
    setIsExtracting(false);
    setExtractionComplete(true);

    // Paso 2: Validación automática con IA
    setTimeout(() => {
      handleAutomaticAIValidation(filesWithExtraction);
    }, 500);
  };

  // Nueva función para validación automática con IA
  const handleAutomaticAIValidation = async (filesWithData: any[]) => {
    // Mostrar modal de validación inmediatamente
    setModalPhase("validating");
    setShowSuccessModal(true);

    // Simular tiempo de validación con IA
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Cambiar a fase de éxito
    setModalPhase("success");

    // Actualizar solicitud directamente a PAGO_PENDIENTE
    const updatedSolicitud = {
      ...solicitud,
      estatusActual: "PAGO_PENDIENTE",
      documentosRequeridos: solicitud.documentosRequeridos.map((doc: any) => {
        const uploadedFile = filesWithData.find((f) =>
          doesFileMatchDocument(f.name, doc.nombre)
        );
        return {
          ...doc,
          subido: !!uploadedFile,
          archivo: uploadedFile,
          extractedData: uploadedFile?.extractedData || null,
          validado: true, // Marcar como validado automáticamente
        };
      }),
      fechaUltimaActualizacion: new Date().toISOString().split("T")[0],
    };

    onSolicitudUpdate(updatedSolicitud);

    // Redirigir automáticamente después de mostrar el mensaje de éxito (más tiempo para leer)
    setTimeout(() => {
      window.location.href = `/solicitud/${solicitud.numeroSolicitud}/pago`;
    }, 5000);
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
        ) : (
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
                        <p className="text-xs text-gray-500">
                          {isExtracting
                            ? "Procesando..."
                            : extractionComplete
                            ? "Validado ✓"
                            : "Subido"}
                        </p>
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

              {/* Mostrar estado del proceso automático */}
              {isExtracting && (
                <div className="mt-4 pt-4 border-t">
                  <div className="text-center space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm text-blue-600 font-medium">
                        Procesando documentos automáticamente...
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Extrayendo información y validando con IA
                    </p>
                  </div>
                </div>
              )}

              {extractionComplete && !isExtracting && (
                <div className="mt-4 pt-4 border-t">
                  <div className="text-center space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">
                        ¡Validación exitosa!
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Todos los documentos han sido validados correctamente
                    </p>
                    <p className="text-xs text-blue-600">
                      Redirigiendo al pago...
                    </p>
                  </div>
                </div>
              )}

              {/* Botón para continuar si hay documentos pero no se ha iniciado validación */}
              {uploadedFiles.length > 0 &&
                !isExtracting &&
                !extractionComplete && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-center space-y-3">
                      <div className="flex items-center justify-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="text-sm text-blue-600 font-medium">
                          Documentos listos para validar
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Haz clic en continuar para procesar automáticamente tus
                        documentos
                      </p>
                      <Button
                        onClick={handleStartValidation}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Continuar con Validación
                      </Button>
                    </div>
                  </div>
                )}
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

      {/* Modal de validación */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="text-center">
              {modalPhase === "validating" ? (
                <>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Validando con IA...
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Nuestro sistema está analizando y comparando tus documentos
                    contra el contrato de compraventa.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                    <span>Procesando...</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    ¡Validación Exitosa!
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Tus documentos se procesaron y se compararon los datos
                    contra el contrato de compraventa. Todo cuadra
                    perfectamente. Ahora procederemos al pago.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span>Redirigiendo al pago...</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente eliminado - ya no se usa
function AIValidationStep_ELIMINADO({
  solicitud,
  onSolicitudUpdate,
}: {
  solicitud: any;
  onSolicitudUpdate: (solicitud: any) => void;
}) {
  // Componente deshabilitado - ya no se usa
  return null;
}
