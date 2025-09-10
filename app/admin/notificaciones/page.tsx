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
  Send,
  Mail,
  MessageCircle,
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Settings,
  Eye,
  Copy,
  Download,
  Users,
  Calendar,
  FileText,
  DollarSign,
  Smartphone,
  Monitor,
  Globe,
} from "lucide-react";

// Tipos de datos
interface Notificacion {
  id: string;
  titulo: string;
  contenido: string;
  tipo: "email" | "sms" | "whatsapp" | "push" | "in_app";
  destinatarios: Destinatario[];
  estado:
    | "borrador"
    | "programada"
    | "enviando"
    | "enviada"
    | "fallida"
    | "cancelada";
  fechaCreacion: string;
  fechaProgramada?: string;
  fechaEnvio?: string;
  plantilla?: string;
  variables: { [key: string]: string };
  estadisticas: {
    enviadas: number;
    entregadas: number;
    fallidas: number;
    abiertas: number;
    clics: number;
  };
  creador: string;
  categoria: string;
  prioridad: "baja" | "media" | "alta" | "urgente";
}

interface Destinatario {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  tipo: "individual" | "grupo" | "todos";
  estado: "pendiente" | "enviado" | "entregado" | "fallido";
  fechaEnvio?: string;
  fechaEntrega?: string;
}

interface PlantillaNotificacion {
  id: string;
  nombre: string;
  tipo: "email" | "sms" | "whatsapp" | "push" | "in_app";
  asunto?: string;
  contenido: string;
  variables: string[];
  activa: boolean;
  categoria: string;
  fechaCreacion: string;
  autor: string;
}

interface ConfiguracionNotificaciones {
  email: {
    servidor: string;
    puerto: number;
    usuario: string;
    password: string;
    ssl: boolean;
    limiteDiario: number;
  };
  sms: {
    proveedor: string;
    apiKey: string;
    limiteDiario: number;
  };
  whatsapp: {
    token: string;
    numero: string;
    limiteDiario: number;
  };
  push: {
    firebaseKey: string;
    limiteDiario: number;
  };
  horarios: {
    inicio: string;
    fin: string;
    dias: string[];
  };
  retry: {
    maxIntentos: number;
    intervalo: number;
  };
}

// Datos simulados
const notificacionesIniciales: Notificacion[] = [
  {
    id: "notif_001",
    titulo: "Recordatorio de Cita - Testamento",
    contenido:
      "Estimado {{cliente.nombre}}, le recordamos que tiene una cita programada para el {{fecha}} a las {{hora}} para el trámite de {{tramite.nombre}}. Por favor confirme su asistencia.",
    tipo: "whatsapp",
    destinatarios: [
      {
        id: "dest_001",
        nombre: "Juan Pérez García",
        telefono: "6641234567",
        tipo: "individual",
        estado: "entregado",
        fechaEnvio: "2024-01-20 09:00",
        fechaEntrega: "2024-01-20 09:02",
      },
    ],
    estado: "enviada",
    fechaCreacion: "2024-01-20",
    fechaEnvio: "2024-01-20 09:00",
    variables: {
      "cliente.nombre": "Juan Pérez García",
      fecha: "25 de enero de 2024",
      hora: "10:00 AM",
      "tramite.nombre": "Testamento",
    },
    estadisticas: {
      enviadas: 1,
      entregadas: 1,
      fallidas: 0,
      abiertas: 1,
      clics: 0,
    },
    creador: "Dr. María López",
    categoria: "Citas",
    prioridad: "media",
  },
  {
    id: "notif_002",
    titulo: "Cobro Generado - Compraventa",
    contenido:
      "Se ha generado su cobro por $3,612.00 para el trámite de {{tramite.nombre}}. Puede realizar el pago en {{metodoPago}} usando la referencia {{referencia}}.",
    tipo: "email",
    destinatarios: [
      {
        id: "dest_002",
        nombre: "Ana Martínez Ruiz",
        email: "ana.martinez@email.com",
        tipo: "individual",
        estado: "entregado",
        fechaEnvio: "2024-01-22 14:30",
        fechaEntrega: "2024-01-22 14:32",
      },
    ],
    estado: "enviada",
    fechaCreacion: "2024-01-22",
    fechaEnvio: "2024-01-22 14:30",
    variables: {
      "tramite.nombre": "Compraventa",
      metodoPago: "OXXO",
      referencia: "TXN-002-2024",
    },
    estadisticas: {
      enviadas: 1,
      entregadas: 1,
      fallidas: 0,
      abiertas: 1,
      clics: 1,
    },
    creador: "Sistema",
    categoria: "Cobros",
    prioridad: "alta",
  },
];

