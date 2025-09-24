"use client";

import { useState } from "react";
import { EstatusSolicitud } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  CreditCard,
  FileText,
} from "lucide-react";

interface StatusTrackerProps {
  estatusActual: EstatusSolicitud;
  onStatusUpdate?: (nuevoEstatus: string) => void;
  solicitud?: {
    documentosRequeridos: Array<{ subido: boolean }>;
    costoTotal: number;
    pagosRealizados: number;
  };
  onPagoClick?: () => void;
}

const estatusSteps = [
  {
    key: "ARMANDO_EXPEDIENTE" as EstatusSolicitud,
    title: "Armado de Expediente",
    description: "Sube los documentos requeridos",
    icon: Circle,
  },
  {
    key: "PAGO_PENDIENTE" as EstatusSolicitud,
    title: "Pago Pendiente",
    description: "Realiza el pago para continuar",
    icon: CreditCard,
  },
  {
    key: "EN_REVISION_INTERNA" as EstatusSolicitud,
    title: "Revisión Interna",
    description: "Notaría revisa los documentos",
    icon: Clock,
  },
  {
    key: "BORRADOR_PARA_REVISION_CLIENTE" as EstatusSolicitud,
    title: "Revisión de Borrador",
    description: "Revisa y aprueba el borrador",
    icon: Circle,
  },
  {
    key: "APROBADO_PARA_FIRMA" as EstatusSolicitud,
    title: "Firma en Notaría",
    description: "Asiste a firmar el documento",
    icon: Circle,
  },
  {
    key: "LISTO_PARA_ENTREGA" as EstatusSolicitud,
    title: "Entrega de Testimonio",
    description: "Recibe el documento final",
    icon: Circle,
  },
  {
    key: "COMPLETADO" as EstatusSolicitud,
    title: "Completado",
    description: "Trámite finalizado",
    icon: CheckCircle2,
  },
];

