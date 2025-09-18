"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  DollarSign,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
  Shield,
  Clock,
} from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (paymentData: PaymentData) => void;
  expedienteData: {
    numeroSolicitud: string;
    tipoTramite: string;
    costoEstimado: number;
    documentosCompletos: number;
    documentosRequeridos: number;
  };
}

interface PaymentData {
  monto: number;
  metodo: string;
  referencia?: string;
  tipo: "parcial" | "total";
}

export function PaymentModal({
  isOpen,
  onClose,
  onPaymentSuccess,
  expedienteData,
}: PaymentModalProps) {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    monto: 0,
    metodo: "",
    tipo: "parcial",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const costoTotal = expedienteData.costoEstimado;
  const montoMinimo = Math.ceil(costoTotal * 0.3); // 30% mínimo
  const montoMaximo = costoTotal;

  const handlePayment = async () => {
    if (!paymentData.monto || !paymentData.metodo) {
      return;
    }

    if (paymentData.monto < montoMinimo) {
      alert(`El pago mínimo es de $${montoMinimo.toLocaleString()}`);
      return;
    }

    setIsProcessing(true);

    // Simular procesamiento de pago
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setShowSuccess(true);

    // Después de 2 segundos, cerrar y continuar
    setTimeout(() => {
      onPaymentSuccess(paymentData);
      onClose();
    }, 2000);
  };

  const handleMontoChange = (value: string) => {
    const monto = parseFloat(value) || 0;
    setPaymentData((prev) => ({
      ...prev,
      monto,
      tipo: monto >= costoTotal ? "total" : "parcial",
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Validación y Pre-pago
              </h2>
              <p className="text-sm text-gray-600">
                Confirma tu solicitud y realiza el pago inicial
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Resumen de la solicitud */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-600" />
                Resumen de tu Solicitud
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">
                    Número de Solicitud
                  </Label>
                  <p className="font-semibold text-gray-900">
                    {expedienteData.numeroSolicitud}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">
                    Tipo de Trámite
                  </Label>
                  <p className="font-semibold text-gray-900 capitalize">
                    {expedienteData.tipoTramite}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">
                    Documentos Completados
                  </Label>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        expedienteData.documentosCompletos ===
                        expedienteData.documentosRequeridos
                          ? "default"
                          : "secondary"
                      }
                    >
                      {expedienteData.documentosCompletos}/
                      {expedienteData.documentosRequeridos}
                    </Badge>
                    {expedienteData.documentosCompletos ===
                    expedienteData.documentosRequeridos ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">
                    Costo Total Estimado
                  </Label>
                  <p className="text-xl font-bold text-emerald-600">
                    {formatCurrency(expedienteData.costoEstimado)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de pago */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-600" />
                Información de Pago
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">
                    Política de Pagos
                  </span>
                </div>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>
                    • Pago mínimo: {formatCurrency(montoMinimo)} (30% del total)
                  </li>
                  <li>• Puedes pagar el total o un pago parcial</li>
                  <li>• El saldo restante se pagará antes de la firma</li>
                  <li>
                    • Tu solicitud se activará inmediatamente después del pago
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monto">Monto a Pagar</Label>
                  <Input
                    id="monto"
                    type="number"
                    placeholder="0.00"
                    value={paymentData.monto || ""}
                    onChange={(e) => handleMontoChange(e.target.value)}
                    min={montoMinimo}
                    max={montoMaximo}
                    step="0.01"
                  />
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMontoChange(montoMinimo.toString())}
                    >
                      Mínimo ({formatCurrency(montoMinimo)})
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMontoChange(costoTotal.toString())}
                    >
                      Total ({formatCurrency(costoTotal)})
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="metodo">Método de Pago</Label>
                  <Select
                    value={paymentData.metodo}
                    onValueChange={(value) =>
                      setPaymentData((prev) => ({ ...prev, metodo: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transferencia">
                        Transferencia Bancaria
                      </SelectItem>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                      <SelectItem value="tarjeta">
                        Tarjeta de Débito/Crédito
                      </SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {paymentData.metodo === "transferencia" && (
                <div>
                  <Label htmlFor="referencia">Número de Referencia</Label>
                  <Input
                    id="referencia"
                    placeholder="Ingresa el número de referencia"
                    value={paymentData.referencia || ""}
                    onChange={(e) =>
                      setPaymentData((prev) => ({
                        ...prev,
                        referencia: e.target.value,
                      }))
                    }
                  />
                </div>
              )}

              {/* Resumen del pago */}
              {paymentData.monto > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Resumen del Pago</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Monto a pagar:</span>
                      <span className="font-semibold">
                        {formatCurrency(paymentData.monto)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tipo de pago:</span>
                      <Badge
                        variant={
                          paymentData.tipo === "total" ? "default" : "secondary"
                        }
                      >
                        {paymentData.tipo === "total"
                          ? "Pago Total"
                          : "Pago Parcial"}
                      </Badge>
                    </div>
                    {paymentData.tipo === "parcial" && (
                      <div className="flex justify-between">
                        <span>Saldo pendiente:</span>
                        <span className="font-semibold text-orange-600">
                          {formatCurrency(costoTotal - paymentData.monto)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alertas */}
          {paymentData.monto > 0 && paymentData.monto < montoMinimo && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                El pago mínimo requerido es de {formatCurrency(montoMinimo)}{" "}
                para activar tu solicitud.
              </AlertDescription>
            </Alert>
          )}

          {paymentData.monto > 0 && paymentData.metodo && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>¡Perfecto!</strong> Tu solicitud será activada
                inmediatamente después del pago.
                {paymentData.tipo === "parcial" &&
                  " El saldo restante se pagará antes de la firma del documento."}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancelar
          </Button>
          <Button
            onClick={handlePayment}
            disabled={
              !paymentData.monto ||
              !paymentData.metodo ||
              paymentData.monto < montoMinimo ||
              isProcessing
            }
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <DollarSign className="h-4 w-4 mr-2" />
                Confirmar Pago
              </>
            )}
          </Button>
        </div>

        {/* Modal de éxito */}
        {showSuccess && (
          <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ¡Pago Confirmado!
              </h3>
              <p className="text-gray-600">
                Tu solicitud ha sido activada exitosamente.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
