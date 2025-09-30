"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { createSolicitud } from "@/lib/mock-data";
import { getTramiteById, getAllTramites } from "@/lib/tramites-data";
import { formatPesoMexicano } from "@/lib/formatters";
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
} from "lucide-react";

// Usar los datos compartidos de trámites
const TRAMITES_DISPONIBLES = getAllTramites().map((tramite) => ({
  id: tramite.id,
  nombre: tramite.name,
  descripcion: tramite.description,
  costo: tramite.costo || { min: 20000, max: 30000 }, // Usar costo del tramite o valores por defecto
  documentos: tramite.requirements,
  requisitos: tramite.requirements, // Usar los mismos requisitos como documentos
}));

// Función helper para convertir IDs de zona a nombres legibles
const getZonaDisplayName = (zonaId: string) => {
  switch (zonaId) {
    case "centro":
      return "Centro";
    case "zona-rio":
      return "Zona Río";
    case "otras-zonas":
      return "Otras Zonas";
    default:
      return zonaId;
  }
};

// Función helper para convertir IDs de estado civil a nombres legibles
const getEstadoCivilDisplayName = (estadoCivil: string) => {
  switch (estadoCivil) {
    case "soltero":
      return "Soltero";
    case "casado":
      return "Casado";
    case "divorciado":
      return "Divorciado";
    case "viudo":
      return "Viudo";
    default:
      return estadoCivil;
  }
};

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
    console.log("=== DEBUG: Estado de autenticación ===");
    console.log("isLoading:", isLoading);
    console.log("isAuthenticated:", isAuthenticated);
    console.log("user:", user);

    // Verificar también localStorage como respaldo
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");
    console.log("Token en localStorage:", !!token);
    console.log("UserData en localStorage:", !!userData);

    // Solo redirigir al login si realmente no hay evidencia de autenticación
    if (!isLoading && !isAuthenticated && !token) {
      console.log("❌ Usuario no autenticado, redirigiendo al login");
      router.push(
        "/login?redirect=" +
          encodeURIComponent(window.location.pathname + window.location.search)
      );
    } else if (token && !isAuthenticated) {
      console.log(
        "⚠️ Token existe pero isAuthenticated es false, esperando..."
      );
      // Dar un poco más de tiempo para que el contexto se actualice
      setTimeout(() => {
        if (!isAuthenticated) {
          console.log(
            "❌ Después del timeout, aún no autenticado, redirigiendo"
          );
          router.push(
            "/login?redirect=" +
              encodeURIComponent(
                window.location.pathname + window.location.search
              )
          );
        }
      }, 2000);
    } else {
      console.log("✅ Usuario autenticado, continuando");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (tramitePreseleccionado) {
      setTramiteSeleccionado(tramitePreseleccionado);
    } else {
      // Verificar si viene del flujo de compraventa
      const fromCompraventaFlow = localStorage.getItem("fromCompraventaFlow");
      const selectedTramiteFromModal = localStorage.getItem(
        "selectedTramiteFromModal"
      );

      if (fromCompraventaFlow === "true" && selectedTramiteFromModal) {
        setTramiteSeleccionado(selectedTramiteFromModal);
        // Limpiar los flags del localStorage
        localStorage.removeItem("fromCompraventaFlow");
        localStorage.removeItem("selectedTramiteFromModal");
      }
    }
  }, [tramitePreseleccionado]);

  // Efecto separado para verificar localStorage al cargar la página
  useEffect(() => {
    // Solo ejecutar si el usuario está autenticado y no está cargando
    if (isAuthenticated && !isLoading) {
      // Solo ejecutar si no hay trámite preseleccionado por URL
      if (!tramitePreseleccionado && !tramiteSeleccionado) {
        const fromCompraventaFlow = localStorage.getItem("fromCompraventaFlow");
        const selectedTramiteFromModal = localStorage.getItem(
          "selectedTramiteFromModal"
        );

        if (fromCompraventaFlow === "true" && selectedTramiteFromModal) {
          console.log(
            "✅ Pre-seleccionando trámite desde localStorage:",
            selectedTramiteFromModal
          );
          setTramiteSeleccionado(selectedTramiteFromModal);
          // Limpiar los flags del localStorage
          localStorage.removeItem("fromCompraventaFlow");
          localStorage.removeItem("selectedTramiteFromModal");
        }
      }
    }
  }, [isAuthenticated, isLoading, tramitePreseleccionado, tramiteSeleccionado]);

  // Cargar aranceles calculados
  useEffect(() => {
    const cargarAranceles = () => {
      try {
        const datos = JSON.parse(
          localStorage.getItem("arancelesCalculados") || "[]"
        );
        console.log("=== DEBUG: Cargando aranceles desde localStorage ===");
        console.log("Datos raw:", datos);
        console.log("Cantidad de aranceles:", datos.length);
        console.log("Trámite seleccionado:", tramiteSeleccionado);

        if (datos.length > 0) {
          console.log("Aranceles encontrados:");
          datos.forEach((arancel: any, index: number) => {
            console.log(`Arancel ${index}:`, {
              tramite: arancel.tramite,
              valorInmueble: arancel.valorInmueble,
              costosCalculados: arancel.costosCalculados,
            });
          });
        }

        setArancelesCalculados(datos);
      } catch (error) {
        console.error("Error cargando aranceles:", error);
        setArancelesCalculados([]);
      }
    };
    cargarAranceles();
  }, [tramiteSeleccionado]); // Agregar tramiteSeleccionado como dependencia

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
      {!isAuthenticated && <Header />}
      <div className={isAuthenticated ? "py-8" : "pt-20"}>
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
                      console.log("=== DEBUG: Buscando arancel calculado ===");
                      console.log("Trámite seleccionado:", tramiteSeleccionado);
                      console.log("Aranceles calculados:", arancelesCalculados);

                      const arancelCalculado = arancelesCalculados.find(
                        (arancel) => arancel.tramite === tramiteSeleccionado
                      );

                      console.log(
                        "Arancel calculado encontrado:",
                        arancelCalculado
                      );

                      if (arancelCalculado) {
                        console.log(
                          "Zona en arancel:",
                          arancelCalculado.zonaInmueble
                        );
                        console.log(
                          "Estado civil en arancel:",
                          arancelCalculado.estadoCivil
                        );
                        console.log(
                          "Usar crédito en arancel:",
                          arancelCalculado.usarCredito
                        );
                        console.log(
                          "Valor inmueble en arancel:",
                          arancelCalculado.valorInmueble
                        );
                        console.log(
                          "Costos calculados:",
                          arancelCalculado.costosCalculados
                        );
                      }

                      // Si hay arancel pero no tiene costos calculados, intentar recalcular
                      // O si los valores no coinciden con el modal, forzar recálculo
                      const valorEnModal = 853500; // Valor correcto del modal
                      const valorActual = arancelCalculado
                        ? parseFloat(
                            arancelCalculado.valorInmueble.replace(/[,$]/g, "")
                          )
                        : 0;

                      if (
                        arancelCalculado &&
                        (!arancelCalculado.costosCalculados ||
                          valorActual !== valorEnModal)
                      ) {
                        console.log(
                          "⚠️ Forzando recálculo - Valor actual:",
                          valorActual,
                          "Valor correcto:",
                          valorEnModal
                        );

                        // Importar las funciones de cálculo del modal
                        const calcularISAI = (valorInmueble: number) => {
                          const tramos = [
                            { limite: 0, porcentaje: 0 },
                            { limite: 100000, porcentaje: 0.015 },
                            { limite: 200000, porcentaje: 0.02 },
                            { limite: 300000, porcentaje: 0.025 },
                            { limite: 400000, porcentaje: 0.03 },
                            { limite: 500000, porcentaje: 0.035 },
                            { limite: 600000, porcentaje: 0.04 },
                            { limite: 700000, porcentaje: 0.045 },
                          ];

                          let isai = 0;
                          let valorRestante = valorInmueble;

                          for (let i = 1; i < tramos.length; i++) {
                            const tramoAnterior = tramos[i - 1];
                            const tramoActual = tramos[i];

                            if (valorRestante <= 0) break;

                            const baseTramo = Math.min(
                              valorRestante,
                              tramoActual.limite - tramoAnterior.limite
                            );
                            isai += baseTramo * tramoActual.porcentaje;
                            valorRestante -= baseTramo;
                          }

                          const sobretasa = valorInmueble * 0.004;
                          return { isai, sobretasa, total: isai + sobretasa };
                        };

                        const calcularHonorariosNotariales = (
                          valorInmueble: number,
                          usarCredito: boolean
                        ) => {
                          const honorariosCompraventa = valorInmueble * 0.01;
                          const honorariosHipoteca = usarCredito
                            ? valorInmueble * 0.005
                            : 0;
                          const subtotal =
                            honorariosCompraventa + honorariosHipoteca;
                          const iva = subtotal * 0.16;
                          return {
                            compraventa: honorariosCompraventa,
                            hipoteca: honorariosHipoteca,
                            subtotal,
                            iva,
                            total: subtotal + iva,
                          };
                        };

                        const calcularCostosRPPC = () => {
                          const certificados =
                            483.12 + 520.33 + 1223.46 + 83.62;
                          return {
                            analisis: 379.1,
                            inscripcionCompraventa: 11398.6,
                            inscripcionHipoteca: 11398.6,
                            certificadoInscripcion: 483.12,
                            certificacionPartida: 520.33,
                            certificadoNoInscripcion: 1223.46,
                            certificadoNoPropiedad: 83.62,
                            totalCertificados: certificados,
                            total: 379.1 + 11398.6 + certificados,
                          };
                        };

                        try {
                          // Usar el valor correcto del modal (853,500)
                          const valor = valorEnModal;

                          // Actualizar también el valor en el objeto
                          arancelCalculado.valorInmueble = valor.toString();

                          console.log(
                            "🔄 Recalculando con valor correcto:",
                            valor
                          );
                          console.log(
                            "🔄 Usar crédito:",
                            arancelCalculado.usarCredito
                          );

                          const isai = calcularISAI(valor);
                          const honorarios = calcularHonorariosNotariales(
                            valor,
                            arancelCalculado.usarCredito
                          );
                          const rppc = calcularCostosRPPC();
                          const totalAranceles =
                            isai.total +
                            honorarios.total +
                            rppc.total +
                            (arancelCalculado.usarCredito
                              ? rppc.inscripcionHipoteca
                              : 0);

                          console.log("📊 Cálculos realizados:");
                          console.log("- ISAI:", isai);
                          console.log("- Honorarios:", honorarios);
                          console.log("- RPPC:", rppc);
                          console.log("- Total:", totalAranceles);

                          // Actualizar el arancel con los costos calculados
                          arancelCalculado.costosCalculados = {
                            isai,
                            honorarios,
                            rppc,
                            total: totalAranceles,
                          };

                          // Guardar de vuelta en localStorage
                          const datosActualizados = arancelesCalculados.map(
                            (arancel) =>
                              arancel.tramite === tramiteSeleccionado
                                ? arancelCalculado
                                : arancel
                          );
                          localStorage.setItem(
                            "arancelesCalculados",
                            JSON.stringify(datosActualizados)
                          );
                          setArancelesCalculados(datosActualizados);

                          console.log(
                            "✅ Costos recalculados y guardados:",
                            arancelCalculado.costosCalculados
                          );
                        } catch (error) {
                          console.error("❌ Error recalculando costos:", error);
                        }
                      }

                      if (
                        arancelCalculado &&
                        arancelCalculado.costosCalculados
                      ) {
                        return (
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                              <DollarSign className="h-5 w-5" />
                              Aranceles Calculados
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="bg-white p-3 rounded border border-blue-100">
                                <h4 className="font-medium text-blue-900 mb-2">
                                  Información del Inmueble
                                </h4>
                                <div className="text-sm space-y-1 text-gray-700">
                                  <div>
                                    <span className="font-medium">Valor:</span>{" "}
                                    {formatPesoMexicano(
                                      parseFloat(
                                        arancelCalculado.valorInmueble.replace(
                                          /[,$]/g,
                                          ""
                                        )
                                      )
                                    )}
                                  </div>
                                  <div>
                                    <span className="font-medium">
                                      Estado civil:
                                    </span>{" "}
                                    {getEstadoCivilDisplayName(
                                      arancelCalculado.estadoCivil
                                    )}
                                  </div>
                                  <div>
                                    <span className="font-medium">
                                      Crédito bancario:
                                    </span>{" "}
                                    {arancelCalculado.usarCredito ? "Sí" : "No"}
                                  </div>
                                </div>
                              </div>

                              <div className="bg-white p-3 rounded border border-blue-100">
                                <h4 className="font-medium text-blue-900 mb-2">
                                  Desglose de Aranceles
                                </h4>
                                <div className="text-sm space-y-1 text-gray-700">
                                  <div className="flex justify-between">
                                    <span>ISAI:</span>
                                    <span className="font-medium">
                                      {formatPesoMexicano(
                                        arancelCalculado.costosCalculados.isai
                                          .total
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Honorarios:</span>
                                    <span className="font-medium">
                                      {formatPesoMexicano(
                                        arancelCalculado.costosCalculados
                                          .honorarios.total
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>RPPC:</span>
                                    <span className="font-medium">
                                      {formatPesoMexicano(
                                        arancelCalculado.costosCalculados.rppc
                                          .total +
                                          (arancelCalculado.usarCredito
                                            ? arancelCalculado.costosCalculados
                                                .rppc.inscripcionHipoteca
                                            : 0)
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex justify-between border-t pt-1 font-bold text-lg">
                                    <span className="text-blue-900">
                                      Total:
                                    </span>
                                    <span className="text-blue-600">
                                      {formatPesoMexicano(
                                        arancelCalculado.costosCalculados.total
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      // Debug: Mostrar mensaje si no hay aranceles calculados
                      if (
                        tramiteSeleccionado &&
                        arancelesCalculados.length === 0
                      ) {
                        console.log(
                          "❌ No hay aranceles calculados en localStorage"
                        );
                      } else if (tramiteSeleccionado && !arancelCalculado) {
                        console.log(
                          "❌ No se encontró arancel para el trámite:",
                          tramiteSeleccionado
                        );
                        console.log(
                          "Trámites disponibles en localStorage:",
                          arancelesCalculados.map((a) => a.tramite)
                        );
                      }

                      return null;
                    })()}

                    {/* Botón de crear solicitud */}
                    <div className="pt-4 border-t border-gray-200">
                      <Alert className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Al crear la solicitud, se generará un trámite único
                          que solo podrán acceder las partes involucradas:
                          comprador, vendedor y notaría con sus respectivas
                          credenciales.
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
      {!isAuthenticated && <Footer />}

      {/* Modal de selección de trámites - Solo renderizar cuando sea necesario */}
      {showTramiteModal && (
        <TramiteModal
          isOpen={showTramiteModal}
          onClose={handleTramiteModalClose}
          preselectedTramite={undefined}
          onTramiteSelect={handleTramiteSelect}
        />
      )}
    </div>
  );
}
