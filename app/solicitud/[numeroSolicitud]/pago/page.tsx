"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  CreditCard,
  CheckCircle,
  ArrowLeft,
  DollarSign,
  FileText,
  Clock,
  AlertCircle,
  Calculator,
} from "lucide-react";
import { solicitudes } from "@/lib/mock-data";

export default function PagoPage() {
  const params = useParams();
  const router = useRouter();
  const numeroSolicitud = params.numeroSolicitud as string;
  const [solicitud, setSolicitud] = useState<any>(null);
  const [metodoPago, setMetodoPago] = useState<string>("");
  const [procesando, setProcesando] = useState(false);
  const [pagoExitoso, setPagoExitoso] = useState(false);
  const [montoPago, setMontoPago] = useState<string>("");
  const [esPagoParcial, setEsPagoParcial] = useState(false);

  // Calcular el mínimo requerido (30% del total) y el máximo (saldo pendiente)
  const montoMinimo = solicitud ? Math.ceil(solicitud.costoTotal * 0.3) : 0;
  const saldoPendiente = solicitud
    ? solicitud.saldoPendiente || solicitud.costoTotal
    : 0;
  const montoMaximo = saldoPendiente;
  const montoIngresado = parseFloat(montoPago) || 0;

  useEffect(() => {
    console.log("Buscando solicitud con número:", numeroSolicitud);
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
      // Establecer el monto inicial como el saldo pendiente
      const saldoPendiente =
        solicitudEncontrada.saldoPendiente || solicitudEncontrada.costoTotal;
      setMontoPago(saldoPendiente.toString());
    } else {
      // Si no encuentra la solicitud, usar la primera disponible para testing
      console.log(
        "No se encontró la solicitud, usando la primera disponible para testing"
      );
      setSolicitud(solicitudes[0]);
      const saldoPendiente =
        solicitudes[0].saldoPendiente || solicitudes[0].costoTotal;
      setMontoPago(saldoPendiente.toString());
    }
  }, [numeroSolicitud]);

  const handleMontoChange = (value: string) => {
    setMontoPago(value);
    const monto = parseFloat(value) || 0;
    setEsPagoParcial(monto < montoMaximo);
  };

  const handlePago = async () => {
    if (!metodoPago || !montoPago) return;

    const monto = parseFloat(montoPago);
    if (monto < montoMinimo) {
      alert(
        `El monto mínimo requerido es $${montoMinimo.toLocaleString("es-MX")}`
      );
      return;
    }

    console.log("Iniciando proceso de pago...");
    setProcesando(true);

    // Simular procesamiento de pago
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Procesando pago completado, actualizando solicitud...");

    // Actualizar el estatus de la solicitud
    const solicitudIndex = solicitudes.findIndex(
      (s) => s.numeroSolicitud === numeroSolicitud
    );
    console.log("Índice de solicitud encontrado:", solicitudIndex);

    if (solicitudIndex !== -1) {
      const solicitudActualizada = solicitudes[solicitudIndex];

      // Calcular el saldo pendiente correctamente
      const totalPagadoHastaAhora = solicitudActualizada.pagosRealizados || 0;
      const nuevoSaldoPendiente =
        solicitudActualizada.costoTotal - (totalPagadoHastaAhora + monto);
      const nuevosPagosRealizados = totalPagadoHastaAhora + monto;

      // Determinar el nuevo estatus
      let nuevoEstatus = "EN_REVISION_INTERNA";
      if (nuevoSaldoPendiente > 0) {
        nuevoEstatus = "PAGO_PENDIENTE";
      }

      solicitudes[solicitudIndex].estatusActual = nuevoEstatus;
      solicitudes[solicitudIndex].saldoPendiente = Math.max(
        0,
        nuevoSaldoPendiente
      );
      solicitudes[solicitudIndex].pagosRealizados = nuevosPagosRealizados;
      solicitudes[solicitudIndex].fechaUltimaActualizacion =
        new Date().toISOString();

      // Agregar entrada al historial
      const descripcionPago =
        nuevoSaldoPendiente > 0
          ? `Pago parcial de $${monto.toLocaleString(
              "es-MX"
            )} realizado. Saldo pendiente: $${nuevoSaldoPendiente.toLocaleString(
              "es-MX"
            )}`
          : `Pago completo de $${monto.toLocaleString(
              "es-MX"
            )} realizado. Trámite enviado a revisión interna.`;

      solicitudes[solicitudIndex].historial.push({
        estatus: nuevoEstatus,
        fecha: new Date().toISOString(),
        descripcion: descripcionPago,
        usuario: "Sistema",
      });

      console.log("Solicitud actualizada:", solicitudes[solicitudIndex]);
    }

    setPagoExitoso(true);
    setProcesando(false);

    console.log("Redirigiendo a página de seguimiento...");
    // Redirigir inmediatamente a la página de seguimiento
    window.location.href = `/solicitud/${numeroSolicitud}/seguimiento`;
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

  if (pagoExitoso) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ¡Pago Exitoso!
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Tu pago ha sido procesado correctamente.
                {esPagoParcial
                  ? " Puedes realizar pagos adicionales cuando lo desees."
                  : " Tu trámite ahora está en revisión interna."}
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800">
                  Redirigiendo a la página de seguimiento detallado...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Compraventa</h1>
          </div>
          <p className="text-gray-600">
            Solicitud #{solicitud.numeroSolicitud} - {solicitud.tipoTramite}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Resumen del Trámite */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resumen del Trámite
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tipo de trámite:</span>
                <Badge variant="outline">{solicitud.tipoTramite}</Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Documentos subidos:
                </span>
                <span className="text-sm font-medium">
                  {
                    solicitud.documentosRequeridos.filter(
                      (doc: any) => doc.subido
                    ).length
                  }{" "}
                  / {solicitud.documentosRequeridos.length}
                </span>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Costo base:</span>
                  <span className="text-sm">
                    ${(solicitud.costoTotal * 0.8).toLocaleString("es-MX")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Honorarios notariales:
                  </span>
                  <span className="text-sm">
                    ${(solicitud.costoTotal * 0.15).toLocaleString("es-MX")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Gastos de registro:
                  </span>
                  <span className="text-sm">
                    ${(solicitud.costoTotal * 0.05).toLocaleString("es-MX")}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total a pagar:</span>
                  <span className="text-blue-600">
                    ${solicitud.costoTotal.toLocaleString("es-MX")}
                  </span>
                </div>

                {solicitud.pagosRealizados > 0 && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Ya pagado:</span>
                      <span className="text-sm text-green-600">
                        ${solicitud.pagosRealizados.toLocaleString("es-MX")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Saldo pendiente:
                      </span>
                      <span className="text-sm text-red-600">
                        ${solicitud.saldoPendiente.toLocaleString("es-MX")}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Formulario de Pago */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Información de Pago
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Todos los documentos han sido validados correctamente. Procede
                  con el pago para continuar con la revisión interna.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto a pagar
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      value={montoPago}
                      onChange={(e) => handleMontoChange(e.target.value)}
                      placeholder="0"
                      min={montoMinimo}
                      max={montoMaximo}
                      className="pl-10"
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      Monto mínimo requerido:{" "}
                      <span className="font-semibold text-red-600">
                        ${montoMinimo.toLocaleString("es-MX")}
                      </span>
                    </p>
                    <p>
                      Saldo pendiente:{" "}
                      <span className="font-semibold text-blue-600">
                        ${montoMaximo.toLocaleString("es-MX")}
                      </span>
                    </p>
                    {solicitud.pagosRealizados > 0 && (
                      <p>
                        Ya pagado:{" "}
                        <span className="font-semibold text-green-600">
                          ${solicitud.pagosRealizados.toLocaleString("es-MX")}
                        </span>
                      </p>
                    )}
                  </div>

                  {montoIngresado > 0 && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Calculator className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Resumen del pago:
                        </span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monto a pagar:</span>
                          <span className="font-medium">
                            ${montoIngresado.toLocaleString("es-MX")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Saldo después del pago:
                          </span>
                          <span className="font-medium text-red-600">
                            $
                            {Math.max(
                              0,
                              montoMaximo -
                                (solicitud.pagosRealizados || 0) -
                                montoIngresado
                            ).toLocaleString("es-MX")}
                          </span>
                        </div>
                        {montoIngresado < montoMaximo && (
                          <div className="text-xs text-amber-600 mt-2">
                            ⚠️ Este es un pago parcial. Podrás realizar pagos
                            adicionales más tarde. Saldo restante: $
                            {(montoMaximo - montoIngresado).toLocaleString(
                              "es-MX"
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Método de pago
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="metodoPago"
                        value="tarjeta"
                        checked={metodoPago === "tarjeta"}
                        onChange={(e) => setMetodoPago(e.target.value)}
                        className="mr-3"
                      />
                      <CreditCard className="h-5 w-5 mr-2 text-gray-400" />
                      <span>Tarjeta de crédito/débito</span>
                    </label>

                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="metodoPago"
                        value="transferencia"
                        checked={metodoPago === "transferencia"}
                        onChange={(e) => setMetodoPago(e.target.value)}
                        className="mr-3"
                      />
                      <DollarSign className="h-5 w-5 mr-2 text-gray-400" />
                      <span>Transferencia bancaria</span>
                    </label>
                  </div>
                </div>

                {metodoPago === "tarjeta" && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de tarjeta
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fecha de vencimiento
                        </label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {metodoPago === "transferencia" && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Datos para transferencia:
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Banco:</span>
                          <span className="font-medium">BBVA Bancomer</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">CLABE:</span>
                          <span className="font-medium">
                            012180001234567890
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cuenta:</span>
                          <span className="font-medium">1234567890</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Titular:</span>
                          <span className="font-medium">
                            Notaría Pública No. 3
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={handlePago}
                disabled={
                  !metodoPago ||
                  !montoPago ||
                  montoIngresado < montoMinimo ||
                  procesando
                }
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
              >
                {procesando ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Procesando pago...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Confirmar Pago - ${montoIngresado.toLocaleString("es-MX")}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
