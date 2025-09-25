"use client";

import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Calendar,
  DollarSign,
  User,
  Settings,
  LogOut,
  Bell,
  TrendingUp,
  Users,
  Building,
  Shield,
  BarChart3,
  Activity,
} from "lucide-react";
import { AbogadoKanbanDashboard } from "@/components/abogado-kanban-dashboard";
import { NotificationsPanel } from "@/components/notifications-panel";
import { PostFirmaExpedienteCard } from "@/components/post-firma-expediente-card";
import { expedientesMock } from "@/lib/expedientes-data";

export default function AbogadoDashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("kanban");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Verificar que el usuario sea licenciado o notario
    if (user?.role !== "licenciado" && user?.role !== "notario") {
      router.push("/mi-cuenta");
      return;
    }
  }, [isAuthenticated, user, router]);

  // Calcular estadísticas
  const expedientesLicenciado = expedientesMock.filter(
    (exp) => exp.licenciadoAsignado === user?.id
  );
  const expedientesRecibidos = expedientesLicenciado.filter(
    (exp) => exp.estado === "EXPEDIENTE_PRELIMINAR"
  ).length;
  const expedientesEnValidacion = expedientesLicenciado.filter(
    (exp) => exp.estado === "EXPEDIENTE_PRELIMINAR"
  ).length;
  const expedientesEnPreparacion = expedientesLicenciado.filter(
    (exp) => exp.estado === "PROYECTO_ESCRITURA"
  ).length;
  const expedientesListosFirma = expedientesLicenciado.filter(
    (exp) => exp.estado === "LISTO_PARA_FIRMA"
  ).length;
  const expedientesCompletados = expedientesLicenciado.filter(
    (exp) => exp.estado === "COMPLETADO"
  ).length;

  const totalExpedientes = expedientesLicenciado.length;
  const expedientesConPagoPendiente = expedientesLicenciado.filter(
    (exp) => exp.costos.saldoPendiente > 0
  ).length;

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard Legal
              </h1>
              <p className="text-gray-600 mt-2">Bienvenido, {user.nombre}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                {user.role === "licenciado" ? "Licenciado" : "Notario"}
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configuración
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    setIsLoggingOut(true);
                    await logout();
                    router.push("/");
                  } finally {
                    setIsLoggingOut(false);
                  }
                }}
                className="text-red-600"
                disabled={isLoggingOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Expedientes
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalExpedientes}</div>
              <p className="text-xs text-muted-foreground">Asignados a ti</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                En Validación
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {expedientesEnValidacion}
              </div>
              <p className="text-xs text-muted-foreground">
                Requieren revisión
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Listos para Firma
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {expedientesListosFirma}
              </div>
              <p className="text-xs text-muted-foreground">
                Pendientes de firma
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Con Pago Pendiente
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {expedientesConPagoPendiente}
              </div>
              <p className="text-xs text-muted-foreground">Requieren pago</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs principales */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="kanban" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Kanban
            </TabsTrigger>
            <TabsTrigger value="reportes" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Reportes
            </TabsTrigger>
            <TabsTrigger value="post-firma" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Post firma
            </TabsTrigger>
            <TabsTrigger
              value="configuracion"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Configuración
            </TabsTrigger>
          </TabsList>

          {/* Tab: Kanban */}
          <TabsContent value="kanban" className="space-y-6">
            <AbogadoKanbanDashboard licenciadoId={user.id} />
          </TabsContent>

          <TabsContent value="reportes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reportes y Estadísticas</CardTitle>
                <CardDescription>
                  Análisis de tu productividad y gestión de expedientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Distribución por Estado
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Recibidos</span>
                          <Badge variant="outline">
                            {expedientesRecibidos}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">En Validación</span>
                          <Badge variant="outline">
                            {expedientesEnValidacion}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">En Preparación</span>
                          <Badge variant="outline">
                            {expedientesEnPreparacion}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Listos para Firma</span>
                          <Badge variant="outline">
                            {expedientesListosFirma}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Completados</span>
                          <Badge variant="outline">
                            {expedientesCompletados}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Resumen Financiero
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Total Expedientes</span>
                          <span className="font-medium">
                            {totalExpedientes}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Con Pago Pendiente</span>
                          <span className="font-medium text-orange-600">
                            {expedientesConPagoPendiente}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Valor Total</span>
                          <span className="font-medium text-emerald-600">
                            $
                            {expedientesLicenciado
                              .reduce((sum, exp) => sum + exp.costos.total, 0)
                              .toLocaleString("es-MX")}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Post firma */}
          <TabsContent value="post-firma" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Documentos e Impuestos Post-Firma</CardTitle>
                <CardDescription>
                  Gestión de documentos e impuestos que se deben entregar después de la firma del proceso notarial
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Componente colapsable para cada expediente completado o listo para firma */}
                  {expedientesLicenciado
                    .filter(exp => exp.estado === "COMPLETADO" || exp.estado === "LISTO_PARA_FIRMA")
                    .map((expediente) => (
                      <PostFirmaExpedienteCard 
                        key={expediente.id} 
                        expediente={expediente} 
                      />
                    ))}
                  
                  {expedientesLicenciado.filter(exp => exp.estado === "COMPLETADO" || exp.estado === "LISTO_PARA_FIRMA").length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No hay expedientes listos para mostrar</p>
                      <p className="text-sm">Los documentos post-firma aparecerán aquí una vez que los expedientes estén listos para firma o completados</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Configuración */}
          <TabsContent value="configuracion" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Perfil</CardTitle>
                <CardDescription>
                  Gestiona tu información personal y preferencias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Nombre
                      </label>
                      <p className="text-sm">{user.nombre}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Email
                      </label>
                      <p className="text-sm">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Teléfono
                      </label>
                      <p className="text-sm">{user.telefono}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Rol
                      </label>
                      <p className="text-sm">
                        {user.role === "licenciado" ? "Licenciado" : "Notario"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Editar Perfil
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Panel de notificaciones colapsable */}
      <NotificationsPanel
        licenciadoId={user.id}
        isOpen={notificationsOpen}
        onToggle={() => setNotificationsOpen(!notificationsOpen)}
      />
    </div>
  );
}
