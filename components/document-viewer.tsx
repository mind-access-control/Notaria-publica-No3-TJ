"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Download, Eye, X, Calendar, User, Brain, Edit3, Check, X as XIcon } from "lucide-react";
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
  const [isEditing, setIsEditing] = useState(false);
  const [extractedData, setExtractedData] = useState({
    nombre: "JONATHAN RUBEN",
    primerApellido: "HERNANDEZ",
    segundoApellido: "GONZALEZ",
    curp: "HEGJ860702HMCRNN07",
    fechaNacimiento: "02/07/1986",
    lugarNacimiento: "TECAMAC, MEXICO",
    sexo: "HOMBRE",
    padre: "FEDERICO HERNANDEZ ORNELAS",
    madre: "ARACELI GONZALEZ ESPINOSA",
    entidadRegistro: "MEXICO",
    municipioRegistro: "TECAMAC",
    fechaRegistro: "02/07/1986",
    numeroActa: "2710",
    libro: "14",
    oficialia: "0003"
  });

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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Aquí se guardaría la información editada
    console.log("Datos guardados:", extractedData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Restaurar datos originales si es necesario
  };

  const handleInputChange = (field: string, value: string) => {
    setExtractedData(prev => ({
      ...prev,
      [field]: value
    }));
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
                    {typeof documento.archivo === 'object' && documento.archivo?.name 
                      ? documento.archivo.name 
                      : String(documento.archivo || "No especificado")
                    }
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
                  {typeof documento.archivo === 'object' && documento.archivo?.name 
                    ? documento.archivo.name 
                    : String(documento.archivo || "Documento no disponible")
                  }
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

          {/* Información extraída por IA */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Información Extraída por IA
                <Badge variant="outline" className="ml-auto bg-purple-50 text-purple-700 border-purple-200">
                  <Brain className="h-3 w-3 mr-1" />
                  Procesado
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Nuestro sistema de IA ha analizado el documento y extraído la siguiente información. 
                  Puedes revisar y editar los datos si es necesario.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Información personal */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Datos Personales</h4>
                    
                    <div>
                      <Label className="text-xs text-gray-600">Nombre(s)</Label>
                      {isEditing ? (
                        <Input
                          value={extractedData.nombre}
                          onChange={(e) => handleInputChange('nombre', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1">{extractedData.nombre}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600">Primer Apellido</Label>
                      {isEditing ? (
                        <Input
                          value={extractedData.primerApellido}
                          onChange={(e) => handleInputChange('primerApellido', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1">{extractedData.primerApellido}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600">Segundo Apellido</Label>
                      {isEditing ? (
                        <Input
                          value={extractedData.segundoApellido}
                          onChange={(e) => handleInputChange('segundoApellido', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1">{extractedData.segundoApellido}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600">CURP</Label>
                      {isEditing ? (
                        <Input
                          value={extractedData.curp}
                          onChange={(e) => handleInputChange('curp', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1 font-mono">{extractedData.curp}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600">Fecha de Nacimiento</Label>
                      {isEditing ? (
                        <Input
                          value={extractedData.fechaNacimiento}
                          onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1">{extractedData.fechaNacimiento}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600">Lugar de Nacimiento</Label>
                      {isEditing ? (
                        <Input
                          value={extractedData.lugarNacimiento}
                          onChange={(e) => handleInputChange('lugarNacimiento', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1">{extractedData.lugarNacimiento}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600">Sexo</Label>
                      {isEditing ? (
                        <Input
                          value={extractedData.sexo}
                          onChange={(e) => handleInputChange('sexo', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1">{extractedData.sexo}</p>
                      )}
                    </div>
                  </div>

                  {/* Información de filiación y registro */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Filiación y Registro</h4>
                    
                    <div>
                      <Label className="text-xs text-gray-600">Padre</Label>
                      {isEditing ? (
                        <Input
                          value={extractedData.padre}
                          onChange={(e) => handleInputChange('padre', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1">{extractedData.padre}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600">Madre</Label>
                      {isEditing ? (
                        <Input
                          value={extractedData.madre}
                          onChange={(e) => handleInputChange('madre', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1">{extractedData.madre}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600">Entidad de Registro</Label>
                      {isEditing ? (
                        <Input
                          value={extractedData.entidadRegistro}
                          onChange={(e) => handleInputChange('entidadRegistro', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1">{extractedData.entidadRegistro}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600">Municipio de Registro</Label>
                      {isEditing ? (
                        <Input
                          value={extractedData.municipioRegistro}
                          onChange={(e) => handleInputChange('municipioRegistro', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1">{extractedData.municipioRegistro}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600">Fecha de Registro</Label>
                      {isEditing ? (
                        <Input
                          value={extractedData.fechaRegistro}
                          onChange={(e) => handleInputChange('fechaRegistro', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1">{extractedData.fechaRegistro}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600">Número de Acta</Label>
                      {isEditing ? (
                        <Input
                          value={extractedData.numeroActa}
                          onChange={(e) => handleInputChange('numeroActa', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1">{extractedData.numeroActa}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex justify-end gap-2 pt-4 border-t">
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
                      ? (typeof documento.archivo === 'object' && documento.archivo?.name
                          ? documento.archivo.name.split(".").pop()?.toUpperCase()
                          : String(documento.archivo).split(".").pop()?.toUpperCase()) || "Desconocido"
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