const plantillasIniciales: PlantillaNotificacion[] = [
  {
    id: "plantilla_001",
    nombre: "Recordatorio de Cita",
    tipo: "whatsapp",
    contenido:
      "Estimado {{cliente.nombre}}, le recordamos que tiene una cita programada para el {{fecha}} a las {{hora}} para el trámite de {{tramite.nombre}}. Por favor confirme su asistencia.",
    variables: ["cliente.nombre", "fecha", "hora", "tramite.nombre"],
    activa: true,
    categoria: "Citas",
    fechaCreacion: "2024-01-01",
    autor: "Dr. María López",
  },
  {
    id: "plantilla_002",
    nombre: "Cobro Generado",
    tipo: "email",
    asunto: "Cobro Generado - {{tramite.nombre}}",
    contenido:
      "Se ha generado su cobro por ${{monto}} para el trámite de {{tramite.nombre}}. Puede realizar el pago en {{metodoPago}} usando la referencia {{referencia}}.",
    variables: ["tramite.nombre", "monto", "metodoPago", "referencia"],
    activa: true,
    categoria: "Cobros",
    fechaCreacion: "2024-01-01",
    autor: "Sistema",
  },
  {
    id: "plantilla_003",
    nombre: "Documento Rechazado",
    tipo: "email",
    asunto: "Documento Requiere Corrección - {{tramite.nombre}}",
    contenido:
      "Estimado {{cliente.nombre}}, el documento {{documento.nombre}} requiere corrección. Motivo: {{motivo}}. Por favor suba una nueva versión.",
    variables: [
      "cliente.nombre",
      "tramite.nombre",
      "documento.nombre",
      "motivo",
    ],
    activa: true,
    categoria: "Expedientes",
    fechaCreacion: "2024-01-01",
    autor: "Dr. Carlos Herrera",
  },
];

const configuracionInicial: ConfiguracionNotificaciones = {
  email: {
    servidor: "smtp.gmail.com",
    puerto: 587,
    usuario: "notificaciones@notaria.com",
    password: "********",
    ssl: true,
    limiteDiario: 1000,
  },
  sms: {
    proveedor: "Twilio",
    apiKey: "sk_1234567890abcdef",
    limiteDiario: 500,
  },
  whatsapp: {
    token: "EAABwzLixnjYBO1234567890",
    numero: "+526641234567",
    limiteDiario: 200,
  },
  push: {
    firebaseKey: "AAAA1234567890:APA91bH1234567890",
    limiteDiario: 1000,
  },
  horarios: {
    inicio: "09:00",
    fin: "18:00",
    dias: ["lunes", "martes", "miércoles", "jueves", "viernes"],
  },
  retry: {
    maxIntentos: 3,
    intervalo: 300,
  },
};

