"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSolicitudByNumber, Solicitud, solicitudes } from "@/lib/mock-data";
import { useAuth } from "@/contexts/auth-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StatusTracker } from "@/components/status-tracker";
import { PendingActions } from "@/components/pending-actions";
import { SolicitudHistory } from "@/components/solicitud-history";
import { SolicitudHeader } from "@/components/solicitud-header";
import { SolicitudInfo } from "@/components/solicitud-info";
import { SolicitudReview } from "@/components/solicitud-review";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NotificationModal } from "@/components/notification-modal";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Shield,
  LogIn,
} from "lucide-react";

export default function SolicitudStatusPage() {
  const params = useParams();
  const router = useRouter();
  const numeroSolicitud = params.numeroSolicitud as string;
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    canAccessSolicitud,
  } = useAuth();

  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [notificationModal, setNotificationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  useEffect(() => {
    const fetchSolicitud = async () => {
      // Esperar a que termine la autenticación
      if (authLoading) return;

      // Si no está autenticado, redirigir al login
      if (!isAuthenticated) {
        router.push(
          `/login?redirect=${encodeURIComponent(window.location.pathname)}`
        );
        return;
      }

      // Verificar si el usuario puede acceder a esta solicitud
      if (!canAccessSolicitud(numeroSolicitud)) {
        setAccessDenied(true);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await getSolicitudByNumber(numeroSolicitud);

        if (data) {
          setSolicitud(data);
        } else {
          setError("Solicitud no encontrada");
        }
      } catch (err) {
        setError("Error al cargar la solicitud");
        console.error("Error fetching solicitud:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (numeroSolicitud) {
      fetchSolicitud();
    }
  }, [
    numeroSolicitud,
    isAuthenticated,
    authLoading,
    canAccessSolicitud,
    router,
  ]);

  const handleStatusUpdate = (nuevoEstatus: string) => {
    if (!solicitud) return;

    // Verificar si se puede avanzar de estatus
    const documentosSubidos = solicitud.documentosRequeridos.filter(
      (doc) => doc.subido
    ).length;
    const documentosRequeridos = solicitud.documentosRequeridos.length;
    const todosDocumentosSubidos = documentosSubidos === documentosRequeridos;
    const sinSaldoPendiente = solicitud.saldoPendiente === 0;
    const tienePagoParcial = solicitud.pagosRealizados > 0;

    // Permitir cambio si:
    // 1. Todos los documentos están subidos Y
    // 2. (No hay saldo pendiente O hay pago parcial)
    const puedeAvanzar =
      todosDocumentosSubidos && (sinSaldoPendiente || tienePagoParcial);

    if (!puedeAvanzar) {
      let mensaje = "No se puede avanzar de estatus.";
      if (!todosDocumentosSubidos) {
        mensaje += " Faltan documentos por subir.";
      }
      if (!sinSaldoPendiente && !tienePagoParcial) {
        mensaje += " Hay saldo pendiente sin pago parcial.";
      }

      setNotificationModal({
        isOpen: true,
        title: "No se puede avanzar",
        message: mensaje,
        type: "warning",
      });
      return;
    }

    // Si va a "EN_REVISION_INTERNA", actualizar primero y luego redirigir
    if (nuevoEstatus === "EN_REVISION_INTERNA") {
      // Actualizar el estado local primero
      const solicitudActualizada = {
        ...solicitud,
        estatusActual: nuevoEstatus as any,
        fechaUltimaActualizacion: new Date().toISOString().split("T")[0],
      };

      setSolicitud(solicitudActualizada);

      // Actualizar en el array de solicitudes del mock data
      const solicitudIndex = solicitudes.findIndex(
        (s) => s.numeroSolicitud === solicitud.numeroSolicitud
      );
      if (solicitudIndex !== -1) {
        solicitudes[solicitudIndex] = solicitudActualizada;
      }

      setNotificationModal({
        isOpen: true,
        title: "¡Trámite Enviado a Revisión!",
        message:
          "Tu trámite ha sido enviado a revisión interna. Te notificaremos cuando haya avances. ¿Deseas regresar a tu cuenta para ver tus solicitudes o iniciar otro trámite?",
        type: "success",
        onConfirm: () => {
          // Redirigir según el rol del usuario
          if (user?.role === "admin") {
            router.push("/admin");
          } else if (user?.role === "abogado" || user?.role === "notario") {
            router.push("/abogado");
          } else {
            router.push("/mi-cuenta");
          }
        },
      });
      return;
    }

    setSolicitud({
      ...solicitud,
      estatusActual: nuevoEstatus as any,
      fechaUltimaActualizacion: new Date().toISOString().split("T")[0],
    });
  };

  const handleSolicitudUpdate = (solicitudActualizada: Solicitud) => {
    setSolicitud(solicitudActualizada);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">
                {authLoading
                  ? "Verificando credenciales..."
                  : "Cargando información de la solicitud..."}
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20">
          <div className="max-w-2xl mx-auto px-4 py-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Acceso Denegado
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                No tienes permisos para acceder a esta solicitud
              </p>

              <Card className="max-w-md mx-auto">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-4">
                        Solicitud: <strong>{numeroSolicitud}</strong>
                      </p>
                      <p className="text-sm text-gray-600 mb-6">
                        Usuario actual: <strong>{user?.nombre}</strong> (
                        {user?.role})
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={() => router.push("/login")}
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Cambiar de Usuario
                      </Button>

                      <Button
                        onClick={() => router.push("/")}
                        variant="outline"
                        className="w-full"
                      >
                        Ir al Inicio
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !solicitud) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <Alert variant="destructive" className="max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error || "No se pudo cargar la información de la solicitud"}
              </AlertDescription>
            </Alert>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Si es notario o abogado, mostrar vista de revisión
  if (user?.role === "notario" || user?.role === "abogado") {
    return (
      <SolicitudReview
        solicitud={solicitud}
        onStatusUpdate={handleStatusUpdate}
        onCorrection={(section, message) => {
          console.log(`Corrección para ${section}:`, message);
          // Aquí se implementaría la lógica para enviar correcciones
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header de la solicitud */}
          <SolicitudHeader solicitud={solicitud} userRole={user?.role} />

          {/* Tracker de estatus */}
          <div className="mt-8">
            <StatusTracker
              estatusActual={solicitud.estatusActual}
              onStatusUpdate={handleStatusUpdate}
            />
          </div>

          {/* Información general de la solicitud - INMEDIATAMENTE DESPUÉS DEL PROGRESO */}
          <div className="mt-8">
            <SolicitudInfo
              solicitud={solicitud}
              onSolicitudUpdate={handleSolicitudUpdate}
            />
          </div>

          {/* Acciones pendientes */}
          <div className="mt-8">
            <PendingActions
              solicitud={solicitud}
              onSolicitudUpdate={handleSolicitudUpdate}
            />
          </div>

          {/* Historial de la solicitud */}
          <div className="mt-8">
            <SolicitudHistory solicitud={solicitud} />
          </div>

          {/* Información adicional */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-6 w-6 text-emerald-600" />
                  <h3 className="text-lg font-semibold">Documentos</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Documentos subidos:</span>
                    <span className="font-medium">
                      {
                        solicitud.documentosRequeridos.filter(
                          (doc) => doc.subido
                        ).length
                      }{" "}
                      / {solicitud.documentosRequeridos.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          (solicitud.documentosRequeridos.filter(
                            (doc) => doc.subido
                          ).length /
                            solicitud.documentosRequeridos.length) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold">Progreso</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Estatus actual:</span>
                    <span className="font-medium capitalize">
                      {solicitud.estatusActual.replace(/_/g, " ").toLowerCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Última actualización: {solicitud.fechaUltimaActualizacion}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />

      {/* Modal de notificación */}
      <NotificationModal
        isOpen={notificationModal.isOpen}
        onClose={() =>
          setNotificationModal((prev) => ({ ...prev, isOpen: false }))
        }
        title={notificationModal.title}
        message={notificationModal.message}
        type={notificationModal.type}
        onConfirm={notificationModal.onConfirm}
        showCancel={!!notificationModal.onConfirm}
        confirmText="Sí, continuar"
        cancelText="Cancelar"
      />
    </div>
  );
}
