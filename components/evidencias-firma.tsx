"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  FileText, 
  Fingerprint, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  User,
  Users,
  ChevronDown
} from "lucide-react";

interface DocumentoEvidencia {
  id: string;
  archivo: File;
  fechaSubida: Date;
  estado: "validando" | "aprobado" | "rechazado";
  nombreArchivo: string;
}

interface Evidencia {
  id: string;
  tipo: "copia_firmada" | "huella_digital";
  firmante: string;
  rol: "comprador" | "vendedor" | "ambas_partes";
  documentos: DocumentoEvidencia[];
  estado: "pendiente" | "completada";
}

interface EvidenciasFirmaProps {
  comprador: string;
  vendedor: string;
  onEvidenciasCompletas?: () => void;
  onEvidenciasStateChange?: (todasCompletas: boolean) => void;
}

export function EvidenciasFirma({ comprador, vendedor, onEvidenciasCompletas, onEvidenciasStateChange }: EvidenciasFirmaProps) {
  const [evidencias, setEvidencias] = useState<Evidencia[]>([
    {
      id: "copia-contrato",
      tipo: "copia_firmada",
      firmante: `${comprador} y ${vendedor}`,
      rol: "ambas_partes",
      documentos: [],
      estado: "pendiente"
    },
    {
      id: "huella-comprador",
      tipo: "huella_digital",
      firmante: comprador,
      rol: "comprador",
      documentos: [],
      estado: "pendiente"
    },
    {
      id: "huella-vendedor",
      tipo: "huella_digital",
      firmante: vendedor,
      rol: "vendedor",
      documentos: [],
      estado: "pendiente"
    }
  ]);

  const handleFileUpload = async (evidenciaId: string, files: FileList) => {
    const archivosArray = Array.from(files);
    
    // Agregar documentos con estado "validando"
    const nuevosDocumentos: DocumentoEvidencia[] = archivosArray.map((file, index) => ({
      id: `${evidenciaId}-doc-${Date.now()}-${index}`,
      archivo: file,
      fechaSubida: new Date(),
      estado: "validando" as const,
      nombreArchivo: file.name
    }));

    setEvidencias(prev => prev.map(ev => 
      ev.id === evidenciaId 
        ? { 
            ...ev, 
            documentos: [...ev.documentos, ...nuevosDocumentos]
          }
        : ev
    ));

    // Simular validación con IA
    for (const doc of nuevosDocumentos) {
      await simularValidacionIA(evidenciaId, doc.id);
    }
  };

  const handleBulkUpload = async (files: FileList) => {
    const archivosArray = Array.from(files);
    const evidenciasFaltantes = evidencias.filter(ev => ev.estado === "pendiente");
    
    // Si no hay evidencias faltantes, no hacer nada
    if (evidenciasFaltantes.length === 0) {
      console.log("No hay evidencias faltantes para subir");
      return;
    }

    // Distribuir archivos entre las evidencias faltantes
    const archivosPorEvidencia = Math.ceil(archivosArray.length / evidenciasFaltantes.length);
    
    for (let i = 0; i < evidenciasFaltantes.length; i++) {
      const evidencia = evidenciasFaltantes[i];
      const inicio = i * archivosPorEvidencia;
      const fin = Math.min(inicio + archivosPorEvidencia, archivosArray.length);
      const archivosParaEstaEvidencia = archivosArray.slice(inicio, fin);
      
      if (archivosParaEstaEvidencia.length > 0) {
        // Crear un FileList simulado
        const fileList = {
          length: archivosParaEstaEvidencia.length,
          item: (index: number) => archivosParaEstaEvidencia[index],
          [Symbol.iterator]: function* () {
            for (const file of archivosParaEstaEvidencia) {
              yield file;
            }
          }
        } as FileList;
        
        await handleFileUpload(evidencia.id, fileList);
      }
    }
    
    console.log(`✅ Upload masivo completado: ${archivosArray.length} archivos distribuidos en ${evidenciasFaltantes.length} evidencias`);
  };

  const simularValidacionIA = async (evidenciaId: string, documentoId: string) => {
    // Simular tiempo de validación (2-4 segundos)
    const tiempoValidacion = Math.random() * 2000 + 2000;
    
    await new Promise(resolve => setTimeout(resolve, tiempoValidacion));
    
    // Simular resultado de validación (90% aprobado, 10% rechazado)
    const aprobado = Math.random() > 0.1;
    
    setEvidencias(prev => prev.map(ev => 
      ev.id === evidenciaId 
        ? {
            ...ev,
            documentos: ev.documentos.map(doc => 
              doc.id === documentoId 
                ? { ...doc, estado: aprobado ? "aprobado" as const : "rechazado" as const }
                : doc
            ),
            estado: ev.documentos.some(doc => doc.estado === "aprobado") || aprobado ? "completada" as const : "pendiente"
          }
        : ev
    ));
  };

  const getEvidenciaIcon = (tipo: string) => {
    switch (tipo) {
      case "copia_firmada":
        return <FileText className="h-4 w-4" />;
      case "huella_digital":
        return <Fingerprint className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getEvidenciaTitle = (tipo: string) => {
    switch (tipo) {
      case "copia_firmada":
        return "Copia firmada del contrato/escritura";
      case "huella_digital":
        return "Huellas digitales del firmante";
      default:
        return "Evidencia";
    }
  };

  const getRolText = (rol: string) => {
    switch (rol) {
      case "comprador":
        return "Comprador";
      case "vendedor":
        return "Vendedor";
      case "ambas_partes":
        return "Ambas partes";
      default:
        return "Firmante";
    }
  };

  const evidenciasCompletadas = evidencias.filter(ev => ev.estado === "completada").length;
  const totalEvidencias = evidencias.length;
  const todasCompletas = evidenciasCompletadas === totalEvidencias;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userHasManuallyToggled, setUserHasManuallyToggled] = useState(false);

  // Notificar cambios en el estado de las evidencias y controlar colapso automático
  useEffect(() => {
    if (onEvidenciasStateChange) {
      onEvidenciasStateChange(todasCompletas);
    }
    
    // Colapsar automáticamente cuando se complete la carga de documentos
    if (todasCompletas) {
      setIsCollapsed(true);
    }
  }, [todasCompletas, onEvidenciasStateChange]);

  // Manejar el toggle manual del usuario
  const handleToggle = (open: boolean) => {
    setUserHasManuallyToggled(true);
    setIsCollapsed(!open);
  };

  // Verificar evidencias faltantes
  const evidenciasFaltantes = evidencias.filter(ev => ev.estado === "pendiente");
  const copiasFaltantes = evidenciasFaltantes.filter(ev => ev.tipo === "copia_firmada");
  const huellasFaltantes = evidenciasFaltantes.filter(ev => ev.tipo === "huella_digital");

  // Contar documentos validando
  const documentosValidando = evidencias.reduce((total, ev) => 
    total + ev.documentos.filter(doc => doc.estado === "validando").length, 0
  );

  const getMensajeFaltante = () => {
    const mensajes = [];
    
    copiasFaltantes.forEach(ev => {
      mensajes.push(`Falta evidencia de copia firmada del contrato para el ${getRolText(ev.rol)}`);
    });
    
    huellasFaltantes.forEach(ev => {
      mensajes.push(`No se ha registrado la huella de la ${getRolText(ev.rol)}`);
    });
    
    return mensajes;
  };

  const mensajesFaltantes = getMensajeFaltante();

  return (
    <Card className="w-full bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
      <Collapsible open={!isCollapsed} onOpenChange={handleToggle}>
        <CardHeader className="pb-2">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between w-full cursor-pointer">
              <div className="flex flex-col">
                <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  Evidencias de Firma
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={todasCompletas ? "default" : "secondary"}
                    className={todasCompletas ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-yellow-100 text-yellow-700 border-yellow-300"}
                  >
                    {evidenciasCompletadas}/{totalEvidencias} Completadas
                  </Badge>
                  {documentosValidando > 0 && (
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                      <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600 mr-1"></div>
                      {documentosValidando} validando
                    </Badge>
                  )}
                  {todasCompletas && (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Listo para completar
                    </Badge>
                  )}
                </div>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${!isCollapsed ? "rotate-180" : ""}`} />
            </div>
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-2">
        {/* Upload masivo - Solo mostrar si hay evidencias faltantes */}
        {mensajesFaltantes.length > 0 && (
          <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-1">
                  Subir todas las evidencias de una vez
                </h4>
                <p className="text-xs text-blue-700">
                  Selecciona múltiples archivos para subir todas las evidencias faltantes
                </p>
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      handleBulkUpload(files);
                    }
                  }}
                  className="hidden"
                  id="bulk-upload"
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
                  onClick={() => document.getElementById('bulk-upload')?.click()}
                >
                  <Upload className="h-3 w-3 mr-1" />
                  Subir Todo
                </Button>
              </div>
            </div>
          </div>
        )}


        {/* Lista de evidencias - Compacta */}
        <div className="space-y-2">
          {evidencias.map((evidencia) => (
            <div
              key={evidencia.id}
              className={`p-2 rounded border ${
                evidencia.estado === "completada"
                  ? "bg-blue-50 border-blue-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded ${
                    evidencia.estado === "completada"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {getEvidenciaIcon(evidencia.tipo)}
                  </div>
                  <div>
                    <h4 className="font-medium text-xs text-gray-900">
                      {getEvidenciaTitle(evidencia.tipo)}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {getRolText(evidencia.rol)}: {evidencia.firmante}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  {evidencia.estado === "completada" ? (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completada
                    </Badge>
                  ) : (
                    <div className="flex items-center gap-1">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        multiple
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files && files.length > 0) {
                            handleFileUpload(evidencia.id, files);
                          }
                        }}
                        className="hidden"
                        id={`upload-${evidencia.id}`}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-6"
                        onClick={() => document.getElementById(`upload-${evidencia.id}`)?.click()}
                      >
                        <Upload className="h-3 w-3 mr-1" />
                        Subir
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Lista de documentos subidos - Compacta */}
              {evidencia.documentos.length > 0 && (
                <div className="mt-1 space-y-1">
                  {evidencia.documentos.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-1 bg-white rounded border text-xs"
                    >
                      <div className="flex items-center gap-1">
                        {doc.estado === "validando" && (
                          <div className="animate-spin rounded-full h-2 w-2 border-b border-blue-600"></div>
                        )}
                        {doc.estado === "aprobado" && (
                          <CheckCircle className="h-3 w-3 text-blue-600" />
                        )}
                        {doc.estado === "rechazado" && (
                          <AlertCircle className="h-3 w-3 text-red-600" />
                        )}
                        <span className="text-gray-700 truncate max-w-32">{doc.nombreArchivo}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {doc.estado === "validando" && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 text-xs">
                            Validando...
                          </Badge>
                        )}
                        {doc.estado === "aprobado" && (
                          <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-xs">
                            Aprobado
                          </Badge>
                        )}
                        {doc.estado === "rechazado" && (
                          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300 text-xs">
                            Rechazado
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
