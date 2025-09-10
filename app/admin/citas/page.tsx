"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Plus,
  Edit,
  Trash2,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  FileText,
  Settings,
  Eye,
  Send,
  Download,
} from "lucide-react";

// Tipos de datos
interface Cita {
  id: string;
  cliente: {
    nombre: string;
    email: string;
    telefono: string;
  };
  tramite: {
    id: string;
    nombre: string;
    descripcion: string;
  };
  fecha: string;
  hora: string;
  duracion: number;
  sala: {
    id: string;
    nombre: string;
    capacidad: number;
    ubicacion: string;
    equipamiento: string[];
  };
  notario: {
    id: string;
    nombre: string;
    especialidades: string[];
  };
  estado:
    | "programada"
    | "confirmada"
    | "en_progreso"
    | "completada"
    | "cancelada"
    | "reprogramada";
  prioridad: "baja" | "media" | "alta" | "urgente";
  notas: string;
  documentosRequeridos: string[];
  costo: number;
  fechaCreacion: string;
  fechaActualizacion: string;
  recordatorios: Recordatorio[];
}

interface Sala {
  id: string;
  nombre: string;
  capacidad: number;
  ubicacion: string;
  equipamiento: string[];
  disponibilidad: {
    [fecha: string]: {
      [hora: string]: boolean;
    };
  };
  activa: boolean;
}

interface Recordatorio {
  id: string;
  tipo: "email" | "sms" | "whatsapp";
  fechaEnvio: string;
  enviado: boolean;
  contenido: string;
}

// Datos simulados
const citasIniciales: Cita[] = [
  {
    id: "cita_001",
    cliente: {
      nombre: "Juan Pérez García",
      email: "juan.perez@email.com",
      telefono: "6641234567",
    },
    tramite: {
      id: "testamento",
      nombre: "Testamento",
      descripcion: "Testamento público abierto",
    },
    fecha: "2024-01-25",
    hora: "10:00",
    duracion: 60,
    sala: {
      id: "sala_001",
      nombre: "Sala Principal",
      capacidad: 8,
      ubicacion: "Planta Baja",
      equipamiento: ["Proyector", "Pizarra", "Sistema de audio"],
    },
    notario: {
      id: "notario_001",
      nombre: "Dr. María López",
      especialidades: ["Testamentos", "Compraventas"],
    },
    estado: "programada",
    prioridad: "alta",
    notas: "Cliente requiere revisión de documentos previos",
    documentosRequeridos: [
      "Identificación",
      "Comprobante de domicilio",
      "CURP",
    ],
    costo: 2500,
    fechaCreacion: "2024-01-20",
    fechaActualizacion: "2024-01-20",
    recordatorios: [
      {
        id: "rec_001",
        tipo: "email",
        fechaEnvio: "2024-01-24 09:00",
        enviado: false,
        contenido: "Recordatorio de cita mañana a las 10:00",
      },
    ],
  },
  {
    id: "cita_002",
    cliente: {
      nombre: "Ana Martínez Ruiz",
      email: "ana.martinez@email.com",
      telefono: "6642345678",
    },
    tramite: {
      id: "compraventa",
      nombre: "Compraventa",
      descripcion: "Compraventa de inmueble",
    },
    fecha: "2024-01-26",
    hora: "14:30",
    duracion: 90,
    sala: {
      id: "sala_002",
      nombre: "Sala de Juntas",
      capacidad: 6,
      ubicacion: "Primer Piso",
      equipamiento: ["TV", "Mesa de trabajo"],
    },
    notario: {
      id: "notario_002",
      nombre: "Dr. Carlos Herrera",
      especialidades: ["Inmobiliaria", "Sucesiones"],
    },
    estado: "confirmada",
    prioridad: "media",
    notas: "Revisión de escritura anterior requerida",
    documentosRequeridos: ["Escritura anterior", "Predial", "Avalúo"],
    costo: 3200,
    fechaCreacion: "2024-01-18",
    fechaActualizacion: "2024-01-22",
    recordatorios: [
      {
        id: "rec_002",
        tipo: "whatsapp",
        fechaEnvio: "2024-01-25 14:00",
        enviado: true,
        contenido: "Recordatorio de cita mañana a las 14:30",
      },
    ],
  },
];

