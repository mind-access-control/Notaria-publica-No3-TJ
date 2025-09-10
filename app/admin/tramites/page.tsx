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

interface ConceptoPersonalizado {
  id: string;
  nombre: string;
  cantidad: number;
}

interface CostosTramite {
  costoBase: number;
  aranceles: number;
  notariales: number;
  gastos: number;
  total: number;
  descuentos: Descuento[];
  conceptosPersonalizados?: ConceptoPersonalizado[];
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
  const [guardando, setGuardando] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState("");
  const [unidadTiempo, setUnidadTiempo] = useState<"horas" | "dias">("horas");

  const calcularTotalCostos = (costos: CostosTramite) => {
    const conceptosPersonalizadosTotal = (
      costos.conceptosPersonalizados || []
    ).reduce((sum, concepto) => sum + concepto.cantidad, 0);

    return (
      costos.costoBase +
      costos.aranceles +
      costos.notariales +
      costos.gastos +
      conceptosPersonalizadosTotal
    );
  };

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
    setUnidadTiempo("horas");
    setMostrarDialog(true);
  };

  const handleEditarTramite = (tramite: TramiteConfig) => {
    setTramiteSeleccionado(tramite);
    setModoEdicion(true);
    setUnidadTiempo(tramite.tiempoEstimado > 24 ? "dias" : "horas");
    setMostrarDialog(true);
  };

  const handleGuardarTramite = async () => {
    if (!tramiteSeleccionado) return;

    // Validaciones básicas
    if (!tramiteSeleccionado.nombre.trim()) {
      alert("El nombre del trámite es obligatorio");
      return;
    }

    if (!tramiteSeleccionado.categoria.trim()) {
      alert("La categoría del trámite es obligatoria");
      return;
    }

    if (tramiteSeleccionado.tiempoEstimado <= 0) {
      alert("El tiempo estimado debe ser mayor a 0");
      return;
    }

    setGuardando(true);

    // Simular guardado con loading
    const tramiteConFechas = {
      ...tramiteSeleccionado,
      fechaActualizacion: new Date().toISOString().split("T")[0],
      fechaCreacion: modoEdicion
        ? tramiteSeleccionado.fechaCreacion
        : new Date().toISOString().split("T")[0],
    };

    try {
      // Simular delay de guardado
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Verificar si es edición o creación basándose en si el trámite ya existe
      const esEdicion = tramites.some((t) => t.id === tramiteSeleccionado.id);

      if (esEdicion) {
        setTramites((prev) =>
          prev.map((t) =>
            t.id === tramiteSeleccionado.id ? tramiteConFechas : t
          )
        );
        setMensajeConfirmacion(
          `✅ Trámite "${tramiteConFechas.nombre}" actualizado exitosamente`
        );
        setMostrarConfirmacion(true);
        setTimeout(() => setMostrarConfirmacion(false), 3000);
      } else {
        setTramites((prev) => [...prev, tramiteConFechas]);

        // Mostrar el nuevo trámite en la lista con animación
        setTimeout(() => {
          const nuevoTramiteElement = document.querySelector(
            `[data-tramite-id="${tramiteConFechas.id}"]`
          );
          if (nuevoTramiteElement) {
            // Scroll suave hacia el nuevo trámite
            nuevoTramiteElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });

            // Animación de entrada
            nuevoTramiteElement.classList.add(
              "animate-pulse",
              "ring-2",
              "ring-blue-500"
            );
            setTimeout(() => {
              nuevoTramiteElement.classList.remove(
                "animate-pulse",
                "ring-2",
                "ring-blue-500"
              );
            }, 3000);
          } else {
            // Si no encuentra el elemento, hacer scroll hacia arriba para mostrar la lista
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }, 200);

        setMensajeConfirmacion(
          `✅ Trámite "${tramiteConFechas.nombre}" creado exitosamente`
        );
        setMostrarConfirmacion(true);
        setTimeout(() => setMostrarConfirmacion(false), 3000);
      }

      setMostrarDialog(false);
      setTramiteSeleccionado(null);
      setModoEdicion(false);
    } catch (error) {
      alert("❌ Error al guardar el trámite. Inténtalo de nuevo.");
    } finally {
      setGuardando(false);
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
              data-tramite-id={tramite.id}
              className="hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-4"
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
                        value={tramiteSeleccionado.nombre || ""}
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
                        value={tramiteSeleccionado.categoria || ""}
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
                      value={tramiteSeleccionado.descripcion || ""}
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
                      <Label htmlFor="tiempo">Tiempo Estimado</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="tiempo"
                          type="number"
                          min="0"
                          value={tramiteSeleccionado.tiempoEstimado || ""}
                          onChange={(e) =>
                            setTramiteSeleccionado((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    tiempoEstimado: Number(e.target.value) || 0,
                                  }
                                : null
                            )
                          }
                          placeholder="0"
                        />
                        <select
                          value={unidadTiempo}
                          onChange={(e) => {
                            const nuevaUnidad = e.target.value as
                              | "horas"
                              | "dias";
                            setUnidadTiempo(nuevaUnidad);
                            // No convertir el valor, solo cambiar la unidad
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="horas">Horas</option>
                          <option value="dias">Días</option>
                        </select>
                      </div>
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
                    <Button
                      size="sm"
                      onClick={() => {
                        const nuevoDoc: DocumentoRequerido = {
                          id: `doc_${Date.now()}`,
                          nombre: "",
                          descripcion: "",
                          obligatorio: true,
                          formato: ["PDF", "JPG", "PNG"],
                          validaciones: ["Vigencia", "Legibilidad"],
                          ocrHabilitado: true,
                          camposExtraidos: [],
                        };
                        setTramiteSeleccionado((prev) =>
                          prev
                            ? {
                                ...prev,
                                documentosRequeridos: [
                                  ...prev.documentosRequeridos,
                                  nuevoDoc,
                                ],
                              }
                            : null
                        );
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Documento Personalizado
                    </Button>
                  </div>

                  {/* Documentos predefinidos */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">
                      Documentos Predefinidos
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        "Identificación oficial vigente (INE/Pasaporte)",
                        "Comprobante de domicilio (no mayor a 3 meses)",
                        "Escritura de propiedad o título de propiedad",
                        "Avalúo comercial del inmueble",
                        "Constancia de no adeudo de predial",
                        "Constancia de no adeudo de agua",
                        "Certificado de libertad de gravamen",
                        "Contrato de compraventa privado (si aplica)",
                        "Acta de nacimiento",
                        "Acta de matrimonio (si aplica)",
                        "Acta de defunción",
                        "Testamento anterior (si existe)",
                        "Certificado médico",
                        "Testigos (2 personas)",
                        "Poder notarial de representantes",
                        "Constancia de reserva de nombre",
                        "Capital social",
                        "Póliza de seguro",
                        "Referencias comerciales",
                        "Garantías (si aplica)",
                      ].map((docPredefinido) => {
                        const yaIncluido =
                          tramiteSeleccionado.documentosRequeridos.some(
                            (doc) => doc.nombre === docPredefinido
                          );

                        return (
                          <div
                            key={docPredefinido}
                            className={`flex items-center space-x-2 p-3 border rounded cursor-pointer transition-colors ${
                              yaIncluido
                                ? "bg-blue-50 border-blue-300 hover:bg-blue-100"
                                : "hover:bg-gray-50"
                            }`}
                            onClick={() => {
                              if (yaIncluido) {
                                // Remover documento
                                setTramiteSeleccionado((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        documentosRequeridos:
                                          prev.documentosRequeridos.filter(
                                            (doc) =>
                                              doc.nombre !== docPredefinido
                                          ),
                                      }
                                    : null
                                );
                              } else {
                                // Agregar documento
                                const nuevoDoc: DocumentoRequerido = {
                                  id: `doc_${Date.now()}_${Math.random()
                                    .toString(36)
                                    .substr(2, 9)}`,
                                  nombre: docPredefinido,
                                  descripcion: `Documento requerido: ${docPredefinido}`,
                                  obligatorio: true,
                                  formato: ["PDF", "JPG", "PNG"],
                                  validaciones: ["Vigencia", "Legibilidad"],
                                  ocrHabilitado: true,
                                  camposExtraidos: [],
                                };
                                setTramiteSeleccionado((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        documentosRequeridos: [
                                          ...prev.documentosRequeridos,
                                          nuevoDoc,
                                        ],
                                      }
                                    : null
                                );
                              }
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={yaIncluido}
                              onChange={() => {}} // El onChange se maneja en el onClick del div
                              className="pointer-events-none" // Evita que el checkbox capture el click
                            />
                            <Label className="text-sm cursor-pointer">
                              {docPredefinido}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Documentos personalizados */}
                  {tramiteSeleccionado.documentosRequeridos.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-700">
                        Documentos Configurados
                      </h4>
                      {tramiteSeleccionado.documentosRequeridos.map(
                        (doc, index) => (
                          <Card key={doc.id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <h5 className="font-medium">
                                  {doc.nombre ||
                                    "Nuevo documento personalizado"}
                                </h5>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setTramiteSeleccionado((prev) =>
                                      prev
                                        ? {
                                            ...prev,
                                            documentosRequeridos:
                                              prev.documentosRequeridos.filter(
                                                (_, i) => i !== index
                                              ),
                                          }
                                        : null
                                    );
                                  }}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label>Nombre del Documento</Label>
                                  <Input
                                    value={doc.nombre || ""}
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
                                    placeholder="Nombre del documento"
                                  />
                                </div>
                                <div>
                                  <Label>Descripción</Label>
                                  <Input
                                    value={doc.descripcion || ""}
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
                                    placeholder="Descripción del documento"
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
                  )}
                </TabsContent>

                {/* Tab Costos */}
                <TabsContent value="costos" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-700">
                        Conceptos de Costo
                      </h4>
                      <Button
                        size="sm"
                        onClick={() => {
                          const nuevoConcepto = {
                            id: `concepto_${Date.now()}`,
                            nombre: "",
                            cantidad: 0,
                          };
                          setTramiteSeleccionado((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  costos: {
                                    ...prev.costos,
                                    conceptosPersonalizados: [
                                      ...(prev.costos.conceptosPersonalizados ||
                                        []),
                                      nuevoConcepto,
                                    ],
                                  },
                                }
                              : null
                          );
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Concepto
                      </Button>
                    </div>

                    {/* Conceptos predefinidos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="costoBase">Costo Base</Label>
                        <Input
                          id="costoBase"
                          type="number"
                          min="0"
                          placeholder="0"
                          value={tramiteSeleccionado.costos.costoBase || ""}
                          onChange={(e) => {
                            const nuevoCosto = Number(e.target.value) || 0;
                            setTramiteSeleccionado((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    costos: {
                                      ...prev.costos,
                                      costoBase: nuevoCosto,
                                      total: calcularTotalCostos({
                                        ...prev.costos,
                                        costoBase: nuevoCosto,
                                      }),
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
                          min="0"
                          placeholder="0"
                          value={tramiteSeleccionado.costos.aranceles || ""}
                          onChange={(e) => {
                            const nuevoArancel = Number(e.target.value) || 0;
                            setTramiteSeleccionado((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    costos: {
                                      ...prev.costos,
                                      aranceles: nuevoArancel,
                                      total: calcularTotalCostos({
                                        ...prev.costos,
                                        aranceles: nuevoArancel,
                                      }),
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
                          min="0"
                          placeholder="0"
                          value={tramiteSeleccionado.costos.notariales || ""}
                          onChange={(e) => {
                            const nuevoNotarial = Number(e.target.value) || 0;
                            setTramiteSeleccionado((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    costos: {
                                      ...prev.costos,
                                      notariales: nuevoNotarial,
                                      total: calcularTotalCostos({
                                        ...prev.costos,
                                        notariales: nuevoNotarial,
                                      }),
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
                          min="0"
                          placeholder="0"
                          value={tramiteSeleccionado.costos.gastos || ""}
                          onChange={(e) => {
                            const nuevoGasto = Number(e.target.value) || 0;
                            setTramiteSeleccionado((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    costos: {
                                      ...prev.costos,
                                      gastos: nuevoGasto,
                                      total: calcularTotalCostos({
                                        ...prev.costos,
                                        gastos: nuevoGasto,
                                      }),
                                    },
                                  }
                                : null
                            );
                          }}
                        />
                      </div>
                    </div>

                    {/* Conceptos personalizados */}
                    {tramiteSeleccionado.costos.conceptosPersonalizados?.map(
                      (concepto, index) => (
                        <Card key={concepto.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-4">
                              <div className="flex-1">
                                <Label>Nombre del Concepto</Label>
                                <Input
                                  value={concepto.nombre}
                                  onChange={(e) => {
                                    const nuevosConceptos = [
                                      ...(tramiteSeleccionado.costos
                                        .conceptosPersonalizados || []),
                                    ];
                                    nuevosConceptos[index].nombre =
                                      e.target.value;
                                    setTramiteSeleccionado((prev) =>
                                      prev
                                        ? {
                                            ...prev,
                                            costos: {
                                              ...prev.costos,
                                              conceptosPersonalizados:
                                                nuevosConceptos,
                                              total: calcularTotalCostos({
                                                ...prev.costos,
                                                conceptosPersonalizados:
                                                  nuevosConceptos,
                                              }),
                                            },
                                          }
                                        : null
                                    );
                                  }}
                                  placeholder="Ej: Gastos de registro, Impuestos, etc."
                                />
                              </div>
                              <div className="w-32">
                                <Label>Cantidad</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  placeholder="0"
                                  value={concepto.cantidad || ""}
                                  onChange={(e) => {
                                    const nuevosConceptos = [
                                      ...(tramiteSeleccionado.costos
                                        .conceptosPersonalizados || []),
                                    ];
                                    nuevosConceptos[index].cantidad =
                                      Number(e.target.value) || 0;
                                    setTramiteSeleccionado((prev) =>
                                      prev
                                        ? {
                                            ...prev,
                                            costos: {
                                              ...prev.costos,
                                              conceptosPersonalizados:
                                                nuevosConceptos,
                                              total: calcularTotalCostos({
                                                ...prev.costos,
                                                conceptosPersonalizados:
                                                  nuevosConceptos,
                                              }),
                                            },
                                          }
                                        : null
                                    );
                                  }}
                                />
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const nuevosConceptos = (
                                    tramiteSeleccionado.costos
                                      .conceptosPersonalizados || []
                                  ).filter((_, i) => i !== index);
                                  setTramiteSeleccionado((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          costos: {
                                            ...prev.costos,
                                            conceptosPersonalizados:
                                              nuevosConceptos,
                                            total: calcularTotalCostos({
                                              ...prev.costos,
                                              conceptosPersonalizados:
                                                nuevosConceptos,
                                            }),
                                          },
                                        }
                                      : null
                                  );
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    )}
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
                                requisitosEspeciales:
                                  e.target.value.split("\n"),
                              }
                            : null
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const textarea = e.target as HTMLTextAreaElement;
                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;
                          const value = textarea.value;
                          const newValue =
                            value.substring(0, start) +
                            "\n" +
                            value.substring(end);

                          setTramiteSeleccionado((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  requisitosEspeciales: newValue.split("\n"),
                                }
                              : null
                          );

                          // Restaurar el cursor después del salto de línea
                          setTimeout(() => {
                            textarea.selectionStart = textarea.selectionEnd =
                              start + 1;
                          }, 0);
                        }
                      }}
                      placeholder="Escribe cada requisito en una línea separada. Presiona Enter para crear una nueva línea."
                      rows={8}
                      className="resize-none"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Presiona Enter para crear una nueva línea. Cada línea será
                      un requisito separado.
                    </p>
                  </div>

                  {/* Vista previa de requisitos */}
                  {tramiteSeleccionado.requisitosEspeciales.filter(
                    (r) => r.trim().length > 0
                  ).length > 0 && (
                    <div className="space-y-2">
                      <Label>Vista Previa de Requisitos:</Label>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <ul className="space-y-1">
                          {tramiteSeleccionado.requisitosEspeciales
                            .filter((r) => r.trim().length > 0)
                            .map((requisito, index) => (
                              <li
                                key={index}
                                className="flex items-start space-x-2"
                              >
                                <span className="text-blue-600 font-medium">
                                  {index + 1}.
                                </span>
                                <span className="text-sm">{requisito}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setMostrarDialog(false)}
                disabled={guardando}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleGuardarTramite}
                disabled={guardando}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {guardando ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Trámite
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Notificación de confirmación */}
        {mostrarConfirmacion && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-4">
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">{mensajeConfirmacion}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