export function StatusTracker({
  estatusActual,
  onStatusUpdate,
  solicitud,
  onPagoClick,
}: StatusTrackerProps) {
  const currentStepIndex = estatusSteps.findIndex(
    (step) => step.key === estatusActual
  );

  // Verificar si todos los documentos están subidos
  const todosDocumentosSubidos = solicitud
    ? solicitud.documentosRequeridos.every((doc) => doc.subido)
    : false;

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStepIndex) {
      return "completed";
    } else if (stepIndex === currentStepIndex) {
      return "current";
    } else {
      return "upcoming";
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-emerald-600 bg-emerald-100 border-emerald-200";
      case "current":
        return "text-blue-600 bg-blue-100 border-blue-200";
      case "upcoming":
        return "text-gray-400 bg-gray-100 border-gray-200";
      default:
        return "text-gray-400 bg-gray-100 border-gray-200";
    }
  };

  const getStepIcon = (stepIndex: number, Icon: any) => {
    const status = getStepStatus(stepIndex);

    if (status === "completed") {
      return <CheckCircle2 className="h-5 w-5" />;
    } else if (status === "current") {
      return <Clock className="h-5 w-5" />;
    } else {
      return <Icon className="h-5 w-5" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Clock className="h-6 w-6 text-emerald-600" />
          Progreso del Trámite
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Desktop version - horizontal timeline */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Línea de conexión de fondo */}
              <div className="absolute top-6 left-12 right-12 h-0.5 bg-gray-200"></div>

              {/* Contenedor de pasos */}
              <div className="flex justify-between relative z-10">
                {estatusSteps.map((step, index) => {
                  const status = getStepStatus(index);

                  return (
                    <div key={step.key} className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center bg-white ${getStepColor(
                          status
                        )}`}
                      >
                        {getStepIcon(index, step.icon)}
                      </div>
                      <div className="mt-3 text-center max-w-24">
                        <p
                          className={`text-sm font-medium ${
                            status === "upcoming"
                              ? "text-gray-400"
                              : "text-gray-900"
                          }`}
                        >
                          {step.title}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            status === "upcoming"
                              ? "text-gray-400"
                              : "text-gray-600"
                          }`}
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Líneas de progreso */}
              <div className="absolute top-6 left-12 right-12 h-0.5">
                {estatusSteps.slice(0, -1).map((_, index) => (
                  <div
                    key={index}
                    className={`absolute h-full ${
                      index < currentStepIndex
                        ? "bg-emerald-600"
                        : "bg-gray-200"
                    }`}
                    style={{
                      left: `${(index / (estatusSteps.length - 1)) * 100}%`,
                      width: `${100 / (estatusSteps.length - 1)}%`,
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile version - vertical timeline */}
          <div className="md:hidden space-y-4">
            {estatusSteps.map((step, index) => {
              const status = getStepStatus(index);

              return (
                <div key={step.key} className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${getStepColor(
                      status
                    )}`}
                  >
                    {getStepIcon(index, step.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium ${
                        status === "upcoming"
                          ? "text-gray-400"
                          : "text-gray-900"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        status === "upcoming"
                          ? "text-gray-400"
                          : "text-gray-600"
                      }`}
                    >
                      {step.description}
                    </p>
                    {status === "current" && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        En progreso
                      </Badge>
                    )}
                    {status === "completed" && (
                      <Badge
                        variant="outline"
                        className="mt-2 text-xs bg-emerald-50 text-emerald-700 border-emerald-200"
                      >
                        Completado
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Current status summary */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-blue-900">
                  Estado actual: {estatusSteps[currentStepIndex]?.title}
                </p>
                <p className="text-sm text-blue-700">
                  {estatusSteps[currentStepIndex]?.description}
                </p>
              </div>
            </div>
          </div>

          {/* CTA de pago - siempre visible pero habilitado solo cuando todos los documentos estén subidos */}
          {solicitud && solicitud.pagosRealizados === 0 && (
            <div className="pt-4 border-t">
              <div
                className={`border rounded-lg p-4 mb-4 ${
                  todosDocumentosSubidos
                    ? "bg-blue-50 border-blue-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <CreditCard
                    className={`h-5 w-5 ${
                      todosDocumentosSubidos ? "text-blue-600" : "text-gray-400"
                    }`}
                  />
                  <h3
                    className={`font-semibold ${
                      todosDocumentosSubidos ? "text-blue-900" : "text-gray-600"
                    }`}
                  >
                    Paso Siguiente: Realizar Pago
                  </h3>
                </div>
                <p
                  className={`text-sm mb-4 ${
                    todosDocumentosSubidos ? "text-blue-700" : "text-gray-500"
                  }`}
                >
                  {todosDocumentosSubidos
                    ? "Ahora que se han validado todos sus documentos, pueden proceder a pagar para continuar con la revisión."
                    : "Complete la subida de todos los documentos para habilitar el pago."}
                </p>
                <div className="flex items-center justify-between">
                  <div
                    className={`text-sm ${
                      todosDocumentosSubidos ? "text-blue-800" : "text-gray-500"
                    }`}
                  >
                    <strong>Costo total:</strong> $
                    {solicitud.costoTotal.toLocaleString("es-MX")}
                  </div>
                  <Button
                    onClick={() => {
                      if (solicitud) {
                        window.location.href = `/solicitud/${solicitud.numeroSolicitud}/pago`;
                      }
                    }}
                    disabled={!todosDocumentosSubidos}
                    className={`${
                      todosDocumentosSubidos
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Realizar Pago
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Botón para ir a recibo - solo cuando NO esté en ARMANDO_EXPEDIENTE */}
          {solicitud && estatusActual !== "ARMANDO_EXPEDIENTE" && (
            <div className="pt-4 border-t">
              <Button
                onClick={() => {
                  console.log(
                    "Navegando a recibo para solicitud:",
                    solicitud.numeroSolicitud
                  );
                  window.location.href = `/solicitud/${solicitud.numeroSolicitud}/recibo`;
                }}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <FileText className="h-4 w-4 mr-2" />
                Ver Recibo
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
