"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { createSolicitud } from "@/lib/mock-data";
import { useSolicitudesPersistence } from "@/hooks/use-solicitudes-persistence";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TramiteModal } from "@/components/tramite-modal";
import {
  FileText,
  Clock,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Shield,
  User,
  AlertCircle,
  Plus,
  LogOut,
  Settings,
} from "lucide-react";

// Configuración de trámites disponibles
const TRAMITES_DISPONIBLES = [
  {
    id: "testamento",
    nombre: "Testamento Público Abierto",
    descripcion:
      "Documento notarial que permite disponer de bienes y derechos para después de la muerte",
    costo: { min: 12000, max: 18000 },
    tiempo: "5-7 días hábiles",
    documentos: [
      "Identificación oficial vigente",
      "Comprobante de domicilio",
      "Acta de nacimiento",
      "Lista de bienes y propiedades",
      "Comprobante de estado civil",
    ],
    requisitos: [
      "Ser mayor de edad",
      "Tener capacidad legal",
      "Presentar identificación oficial",
      "Comprobante de domicilio no mayor a 3 meses",
    ],
  },
  {
    id: "compraventa",
    nombre: "Compraventa de Inmueble",
    descripcion:
      "Contrato notarial para la transferencia de propiedad de bienes inmuebles",
    costo: { min: 20000, max: 30000 },
    tiempo: "7-10 días hábiles",
    documentos: [
      "Identificaciones Oficiales (INE) del comprador y del vendedor",
      "Avalúo del inmueble",
      "Escritura Pública de la propiedad del vendedor",
      "Certificado de Libertad de Gravamen (CLG)",
      "Comprobantes de Pago del acuerdo privado",
    ],
    requisitos: [
      "Ser mayor de edad",
      "Tener capacidad legal",
      "Documentos de propiedad vigentes",
      "Avalúo vigente del inmueble",
      "Certificado de Libertad de Gravamen actualizado",
      "Comprobantes de pago del acuerdo privado",
    ],
  },
  {
    id: "poder",
    nombre: "Poder Notarial",
    descripcion:
      "Documento que autoriza a otra persona para actuar en representación",
    costo: { min: 6000, max: 10000 },
    tiempo: "3-5 días hábiles",
    documentos: [
      "Identificación oficial vigente",
      "Comprobante de domicilio",
      "Identificación del apoderado",
      "Acta de nacimiento",
    ],
    requisitos: [
      "Ser mayor de edad",
      "Tener capacidad legal",
      "Identificación del apoderado",
      "Especificar facultades del poder",
    ],
  },
];

