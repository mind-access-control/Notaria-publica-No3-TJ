"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { createSolicitud } from "@/lib/mock-data";
import { getTramiteById, getAllTramites } from "@/lib/tramites-data";
import { Header } from "@/components/header";
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
  Users,
} from "lucide-react";

// Usar los datos compartidos de trámites
const TRAMITES_DISPONIBLES = getAllTramites().map(tramite => ({
  id: tramite.id,
  nombre: tramite.name,
  descripcion: tramite.description,
  costo: tramite.costo || { min: 20000, max: 30000 }, // Usar costo del tramite o valores por defecto
  documentos: tramite.requirements,
  requisitos: tramite.requirements, // Usar los mismos requisitos como documentos
}));

export default function IniciarTramitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading } = useAuth();

  const [tramiteSeleccionado, setTramiteSeleccionado] = useState<string | null>(
    null
  );
  const [isCreandoSolicitud, setIsCreandoSolicitud] = useState(false);
  const [showTramiteModal, setShowTramiteModal] = useState(false);
  const [arancelesCalculados, setArancelesCalculados] = useState<any[]>([]);

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

  // Cargar aranceles calculados
  useEffect(() => {
    const cargarAranceles = () => {
      try {
        const datos = JSON.parse(localStorage.getItem("arancelesCalculados") || "[]");
        console.log("Cargando aranceles desde localStorage:", datos);
        setArancelesCalculados(datos);
      } catch (error) {
        console.error("Error cargando aranceles:", error);
      }
    };
    cargarAranceles();
  }, []);

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
      // Crear la solicitud asociada al usuario
      const solicitud = await createSolicitud(user.id, tramiteSeleccionado);

      if (solicitud) {
        // Redirigir a la página de estatus de la solicitud
        router.push(`/solicitud/${solicitud.numeroSolicitud}`);
      } else {
        console.error("Error: No se pudo crear la solicitud");
      }
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
      <Header />
      <div className="pt-20">
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
                      const tramite = getTramiteById(tramiteSeleccionado);
                      return tramite ? (
                        <div className="p-4 border border-blue-500 bg-blue-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-gray-900">
                              {tramite.name}
                            </h3>
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {tramite.description}
                          </p>
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
                    {/* Mostrar datos calculados si existen */}
                    {(() => {
                      const arancelCalculado = arancelesCalculados.find(
                        arancel => arancel.tramite === tramiteSeleccionado
                      );
                      
                      if (arancelCalculado && arancelCalculado.costosCalculados) {
                        return (
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                              <DollarSign className="h-5 w-5" />
                              Aranceles Calculados
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="bg-white p-3 rounded border border-blue-100">
                                <h4 className="font-medium text-blue-900 mb-2">Información del Inmueble</h4>
                                <div className="text-sm space-y-1 text-gray-700">
                                  <div><span className="font-medium">Valor:</span> ${arancelCalculado.valorInmueble}</div>
                                  <div><span className="font-medium">Zona:</span> {arancelCalculado.zonaInmueble}</div>
                                  <div><span className="font-medium">Estado civil:</span> {arancelCalculado.estadoCivil}</div>
                                  <div><span className="font-medium">Crédito bancario:</span> {arancelCalculado.usarCredito ? 'Sí' : 'No'}</div>
                                </div>
                              </div>
                              
                              <div className="bg-white p-3 rounded border border-blue-100">
                                <h4 className="font-medium text-blue-900 mb-2">Desglose de Aranceles</h4>
                                <div className="text-sm space-y-1 text-gray-700">
                                  <div className="flex justify-between">
                                    <span>ISAI:</span>
                                    <span className="font-medium">${arancelCalculado.costosCalculados.isai.total.toLocaleString("es-MX")}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Honorarios:</span>
                                    <span className="font-medium">${arancelCalculado.costosCalculados.honorarios.total.toLocaleString("es-MX")}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>RPPC:</span>
                                    <span className="font-medium">${(arancelCalculado.costosCalculados.rppc.inscripcionCompraventa + (arancelCalculado.usarCredito ? arancelCalculado.costosCalculados.rppc.inscripcionHipoteca : 0)).toLocaleString("es-MX")}</span>
                                  </div>
                                  <div className="flex justify-between border-t pt-1 font-bold text-lg">
                                    <span className="text-blue-900">Total:</span>
                                    <span className="text-blue-600">${arancelCalculado.costosCalculados.total.toLocaleString("es-MX")}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    {/* Información del proceso multi-partes */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <Users className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-amber-900 mb-2">
                            Proceso Multi-Partes
                          </h4>
                          <p className="text-sm text-amber-800 mb-2">
                            Este trámite de compraventa involucra tres partes principales:
                          </p>
                          <ul className="text-sm text-amber-800 space-y-1 ml-4">
                            <li>• <strong>Comprador:</strong> Usted (proceso actual)</li>
                            <li>• <strong>Vendedor:</strong> Deberá validar y subir sus documentos</li>
                            <li>• <strong>Notaría:</strong> Revisará y validará toda la información</li>
                          </ul>
                          <p className="text-sm text-amber-800 mt-2 font-medium">
                            ⚠️ Recuerda que será necesario que el vendedor suba sus documentos y valide esta información antes de completar el pago.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Botón de crear solicitud */}
                    <div className="pt-4 border-t border-gray-200">
                      <Alert className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Al crear la solicitud, se generará un trámite único que
                          solo podrán acceder las partes involucradas: comprador,
                          vendedor y notaría con sus respectivas credenciales.
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
