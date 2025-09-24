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
                  Validar información
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
            <DocumentValidationStep
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

// Componente para el paso de subir documentos
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
    // Simular proceso de OCR
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Simular clasificación y extracción
    const filesWithExtraction = uploadedFiles.map((file) => ({
      ...file,
      status: "extracted",
      extractedData: {
        documentType:
          file.name.toLowerCase().includes("ine") ||
          file.name.toLowerCase().includes("identificacion")
            ? "INE"
            : file.name.toLowerCase().includes("curp")
            ? "CURP"
            : file.name.toLowerCase().includes("domicilio") ||
              file.name.toLowerCase().includes("comprobante")
            ? "DOMICILIO"
            : file.name.toLowerCase().includes("acta") ||
              file.name.toLowerCase().includes("nacimiento")
            ? "ACTA_NACIMIENTO"
            : file.name.toLowerCase().includes("rfc") ||
              file.name.toLowerCase().includes("fiscal")
            ? "RFC"
            : file.name.toLowerCase().includes("bancario") ||
              file.name.toLowerCase().includes("cuenta")
            ? "DATOS_BANCARIOS"
            : "OTRO",
        confidence: Math.random() * 0.3 + 0.7, // 70-100%
        data: {
          nombre: "GRACIELA RODRIGUEZ LOPEZ",
          fechaNacimiento: "01/12/1988",
          domicilio: "CUARZO 105, COLONIA SAN PEDRITO PEÑUELAS",
        },
      },
    }));

    setUploadedFiles(filesWithExtraction);
    setIsExtracting(false);
    setExtractionComplete(true);
  };

  const handleDeleteFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Lista de documentos requeridos */}
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
              {solicitud.documentosRequeridos.map((doc: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-sm">{doc.nombre}</p>
                      <p className="text-xs text-gray-500">{doc.descripcion}</p>
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

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
                          {file.extractedData?.documentType && (
                            <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs mr-2">
                              {file.extractedData.documentType}
                            </span>
                          )}
                          {file.status === "extracted"
                            ? "Información extraída"
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

              {uploadedFiles.length > 0 && !extractionComplete && (
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
              )}

              {extractionComplete && (
                <div className="mt-4 pt-4 border-t">
                  <Button
                    onClick={handleConfirmDocuments}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Confirmar documentos
                  </Button>
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
    </div>
  );
}

// Componente para el paso de validar información
function DocumentValidationStep({
  solicitud,
  onSolicitudUpdate,
}: {
  solicitud: any;
  onSolicitudUpdate: (solicitud: any) => void;
}) {
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [editingData, setEditingData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<any>(null);

  const handleDocumentClick = (doc: any) => {
    setSelectedDocument(doc);
    setEditingData(doc.extractedData?.data || {});
    setIsEditing(false);
  };

  const handleSaveData = () => {
    // Aquí se guardaría la información editada
    setIsEditing(false);
    // Simular actualización
    console.log("Datos guardados:", editingData);
  };

  const handleCancelEdit = () => {
    setEditingData(selectedDocument?.extractedData?.data || {});
    setIsEditing(false);
  };

  const handleViewDocument = (doc: any) => {
    // Crear un objeto de documento con información real para la visualización
    const documentToView = {
      name: doc.nombre,
      type: "application/pdf", // Asumimos PDF por defecto
      size: 1024 * 1024, // 1MB simulado
      status: "extracted",
      url:
        doc.archivo?.url ||
        "/sample-documents/" +
          doc.nombre.toLowerCase().replace(/\s+/g, "_") +
          ".pdf",
      extractedData: doc.extractedData,
      archivo: doc.archivo,
    };
    setViewingDocument(documentToView);
  };

  const handleCloseDocumentViewer = () => {
    setViewingDocument(null);
  };

  const handleValidateDocument = () => {
    // Marcar el documento como validado
    const updatedSolicitud = {
      ...solicitud,
      documentosRequeridos: solicitud.documentosRequeridos.map((doc: any) => {
        if (doc.id === selectedDocument.id) {
          return {
            ...doc,
            validado: true,
            extractedData: {
              ...doc.extractedData,
              data: editingData,
            },
          };
        }
        return doc;
      }),
      fechaUltimaActualizacion: new Date().toISOString().split("T")[0],
    };
    onSolicitudUpdate(updatedSolicitud);
    setSelectedDocument(null);
    setEditingData(null);
    setIsEditing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Lista de documentos para validar */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Documentos para Validar
        </h3>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              {solicitud.documentosRequeridos.map((doc: any, index: number) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedDocument?.id === doc.id
                      ? "bg-purple-50 border border-purple-200"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => handleDocumentClick(doc)}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-sm">{doc.nombre}</p>
                      <p className="text-xs text-gray-500">{doc.descripcion}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs ${
                        doc.validado
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {doc.validado ? "VALIDADO" : "PENDIENTE"}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleViewDocument(doc)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Área de validación */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Validar Información
        </h3>

        {selectedDocument ? (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{selectedDocument.nombre}</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? "Cancelar" : "Editar"}
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      value={editingData?.nombre || ""}
                      onChange={(e) =>
                        setEditingData({
                          ...editingData,
                          nombre: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de nacimiento
                    </label>
                    <input
                      type="text"
                      value={editingData?.fechaNacimiento || ""}
                      onChange={(e) =>
                        setEditingData({
                          ...editingData,
                          fechaNacimiento: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Domicilio
                    </label>
                    <textarea
                      value={editingData?.domicilio || ""}
                      onChange={(e) =>
                        setEditingData({
                          ...editingData,
                          domicilio: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      onClick={handleSaveData}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                    <Button onClick={handleCancelEdit} variant="outline">
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                )}

                {!isEditing && !selectedDocument.validado && (
                  <div className="pt-4 border-t">
                    <Button
                      onClick={handleValidateDocument}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Validar Documento
                    </Button>
                  </div>
                )}

                {selectedDocument.validado && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-medium">Documento Validado</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Selecciona un documento para validar su información
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal avanzado para visualizar documento y data extraída */}
      <AdvancedDocumentViewer
        isOpen={!!viewingDocument}
        onClose={handleCloseDocumentViewer}
        document={viewingDocument}
      />
    </div>
  );
}
