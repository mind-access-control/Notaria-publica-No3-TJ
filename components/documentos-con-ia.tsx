"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Brain, 
  Eye, 
  Download, 
  Edit3, 
  Check, 
  X as XIcon,
  FileText,
  User,
  Calendar,
  MapPin,
  CreditCard
} from "lucide-react";
import { DocumentoSolicitud } from "@/lib/mock-data";

interface DocumentosConIAProps {
  documentos: DocumentoSolicitud[];
  onVerDocumento: (documento: DocumentoSolicitud) => void;
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

export default function DocumentosConIA({ 
  documentos, 
  onVerDocumento 
}: DocumentosConIAProps) {
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

  const documentosSubidos = documentos.filter(doc => doc.subido);

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

  const getDocumentTypeIcon = (documento: DocumentoSolicitud) => {
    if (documento.nombre.toLowerCase().includes('ine') || documento.nombre.toLowerCase().includes('identificación')) {
      return <CreditCard className="h-5 w-5 text-blue-600" />;
    }
    if (documento.nombre.toLowerCase().includes('curp')) {
      return <User className="h-5 w-5 text-green-600" />;
    }
    if (documento.nombre.toLowerCase().includes('acta')) {
      return <FileText className="h-5 w-5 text-purple-600" />;
    }
    return <FileText className="h-5 w-5 text-gray-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header con información extraída por IA */}
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

      {/* Documentos subidos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-600" />
            Documentos Subidos ({documentosSubidos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documentosSubidos.map((documento) => (
              <div
                key={documento.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getDocumentTypeIcon(documento)}
                  <div>
                    <h4 className="font-medium text-gray-900">{documento.nombre}</h4>
                    <p className="text-sm text-gray-500">
                      {typeof documento.archivo === 'object' && documento.archivo?.name 
                        ? documento.archivo.name 
                        : String(documento.archivo || 'Archivo no disponible')
                      } • {documento.fechaSubida}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    <Check className="h-3 w-3 mr-1" />
                    Completado
                  </Badge>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onVerDocumento(documento)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
