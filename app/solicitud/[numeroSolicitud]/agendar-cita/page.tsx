"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  User,
  LogOut,
  ArrowLeft,
} from "lucide-react";

export default function AgendarCitaPage() {
  const params = useParams();
  const numeroSolicitud = params.numeroSolicitud as string;
  const [solicitud, setSolicitud] = useState<any>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<string>("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [availableAppointments, setAvailableAppointments] = useState<any[]>([]);

  // Generar citas disponibles (fecha + hora combinadas) - distribuidas mejor
  const generateAvailableAppointments = () => {
    const appointments = [];
    const today = new Date();
    const timeSlots = [
      { value: "09:00", label: "9:00 AM" },
      { value: "10:00", label: "10:00 AM" },
      { value: "11:00", label: "11:00 AM" },
      { value: "12:00", label: "12:00 PM" },
      { value: "14:00", label: "2:00 PM" },
      { value: "15:00", label: "3:00 PM" },
      { value: "16:00", label: "4:00 PM" },
      { value: "17:00", label: "5:00 PM" },
    ];

    // Generar todas las citas posibles
    const allAppointments = [];
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Solo lunes a viernes (1-5)
      if (date.getDay() >= 1 && date.getDay() <= 5) {
        // Para cada día hábil, agregar algunos horarios aleatorios
        const availableTimes = timeSlots.filter(() => Math.random() > 0.4); // 60% probabilidad de estar disponible

        availableTimes.forEach((time) => {
          allAppointments.push({
            id: `${date.toISOString().split("T")[0]}_${time.value}`,
            date: date.toISOString().split("T")[0],
            time: time.value,
            label: date.toLocaleDateString("es-MX", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            timeLabel: time.label,
            fullLabel: `${date.toLocaleDateString("es-MX", {
              weekday: "long",
              day: "numeric",
              month: "short",
            })} - ${time.label}`,
          });
        });
      }
    }

    // Seleccionar 3 citas distribuidas (no del mismo día)
    const selectedAppointments = [];
    const usedDates = new Set();

    // Mezclar las citas para selección aleatoria
    const shuffledAppointments = [...allAppointments].sort(
      () => Math.random() - 0.5
    );

    for (const appointment of shuffledAppointments) {
      if (selectedAppointments.length >= 3) break;

      // Solo agregar si no hemos usado esta fecha antes
      if (!usedDates.has(appointment.date)) {
        selectedAppointments.push(appointment);
        usedDates.add(appointment.date);
      }
    }

    // Si no tenemos suficientes citas de días diferentes, agregar más
    if (selectedAppointments.length < 3) {
      for (const appointment of shuffledAppointments) {
        if (selectedAppointments.length >= 3) break;
        if (!selectedAppointments.some((apt) => apt.id === appointment.id)) {
          selectedAppointments.push(appointment);
        }
      }
    }

    return selectedAppointments;
  };

  useEffect(() => {
    console.log(
      "Cargando página de agendar cita para solicitud:",
      numeroSolicitud
    );

    // Generar citas disponibles (solo 3 inicialmente)
    const appointments = generateAvailableAppointments().slice(0, 3);
    setAvailableAppointments(appointments);

    // Solicitud especial de demostración
    if (numeroSolicitud === "NT3-2025-00123") {
      const solicitudDemo = {
        numeroSolicitud: "NT3-2025-00123",
        tipoTramite: "Compraventa de Inmuebles",
        costoTotal: 25000,
        saldoPendiente: 0,
        pagosRealizados: 25000,
        estatusActual: "CITA_AGENDADA",
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
            extractedData: {
              documentType: "RFC",
              data: { rfc: "HEGR850315ABC" },
            },
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
            fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
            descripcion:
              "Solicitud enviada a revisión interna. Licenciado asignado revisando documentos.",
            usuario: "Sistema",
          },
          {
            estatus: "REVISION_BORRADOR",
            fecha: new Date().toISOString().split("T")[0],
            descripcion:
              "Documento de escritura generado y listo para revisión del cliente.",
            usuario: "Sistema",
          },
        ],
        fechaCreacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        fechaUltimaActualizacion: new Date().toISOString().split("T")[0],
        cliente: {
          id: "user-hardcoded",
          nombre: "HERNANDEZ GONZALEZ JONATHAN RUBEN",
          email: "juan.perez@email.com",
          telefono: "+52 664 123 4567",
        },
        notario: {
          id: "notario-1",
          nombre: "Dra. María Elena Rodríguez",
          email: "maria.rodriguez@notaria3tijuana.com",
          telefono: "+52 664 987 6543",
        },
      };

      console.log("Usando solicitud demo para agendar cita:", solicitudDemo);
      setSolicitud(solicitudDemo);
      return;
    }

    // Si no es la solicitud demo, redirigir
    window.location.href = "/mi-cuenta";
  }, [numeroSolicitud]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleCargarMasFechas = () => {
    // Generar nuevas citas aleatorias (3 más)
    const nuevasCitas = generateAvailableAppointments().slice(0, 3);
    setAvailableAppointments(nuevasCitas);
    setSelectedAppointment(""); // Limpiar selección
  };

  const handleConfirmarCita = () => {
    if (!selectedAppointment) {
      alert("Por favor selecciona una cita disponible.");
      return;
    }

    const appointment = availableAppointments.find(
      (apt) => apt.id === selectedAppointment
    );

    alert(
      `¡Cita agendada exitosamente!\n\nFecha: ${appointment?.label}\nHora: ${appointment?.timeLabel}\n\nTe hemos enviado un correo de confirmación.`
    );

    // Simular agendamiento exitoso y redirigir a Mi Cuenta
    setTimeout(() => {
      window.location.href = `/mi-cuenta`;
    }, 2000);
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
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Agendar Cita para Firma
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-4">
            {/* Información de la cita */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Seleccionar Fecha y Hora
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className="mb-6">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>¡Excelente!</strong> Has aceptado la escritura.
                    Ahora necesitas agendar una cita en la notaría para proceder
                    con la firma del documento.
                  </AlertDescription>
                </Alert>

                <div className="space-y-6">
                  {/* Selección de citas disponibles */}
                  <div>
                    <h3 className="font-semibold mb-3">Citas disponibles:</h3>
                    <div className="space-y-3">
                      {availableAppointments.map((appointment) => (
                        <Button
                          key={appointment.id}
                          variant={
                            selectedAppointment === appointment.id
                              ? "default"
                              : "outline"
                          }
                          onClick={() => setSelectedAppointment(appointment.id)}
                          className="w-full h-14 text-left justify-start"
                        >
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5" />
                            <div>
                              <div className="font-medium">
                                {appointment.label}
                              </div>
                              <div className="text-sm opacity-75 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {appointment.timeLabel}
                              </div>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>

                    {/* Botón para cargar más fechas */}
                    <Button
                      variant="outline"
                      onClick={handleCargarMasFechas}
                      className="w-full mt-3"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Cargar más fechas disponibles
                    </Button>
                  </div>

                  {/* Resumen de la cita */}
                  {selectedAppointment && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 mb-2">
                        Resumen de tu cita:
                      </h3>
                      <div className="space-y-1 text-sm text-blue-800">
                        <p>
                          <strong>Fecha:</strong>{" "}
                          {
                            availableAppointments.find(
                              (apt) => apt.id === selectedAppointment
                            )?.label
                          }
                        </p>
                        <p>
                          <strong>Hora:</strong>{" "}
                          {
                            availableAppointments.find(
                              (apt) => apt.id === selectedAppointment
                            )?.timeLabel
                          }
                        </p>
                        <p>
                          <strong>Duración estimada:</strong> 30-45 minutos
                        </p>
                        <p>
                          <strong>Ubicación:</strong> Notaría Pública No. 3,
                          Tijuana
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Botón de confirmación */}
                  <Button
                    onClick={handleConfirmarCita}
                    disabled={!selectedAppointment}
                    className="w-full h-12 bg-green-600 hover:bg-green-700 text-white text-lg"
                  >
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Confirmar Cita
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Información del trámite */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Información del Trámite
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Estatus:</span>
                    <Badge className="bg-green-100 text-green-800">
                      Listo para Firma
                    </Badge>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Documentos:</span>
                    <span className="text-sm font-medium text-green-600">
                      {solicitud.documentosRequeridos.length}/
                      {solicitud.documentosRequeridos.length} Completados
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pago:</span>
                    <span className="text-sm font-medium text-green-600">
                      ${solicitud.pagosRealizados.toLocaleString("es-MX")}{" "}
                      Pagado
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Escritura:</span>
                    <span className="text-sm font-medium text-green-600">
                      Aceptada
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información de la notaría */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Notaría Pública No. 3
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Horario de Atención</p>
                      <p className="text-sm text-gray-600">
                        Lun-Vie 9:00-18:00
                      </p>
                    </div>
                  </div>

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
                </div>
              </CardContent>
            </Card>

            {/* Instrucciones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Instrucciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Lleva identificación oficial</p>
                  <p>• Llega 10 minutos antes</p>
                  <p>• Trae todos los documentos originales</p>
                  <p>• El proceso toma 30-45 minutos</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