const salasDisponibles: Sala[] = [
  {
    id: "sala_001",
    nombre: "Sala Principal",
    capacidad: 8,
    ubicacion: "Planta Baja",
    equipamiento: ["Proyector", "Pizarra", "Sistema de audio"],
    disponibilidad: {},
    activa: true,
  },
  {
    id: "sala_002",
    nombre: "Sala de Juntas",
    capacidad: 6,
    ubicacion: "Primer Piso",
    equipamiento: ["TV", "Mesa de trabajo"],
    disponibilidad: {},
    activa: true,
  },
  {
    id: "sala_003",
    nombre: "Sala Privada",
    capacidad: 4,
    ubicacion: "Segundo Piso",
    equipamiento: ["Computadora", "Impresora"],
    disponibilidad: {},
    activa: true,
  },
];

const notariosDisponibles = [
  {
    id: "notario_001",
    nombre: "Dr. María López",
    especialidades: ["Testamentos", "Compraventas", "Poderes"],
  },
  {
    id: "notario_002",
    nombre: "Dr. Carlos Herrera",
    especialidades: ["Inmobiliaria", "Sucesiones", "Fideicomisos"],
  },
];

const tramitesDisponibles = [
  {
    id: "testamento",
    nombre: "Testamento",
    descripcion: "Testamento público abierto",
    duracionEstimada: 60,
  },
  {
    id: "compraventa",
    nombre: "Compraventa",
    descripcion: "Compraventa de inmueble",
    duracionEstimada: 90,
  },
  {
    id: "poder",
    nombre: "Poder Notarial",
    descripcion: "Poder para pleitos y cobranzas",
    duracionEstimada: 45,
  },
];

