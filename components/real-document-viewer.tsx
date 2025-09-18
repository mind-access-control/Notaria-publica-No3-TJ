"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Brain,
  Edit3,
  Check,
  X as XIcon,
  User,
  MapPin,
  CreditCard,
} from "lucide-react";
import { DocumentoSolicitud } from "@/lib/mock-data";

interface RealDocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  documento: DocumentoSolicitud | null;
}

interface ExtractedData {
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  curp: string;
  fechaNacimiento: string;
  lugarNacimiento: string;
  sexo: string;
  direccion: string;
  estadoCivil: string;
  numeroActaMatrimonio: string;
  fechaActaMatrimonio: string;
  nombreJuez: string;
  registroCivil: string;
  ocupacion: string;
  nacionalidad: string;
  lugarOrigen: string;
  edad: string;
}

export default function RealDocumentViewer({
  isOpen,
  onClose,
  documento,
}: RealDocumentViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData>({
    nombre: "JONATHAN RUBEN",
    primerApellido: "HERNANDEZ",
    segundoApellido: "GONZALEZ",
    curp: "HEGJ860702HMCRNN07",
    fechaNacimiento: "02/07/1986",
    lugarNacimiento: "TECAMAC, MEXICO",
    sexo: "HOMBRE",
    direccion: "C MZ 6 LT 7 CSA 1 COL LOS HEROES OZUMBILLA 55764 TECAMAC, MEX.",
    estadoCivil: "SOLTERO",
    numeroActaMatrimonio: "",
    fechaActaMatrimonio: "",
    nombreJuez: "",
    registroCivil: "",
    ocupacion: "EMPLEADO",
    nacionalidad: "MEXICANA",
    lugarOrigen: "TECAMAC, MEXICO",
    edad: "38"
  });
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Datos guardados:", extractedData);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof ExtractedData, value: string) => {
    setExtractedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderExtractedData = () => {
    return (
      <div className="h-full overflow-y-auto p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <Brain className="h-6 w-6" />
                Información Extraída por IA
                <Badge variant="outline" className="ml-auto bg-purple-100 text-purple-700 border-purple-300">
                  <Brain className="h-3 w-3 mr-1" />
                  Procesado
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Columna izquierda - Datos personales */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Datos Personales
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-600">Nombre(s)</Label>
                      {isEditing ? (
                        <Input
                          value={extractedData.nombre}
                          onChange={(e) => handleInputChange('nombre', e.target.value)}
                          className="mt-1 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1 font-medium">{extractedData.nombre}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600">Primer Apellido</Label>
                      {isEditing ? (
                        <Input
                          value={extractedData.primerApellido}
                          onChange={(e) => handleInputChange('primerApellido', e.target.value)}
                          className="mt-1 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1 font-medium">{extractedData.primerApellido}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600">Segundo Apellido</Label>
                      {isEditing ? (
                        <Input
                          value={extractedData.segundoApellido}
                          onChange={(e) => handleInputChange('segundoApellido', e.target.value)}
                          className="mt-1 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1 font-medium">{extractedData.segundoApellido}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600">CURP</Label>
                      {isEditing ? (
                        <Input
                          value={extractedData.curp}
                          onChange={(e) => handleInputChange('curp', e.target.value)}
                          className="mt-1 text-sm font-mono"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1 font-mono font-medium">{extractedData.curp}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600">Fecha de Nacimiento</Label>
                      {isEditing ? (
                        <Input
                          value={extractedData.fechaNacimiento}
                          onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                          className="mt-1 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1 font-medium">{extractedData.fechaNacimiento}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600">Edad</Label>
                      {isEditing ? (
                        <Input
                          value={extractedData.edad}
                          onChange={(e) => handleInputChange('edad', e.target.value)}
                          className="mt-1 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1 font-medium">{extractedData.edad}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600">Género</Label>
                      {isEditing ? (
                        <Input
                          value={extractedData.sexo}
                          onChange={(e) => handleInputChange('sexo', e.target.value)}
                          className="mt-1 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1 font-medium">{extractedData.sexo}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600">Lugar de Origen</Label>
                      {isEditing ? (
                        <Input
                          value={extractedData.lugarOrigen}
                          onChange={(e) => handleInputChange('lugarOrigen', e.target.value)}
                          className="mt-1 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1 font-medium">{extractedData.lugarOrigen}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600">Nacionalidad</Label>
                      {isEditing ? (
                        <Input
                          value={extractedData.nacionalidad}
                          onChange={(e) => handleInputChange('nacionalidad', e.target.value)}
                          className="mt-1 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1 font-medium">{extractedData.nacionalidad}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600">Ocupación</Label>
                      {isEditing ? (
                        <Input
                          value={extractedData.ocupacion}
                          onChange={(e) => handleInputChange('ocupacion', e.target.value)}
                          className="mt-1 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1 font-medium">{extractedData.ocupacion}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Columna derecha - Estado civil y dirección */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Estado Civil y Dirección
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-600">Estado Civil Actual</Label>
                      {isEditing ? (
                        <Input
                          value={extractedData.estadoCivil}
                          onChange={(e) => handleInputChange('estadoCivil', e.target.value)}
                          className="mt-1 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1 font-medium">{extractedData.estadoCivil}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600">Número Acta de Matrimonio</Label>
                      {isEditing ? (
                        <Input
                          value={extractedData.numeroActaMatrimonio}
                          onChange={(e) => handleInputChange('numeroActaMatrimonio', e.target.value)}
                          className="mt-1 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1 font-medium">{extractedData.numeroActaMatrimonio}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600">Fecha del Acta de Matrimonio</Label>
                      {isEditing ? (
                        <Input
                          value={extractedData.fechaActaMatrimonio}
                          onChange={(e) => handleInputChange('fechaActaMatrimonio', e.target.value)}
                          className="mt-1 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1 font-medium">{extractedData.fechaActaMatrimonio}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600">Nombre del Juez</Label>
                      {isEditing ? (
                        <Input
                          value={extractedData.nombreJuez}
                          onChange={(e) => handleInputChange('nombreJuez', e.target.value)}
                          className="mt-1 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1 font-medium">{extractedData.nombreJuez}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600">Registro Civil</Label>
                      {isEditing ? (
                        <Input
                          value={extractedData.registroCivil}
                          onChange={(e) => handleInputChange('registroCivil', e.target.value)}
                          className="mt-1 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1 font-medium">{extractedData.registroCivil}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600">Dirección</Label>
                      {isEditing ? (
                        <Input
                          value={extractedData.direccion}
                          onChange={(e) => handleInputChange('direccion', e.target.value)}
                          className="mt-1 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1 font-medium">{extractedData.direccion}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-2 pt-4 border-t mt-6">
                {!isEditing ? (
                  <Button onClick={handleEdit} variant="outline" size="sm">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Editar Información
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      <XIcon className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                      <Check className="h-4 w-4 mr-2" />
                      Confirmar Cambios
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
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
        <iframe
          src={documentUrl}
          className="w-full h-full border-0"
          style={{
            width: "100%",
            height: "100%",
            minWidth: "100%",
            maxWidth: "100%",
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
      );
    }

    if (isImage(documento.archivo)) {
      const documentUrl = getDocumentUrl();
      if (!documentUrl) return null;

      return (
        <img
          src={documentUrl}
          alt={
            typeof documento.archivo === "object" && documento.archivo.name
              ? documento.archivo.name
              : String(documento.archivo)
          }
          className="w-full h-full object-contain"
          style={{
            width: "100%",
            height: "100%",
            minWidth: "100%",
            maxWidth: "100%",
            display: "block",
          }}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setError("No se pudo cargar la imagen");
            setIsLoading(false);
          }}
        />
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
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header compacto */}
            <div className="bg-white border-b px-3 py-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <DialogTitle className="text-sm font-bold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-600" />
                    {documento.nombre}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-gray-600">
                    Vista previa del documento subido
                  </DialogDescription>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {documento.fechaSubida
                      ? new Date(documento.fechaSubida).toLocaleDateString(
                          "es-MX"
                        )
                      : "No especificada"}
                  </span>
                  <Badge
                    variant={documento.subido ? "default" : "outline"}
                    className={
                      documento.subido ? "bg-green-100 text-green-800 text-xs" : "text-xs"
                    }
                  >
                    {documento.subido ? "Completado" : "Pendiente"}
                  </Badge>
                  <span>
                    {typeof documento.archivo === "object" &&
                    documento.archivo.name
                      ? documento.archivo.name.split(".").pop()?.toUpperCase() ||
                        "N/A"
                      : typeof documento.archivo === "string"
                      ? documento.archivo.split(".").pop()?.toUpperCase() || "N/A"
                      : "N/A"}
                  </span>
                </div>
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
                <Button size="sm" onClick={onClose} variant="outline">
                  <X className="h-4 w-4 mr-1" />
                  Cerrar
                </Button>
              </div>
            </div>

            {/* Pestañas para alternar entre documento e información extraída */}
            <Tabs defaultValue="documento" className="flex-1 flex flex-col">
              <div className="px-4 py-2 border-b bg-white">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="documento" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Documento
                  </TabsTrigger>
                  <TabsTrigger value="informacion" className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Información Extraída
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="documento" className="flex-1 m-0">
                <div
                  className="h-full relative bg-gray-100"
                  style={{ width: "100%" }}
                >
                  <div className="h-full w-full overflow-hidden">
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
              </TabsContent>

              <TabsContent value="informacion" className="flex-1 m-0">
                {renderExtractedData()}
              </TabsContent>
            </Tabs>
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
