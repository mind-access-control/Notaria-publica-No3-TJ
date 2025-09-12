"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Solicitud } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Edit,
  Send,
  RotateCcw,
  Download,
  Eye,
  Upload,
  Save,
  X,
} from "lucide-react";

interface SolicitudReviewProps {
  solicitud: Solicitud;
  onStatusUpdate: (status: string) => void;
  onCorrection: (section: string, message: string) => void;
}

interface ReviewSection {
  id: string;
  title: string;
  status: "pending" | "reviewed" | "needs_correction";
  data: any;
  documents: any[];
}

export function SolicitudReview({
  solicitud,
  onStatusUpdate,
  onCorrection,
}: SolicitudReviewProps) {
  const router = useRouter();
  const [reviewSections, setReviewSections] = useState<ReviewSection[]>([
    {
      id: "datos_persona",
      title: "Datos de la Persona e Identificación",
      status: "pending",
      data: {
        nombre: solicitud.cliente.nombre,
        email: solicitud.cliente.email,
        telefono: solicitud.cliente.telefono,
        fechaCreacion: solicitud.fechaCreacion,
      },
      documents: (solicitud.documentosRequeridos || []).filter(
        (d) =>
          d.nombre.includes("Identificación") ||
          d.nombre.includes("Acta de Nacimiento")
      ),
    },
    {
      id: "domicilio",
      title: "Datos de Domicilio",
      status: "pending",
      data: {
        domicilio: "Calle Principal 123, Col. Centro, Tijuana, BC",
        codigoPostal: "22000",
      },
      documents: (solicitud.documentosRequeridos || []).filter(
        (d) =>
          d.nombre.includes("Comprobante de Domicilio") ||
          d.nombre.includes("Constancia")
      ),
    },
    {
      id: "pagos",
      title: "Datos de Pagos",
      status: "pending",
      data: {
        costoTotal: `$${solicitud.costoTotal.toLocaleString("es-MX")}`,
        saldoPendiente: `$${solicitud.saldoPendiente.toLocaleString("es-MX")}`,
        montoPagado: `$${(
          solicitud.costoTotal - solicitud.saldoPendiente
        ).toLocaleString("es-MX")}`,
      },
      documents: (solicitud.documentosRequeridos || []).filter(
        (d) =>
          d.nombre.includes("Pago") ||
          d.nombre.includes("Comprobante de Pago") ||
          d.nombre.includes("Transferencia")
      ),
    },
    {
      id: "tramite_info",
      title: "Información del Trámite",
      status: "pending",
      data: {
        tipoTramite: solicitud.tipoTramite,
        numeroSolicitud: solicitud.numeroSolicitud,
        estatusActual: solicitud.estatusActual,
      },
      documents: solicitud.documentosRequeridos || [],
    },
  ]);

  const [selectedSection, setSelectedSection] =
    useState<string>("datos_persona");
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [correctionMessage, setCorrectionMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState<any>({});
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedMainDocument, setSelectedMainDocument] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSectionReview = (
    sectionId: string,
    status: "reviewed" | "needs_correction"
  ) => {
    setReviewSections((prev) => {
      const updated = prev.map((section) =>
        section.id === sectionId ? { ...section, status } : section
      );

      // Verificar si todas las secciones están revisadas
      const allReviewed = updated.every(
        (section) => section.status === "reviewed"
      );
      if (allReviewed) {
        // Avanzar al siguiente estatus
        onStatusUpdate("BORRADOR_PARA_REVISION_CLIENTE");
      }

      return updated;
    });
  };

  const handleSendCorrection = (sectionId: string) => {
    if (correctionMessage.trim()) {
      onCorrection(sectionId, correctionMessage);
      setCorrectionMessage("");
    }
  };

  const handleEditData = (sectionId: string) => {
    const section = reviewSections.find((s) => s.id === sectionId);
    if (section) {
      setEditingData(section.data);
      setIsEditing(true);
    }
  };

  const handleSaveData = (sectionId: string) => {
    setReviewSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, data: editingData } : section
      )
    );
    setIsEditing(false);
    setEditingData({});
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadingFile(file);
      setShowUploadDialog(true);
    }
  };

  const handleUploadDocument = () => {
    if (uploadingFile) {
      // Simular subida de documento
      const newDocument = {
        id: Date.now(),
        nombre: uploadingFile.name,
        descripcion: "Documento subido durante revisión",
        subido: true,
        archivo: uploadingFile.name,
        fechaSubida: new Date().toISOString().split("T")[0],
      };

      // Agregar a la sección actual
      setReviewSections((prev) =>
        prev.map((section) =>
          section.id === selectedSection
            ? { ...section, documents: [...section.documents, newDocument] }
            : section
        )
      );

      setShowUploadDialog(false);
      setUploadingFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleStatusChange = (newStatus: string) => {
    onStatusUpdate(newStatus);
    // Redirigir después de cambiar estatus
    setTimeout(() => {
      router.push("/abogado");
    }, 1000);
  };

  const getMainDocument = () => {
    // Determinar el documento principal según el tipo de trámite
    const tramiteType = solicitud.tipoTramite.toLowerCase();

    if (tramiteType.includes("testamento")) {
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

  const getDocumentTooltip = () => {
    const mainDoc = getMainDocument();
    return `Ver ${mainDoc.nombre}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "reviewed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "needs_correction":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reviewed":
        return "bg-green-100 text-green-800 border-green-200";
      case "needs_correction":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const currentSection = reviewSections.find((s) => s.id === selectedSection);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push("/abogado")}
              variant="outline"
              size="sm"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Regresar a Solicitudes
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Revisión de Solicitud #{solicitud.numeroSolicitud}
              </h1>
              <p className="text-gray-600">
                {solicitud.tipoTramite} - {solicitud.cliente.nombre}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-sm">
              {solicitud.estatusActual}
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      setSelectedMainDocument(getMainDocument());
                      setShowDocumentModal(true);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Ver{" "}
                    {getMainDocument().tipo === "testamento"
                      ? "Testamento"
                      : getMainDocument().tipo === "escritura"
                      ? "Escritura"
                      : getMainDocument().tipo === "donacion"
                      ? "Escritura"
                      : "Documento"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getDocumentTooltip()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              onClick={() =>
                handleStatusChange("BORRADOR_PARA_REVISION_CLIENTE")
              }
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar a Revisión
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Panel Izquierdo - Información */}
        <div className="w-1/2 p-6 overflow-y-auto">
          {/* Lista de Secciones */}
          <div className="space-y-4">
            {reviewSections.map((section) => (
              <Card
                key={section.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(section.status)}
                      <Badge className={getStatusColor(section.status)}>
                        {section.status === "reviewed"
                          ? "Revisado"
                          : section.status === "needs_correction"
                          ? "Requiere Corrección"
                          : "Pendiente"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(section.data).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="font-medium text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}:
                        </span>
                        <span className="text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Documentos de esta sección */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-700">Documentos:</h4>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setSelectedSection(section.id);
                            fileInputRef.current?.click();
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <Upload className="h-4 w-4 mr-1" />
                          Subir
                        </Button>
                        <Button
                          onClick={() => handleEditData(section.id)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      </div>
                    </div>

                    {section.documents.length > 0 && (
                      <div className="space-y-1">
                        {section.documents.map((doc, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedDocument(doc)}
                            className="w-full justify-start"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            {doc.nombre}
                          </Button>
                        ))}
                      </div>
                    )}

                    {/* Input oculto para subir archivos */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      onClick={() =>
                        handleSectionReview(section.id, "reviewed")
                      }
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Aprobar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleSectionReview(section.id, "needs_correction")
                      }
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Rechazar
                    </Button>
                  </div>

                  {/* Mensaje de corrección */}
                  {section.status === "needs_correction" && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <textarea
                        value={correctionMessage}
                        onChange={(e) => setCorrectionMessage(e.target.value)}
                        placeholder="Describe qué necesita ser corregido..."
                        className="w-full p-2 border border-red-300 rounded text-sm"
                        rows={3}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleSendCorrection(section.id)}
                        className="mt-2 bg-red-600 hover:bg-red-700"
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Enviar Corrección
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Panel Derecho - Visor de Documentos */}
        <div className="w-1/2 border-l border-gray-200 bg-white">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Visor de Documentos</h3>
              <p className="text-sm text-gray-600">
                {selectedDocument
                  ? selectedDocument.nombre
                  : "Selecciona un documento para revisar"}
              </p>
            </div>

            <div className="flex-1 p-4">
              {selectedDocument ? (
                <div className="h-full border border-gray-200 rounded-lg overflow-hidden">
                  <div className="h-full flex flex-col">
                    <div className="p-3 bg-gray-50 border-b border-gray-200">
                      <h4 className="font-medium text-gray-900">
                        {selectedDocument.nombre}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {selectedDocument.descripcion}
                      </p>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="h-full border border-gray-300 rounded-lg overflow-hidden">
                        <div className="h-full flex flex-col">
                          {/* Header con botones */}
                          <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex gap-2">
                              <Button
                                onClick={() => {
                                  const url = `/documentos_legales/${encodeURIComponent(
                                    selectedDocument.archivo
                                  )}`;
                                  window.open(url, "_blank");
                                }}
                                variant="outline"
                                size="sm"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Nueva Pestaña
                              </Button>
                              <Button
                                onClick={() => {
                                  const url = `/documentos_legales/${encodeURIComponent(
                                    selectedDocument.archivo
                                  )}`;
                                  const link = document.createElement("a");
                                  link.href = url;
                                  link.download = selectedDocument.archivo;
                                  link.click();
                                }}
                                variant="outline"
                                size="sm"
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Descargar
                              </Button>
                            </div>
                          </div>

                          {/* Visor de PDF */}
                          <div className="flex-1">
                            <iframe
                              src={`/documentos_legales/${encodeURIComponent(
                                selectedDocument.archivo
                              )}`}
                              className="w-full h-full"
                              title={selectedDocument.nombre}
                              style={{ minHeight: "500px" }}
                              onLoad={() =>
                                console.log(
                                  "PDF loaded:",
                                  selectedDocument.archivo
                                )
                              }
                              onError={() =>
                                console.log(
                                  "Error loading PDF:",
                                  selectedDocument.archivo
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>
                      Selecciona un documento del panel izquierdo para comenzar
                      la revisión
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para editar datos */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Datos</DialogTitle>
            <DialogDescription>
              Modifica los datos de esta sección
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {Object.entries(editingData).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key} className="text-sm font-medium">
                  {key.replace(/([A-Z])/g, " $1").trim()}:
                </Label>
                <Input
                  id={key}
                  value={value as string}
                  onChange={(e) =>
                    setEditingData((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                />
              </div>
            ))}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => handleSaveData(selectedSection)}
                className="flex-1"
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para subir documento */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Subir Documento</DialogTitle>
            <DialogDescription>
              Confirma la subida del documento
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {uploadingFile && (
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">{uploadingFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(uploadingFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-2 pt-4">
              <Button onClick={handleUploadDocument} className="flex-1">
                <Upload className="h-4 w-4 mr-2" />
                Subir Documento
              </Button>
              <Button
                onClick={() => setShowUploadDialog(false)}
                variant="outline"
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal grande para ver documento principal tipo DocuSign */}
      <Dialog open={showDocumentModal} onOpenChange={setShowDocumentModal}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-bold">
                  {selectedMainDocument?.nombre}
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600">
                  {selectedMainDocument?.descripcion}
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    const url = `/documentos_legales/${encodeURIComponent(
                      selectedMainDocument?.archivo || ""
                    )}`;
                    window.open(url, "_blank");
                  }}
                  variant="outline"
                  size="sm"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Nueva Pestaña
                </Button>
                <Button
                  onClick={() => setShowDocumentModal(false)}
                  variant="outline"
                  size="sm"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cerrar
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            <div className="h-full flex">
              {/* Panel de herramientas lateral */}
              <div className="w-16 bg-gray-50 border-r flex flex-col items-center py-4 space-y-4">
                <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                  <FileText className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                  <Save className="h-4 w-4" />
                </Button>
                <Separator className="w-8" />
                <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                  <Download className="h-4 w-4" />
                </Button>
              </div>

              {/* Área principal del documento */}
              <div className="flex-1 flex flex-col">
                {/* Barra de herramientas superior */}
                <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">Página 1 de 1</span>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        -
                      </Button>
                      <span className="text-sm w-12 text-center">100%</span>
                      <Button variant="outline" size="sm">
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Rotar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Vista
                    </Button>
                  </div>
                </div>

                {/* Visor del documento */}
                <div className="flex-1 bg-gray-100 p-4 overflow-auto">
                  <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="h-[800px]">
                      <iframe
                        src={`/documentos_legales/${encodeURIComponent(
                          selectedMainDocument?.archivo || ""
                        )}`}
                        className="w-full h-full border-0"
                        title={selectedMainDocument?.nombre}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
