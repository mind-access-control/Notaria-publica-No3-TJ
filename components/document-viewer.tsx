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
import { FileText, Download, Eye, X, Calendar, User } from "lucide-react";
import { DocumentoSolicitud } from "@/lib/mock-data";

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  documento: DocumentoSolicitud | null;
}

export default function DocumentViewer({
  isOpen,
  onClose,
  documento,
}: DocumentViewerProps) {
  if (!documento) return null;

  const handleDownload = () => {
    // En un sistema real, aquí se descargaría el archivo
    alert(`Descargando: ${documento.archivo}`);
  };

  const handleView = () => {
    // En un sistema real, aquí se abriría el visor de PDF
    // Por ahora simulamos abriendo el documento en una nueva pestaña
    const url = `#documento-${documento.id}`;
    window.open(url, '_blank');
    
    // Cerrar el modal después de abrir el documento
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-600" />
            {documento.nombre}
          </DialogTitle>
          <DialogDescription>
            Información detallada del documento subido
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del documento */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detalles del Documento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Nombre del archivo
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {documento.archivo || "No especificado"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Fecha de subida
                  </label>
                  <p className="text-sm text-gray-900 mt-1 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {documento.fechaSubida
                      ? new Date(documento.fechaSubida).toLocaleDateString(
                          "es-MX"
                        )
                      : "No especificada"}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Descripción
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {documento.descripcion}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={documento.subido ? "default" : "outline"}
                  className={
                    documento.subido ? "bg-green-100 text-green-800" : ""
                  }
                >
                  {documento.subido ? "Completado" : "Pendiente"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Vista previa del documento */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vista Previa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {documento.archivo || "Documento no disponible"}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  {documento.subido
                    ? "Haz clic en 'Ver Documento' para abrir el visor"
                    : "Este documento aún no ha sido subido"}
                </p>

                {documento.subido && (
                  <div className="flex justify-center gap-3">
                    <Button
                      onClick={handleView}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Documento
                    </Button>
                    <Button onClick={handleDownload} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Información técnica */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información Técnica</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium text-gray-600">
                    Tipo de archivo
                  </label>
                  <p className="text-gray-900">
                    {documento.archivo
                      ? documento.archivo.split(".").pop()?.toUpperCase() ||
                        "Desconocido"
                      : "No disponible"}
                  </p>
                </div>

                <div>
                  <label className="font-medium text-gray-600">Estado</label>
                  <p className="text-gray-900">
                    {documento.subido
                      ? "Subido correctamente"
                      : "Pendiente de subir"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
