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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Edit,
  Trash2,
  FileText,
  Download,
  Upload,
  Eye,
  Save,
  Copy,
  Settings,
  Wand2,
  FileCode,
  BookOpen,
  Scale,
  Building,
  User,
  Calendar,
  MapPin,
  DollarSign,
} from "lucide-react";

// Tipos de datos
interface PlantillaEscritura {
  id: string;
  nombre: string;
  tipo: string;
  descripcion: string;
  contenido: string;
  variables: VariablePlantilla[];
  activa: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  version: string;
  autor: string;
  categoria: string;
}

interface VariablePlantilla {
  id: string;
  nombre: string;
  tipo: "texto" | "fecha" | "numero" | "moneda" | "direccion" | "persona";
  descripcion: string;
  obligatoria: boolean;
  valorPorDefecto?: string;
  validaciones: string[];
  posicion: {
    inicio: number;
    fin: number;
  };
}

interface EscrituraGenerada {
  id: string;
  plantillaId: string;
  plantillaNombre: string;
  cliente: string;
  tramite: string;
  contenido: string;
  variables: { [key: string]: string };
  fechaGeneracion: string;
  estado: "borrador" | "revisado" | "aprobado" | "firmado";
  version: string;
}

// Datos simulados
const plantillasIniciales: PlantillaEscritura[] = [
  {
    id: "plantilla_001",
    nombre: "Testamento Público Abierto",
    tipo: "testamento",
    descripcion: "Plantilla para testamento público abierto",
    contenido: `TESTAMENTO PÚBLICO ABIERTO

En la ciudad de {{municipio}}, {{estado}}, siendo las {{hora}} horas del día {{fecha}}, ante mí, {{notario.nombre}}, Notario Público número {{notario.numero}} del Estado de {{estado}}, comparece {{testador.nombre}} {{testador.apellidoPaterno}} {{testador.apellidoMaterno}}, mayor de edad, con domicilio en {{testador.direccion}}, portando identificación oficial {{testador.identificacion}}, quien en pleno uso de sus facultades mentales, expresa su voluntad de otorgar testamento público abierto.

PRIMERA.- Declaro que soy {{testador.nombre}} {{testador.apellidoPaterno}} {{testador.apellidoMaterno}}, de {{testador.edad}} años de edad, nacido el {{testador.fechaNacimiento}} en {{testador.lugarNacimiento}}, con CURP {{testador.curp}}, soltero/casado, con domicilio en {{testador.direccion}}.

SEGUNDA.- Declaro que no tengo ascendientes vivos, y que mis descendientes son: {{herederos.lista}}.

TERCERA.- Instituyo como mis únicos y universales herederos a {{herederos.principales}}.

CUARTA.- En caso de que alguno de mis herederos instituidos premuera, su parte acrecerá a los demás por partes iguales.

QUINTA.- Nombro como albacea a {{albacea.nombre}}, quien deberá cumplir con las disposiciones contenidas en este testamento.

SEXTA.- El presente testamento se otorga con las formalidades que establece la ley, y en caso de que alguna de sus cláusulas sea declarada nula, las demás conservarán su validez.

Leída íntegramente esta escritura por mí el Notario, el testador manifestó estar conforme y la firma en mi presencia y la de los testigos {{testigos.lista}}.

{{fecha}} - {{lugar}}

Firma del Testador: _________________________

Testigos:
1. {{testigo1.nombre}} - {{testigo1.identificacion}}
2. {{testigo2.nombre}} - {{testigo2.identificacion}}

{{notario.nombre}}
Notario Público No. {{notario.numero}}
{{notario.cedula}}`,
    variables: [
      {
        id: "var_001",
        nombre: "municipio",
        tipo: "texto",
        descripcion: "Municipio donde se otorga el testamento",
        obligatoria: true,
        posicion: { inicio: 45, fin: 55 },
      },
      {
        id: "var_002",
        nombre: "estado",
        tipo: "texto",
        descripcion: "Estado donde se otorga el testamento",
        obligatoria: true,
        posicion: { inicio: 60, fin: 70 },
      },
      {
        id: "var_003",
        nombre: "hora",
        tipo: "texto",
        descripcion: "Hora de otorgamiento",
        obligatoria: true,
        posicion: { inicio: 75, fin: 85 },
      },
      {
        id: "var_004",
        nombre: "fecha",
        tipo: "fecha",
        descripcion: "Fecha de otorgamiento",
        obligatoria: true,
        posicion: { inicio: 90, fin: 100 },
      },
      {
        id: "var_005",
        nombre: "testador.nombre",
        tipo: "texto",
        descripcion: "Nombre del testador",
        obligatoria: true,
        posicion: { inicio: 120, fin: 140 },
      },
    ],
    activa: true,
    fechaCreacion: "2024-01-01",
    fechaActualizacion: "2024-01-15",
    version: "1.2",
    autor: "Dr. María López",
    categoria: "Sucesiones",
  },
  {
    id: "plantilla_002",
    nombre: "Compraventa de Inmueble",
    tipo: "compraventa",
    descripcion: "Plantilla para compraventa de inmueble",
    contenido: `ESCRITURA PÚBLICA DE COMPRAVENTA

En la ciudad de {{municipio}}, {{estado}}, siendo las {{hora}} horas del día {{fecha}}, ante mí, {{notario.nombre}}, Notario Público número {{notario.numero}} del Estado de {{estado}}, comparecen:

VENDEDOR: {{vendedor.nombre}} {{vendedor.apellidoPaterno}} {{vendedor.apellidoMaterno}}, mayor de edad, con domicilio en {{vendedor.direccion}}, portando identificación oficial {{vendedor.identificacion}}.

COMPRADOR: {{comprador.nombre}} {{comprador.apellidoPaterno}} {{comprador.apellidoMaterno}}, mayor de edad, con domicilio en {{comprador.direccion}}, portando identificación oficial {{comprador.identificacion}}.

PRIMERA.- El VENDEDOR declara ser propietario del inmueble ubicado en {{inmueble.direccion}}, con superficie de {{inmueble.superficie}} metros cuadrados, inscrito en el Registro Público de la Propiedad bajo el folio {{inmueble.folio}}.

SEGUNDA.- El VENDEDOR vende y el COMPRADOR compra el inmueble descrito en la cláusula anterior por la cantidad de {{precio.letra}} ({{precio.numero}} pesos).

TERCERA.- El precio será pagado de la siguiente manera: {{formaPago.descripcion}}.

CUARTA.- El VENDEDOR se obliga a entregar al COMPRADOR el inmueble libre de gravámenes y ocupaciones.

QUINTA.- El COMPRADOR se obliga a pagar el precio en los términos convenidos.

SEXTA.- El presente contrato se otorga con las formalidades que establece la ley.

Leída íntegramente esta escritura por mí el Notario, las partes manifestaron estar conformes y la firman en mi presencia.

{{fecha}} - {{lugar}}

VENDEDOR: _________________________
COMPRADOR: _________________________

{{notario.nombre}}
Notario Público No. {{notario.numero}}
{{notario.cedula}}`,
    variables: [
      {
        id: "var_006",
        nombre: "vendedor.nombre",
        tipo: "texto",
        descripcion: "Nombre del vendedor",
        obligatoria: true,
        posicion: { inicio: 100, fin: 120 },
      },
      {
        id: "var_007",
        nombre: "comprador.nombre",
        tipo: "texto",
        descripcion: "Nombre del comprador",
        obligatoria: true,
        posicion: { inicio: 150, fin: 170 },
      },
      {
        id: "var_008",
        nombre: "inmueble.direccion",
        tipo: "direccion",
        descripcion: "Dirección del inmueble",
        obligatoria: true,
        posicion: { inicio: 200, fin: 250 },
      },
      {
        id: "var_009",
        nombre: "precio.numero",
        tipo: "moneda",
        descripcion: "Precio de venta",
        obligatoria: true,
        posicion: { inicio: 300, fin: 320 },
      },
    ],
    activa: true,
    fechaCreacion: "2024-01-01",
    fechaActualizacion: "2024-01-10",
    version: "1.1",
    autor: "Dr. Carlos Herrera",
    categoria: "Inmobiliaria",
  },
];

