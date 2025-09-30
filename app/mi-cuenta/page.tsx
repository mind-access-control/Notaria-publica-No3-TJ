"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { formatPesoMexicano } from "@/lib/formatters";
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
  Bell,
  ChevronRight,
  X,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function MiCuentaPage() {
  const router = useRouter();
  const { logout, isAuthenticated, isLoading } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [showFloatingNotification, setShowFloatingNotification] =
    useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Usuario hardcodeado
  const user = {
    id: "user-hardcoded",
    nombre: "HERNANDEZ GONZALEZ JONATHAN RUBEN",
    email: "tu-email@ejemplo.com",
    telefono: "+52 664 123 4567",
    role: "cliente" as const,
  };

  // Función para calcular ISAI (Impuesto Sobre Adquisición de Inmuebles) - Tijuana
  const calcularISAI = (valorInmueble: number) => {
    const tramos = [
      { limite: 0, porcentaje: 0 },
      { limite: 100000, porcentaje: 0.015 }, // 1.5%
      { limite: 200000, porcentaje: 0.02 }, // 2.0%
      { limite: 300000, porcentaje: 0.025 }, // 2.5%
      { limite: 400000, porcentaje: 0.03 }, // 3.0%
      { limite: 500000, porcentaje: 0.035 }, // 3.5%
      { limite: 600000, porcentaje: 0.04 }, // 4.0%
      { limite: 700000, porcentaje: 0.045 }, // 4.5%
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

    // Adicional sobretasa 0.4%
    const sobretasa = valorInmueble * 0.004;

    return {
      isai: isai,
      sobretasa: sobretasa,
      total: isai + sobretasa,
    };
  };

  // Función para calcular honorarios notariales
  const calcularHonorariosNotariales = (
    valorInmueble: number,
    usarCredito: boolean
  ) => {
    // Honorarios compraventa: 1.0% del valor (POC)
    const honorariosCompraventa = valorInmueble * 0.01;

    // Honorarios hipoteca: 0.5% del valor del inmueble (POC)
    const honorariosHipoteca = usarCredito ? valorInmueble * 0.005 : 0;

    const subtotal = honorariosCompraventa + honorariosHipoteca;
    const iva = subtotal * 0.16; // IVA 16%

    return {
      compraventa: honorariosCompraventa,
      hipoteca: honorariosHipoteca,
      subtotal: subtotal,
      iva: iva,
      total: subtotal + iva,
    };
  };

  // Función para calcular costos RPPC (Registro Público de la Propiedad y del Comercio)
  const calcularCostosRPPC = () => {
    const certificados = 483.12 + 520.33 + 1223.46 + 83.62;
    return {
      analisis: 379.1,
      inscripcionCompraventa: 11398.6,
      inscripcionHipoteca: 11398.6,
      certificadoInscripcion: 483.12,
      certificacionPartida: 520.33,
      certificadoNoInscripcion: 1223.46,
      certificadoNoPropiedad: 83.62,
      totalCertificados: certificados,
      total: 379.1 + 11398.6 + certificados, // Análisis + Inscripción + Certificados
    };
  };

  // Calcular el total real usando los mismos cálculos del modal
  const calcularTotalReal = () => {
    const valorInmueble = 853500; // Valor por defecto para compraventa
    const usarCredito = false;

    const isai = calcularISAI(valorInmueble);
    const honorarios = calcularHonorariosNotariales(valorInmueble, usarCredito);
    const rppc = calcularCostosRPPC();

    return {
      isai,
      honorarios,
      rppc,
      total: isai.total + honorarios.total + rppc.total,
    };
  };

  const costosCalculados = calcularTotalReal();

  // Solicitud hardcodeada de compraventa
  const solicitudHardcodeada = {
    numeroSolicitud: "NT3-2025-00123",
    tipoTramite: "Compraventa de Inmuebles",
    costoTotal: costosCalculados.total,
    saldoPendiente: 0,
    pagosRealizados: costosCalculados.total,
    estatusActual: "EN_REVISION_INTERNA" as const,
    documentosRequeridos: [
      {
        nombre: "Identificación oficial",
        descripcion: "INE vigente",
        subido: true,
        archivo: {
          name: "INE.pdf",
          url: "/sample-documents/identificacion.pdf",
        },
        extractedData: {
          documentType: "INE",
          data: { nombre: "HERNANDEZ GONZALEZ JONATHAN RUBEN" },
        },
        validado: true,
      },
      {
        nombre: "CURP",
        descripcion: "Clave Única de Registro de Población",
        subido: true,
        archivo: {
          name: "CURP.pdf",
          url: "/sample-documents/identificacion.pdf",
        },
        extractedData: {
          documentType: "CURP",
          data: { curp: "HEGR850315HBCNNS01" },
        },
        validado: true,
      },
      {
        nombre: "Comprobante de domicilio",
        descripcion: "No mayor a 3 meses",
        subido: true,
        archivo: {
          name: "Comprobante_Domicilio.pdf",
          url: "/sample-documents/comprobante_domicilio.pdf",
        },
        extractedData: {
          documentType: "DOMICILIO",
          data: { direccion: "Av. Revolución 1234, Centro, Tijuana" },
        },
        validado: true,
      },
      {
        nombre: "Acta de nacimiento",
        descripcion: "Certificada",
        subido: true,
        archivo: {
          name: "Acta_Nacimiento.pdf",
          url: "/sample-documents/acta_nacimiento.pdf",
        },
        extractedData: {
          documentType: "ACTA_NACIMIENTO",
          data: { fechaNacimiento: "15/03/1985" },
        },
        validado: true,
      },
      {
        nombre: "RFC y Constancia de Situación Fiscal (CSF)",
        descripcion: "Del SAT",
        subido: true,
        archivo: {
          name: "RFC_CSF.pdf",
          url: "/sample-documents/identificacion.pdf",
        },
        extractedData: { documentType: "RFC", data: { rfc: "HEGR850315ABC" } },
        validado: true,
      },
      {
        nombre: "Datos bancarios",
        descripcion: "Estado de cuenta o comprobante",
        subido: true,
        archivo: {
          name: "Datos_Bancarios.pdf",
          url: "/sample-documents/identificacion.pdf",
        },
        extractedData: {
          documentType: "DATOS_BANCARIOS",
          data: { banco: "BBVA", cuenta: "1234567890" },
        },
        validado: true,
      },
    ],
    historial: [
      {
        estatus: "ARMANDO_EXPEDIENTE",
        fecha: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        descripcion: "Trámite iniciado. Pendiente de subir documentos.",
        usuario: "Sistema",
      },
      {
        estatus: "PAGO_PENDIENTE",
        fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        descripcion:
          "Todos los documentos han sido subidos y validados. Pago realizado exitosamente.",
        usuario: "Sistema",
      },
      {
        estatus: "EN_REVISION_INTERNA",
        fecha: new Date().toISOString().split("T")[0],
        descripcion:
          "Solicitud enviada a revisión interna. Licenciado asignado revisando documentos.",
        usuario: "Sistema",
      },
    ],
    fechaCreacion: new Date().toISOString().split("T")[0],
    fechaUltimaActualizacion: new Date().toISOString().split("T")[0],
    cliente: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      telefono: user.telefono,
    },
    notario: {
      id: "notario-1",
      nombre: "Dra. María Elena Rodríguez",
      email: "maria.rodriguez@notaria3tijuana.com",
      telefono: "+52 664 987 6543",
    },
  };

  const solicitudes = [solicitudHardcodeada];

  useEffect(() => {
    console.log("Mi Cuenta Hardcodeada - Cargando página");

    // Para la demo, siempre mostrar la página sin verificar autenticación
    // Esto permite que funcione desde cualquier lugar sin problemas de login

    // Simular notificaciones demo después de 3 segundos
    setTimeout(() => {
      const nuevaNotificacion = {
        id: "demo-notif-hardcoded",
        tipo: "revision_expediente",
        titulo: "Solicitud en Revisión Interna",
        mensaje:
          "Tu solicitud de compraventa está siendo validada por un licenciado. Te mantendremos informado del progreso.",
        fecha: new Date().toISOString(),
        leida: false,
        solicitudId: solicitudHardcodeada.numeroSolicitud,
        acciones: [{ texto: "Ver Detalles", accion: "ver_documento" }],
      };
      setNotifications([nuevaNotificacion]);
      setHasNewNotification(true);
      setShowFloatingNotification(true);
      setTimeout(() => {
        setShowFloatingNotification(false);
      }, 5000);
    }, 3000);
  }, []);

  const getStatusColor = (estatus: string) => {
    switch (estatus) {
      case "ARMANDO_EXPEDIENTE":
        return "bg-yellow-100 text-yellow-800";
      case "EN_REVISION_INTERNA":
        return "bg-blue-100 text-blue-800";
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
      case "ARMANDO_EXPEDIENTE":
        return <FileText className="h-4 w-4" />;
      case "EN_REVISION_INTERNA":
        return <Clock className="h-4 w-4" />;
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

  const handleLogout = async () => {
    setIsLoggingOut(true);

    // Limpiar localStorage completamente
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.clear();

    // Esperar un momento para que se procese la limpieza
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Redirigir a la página principal
    window.location.href = "/";
  };

  const handleNotificationAction = (notification: any, action: string) => {
    switch (action) {
      case "ver_documento":
        console.log(
          "Navegando a seguimiento desde notificación:",
          solicitudHardcodeada.numeroSolicitud
        );
        window.location.href = `/solicitud/${solicitudHardcodeada.numeroSolicitud}/seguimiento`;
        break;
      case "ver_revision_borrador":
        console.log(
          "Navegando a revisión de borrador desde notificación:",
          solicitudHardcodeada.numeroSolicitud
        );
        window.location.href = `/solicitud/${solicitudHardcodeada.numeroSolicitud}/revision-borrador`;
        break;
      case "contactar_abogado":
        console.log("Contactar abogado");
        break;
    }
  };

  // Para la demo, siempre mostrar la página sin verificar autenticación
  // Esto permite que funcione desde cualquier lugar sin problemas de login

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

          {/* Tabs */}
          <Tabs defaultValue="solicitudes" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="solicitudes"
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Mis Solicitudes
              </TabsTrigger>
              <TabsTrigger
                value="aranceles"
                className="flex items-center gap-2"
              >
                <DollarSign className="h-4 w-4" />
                Aranceles
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
                <h2
                  className="text-2xl font-semibold text-gray-900"
                  onClick={() => {
                    console.log(
                      "Simulando notificación de escritura lista para revisión"
                    );
                    const nuevaNotificacion = {
                      id: `escritura-revision-${Date.now()}`,
                      tipo: "revision_borrador",
                      titulo: "Documento de Escritura Listo para Revisión",
                      mensaje:
                        "Tu documento de escritura está listo para revisión. Por favor, revisa los detalles y confirma la información.",
                      fecha: new Date().toISOString(),
                      leida: false,
                      solicitudId: solicitudHardcodeada.numeroSolicitud,
                      acciones: [
                        {
                          texto: "Ver Detalles",
                          accion: "ver_revision_borrador",
                        },
                      ],
                    };
                    setNotifications((prev) => [nuevaNotificacion, ...prev]);
                    setHasNewNotification(true);
                    setShowFloatingNotification(true);
                    setTimeout(() => {
                      setShowFloatingNotification(false);
                    }, 5000);
                  }}
                >
                  Mis Solicitudes
                </h2>
                <p className="text-sm text-gray-600">
                  {solicitudes.length} solicitud encontrada
                </p>
              </div>

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
                            {formatStatusText(solicitud.estatusActual)}
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
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span>
                            Pago liquidado:{" "}
                            {formatPesoMexicano(solicitud.pagosRealizados)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span>
                            Todos los documentos completados (
                            {solicitud.documentosRequeridos.length}/
                            {solicitud.documentosRequeridos.length})
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
                          <p className="text-green-600 font-medium">
                            ✓ Pago completamente liquidado
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            console.log(
                              "Navegando a seguimiento:",
                              solicitud.numeroSolicitud
                            );
                            window.location.href = `/solicitud/${solicitud.numeroSolicitud}/seguimiento`;
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Tab: Aranceles Calculados */}
            <TabsContent value="aranceles" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Aranceles Calculados
                </h2>
                <p className="text-sm text-gray-600">1 cálculo encontrado</p>
              </div>

              <div className="grid gap-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-blue-900">
                        Compraventa de Inmuebles
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {new Date().toLocaleDateString("es-MX")}
                      </Badge>
                    </div>
                    <CardDescription>
                      Cálculo de aranceles para trámite notarial
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Información del inmueble */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Información del Inmueble
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Valor:</span>
                            <span className="font-medium">
                              {formatPesoMexicano(853500)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Estado civil:</span>
                            <span className="font-medium capitalize">
                              Casado
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Crédito bancario:
                            </span>
                            <span className="font-medium">No</span>
                          </div>
                        </div>
                      </div>

                      {/* Desglose de costos */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Desglose de Aranceles
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">ISAI:</span>
                            <span className="font-medium">
                              {formatPesoMexicano(costosCalculados.isai.total)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Honorarios:</span>
                            <span className="font-medium">
                              {formatPesoMexicano(
                                costosCalculados.honorarios.total
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">RPPC:</span>
                            <span className="font-medium">
                              {formatPesoMexicano(costosCalculados.rppc.total)}
                            </span>
                          </div>
                          <div className="flex justify-between border-t pt-2 font-bold text-lg">
                            <span className="text-gray-900">Total:</span>
                            <span className="text-blue-600">
                              {formatPesoMexicano(costosCalculados.total)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
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
                              {notification.acciones.map(
                                (accion: any, idx: number) => (
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
                                )
                              )}
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
    </div>
  );
}
