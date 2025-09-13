"use client";

import { useState } from "react";
import { Solicitud } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Plus,
} from "lucide-react";
import PaymentModal from "./payment-modal";

interface SolicitudInfoProps {
  solicitud: Solicitud;
  onSolicitudUpdate?: (solicitud: Solicitud) => void;
}

export function SolicitudInfo({
  solicitud,
  onSolicitudUpdate,
}: SolicitudInfoProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const porcentajePagado =
    (solicitud.pagosRealizados / solicitud.costoTotal) * 100;
  const tieneSaldoPendiente = solicitud.saldoPendiente > 0;

  // Función para determinar si debe mostrar el bloqueo por pago
  const debeMostrarBloqueoPago = () => {
    const documentosSubidos = solicitud.documentosRequeridos.filter(
      (doc) => doc.subido
    ).length;

    // Si no hay saldo pendiente, no hay bloqueo
    if (solicitud.saldoPendiente === 0) {
      return false;
    }

    // Si el usuario ya realizó al menos un pago, NUNCA bloquear de nuevo
    // Esto indica que ya configuró un método de pago y puede continuar
    const yaConfiguroMetodoPago = solicitud.pagosRealizados > 0;
    if (yaConfiguroMetodoPago) {
      return false; // Nunca bloquear si ya hizo un pago
    }

    // Bloquear solo si:
    // 1. Hay saldo pendiente Y
    // 2. Se han subido al menos 2 documentos Y
    // 3. NO se ha realizado ningún pago (no se ha configurado método de pago)
    const debeBloquear = solicitud.saldoPendiente > 0 && documentosSubidos >= 2;

    return debeBloquear;
  };

  const handlePagoRealizado = (monto: number) => {
    if (onSolicitudUpdate) {
      const solicitudActualizada = { ...solicitud };
      solicitudActualizada.pagosRealizados += monto;
      solicitudActualizada.saldoPendiente -= monto;
      onSolicitudUpdate(solicitudActualizada);
    }
    setShowPaymentModal(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Información de costos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              Costos del Trámite
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Costo total:</span>
              <span className="font-semibold">
                ${solicitud.costoTotal.toLocaleString("es-MX")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pagado:</span>
              <span className="font-semibold text-emerald-600">
                ${solicitud.pagosRealizados.toLocaleString("es-MX")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Saldo pendiente:</span>
              <span
                className={`font-semibold ${
                  tieneSaldoPendiente ? "text-red-600" : "text-emerald-600"
                }`}
              >
                ${solicitud.saldoPendiente.toLocaleString("es-MX")}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${porcentajePagado}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 text-center">
              {porcentajePagado.toFixed(0)}% pagado
            </div>
          </CardContent>
        </Card>

        {/* Información del notario */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-purple-600" />
              Notario Asignado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-medium text-gray-900">
              {solicitud.notario.nombre}
            </p>
            <p className="text-sm text-gray-600">{solicitud.notario.email}</p>
            <p className="text-sm text-gray-600">
              {solicitud.notario.telefono}
            </p>
            <Badge variant="outline" className="mt-2">
              Disponible para consultas
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Modal de pago */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        saldoPendiente={solicitud.saldoPendiente}
        costoTotal={solicitud.costoTotal}
        pagosRealizados={solicitud.pagosRealizados}
        onPagoRealizado={handlePagoRealizado}
        documentosSubidos={
          solicitud.documentosRequeridos.filter((doc) => doc.subido).length
        }
        documentosRequeridos={solicitud.documentosRequeridos.length}
      />
    </>
  );
}
