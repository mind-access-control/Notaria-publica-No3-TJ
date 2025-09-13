"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Mail,
  Phone,
} from "lucide-react";
import {
  CitaDisponible,
  getCitasDisponibles,
  agendarCita,
} from "@/lib/user-notifications-data";

interface CitaSchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  solicitudId: string;
  userId: string;
  onCitaAgendada: () => void;
}

export default function CitaSchedulingModal({
  isOpen,
  onClose,
  solicitudId,
  userId,
  onCitaAgendada,
}: CitaSchedulingModalProps) {
  const [citasDisponibles, setCitasDisponibles] = useState<CitaDisponible[]>(
    []
  );
  const [citaSeleccionada, setCitaSeleccionada] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [agendando, setAgendando] = useState(false);
  const [mostrarMasOpciones, setMostrarMasOpciones] = useState(false);
  const [offsetCitas, setOffsetCitas] = useState(0);

  // Cargar citas disponibles cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      cargarCitasDisponibles();
    }
  }, [isOpen]);

  // Recargar citas cuando cambie el offset
  useEffect(() => {
    if (isOpen) {
      cargarCitasDisponibles();
    }
  }, [offsetCitas]);

  const cargarCitasDisponibles = () => {
    setCargando(true);
    setTimeout(() => {
      const citas = getCitasDisponibles(undefined, 3, offsetCitas);
      setCitasDisponibles(citas);
      setCargando(false);
    }, 500);
  };

  const handleAgendarCita = async () => {
    if (!citaSeleccionada) return;

    setAgendando(true);
    try {
      const exito = await agendarCita(citaSeleccionada, userId, solicitudId);
      if (exito) {
        onCitaAgendada();
        onClose();
      }
    } catch (error) {
      console.error("Error agendando cita:", error);
    } finally {
      setAgendando(false);
    }
  };

  const formatFechaCita = (fecha: string) => {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatHoraCita = (hora: string) => {
    const [horas, minutos] = hora.split(":");
    return `${horas}:${minutos}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-emerald-800">
            <Calendar className="h-6 w-6" />
            Agendar Cita para Firma
          </DialogTitle>
          <DialogDescription>
            Tu documento está listo para firma. Selecciona una de las citas
            disponibles para completar el proceso.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información importante */}
          <Alert className="border-emerald-200 bg-emerald-50">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-emerald-800">
              <strong>¡Excelente!</strong> Tu documento está listo para firma.
              Selecciona una cita que se ajuste a tu horario. La cita durará
              aproximadamente 60 minutos.
            </AlertDescription>
          </Alert>

          {/* Citas disponibles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Citas Disponibles
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setOffsetCitas((prev) => prev + 1);
                  setCitaSeleccionada(null); // Limpiar selección
                  cargarCitasDisponibles();
                }}
                disabled={cargando}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${cargando ? "animate-spin" : ""}`}
                />
                Cargar Más Opciones
              </Button>
            </div>

            {cargando ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando citas disponibles...</p>
              </div>
            ) : citasDisponibles.length === 0 ? (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  No hay citas disponibles en este momento. Intenta cargar más
                  opciones o contacta a la notaría.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                {citasDisponibles.map((cita) => (
                  <div
                    key={cita.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      citaSeleccionada === cita.id
                        ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200"
                        : "border-gray-200 hover:border-emerald-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setCitaSeleccionada(cita.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="font-medium text-gray-900">
                              {formatFechaCita(cita.fecha)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-700">
                              {formatHoraCita(cita.hora)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-700">
                              {cita.sala}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          Duración: {cita.duracion} minutos
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className="text-emerald-600 border-emerald-300"
                        >
                          Disponible
                        </Badge>
                        {citaSeleccionada === cita.id && (
                          <CheckCircle className="h-5 w-5 text-emerald-600" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Información de contacto */}
          <Alert>
            <Phone className="h-4 w-4" />
            <AlertDescription>
              <strong>¿Necesitas ayuda?</strong> Si tienes alguna pregunta o
              necesitas cambiar tu cita, puedes contactarnos al (664) 123-4567 o
              enviarnos un correo a citas@notariatijuana.com
            </AlertDescription>
          </Alert>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleAgendarCita}
              disabled={!citaSeleccionada || agendando}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {agendando ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Agendando...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar Cita
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
