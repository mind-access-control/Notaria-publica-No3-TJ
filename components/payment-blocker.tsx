"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Wallet,
  Lock,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Calendar,
  FileText,
} from "lucide-react";

interface PaymentBlockerProps {
  saldoPendiente: number;
  costoTotal: number;
  pagosRealizados: number;
  onPagoRealizado: (monto: number) => void;
  documentosSubidos: number;
  documentosRequeridos: number;
}

export default function PaymentBlocker({
  saldoPendiente,
  costoTotal,
  pagosRealizados,
  onPagoRealizado,
  documentosSubidos,
  documentosRequeridos,
}: PaymentBlockerProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [montoPago, setMontoPago] = useState<number>(saldoPendiente);

  const handlePago = async (monto: number) => {
    setIsProcessing(true);

    // Simular procesamiento de pago
    await new Promise((resolve) => setTimeout(resolve, 2000));

    onPagoRealizado(monto);
    setIsProcessing(false);
  };

  const porcentajeCompletado = (documentosSubidos / documentosRequeridos) * 100;
  const porcentajePago = (pagosRealizados / costoTotal) * 100;

  return (
    <div className="space-y-6">
      {/* Alerta de bloqueo */}
      <Alert className="border-red-200 bg-red-50">
        <Lock className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Proceso Bloqueado:</strong> Para continuar con el trámite, es
          necesario completar el pago pendiente de $
          {saldoPendiente.toLocaleString("es-MX")}.
        </AlertDescription>
      </Alert>

      {/* Estado de progreso */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Progreso de documentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-blue-600" />
              Documentos Subidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Progreso</span>
                <span>
                  {documentosSubidos} de {documentosRequeridos}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${porcentajeCompletado}%` }}
                />
              </div>
              <div className="flex items-center gap-2">
                {documentosSubidos === documentosRequeridos ? (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Completado
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    {porcentajeCompletado.toFixed(0)}% Completado
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estado de pagos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              Estado de Pagos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Progreso</span>
                <span>
                  ${pagosRealizados.toLocaleString("es-MX")} de $
                  {costoTotal.toLocaleString("es-MX")}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${porcentajePago}%` }}
                />
              </div>
              <div className="flex items-center gap-2">
                {saldoPendiente === 0 ? (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Pagado
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    {porcentajePago.toFixed(0)}% Pagado
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalles de pago */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            Pago Pendiente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Resumen de costos */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">
                Resumen de Costos
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Costo total del trámite:
                  </span>
                  <span className="font-medium">
                    ${costoTotal.toLocaleString("es-MX")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pagos realizados:</span>
                  <span className="font-medium text-green-600">
                    ${pagosRealizados.toLocaleString("es-MX")}
                  </span>
                </div>
                <div className="border-t border-gray-300 pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span className="text-red-600">Saldo pendiente:</span>
                    <span className="text-red-600">
                      ${saldoPendiente.toLocaleString("es-MX")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Opciones de pago */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Opciones de Pago</h4>

              {/* Pago completo */}
              <div className="flex items-center justify-between p-4 border border-emerald-200 bg-emerald-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-emerald-600" />
                  <div>
                    <p className="font-medium text-gray-900">Pago Completo</p>
                    <p className="text-sm text-gray-600">
                      Pagar el saldo pendiente completo
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-emerald-600">
                    ${saldoPendiente.toLocaleString("es-MX")}
                  </p>
                  <Button
                    onClick={() => handlePago(saldoPendiente)}
                    disabled={isProcessing}
                    className="bg-emerald-600 hover:bg-emerald-700 mt-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Wallet className="h-4 w-4 mr-2" />
                        Pagar Ahora
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Pago parcial */}
              <div className="flex items-center justify-between p-4 border border-gray-200 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Pago Parcial</p>
                    <p className="text-sm text-gray-600">
                      Pagar una cantidad específica
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-600">$</span>
                    <input
                      type="number"
                      value={montoPago}
                      onChange={(e) => setMontoPago(Number(e.target.value))}
                      min="1000"
                      max={saldoPendiente}
                      step="1000"
                      className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <Button
                    onClick={() => handlePago(montoPago)}
                    disabled={
                      isProcessing ||
                      montoPago < 1000 ||
                      montoPago > saldoPendiente
                    }
                    variant="outline"
                    size="sm"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-3 h-3 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Procesando...
                      </>
                    ) : (
                      "Pagar Parcial"
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Importante:</strong> Una vez realizado el pago, podrás
                continuar con el proceso de tu trámite. El pago se procesará de
                forma segura y recibirás una confirmación por email.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
