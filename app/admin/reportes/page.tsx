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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Zap,
  Eye,
  Filter,
  RefreshCw,
} from "lucide-react";

// Tipos de datos
interface Metrica {
  id: string;
  nombre: string;
  valor: number;
  cambio: number;
  tendencia: "up" | "down" | "stable";
  periodo: string;
  icono: string;
  color: string;
}

interface Reporte {
  id: string;
  nombre: string;
  tipo: "financiero" | "operacional" | "cliente" | "productividad";
  descripcion: string;
  datos: any;
  fechaGeneracion: string;
  periodo: string;
  formato: "pdf" | "excel" | "csv" | "json";
  estado: "generando" | "completado" | "error";
}

interface Grafico {
  id: string;
  titulo: string;
  tipo: "line" | "bar" | "pie" | "area" | "doughnut";
  datos: any[];
  opciones: any;
}

// Datos simulados
const metricasIniciales: Metrica[] = [
  {
    id: "metrica_001",
    nombre: "Ingresos Totales",
    valor: 125000,
    cambio: 15.2,
    tendencia: "up",
    periodo: "Enero 2024",
    icono: "DollarSign",
    color: "text-green-600",
  },
  {
    id: "metrica_002",
    nombre: "Expedientes Completados",
    valor: 45,
    cambio: 8.5,
    tendencia: "up",
    periodo: "Enero 2024",
    icono: "FileText",
    color: "text-blue-600",
  },
  {
    id: "metrica_003",
    nombre: "Tiempo Promedio",
    valor: 5.2,
    cambio: -12.3,
    tendencia: "down",
    periodo: "Enero 2024",
    icono: "Clock",
    color: "text-orange-600",
  },
  {
    id: "metrica_004",
    nombre: "Satisfacción Cliente",
    valor: 4.8,
    cambio: 2.1,
    tendencia: "up",
    periodo: "Enero 2024",
    icono: "Award",
    color: "text-purple-600",
  },
  {
    id: "metrica_005",
    nombre: "Citas Programadas",
    valor: 32,
    cambio: 22.1,
    tendencia: "up",
    periodo: "Enero 2024",
    icono: "Calendar",
    color: "text-indigo-600",
  },
  {
    id: "metrica_006",
    nombre: "Eficiencia OCR",
    valor: 94.5,
    cambio: 3.2,
    tendencia: "up",
    periodo: "Enero 2024",
    icono: "Zap",
    color: "text-cyan-600",
  },
];

const reportesIniciales: Reporte[] = [
  {
    id: "reporte_001",
    nombre: "Reporte Financiero Mensual",
    tipo: "financiero",
    descripcion: "Resumen de ingresos, gastos y utilidades del mes",
    datos: {
      ingresos: 125000,
      gastos: 25000,
      utilidad: 100000,
      transacciones: 45,
    },
    fechaGeneracion: "2024-01-31",
    periodo: "Enero 2024",
    formato: "pdf",
    estado: "completado",
  },
  {
    id: "reporte_002",
    nombre: "Análisis de Productividad",
    tipo: "productividad",
    descripcion: "Métricas de eficiencia y rendimiento del equipo",
    datos: {
      expedientesPorDia: 2.1,
      tiempoPromedio: 5.2,
      satisfaccion: 4.8,
    },
    fechaGeneracion: "2024-01-30",
    periodo: "Enero 2024",
    formato: "excel",
    estado: "completado",
  },
  {
    id: "reporte_003",
    nombre: "Satisfacción del Cliente",
    tipo: "cliente",
    descripcion: "Análisis de feedback y satisfacción de clientes",
    datos: {
      encuestas: 28,
      promedio: 4.8,
      comentarios: 15,
    },
    fechaGeneracion: "2024-01-29",
    periodo: "Enero 2024",
    formato: "pdf",
    estado: "completado",
  },
];

const graficosIniciales: Grafico[] = [
  {
    id: "grafico_001",
    titulo: "Ingresos por Mes",
    tipo: "line",
    datos: [
      { mes: "Ene", ingresos: 125000 },
      { mes: "Feb", ingresos: 132000 },
      { mes: "Mar", ingresos: 118000 },
      { mes: "Abr", ingresos: 145000 },
      { mes: "May", ingresos: 138000 },
      { mes: "Jun", ingresos: 152000 },
    ],
    opciones: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  },
  {
    id: "grafico_002",
    titulo: "Distribución de Trámites",
    tipo: "pie",
    datos: [
      { tramite: "Testamentos", cantidad: 18, porcentaje: 40 },
      { tramite: "Compraventas", cantidad: 12, porcentaje: 27 },
      { tramite: "Poderes", cantidad: 8, porcentaje: 18 },
      { tramite: "Otros", cantidad: 7, porcentaje: 15 },
    ],
    opciones: {
      responsive: true,
    },
  },
  {
    id: "grafico_003",
    titulo: "Tiempo de Procesamiento",
    tipo: "bar",
    datos: [
      { tramite: "Testamento", tiempo: 5.2 },
      { tramite: "Compraventa", tiempo: 7.1 },
      { tramite: "Poder", tiempo: 3.8 },
      { tramite: "Fideicomiso", tiempo: 9.5 },
    ],
    opciones: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  },
];

