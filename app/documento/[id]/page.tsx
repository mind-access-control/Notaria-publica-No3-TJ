"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Printer, FileText } from "lucide-react";

// Simulación de base de datos de documentos
const documentosDB: { [key: string]: any } = {
  // Los documentos se almacenarían aquí en un sistema real
};

export default function DocumentoPage() {
  const params = useParams();
  const documentId = params.id as string;
  const [documento, setDocumento] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar documento desde localStorage
    const loadDocument = async () => {
      setLoading(true);

      // Simular delay de carga
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Buscar documento en localStorage
      const documentosAlmacenados = JSON.parse(
        localStorage.getItem("documentosCompartidos") || "{}"
      );
      const documentoEncontrado = documentosAlmacenados[documentId];

      if (documentoEncontrado) {
        setDocumento(documentoEncontrado);
      } else {
        // Si no se encuentra, mostrar documento no encontrado
        setDocumento(null);
      }

      setLoading(false);
    };

    loadDocument();
  }, [documentId]);

  const handleImprimir = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow && documento) {
      const content = `
        <html>
          <head>
            <title>${documento.tramite} - ${documento.cliente}</title>
            <style>
              body { font-family: 'Times New Roman', serif; margin: 20px; line-height: 1.6; }
              .header { text-align: center; margin-bottom: 30px; }
              .content { max-width: 800px; margin: 0 auto; }
              .documento { white-space: pre-line; }
              .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="content">
              <div class="header">
                <h1>${documento.tramite}</h1>
                <p>${documento.notaria}</p>
              </div>
              
              <div class="documento">${documento.contenido}</div>
              
              <div class="footer">
                <p>Documento generado el ${documento.fecha}</p>
                <p>${documento.notaria} - Sistema de Gestión de Expedientes</p>
                <p>ID del documento: ${documento.id}</p>
              </div>
            </div>
          </body>
        </html>
      `;
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDescargar = () => {
    if (!documento) return;

    const blob = new Blob([documento.contenido], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${documento.tramite}_${
      documento.cliente
    }_${documento.fecha.replace(/\//g, "-")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando documento...</p>
        </div>
      </div>
    );
  }

  if (!documento) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">
              Documento no encontrado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              El documento solicitado no existe o ha expirado.
            </p>
            <Button onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {documento.tramite}
              </h1>
              <p className="text-gray-600 mt-2">Cliente: {documento.cliente}</p>
            </div>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-300"
            >
              {documento.estado}
            </Badge>
          </div>
        </div>

        {/* Información del documento */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Información del Documento</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Trámite</p>
                <p className="font-medium">{documento.tramite}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cliente</p>
                <p className="font-medium">{documento.cliente}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha de generación</p>
                <p className="font-medium">{documento.fecha}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Notaría</p>
                <p className="font-medium">{documento.notaria}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">ID del documento</p>
                <p className="font-medium font-mono text-sm">{documento.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Expira el</p>
                <p className="font-medium">{documento.expiracion}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documento */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Contenido del Documento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white border rounded-lg p-6">
              <div className="whitespace-pre-line text-sm leading-relaxed">
                {documento.contenido}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acciones */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleImprimir}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Printer className="h-4 w-4" />
                <span>Imprimir</span>
              </Button>
              <Button
                onClick={handleDescargar}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Descargar</span>
              </Button>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Importante:</strong> Este documento ha sido generado
                automáticamente y debe ser revisado y firmado ante notario
                público para tener validez legal.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