export default function IniciarTramitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // Hook para persistencia
  const {
    createSolicitud: createSolicitudPersistente,
    generateSolicitudNumber,
  } = useSolicitudesPersistence();

  const [tramiteSeleccionado, setTramiteSeleccionado] = useState<string | null>(
    null
  );
  const [isCreandoSolicitud, setIsCreandoSolicitud] = useState(false);
  const [showTramiteModal, setShowTramiteModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const tramitePreseleccionado = searchParams.get("tramite");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(
        "/login?redirect=" +
          encodeURIComponent(window.location.pathname + window.location.search)
      );
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (tramitePreseleccionado) {
      setTramiteSeleccionado(tramitePreseleccionado);
    }
  }, [tramitePreseleccionado]);

  const handleSeleccionarTramite = (tramiteId: string) => {
    setTramiteSeleccionado(tramiteId);
  };

  const handleAgregarTramite = () => {
    // Limpiar la selección actual para que el modal se abra en modo selección
    setTramiteSeleccionado(null);
    setShowTramiteModal(true);
  };

  const handleTramiteModalClose = () => {
    setShowTramiteModal(false);
    // Restaurar el trámite preseleccionado si no se seleccionó uno nuevo
    if (tramitePreseleccionado && !tramiteSeleccionado) {
      setTramiteSeleccionado(tramitePreseleccionado);
    }
  };

  const handleTramiteSelect = (tramiteId: string) => {
    setTramiteSeleccionado(tramiteId);
    setShowTramiteModal(false);
  };

  const handleCrearSolicitud = async () => {
    if (!tramiteSeleccionado || !user) return;

    setIsCreandoSolicitud(true);

    try {
      // Generar número de solicitud único
      const numeroSolicitud = generateSolicitudNumber();

      // Crear la solicitud en IndexedDB
      await createSolicitudPersistente(
        numeroSolicitud,
        tramiteSeleccionado,
        25000
      );

      // Redirigir directamente a la página de la solicitud creada
      router.push(`/solicitud/${numeroSolicitud}`);
    } catch (error) {
      console.error("Error creando solicitud:", error);
    } finally {
      setIsCreandoSolicitud(false);
    }
  };

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

  if (!isAuthenticated || !user) {
    return null;
  }

  const tramiteInfo = tramiteSeleccionado
    ? TRAMITES_DISPONIBLES.find((t) => t.id === tramiteSeleccionado)
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header personalizado */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-emerald-600" />
              <div className="text-lg font-bold text-gray-900">
                Notaría Pública No. 3
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {user?.role === "cliente"
                  ? "Cliente"
                  : user?.role === "notario"
                  ? "Notario"
                  : "Administrador"}
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
      </div>
      <div className="pt-8">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Iniciar Nuevo Trámite
                </h1>
                <p className="text-gray-600">
                  Bienvenido, {user.nombre}. Selecciona el trámite que deseas
                  realizar.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>Cuenta: {user.email}</span>
              <Badge variant="outline" className="ml-2">
                {user.role === "cliente"
                  ? "Cliente"
                  : user.role === "notario"
                  ? "Notario"
                  : "Administrador"}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de trámites */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-emerald-600" />
                      Trámite Seleccionado
                    </CardTitle>
                    <Button
                      onClick={handleAgregarTramite}
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Agregar Trámite
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tramiteSeleccionado ? (
                    (() => {
                      const tramite = TRAMITES_DISPONIBLES.find(
                        (t) => t.id === tramiteSeleccionado
                      );
                      return tramite ? (
                        <div className="p-4 border border-emerald-500 bg-emerald-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-gray-900">
                              {tramite.nombre}
                            </h3>
                            <CheckCircle className="h-5 w-5 text-emerald-600" />
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {tramite.descripcion}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />$
                              {tramite.costo.min.toLocaleString("es-MX")} - $
                              {tramite.costo.max.toLocaleString("es-MX")}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {tramite.tiempo}
                            </div>
                          </div>
                        </div>
                      ) : null;
                    })()
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">
                        No hay trámite seleccionado
                      </p>
                      <Button
                        onClick={handleAgregarTramite}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Seleccionar Trámite
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Detalles del trámite seleccionado */}
            <div className="lg:col-span-2">
              {tramiteInfo ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-emerald-600" />
                      {tramiteInfo.nombre}
                    </CardTitle>
                    <p className="text-gray-600">{tramiteInfo.descripcion}</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Tiempo estimado */}
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                      <Clock className="h-6 w-6 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Tiempo Estimado</p>
                        <p className="text-lg font-semibold text-blue-900">
                          {tramiteInfo.tiempo}
                        </p>
                      </div>
                    </div>

                    {/* Documentos requeridos */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Documentos Requeridos
                      </h3>
                      <ul className="space-y-2">
                        {tramiteInfo.documentos.map((doc, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-sm text-gray-700"
                          >
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Requisitos */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Requisitos
                      </h3>
                      <ul className="space-y-2">
                        {tramiteInfo.requisitos.map((req, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-sm text-gray-700"
                          >
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Costo desglosado */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Inversión en tu Trámite
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Costo base del trámite:
                          </span>
                          <span className="font-medium">
                            $
                            {Math.round(
                              tramiteInfo.costo.min * 0.6
                            ).toLocaleString("es-MX")}{" "}
                            - $
                            {Math.round(
                              tramiteInfo.costo.max * 0.6
                            ).toLocaleString("es-MX")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Aranceles notariales:
                          </span>
                          <span className="font-medium">
                            $
                            {Math.round(
                              tramiteInfo.costo.min * 0.25
                            ).toLocaleString("es-MX")}{" "}
                            - $
                            {Math.round(
                              tramiteInfo.costo.max * 0.25
                            ).toLocaleString("es-MX")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Gastos de gestión:
                          </span>
                          <span className="font-medium">
                            $
                            {Math.round(
                              tramiteInfo.costo.min * 0.15
                            ).toLocaleString("es-MX")}{" "}
                            - $
                            {Math.round(
                              tramiteInfo.costo.max * 0.15
                            ).toLocaleString("es-MX")}
                          </span>
                        </div>
                        <div className="border-t border-gray-300 pt-2 mt-2">
                          <div className="flex justify-between font-semibold text-lg">
                            <span>Total:</span>
                            <span className="text-emerald-600">
                              ${tramiteInfo.costo.min.toLocaleString("es-MX")} -
                              ${tramiteInfo.costo.max.toLocaleString("es-MX")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        * Incluye asesoría personalizada, revisión de documentos
                        y seguimiento completo
                      </p>
                    </div>

                    {/* Botón de crear solicitud */}
                    <div className="pt-4 border-t border-gray-200">
                      <Alert className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Al crear la solicitud, se generará un número único y
                          un enlace personalizado que solo tú podrás acceder con
                          tus credenciales.
                        </AlertDescription>
                      </Alert>

                      <Button
                        onClick={handleCrearSolicitud}
                        disabled={isCreandoSolicitud}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg"
                      >
                        {isCreandoSolicitud ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Creando Solicitud...
                          </>
                        ) : (
                          <>
                            Crear Solicitud
                            <ArrowRight className="h-5 w-5 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Selecciona un Trámite
                    </h3>
                    <p className="text-gray-600">
                      Elige un trámite de la lista para ver los detalles y crear
                      tu solicitud.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Modal de selección de trámites */}
      <TramiteModal
        isOpen={showTramiteModal}
        onClose={handleTramiteModalClose}
        preselectedTramite={undefined}
        onTramiteSelect={handleTramiteSelect}
      />
    </div>
  );
}
