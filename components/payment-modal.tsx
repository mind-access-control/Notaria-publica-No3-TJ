"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CreditCard,
  Wallet,
  Lock,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Calendar,
  FileText,
  X,
  Building2,
  Smartphone,
  Banknote,
  Calculator,
} from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  saldoPendiente: number;
  costoTotal: number;
  pagosRealizados: number;
  onPagoRealizado: (monto: number) => void;
  documentosSubidos: number;
  documentosRequeridos: number;
}

export default function PaymentModal({
  isOpen,
  onClose,
  saldoPendiente,
  costoTotal,
  pagosRealizados,
  onPagoRealizado,
  documentosSubidos,
  documentosRequeridos,
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [montoPago, setMontoPago] = useState<number>(saldoPendiente);
  const [metodoPago, setMetodoPago] = useState<string>("tarjeta");
  const [montoPersonalizado, setMontoPersonalizado] = useState<string>("");

  const handlePago = async (monto: number) => {
    setIsProcessing(true);

    // Simular procesamiento de pago
    await new Promise((resolve) => setTimeout(resolve, 2000));

    onPagoRealizado(monto);
    setIsProcessing(false);
    onClose();
  };

  const porcentajeCompletado = (documentosSubidos / documentosRequeridos) * 100;
  const porcentajePago = (pagosRealizados / costoTotal) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-800">
            <Lock className="h-6 w-6" />
            ¡Proceso Bloqueado por Falta de Pago!
          </DialogTitle>
          <DialogDescription>
            <strong>Te hemos bloqueado el proceso</strong> porque has subido{" "}
            {documentosSubidos} documentos pero aún tienes un saldo pendiente de{" "}
            <strong>${saldoPendiente.toLocaleString("es-MX")}</strong>. Para
            continuar subiendo documentos, debes realizar un pago.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Alerta de bloqueo */}
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>¡Atención!</strong> Has subido {documentosSubidos} de{" "}
              {documentosRequeridos} documentos, pero el proceso está bloqueado
              porque tienes un saldo pendiente de{" "}
              <strong>${saldoPendiente.toLocaleString("es-MX")}</strong>. Para
              continuar subiendo documentos, realiza un pago ahora.
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
                <div className="space-y-6">
                  <h4 className="font-medium text-gray-900">
                    Opciones de Pago
                  </h4>

                  {/* Monto a pagar */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Monto a Pagar</Label>
                    <RadioGroup
                      value={montoPago.toString()}
                      onValueChange={(value) => setMontoPago(Number(value))}
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem
                            value={saldoPendiente.toString()}
                            id="completo"
                          />
                          <Label
                            htmlFor="completo"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Pago Completo</span>
                              <span className="text-emerald-600 font-semibold">
                                ${saldoPendiente.toLocaleString("es-MX")}
                              </span>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="0" id="parcial" />
                          <Label
                            htmlFor="parcial"
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Pago Parcial</span>
                              <span className="text-gray-600">
                                Personalizado
                              </span>
                            </div>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>

                    {montoPago === 0 && (
                      <div className="space-y-2">
                        <Label htmlFor="monto-personalizado">
                          Monto Personalizado
                        </Label>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">$</span>
                          <Input
                            id="monto-personalizado"
                            type="number"
                            value={montoPersonalizado}
                            onChange={(e) =>
                              setMontoPersonalizado(e.target.value)
                            }
                            placeholder="Ingresa el monto"
                            min="1000"
                            max={saldoPendiente}
                            step="1000"
                            className="w-32"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const monto = Number(montoPersonalizado);
                              if (monto >= 1000 && monto <= saldoPendiente) {
                                setMontoPago(monto);
                              }
                            }}
                          >
                            <Calculator className="h-4 w-4 mr-1" />
                            Aplicar
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500">
                          Mínimo: $1,000 | Máximo: $
                          {saldoPendiente.toLocaleString("es-MX")}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Métodos de pago */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Método de Pago
                    </Label>
                    <RadioGroup
                      value={metodoPago}
                      onValueChange={setMetodoPago}
                    >
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="tarjeta" id="tarjeta" />
                          <CreditCard className="h-5 w-5 text-blue-600" />
                          <div className="flex-1">
                            <Label htmlFor="tarjeta" className="cursor-pointer">
                              <div className="font-medium">
                                Tarjeta de Crédito/Débito
                              </div>
                              <div className="text-sm text-gray-600">
                                Visa, Mastercard, American Express
                              </div>
                            </Label>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem
                            value="transferencia"
                            id="transferencia"
                          />
                          <Building2 className="h-5 w-5 text-green-600" />
                          <div className="flex-1">
                            <Label
                              htmlFor="transferencia"
                              className="cursor-pointer"
                            >
                              <div className="font-medium">
                                Transferencia Bancaria
                              </div>
                              <div className="text-sm text-gray-600">
                                BBVA, Santander, Banorte, etc.
                              </div>
                            </Label>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="efectivo" id="efectivo" />
                          <Banknote className="h-5 w-5 text-yellow-600" />
                          <div className="flex-1">
                            <Label
                              htmlFor="efectivo"
                              className="cursor-pointer"
                            >
                              <div className="font-medium">
                                Pago en Efectivo
                              </div>
                              <div className="text-sm text-gray-600">
                                En caja de la notaría
                              </div>
                            </Label>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="deposito" id="deposito" />
                          <Smartphone className="h-5 w-5 text-purple-600" />
                          <div className="flex-1">
                            <Label
                              htmlFor="deposito"
                              className="cursor-pointer"
                            >
                              <div className="font-medium">
                                Depósito en OXXO/7-Eleven
                              </div>
                              <div className="text-sm text-gray-600">
                                Pago en tiendas de conveniencia
                              </div>
                            </Label>
                          </div>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Botón de pago */}
                  <div className="pt-4 border-t">
                    <Button
                      onClick={() => {
                        const monto =
                          montoPago === 0
                            ? Number(montoPersonalizado)
                            : montoPago;
                        if (monto >= 1000 && monto <= saldoPendiente) {
                          handlePago(monto);
                        }
                      }}
                      disabled={
                        isProcessing ||
                        (montoPago === 0 &&
                          (Number(montoPersonalizado) < 1000 ||
                            Number(montoPersonalizado) > saldoPendiente)) ||
                        (montoPago > 0 && montoPago > saldoPendiente)
                      }
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      size="lg"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Procesando Pago...
                        </>
                      ) : (
                        <>
                          <Wallet className="h-5 w-5 mr-2" />
                          Pagar $
                          {(montoPago === 0
                            ? Number(montoPersonalizado) || 0
                            : montoPago
                          ).toLocaleString("es-MX")}
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Información adicional */}
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Importante:</strong> Una vez realizado el pago,
                    podrás continuar con el proceso de tu trámite. El pago se
                    procesará de forma segura y recibirás una confirmación por
                    email.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
