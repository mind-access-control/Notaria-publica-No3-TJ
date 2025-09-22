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
import { LicenciadoSidebar } from "@/components/licenciado-sidebar";
import { PostFirmaExpedienteCard } from "@/components/post-firma-expediente-card";
import { expedientesMock } from "@/lib/expedientes-data";

export default function LicenciadoDashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("expedientes");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expedientesArchivados, setExpedientesArchivados] = useState<string[]>([]);

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
    (exp) => exp.estado === "RECIBIDO"
  ).length;
  const expedientesEnValidacion = expedientesLicenciado.filter(
    (exp) => exp.estado === "EN_VALIDACION"
  ).length;
  const expedientesEnPreparacion = expedientesLicenciado.filter(
    (exp) => exp.estado === "EN_PREPARACION"
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
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
                  try {
                    setIsLoggingOut(true);
                    await logout();
                    router.push("/");
                  } finally {
                    setIsLoggingOut(false);
                  }
  };

  const handleExpedienteArchivado = (expedienteId: string) => {
    setExpedientesArchivados(prev => [...prev, expedienteId]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "expedientes":
        return <AbogadoKanbanDashboard licenciadoId={user.id} />;
      
      case "reportes":
        return (
          <div className="space-y-6">
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
                          <span className="font-medium text-blue-600">
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
          </div>
        );

      case "documentacion":
        return (
          <div className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Documentación Post Firma</CardTitle>
                <CardDescription>
                  Gestión de documentos y archivos después de la firma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Componente colapsable para cada expediente completado o listo para firma */}
                  {expedientesLicenciado
                    .filter(exp => (exp.estado === "COMPLETADO" || exp.estado === "LISTO_PARA_FIRMA") && !expedientesArchivados.includes(exp.id))
                    .map((expediente) => (
                      <PostFirmaExpedienteCard 
                        key={expediente.id} 
                        expediente={expediente}
                        onExpedienteArchivado={handleExpedienteArchivado}
                      />
                    ))}
                  
                  {expedientesLicenciado.filter(exp => (exp.estado === "COMPLETADO" || exp.estado === "LISTO_PARA_FIRMA") && !expedientesArchivados.includes(exp.id)).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No hay expedientes listos para mostrar</p>
                      <p className="text-sm">Los documentos post-firma aparecerán aquí una vez que los expedientes estén listos para firma o completados</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "clientes":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Clientes</CardTitle>
                <CardDescription>
                  Administra la información de tus clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Gestión de Clientes
                  </h3>
                  <p className="text-gray-500">
                    Aquí podrás administrar toda la información de tus clientes
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "citas":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Agenda de Citas</CardTitle>
                <CardDescription>
                  Gestiona tu agenda y citas programadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Agenda de Citas
                  </h3>
                  <p className="text-gray-500">
                    Aquí podrás gestionar tu agenda y citas programadas
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "configuracion":
        return (
          <div className="space-y-6">
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
          </div>
        );


      case "archivo":
        const expedientesArchivadosData = expedientesLicenciado.filter(exp => 
          expedientesArchivados.includes(exp.id)
        );
        
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Expedientes Archivados</CardTitle>
                <CardDescription>
                  Consulta expedientes completados y archivados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {expedientesArchivadosData.length > 0 ? (
                  <div className="space-y-4">
                    {expedientesArchivadosData.map((expediente) => (
                      <Card key={expediente.id} className="bg-slate-50 border-slate-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-slate-500 rounded-full flex items-center justify-center">
                                <FileText className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-slate-900">
                                  Expediente #{expediente.numeroSolicitud}
                                </h4>
                                <p className="text-sm text-slate-600">
                                  {expediente.tipoTramite === "compraventa" ? "Compraventa" : 
                                   expediente.tipoTramite === "testamento" ? "Testamento" :
                                   expediente.tipoTramite === "donacion" ? "Donación" :
                                   expediente.tipoTramite === "poder" ? "Poder" : "Trámite"}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {expediente.comprador.nombre} {expediente.comprador.apellidoPaterno} - 
                                  {expediente.vendedor.nombre} {expediente.vendedor.apellidoPaterno}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className="bg-slate-100 text-slate-800 border-slate-300">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Archivado
                              </Badge>
                              <div className="text-right">
                                <p className="text-sm text-slate-600">
                                  Fecha de archivo: {new Date().toLocaleDateString("es-MX")}
                                </p>
                                <p className="text-xs text-slate-500">
                                  Valor: ${expediente.costos.total.toLocaleString("es-MX")}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No hay expedientes archivados
                    </h3>
                    <p className="text-gray-500">
                      Los expedientes archivados aparecerán aquí una vez que completes el proceso de post-firma
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <AbogadoKanbanDashboard licenciadoId={user.id} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      {/* Sidebar */}
      <LicenciadoSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        user={user}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div 
        className={`flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* Top Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {activeTab === "expedientes" && "Gestión de Expedientes"}
                {activeTab === "reportes" && "Reportes y Estadísticas"}
                {activeTab === "documentacion" && "Documentación Post Firma"}
                {activeTab === "clientes" && "Gestión de Clientes"}
                {activeTab === "citas" && "Agenda de Citas"}
                {activeTab === "configuracion" && "Configuración"}
                {activeTab === "archivo" && "Expedientes Archivados"}
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                {activeTab === "expedientes" && "Administra el flujo de trabajo de expedientes"}
                {activeTab === "reportes" && "Análisis de productividad y métricas"}
                {activeTab === "documentacion" && "Documentos y archivos post firma"}
                {activeTab === "clientes" && "Información y gestión de clientes"}
                {activeTab === "citas" && "Programación y gestión de citas"}
                {activeTab === "configuracion" && "Perfil y preferencias del sistema"}
                {activeTab === "archivo" && "Expedientes completados y archivados"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* El botón de notificaciones está en el NotificationsPanel */}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </div>
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
