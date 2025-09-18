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
  const [erroresValidacion, setErroresValidacion] = useState<{[key: string]: string}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Función para validar si el nombre del documento es apropiado - VALIDACIÓN HÍBRIDA
  const validarNombreDocumento = (
    archivo: File,
    documentoRequerido: DocumentoSolicitud
  ): boolean => {
    const nombreArchivo = archivo.name.toLowerCase();
    const nombreDocumento = documentoRequerido.nombre.toLowerCase();
    
    // Remover la extensión del archivo para comparar solo el nombre
    const nombreSinExtension = nombreArchivo.replace(/\.[^/.]+$/, "");
    
    // Solo aplicar validación estricta en los dos últimos campos (ID 10 y 11)
    const camposEstrictos = [10, 11]; // Pólizas y Instrucciones de Dispersión
    
    // Campos que pasan sin validación (muy permisivos)
    const camposPermisivos = [6]; // Datos Bancarios
    
    if (camposEstrictos.includes(documentoRequerido.id)) {
      // Validación LITERAL para los dos últimos campos
      return nombreSinExtension.includes(nombreDocumento);
    } else if (camposPermisivos.includes(documentoRequerido.id)) {
      // Campos muy permisivos - pasan sin validación
      return true;
    } else {
      // Validación más flexible para los demás campos usando palabras clave
      const palabrasClaveEspecificas = {
        "identificación oficial": ["ine", "identificacion", "identificación", "credencial", "pasaporte", "cedula", "cédula", "oficial"],
        "curp": ["curp", "clave", "unica", "única", "registro", "poblacion", "población"],
        "rfc y constancia de situación fiscal (csf)": ["rfc", "fiscal", "situacion", "situación", "constancia", "csf", "certificate", "tax", "rfc y", "constancia de", "situacion fiscal"],
        "acta de nacimiento": ["nacimiento", "birth", "certificado", "certificate", "nacido", "born"],
        "comprobante de domicilio": ["comprobante", "domicilio", "recibo", "luz", "agua", "telefono", "teléfono", "predial", "estado", "cuenta"],
        "datos bancarios": ["clabe", "dispersión", "fondos", "cuenta", "bancaria", "instrucciones", "representante", "hipoteca"],
        "acta de matrimonio": ["matrimonio", "marriage", "certificado", "certificate", "casado", "married", "esposo", "esposa"],
        "carta oferta": ["carta", "oferta", "condiciones", "offer", "letter", "credito", "crédito", "financiamiento"],
        "avaluo bancario": ["avaluo", "avaluó", "appraisal", "valor", "tasacion", "tasación", "inmueble", "propiedad", "avaluo bancario", "avaluó bancario", "bancario", "banco"]
      };

      const palabrasClave = palabrasClaveEspecificas[nombreDocumento as keyof typeof palabrasClaveEspecificas];
      
      if (!palabrasClave) return true; // Si no hay palabras clave específicas, permitir
      
      // Verificar si el nombre del archivo contiene alguna palabra clave
      return palabrasClave.some(palabra => nombreArchivo.includes(palabra));
    }
  };

  // Función para clasificar automáticamente un documento
  const clasificarDocumento = (
    archivo: File,
    documentosRequeridos: DocumentoSolicitud[]
  ): DocumentoSolicitud | null => {
    const nombreArchivo = archivo.name.toLowerCase();

    // Palabras clave para cada tipo de documento - ULTRA ESPECÍFICAS
    const palabrasClave = {
      1: [
        "ine",
        "identificacion",
        "identificación",
        "credencial",
        "pasaporte",
        "cedula",
        "cédula",
        "oficial",
      ],
      2: [
        "curp",
        "clave",
        "unica",
        "única",
        "registro",
        "poblacion",
        "población",
      ],
      3: [
        "rfc",
        "fiscal",
        "situacion",
        "situación",
        "constancia",
        "csf",
        "certificate",
        "tax",
      ],
      4: [
        "nacimiento",
        "birth",
        "certificado",
        "certificate",
        "nacido",
        "born",
      ],
      5: [
        "comprobante",
        "domicilio",
        "recibo",
        "luz",
        "agua",
        "telefono",
        "teléfono",
        "predial",
        "estado",
        "cuenta",
      ],
      6: [
        "datos",
        "bancarios",
        "clabe",
        "dispersión",
        "fondos",
        "cuenta",
        "bancaria",
        "instrucciones",
        "representante",
        "hipoteca",
      ],
      7: [
        "matrimonio",
        "marriage",
        "certificado",
        "certificate",
        "casado",
        "married",
        "esposo",
        "esposa",
      ],
      8: [
        "carta",
        "oferta",
        "condiciones",
        "offer",
        "letter",
        "credito",
        "crédito",
        "financiamiento",
      ],
      9: [
        "avaluo",
        "avaluó",
        "bancario",
        "appraisal",
        "valor",
        "tasacion",
        "tasación",
        "inmueble",
        "propiedad",
      ],
      10: [
        "polizas",
        "pólizas",
        "vida",
        "daños",
        "damage",
        "insurance",
        "seguro",
      ],
      11: [
        "instrucciones",
        "dispersión",
        "representante",
        "hipoteca",
        "mortgage",
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
    const nuevosErrores: {[key: string]: string} = {};

    for (let i = 0; i < files.length; i++) {
      const archivo = files[i];
      const documentoRequerido = clasificarDocumento(
        archivo,
        documentosRequeridos
      );

      if (documentoRequerido) {
        // Validar el nombre del documento
        const esValido = validarNombreDocumento(archivo, documentoRequerido);
        
        if (esValido) {
          // Solo permitir subir si el nombre es válido
          const documentoSubido: DocumentoSubido = {
            id: documentoRequerido.id,
            archivo,
            fechaSubida: new Date().toISOString().split("T")[0],
            clasificacionAutomatica: true,
            documentoRequerido,
          };

          nuevosDocumentos.push(documentoSubido);
          documentosPorId[documentoRequerido.id] = archivo;
        } else {
          // Si no es válido, mostrar error sobre el campo donde se intentó subir
          nuevosErrores[`campo-${documentoRequerido.id}`] = `❌ El archivo "${archivo.name}" no es un ${documentoRequerido.nombre.toLowerCase()}. Por favor, sube el documento correcto para este campo.`;
        }
      } else {
        // Documento no clasificado automáticamente
        nuevosErrores[archivo.name] = `No se pudo clasificar automáticamente el archivo "${archivo.name}". Por favor, sube este documento individualmente desde la lista de documentos pendientes.`;
      }
    }

    // Actualizar estado
    setDocumentosSubidos((prev) => [...prev, ...nuevosDocumentos]);
    setErroresValidacion((prev) => ({...prev, ...nuevosErrores}));
    
    if (Object.keys(documentosPorId).length > 0) {
      onDocumentosSubidos(documentosPorId);
    }
    
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
    const documentoRequerido = documentosRequeridos.find(
      (d) => d.id === documentoId
    );
    
    if (documentoRequerido) {
      // Validar el nombre del documento
      const esValido = validarNombreDocumento(archivo, documentoRequerido);
      
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
      
      // Limpiar errores previos para este documento
      setErroresValidacion((prev) => {
        const nuevosErrores = {...prev};
        // Eliminar errores de archivos anteriores para este documento
        Object.keys(nuevosErrores).forEach(nombreArchivo => {
          const documentoAnterior = documentosSubidos.find(doc => 
            doc.id === documentoId && doc.archivo?.name === nombreArchivo
          );
          if (documentoAnterior) {
            delete nuevosErrores[nombreArchivo];
          }
        });
        return nuevosErrores;
      });
      
      if (!esValido) {
        // Mostrar advertencia de validación pero permitir continuar
        setErroresValidacion((prev) => ({
          ...prev,
          [archivo.name]: `⚠️ El archivo "${archivo.name}" no parece ser un ${documentoRequerido.nombre.toLowerCase()}. Por favor, verifica que estés subiendo el documento correcto.`
        }));
      }
    }
  };

  const handleEliminar = (documentoId: number) => {
    onDocumentoEliminado(documentoId);
    setDocumentosSubidos((prev) =>
      prev.filter((doc) => doc.id !== documentoId)
    );
    
    // También limpiar errores de validación para este documento
    setErroresValidacion((prev) => {
      const nuevosErrores = {...prev};
      // Buscar y eliminar errores relacionados con este documento
      Object.keys(nuevosErrores).forEach(nombreArchivo => {
        const documento = documentosSubidos.find(doc => 
          doc.id === documentoId && doc.archivo?.name === nombreArchivo
        );
        if (documento) {
          delete nuevosErrores[nombreArchivo];
        }
      });
      return nuevosErrores;
    });
  };

  const handleSubidaIndividual = (documentoId: number) => {
    if (bloqueado) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.jpg,.jpeg,.png,.doc,.docx";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const documentoRequerido = documentosRequeridos.find(
          (d) => d.id === documentoId
        );
        
        if (documentoRequerido) {
          // Validar el nombre del documento
          const esValido = validarNombreDocumento(file, documentoRequerido);
          
          if (esValido) {
            // Solo permitir subir si el nombre es válido
            onDocumentoIndividual(documentoId, file);

            // Actualizar estado local
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
            
            // Limpiar errores previos para este documento
            setErroresValidacion((prev) => {
              const nuevosErrores = {...prev};
              // Eliminar errores de archivos anteriores para este documento
              Object.keys(nuevosErrores).forEach(nombreArchivo => {
                const documentoAnterior = documentosSubidos.find(doc => 
                  doc.id === documentoId && doc.archivo?.name === nombreArchivo
                );
                if (documentoAnterior) {
                  delete nuevosErrores[nombreArchivo];
                }
              });
              // Eliminar error de campo para este documento
              delete nuevosErrores[`campo-${documentoId}`];
              return nuevosErrores;
            });
            
            console.log(`Documento ${file.name} validado correctamente para ${documentoRequerido.nombre}`);
          } else {
            // Si no es válido, mostrar error sobre el campo donde se intentó subir
            setErroresValidacion((prev) => ({
              ...prev,
              [`campo-${documentoId}`]: `❌ El archivo "${file.name}" no es un ${documentoRequerido.nombre.toLowerCase()}. Por favor, sube el documento correcto para este campo.`
            }));
          }
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
            Subir Documentos para Compraventa
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
              Arrastra y suelta los documentos de compraventa aquí
            </p>
            <p className="text-sm text-gray-600 mb-4">
              O haz clic para seleccionar archivos (escrituras, avalúos, RFC, etc.)
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
                  Seleccionar Documentos
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
              <strong>Para trámite de Compraventa:</strong> El sistema clasificará automáticamente tus documentos según su
              nombre y contenido. Puedes subir múltiples archivos a la vez. Asegúrate de incluir todos los documentos
              requeridos tanto del comprador como del vendedor.
            </AlertDescription>
          </Alert>

          {/* Mostrar advertencias de validación */}
          {Object.keys(erroresValidacion).length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium text-amber-800">⚠️ Advertencias de Validación:</h4>
              {Object.entries(erroresValidacion).map(([nombreArchivo, error]) => {
                // Buscar el documento requerido correspondiente
                const documentoRequerido = documentosRequeridos.find(doc => 
                  documentosSubidos.some(subido => 
                    subido.archivo?.name === nombreArchivo && subido.id === doc.id
                  )
                );
                
                return (
                  <div key={nombreArchivo} className="flex items-center justify-between p-4 border border-amber-200 bg-amber-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-6 w-6 text-amber-600" />
                      <div>
                        <p className="font-medium text-amber-900">{nombreArchivo}</p>
                        <p className="text-sm text-amber-700">{error}</p>
                        {documentoRequerido && (
                          <p className="text-xs text-amber-600 mt-1">
                            Documento esperado: {documentoRequerido.nombre}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs text-amber-700 border-amber-300">
                            No clasificado
                          </Badge>
                          <Badge variant="secondary" className="text-xs text-amber-700">
                            Pendiente
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (documentoRequerido) {
                            handleSubidaIndividual(documentoRequerido.id);
                          }
                        }}
                        className="text-amber-700 border-amber-300 hover:bg-amber-100"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (documentoRequerido) {
                            handleSubidaIndividual(documentoRequerido.id);
                          }
                        }}
                        className="text-amber-700 border-amber-300 hover:bg-amber-100"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setErroresValidacion((prev) => {
                            const nuevosErrores = {...prev};
                            delete nuevosErrores[nombreArchivo];
                            return nuevosErrores;
                          });
                        }}
                        className="text-amber-700 border-amber-300 hover:bg-amber-100"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
              {documentosPendientes.map((doc) => {
                const errorCampo = erroresValidacion[`campo-${doc.id}`];
                return (
                  <div
                    key={doc.id}
                    className={`flex items-center justify-between p-4 border rounded-lg ${
                      errorCampo 
                        ? 'border-red-200 bg-red-50' 
                        : 'border-amber-200 bg-amber-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className={`h-6 w-6 ${errorCampo ? 'text-red-600' : 'text-amber-600'}`} />
                      <div>
                        <p className="font-medium text-gray-900">{doc.nombre}</p>
                        <p className="text-sm text-gray-600">{doc.descripcion}</p>
                        {errorCampo && (
                          <p className="text-sm text-red-600 mt-1 font-medium">
                            {errorCampo}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`${
                          errorCampo 
                            ? 'text-red-700 border-red-300' 
                            : 'text-amber-700 border-amber-300'
                        }`}
                      >
                        {errorCampo ? 'Error' : 'Pendiente'}
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => handleSubidaIndividual(doc.id)}
                        disabled={bloqueado}
                        className={`${
                          errorCampo 
                            ? 'bg-red-600 hover:bg-red-700' 
                            : 'bg-amber-600 hover:bg-amber-700'
                        }`}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Subir
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