export default function ReportesAnalytics() {
  const [metricas, setMetricas] = useState<Metrica[]>(metricasIniciales);
  const [reportes, setReportes] = useState<Reporte[]>(reportesIniciales);
  const [graficos, setGraficos] = useState<Grafico[]>(graficosIniciales);
  const [filtroPeriodo, setFiltroPeriodo] = useState<string>("mes");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");

  const handleGenerarReporte = (tipo: string) => {
    const nuevoReporte: Reporte = {
      id: `reporte_${Date.now()}`,
      nombre: `Reporte ${tipo} - ${new Date().toLocaleDateString()}`,
      tipo: tipo as any,
      descripcion: `Reporte generado automáticamente para ${tipo}`,
      datos: {},
      fechaGeneracion: new Date().toISOString().split("T")[0],
      periodo: "Actual",
      formato: "pdf",
      estado: "generando",
    };

    setReportes((prev) => [nuevoReporte, ...prev]);

    // Simular generación
    setTimeout(() => {
      setReportes((prev) =>
        prev.map((r) =>
          r.id === nuevoReporte.id ? { ...r, estado: "completado" as const } : r
        )
      );
    }, 3000);
  };

  const handleDescargarReporte = (reporteId: string) => {
    console.log(`Descargando reporte ${reporteId}`);
  };

  const getIcono = (icono: string) => {
    switch (icono) {
      case "DollarSign":
        return <DollarSign className="h-5 w-5" />;
      case "FileText":
        return <FileText className="h-5 w-5" />;
      case "Clock":
        return <Clock className="h-5 w-5" />;
      case "Award":
        return <Award className="h-5 w-5" />;
      case "Calendar":
        return <Calendar className="h-5 w-5" />;
      case "Zap":
        return <Zap className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "financiero":
        return "bg-green-100 text-green-800";
      case "operacional":
        return "bg-blue-100 text-blue-800";
      case "cliente":
        return "bg-purple-100 text-purple-800";
      case "productividad":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "completado":
        return "bg-green-100 text-green-800";
      case "generando":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filtrar reportes
  const reportesFiltrados = reportes.filter((reporte) => {
    const cumpleTipo = filtroTipo === "todos" || reporte.tipo === filtroTipo;
    return cumpleTipo;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Reportes y Analytics
              </h1>
              <p className="text-gray-600">
                Análisis de rendimiento y métricas del sistema
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Exportar Todo
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <Label htmlFor="periodo">Período</Label>
                <Select value={filtroPeriodo} onValueChange={setFiltroPeriodo}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dia">Hoy</SelectItem>
                    <SelectItem value="semana">Esta Semana</SelectItem>
                    <SelectItem value="mes">Este Mes</SelectItem>
                    <SelectItem value="trimestre">Este Trimestre</SelectItem>
                    <SelectItem value="año">Este Año</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tipo">Tipo de Reporte</Label>
                <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los Tipos</SelectItem>
                    <SelectItem value="financiero">Financiero</SelectItem>
                    <SelectItem value="operacional">Operacional</SelectItem>
                    <SelectItem value="cliente">Cliente</SelectItem>
                    <SelectItem value="productividad">Productividad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="metricas">Métricas</TabsTrigger>
            <TabsTrigger value="reportes">Reportes</TabsTrigger>
            <TabsTrigger value="graficos">Gráficos</TabsTrigger>
          </TabsList>

          {/* Tab Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Métricas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {metricas.slice(0, 6).map((metrica) => (
                <Card key={metrica.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          {metrica.nombre}
                        </p>
                        <p className={`text-2xl font-bold ${metrica.color}`}>
                          {metrica.icono === "Award"
                            ? metrica.valor.toFixed(1)
                            : metrica.icono === "Clock"
                            ? `${metrica.valor} días`
                            : metrica.icono === "Zap"
                            ? `${metrica.valor}%`
                            : metrica.valor.toLocaleString()}
                        </p>
                        <div className="flex items-center space-x-1 mt-1">
                          {getTendenciaIcon(metrica.tendencia)}
                          <span
                            className={`text-sm ${
                              metrica.tendencia === "up"
                                ? "text-green-600"
                                : metrica.tendencia === "down"
                                ? "text-red-600"
                                : "text-gray-600"
                            }`}
                          >
                            {metrica.cambio > 0 ? "+" : ""}
                            {metrica.cambio}%
                          </span>
                        </div>
                      </div>
                      <div
                        className={`p-3 rounded-full bg-gray-100 ${metrica.color}`}
                      >
                        {getIcono(metrica.icono)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Gráficos principales */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ingresos por Mes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                    <BarChart3 className="h-16 w-16 text-gray-400" />
                    <span className="ml-2 text-gray-500">
                      Gráfico de ingresos
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Trámites</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                    <PieChart className="h-16 w-16 text-gray-400" />
                    <span className="ml-2 text-gray-500">
                      Gráfico de distribución
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab Métricas */}
          <TabsContent value="metricas" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {metricas.map((metrica) => (
                <Card key={metrica.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`p-2 rounded-full bg-gray-100 ${metrica.color}`}
                      >
                        {getIcono(metrica.icono)}
                      </div>
                      <Badge
                        className={getTipoColor(metrica.tipo || "operacional")}
                      >
                        {metrica.periodo}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {metrica.nombre}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Valor actual
                        </span>
                        <span className={`font-bold ${metrica.color}`}>
                          {metrica.icono === "Award"
                            ? metrica.valor.toFixed(1)
                            : metrica.icono === "Clock"
                            ? `${metrica.valor} días`
                            : metrica.icono === "Zap"
                            ? `${metrica.valor}%`
                            : metrica.valor.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Cambio</span>
                        <div className="flex items-center space-x-1">
                          {getTendenciaIcon(metrica.tendencia)}
                          <span
                            className={`text-sm ${
                              metrica.tendencia === "up"
                                ? "text-green-600"
                                : metrica.tendencia === "down"
                                ? "text-red-600"
                                : "text-gray-600"
                            }`}
                          >
                            {metrica.cambio > 0 ? "+" : ""}
                            {metrica.cambio}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab Reportes */}
          <TabsContent value="reportes" className="space-y-6">
            {/* Botones de generación rápida */}
            <Card>
              <CardHeader>
                <CardTitle>Generar Reportes</CardTitle>
                <CardDescription>
                  Genera reportes automáticamente con los datos más recientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handleGenerarReporte("financiero")}
                    className="h-20 flex flex-col space-y-2"
                  >
                    <DollarSign className="h-6 w-6" />
                    <span>Financiero</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleGenerarReporte("operacional")}
                    className="h-20 flex flex-col space-y-2"
                  >
                    <Activity className="h-6 w-6" />
                    <span>Operacional</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleGenerarReporte("cliente")}
                    className="h-20 flex flex-col space-y-2"
                  >
                    <Users className="h-6 w-6" />
                    <span>Cliente</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleGenerarReporte("productividad")}
                    className="h-20 flex flex-col space-y-2"
                  >
                    <Target className="h-6 w-6" />
                    <span>Productividad</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lista de reportes */}
            <div className="space-y-4">
              {reportesFiltrados.map((reporte) => (
                <Card key={reporte.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="text-lg font-semibold">
                            {reporte.nombre}
                          </h3>
                          <Badge className={getTipoColor(reporte.tipo)}>
                            {reporte.tipo}
                          </Badge>
                          <Badge className={getEstadoColor(reporte.estado)}>
                            {reporte.estado}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">
                          {reporte.descripcion}
                        </p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <span>Período: {reporte.periodo}</span>
                          <span>Formato: {reporte.formato.toUpperCase()}</span>
                          <span>Generado: {reporte.fechaGeneracion}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDescargarReporte(reporte.id)}
                          disabled={reporte.estado !== "completado"}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab Gráficos */}
          <TabsContent value="graficos" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {graficos.map((grafico) => (
                <Card key={grafico.id}>
                  <CardHeader>
                    <CardTitle>{grafico.titulo}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                      {grafico.tipo === "line" && (
                        <BarChart3 className="h-16 w-16 text-gray-400" />
                      )}
                      {grafico.tipo === "pie" && (
                        <PieChart className="h-16 w-16 text-gray-400" />
                      )}
                      {grafico.tipo === "bar" && (
                        <BarChart3 className="h-16 w-16 text-gray-400" />
                      )}
                      <span className="ml-2 text-gray-500">
                        Gráfico de {grafico.tipo}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
