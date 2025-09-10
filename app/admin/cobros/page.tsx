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
  DollarSign,
  CreditCard,
  Banknote,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  Send,
  Eye,
  Settings,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  FileText,
  Mail,
  MessageCircle,
  QrCode,
  Smartphone,
} from "lucide-react";

// Tipos de datos
interface Cobro {
  id: string;
  expedienteId: string;
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
  monto: {
    subtotal: number;
    impuestos: number;
    descuentos: number;
    total: number;
    moneda: string;
  };
  estado:
    | "pendiente"
    | "procesando"
    | "pagado"
    | "fallido"
    | "reembolsado"
    | "cancelado";
  metodoPago:
    | "efectivo"
    | "tarjeta"
    | "transferencia"
    | "paypal"
    | "stripe"
    | "oxxo"
    | "spei";
  fechaCreacion: string;
  fechaVencimiento: string;
  fechaPago?: string;
  referencia: string;
  descripcion: string;
  notas?: string;
  intentos: number;
  maxIntentos: number;
  notificaciones: NotificacionCobro[];
  comprobante?: string;
}

interface NotificacionCobro {
  id: string;
  tipo: "email" | "sms" | "whatsapp" | "push";
  fechaEnvio: string;
  estado: "enviada" | "entregada" | "fallida";
  contenido: string;
  destinatario: string;
}

interface ConfiguracionPago {
  metodosActivos: string[];
  comisiones: { [metodo: string]: number };
  notificaciones: {
    recordatorio: boolean;
    vencimiento: boolean;
    confirmacion: boolean;
  };
  plantillas: {
    email: string;
    sms: string;
    whatsapp: string;
  };
  webhook: string;
  apiKey: string;
}

interface ReporteFinanciero {
  periodo: string;
  ingresos: number;
  gastos: number;
  utilidad: number;
  transacciones: number;
  promedioTicket: number;
  metodosPago: { [metodo: string]: number };
  tendencias: {
    diaria: number[];
    semanal: number[];
    mensual: number[];
  };
}

// Datos simulados
const cobrosIniciales: Cobro[] = [
  {
    id: "cobro_001",
    expedienteId: "exp_001",
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
    monto: {
      subtotal: 2500,
      impuestos: 400,
      descuentos: 0,
      total: 2900,
      moneda: "MXN",
    },
    estado: "pagado",
    metodoPago: "tarjeta",
    fechaCreacion: "2024-01-20",
    fechaVencimiento: "2024-01-27",
    fechaPago: "2024-01-22",
    referencia: "TXN-001-2024",
    descripcion: "Pago por servicios notariales - Testamento",
    intentos: 1,
    maxIntentos: 3,
    notificaciones: [
      {
        id: "notif_001",
        tipo: "email",
        fechaEnvio: "2024-01-20 10:00",
        estado: "entregada",
        contenido: "Se ha generado su cobro por $2,900.00",
        destinatario: "juan.perez@email.com",
      },
    ],
    comprobante: "comprobante_001.pdf",
  },
  {
    id: "cobro_002",
    expedienteId: "exp_002",
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
    monto: {
      subtotal: 3200,
      impuestos: 512,
      descuentos: 100,
      total: 3612,
      moneda: "MXN",
    },
    estado: "pendiente",
    metodoPago: "oxxo",
    fechaCreacion: "2024-01-22",
    fechaVencimiento: "2024-01-29",
    referencia: "TXN-002-2024",
    descripcion: "Pago por servicios notariales - Compraventa",
    intentos: 0,
    maxIntentos: 3,
    notificaciones: [],
    notas: "Cliente prefiere pago en OXXO",
  },
];

const configuracionInicial: ConfiguracionPago = {
  metodosActivos: ["efectivo", "tarjeta", "transferencia", "oxxo", "spei"],
  comisiones: {
    efectivo: 0,
    tarjeta: 3.5,
    transferencia: 1.5,
    paypal: 4.5,
    stripe: 3.9,
    oxxo: 2.0,
    spei: 0.5,
  },
  notificaciones: {
    recordatorio: true,
    vencimiento: true,
    confirmacion: true,
  },
  plantillas: {
    email: "Plantilla de email para cobros",
    sms: "Plantilla de SMS para cobros",
    whatsapp: "Plantilla de WhatsApp para cobros",
  },
  webhook: "https://notaria.com/webhook/pagos",
  apiKey: "sk_test_1234567890abcdef",
};