export default function GestionNotificaciones() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>(
    notificacionesIniciales
  );
  const [plantillas, setPlantillas] =
    useState<PlantillaNotificacion[]>(plantillasIniciales);
  const [configuracion, setConfiguracion] =
    useState<ConfiguracionNotificaciones>(configuracionInicial);
  const [notificacionSeleccionada, setNotificacionSeleccionada] =
    useState<Notificacion | null>(null);
  const [mostrarDialog, setMostrarDialog] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");

  const handleCrearNotificacion = () => {
    const nuevaNotificacion: Notificacion = {
      id: `notif_${Date.now()}`,
      titulo: "",
      contenido: "",
      tipo: "email",
      destinatarios: [],
      estado: "borrador",
      fechaCreacion: new Date().toISOString().split("T")[0],
      variables: {},
      estadisticas: {
        enviadas: 0,
        entregadas: 0,
        fallidas: 0,
        abiertas: 0,
        clics: 0,
      },
      creador: "Admin",
      categoria: "",
      prioridad: "media",
    };
    setNotificacionSeleccionada(nuevaNotificacion);
    setMostrarDialog(true);
  };

  const handleEditarNotificacion = (notificacion: Notificacion) => {
    setNotificacionSeleccionada(notificacion);
    setMostrarDialog(true);
  };

  const handleGuardarNotificacion = () => {
    if (notificacionSeleccionada) {
      setNotificaciones((prev) =>
        prev.map((n) =>
          n.id === notificacionSeleccionada.id ? notificacionSeleccionada : n
        )
      );
      setMostrarDialog(false);
      setNotificacionSeleccionada(null);
    }
  };

  const handleEliminarNotificacion = (id: string) => {
    setNotificaciones((prev) => prev.filter((n) => n.id !== id));
  };

  const handleEnviarNotificacion = (id: string) => {
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, estado: "enviando" as const } : n))
    );

    // Simular envío
    setTimeout(() => {
      setNotificaciones((prev) =>
        prev.map((n) =>
          n.id === id
            ? {
                ...n,
                estado: "enviada" as const,
                fechaEnvio: new Date().toISOString(),
              }
            : n
        )
      );
    }, 2000);
  };

  const handleCancelarNotificacion = (id: string) => {
    setNotificaciones((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, estado: "cancelada" as const } : n
      )
    );
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "sms":
        return <MessageCircle className="h-4 w-4" />;
      case "whatsapp":
        return <MessageCircle className="h-4 w-4" />;
      case "push":
        return <Bell className="h-4 w-4" />;
      case "in_app":
        return <Monitor className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "enviada":
        return "bg-green-100 text-green-800";
      case "enviando":
        return "bg-blue-100 text-blue-800";
      case "programada":
        return "bg-yellow-100 text-yellow-800";
      case "fallida":
        return "bg-red-100 text-red-800";
      case "cancelada":
        return "bg-gray-100 text-gray-800";
      case "borrador":
        return "bg-purple-100 text-purple-800";
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

  // Filtrar notificaciones
  const notificacionesFiltradas = notificaciones.filter((notificacion) => {
    const cumpleTipo =
      filtroTipo === "todos" || notificacion.tipo === filtroTipo;
    const cumpleEstado =
      filtroEstado === "todos" || notificacion.estado === filtroEstado;

    return cumpleTipo && cumpleEstado;
  });

  // Calcular métricas
  const totalNotificaciones = notificaciones.length;
  const notificacionesEnviadas = notificaciones.filter(
    (n) => n.estado === "enviada"
  ).length;
  const notificacionesFallidas = notificaciones.filter(
    (n) => n.estado === "fallida"
  ).length;
  const totalEntregadas = notificaciones.reduce(
    (sum, n) => sum + n.estadisticas.entregadas,
    0
  );
  const totalAbiertas = notificaciones.reduce(
    (sum, n) => sum + n.estadisticas.abiertas,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestión de Notificaciones
              </h1>
              <p className="text-gray-600">
                Sistema de notificaciones automáticas y comunicación
              </p>
            </div>
            <Button onClick={handleCrearNotificacion}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Notificación
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Notificaciones
              </CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalNotificaciones}</div>
              <p className="text-xs text-muted-foreground">
                {notificacionesEnviadas} enviadas, {notificacionesFallidas}{" "}
                fallidas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entregadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEntregadas}</div>
              <p className="text-xs text-muted-foreground">
                {totalNotificaciones > 0
                  ? Math.round((totalEntregadas / totalNotificaciones) * 100)
                  : 0}
                % tasa de entrega
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Abiertas</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAbiertas}</div>
              <p className="text-xs text-muted-foreground">
                {totalEntregadas > 0
                  ? Math.round((totalAbiertas / totalEntregadas) * 100)
                  : 0}
                % tasa de apertura
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Plantillas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{plantillas.length}</div>
              <p className="text-xs text-muted-foreground">
                {plantillas.filter((p) => p.activa).length} activas
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="notificaciones" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
            <TabsTrigger value="plantillas">Plantillas</TabsTrigger>
            <TabsTrigger value="configuracion">Configuración</TabsTrigger>
            <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
          </TabsList>

          {/* Tab Notificaciones */}
          <TabsContent value="notificaciones" className="space-y-6">
            {/* Filtros */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los tipos</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="push">Push</SelectItem>
                      <SelectItem value="in_app">In-App</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los estados</SelectItem>
                      <SelectItem value="borrador">Borrador</SelectItem>
                      <SelectItem value="programada">Programada</SelectItem>
                      <SelectItem value="enviando">Enviando</SelectItem>
                      <SelectItem value="enviada">Enviada</SelectItem>
                      <SelectItem value="fallida">Fallida</SelectItem>
                      <SelectItem value="cancelada">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Lista de notificaciones */}
            <div className="space-y-4">
              {notificacionesFiltradas.map((notificacion) => (
                <Card key={notificacion.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <div className="flex items-center space-x-2">
                            {getTipoIcon(notificacion.tipo)}
                            <h3 className="text-lg font-semibold">
                              {notificacion.titulo}
                            </h3>
                          </div>
                          <Badge
                            className={getEstadoColor(notificacion.estado)}
                          >
                            {notificacion.estado}
                          </Badge>
                          <Badge
                            className={getPrioridadColor(
                              notificacion.prioridad
                            )}
                          >
                            {notificacion.prioridad}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">
                          {notificacion.contenido}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-500">
                          <div>
                            <span className="font-medium">Tipo:</span>
                            <p className="capitalize">{notificacion.tipo}</p>
                          </div>
                          <div>
                            <span className="font-medium">Destinatarios:</span>
                            <p>{notificacion.destinatarios.length}</p>
                          </div>
                          <div>
                            <span className="font-medium">Creado:</span>
                            <p>{notificacion.fechaCreacion}</p>
                          </div>
                          <div>
                            <span className="font-medium">Creador:</span>
                            <p>{notificacion.creador}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center space-x-6 text-sm">
                          <span>
                            Enviadas: {notificacion.estadisticas.enviadas}
                          </span>
                          <span>
                            Entregadas: {notificacion.estadisticas.entregadas}
                          </span>
                          <span>
                            Abiertas: {notificacion.estadisticas.abiertas}
                          </span>
                          <span>Clics: {notificacion.estadisticas.clics}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {notificacion.estado === "borrador" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleEnviarNotificacion(notificacion.id)
                            }
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                        {notificacion.estado === "programada" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleCancelarNotificacion(notificacion.id)
                            }
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab Plantillas */}
          <TabsContent value="plantillas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Plantillas de Notificaciones</CardTitle>
                <CardDescription>
                  Gestiona las plantillas para diferentes tipos de
                  notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {plantillas.map((plantilla) => (
                    <Card key={plantilla.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            {getTipoIcon(plantilla.tipo)}
                            <div>
                              <h4 className="font-semibold">
                                {plantilla.nombre}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {plantilla.categoria}
                              </p>
                            </div>
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
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            {plantilla.contenido}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {plantilla.variables.map((variable) => (
                              <Badge
                                key={variable}
                                variant="outline"
                                className="text-xs"
                              >
                                {variable}
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

          {/* Tab Configuración */}
          <TabsContent value="configuracion" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración de Email</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="servidor">Servidor SMTP</Label>
                    <Input
                      id="servidor"
                      value={configuracion.email.servidor}
                      onChange={(e) =>
                        setConfiguracion((prev) => ({
                          ...prev,
                          email: { ...prev.email, servidor: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="puerto">Puerto</Label>
                      <Input
                        id="puerto"
                        type="number"
                        value={configuracion.email.puerto}
                        onChange={(e) =>
                          setConfiguracion((prev) => ({
                            ...prev,
                            email: {
                              ...prev.email,
                              puerto: Number(e.target.value),
                            },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="usuario">Usuario</Label>
                      <Input
                        id="usuario"
                        value={configuracion.email.usuario}
                        onChange={(e) =>
                          setConfiguracion((prev) => ({
                            ...prev,
                            email: { ...prev.email, usuario: e.target.value },
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={configuracion.email.password}
                      onChange={(e) =>
                        setConfiguracion((prev) => ({
                          ...prev,
                          email: { ...prev.email, password: e.target.value },
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Configuración de WhatsApp</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="token">Token de Acceso</Label>
                    <Input
                      id="token"
                      type="password"
                      value={configuracion.whatsapp.token}
                      onChange={(e) =>
                        setConfiguracion((prev) => ({
                          ...prev,
                          whatsapp: { ...prev.whatsapp, token: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="numero">Número de Teléfono</Label>
                    <Input
                      id="numero"
                      value={configuracion.whatsapp.numero}
                      onChange={(e) =>
                        setConfiguracion((prev) => ({
                          ...prev,
                          whatsapp: {
                            ...prev.whatsapp,
                            numero: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Horarios de Envío</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="inicio">Hora de Inicio</Label>
                      <Input
                        id="inicio"
                        type="time"
                        value={configuracion.horarios.inicio}
                        onChange={(e) =>
                          setConfiguracion((prev) => ({
                            ...prev,
                            horarios: {
                              ...prev.horarios,
                              inicio: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="fin">Hora de Fin</Label>
                      <Input
                        id="fin"
                        type="time"
                        value={configuracion.horarios.fin}
                        onChange={(e) =>
                          setConfiguracion((prev) => ({
                            ...prev,
                            horarios: { ...prev.horarios, fin: e.target.value },
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Días de la Semana</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[
                        "lunes",
                        "martes",
                        "miércoles",
                        "jueves",
                        "viernes",
                        "sábado",
                        "domingo",
                      ].map((dia) => (
                        <div key={dia} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={dia}
                            checked={configuracion.horarios.dias.includes(dia)}
                            onChange={(e) => {
                              const nuevosDias = e.target.checked
                                ? [...configuracion.horarios.dias, dia]
                                : configuracion.horarios.dias.filter(
                                    (d) => d !== dia
                                  );
                              setConfiguracion((prev) => ({
                                ...prev,
                                horarios: {
                                  ...prev.horarios,
                                  dias: nuevosDias,
                                },
                              }));
                            }}
                          />
                          <Label htmlFor={dia} className="capitalize">
                            {dia}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Configuración de Reintentos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="maxIntentos">Máximo de Intentos</Label>
                    <Input
                      id="maxIntentos"
                      type="number"
                      value={configuracion.retry.maxIntentos}
                      onChange={(e) =>
                        setConfiguracion((prev) => ({
                          ...prev,
                          retry: {
                            ...prev.retry,
                            maxIntentos: Number(e.target.value),
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="intervalo">Intervalo (segundos)</Label>
                    <Input
                      id="intervalo"
                      type="number"
                      value={configuracion.retry.intervalo}
                      onChange={(e) =>
                        setConfiguracion((prev) => ({
                          ...prev,
                          retry: {
                            ...prev.retry,
                            intervalo: Number(e.target.value),
                          },
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button>
                <Settings className="h-4 w-4 mr-2" />
                Guardar Configuración
              </Button>
            </div>
          </TabsContent>

          {/* Tab Estadísticas */}
          <TabsContent value="estadisticas" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas por Tipo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["email", "sms", "whatsapp", "push", "in_app"].map(
                      (tipo) => {
                        const notifs = notificaciones.filter(
                          (n) => n.tipo === tipo
                        );
                        const enviadas = notifs.reduce(
                          (sum, n) => sum + n.estadisticas.enviadas,
                          0
                        );
                        const entregadas = notifs.reduce(
                          (sum, n) => sum + n.estadisticas.entregadas,
                          0
                        );
                        const abiertas = notifs.reduce(
                          (sum, n) => sum + n.estadisticas.abiertas,
                          0
                        );

                        return (
                          <div
                            key={tipo}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-2">
                              {getTipoIcon(tipo)}
                              <span className="capitalize">{tipo}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">
                                {enviadas} enviadas
                              </div>
                              <div className="text-sm text-gray-500">
                                {entregadas} entregadas, {abiertas} abiertas
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rendimiento por Categoría</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Citas", "Cobros", "Expedientes", "Sistema"].map(
                      (categoria) => {
                        const notifs = notificaciones.filter(
                          (n) => n.categoria === categoria
                        );
                        const enviadas = notifs.reduce(
                          (sum, n) => sum + n.estadisticas.enviadas,
                          0
                        );
                        const entregadas = notifs.reduce(
                          (sum, n) => sum + n.estadisticas.entregadas,
                          0
                        );
                        const tasaEntrega =
                          enviadas > 0
                            ? Math.round((entregadas / enviadas) * 100)
                            : 0;

                        return (
                          <div
                            key={categoria}
                            className="flex items-center justify-between"
                          >
                            <span>{categoria}</span>
                            <div className="text-right">
                              <div className="font-semibold">
                                {tasaEntrega}%
                              </div>
                              <div className="text-sm text-gray-500">
                                {enviadas} enviadas
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialog para crear/editar notificación */}
        <Dialog open={mostrarDialog} onOpenChange={setMostrarDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {notificacionSeleccionada?.id.startsWith("notif_")
                  ? "Crear Nueva Notificación"
                  : "Editar Notificación"}
              </DialogTitle>
              <DialogDescription>
                Configura el contenido y destinatarios de la notificación
              </DialogDescription>
            </DialogHeader>

            {notificacionSeleccionada && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="titulo">Título</Label>
                    <Input
                      id="titulo"
                      value={notificacionSeleccionada.titulo}
                      onChange={(e) =>
                        setNotificacionSeleccionada((prev) =>
                          prev ? { ...prev, titulo: e.target.value } : null
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="tipo">Tipo</Label>
                    <Select
                      value={notificacionSeleccionada.tipo}
                      onValueChange={(value) =>
                        setNotificacionSeleccionada((prev) =>
                          prev ? { ...prev, tipo: value as any } : null
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="push">Push</SelectItem>
                        <SelectItem value="in_app">In-App</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="categoria">Categoría</Label>
                    <Input
                      id="categoria"
                      value={notificacionSeleccionada.categoria}
                      onChange={(e) =>
                        setNotificacionSeleccionada((prev) =>
                          prev ? { ...prev, categoria: e.target.value } : null
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="prioridad">Prioridad</Label>
                    <Select
                      value={notificacionSeleccionada.prioridad}
                      onValueChange={(value) =>
                        setNotificacionSeleccionada((prev) =>
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
                  <Label htmlFor="contenido">Contenido</Label>
                  <Textarea
                    id="contenido"
                    value={notificacionSeleccionada.contenido}
                    onChange={(e) =>
                      setNotificacionSeleccionada((prev) =>
                        prev ? { ...prev, contenido: e.target.value } : null
                      )
                    }
                    rows={6}
                    placeholder="Usa {{variable}} para insertar variables dinámicas..."
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setMostrarDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleGuardarNotificacion}>
                <Send className="h-4 w-4 mr-2" />
                Guardar Notificación
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
