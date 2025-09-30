"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { formatPesoMexicano } from "@/lib/formatters";
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
  Building2,
} from "lucide-react";
import { solicitudes } from "@/lib/mock-data";

export default function ReciboPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const numeroSolicitud = params.numeroSolicitud as string;
  const [solicitud, setSolicitud] = useState<any>(null);

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

  // Función para obtener el correo del usuario
  const obtenerEmailUsuario = () => {
    // Prioridad 1: Usuario autenticado
    if (user?.email) {
      return user.email;
    }

    // Prioridad 2: Datos de la solicitud
    if (solicitud?.cliente?.email) {
      return solicitud.cliente.email;
    }

    // Prioridad 3: Email por defecto
    return "jon@jon.com";
  };

  useEffect(() => {
    console.log("Usuario autenticado en recibo:", user);
    console.log("Email del usuario:", user?.email);
    const solicitudEncontrada = solicitudes.find(
      (s) => s.numeroSolicitud === numeroSolicitud
    );
    if (solicitudEncontrada) {
      setSolicitud(solicitudEncontrada);
    }
  }, [numeroSolicitud, user]);

  const handleImprimir = () => {
    window.print();
  };

  const handleDescargar = () => {
    // Simular descarga del recibo
    const element = document.createElement("a");
    const file = new Blob([`RECIBO DE PAGO - ${numeroSolicitud}`], {
      type: "text/plain",
    });
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
            <h1 className="text-3xl font-bold text-gray-900">Recibo de Pago</h1>
          </div>
          <p className="text-gray-600">
            Solicitud #{solicitud.numeroSolicitud} - Compraventa de inmuebles
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
              <p className="text-gray-600">
                Av. Revolución 1234, Zona Centro, Tijuana, BC
              </p>
              <p className="text-gray-600">
                Tel: (664) 123-4567 | Email: info@notaria3.com
              </p>
            </div>

            <Separator className="mb-6" />

            {/* Información del recibo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Información del Recibo
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Número de recibo:</span>
                    <span className="font-medium">RCP-{numeroSolicitud}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha de pago:</span>
                    <span className="font-medium">
                      {new Date().toLocaleDateString("es-MX")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hora de pago:</span>
                    <span className="font-medium">
                      {new Date().toLocaleTimeString("es-MX")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Método de pago:</span>
                    <span className="font-medium">Transferencia Bancaria</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Información del Cliente
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nombre:</span>
                    <span className="font-medium">
                      {user?.nombre || "HERNANDEZ GONZALEZ JONATHAN RUBEN"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{obtenerEmailUsuario()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Teléfono:</span>
                    <span className="font-medium">
                      {user?.telefono || "+52 664 123 4567"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Detalles del trámite */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Detalles del Trámite
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo de trámite:</span>
                  <span className="font-medium">Compraventa de inmuebles</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Número de solicitud:</span>
                  <span className="font-medium">
                    {solicitud.numeroSolicitud}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado actual:</span>
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-600"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Pagado
                  </Badge>
                </div>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Desglose de costos */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Desglose de Costos
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ISAI:</span>
                  <span className="font-medium">
                    {formatPesoMexicano(costosCalculados.isai.total)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Honorarios notariales:</span>
                  <span className="font-medium">
                    {formatPesoMexicano(costosCalculados.honorarios.total)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Gastos de registro (RPPC):
                  </span>
                  <span className="font-medium">
                    {formatPesoMexicano(costosCalculados.rppc.total)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total pagado:</span>
                  <span className="text-green-600">
                    {formatPesoMexicano(costosCalculados.total)}
                  </span>
                </div>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Información adicional */}
            <div className="text-center text-sm text-gray-600 mb-6">
              <p className="mb-2">
                <strong>¡Pago confirmado!</strong> Tu trámite ha sido enviado a
                revisión interna.
              </p>
              <p>
                Este recibo es válido como comprobante de pago. Guarda una copia
                para tus registros.
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
            <h3 className="font-semibold text-gray-900 mb-4">
              ¿Necesitas ayuda?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-2">
                  Para consultas sobre este recibo:
                </p>
                <p className="font-medium">Tel: (664) 123-4567</p>
                <p className="font-medium">Email: info@notaria3.com</p>
              </div>
              <div>
                <p className="text-gray-600 mb-2">Horario de atención:</p>
                <p className="font-medium">
                  Lunes a Viernes: 9:00 AM - 6:00 PM
                </p>
                <p className="font-medium">Sábados: 9:00 AM - 2:00 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
