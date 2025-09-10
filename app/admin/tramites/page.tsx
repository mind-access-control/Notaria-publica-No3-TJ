"use client";

import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit,
  Trash2,
  Settings,
  FileText,
  DollarSign,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Save,
  X,
} from "lucide-react";

// Tipos de datos
interface TramiteConfig {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  documentosRequeridos: DocumentoRequerido[];
  costos: CostosTramite;
  tiempoEstimado: number;
  requisitosEspeciales: string[];
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

interface DocumentoRequerido {
  id: string;
  nombre: string;
  descripcion: string;
  obligatorio: boolean;
  formato: string[];
  validaciones: string[];
  ocrHabilitado: boolean;
  camposExtraidos: string[];
}

interface CostosTramite {
  costoBase: number;
  aranceles: number;
  notariales: number;
  gastos: number;
  total: number;
  descuentos: Descuento[];
}

interface Descuento {
  id: string;
  nombre: string;
  tipo: "porcentaje" | "fijo";
  valor: number;
  condiciones: string[];
  activo: boolean;
}

// Datos simulados
const tramitesIniciales: TramiteConfig[] = [
  {
    id: "testamento",
    nombre: "Testamento",
    descripcion: "Testamento público abierto",
    categoria: "Sucesiones",
    documentosRequeridos: [
      {
        id: "doc_001",
        nombre: "Identificación Oficial",
        descripcion: "INE, pasaporte o cédula profesional",
        obligatorio: true,
        formato: ["PDF", "JPG", "PNG"],
        validaciones: ["Vigencia", "Legibilidad", "Datos completos"],
        ocrHabilitado: true,
        camposExtraidos: ["nombre", "apellidos", "fecha_nacimiento", "curp"],
      },
      {
        id: "doc_002",
        nombre: "Comprobante de Domicilio",
        descripcion: "Recibo de luz, agua, teléfono o predial (máximo 3 meses)",
        obligatorio: true,
        formato: ["PDF", "JPG", "PNG"],
        validaciones: ["Vigencia", "Dirección completa"],
        ocrHabilitado: true,
        camposExtraidos: ["direccion", "codigo_postal", "municipio", "estado"],
      },
      {
        id: "doc_003",
        nombre: "CURP",
        descripcion: "Constancia de Clave Única de Registro de Población",
        obligatorio: true,
        formato: ["PDF", "JPG", "PNG"],
        validaciones: ["Formato válido", "Datos correctos"],
        ocrHabilitado: true,
        camposExtraidos: [
          "curp",
          "nombre_completo",
          "fecha_nacimiento",
          "sexo",
        ],
      },
      {
        id: "doc_004",
        nombre: "Acta de Nacimiento",
        descripcion: "Acta de nacimiento original o copia certificada",
        obligatorio: true,
        formato: ["PDF", "JPG", "PNG"],
        validaciones: ["Originalidad", "Legibilidad"],
        ocrHabilitado: true,
        camposExtraidos: [
          "nombre_completo",
          "fecha_nacimiento",
          "lugar_nacimiento",
          "padres",
        ],
      },
      {
        id: "doc_005",
        nombre: "Testigos",
        descripcion: "Identificación de 2 testigos mayores de edad",
        obligatorio: true,
        formato: ["PDF", "JPG", "PNG"],
        validaciones: ["Mayoría de edad", "Identificación válida"],
        ocrHabilitado: false,
        camposExtraidos: [],
      },
    ],
    costos: {
      costoBase: 2000,
      aranceles: 300,
      notariales: 200,
      gastos: 0,
      total: 2500,
      descuentos: [
        {
          id: "desc_001",
          nombre: "Descuento por pronto pago",
          tipo: "porcentaje",
          valor: 10,
          condiciones: ["Pago en efectivo", "Pago único"],
          activo: true,
        },
      ],
    },
    tiempoEstimado: 5,
    requisitosEspeciales: [
      "Cliente debe ser mayor de edad",
      "Testigos no pueden ser familiares directos",
      "Documentos deben estar vigentes",
    ],
    activo: true,
    fechaCreacion: "2024-01-01",
    fechaActualizacion: "2024-01-15",
  },
  {
    id: "compraventa",
    nombre: "Compraventa",
    descripcion: "Compraventa de inmueble",
    categoria: "Inmobiliaria",
    documentosRequeridos: [
      {
        id: "doc_006",
        nombre: "Escritura Anterior",
        descripcion: "Escritura de propiedad del inmueble",
        obligatorio: true,
        formato: ["PDF"],
        validaciones: ["Registro público", "Vigencia"],
        ocrHabilitado: true,
        camposExtraidos: ["propietario", "superficie", "ubicacion", "valor"],
      },
      {
        id: "doc_007",
        nombre: "Predial",
        descripcion: "Recibo de predial al corriente",
        obligatorio: true,
        formato: ["PDF", "JPG", "PNG"],
        validaciones: ["Vigencia", "Sin adeudos"],
        ocrHabilitado: true,
        camposExtraidos: ["clave_catastral", "valor_catastral", "adeudos"],
      },
      {
        id: "doc_008",
        nombre: "Avalúo",
        descripcion: "Avalúo comercial del inmueble",
        obligatorio: true,
        formato: ["PDF"],
        validaciones: ["Vigencia", "Perito certificado"],
        ocrHabilitado: true,
        camposExtraidos: ["valor_comercial", "superficie", "fecha_avaluo"],
      },
    ],
    costos: {
      costoBase: 2500,
      aranceles: 500,
      notariales: 200,
      gastos: 0,
      total: 3200,
      descuentos: [],
    },
    tiempoEstimado: 7,
    requisitosEspeciales: [
      "Inmueble debe estar libre de gravámenes",
      "Avalúo no mayor a 6 meses",
      "Comprador y vendedor deben estar presentes",
    ],
    activo: true,
    fechaCreacion: "2024-01-01",
    fechaActualizacion: "2024-01-10",
  },
];

export default function ConfiguracionTramites() {
  const [tramites, setTramites] = useState<TramiteConfig[]>(tramitesIniciales);
  const [tramiteSeleccionado, setTramiteSeleccionado] =
    useState<TramiteConfig | null>(null);
  const [mostrarDialog, setMostrarDialog] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  const handleCrearTramite = () => {
    const nuevoTramite: TramiteConfig = {
      id: `tramite_${Date.now()}`,
      nombre: "",
      descripcion: "",
      categoria: "",
      documentosRequeridos: [],
      costos: {
        costoBase: 0,
        aranceles: 0,
        notariales: 0,
        gastos: 0,
        total: 0,
        descuentos: [],
      },
      tiempoEstimado: 0,
      requisitosEspeciales: [],
      activo: true,
      fechaCreacion: new Date().toISOString().split("T")[0],
      fechaActualizacion: new Date().toISOString().split("T")[0],
    };
    setTramiteSeleccionado(nuevoTramite);
    setModoEdicion(true);
    setMostrarDialog(true);
  };

  const handleEditarTramite = (tramite: TramiteConfig) => {
    setTramiteSeleccionado(tramite);
    setModoEdicion(true);
    setMostrarDialog(true);
  };

  const handleGuardarTramite = () => {
    if (tramiteSeleccionado) {
      if (modoEdicion) {
        setTramites((prev) =>
          prev.map((t) =>
            t.id === tramiteSeleccionado.id ? tramiteSeleccionado : t
          )
        );
      } else {
        setTramites((prev) => [...prev, tramiteSeleccionado]);
      }
      setMostrarDialog(false);
      setTramiteSeleccionado(null);
      setModoEdicion(false);
    }
  };

  const handleEliminarTramite = (id: string) => {
    setTramites((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleActivo = (id: string) => {
    setTramites((prev) =>
      prev.map((t) => (t.id === id ? { ...t, activo: !t.activo } : t))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Configuración de Trámites
              </h1>
              <p className="text-gray-600">
                Gestiona documentos, costos y procesos de cada trámite
              </p>
            </div>
            <Button onClick={handleCrearTramite}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Trámite
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Lista de trámites */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tramites.map((tramite) => (
            <Card
              key={tramite.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{tramite.nombre}</CardTitle>
                  <Badge
                    className={
                      tramite.activo
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {tramite.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
                <CardDescription>{tramite.descripcion}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Categoría:</span>
                  <span className="font-medium">{tramite.categoria}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Documentos:</span>
                  <span className="font-medium">
                    {tramite.documentosRequeridos.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Costo total:</span>
                  <span className="font-medium">
                    ${tramite.costos.total.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Tiempo estimado:</span>
                  <span className="font-medium">
                    {tramite.tiempoEstimado} días
                  </span>
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditarTramite(tramite)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActivo(tramite.id)}
                    className={
                      tramite.activo ? "text-red-600" : "text-green-600"
                    }
                  >
                    {tramite.activo ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEliminarTramite(tramite.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dialog para crear/editar trámite */}
        <Dialog open={mostrarDialog} onOpenChange={setMostrarDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {modoEdicion ? "Editar Trámite" : "Crear Nuevo Trámite"}
              </DialogTitle>
              <DialogDescription>
                Configura todos los aspectos del trámite incluyendo documentos,
                costos y requisitos
              </DialogDescription>
            </DialogHeader>

            {tramiteSeleccionado && (
              <Tabs defaultValue="basico" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basico">Básico</TabsTrigger>
                  <TabsTrigger value="documentos">Documentos</TabsTrigger>
                  <TabsTrigger value="costos">Costos</TabsTrigger>
                  <TabsTrigger value="requisitos">Requisitos</TabsTrigger>
                </TabsList>

                {/* Tab Básico */}
                <TabsContent value="basico" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombre">Nombre del Trámite</Label>
                      <Input
                        id="nombre"
                        value={tramiteSeleccionado.nombre}
                        onChange={(e) =>
                          setTramiteSeleccionado((prev) =>
                            prev ? { ...prev, nombre: e.target.value } : null
                          )
                        }
                        placeholder="Ej: Testamento"
                      />
                    </div>
                    <div>
                      <Label htmlFor="categoria">Categoría</Label>
                      <Input
                        id="categoria"
                        value={tramiteSeleccionado.categoria}
                        onChange={(e) =>
                          setTramiteSeleccionado((prev) =>
                            prev ? { ...prev, categoria: e.target.value } : null
                          )
                        }
                        placeholder="Ej: Sucesiones"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                      id="descripcion"
                      value={tramiteSeleccionado.descripcion}
                      onChange={(e) =>
                        setTramiteSeleccionado((prev) =>
                          prev ? { ...prev, descripcion: e.target.value } : null
                        )
                      }
                      placeholder="Descripción detallada del trámite"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tiempo">Tiempo Estimado (días)</Label>
                      <Input
                        id="tiempo"
                        type="number"
                        value={tramiteSeleccionado.tiempoEstimado}
                        onChange={(e) =>
                          setTramiteSeleccionado((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  tiempoEstimado: Number(e.target.value),
                                }
                              : null
                          )
                        }
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="activo"
                        checked={tramiteSeleccionado.activo}
                        onChange={(e) =>
                          setTramiteSeleccionado((prev) =>
                            prev ? { ...prev, activo: e.target.checked } : null
                          )
                        }
                      />
                      <Label htmlFor="activo">Trámite activo</Label>
                    </div>
                  </div>
                </TabsContent>

                {/* Tab Documentos */}
                <TabsContent value="documentos" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">
                      Documentos Requeridos
                    </h3>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Documento
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {tramiteSeleccionado.documentosRequeridos.map(
                      (doc, index) => (
                        <Card key={doc.id}>
                          <CardContent className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Nombre del Documento</Label>
                                <Input
                                  value={doc.nombre}
                                  onChange={(e) => {
                                    const nuevosDocs = [
                                      ...tramiteSeleccionado.documentosRequeridos,
                                    ];
                                    nuevosDocs[index].nombre = e.target.value;
                                    setTramiteSeleccionado((prev) =>
                                      prev
                                        ? {
                                            ...prev,
                                            documentosRequeridos: nuevosDocs,
                                          }
                                        : null
                                    );
                                  }}
                                />
                              </div>
                              <div>
                                <Label>Descripción</Label>
                                <Input
                                  value={doc.descripcion}
                                  onChange={(e) => {
                                    const nuevosDocs = [
                                      ...tramiteSeleccionado.documentosRequeridos,
                                    ];
                                    nuevosDocs[index].descripcion =
                                      e.target.value;
                                    setTramiteSeleccionado((prev) =>
                                      prev
                                        ? {
                                            ...prev,
                                            documentosRequeridos: nuevosDocs,
                                          }
                                        : null
                                    );
                                  }}
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={doc.obligatorio}
                                  onChange={(e) => {
                                    const nuevosDocs = [
                                      ...tramiteSeleccionado.documentosRequeridos,
                                    ];
                                    nuevosDocs[index].obligatorio =
                                      e.target.checked;
                                    setTramiteSeleccionado((prev) =>
                                      prev
                                        ? {
                                            ...prev,
                                            documentosRequeridos: nuevosDocs,
                                          }
                                        : null
                                    );
                                  }}
                                />
                                <Label>Documento obligatorio</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={doc.ocrHabilitado}
                                  onChange={(e) => {
                                    const nuevosDocs = [
                                      ...tramiteSeleccionado.documentosRequeridos,
                                    ];
                                    nuevosDocs[index].ocrHabilitado =
                                      e.target.checked;
                                    setTramiteSeleccionado((prev) =>
                                      prev
                                        ? {
                                            ...prev,
                                            documentosRequeridos: nuevosDocs,
                                          }
                                        : null
                                    );
                                  }}
                                />
                                <Label>OCR habilitado</Label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    )}
                  </div>
                </TabsContent>

                {/* Tab Costos */}
                <TabsContent value="costos" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="costoBase">Costo Base</Label>
                      <Input
                        id="costoBase"
                        type="number"
                        value={tramiteSeleccionado.costos.costoBase}
                        onChange={(e) => {
                          const nuevoCosto = Number(e.target.value);
                          setTramiteSeleccionado((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  costos: {
                                    ...prev.costos,
                                    costoBase: nuevoCosto,
                                    total:
                                      nuevoCosto +
                                      prev.costos.aranceles +
                                      prev.costos.notariales +
                                      prev.costos.gastos,
                                  },
                                }
                              : null
                          );
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="aranceles">Aranceles</Label>
                      <Input
                        id="aranceles"
                        type="number"
                        value={tramiteSeleccionado.costos.aranceles}
                        onChange={(e) => {
                          const nuevoArancel = Number(e.target.value);
                          setTramiteSeleccionado((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  costos: {
                                    ...prev.costos,
                                    aranceles: nuevoArancel,
                                    total:
                                      prev.costos.costoBase +
                                      nuevoArancel +
                                      prev.costos.notariales +
                                      prev.costos.gastos,
                                  },
                                }
                              : null
                          );
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="notariales">Gastos Notariales</Label>
                      <Input
                        id="notariales"
                        type="number"
                        value={tramiteSeleccionado.costos.notariales}
                        onChange={(e) => {
                          const nuevoNotarial = Number(e.target.value);
                          setTramiteSeleccionado((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  costos: {
                                    ...prev.costos,
                                    notariales: nuevoNotarial,
                                    total:
                                      prev.costos.costoBase +
                                      prev.costos.aranceles +
                                      nuevoNotarial +
                                      prev.costos.gastos,
                                  },
                                }
                              : null
                          );
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gastos">Otros Gastos</Label>
                      <Input
                        id="gastos"
                        type="number"
                        value={tramiteSeleccionado.costos.gastos}
                        onChange={(e) => {
                          const nuevoGasto = Number(e.target.value);
                          setTramiteSeleccionado((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  costos: {
                                    ...prev.costos,
                                    gastos: nuevoGasto,
                                    total:
                                      prev.costos.costoBase +
                                      prev.costos.aranceles +
                                      prev.costos.notariales +
                                      nuevoGasto,
                                  },
                                }
                              : null
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-2xl font-bold text-green-600">
                        ${tramiteSeleccionado.costos.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </TabsContent>

                {/* Tab Requisitos */}
                <TabsContent value="requisitos" className="space-y-4">
                  <div>
                    <Label htmlFor="requisitos">Requisitos Especiales</Label>
                    <Textarea
                      id="requisitos"
                      value={tramiteSeleccionado.requisitosEspeciales.join(
                        "\n"
                      )}
                      onChange={(e) =>
                        setTramiteSeleccionado((prev) =>
                          prev
                            ? {
                                ...prev,
                                requisitosEspeciales: e.target.value
                                  .split("\n")
                                  .filter((r) => r.trim()),
                              }
                            : null
                        )
                      }
                      placeholder="Un requisito por línea"
                      rows={6}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setMostrarDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleGuardarTramite}>
                <Save className="h-4 w-4 mr-2" />
                Guardar Trámite
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
