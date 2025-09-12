"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  Download,
  Eye,
  X,
  Calendar,
  Maximize2,
  Minimize2,
  Image as ImageIcon,
  File,
  AlertCircle,
} from "lucide-react";
import { DocumentoSolicitud } from "@/lib/mock-data";

interface RealDocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  documento: DocumentoSolicitud | null;
}

export default function RealDocumentViewer({
  isOpen,
  onClose,
  documento,
}: RealDocumentViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!documento) return null;

  const getFileType = (filename: string | File) => {
    if (typeof filename === "string") {
      const extension = filename?.split(".").pop()?.toLowerCase();
      return extension || "unknown";
    }
    // Si es un File object
    const name = filename.name || "";
    const extension = name?.split(".").pop()?.toLowerCase();
    return extension || "unknown";
  };

  const isImage = (filename: string | File) => {
    const imageTypes = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
    return imageTypes.includes(getFileType(filename));
  };

  const isPDF = (filename: string | File) => {
    return getFileType(filename) === "pdf";
  };

  const createFileUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  const getDocumentUrl = () => {
    if (!documento.subido || !documento.archivo) return null;

    // Si el documento tiene un archivo real subido, usar ese
    if (typeof documento.archivo === "object" && documento.archivo.name) {
      return createFileUrl(documento.archivo);
    }

    // Si es un string (nombre de archivo), usar la API
    return `/api/document/${documento.id}`;
  };

  const handleDownload = () => {
    if (!documento.archivo) return;

    const url = getDocumentUrl();
    if (!url) return;

    const link = document.createElement("a");
    link.href = url;
    link.download =
      typeof documento.archivo === "object" && documento.archivo.name
        ? documento.archivo.name
        : String(documento.archivo);
    link.click();
  };

  const handleViewFullscreen = () => {
    // Abrir en nueva pestaña para mejor visualización
    const documentUrl = getDocumentUrl();
    if (documentUrl) {
      window.open(
        documentUrl,
        "_blank",
        "width=1200,height=800,scrollbars=yes,resizable=yes"
      );
    }
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simular carga del archivo
      setIsLoading(true);
      setError(null);

      setTimeout(() => {
        setIsLoading(false);
        // En un sistema real, aquí se subiría el archivo al servidor
        console.log("Archivo cargado:", file);
      }, 1000);
    }
  };

  const renderDocumentContent = () => {
    if (!documento.subido || !documento.archivo) {
      return (
        <div className="h-full flex flex-col items-center justify-center bg-gray-50">
          <FileText className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">
            Este documento aún no ha sido subido
          </p>
          <Button onClick={() => fileInputRef.current?.click()}>
            Subir Documento
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      );
    }

    const fileType = getFileType(documento.archivo);

    if (isPDF(documento.archivo)) {
      const documentUrl = getDocumentUrl();
      if (!documentUrl) return null;

      return (
        <div className="h-full w-full bg-gray-100">
          <iframe
            src={documentUrl}
            className="w-full h-full border-0"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
            }}
            title={
              typeof documento.archivo === "object" && documento.archivo.name
                ? documento.archivo.name
                : String(documento.archivo)
            }
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setError("No se pudo cargar el documento PDF");
              setIsLoading(false);
            }}
          />
        </div>
      );
    }

    if (isImage(documento.archivo)) {
      const documentUrl = getDocumentUrl();
      if (!documentUrl) return null;

      return (
        <div className="h-full w-full flex items-center justify-center bg-gray-50">
          <img
            src={documentUrl}
            alt={
              typeof documento.archivo === "object" && documento.archivo.name
                ? documento.archivo.name
                : String(documento.archivo)
            }
            className="max-w-full max-h-full object-contain"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setError("No se pudo cargar la imagen");
              setIsLoading(false);
            }}
          />
        </div>
      );
    }

    // Para otros tipos de archivo, mostrar una vista previa básica
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-50">
        <File className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {typeof documento.archivo === "object" && documento.archivo.name
            ? documento.archivo.name
            : String(documento.archivo)}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Tipo de archivo: {fileType.toUpperCase()}
        </p>
        <p className="text-sm text-gray-500 mb-4 text-center max-w-md">
          {documento.descripcion}
        </p>
        <div className="flex gap-3">
          <Button
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Descargar
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[100vh] w-[100vw] max-w-none h-[100vh] p-0">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              {documento.nombre}
            </DialogTitle>
            <DialogDescription>
              Vista previa del documento subido
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Información rápida del documento */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mx-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {documento.fechaSubida
                      ? new Date(documento.fechaSubida).toLocaleDateString(
                          "es-MX"
                        )
                      : "No especificada"}
                  </span>
                </div>
                <Badge
                  variant={documento.subido ? "default" : "outline"}
                  className={
                    documento.subido ? "bg-green-100 text-green-800" : ""
                  }
                >
                  {documento.subido ? "Completado" : "Pendiente"}
                </Badge>
                <span className="text-sm text-gray-500">
                  {typeof documento.archivo === "object" &&
                  documento.archivo.name
                    ? documento.archivo.name.split(".").pop()?.toUpperCase() ||
                      "N/A"
                    : typeof documento.archivo === "string"
                    ? documento.archivo.split(".").pop()?.toUpperCase() || "N/A"
                    : "N/A"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleViewFullscreen}
                >
                  <Maximize2 className="h-4 w-4 mr-1" />
                  Pantalla Completa
                </Button>
                <Button size="sm" onClick={handleDownload} variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Descargar
                </Button>
              </div>
            </div>

            {/* Vista previa del documento */}
            <div className="flex-1">
              <div className="h-[85vh] overflow-hidden relative bg-gray-50">
                {isLoading && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">
                        Cargando documento...
                      </p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="h-full flex flex-col items-center justify-center bg-red-50">
                    <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={() => setError(null)} variant="outline">
                      Reintentar
                    </Button>
                  </div>
                )}

                {!error && renderDocumentContent()}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-between items-center p-4 border-t mx-6">
              <div className="text-sm text-gray-600">
                <strong>Descripción:</strong> {documento.descripcion}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose}>
                  <X className="h-4 w-4 mr-2" />
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de pantalla completa */}
      {isFullscreen && (
        <Dialog open={isFullscreen} onOpenChange={handleCloseFullscreen}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
            <div className="flex flex-col h-[95vh]">
              {/* Header de pantalla completa */}
              <div className="flex items-center justify-between p-4 border-b bg-white">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium">{documento.nombre}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={handleDownload} variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Descargar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCloseFullscreen}
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Contenido de pantalla completa */}
              <div className="flex-1 p-4 bg-gray-50">
                <div className="h-full border rounded-lg overflow-hidden bg-white">
                  {isLoading && (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando documento...</p>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="h-full flex flex-col items-center justify-center bg-red-50">
                      <AlertCircle className="h-16 w-16 text-red-400 mb-4" />
                      <p className="text-red-600 mb-4 text-lg">{error}</p>
                      <Button onClick={() => setError(null)} variant="outline">
                        Reintentar
                      </Button>
                    </div>
                  )}

                  {!error && (
                    <div className="h-full">{renderDocumentContent()}</div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
