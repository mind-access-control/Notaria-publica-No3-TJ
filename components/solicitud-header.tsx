"use client";

import { Solicitud } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, User, Phone, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface SolicitudHeaderProps {
  solicitud: Solicitud;
  userRole?: string;
}

export function SolicitudHeader({ solicitud, userRole }: SolicitudHeaderProps) {
  // Determinar la URL de retorno según el rol del usuario
  const getBackUrl = () => {
    switch (userRole) {
      case "admin":
        return "/admin";
      case "licenciado":
      case "notario":
        return "/licenciado";
      case "cliente":
      default:
        return "/mi-cuenta";
    }
  };

  const getBackText = () => {
    switch (userRole) {
      case "admin":
        return "Volver al Admin";
      case "licenciado":
      case "notario":
        return "Volver al Panel";
      case "cliente":
      default:
        return "Volver a Mi Cuenta";
    }
  };
  const getStatusColor = (estatus: string) => {
    switch (estatus) {
      case "ARMANDO_EXPEDIENTE":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "EN_REVISION_INTERNA":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "BORRADOR_PARA_REVISION_CLIENTE":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "APROBADO_PARA_FIRMA":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "LISTO_PARA_ENTREGA":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "COMPLETADO":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (estatus: string) => {
    return estatus
      .replace(/_/g, " ")
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href={getBackUrl()}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {getBackText()}
              </Button>
            </Link>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl text-gray-900">
                {solicitud.numeroSolicitud}
              </CardTitle>
              <p className="text-gray-600 mt-1">{solicitud.tipoTramite}</p>
            </div>
          </div>
          <Badge
            className={`px-4 py-2 text-sm font-medium ${getStatusColor(
              solicitud.estatusActual
            )}`}
          >
            {getStatusText(solicitud.estatusActual)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <User className="h-4 w-4" />
                Información del Cliente
              </h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <strong>Nombre:</strong> {solicitud.cliente.nombre}
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  {solicitud.cliente.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  {solicitud.cliente.telefono}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Información del Trámite
              </h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <strong>Creado:</strong>{" "}
                  {new Date(solicitud.fechaCreacion).toLocaleDateString(
                    "es-MX"
                  )}
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <strong>Última actualización:</strong>{" "}
                  {new Date(
                    solicitud.fechaUltimaActualizacion
                  ).toLocaleDateString("es-MX")}
                </p>
                <p>
                  <strong>Notario asignado:</strong> {solicitud.notario.nombre}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
