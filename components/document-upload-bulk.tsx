"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  FileText,
  CheckCircle2,
  X,
  Eye,
  RefreshCw,
  AlertCircle,
  Download,
} from "lucide-react";
import { DocumentoSolicitud } from "@/lib/mock-data";

interface DocumentUploadBulkProps {
  documentosRequeridos: DocumentoSolicitud[];
  onDocumentosSubidos: (documentos: { [key: number]: File }) => void;
  onDocumentoReemplazado: (documentoId: number, archivo: File) => void;
  onDocumentoEliminado: (documentoId: number) => void;
  onVerDocumento: (documentoId: number) => void;
  onDocumentoIndividual: (documentoId: number, archivo: File) => void;
  bloqueado?: boolean;
}

interface DocumentoSubido {
  id: number;
  archivo: File;
  fechaSubida: string;
  clasificacionAutomatica: boolean;
  documentoRequerido: DocumentoSolicitud;
}

export default function DocumentUploadBulk({
  documentosRequeridos,
  onDocumentosSubidos,
  onDocumentoReemplazado,
  onDocumentoEliminado,
  onVerDocumento,
  onDocumentoIndividual,
  bloqueado = false,
}: DocumentUploadBulkProps) {
  const [documentosSubidos, setDocumentosSubidos] = useState<DocumentoSubido[]>(
    []
  );
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Función para clasificar automáticamente un documento
  const clasificarDocumento = (
    archivo: File,
    documentosRequeridos: DocumentoSolicitud[]
  ): DocumentoSolicitud | null => {
    const nombreArchivo = archivo.name.toLowerCase();

    // Palabras clave para cada tipo de documento
    const palabrasClave = {
      1: [
        "ine",
        "identificacion",
        "identificación",
        "credencial",
        "pasaporte",
        "cedula",
        "cédula",
      ],
      2: [
        "domicilio",
        "recibo",
        "luz",
        "agua",
        "telefono",
        "teléfono",
        "gas",
        "predial",
      ],
      3: ["acta", "nacimiento", "birth", "certificado"],
      4: [
        "matrimonio",
        "divorcio",
        "solteria",
        "soltería",
        "estado civil",
        "civil",
      ],
      5: [
        "bienes",
        "propiedades",
        "inventario",
        "lista",
        "testamento",
        "herencia",
      ],
    };

    // Buscar coincidencias
    for (const [id, palabras] of Object.entries(palabrasClave)) {
      const documentoId = parseInt(id);
      const documento = documentosRequeridos.find((d) => d.id === documentoId);

      if (
        documento &&
        palabras.some((palabra) => nombreArchivo.includes(palabra))
      ) {
        return documento;
      }
    }

    // Si no se encuentra coincidencia, retornar null para clasificación manual
    return null;
  };

  const handleFiles = async (files: FileList) => {
    setIsUploading(true);
    const nuevosDocumentos: DocumentoSubido[] = [];
    const documentosPorId: { [key: number]: File } = {};

    for (let i = 0; i < files.length; i++) {
      const archivo = files[i];
      const documentoRequerido = clasificarDocumento(
        archivo,
        documentosRequeridos
      );

      if (documentoRequerido) {
        const documentoSubido: DocumentoSubido = {
          id: documentoRequerido.id,
          archivo,
          fechaSubida: new Date().toISOString().split("T")[0],
          clasificacionAutomatica: true,
          documentoRequerido,
        };

        nuevosDocumentos.push(documentoSubido);
        documentosPorId[documentoRequerido.id] = archivo;
      }
    }

    // Actualizar estado
    setDocumentosSubidos((prev) => [...prev, ...nuevosDocumentos]);
    onDocumentosSubidos(documentosPorId);
    setIsUploading(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (bloqueado) return;

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (bloqueado) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (bloqueado) return;

    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleReemplazar = (documentoId: number, archivo: File) => {
    onDocumentoReemplazado(documentoId, archivo);

    setDocumentosSubidos((prev) =>
      prev.map((doc) =>
        doc.id === documentoId
          ? {
              ...doc,
              archivo,
              fechaSubida: new Date().toISOString().split("T")[0],
            }
          : doc
      )
    );
  };

  const handleEliminar = (documentoId: number) => {
    onDocumentoEliminado(documentoId);
    setDocumentosSubidos((prev) =>
      prev.filter((doc) => doc.id !== documentoId)
    );
  };

  const handleSubidaIndividual = (documentoId: number) => {
    if (bloqueado) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.jpg,.jpeg,.png,.doc,.docx";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onDocumentoIndividual(documentoId, file);

        // Actualizar estado local
        const documentoRequerido = documentosRequeridos.find(
          (d) => d.id === documentoId
        );
        if (documentoRequerido) {
          const documentoSubido: DocumentoSubido = {
            id: documentoId,
            archivo: file,
            fechaSubida: new Date().toISOString().split("T")[0],
            clasificacionAutomatica: false,
            documentoRequerido,
          };

          setDocumentosSubidos((prev) => {
            const exists = prev.some((doc) => doc.id === documentoId);
            if (exists) {
              return prev.map((doc) =>
                doc.id === documentoId ? documentoSubido : doc
              );
            } else {
              return [...prev, documentoSubido];
            }
          });
        }
      }
    };
    input.click();
  };

  const documentosPendientes = documentosRequeridos.filter(
    (doc) => !documentosSubidos.some((subido) => subido.id === doc.id)
  );

  return (
    <div className="space-y-6">
      {/* Zona de subida */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-emerald-600" />
            Subir Documentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              bloqueado
                ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-50"
                : dragActive
                ? "border-emerald-500 bg-emerald-50"
                : "border-gray-300 hover:border-emerald-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Arrastra y suelta tus documentos aquí
            </p>
            <p className="text-sm text-gray-600 mb-4">
              O haz clic para seleccionar archivos
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || bloqueado}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Seleccionar Archivos
                </>
              )}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>

          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              El sistema clasificará automáticamente tus documentos según su
              nombre y contenido. Puedes subir múltiples archivos a la vez.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Documentos subidos */}
      {documentosSubidos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              Documentos Subidos ({documentosSubidos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documentosSubidos.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-emerald-200 bg-emerald-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-emerald-600" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {doc.documentoRequerido.nombre}
                      </p>
                      <p className="text-sm text-gray-600">
                        {doc.archivo.name} • {doc.fechaSubida}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {doc.clasificacionAutomatica
                            ? "Auto-clasificado"
                            : "Manual"}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Completado
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onVerDocumento(doc.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = ".pdf,.jpg,.jpeg,.png,.doc,.docx";
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement)
                            .files?.[0];
                          if (file) handleReemplazar(doc.id, file);
                        };
                        input.click();
                      }}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEliminar(doc.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documentos pendientes */}
      {documentosPendientes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              Documentos Pendientes ({documentosPendientes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documentosPendientes.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-amber-200 bg-amber-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-amber-600" />
                    <div>
                      <p className="font-medium text-gray-900">{doc.nombre}</p>
                      <p className="text-sm text-gray-600">{doc.descripcion}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-amber-700 border-amber-300"
                    >
                      Pendiente
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => handleSubidaIndividual(doc.id)}
                      disabled={bloqueado}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Subir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
