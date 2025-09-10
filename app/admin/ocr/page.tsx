"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  Camera,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Eye,
  Edit,
  Save,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Settings,
  Wand2,
  Scan,
  Image as ImageIcon,
  FileImage,
} from "lucide-react";

// Tipos de datos
interface DocumentoOCR {
  id: string;
  nombre: string;
  tipo: string;
  archivo: File | null;
  imagen: string;
  textoExtraido: string;
  datosEstructurados: DatosExtraidos;
  confianza: number;
  estado: "subido" | "procesando" | "completado" | "error";
  fechaProcesamiento: string;
  errores: string[];
}

interface DatosExtraidos {
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  fechaNacimiento?: string;
  curp?: string;
  rfc?: string;
  telefono?: string;
  email?: string;
  direccion?: {
    calle?: string;
    numero?: string;
    colonia?: string;
    municipio?: string;
    estado?: string;
    codigoPostal?: string;
  };
  datosAdicionales: { [key: string]: string };
}

interface PlantillaOCR {
  id: string;
  nombre: string;
  tipoDocumento: string;
  campos: CampoOCR[];
  activa: boolean;
}

interface CampoOCR {
  id: string;
  nombre: string;
  tipo: "texto" | "fecha" | "numero" | "email" | "telefono";
  patron: string;
  posicion: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  obligatorio: boolean;
}

// Plantillas simuladas
const plantillasOCR: PlantillaOCR[] = [
  {
    id: "plantilla_001",
    nombre: "INE - Frente",
    tipoDocumento: "identificacion",
    campos: [
      {
        id: "campo_001",
        nombre: "nombre",
        tipo: "texto",
        patron: "NOMBRE:",
        posicion: { x: 100, y: 200, width: 300, height: 30 },
        obligatorio: true,
      },
      {
        id: "campo_002",
        nombre: "apellidoPaterno",
        tipo: "texto",
        patron: "APELLIDO PATERNO:",
        posicion: { x: 100, y: 240, width: 300, height: 30 },
        obligatorio: true,
      },
      {
        id: "campo_003",
        nombre: "apellidoMaterno",
        tipo: "texto",
        patron: "APELLIDO MATERNO:",
        posicion: { x: 100, y: 280, width: 300, height: 30 },
        obligatorio: true,
      },
      {
        id: "campo_004",
        nombre: "fechaNacimiento",
        tipo: "fecha",
        patron: "FECHA DE NACIMIENTO:",
        posicion: { x: 100, y: 320, width: 200, height: 30 },
        obligatorio: true,
      },
      {
        id: "campo_005",
        nombre: "curp",
        tipo: "texto",
        patron: "CURP:",
        posicion: { x: 100, y: 360, width: 300, height: 30 },
        obligatorio: true,
      },
    ],
    activa: true,
  },
  {
    id: "plantilla_002",
    nombre: "Comprobante de Domicilio",
    tipoDocumento: "domicilio",
    campos: [
      {
        id: "campo_006",
        nombre: "direccion",
        tipo: "texto",
        patron: "DIRECCIÓN:",
        posicion: { x: 50, y: 150, width: 400, height: 40 },
        obligatorio: true,
      },
      {
        id: "campo_007",
        nombre: "codigoPostal",
        tipo: "numero",
        patron: "C.P.:",
        posicion: { x: 50, y: 200, width: 100, height: 30 },
        obligatorio: true,
      },
    ],
    activa: true,
  },
];

