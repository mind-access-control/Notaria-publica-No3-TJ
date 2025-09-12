"use client";

import { useState } from "react";
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
import { FileText, Download, Eye, X, Calendar, Maximize2, Minimize2 } from "lucide-react";
import { DocumentoSolicitud } from "@/lib/mock-data";

interface DocumentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  documento: DocumentoSolicitud | null;
}

export default function DocumentPreview({
  isOpen,
  onClose,
  documento,
}: DocumentPreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!documento) return null;

  const handleDownload = () => {
    // En un sistema real, aquí se descargaría el archivo
    alert(`Descargando: ${documento.archivo}`);
  };

  const handleViewFullscreen = () => {
    setIsFullscreen(true);
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
  };

  const handleOpenDocument = () => {
    // En un sistema real, aquí se abriría el visor de PDF
    const url = `#documento-${documento.id}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={`${isFullscreen ? 'max-w-[98vw] w-[98vw] max-h-[98vh] h-[98vh]' : 'max-w-[98vw] w-[98vw] max-h-[90vh] h-[90vh]'} p-0 m-0`}>
          <DialogHeader>
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
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {documento.fechaSubida 
                      ? new Date(documento.fechaSubida).toLocaleDateString('es-MX')
                      : "No especificada"
                    }
                  </span>
                </div>
                <Badge 
                  variant={documento.subido ? "default" : "outline"}
                  className={documento.subido ? "bg-green-100 text-green-800" : ""}
                >
                  {documento.subido ? "Completado" : "Pendiente"}
                </Badge>
                <span className="text-sm text-gray-500">
                  {documento.archivo?.split('.').pop()?.toUpperCase() || "N/A"}
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
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleOpenDocument}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Abrir en Nueva Pestaña
                </Button>
              </div>
            </div>

            {/* Vista previa del documento */}
            <Card className="flex-1 w-full">
              <CardContent className="p-0">
                <div className={`${isFullscreen ? 'h-[85vh]' : 'h-[75vh]'} w-full border rounded-lg overflow-hidden`}>
                  {documento.subido ? (
                    <div className="h-full flex flex-col items-center justify-center bg-white">
                      <FileText className="h-24 w-24 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {documento.archivo}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 text-center max-w-md">
                        {documento.descripcion}
                      </p>
                      <div className="flex gap-3">
                        <Button onClick={handleOpenDocument} className="bg-blue-600 hover:bg-blue-700">
                          <Eye className="h-4 w-4 mr-2" />
                          Abrir Documento
                        </Button>
                        <Button onClick={handleDownload} variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Descargar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center">
                      <FileText className="h-16 w-16 text-gray-300 mb-4" />
                      <p className="text-gray-500">Este documento aún no ha sido subido</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Botones de acción */}
            <div className="flex justify-between items-center pt-4 border-t">
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleOpenDocument}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Abrir en Nueva Pestaña
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
                <div className="h-full flex flex-col items-center justify-center bg-white rounded-lg">
                  <FileText className="h-32 w-32 text-gray-400 mb-6" />
                  <h3 className="text-2xl font-medium text-gray-900 mb-4">
                    {documento.archivo}
                  </h3>
                  <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl">
                    {documento.descripcion}
                  </p>
                  <div className="flex gap-4">
                    <Button 
                      onClick={handleOpenDocument} 
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Eye className="h-5 w-5 mr-2" />
                      Abrir Documento
                    </Button>
                    <Button 
                      onClick={handleDownload} 
                      variant="outline" 
                      size="lg"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Descargar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
