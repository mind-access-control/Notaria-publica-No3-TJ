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
} from "lucide-react";
import { Solicitud } from "@/lib/mock-data";
import { getUserSolicitudes } from "@/lib/mock-data";
import Link from "next/link";

export default function MiCuentaPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const cargarSolicitudes = async () => {
      try {
        const userSolicitudes = await getUserSolicitudes(user?.id || "");
        setSolicitudes(userSolicitudes);
      } catch (error) {
        console.error("Error cargando solicitudes:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarSolicitudes();
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
                {solicitudes.length} solicitud
                {solicitudes.length !== 1 ? "es" : ""} encontrada
                {solicitudes.length !== 1 ? "s" : ""}
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando solicitudes...</p>
              </div>
            ) : solicitudes.length === 0 ? (
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
                {solicitudes.map((solicitud) => (
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
                        <Badge
                          className={getStatusColor(solicitud.estatusActual)}
                        >
                          <div className="flex items-center gap-1">
                            {getStatusIcon(solicitud.estatusActual)}
                            {solicitud.estatusActual.replace(/_/g, " ")}
                          </div>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Fecha: {solicitud.fechaCreacion}</span>
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
                            {
                              solicitud.documentosRequeridos.filter(
                                (doc) => doc.subido
                              ).length
                            }
                            /{solicitud.documentosRequeridos.length} documentos
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-600">Estatus:</span>
                          <Badge
                            className={getStatusColor(solicitud.estatusActual)}
                          >
                            <div className="flex items-center gap-1">
                              {getStatusIcon(solicitud.estatusActual)}
                              {formatStatusText(solicitud.estatusActual)}
                            </div>
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-gray-600">
                          <p>
                            Última actualización:{" "}
                            {solicitud.fechaUltimaActualizacion}
                          </p>
                          {solicitud.saldoPendiente > 0 && (
                            <p className="text-orange-600 font-medium">
                              Saldo pendiente: $
                              {solicitud.saldoPendiente.toLocaleString("es-MX")}
                            </p>
                          )}
                        </div>
                        <Link href={`/solicitud/${solicitud.numeroSolicitud}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
                Selecciona el tipo de trámite que deseas realizar y comienza el
                proceso
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
  );
}
