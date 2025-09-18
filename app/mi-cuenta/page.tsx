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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  Plus,
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
  ChevronRight,
  X,
  CheckCircle2,
} from "lucide-react";
import { Solicitud } from "@/lib/mock-data";
import { getUserSolicitudes } from "@/lib/mock-data";
import {
  UserNotification,
  getUserNotifications,
} from "@/lib/user-notifications-data";
import { useSolicitudesPersistence } from "@/hooks/use-solicitudes-persistence";
import CitaSchedulingModal from "@/components/cita-scheduling-modal";
import Link from "next/link";

export default function MiCuentaPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const {
    solicitudes: solicitudesPersistentes,
    loading: loadingPersistentes,
    error: errorPersistentes,
  } = useSolicitudesPersistence();
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [showFloatingNotification, setShowFloatingNotification] =
    useState(false);
  const [showCitaModal, setShowCitaModal] = useState(false);
  const [selectedSolicitudForCita, setSelectedSolicitudForCita] =
    useState<string>("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const cargarSolicitudes = async () => {
      try {
        // Cargar solicitudes mock para compatibilidad
        const userSolicitudes = await getUserSolicitudes(user?.id || "");
        setSolicitudes(userSolicitudes);
      } catch (error) {
        console.error("Error cargando solicitudes:", error);
      } finally {
        setLoading(false);
      }
    };

    const cargarNotificaciones = async () => {
      try {
        // Limpiar notificaciones existentes para empezar limpio
        setNotifications([]);
        setHasNewNotification(false);
      } catch (error) {
        console.error("Error cargando notificaciones:", error);
      }
    };

    cargarSolicitudes();
    cargarNotificaciones();

    // Simular notificaciones demo - solo 2 únicas
    const simularNotificacionesDemo = () => {
      // Primera notificación a los 5 segundos - Estado del documento
      setTimeout(() => {
        const nuevaNotificacion1 = {
          id: "demo-notif-1-unica",
          tipo: "revision_expediente" as const,
          titulo: "Estatus del Documento",
          mensaje:
            "Tu documento está siendo revisado por nuestro equipo legal. Te notificaremos cuando esté listo para firma.",
          fecha: new Date().toISOString(),
          leida: false,
          solicitudId: "NT3-2025-001",
          acciones: [
            { texto: "Ver Progreso", accion: "ver_documento" as const },
          ],
        };
        setNotifications((prev) => {
          // Evitar duplicados - solo agregar si no existe
          const yaExiste = prev.some((n) => n.id === "demo-notif-1-unica");
          if (yaExiste) return prev;
          return [nuevaNotificacion1, ...prev];
        });
        setHasNewNotification(true);
        setShowFloatingNotification(true);
        setTimeout(() => {
          setShowFloatingNotification(false);
        }, 8000);
      }, 5000);

      // Segunda notificación a los 10 segundos (5 segundos después de la primera) - Cita disponible
      setTimeout(() => {
        const nuevaNotificacion2 = {
          id: "demo-notif-2-unica",
          tipo: "documento_listo_firma" as const,
          titulo: "Cita Disponible",
          mensaje:
            "¡Tu documento está listo! Puedes agendar tu cita para la firma. Selecciona el horario que mejor te convenga.",
          fecha: new Date().toISOString(),
          leida: false,
          solicitudId: "NT3-2025-001",
          acciones: [
            { texto: "Agendar Cita", accion: "agendar_cita" as const },
          ],
        };
        setNotifications((prev) => {
          // Evitar duplicados - solo agregar si no existe
          const yaExiste = prev.some((n) => n.id === "demo-notif-2-unica");
          if (yaExiste) return prev;
          return [nuevaNotificacion2, ...prev];
        });
        setHasNewNotification(true);
        setShowFloatingNotification(true);
        setTimeout(() => {
          setShowFloatingNotification(false);
        }, 8000);
      }, 10000);
    };

    // Solo ejecutar la simulación si está autenticado
    if (isAuthenticated && user?.id) {
      simularNotificacionesDemo();
    }
  }, [isAuthenticated, user?.id, router]);

  const getStatusColor = (estatus: string) => {
    switch (estatus) {
      case "EN_REVISION_INTERNA":
        return "bg-blue-100 text-blue-800";
      case "DOCUMENTOS_PENDIENTES":
        return "bg-yellow-100 text-yellow-800";
      case "PAGO_PENDIENTE":
        return "bg-orange-100 text-orange-800";
      case "COMPLETADO":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatusText = (estatus: string) =>
    estatus
      .replace(/_/g, " ")
      .toLowerCase()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const getStatusIcon = (estatus: string) => {
    switch (estatus) {
      case "EN_REVISION_INTERNA":
        return <Clock className="h-4 w-4" />;
      case "DOCUMENTOS_PENDIENTES":
        return <FileText className="h-4 w-4" />;
      case "PAGO_PENDIENTE":
        return <DollarSign className="h-4 w-4" />;
      case "COMPLETADO":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getNotificationIcon = (tipo: string) => {
    switch (tipo) {
      case "revision_expediente":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "documento_listo_firma":
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case "cita_agendada":
        return <Calendar className="h-4 w-4 text-green-600" />;
      case "recordatorio_cita":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "documento_completado":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getNotificationColor = (tipo: string) => {
    switch (tipo) {
      case "revision_expediente":
        return "bg-blue-50 border-blue-200";
      case "documento_listo_firma":
        return "bg-emerald-50 border-emerald-200";
      case "cita_agendada":
        return "bg-green-50 border-green-200";
      case "recordatorio_cita":
        return "bg-yellow-50 border-yellow-200";
      case "documento_completado":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const handleNotificationAction = (
    notification: UserNotification,
    action: string
  ) => {
    switch (action) {
      case "agendar_cita":
        // Usar la primera solicitud disponible o el ID de la notificación
        const solicitudParaCita =
          solicitudes.length > 0
            ? solicitudes[0].numeroSolicitud
            : notification.solicitudId || "";
        setSelectedSolicitudForCita(solicitudParaCita);
        setShowCitaModal(true);
        break;
      case "ver_documento":
        // Navegar a la primera solicitud disponible (como "Ver Detalles")
        if (solicitudes.length > 0) {
          router.push(`/solicitud/${solicitudes[0].numeroSolicitud}`);
        } else if (notification.solicitudId) {
          router.push(`/solicitud/${notification.solicitudId}`);
        }
        break;
      case "contactar_abogado":
        // Aquí podrías abrir un modal de contacto o redirigir a una página de contacto
        console.log("Contactar abogado");
        break;
    }
  };

  const handleCitaAgendada = () => {
    // Recargar notificaciones después de agendar cita
    const cargarNotificaciones = async () => {
      try {
        const userNotifications = await getUserNotifications(user?.id || "");
        setNotifications(userNotifications);
      } catch (error) {
        console.error("Error recargando notificaciones:", error);
      }
    };
    cargarNotificaciones();
  };

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
    <div className="min-h-screen bg-background flex">
      {/* Contenido principal */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Mi Cuenta</h1>
                <p className="text-gray-600 mt-2">
                  Bienvenido de vuelta, {user.nombre}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {user.role}
                </Badge>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configuración
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative"
                >
                  <Bell className="h-4 w-4" />
                  {hasNewNotification && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                  )}
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

          {/* Tabs */}
          <Tabs defaultValue="solicitudes" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="solicitudes"
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Mis Solicitudes
              </TabsTrigger>
              <TabsTrigger
                value="nuevo-tramite"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Nuevo Trámite
              </TabsTrigger>
            </TabsList>

            {/* Tab: Mis Solicitudes */}
            <TabsContent value="solicitudes" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Mis Solicitudes
                </h2>
                <p className="text-sm text-gray-600">
                  {solicitudesPersistentes.length} solicitud
                  {solicitudesPersistentes.length !== 1 ? "es" : ""} encontrada
                  {solicitudesPersistentes.length !== 1 ? "s" : ""}
                </p>
              </div>

              {loading || loadingPersistentes ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando solicitudes...</p>
                </div>
              ) : errorPersistentes ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Error al cargar solicitudes
                    </h3>
                    <p className="text-gray-600 mb-6">{errorPersistentes}</p>
                    <Button
                      onClick={() => window.location.reload()}
                      variant="outline"
                    >
                      Reintentar
                    </Button>
                  </CardContent>
                </Card>
              ) : solicitudesPersistentes.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No tienes solicitudes
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Comienza iniciando tu primer trámite
                    </p>
                    <Link href="/iniciar-tramite">
                      <Button className="bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Iniciar Primer Trámite
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {solicitudesPersistentes.map((solicitud) => {
                    const documentosCompletados = solicitud.documentos.filter(
                      (doc) => doc.subido
                    ).length;
                    const documentosRequeridos = solicitud.documentos.filter(
                      (doc) => doc.requerido
                    ).length;

                    return (
                      <Card
                        key={solicitud.numeroSolicitud}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-emerald-600" />
                                {solicitud.tipoTramite}
                              </CardTitle>
                              <CardDescription className="mt-2">
                                Solicitud #{solicitud.numeroSolicitud}
                              </CardDescription>
                            </div>
                            <Badge className={getStatusColor(solicitud.estado)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(solicitud.estado)}
                                {solicitud.estado.replace(/_/g, " ")}
                              </div>
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Fecha:{" "}
                                {new Date(
                                  solicitud.fechaCreacion
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <DollarSign className="h-4 w-4" />
                              <span>
                                Costo: $
                                {solicitud.costoTotal.toLocaleString("es-MX")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FileText className="h-4 w-4" />
                              <span>
                                {documentosCompletados}/{documentosRequeridos}{" "}
                                documentos
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-gray-600">Estatus:</span>
                              <Badge
                                className={getStatusColor(solicitud.estado)}
                              >
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(solicitud.estado)}
                                  {formatStatusText(solicitud.estado)}
                                </div>
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="text-sm text-gray-600">
                              <p>
                                Última actualización:{" "}
                                {new Date(
                                  solicitud.ultimaActualizacion
                                ).toLocaleDateString()}
                              </p>
                              {solicitud.saldoPendiente > 0 && (
                                <p className="text-red-600 font-medium">
                                  Saldo pendiente: $
                                  {solicitud.saldoPendiente.toLocaleString(
                                    "es-MX"
                                  )}
                                </p>
                              )}
                            </div>
                            <Link
                              href={`/solicitud/${solicitud.numeroSolicitud}`}
                            >
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Detalles
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Tab: Nuevo Trámite */}
            <TabsContent value="nuevo-tramite" className="space-y-6">
              <div className="text-center py-12">
                <Plus className="h-16 w-16 text-emerald-600 mx-auto mb-6" />
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Iniciar Nuevo Trámite
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Selecciona el tipo de trámite que deseas realizar y comienza
                  el proceso
                </p>
                <Link href="/iniciar-tramite">
                  <Button
                    size="lg"
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Seleccionar Trámite
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Sidebar de Notificaciones */}
      <div
        className={`bg-white border-l border-gray-200 flex flex-col transition-all duration-300 ${
          showNotifications ? "w-80" : "w-12"
        }`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {showNotifications && (
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Bell className="h-5 w-5" />
                NOTIFICACIONES
              </h3>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
              className="ml-auto"
            >
              {showNotifications ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4 rotate-180" />
              )}
            </Button>
          </div>
        </div>

        {showNotifications && (
          <div className="flex-1 overflow-y-auto p-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay notificaciones</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${getNotificationColor(
                      notification.tipo
                    )}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-600">
                            {notifications.length - index}.
                          </span>
                          <div className="flex items-center gap-2">
                            {getNotificationIcon(notification.tipo)}
                            <span className="text-sm font-semibold text-gray-900">
                              {notification.titulo}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">
                          {notification.mensaje}
                        </p>
                        <p className="text-xs text-gray-500 mb-2">
                          {new Date(notification.fecha).toLocaleString("es-MX")}
                        </p>

                        {/* Botones de acción */}
                        {notification.acciones &&
                          notification.acciones.length > 0 && (
                            <div className="flex gap-2 mt-2">
                              {notification.acciones.map((accion, idx) => (
                                <Button
                                  key={idx}
                                  size="sm"
                                  variant="outline"
                                  className="text-xs h-6 px-2"
                                  onClick={() =>
                                    handleNotificationAction(
                                      notification,
                                      accion.accion
                                    )
                                  }
                                >
                                  {accion.texto}
                                </Button>
                              ))}
                            </div>
                          )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => {
                          setNotifications((prev) =>
                            prev.filter((n) => n.id !== notification.id)
                          );
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notificación flotante */}
      {showFloatingNotification && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-emerald-100 border border-emerald-300 rounded-lg p-4 shadow-lg max-w-sm">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-emerald-800">
                  ¡Nueva Notificación!
                </p>
                <p className="text-xs text-emerald-700 mt-1">
                  Tienes una nueva notificación. Revisa el panel lateral para
                  más detalles.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-emerald-600 hover:text-emerald-800"
                onClick={() => setShowFloatingNotification(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de agendamiento de citas */}
      <CitaSchedulingModal
        isOpen={showCitaModal}
        onClose={() => setShowCitaModal(false)}
        solicitudId={selectedSolicitudForCita}
        userId={user?.id || ""}
        onCitaAgendada={handleCitaAgendada}
      />
    </div>
  );
}
