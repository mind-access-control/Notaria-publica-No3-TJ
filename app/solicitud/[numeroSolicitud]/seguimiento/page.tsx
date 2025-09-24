"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FileText,
  Clock,
  CheckCircle2,
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  User,
  LogOut,
} from "lucide-react";
import { solicitudes } from "@/lib/mock-data";
import { StatusTracker } from "@/components/status-tracker";

export default function SeguimientoPage() {
  const params = useParams();
  const numeroSolicitud = params.numeroSolicitud as string;
  const [solicitud, setSolicitud] = useState<any>(null);
  const [mensaje, setMensaje] = useState("");
  const [enviandoMensaje, setEnviandoMensaje] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    console.log(
      "Cargando página de seguimiento para solicitud:",
      numeroSolicitud
    );
    console.log(
      "Solicitudes disponibles:",
      solicitudes.map((s) => s.numeroSolicitud)
    );

    const solicitudEncontrada = solicitudes.find(
      (s) => s.numeroSolicitud === numeroSolicitud
    );

    console.log("Solicitud encontrada:", solicitudEncontrada);

    if (solicitudEncontrada) {
      setSolicitud(solicitudEncontrada);
    } else {
      // Si no encuentra la solicitud, usar la primera disponible para testing
      console.log(
        "No se encontró la solicitud, usando la primera disponible para testing"
      );
      setSolicitud(solicitudes[0]);
    }
  }, [numeroSolicitud]);

  const handleEnviarMensaje = async () => {
    if (!mensaje.trim()) return;

    setEnviandoMensaje(true);

    // Simular envío de mensaje
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Agregar mensaje al historial
    const solicitudIndex = solicitudes.findIndex(
      (s) => s.numeroSolicitud === numeroSolicitud
    );
    if (solicitudIndex !== -1) {
      solicitudes[solicitudIndex].historial.push({
        estatus: solicitud.estatusActual,
        fecha: new Date().toISOString(),
        descripcion: `Mensaje del cliente: ${mensaje}`,
        usuario: "Cliente",
      });
    }

    setMensaje("");
    setEnviandoMensaje(false);

    // Mostrar confirmación
    alert("Mensaje enviado correctamente. El notario te responderá pronto.");
  };

  const handleStatusUpdate = (nuevoEstatus: string) => {
    // Esta función se puede usar para actualizar el estatus si es necesario
    console.log("Actualizando estatus a:", nuevoEstatus);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    // Simular proceso de logout
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Limpiar datos de autenticación
    localStorage.removeItem("auth");
    localStorage.removeItem("user");

    // Redirigir a la página principal
    window.location.href = "/";
  };

  if (!solicitud) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Seguimiento del Trámite
                </h1>
                <p className="text-gray-600">
                  Solicitud #{solicitud.numeroSolicitud} -{" "}
                  {solicitud.tipoTramite}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/mi-cuenta")}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <User className="h-4 w-4 mr-2" />
                Mi Cuenta
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal - Progreso y comunicación */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progreso del trámite */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Progreso del Trámite
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StatusTracker
                  estatusActual={solicitud.estatusActual}
                  onStatusUpdate={handleStatusUpdate}
                  solicitud={solicitud}
                />
              </CardContent>
            </Card>

            {/* Comunicación con el licenciado */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Comunicación con el Licenciado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <MessageCircle className="h-4 w-4" />
                  <AlertDescription>
                    Puedes comunicarte directamente con el licenciado a cargo de
                    tu trámite para resolver dudas o solicitar actualizaciones.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enviar mensaje
                    </label>
                    <textarea
                      value={mensaje}
                      onChange={(e) => setMensaje(e.target.value)}
                      placeholder="Escribe tu mensaje aquí..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                    />
                  </div>

                  <Button
                    onClick={handleEnviarMensaje}
                    disabled={!mensaje.trim() || enviandoMensaje}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {enviandoMensaje ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Enviar Mensaje
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Historial de comunicación */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Historial de Comunicación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {solicitud.historial
                    .filter(
                      (entry: any) =>
                        entry.usuario === "Cliente" ||
                        entry.usuario === "Notario"
                    )
                    .slice(-5)
                    .reverse()
                    .map((entry: any, index: number) => (
                      <div
                        key={index}
                        className="flex gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-shrink-0">
                          {entry.usuario === "Cliente" ? (
                            <User className="h-5 w-5 text-blue-600" />
                          ) : (
                            <FileText className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {entry.usuario === "Cliente"
                                ? "Tú"
                                : "Licenciado"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(entry.fecha).toLocaleString("es-MX")}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">
                            {entry.descripcion}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Información del licenciado y contacto */}
          <div className="space-y-6">
            {/* Información del licenciado */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Licenciado Asignado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Lic. María González
                  </h3>
                  <p className="text-sm text-gray-600">Licenciado en Derecho</p>
                  <Badge variant="outline" className="mt-2">
                    En Revisión
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Teléfono</p>
                      <p className="text-sm text-gray-600">(664) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-gray-600">
                        notario3@notaria.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Horario</p>
                      <p className="text-sm text-gray-600">
                        Lun-Vie 9:00-18:00
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => (window.location.href = "/mi-cuenta")}
                    className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Ver Mi Cuenta
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Información de la notaría */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Notaría Pública No. 3
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Teléfono Principal</p>
                      <p className="text-sm text-gray-600">(664) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Email General</p>
                      <p className="text-sm text-gray-600">info@notaria3.com</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-2">Dirección:</p>
                  <p>
                    Av. Revolución 1234
                    <br />
                    Zona Centro, Tijuana, BC
                    <br />
                    CP 22000
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Estado actual */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Estado Actual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Estatus:</span>
                    <Badge variant="outline">
                      {solicitud.estatusActual.replace(/_/g, " ")}
                    </Badge>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Documentos:</span>
                    <span className="text-sm font-medium">
                      {
                        solicitud.documentosRequeridos.filter(
                          (doc: any) => doc.subido
                        ).length
                      }{" "}
                      / {solicitud.documentosRequeridos.length}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pago:</span>
                    <span className="text-sm font-medium text-green-600">
                      ${solicitud.pagosRealizados.toLocaleString("es-MX")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
