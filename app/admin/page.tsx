"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Users,
  Calendar,
  DollarSign,
  Plus,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Activity,
  Settings,
} from "lucide-react";

// Mock data
const expedientes = [
  {
    id: "EXP-001",
    cliente: "Juan Pérez García",
    tramite: "Testamento",
    estado: "En revisión",
    progreso: 75,
    documentos: 8,
    totalDocumentos: 10,
    fechaCreacion: "2024-01-15",
  },
  {
    id: "EXP-002",
    cliente: "Ana Martínez Ruiz",
    tramite: "Compraventa",
    estado: "Completado",
    progreso: 100,
    documentos: 6,
    totalDocumentos: 6,
    fechaCreacion: "2024-01-10",
  },
  {
    id: "EXP-003",
    cliente: "Roberto Silva",
    tramite: "Poder",
    estado: "Pendiente",
    progreso: 45,
    documentos: 2,
    totalDocumentos: 4,
    fechaCreacion: "2024-01-22",
  },
];

const citas = [
  {
    id: "CITA-001",
    cliente: "Juan Pérez García",
    fecha: "2024-01-25",
    hora: "10:00",
    tramite: "Testamento",
    estado: "Confirmada",
  },
  {
    id: "CITA-002",
    cliente: "María González",
    fecha: "2024-01-26",
    hora: "14:00",
    tramite: "Compraventa",
    estado: "Pendiente",
  },
];

const usuarios = [
  {
    id: "USER-001",
    nombre: "Dr. Roberto Notario",
    rol: "Notario",
    activo: true,
  },
  {
    id: "USER-002",
    nombre: "Lic. Ana García",
    rol: "Abogado",
    activo: true,
  },
  {
    id: "USER-003",
    nombre: "María López",
    rol: "Asistente",
    activo: true,
  },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Verificar autenticación
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando credenciales...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado o no es admin, no mostrar nada (se redirigirá)
  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  // Cálculos
  const totalExpedientes = expedientes.length;
  const expedientesCompletados = expedientes.filter(
    (e) => e.estado === "Completado"
  ).length;
  const expedientesPendientes = expedientes.filter(
    (e) => e.estado === "Pendiente"
  ).length;
  const expedientesEnRevision = expedientes.filter(
    (e) => e.estado === "En revisión"
  ).length;

  const citasHoy = citas.filter((c) => c.fecha === "2024-01-25").length;
  const citasPendientes = citas.filter((c) => c.estado === "Pendiente").length;

  const usuariosActivos = usuarios.filter((u) => u.activo).length;

  const ingresosMes = 125000;
  const ingresosPendientes = 45000;
  const promedioProgreso =
    expedientes.reduce((sum, e) => sum + e.progreso, 0) / expedientes.length;

  const handleNuevoExpediente = () => {
    window.location.href = "/admin/expedientes/nuevo";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Principal
          </h1>
          <p className="text-gray-600">
            Resumen general del sistema y accesos rápidos
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/admin/expedientes")}
            className="flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>Ver Expedientes</span>
          </Button>
          <Button
            className="flex items-center space-x-2"
            onClick={handleNuevoExpediente}
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Expediente</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expedientes
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExpedientes}</div>
            <p className="text-xs text-muted-foreground">
              {expedientesCompletados} completados, {expedientesPendientes}{" "}
              pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{citasHoy}</div>
            <p className="text-xs text-muted-foreground">
              {citasPendientes} pendientes de confirmación
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos del Mes
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${ingresosMes.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Progreso Promedio
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(promedioProgreso)}%
            </div>
            <p className="text-xs text-muted-foreground">Completitud general</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para otras funcionalidades */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="reportes">Reportes</TabsTrigger>
          <TabsTrigger value="configuracion">Configuración</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expedientes Recientes */}
            <Card>
              <CardHeader>
                <CardTitle>Expedientes Recientes</CardTitle>
                <CardDescription>Últimos expedientes creados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expedientes.slice(0, 3).map((expediente) => (
                    <div
                      key={expediente.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{expediente.cliente}</h4>
                        <p className="text-sm text-gray-600">
                          {expediente.tramite}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Progress
                            value={expediente.progreso}
                            className="w-20 h-2"
                          />
                          <span className="text-xs text-gray-500">
                            {expediente.progreso}%
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant={
                          expediente.estado === "Completado"
                            ? "default"
                            : expediente.estado === "En revisión"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {expediente.estado}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() =>
                      (window.location.href = "/admin/expedientes")
                    }
                    className="w-full"
                  >
                    Ver Todos los Expedientes
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Citas del Día */}
            <Card>
              <CardHeader>
                <CardTitle>Citas de Hoy</CardTitle>
                <CardDescription>Citas programadas para hoy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {citas.map((cita) => (
                    <div
                      key={cita.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{cita.cliente}</h4>
                        <p className="text-sm text-gray-600">{cita.tramite}</p>
                        <p className="text-xs text-gray-500">{cita.hora}</p>
                      </div>
                      <Badge
                        variant={
                          cita.estado === "Confirmada" ? "default" : "secondary"
                        }
                      >
                        {cita.estado}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => (window.location.href = "/admin/citas")}
                    className="w-full"
                  >
                    Ver Todas las Citas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reportes Tab */}
        <TabsContent value="reportes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ingresos del Mes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  ${ingresosMes.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">
                  +12% vs mes anterior
                </p>
                <div className="mt-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">
                      Tendencia positiva
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trámites Más Populares</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Testamentos</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: "45%" }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Compraventas</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: "30%" }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">30%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Poderes</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-600 h-2 rounded-full"
                          style={{ width: "25%" }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configuración Tab */}
        <TabsContent value="configuracion" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Usuarios del Sistema</CardTitle>
                <CardDescription>Gestiona usuarios y permisos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {usuarios.map((usuario) => (
                    <div
                      key={usuario.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{usuario.nombre}</h4>
                        <p className="text-sm text-gray-600">{usuario.rol}</p>
                      </div>
                      <Badge variant={usuario.activo ? "default" : "secondary"}>
                        {usuario.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "/admin/usuarios")}
                  className="w-full mt-4"
                >
                  Gestionar Usuarios
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuración General</CardTitle>
                <CardDescription>Ajustes del sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Notificaciones por email</span>
                    <Badge variant="outline">Activado</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Backup automático</span>
                    <Badge variant="outline">Diario</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tiempo de sesión</span>
                    <Badge variant="outline">8 horas</Badge>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar Sistema
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