const reporteFinanciero: ReporteFinanciero = {
  periodo: "Enero 2024",
  ingresos: 125000,
  gastos: 25000,
  utilidad: 100000,
  transacciones: 45,
  promedioTicket: 2777.78,
  metodosPago: {
    efectivo: 30000,
    tarjeta: 45000,
    transferencia: 25000,
    oxxo: 15000,
    spei: 10000,
  },
  tendencias: {
    diaria: [1200, 1500, 1800, 2200, 1900, 1600, 1400],
    semanal: [8500, 9200, 9800, 10500, 11200, 10800, 10200],
    mensual: [25000, 28000, 32000, 35000, 38000, 42000, 45000],
  },
};

export default function GestionCobros() {
  const [cobros, setCobros] = useState<Cobro[]>(cobrosIniciales);
  const [configuracion, setConfiguracion] =
    useState<ConfiguracionPago>(configuracionInicial);
  const [reporte, setReporte] = useState<ReporteFinanciero>(reporteFinanciero);
  const [cobroSeleccionado, setCobroSeleccionado] = useState<Cobro | null>(
    null
  );
  const [mostrarDialog, setMostrarDialog] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [filtroMetodo, setFiltroMetodo] = useState<string>("todos");

  const handleCrearCobro = () => {
    const nuevoCobro: Cobro = {
      id: `cobro_${Date.now()}`,
      expedienteId: "",
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
      monto: {
        subtotal: 0,
        impuestos: 0,
        descuentos: 0,
        total: 0,
        moneda: "MXN",
      },
      estado: "pendiente",
      metodoPago: "efectivo",
      fechaCreacion: new Date().toISOString().split("T")[0],
      fechaVencimiento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      referencia: `TXN-${Date.now()}`,
      descripcion: "",
      intentos: 0,
      maxIntentos: 3,
      notificaciones: [],
    };
    setCobroSeleccionado(nuevoCobro);
    setMostrarDialog(true);
  };

  const handleEditarCobro = (cobro: Cobro) => {
    setCobroSeleccionado(cobro);
    setMostrarDialog(true);
  };

  const handleGuardarCobro = () => {
    if (cobroSeleccionado) {
      setCobros((prev) =>
        prev.map((c) => (c.id === cobroSeleccionado.id ? cobroSeleccionado : c))
      );
      setMostrarDialog(false);
      setCobroSeleccionado(null);
    }
  };

  const handleEliminarCobro = (id: string) => {
    setCobros((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCambiarEstado = (id: string, nuevoEstado: string) => {
    setCobros((prev) =>
      prev.map((c) => (c.id === id ? { ...c, estado: nuevoEstado as any } : c))
    );
  };

  const handleEnviarRecordatorio = (id: string) => {
    // Simular envío de recordatorio
    console.log(`Enviando recordatorio para cobro ${id}`);
  };

  const handleGenerarComprobante = (id: string) => {
    // Simular generación de comprobante
    console.log(`Generando comprobante para cobro ${id}`);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "pagado":
        return "bg-green-100 text-green-800";
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "procesando":
        return "bg-blue-100 text-blue-800";
      case "fallido":
        return "bg-red-100 text-red-800";
      case "reembolsado":
        return "bg-purple-100 text-purple-800";
      case "cancelado":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMetodoIcon = (metodo: string) => {
    switch (metodo) {
      case "efectivo":
        return <Banknote className="h-4 w-4" />;
      case "tarjeta":
        return <CreditCard className="h-4 w-4" />;
      case "transferencia":
        return <DollarSign className="h-4 w-4" />;
      case "oxxo":
        return <QrCode className="h-4 w-4" />;
      case "spei":
        return <Smartphone className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  // Filtrar cobros
  const cobrosFiltrados = cobros.filter((cobro) => {
    const cumpleEstado =
      filtroEstado === "todos" || cobro.estado === filtroEstado;
    const cumpleMetodo =
      filtroMetodo === "todos" || cobro.metodoPago === filtroMetodo;

    return cumpleEstado && cumpleMetodo;
  });

  // Calcular métricas
  const totalCobros = cobros.length;
  const cobrosPagados = cobros.filter((c) => c.estado === "pagado").length;
  const cobrosPendientes = cobros.filter(
    (c) => c.estado === "pendiente"
  ).length;
  const ingresosTotales = cobros
    .filter((c) => c.estado === "pagado")
    .reduce((sum, c) => sum + c.monto.total, 0);
  const ingresosPendientes = cobros
    .filter((c) => c.estado === "pendiente")
    .reduce((sum, c) => sum + c.monto.total, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestión de Cobros
              </h1>
              <p className="text-gray-600">
                Sistema de cobros automatizados y gestión de pagos
              </p>
            </div>
            <Button onClick={handleCrearCobro}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Cobro
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
                Total Cobros
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCobros}</div>
              <p className="text-xs text-muted-foreground">
                {cobrosPagados} pagados, {cobrosPendientes} pendientes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ingresos Totales
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${ingresosTotales.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                ${ingresosPendientes.toLocaleString()} pendientes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tasa de Éxito
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalCobros > 0
                  ? Math.round((cobrosPagados / totalCobros) * 100)
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">Cobros exitosos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Promedio Ticket
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {cobrosPagados > 0
                  ? Math.round(ingresosTotales / cobrosPagados)
                  : 0}
              </div>
              <p className="text-xs text-muted-foreground">Por transacción</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="cobros" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cobros">Cobros</TabsTrigger>
            <TabsTrigger value="reportes">Reportes</TabsTrigger>
            <TabsTrigger value="configuracion">Configuración</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>

          {/* Tab Cobros */}
          <TabsContent value="cobros" className="space-y-6">
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
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="procesando">Procesando</SelectItem>
                      <SelectItem value="pagado">Pagado</SelectItem>
                      <SelectItem value="fallido">Fallido</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filtroMetodo} onValueChange={setFiltroMetodo}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Método de Pago" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los métodos</SelectItem>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                      <SelectItem value="tarjeta">Tarjeta</SelectItem>
                      <SelectItem value="transferencia">
                        Transferencia
                      </SelectItem>
                      <SelectItem value="oxxo">OXXO</SelectItem>
                      <SelectItem value="spei">SPEI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Lista de cobros */}
            <div className="space-y-4">
              {cobrosFiltrados.map((cobro) => (
                <Card key={cobro.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="text-lg font-semibold">
                            {cobro.cliente.nombre}
                          </h3>
                          <Badge className={getEstadoColor(cobro.estado)}>
                            {cobro.estado}
                          </Badge>
                          <div className="flex items-center space-x-1 text-gray-500">
                            {getMetodoIcon(cobro.metodoPago)}
                            <span className="text-sm">{cobro.metodoPago}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-2">
                          {cobro.tramite.nombre}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-500">
                          <div>
                            <span className="font-medium">Monto:</span>
                            <p className="text-lg font-bold text-green-600">
                              ${cobro.monto.total.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium">Referencia:</span>
                            <p>{cobro.referencia}</p>
                          </div>
                          <div>
                            <span className="font-medium">Creado:</span>
                            <p>{cobro.fechaCreacion}</p>
                          </div>
                          <div>
                            <span className="font-medium">Vence:</span>
                            <p>{cobro.fechaVencimiento}</p>
                          </div>
                        </div>
                        {cobro.notas && (
                          <p className="text-sm text-gray-500 mt-2">
                            <span className="font-medium">Notas:</span>{" "}
                            {cobro.notas}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEnviarRecordatorio(cobro.id)}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerarComprobante(cobro.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Select
                          value={cobro.estado}
                          onValueChange={(value) =>
                            handleCambiarEstado(cobro.id, value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pendiente">Pendiente</SelectItem>
                            <SelectItem value="procesando">
                              Procesando
                            </SelectItem>
                            <SelectItem value="pagado">Pagado</SelectItem>
                            <SelectItem value="fallido">Fallido</SelectItem>
                            <SelectItem value="cancelado">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab Reportes */}
          <TabsContent value="reportes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resumen Financiero</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Ingresos del período</span>
                      <span className="font-semibold text-green-600">
                        ${reporte.ingresos.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gastos del período</span>
                      <span className="font-semibold text-red-600">
                        ${reporte.gastos.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Utilidad neta</span>
                      <span className="font-semibold text-blue-600">
                        ${reporte.utilidad.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total transacciones</span>
                      <span className="font-semibold">
                        {reporte.transacciones}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Promedio por ticket</span>
                      <span className="font-semibold">
                        ${reporte.promedioTicket.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Métodos de Pago</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(reporte.metodosPago).map(
                      ([metodo, monto]) => (
                        <div key={metodo} className="flex justify-between">
                          <span className="capitalize">{metodo}</span>
                          <span className="font-semibold">
                            ${monto.toLocaleString()}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Análisis de Tendencias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">
                      Tendencia Diaria (Últimos 7 días)
                    </h4>
                    <div className="flex space-x-2">
                      {reporte.tendencias.diaria.map((valor, index) => (
                        <div
                          key={index}
                          className="flex-1 bg-gray-200 rounded h-8 flex items-end"
                        >
                          <div
                            className="bg-blue-500 rounded w-full"
                            style={{
                              height: `${
                                (valor /
                                  Math.max(...reporte.tendencias.diaria)) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Configuración */}
          <TabsContent value="configuracion" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Pagos</CardTitle>
                <CardDescription>
                  Configura los métodos de pago y parámetros del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium">
                    Métodos de Pago Activos
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    {Object.keys(configuracion.comisiones).map((metodo) => (
                      <div key={metodo} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={metodo}
                          checked={configuracion.metodosActivos.includes(
                            metodo
                          )}
                          onChange={(e) => {
                            const nuevosMetodos = e.target.checked
                              ? [...configuracion.metodosActivos, metodo]
                              : configuracion.metodosActivos.filter(
                                  (m) => m !== metodo
                                );
                            setConfiguracion((prev) => ({
                              ...prev,
                              metodosActivos: nuevosMetodos,
                            }));
                          }}
                        />
                        <Label htmlFor={metodo} className="capitalize">
                          {metodo}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">
                    Comisiones por Método
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {Object.entries(configuracion.comisiones).map(
                      ([metodo, comision]) => (
                        <div
                          key={metodo}
                          className="flex items-center justify-between"
                        >
                          <Label className="capitalize">{metodo}</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              value={comision}
                              onChange={(e) =>
                                setConfiguracion((prev) => ({
                                  ...prev,
                                  comisiones: {
                                    ...prev.comisiones,
                                    [metodo]: Number(e.target.value),
                                  },
                                }))
                              }
                              className="w-20"
                            />
                            <span>%</span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">
                    Notificaciones
                  </Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="recordatorio"
                        checked={configuracion.notificaciones.recordatorio}
                        onChange={(e) =>
                          setConfiguracion((prev) => ({
                            ...prev,
                            notificaciones: {
                              ...prev.notificaciones,
                              recordatorio: e.target.checked,
                            },
                          }))
                        }
                      />
                      <Label htmlFor="recordatorio">
                        Enviar recordatorios automáticos
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="vencimiento"
                        checked={configuracion.notificaciones.vencimiento}
                        onChange={(e) =>
                          setConfiguracion((prev) => ({
                            ...prev,
                            notificaciones: {
                              ...prev.notificaciones,
                              vencimiento: e.target.checked,
                            },
                          }))
                        }
                      />
                      <Label htmlFor="vencimiento">
                        Notificar vencimientos
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="confirmacion"
                        checked={configuracion.notificaciones.confirmacion}
                        onChange={(e) =>
                          setConfiguracion((prev) => ({
                            ...prev,
                            notificaciones: {
                              ...prev.notificaciones,
                              confirmacion: e.target.checked,
                            },
                          }))
                        }
                      />
                      <Label htmlFor="confirmacion">
                        Confirmar pagos recibidos
                      </Label>
                    </div>
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

          {/* Tab Webhooks */}
          <TabsContent value="webhooks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Webhooks</CardTitle>
                <CardDescription>
                  Configura las URLs de webhook para recibir notificaciones de
                  pagos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="webhook">URL del Webhook</Label>
                  <Input
                    id="webhook"
                    value={configuracion.webhook}
                    onChange={(e) =>
                      setConfiguracion((prev) => ({
                        ...prev,
                        webhook: e.target.value,
                      }))
                    }
                    placeholder="https://tu-dominio.com/webhook/pagos"
                  />
                </div>
                <div>
                  <Label htmlFor="apikey">API Key</Label>
                  <Input
                    id="apikey"
                    type="password"
                    value={configuracion.apiKey}
                    onChange={(e) =>
                      setConfiguracion((prev) => ({
                        ...prev,
                        apiKey: e.target.value,
                      }))
                    }
                    placeholder="sk_test_1234567890abcdef"
                  />
                </div>
                <div className="flex justify-end">
                  <Button>
                    <Settings className="h-4 w-4 mr-2" />
                    Guardar Webhook
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog para crear/editar cobro */}
        <Dialog open={mostrarDialog} onOpenChange={setMostrarDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {cobroSeleccionado?.id.startsWith("cobro_")
                  ? "Crear Nuevo Cobro"
                  : "Editar Cobro"}
              </DialogTitle>
              <DialogDescription>
                Configura los detalles del cobro y método de pago
              </DialogDescription>
            </DialogHeader>

            {cobroSeleccionado && (
              <div className="space-y-6">
                {/* Información del cliente */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Información del Cliente
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clienteNombre">Nombre</Label>
                      <Input
                        id="clienteNombre"
                        value={cobroSeleccionado.cliente.nombre}
                        onChange={(e) =>
                          setCobroSeleccionado((prev) =>
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
                        value={cobroSeleccionado.cliente.email}
                        onChange={(e) =>
                          setCobroSeleccionado((prev) =>
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
                        value={cobroSeleccionado.cliente.telefono}
                        onChange={(e) =>
                          setCobroSeleccionado((prev) =>
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

                {/* Información del cobro */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Detalles del Cobro</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tramite">Trámite</Label>
                      <Input
                        id="tramite"
                        value={cobroSeleccionado.tramite.nombre}
                        onChange={(e) =>
                          setCobroSeleccionado((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  tramite: {
                                    ...prev.tramite,
                                    nombre: e.target.value,
                                  },
                                }
                              : null
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="metodoPago">Método de Pago</Label>
                      <Select
                        value={cobroSeleccionado.metodoPago}
                        onValueChange={(value) =>
                          setCobroSeleccionado((prev) =>
                            prev ? { ...prev, metodoPago: value as any } : null
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="efectivo">Efectivo</SelectItem>
                          <SelectItem value="tarjeta">Tarjeta</SelectItem>
                          <SelectItem value="transferencia">
                            Transferencia
                          </SelectItem>
                          <SelectItem value="oxxo">OXXO</SelectItem>
                          <SelectItem value="spei">SPEI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="subtotal">Subtotal</Label>
                      <Input
                        id="subtotal"
                        type="number"
                        value={cobroSeleccionado.monto.subtotal}
                        onChange={(e) =>
                          setCobroSeleccionado((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  monto: {
                                    ...prev.monto,
                                    subtotal: Number(e.target.value),
                                    total:
                                      Number(e.target.value) +
                                      prev.monto.impuestos -
                                      prev.monto.descuentos,
                                  },
                                }
                              : null
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="impuestos">Impuestos</Label>
                      <Input
                        id="impuestos"
                        type="number"
                        value={cobroSeleccionado.monto.impuestos}
                        onChange={(e) =>
                          setCobroSeleccionado((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  monto: {
                                    ...prev.monto,
                                    impuestos: Number(e.target.value),
                                    total:
                                      prev.monto.subtotal +
                                      Number(e.target.value) -
                                      prev.monto.descuentos,
                                  },
                                }
                              : null
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="descuentos">Descuentos</Label>
                      <Input
                        id="descuentos"
                        type="number"
                        value={cobroSeleccionado.monto.descuentos}
                        onChange={(e) =>
                          setCobroSeleccionado((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  monto: {
                                    ...prev.monto,
                                    descuentos: Number(e.target.value),
                                    total:
                                      prev.monto.subtotal +
                                      prev.monto.impuestos -
                                      Number(e.target.value),
                                  },
                                }
                              : null
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="total">Total</Label>
                      <Input
                        id="total"
                        type="number"
                        value={cobroSeleccionado.monto.total}
                        readOnly
                        className="bg-gray-100"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                      id="descripcion"
                      value={cobroSeleccionado.descripcion}
                      onChange={(e) =>
                        setCobroSeleccionado((prev) =>
                          prev ? { ...prev, descripcion: e.target.value } : null
                        )
                      }
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
              <Button onClick={handleGuardarCobro}>
                <DollarSign className="h-4 w-4 mr-2" />
                Guardar Cobro
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
