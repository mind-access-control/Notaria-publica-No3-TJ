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