const escriturasGeneradas: EscrituraGenerada[] = [
  {
    id: "escritura_001",
    plantillaId: "plantilla_001",
    plantillaNombre: "Testamento Público Abierto",
    cliente: "Juan Pérez García",
    tramite: "Testamento",
    contenido: "Contenido generado...",
    variables: {
      municipio: "Tijuana",
      estado: "Baja California",
      "testador.nombre": "Juan",
      "testador.apellidoPaterno": "Pérez",
      "testador.apellidoMaterno": "García",
    },
    fechaGeneracion: "2024-01-20",
    estado: "revisado",
    version: "1.0",
  },
];

export default function GestionFormatos() {
  const [plantillas, setPlantillas] =
    useState<PlantillaEscritura[]>(plantillasIniciales);
  const [escrituras, setEscrituras] =
    useState<EscrituraGenerada[]>(escriturasGeneradas);
  const [plantillaSeleccionada, setPlantillaSeleccionada] =
    useState<PlantillaEscritura | null>(null);
  const [mostrarDialog, setMostrarDialog] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todos");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");

  const handleCrearPlantilla = () => {
    const nuevaPlantilla: PlantillaEscritura = {
      id: `plantilla_${Date.now()}`,
      nombre: "",
      tipo: "",
      descripcion: "",
      contenido: "",
      variables: [],
      activa: true,
      fechaCreacion: new Date().toISOString().split("T")[0],
      fechaActualizacion: new Date().toISOString().split("T")[0],
      version: "1.0",
      autor: "Admin",
      categoria: "",
    };
    setPlantillaSeleccionada(nuevaPlantilla);
    setModoEdicion(false);
    setMostrarDialog(true);
  };

  const handleEditarPlantilla = (plantilla: PlantillaEscritura) => {
    setPlantillaSeleccionada(plantilla);
    setModoEdicion(true);
    setMostrarDialog(true);
  };

  const handleGuardarPlantilla = () => {
    if (plantillaSeleccionada) {
      if (modoEdicion) {
        setPlantillas((prev) =>
          prev.map((p) =>
            p.id === plantillaSeleccionada.id ? plantillaSeleccionada : p
          )
        );
      } else {
        setPlantillas((prev) => [...prev, plantillaSeleccionada]);
      }
      setMostrarDialog(false);
      setPlantillaSeleccionada(null);
      setModoEdicion(false);
    }
  };

  const handleEliminarPlantilla = (id: string) => {
    setPlantillas((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggleActiva = (id: string) => {
    setPlantillas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, activa: !p.activa } : p))
    );
  };

  const handleGenerarEscritura = (plantillaId: string) => {
    const plantilla = plantillas.find((p) => p.id === plantillaId);
    if (plantilla) {
      // Simular generación de escritura
      const nuevaEscritura: EscrituraGenerada = {
        id: `escritura_${Date.now()}`,
        plantillaId: plantilla.id,
        plantillaNombre: plantilla.nombre,
        cliente: "Cliente Demo",
        tramite: plantilla.tipo,
        contenido: plantilla.contenido,
        variables: {},
        fechaGeneracion: new Date().toISOString().split("T")[0],
        estado: "borrador",
        version: plantilla.version,
      };
      setEscrituras((prev) => [...prev, nuevaEscritura]);
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "testamento":
        return <Scale className="h-5 w-5" />;
      case "compraventa":
        return <Building className="h-5 w-5" />;
      case "poder":
        return <User className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "aprobado":
        return "bg-green-100 text-green-800";
      case "revisado":
        return "bg-yellow-100 text-yellow-800";
      case "borrador":
        return "bg-blue-100 text-blue-800";
      case "firmado":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filtrar plantillas
  const plantillasFiltradas = plantillas.filter((plantilla) => {
    const cumpleCategoria =
      filtroCategoria === "todos" || plantilla.categoria === filtroCategoria;
    const cumpleTipo = filtroTipo === "todos" || plantilla.tipo === filtroTipo;

    return cumpleCategoria && cumpleTipo;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestión de Formatos
              </h1>
              <p className="text-gray-600">
                Plantillas y formatos para escrituras notariales
              </p>
            </div>
            <Button onClick={handleCrearPlantilla}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Plantilla
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="plantillas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="plantillas">Plantillas</TabsTrigger>
            <TabsTrigger value="generador">Generador</TabsTrigger>
            <TabsTrigger value="escrituras">Escrituras</TabsTrigger>
            <TabsTrigger value="configuracion">Configuración</TabsTrigger>
          </TabsList>

          {/* Tab Plantillas */}
          <TabsContent value="plantillas" className="space-y-6">
            {/* Filtros */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select
                    value={filtroCategoria}
                    onValueChange={setFiltroCategoria}
                  >
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">
                        Todas las categorías
                      </SelectItem>
                      <SelectItem value="Sucesiones">Sucesiones</SelectItem>
                      <SelectItem value="Inmobiliaria">Inmobiliaria</SelectItem>
                      <SelectItem value="Mercantil">Mercantil</SelectItem>
                      <SelectItem value="Civil">Civil</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los tipos</SelectItem>
                      <SelectItem value="testamento">Testamento</SelectItem>
                      <SelectItem value="compraventa">Compraventa</SelectItem>
                      <SelectItem value="poder">Poder</SelectItem>
                      <SelectItem value="fideicomiso">Fideicomiso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Lista de plantillas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plantillasFiltradas.map((plantilla) => (
                <Card
                  key={plantilla.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getTipoIcon(plantilla.tipo)}
                        <div>
                          <CardTitle className="text-lg">
                            {plantilla.nombre}
                          </CardTitle>
                          <CardDescription>
                            {plantilla.descripcion}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge
                        className={
                          plantilla.activa
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {plantilla.activa ? "Activa" : "Inactiva"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Categoría:</span>
                        <p className="font-medium">{plantilla.categoria}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Versión:</span>
                        <p className="font-medium">{plantilla.version}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Autor:</span>
                        <p className="font-medium">{plantilla.autor}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Variables:</span>
                        <p className="font-medium">
                          {plantilla.variables.length}
                        </p>
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500 text-sm">Variables:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {plantilla.variables.slice(0, 3).map((variable) => (
                          <Badge
                            key={variable.id}
                            variant="outline"
                            className="text-xs"
                          >
                            {variable.nombre}
                          </Badge>
                        ))}
                        {plantilla.variables.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{plantilla.variables.length - 3} más
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditarPlantilla(plantilla)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActiva(plantilla.id)}
                        className={
                          plantilla.activa ? "text-red-600" : "text-green-600"
                        }
                      >
                        {plantilla.activa ? (
                          <Trash2 className="h-4 w-4" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerarEscritura(plantilla.id)}
                      >
                        <Wand2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab Generador */}
          <TabsContent value="generador" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generador de Escrituras</CardTitle>
                <CardDescription>
                  Selecciona una plantilla y completa las variables para generar
                  una escritura
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="plantilla">Seleccionar Plantilla</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Elige una plantilla" />
                      </SelectTrigger>
                      <SelectContent>
                        {plantillas.map((plantilla) => (
                          <SelectItem key={plantilla.id} value={plantilla.id}>
                            {plantilla.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cliente">Cliente</Label>
                      <Input id="cliente" placeholder="Nombre del cliente" />
                    </div>
                    <div>
                      <Label htmlFor="tramite">Trámite</Label>
                      <Input id="tramite" placeholder="Tipo de trámite" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="variables">Variables de la Plantilla</Label>
                    <div className="space-y-4 mt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="municipio">Municipio</Label>
                          <Input id="municipio" placeholder="Tijuana" />
                        </div>
                        <div>
                          <Label htmlFor="estado">Estado</Label>
                          <Input id="estado" placeholder="Baja California" />
                        </div>
                        <div>
                          <Label htmlFor="fecha">Fecha</Label>
                          <Input id="fecha" type="date" />
                        </div>
                        <div>
                          <Label htmlFor="hora">Hora</Label>
                          <Input id="hora" type="time" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generar Escritura
                    </Button>
                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Vista Previa
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Descargar PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Escrituras */}
          <TabsContent value="escrituras" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Escrituras Generadas</CardTitle>
                <CardDescription>
                  Historial de escrituras generadas con las plantillas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {escrituras.map((escritura) => (
                    <div
                      key={escritura.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <FileText className="h-8 w-8 text-gray-400" />
                        <div>
                          <h4 className="font-semibold">
                            {escritura.plantillaNombre}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Cliente: {escritura.cliente} • Trámite:{" "}
                            {escritura.tramite}
                          </p>
                          <p className="text-xs text-gray-400">
                            Generada: {escritura.fechaGeneracion} • Versión:{" "}
                            {escritura.version}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={getEstadoColor(escritura.estado)}>
                          {escritura.estado}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
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
          </TabsContent>

          {/* Tab Configuración */}
          <TabsContent value="configuracion" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Sistema</CardTitle>
                <CardDescription>
                  Ajustes generales del sistema de plantillas y generación de
                  escrituras
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="formatoSalida">Formato de Salida</Label>
                    <Select defaultValue="pdf">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="docx">Word (DOCX)</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                        <SelectItem value="txt">Texto Plano</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="plantillaPorDefecto">
                      Plantilla por Defecto
                    </Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar plantilla" />
                      </SelectTrigger>
                      <SelectContent>
                        {plantillas.map((plantilla) => (
                          <SelectItem key={plantilla.id} value={plantilla.id}>
                            {plantilla.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="versionado">Versionado Automático</Label>
                    <Select defaultValue="si">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="si">Sí</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="validacion">Validación Automática</Label>
                    <Select defaultValue="si">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="si">Sí</SelectItem>
                        <SelectItem value="no">No</SelectItem>
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

        {/* Dialog para crear/editar plantilla */}
        <Dialog open={mostrarDialog} onOpenChange={setMostrarDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {modoEdicion ? "Editar Plantilla" : "Crear Nueva Plantilla"}
              </DialogTitle>
              <DialogDescription>
                Configura el contenido y variables de la plantilla de escritura
              </DialogDescription>
            </DialogHeader>

            {plantillaSeleccionada && (
              <Tabs defaultValue="basico" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basico">Básico</TabsTrigger>
                  <TabsTrigger value="contenido">Contenido</TabsTrigger>
                  <TabsTrigger value="variables">Variables</TabsTrigger>
                </TabsList>

                {/* Tab Básico */}
                <TabsContent value="basico" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombre">Nombre de la Plantilla</Label>
                      <Input
                        id="nombre"
                        value={plantillaSeleccionada.nombre}
                        onChange={(e) =>
                          setPlantillaSeleccionada((prev) =>
                            prev ? { ...prev, nombre: e.target.value } : null
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="tipo">Tipo</Label>
                      <Select
                        value={plantillaSeleccionada.tipo}
                        onValueChange={(value) =>
                          setPlantillaSeleccionada((prev) =>
                            prev ? { ...prev, tipo: value } : null
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="testamento">Testamento</SelectItem>
                          <SelectItem value="compraventa">
                            Compraventa
                          </SelectItem>
                          <SelectItem value="poder">Poder</SelectItem>
                          <SelectItem value="fideicomiso">
                            Fideicomiso
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="categoria">Categoría</Label>
                      <Input
                        id="categoria"
                        value={plantillaSeleccionada.categoria}
                        onChange={(e) =>
                          setPlantillaSeleccionada((prev) =>
                            prev ? { ...prev, categoria: e.target.value } : null
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="version">Versión</Label>
                      <Input
                        id="version"
                        value={plantillaSeleccionada.version}
                        onChange={(e) =>
                          setPlantillaSeleccionada((prev) =>
                            prev ? { ...prev, version: e.target.value } : null
                          )
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                      id="descripcion"
                      value={plantillaSeleccionada.descripcion}
                      onChange={(e) =>
                        setPlantillaSeleccionada((prev) =>
                          prev ? { ...prev, descripcion: e.target.value } : null
                        )
                      }
                      rows={3}
                    />
                  </div>
                </TabsContent>

                {/* Tab Contenido */}
                <TabsContent value="contenido" className="space-y-4">
                  <div>
                    <Label htmlFor="contenido">Contenido de la Plantilla</Label>
                    <Textarea
                      id="contenido"
                      value={plantillaSeleccionada.contenido}
                      onChange={(e) =>
                        setPlantillaSeleccionada((prev) =>
                          prev ? { ...prev, contenido: e.target.value } : null
                        )
                      }
                      rows={20}
                      className="font-mono text-sm"
                      placeholder="Escribe el contenido de la plantilla usando {{variable}} para las variables..."
                    />
                  </div>
                </TabsContent>

                {/* Tab Variables */}
                <TabsContent value="variables" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">
                      Variables de la Plantilla
                    </h3>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Variable
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {plantillaSeleccionada.variables.map((variable, index) => (
                      <Card key={variable.id}>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label>Nombre de la Variable</Label>
                              <Input
                                value={variable.nombre}
                                onChange={(e) => {
                                  const nuevasVariables = [
                                    ...plantillaSeleccionada.variables,
                                  ];
                                  nuevasVariables[index].nombre =
                                    e.target.value;
                                  setPlantillaSeleccionada((prev) =>
                                    prev
                                      ? { ...prev, variables: nuevasVariables }
                                      : null
                                  );
                                }}
                              />
                            </div>
                            <div>
                              <Label>Tipo</Label>
                              <Select
                                value={variable.tipo}
                                onValueChange={(value) => {
                                  const nuevasVariables = [
                                    ...plantillaSeleccionada.variables,
                                  ];
                                  nuevasVariables[index].tipo = value as any;
                                  setPlantillaSeleccionada((prev) =>
                                    prev
                                      ? { ...prev, variables: nuevasVariables }
                                      : null
                                  );
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="texto">Texto</SelectItem>
                                  <SelectItem value="fecha">Fecha</SelectItem>
                                  <SelectItem value="numero">Número</SelectItem>
                                  <SelectItem value="moneda">Moneda</SelectItem>
                                  <SelectItem value="direccion">
                                    Dirección
                                  </SelectItem>
                                  <SelectItem value="persona">
                                    Persona
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const nuevasVariables =
                                    plantillaSeleccionada.variables.filter(
                                      (_, i) => i !== index
                                    );
                                  setPlantillaSeleccionada((prev) =>
                                    prev
                                      ? { ...prev, variables: nuevasVariables }
                                      : null
                                  );
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-2">
                            <Label>Descripción</Label>
                            <Input
                              value={variable.descripcion}
                              onChange={(e) => {
                                const nuevasVariables = [
                                  ...plantillaSeleccionada.variables,
                                ];
                                nuevasVariables[index].descripcion =
                                  e.target.value;
                                setPlantillaSeleccionada((prev) =>
                                  prev
                                    ? { ...prev, variables: nuevasVariables }
                                    : null
                                );
                              }}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setMostrarDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleGuardarPlantilla}>
                <Save className="h-4 w-4 mr-2" />
                Guardar Plantilla
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
