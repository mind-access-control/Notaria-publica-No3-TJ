"use client";

import { EstatusSolicitud } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Clock, ArrowRight } from "lucide-react";

interface StatusTrackerProps {
  estatusActual: EstatusSolicitud;
  onStatusUpdate?: (nuevoEstatus: string) => void;
}

const estatusSteps = [
  {
    key: "ARMANDO_EXPEDIENTE" as EstatusSolicitud,
    title: "Armado de Expediente",
    description: "Sube los documentos requeridos",
    icon: Circle,
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
}: StatusTrackerProps) {
  const currentStepIndex = estatusSteps.findIndex(
    (step) => step.key === estatusActual
  );

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
        return "text-blue-600 bg-blue-100 border-blue-200";
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
          <Clock className="h-6 w-6 text-blue-600" />
          Progreso del Trámite
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Desktop version - horizontal timeline */}
          <div className="hidden md:block">
            <div className="flex items-center justify-between">
              {estatusSteps.map((step, index) => {
                const status = getStepStatus(index);
                const isLast = index === estatusSteps.length - 1;

                return (
                  <div key={step.key} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${getStepColor(
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
                    {!isLast && (
                      <div className="flex-1 mx-4">
                        <div
                          className={`h-0.5 w-full ${
                            index < currentStepIndex
                              ? "bg-blue-600"
                              : "bg-gray-200"
                          }`}
                        ></div>
                      </div>
                    )}
                  </div>
                );
              })}
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
                        className="mt-2 text-xs bg-blue-50 text-blue-700 border-blue-200"
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

          {/* Botón para avanzar de estatus */}
          {onStatusUpdate && currentStepIndex < estatusSteps.length - 1 && (
            <div className="pt-4 border-t">
              <Button
                onClick={() => {
                  const nextStep = estatusSteps[currentStepIndex + 1];
                  if (nextStep) {
                    onStatusUpdate(nextStep.key);
                  }
                }}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Avanzar a {estatusSteps[currentStepIndex + 1]?.title}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