export default function SistemaOCR() {
  const [documentos, setDocumentos] = useState<DocumentoOCR[]>([]);
  const [plantillas, setPlantillas] = useState<PlantillaOCR[]>(plantillasOCR);
  const [plantillaSeleccionada, setPlantillaSeleccionada] =
    useState<string>("");
  const [procesando, setProcesando] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLVideoElement>(null);

  const handleSubirArchivo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      procesarDocumento(file);
    }
  };

  const handleTomarFoto = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (cameraRef.current) {
            cameraRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error al acceder a la cámara:", err);
        });
    }
  };

  const procesarDocumento = async (archivo: File) => {
    const nuevoDocumento: DocumentoOCR = {
      id: `doc_${Date.now()}`,
      nombre: archivo.name,
      tipo: archivo.type,
      archivo: archivo,
      imagen: URL.createObjectURL(archivo),
      textoExtraido: "",
      datosEstructurados: {
        datosAdicionales: {},
      },
      confianza: 0,
      estado: "subido",
      fechaProcesamiento: new Date().toISOString(),
      errores: [],
    };

    setDocumentos((prev) => [...prev, nuevoDocumento]);
    setProcesando(true);
    setProgreso(0);

    // Simular procesamiento OCR
    await simularOCR(nuevoDocumento.id);
  };

  const simularOCR = async (documentoId: string) => {
    // Simular progreso
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setProgreso(i);
    }

    // Simular datos extraídos
    const datosSimulados: DatosExtraidos = {
      nombre: "Juan",
      apellidoPaterno: "Pérez",
      apellidoMaterno: "García",
      fechaNacimiento: "1985-03-15",
      curp: "PEGJ850315HDFRRN01",
      telefono: "6641234567",
      email: "juan.perez@email.com",
      direccion: {
        calle: "Av. Revolución",
        numero: "1234",
        colonia: "Centro",
        municipio: "Tijuana",
        estado: "Baja California",
        codigoPostal: "22000",
      },
      datosAdicionales: {
        "Tipo de documento": "INE",
        "Número de credencial": "1234567890123456",
        Vigencia: "2029-03-15",
      },
    };

    setDocumentos((prev) =>
      prev.map((doc) =>
        doc.id === documentoId
          ? {
              ...doc,
              estado: "completado",
              textoExtraido: "Texto extraído del documento mediante OCR...",
              datosEstructurados: datosSimulados,
              confianza: 95,
            }
          : doc
      )
    );

    setProcesando(false);
    setProgreso(0);
  };

  const handleAplicarPlantilla = (documentoId: string, plantillaId: string) => {
    const plantilla = plantillas.find((p) => p.id === plantillaId);
    if (plantilla) {
      // Simular aplicación de plantilla
      console.log(
        `Aplicando plantilla ${plantilla.nombre} al documento ${documentoId}`
      );
    }
  };

  const handleEditarDatos = (
    documentoId: string,
    campo: string,
    valor: string
  ) => {
    setDocumentos((prev) =>
      prev.map((doc) =>
        doc.id === documentoId
          ? {
              ...doc,
              datosEstructurados: {
                ...doc.datosEstructurados,
                [campo]: valor,
              },
            }
          : doc
      )
    );
  };

  const handleGuardarDatos = (documentoId: string) => {
    // Simular guardado de datos
    console.log(`Guardando datos del documento ${documentoId}`);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "completado":
        return "bg-green-100 text-green-800";
      case "procesando":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getConfianzaColor = (confianza: number) => {
    if (confianza >= 90) return "text-green-600";
    if (confianza >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sistema OCR</h1>
              <p className="text-gray-600">
                Extracción automática de datos de documentos
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Subir Archivo
              </Button>
              <Button onClick={handleTomarFoto}>
                <Camera className="h-4 w-4 mr-2" />
                Tomar Foto
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="procesar" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="procesar">Procesar Documentos</TabsTrigger>
            <TabsTrigger value="plantillas">Plantillas OCR</TabsTrigger>
            <TabsTrigger value="historial">Historial</TabsTrigger>
            <TabsTrigger value="configuracion">Configuración</TabsTrigger>
          </TabsList>

          {/* Tab Procesar Documentos */}
          <TabsContent value="procesar" className="space-y-6">
            {/* Progreso de procesamiento */}
            {procesando && (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Scan className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">
                        Procesando documento...
                      </span>
                    </div>
                    <Progress value={progreso} className="h-2" />
                    <p className="text-sm text-gray-500">
                      Extrayendo datos mediante OCR... {progreso}%
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lista de documentos procesados */}
            <div className="space-y-4">
              {documentos.map((documento) => (
                <Card key={documento.id}>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Imagen del documento */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">
                            {documento.nombre}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <Badge className={getEstadoColor(documento.estado)}>
                              {documento.estado}
                            </Badge>
                            {documento.confianza > 0 && (
                              <Badge
                                className={getConfianzaColor(
                                  documento.confianza
                                )}
                              >
                                {documento.confianza}% confianza
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <img
                            src={documento.imagen}
                            alt={documento.nombre}
                            className="w-full h-64 object-contain rounded"
                          />
                          <div className="flex justify-center space-x-2 mt-4">
                            <Button variant="outline" size="sm">
                              <ZoomIn className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Datos extraídos */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold">
                            Datos Extraídos
                          </h4>
                          <div className="flex space-x-2">
                            <Select
                              value={plantillaSeleccionada}
                              onValueChange={(value) =>
                                handleAplicarPlantilla(documento.id, value)
                              }
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder="Plantilla" />
                              </SelectTrigger>
                              <SelectContent>
                                {plantillas.map((plantilla) => (
                                  <SelectItem
                                    key={plantilla.id}
                                    value={plantilla.id}
                                  >
                                    {plantilla.nombre}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              onClick={() => handleGuardarDatos(documento.id)}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {/* Información personal */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="nombre">Nombre</Label>
                              <Input
                                id="nombre"
                                value={
                                  documento.datosEstructurados.nombre || ""
                                }
                                onChange={(e) =>
                                  handleEditarDatos(
                                    documento.id,
                                    "nombre",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="apellidoPaterno">
                                Apellido Paterno
                              </Label>
                              <Input
                                id="apellidoPaterno"
                                value={
                                  documento.datosEstructurados
                                    .apellidoPaterno || ""
                                }
                                onChange={(e) =>
                                  handleEditarDatos(
                                    documento.id,
                                    "apellidoPaterno",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="apellidoMaterno">
                                Apellido Materno
                              </Label>
                              <Input
                                id="apellidoMaterno"
                                value={
                                  documento.datosEstructurados
                                    .apellidoMaterno || ""
                                }
                                onChange={(e) =>
                                  handleEditarDatos(
                                    documento.id,
                                    "apellidoMaterno",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="fechaNacimiento">
                                Fecha de Nacimiento
                              </Label>
                              <Input
                                id="fechaNacimiento"
                                type="date"
                                value={
                                  documento.datosEstructurados
                                    .fechaNacimiento || ""
                                }
                                onChange={(e) =>
                                  handleEditarDatos(
                                    documento.id,
                                    "fechaNacimiento",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="curp">CURP</Label>
                              <Input
                                id="curp"
                                value={documento.datosEstructurados.curp || ""}
                                onChange={(e) =>
                                  handleEditarDatos(
                                    documento.id,
                                    "curp",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="telefono">Teléfono</Label>
                              <Input
                                id="telefono"
                                value={
                                  documento.datosEstructurados.telefono || ""
                                }
                                onChange={(e) =>
                                  handleEditarDatos(
                                    documento.id,
                                    "telefono",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>

                          {/* Dirección */}
                          <div>
                            <h5 className="font-medium mb-2">Dirección</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="calle">Calle</Label>
                                <Input
                                  id="calle"
                                  value={
                                    documento.datosEstructurados.direccion
                                      ?.calle || ""
                                  }
                                  onChange={(e) =>
                                    handleEditarDatos(
                                      documento.id,
                                      "direccion.calle",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="numero">Número</Label>
                                <Input
                                  id="numero"
                                  value={
                                    documento.datosEstructurados.direccion
                                      ?.numero || ""
                                  }
                                  onChange={(e) =>
                                    handleEditarDatos(
                                      documento.id,
                                      "direccion.numero",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="colonia">Colonia</Label>
                                <Input
                                  id="colonia"
                                  value={
                                    documento.datosEstructurados.direccion
                                      ?.colonia || ""
                                  }
                                  onChange={(e) =>
                                    handleEditarDatos(
                                      documento.id,
                                      "direccion.colonia",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="municipio">Municipio</Label>
                                <Input
                                  id="municipio"
                                  value={
                                    documento.datosEstructurados.direccion
                                      ?.municipio || ""
                                  }
                                  onChange={(e) =>
                                    handleEditarDatos(
                                      documento.id,
                                      "direccion.municipio",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="estado">Estado</Label>
                                <Input
                                  id="estado"
                                  value={
                                    documento.datosEstructurados.direccion
                                      ?.estado || ""
                                  }
                                  onChange={(e) =>
                                    handleEditarDatos(
                                      documento.id,
                                      "direccion.estado",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="codigoPostal">
                                  Código Postal
                                </Label>
                                <Input
                                  id="codigoPostal"
                                  value={
                                    documento.datosEstructurados.direccion
                                      ?.codigoPostal || ""
                                  }
                                  onChange={(e) =>
                                    handleEditarDatos(
                                      documento.id,
                                      "direccion.codigoPostal",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </div>

                          {/* Datos adicionales */}
                          {Object.keys(
                            documento.datosEstructurados.datosAdicionales
                          ).length > 0 && (
                            <div>
                              <h5 className="font-medium mb-2">
                                Datos Adicionales
                              </h5>
                              <div className="space-y-2">
                                {Object.entries(
                                  documento.datosEstructurados.datosAdicionales
                                ).map(([key, value]) => (
                                  <div
                                    key={key}
                                    className="flex items-center space-x-2"
                                  >
                                    <span className="text-sm font-medium w-32">
                                      {key}:
                                    </span>
                                    <Input
                                      value={value}
                                      onChange={(e) =>
                                        handleEditarDatos(
                                          documento.id,
                                          `datosAdicionales.${key}`,
                                          e.target.value
                                        )
                                      }
                                      className="flex-1"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Texto extraído */}
                          <div>
                            <Label htmlFor="textoExtraido">
                              Texto Extraído
                            </Label>
                            <Textarea
                              id="textoExtraido"
                              value={documento.textoExtraido}
                              readOnly
                              rows={4}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab Plantillas OCR */}
          <TabsContent value="plantillas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Plantillas de OCR</CardTitle>
                <CardDescription>
                  Configura plantillas para extraer datos específicos de cada
                  tipo de documento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {plantillas.map((plantilla) => (
                    <Card key={plantilla.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold">
                              {plantilla.nombre}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {plantilla.tipoDocumento}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              className={
                                plantilla.activa
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {plantilla.activa ? "Activa" : "Inactiva"}
                            </Badge>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium">
                            Campos configurados:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {plantilla.campos.map((campo) => (
                              <Badge
                                key={campo.id}
                                variant="outline"
                                className="text-xs"
                              >
                                {campo.nombre}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Historial */}
          <TabsContent value="historial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Procesamiento</CardTitle>
                <CardDescription>
                  Registro de todos los documentos procesados con OCR
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documentos.map((documento) => (
                    <div
                      key={documento.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <FileImage className="h-8 w-8 text-gray-400" />
                        <div>
                          <h4 className="font-semibold">{documento.nombre}</h4>
                          <p className="text-sm text-gray-500">
                            Procesado:{" "}
                            {new Date(
                              documento.fechaProcesamiento
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={getEstadoColor(documento.estado)}>
                          {documento.estado}
                        </Badge>
                        {documento.confianza > 0 && (
                          <span
                            className={`text-sm font-medium ${getConfianzaColor(
                              documento.confianza
                            )}`}
                          >
                            {documento.confianza}%
                          </span>
                        )}
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Configuración */}
          <TabsContent value="configuracion" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Sistema OCR</CardTitle>
                <CardDescription>
                  Ajusta los parámetros del sistema de reconocimiento óptico de
                  caracteres
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="confianzaMinima">Confianza Mínima</Label>
                    <Input
                      id="confianzaMinima"
                      type="number"
                      defaultValue={70}
                      min={0}
                      max={100}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Porcentaje mínimo de confianza para aceptar datos
                      extraídos
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="idioma">Idioma Principal</Label>
                    <Select defaultValue="es">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">Inglés</SelectItem>
                        <SelectItem value="fr">Francés</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="preprocesamiento">Preprocesamiento</Label>
                    <Select defaultValue="automatico">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="automatico">Automático</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="deshabilitado">
                          Deshabilitado
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="formatoSalida">Formato de Salida</Label>
                    <Select defaultValue="json">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="xml">XML</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>
                    <Settings className="h-4 w-4 mr-2" />
                    Guardar Configuración
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Input oculto para subir archivos */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={handleSubirArchivo}
          className="hidden"
        />

        {/* Cámara oculta */}
        <video ref={cameraRef} className="hidden" autoPlay playsInline />
      </div>
    </div>
  );
}