export default function GestionCitas() {
  const [citas, setCitas] = useState<Cita[]>(citasIniciales);
  const [salas, setSalas] = useState<Sala[]>(salasDisponibles);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);
  const [mostrarDialog, setMostrarDialog] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(new Date());
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [filtroNotario, setFiltroNotario] = useState<string>("todos");
  const [mostrarDialogSala, setMostrarDialogSala] = useState(false);
  const [salaSeleccionada, setSalaSeleccionada] = useState<Sala | null>(null);
  const [modoEdicionSala, setModoEdicionSala] = useState(false);
  const [enviandoCita, setEnviandoCita] = useState<string | null>(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState("");

  const handleCrearCita = () => {
    const nuevaCita: Cita = {
      id: `cita_${Date.now()}`,
      cliente: {
        nombre: "",
        email: "",
        telefono: "",
      },
      tramite: {
        id: "",
        nombre: "",
        descripcion: "",
      },
      fecha: fechaSeleccionada.toISOString().split("T")[0],
      hora: "09:00",
      duracion: 60,
      sala: {
        id: "",
        nombre: "",
        capacidad: 0,
        ubicacion: "",
        equipamiento: [],
      },
      notario: {
        id: "",
        nombre: "",
        especialidades: [],
      },
      estado: "programada",
      prioridad: "media",
      notas: "",
      documentosRequeridos: [],
      costo: 0,
      fechaCreacion: new Date().toISOString().split("T")[0],
      fechaActualizacion: new Date().toISOString().split("T")[0],
      recordatorios: [],
    };
    setCitaSeleccionada(nuevaCita);
    setModoEdicion(false);
    setMostrarDialog(true);
  };

  const handleEditarCita = (cita: Cita) => {
    setCitaSeleccionada(cita);
    setModoEdicion(true);
    setMostrarDialog(true);
  };

  const handleGuardarCita = () => {
    if (citaSeleccionada) {
      if (modoEdicion) {
        setCitas((prev) =>
          prev.map((c) => (c.id === citaSeleccionada.id ? citaSeleccionada : c))
        );
      } else {
        setCitas((prev) => [...prev, citaSeleccionada]);
      }
      setMostrarDialog(false);
      setCitaSeleccionada(null);
      setModoEdicion(false);
    }
  };

  const handleEliminarCita = (id: string) => {
    setCitas((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCambiarEstado = (id: string, nuevoEstado: string) => {
    setCitas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, estado: nuevoEstado as any } : c))
    );
  };

  const handleEnviarCita = async (cita: Cita, metodo: "email" | "whatsapp") => {
    setEnviandoCita(cita.id);

    // Simular envío
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setEnviandoCita(null);
    setMensajeConfirmacion(
      `Cita enviada por ${
        metodo === "email" ? "correo electrónico" : "WhatsApp"
      }`
    );
    setMostrarConfirmacion(true);

    setTimeout(() => {
      setMostrarConfirmacion(false);
    }, 3000);
  };

  const handleCrearSala = () => {
    const nuevaSala: Sala = {
      id: `sala_${Date.now()}`,
      nombre: "",
      capacidad: 4,
      ubicacion: "",
      equipamiento: [],
      disponibilidad: {},
      activa: true,
    };
    setSalaSeleccionada(nuevaSala);
    setModoEdicionSala(false);
    setMostrarDialogSala(true);
  };

  const handleEditarSala = (sala: Sala) => {
    setSalaSeleccionada(sala);
    setModoEdicionSala(true);
    setMostrarDialogSala(true);
  };

  const handleGuardarSala = () => {
    if (salaSeleccionada) {
      if (modoEdicionSala) {
        setSalas((prev) =>
          prev.map((s) => (s.id === salaSeleccionada.id ? salaSeleccionada : s))
        );
      } else {
        setSalas((prev) => [...prev, salaSeleccionada]);
      }
      setMostrarDialogSala(false);
      setSalaSeleccionada(null);
      setModoEdicionSala(false);
    }
  };

  const handleEliminarSala = (id: string) => {
    setSalas((prev) => prev.filter((s) => s.id !== id));
  };

  const verificarDisponibilidadSala = (
    salaId: string,
    fecha: string,
    hora: string
  ) => {
    const sala = salas.find((s) => s.id === salaId);
    if (!sala) return false;

    // Verificar si hay citas en esa sala, fecha y hora
    const citasEnEsaHora = citas.filter(
      (cita) =>
        cita.sala.id === salaId &&
        cita.fecha === fecha &&
        cita.hora === hora &&
        cita.estado !== "cancelada"
    );

    return citasEnEsaHora.length === 0;
  };

  const obtenerSalasDisponibles = (fecha: string, hora: string) => {
    return salas.filter(
      (sala) => sala.activa && verificarDisponibilidadSala(sala.id, fecha, hora)
    );
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "programada":
        return "bg-blue-100 text-blue-800";
      case "confirmada":
        return "bg-green-100 text-green-800";
      case "en_progreso":
        return "bg-yellow-100 text-yellow-800";
      case "completada":
        return "bg-purple-100 text-purple-800";
      case "cancelada":
        return "bg-red-100 text-red-800";
      case "reprogramada":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "urgente":
        return "bg-red-100 text-red-800";
      case "alta":
        return "bg-orange-100 text-orange-800";
      case "media":
        return "bg-yellow-100 text-yellow-800";
      case "baja":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filtrar citas
  const citasFiltradas = citas.filter((cita) => {
    const cumpleEstado =
      filtroEstado === "todos" || cita.estado === filtroEstado;
    const cumpleNotario =
      filtroNotario === "todos" || cita.notario.id === filtroNotario;

    return cumpleEstado && cumpleNotario;
  });

  // Obtener citas del día seleccionado
  const citasDelDia = citasFiltradas.filter(
    (cita) => cita.fecha === fechaSeleccionada.toISOString().split("T")[0]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestión de Citas
              </h1>
              <p className="text-gray-600">
                Programa y administra las citas de los clientes
              </p>
            </div>
            <Button onClick={handleCrearCita}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Cita
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="calendario" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="calendario">Calendario</TabsTrigger>
            <TabsTrigger value="lista">Lista de Citas</TabsTrigger>
            <TabsTrigger value="salas">Salas</TabsTrigger>
            <TabsTrigger value="reportes">Reportes</TabsTrigger>
          </TabsList>

          {/* Tab Calendario */}
          <TabsContent value="calendario" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Calendario de Citas</CardTitle>
                    <CardDescription>
                      Selecciona una fecha para ver las citas programadas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={fechaSeleccionada}
                      onSelect={(date) => date && setFechaSeleccionada(date)}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Citas del Día</CardTitle>
                    <CardDescription>
                      {fechaSeleccionada.toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {citasDelDia.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                          No hay citas programadas para este día
                        </p>
                      ) : (
                        citasDelDia.map((cita) => (
                          <div
                            key={cita.id}
                            className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleEditarCita(cita)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold">{cita.hora}</span>
                              <Badge className={getEstadoColor(cita.estado)}>
                                {cita.estado.replace("_", " ")}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium">
                              {cita.cliente.nombre}
                            </p>
                            <p className="text-xs text-gray-500">
                              {cita.tramite.nombre}
                            </p>
                            <p className="text-xs text-gray-500">
                              {cita.sala.nombre}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Tab Lista de Citas */}
          <TabsContent value="lista" className="space-y-6">
            {/* Filtros */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los estados</SelectItem>
                      <SelectItem value="programada">Programada</SelectItem>
                      <SelectItem value="confirmada">Confirmada</SelectItem>
                      <SelectItem value="en_progreso">En Progreso</SelectItem>
                      <SelectItem value="completada">Completada</SelectItem>
                      <SelectItem value="cancelada">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filtroNotario}
                    onValueChange={setFiltroNotario}
                  >
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Notario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los notarios</SelectItem>
                      {notariosDisponibles.map((notario) => (
                        <SelectItem key={notario.id} value={notario.id}>
                          {notario.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Lista de citas */}
            <div className="space-y-4">
              {citasFiltradas.map((cita) => (
                <Card
                  key={cita.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="text-lg font-semibold">
                            {cita.cliente.nombre}
                          </h3>
                          <Badge className={getEstadoColor(cita.estado)}>
                            {cita.estado.replace("_", " ")}
                          </Badge>
                          <Badge className={getPrioridadColor(cita.prioridad)}>
                            {cita.prioridad}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">
                          {cita.tramite.nombre}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="h-4 w-4" />
                            <span>
                              {cita.fecha} a las {cita.hora}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{cita.sala.nombre}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>{cita.notario.nombre}</span>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center space-x-4 text-sm">
                          <span>Costo: ${cita.costo.toLocaleString()}</span>
                          <span>Duración: {cita.duracion} min</span>
                          <span>
                            Documentos: {cita.documentosRequeridos.length}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditarCita(cita)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEnviarCita(cita, "email")}
                          disabled={enviandoCita === cita.id}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEnviarCita(cita, "whatsapp")}
                          disabled={enviandoCita === cita.id}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEliminarCita(cita.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Select
                          value={cita.estado}
                          onValueChange={(value) =>
                            handleCambiarEstado(cita.id, value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="programada">
                              Programada
                            </SelectItem>
                            <SelectItem value="confirmada">
                              Confirmada
                            </SelectItem>
                            <SelectItem value="en_progreso">
                              En Progreso
                            </SelectItem>
                            <SelectItem value="completada">
                              Completada
                            </SelectItem>
                            <SelectItem value="cancelada">Cancelada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab Salas */}
          <TabsContent value="salas" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestión de Salas</h2>
              <Button onClick={handleCrearSala}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Sala
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {salas.map((sala) => (
                <Card key={sala.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{sala.nombre}</CardTitle>
                      <Badge
                        className={
                          sala.activa
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {sala.activa ? "Disponible" : "Ocupada"}
                      </Badge>
                    </div>
                    <CardDescription>{sala.ubicacion}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <Users className="h-4 w-4" />
                      <span>Capacidad: {sala.capacidad} personas</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Equipamiento:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {sala.equipamiento.map((item, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEditarSala(sala)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEliminarSala(sala.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab Reportes */}
          <TabsContent value="reportes" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas de Citas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total de citas este mes</span>
                      <span className="font-semibold">24</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Citas completadas</span>
                      <span className="font-semibold">18 (75%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Citas canceladas</span>
                      <span className="font-semibold">3 (12.5%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Promedio de duración</span>
                      <span className="font-semibold">65 min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Utilización de Salas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Sala Principal</span>
                      <span className="font-semibold">85%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sala de Juntas</span>
                      <span className="font-semibold">60%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sala Privada</span>
                      <span className="font-semibold">40%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialog para crear/editar cita */}
        <Dialog open={mostrarDialog} onOpenChange={setMostrarDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {modoEdicion ? "Editar Cita" : "Crear Nueva Cita"}
              </DialogTitle>
              <DialogDescription>
                Programa una nueva cita con el cliente
              </DialogDescription>
            </DialogHeader>

            {citaSeleccionada && (
              <div className="space-y-6">
                {/* Información del cliente */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Información del Cliente
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clienteNombre">Nombre Completo</Label>
                      <Input
                        id="clienteNombre"
                        value={citaSeleccionada.cliente.nombre}
                        onChange={(e) =>
                          setCitaSeleccionada((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  cliente: {
                                    ...prev.cliente,
                                    nombre: e.target.value,
                                  },
                                }
                              : null
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="clienteEmail">Email</Label>
                      <Input
                        id="clienteEmail"
                        type="email"
                        value={citaSeleccionada.cliente.email}
                        onChange={(e) =>
                          setCitaSeleccionada((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  cliente: {
                                    ...prev.cliente,
                                    email: e.target.value,
                                  },
                                }
                              : null
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="clienteTelefono">Teléfono</Label>
                      <Input
                        id="clienteTelefono"
                        value={citaSeleccionada.cliente.telefono}
                        onChange={(e) =>
                          setCitaSeleccionada((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  cliente: {
                                    ...prev.cliente,
                                    telefono: e.target.value,
                                  },
                                }
                              : null
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Información de la cita */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Detalles de la Cita</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fecha">Fecha</Label>
                      <Input
                        id="fecha"
                        type="date"
                        value={citaSeleccionada.fecha}
                        onChange={(e) =>
                          setCitaSeleccionada((prev) =>
                            prev ? { ...prev, fecha: e.target.value } : null
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="hora">Hora</Label>
                      <Input
                        id="hora"
                        type="time"
                        value={citaSeleccionada.hora}
                        onChange={(e) =>
                          setCitaSeleccionada((prev) =>
                            prev ? { ...prev, hora: e.target.value } : null
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="duracion">Duración (minutos)</Label>
                      <Input
                        id="duracion"
                        type="number"
                        value={citaSeleccionada.duracion}
                        onChange={(e) =>
                          setCitaSeleccionada((prev) =>
                            prev
                              ? { ...prev, duracion: Number(e.target.value) }
                              : null
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="costo">Costo</Label>
                      <Input
                        id="costo"
                        type="number"
                        value={citaSeleccionada.costo || ""}
                        onChange={(e) =>
                          setCitaSeleccionada((prev) =>
                            prev
                              ? { ...prev, costo: Number(e.target.value) }
                              : null
                          )
                        }
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tramite">Trámite</Label>
                      <Select
                        value={citaSeleccionada.tramite.id}
                        onValueChange={(value) => {
                          const tramite = tramitesDisponibles.find(
                            (t) => t.id === value
                          );
                          setCitaSeleccionada((prev) =>
                            prev && tramite
                              ? {
                                  ...prev,
                                  tramite: {
                                    id: tramite.id,
                                    nombre: tramite.nombre,
                                    descripcion: tramite.descripcion,
                                  },
                                }
                              : null
                          );
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar trámite" />
                        </SelectTrigger>
                        <SelectContent>
                          {tramitesDisponibles.map((tramite) => (
                            <SelectItem key={tramite.id} value={tramite.id}>
                              {tramite.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="notario">Notario</Label>
                      <Select
                        value={citaSeleccionada.notario.id}
                        onValueChange={(value) => {
                          const notario = notariosDisponibles.find(
                            (n) => n.id === value
                          );
                          setCitaSeleccionada((prev) =>
                            prev && notario
                              ? {
                                  ...prev,
                                  notario: {
                                    id: notario.id,
                                    nombre: notario.nombre,
                                    especialidades: notario.especialidades,
                                  },
                                }
                              : null
                          );
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar notario" />
                        </SelectTrigger>
                        <SelectContent>
                          {notariosDisponibles.map((notario) => (
                            <SelectItem key={notario.id} value={notario.id}>
                              {notario.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="sala">Sala</Label>
                      <Select
                        value={citaSeleccionada.sala.id}
                        onValueChange={(value) => {
                          const sala = salas.find((s) => s.id === value);
                          setCitaSeleccionada((prev) =>
                            prev && sala
                              ? {
                                  ...prev,
                                  sala: {
                                    id: sala.id,
                                    nombre: sala.nombre,
                                    capacidad: sala.capacidad,
                                    ubicacion: sala.ubicacion,
                                    equipamiento: sala.equipamiento,
                                  },
                                }
                              : null
                          );
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar sala" />
                        </SelectTrigger>
                        <SelectContent>
                          {obtenerSalasDisponibles(
                            citaSeleccionada.fecha,
                            citaSeleccionada.hora
                          ).map((sala) => (
                            <SelectItem key={sala.id} value={sala.id}>
                              {sala.nombre} ({sala.capacidad} personas) -{" "}
                              {sala.ubicacion}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {obtenerSalasDisponibles(
                        citaSeleccionada.fecha,
                        citaSeleccionada.hora
                      ).length === 0 && (
                        <p className="text-sm text-red-600 mt-1">
                          No hay salas disponibles para esta fecha y hora
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="prioridad">Prioridad</Label>
                      <Select
                        value={citaSeleccionada.prioridad}
                        onValueChange={(value) =>
                          setCitaSeleccionada((prev) =>
                            prev ? { ...prev, prioridad: value as any } : null
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baja">Baja</SelectItem>
                          <SelectItem value="media">Media</SelectItem>
                          <SelectItem value="alta">Alta</SelectItem>
                          <SelectItem value="urgente">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notas">Notas</Label>
                    <Textarea
                      id="notas"
                      value={citaSeleccionada.notas}
                      onChange={(e) =>
                        setCitaSeleccionada((prev) =>
                          prev ? { ...prev, notas: e.target.value } : null
                        )
                      }
                      placeholder="Notas adicionales sobre la cita"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setMostrarDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleGuardarCita}>
                <CalendarIcon className="h-4 w-4 mr-2" />
                Guardar Cita
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog para crear/editar sala */}
        <Dialog open={mostrarDialogSala} onOpenChange={setMostrarDialogSala}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {modoEdicionSala ? "Editar Sala" : "Crear Nueva Sala"}
              </DialogTitle>
              <DialogDescription>
                Configura la información de la sala
              </DialogDescription>
            </DialogHeader>

            {salaSeleccionada && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="salaNombre">Nombre de la Sala</Label>
                    <Input
                      id="salaNombre"
                      value={salaSeleccionada.nombre}
                      onChange={(e) =>
                        setSalaSeleccionada((prev) =>
                          prev ? { ...prev, nombre: e.target.value } : null
                        )
                      }
                      placeholder="Ej: Sala Principal"
                    />
                  </div>
                  <div>
                    <Label htmlFor="salaCapacidad">Capacidad</Label>
                    <Input
                      id="salaCapacidad"
                      type="number"
                      value={salaSeleccionada.capacidad}
                      onChange={(e) =>
                        setSalaSeleccionada((prev) =>
                          prev
                            ? { ...prev, capacidad: Number(e.target.value) }
                            : null
                        )
                      }
                      placeholder="4"
                    />
                  </div>
                  <div>
                    <Label htmlFor="salaUbicacion">Ubicación</Label>
                    <Input
                      id="salaUbicacion"
                      value={salaSeleccionada.ubicacion}
                      onChange={(e) =>
                        setSalaSeleccionada((prev) =>
                          prev ? { ...prev, ubicacion: e.target.value } : null
                        )
                      }
                      placeholder="Ej: Planta Baja"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="salaActiva"
                      checked={salaSeleccionada.activa}
                      onChange={(e) =>
                        setSalaSeleccionada((prev) =>
                          prev ? { ...prev, activa: e.target.checked } : null
                        )
                      }
                    />
                    <Label htmlFor="salaActiva">Sala activa</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="salaEquipamiento">
                    Equipamiento (separado por comas)
                  </Label>
                  <Input
                    id="salaEquipamiento"
                    value={salaSeleccionada.equipamiento.join(", ")}
                    onChange={(e) =>
                      setSalaSeleccionada((prev) =>
                        prev
                          ? {
                              ...prev,
                              equipamiento: e.target.value
                                .split(",")
                                .map((item) => item.trim())
                                .filter((item) => item.length > 0),
                            }
                          : null
                      )
                    }
                    placeholder="Ej: Proyector, Pizarra, Sistema de audio"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setMostrarDialogSala(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleGuardarSala}>
                <Settings className="h-4 w-4 mr-2" />
                Guardar Sala
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Toast de confirmación */}
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
