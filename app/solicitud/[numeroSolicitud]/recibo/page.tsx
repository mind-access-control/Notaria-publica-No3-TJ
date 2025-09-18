"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  ArrowLeft, 
  Download,
  CheckCircle,
  Calendar,
  CreditCard,
  Building2
} from "lucide-react";
import { solicitudes } from "@/lib/mock-data";

export default function ReciboPage() {
  const params = useParams();
  const router = useRouter();
  const numeroSolicitud = params.numeroSolicitud as string;
  const [solicitud, setSolicitud] = useState<any>(null);

  useEffect(() => {
    const solicitudEncontrada = solicitudes.find(
      (s) => s.numeroSolicitud === numeroSolicitud
    );
    if (solicitudEncontrada) {
      setSolicitud(solicitudEncontrada);
    }
  }, [numeroSolicitud]);

  const handleImprimir = () => {
    window.print();
  };

  const handleDescargar = () => {
    // Simular descarga del recibo
    const element = document.createElement('a');
    const file = new Blob([`RECIBO DE PAGO - ${numeroSolicitud}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `recibo-${numeroSolicitud}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
            <FileText className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Recibo de Pago
            </h1>
          </div>
          <p className="text-gray-600">
            Solicitud #{solicitud.numeroSolicitud} - {solicitud.tipoTramite}
          </p>
        </div>

        {/* Recibo */}
        <Card className="bg-white shadow-lg">
          <CardContent className="p-8">
            {/* Header del recibo */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Building2 className="h-8 w-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Notaría Pública No. 3
                </h2>
              </div>
              <p className="text-gray-600">Av. Revolución 1234, Zona Centro, Tijuana, BC</p>
              <p className="text-gray-600">Tel: (664) 123-4567 | Email: info@notaria3.com</p>
            </div>

            <Separator className="mb-6" />

            {/* Información del recibo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Información del Recibo</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Número de recibo:</span>
                    <span className="font-medium">RCP-{numeroSolicitud}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha de pago:</span>
                    <span className="font-medium">{new Date().toLocaleDateString("es-MX")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hora de pago:</span>
                    <span className="font-medium">{new Date().toLocaleTimeString("es-MX")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Método de pago:</span>
                    <span className="font-medium">Transferencia Bancaria</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Información del Cliente</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nombre:</span>
                    <span className="font-medium">{solicitud.cliente.nombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{solicitud.cliente.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Teléfono:</span>
                    <span className="font-medium">{solicitud.cliente.telefono}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Detalles del trámite */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Detalles del Trámite</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo de trámite:</span>
                  <span className="font-medium">{solicitud.tipoTramite}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Número de solicitud:</span>
                  <span className="font-medium">{solicitud.numeroSolicitud}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado actual:</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Pagado
                  </Badge>
                </div>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Desglose de costos */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Desglose de Costos</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Costo base del trámite:</span>
                  <span className="font-medium">${(solicitud.costoTotal * 0.8).toLocaleString("es-MX")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Honorarios notariales:</span>
                  <span className="font-medium">${(solicitud.costoTotal * 0.15).toLocaleString("es-MX")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Gastos de registro:</span>
                  <span className="font-medium">${(solicitud.costoTotal * 0.05).toLocaleString("es-MX")}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total pagado:</span>
                  <span className="text-green-600">${solicitud.costoTotal.toLocaleString("es-MX")}</span>
                </div>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Información adicional */}
            <div className="text-center text-sm text-gray-600 mb-6">
              <p className="mb-2">
                <strong>¡Pago confirmado!</strong> Tu trámite ha sido enviado a revisión interna.
              </p>
              <p>
                Este recibo es válido como comprobante de pago. 
                Guarda una copia para tus registros.
              </p>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleImprimir}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <FileText className="h-4 w-4 mr-2" />
                Imprimir Recibo
              </Button>
              <Button
                onClick={handleDescargar}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Información de contacto */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">¿Necesitas ayuda?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-2">Para consultas sobre este recibo:</p>
                <p className="font-medium">Tel: (664) 123-4567</p>
                <p className="font-medium">Email: info@notaria3.com</p>
              </div>
              <div>
                <p className="text-gray-600 mb-2">Horario de atención:</p>
                <p className="font-medium">Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                <p className="font-medium">Sábados: 9:00 AM - 2:00 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
