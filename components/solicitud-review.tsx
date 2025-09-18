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

    if (tramiteType.includes("compraventa") || tramiteType.includes("escritura")) {
      return {
        nombre: "Documentos de Compraventa",
        archivo: "Contrato_Compraventa_Tijuana_Dummy_FirmasEspaciadas%20(1).docx.pdf",
        descripcion: "Documentos requeridos para el trámite de compraventa",
        tipo: "compraventa",
        documentos: [
          { id: 1, nombre: "Identificación Oficial", descripcion: "INE o pasaporte vigente", subido: true },
          { id: 2, nombre: "CURP", descripcion: "Clave Única de Registro de Población", subido: true },
          { id: 3, nombre: "RFC y Constancia de Situación Fiscal (CSF)", descripcion: "Registro Federal de Contribuyentes y constancia de situación fiscal", subido: true },
          { id: 4, nombre: "Acta de Nacimiento", descripcion: "Acta de nacimiento reciente o legible", subido: true },
          { id: 5, nombre: "Comprobante de Domicilio", descripcion: "Agua/luz/estado de cuenta, no mayor a 3 meses", subido: true },
          { id: 6, nombre: "Datos Bancarios", descripcion: "CLABE y banco para dispersión y comprobación de fondos", subido: true },
          { id: 7, nombre: "Acta de Matrimonio", descripcion: "Acta de matrimonio (si aplica)", subido: false },
          { id: 8, nombre: "Carta oferta", descripcion: "Carta oferta o condiciones del banco", subido: true },
          { id: 9, nombre: "Avalúo Bancario", descripcion: "Avalúo bancario (si el banco lo exige; a veces lo gestiona el banco)", subido: false },
          { id: 10, nombre: "Pólizas Requeridas por el Crédito", descripcion: "Pólizas de vida/daños, si aplican", subido: false },
          { id: 11, nombre: "Instrucciones de Dispersión del Banco", descripcion: "Instrucciones de dispersión del banco y datos del representante que firmará la hipoteca", subido: false }
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
        {/* Panel Completo - Visor de Documentos */}
        <div className="w-full bg-white">
          {(getMainDocument().tipo === "compraventa" || solicitud.tipoTramite.toLowerCase().includes("escritura")) ? (
            // Vista especial para compraventa - solo visor de documentos
            <div className="h-full flex">
              {/* Panel izquierdo - Lista de documentos */}
              <div className="w-1/2 p-4 overflow-y-auto border-r border-gray-200">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    {getMainDocument().nombre}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {getMainDocument().descripcion}
                  </p>
                </div>
                
                <div className="space-y-1.5">
                  {getMainDocument().documentos?.map((doc: any) => (
                    <div
                      key={doc.id}
                      className="bg-gray-50 rounded-lg border border-gray-100 p-2.5 hover:bg-gray-100 hover:border-gray-200 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-6 h-6 bg-blue-50 rounded-md flex items-center justify-center flex-shrink-0">
                            <FileText className="h-3.5 w-3.5 text-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xs font-medium text-gray-800 truncate leading-tight">
                              {doc.nombre}
                            </h3>
                            <p className="text-xs text-gray-500 truncate leading-tight mt-0.5">
                              {doc.descripcion}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Badge 
                            variant={doc.subido ? "default" : "secondary"}
                            className={`text-xs px-1.5 py-0.5 h-5 ${doc.subido ? "bg-green-100 text-green-600 border-green-200" : "bg-amber-100 text-amber-600 border-amber-200"}`}
                          >
                            {doc.subido ? "✓" : "⏳"}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded"
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
                  <h3 className="text-sm font-medium text-gray-900">Contrato de Compraventa</h3>
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
            // Vista normal para otros tipos de trámites
            <div className="p-6">
              <div className="text-center text-gray-500">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Vista normal para otros tipos de trámites</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Documento Principal */}
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
          <div className="flex-1 overflow-hidden">
            {/* Barra de herramientas superior - ULTRA COMPACTA */}
            <div className="bg-gray-100 border-b px-2 py-1 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <span className="text-xs font-medium">
                  {selectedMainDocument?.nombre}
                </span>
                <span className="text-xs text-gray-500">
                  {selectedMainDocument?.descripcion}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  onClick={() => setShowDocumentModal(false)}
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Cerrar
                </Button>
                <Button
                  onClick={() => {
                    const url = `/documentos_legales/${encodeURIComponent(
                      selectedMainDocument?.archivo || ""
                    )}`;
                    window.open(url, "_blank");
                  }}
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Nueva Pestaña
                </Button>
                <Button
                  onClick={() => {
                    const url = `/documentos_legales/${encodeURIComponent(
                      selectedMainDocument?.archivo || ""
                    )}`;
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = selectedMainDocument?.archivo || "";
                    link.click();
                  }}
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Descargar
                </Button>
              </div>
            </div>

            {/* Visor de PDF - Aplicando los mismos estilos del panel de abogados */}
            <div className="flex-1 relative bg-gray-100" style={{ width: "100%" }}>
              <div className="h-full w-full overflow-hidden">
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
                  onLoad={() =>
                    console.log(
                      "PDF loaded:",
                      selectedMainDocument?.archivo
                    )
                  }
                  onError={() =>
                    console.log(
                      "Error loading PDF:",
                      selectedMainDocument?.archivo
                    )
                  }
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
