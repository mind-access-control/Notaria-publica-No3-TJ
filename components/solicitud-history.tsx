"use client";

import { Solicitud } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, FileText, User, MessageSquare } from "lucide-react";

interface SolicitudHistoryProps {
  solicitud: Solicitud;
}

export function SolicitudHistory({ solicitud }: SolicitudHistoryProps) {
  const getStatusIcon = (estatus: string) => {
    const statusLower = estatus.toLowerCase();
    
    if (statusLower.includes('creada') || statusLower.includes('iniciada')) {
      return <FileText className="h-4 w-4 text-blue-600" />;
    } else if (statusLower.includes('completado') || statusLower.includes('finalizado')) {
      return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
    } else if (statusLower.includes('revisión') || statusLower.includes('revision')) {
      return <Clock className="h-4 w-4 text-yellow-600" />;
    } else if (statusLower.includes('aprobado') || statusLower.includes('firma')) {
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    } else {
      return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (estatus: string) => {
    const statusLower = estatus.toLowerCase();
    
    if (statusLower.includes('creada') || statusLower.includes('iniciada')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    } else if (statusLower.includes('completado') || statusLower.includes('finalizado')) {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    } else if (statusLower.includes('revisión') || statusLower.includes('revision')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else if (statusLower.includes('aprobado') || statusLower.includes('firma')) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else {
      return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  // Ordenar historial por fecha (más reciente primero)
  const sortedHistorial = [...solicitud.historial].sort((a, b) => 
    new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Clock className="h-6 w-6 text-emerald-600" />
          Historial de la Solicitud
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedHistorial.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No hay historial disponible</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedHistorial.map((entry, index) => {
                const { date, time } = formatDate(entry.fecha);
                const isLast = index === sortedHistorial.length - 1;
                
                return (
                  <div key={index} className="relative">
                    {/* Línea conectora */}
                    {!isLast && (
                      <div className="absolute left-4 top-8 w-0.5 h-8 bg-gray-200"></div>
                    )}
                    
                    <div className="flex items-start gap-4">
                      {/* Icono del estatus */}
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${getStatusColor(entry.estatus)}`}>
                        {getStatusIcon(entry.estatus)}
                      </div>
                      
                      {/* Contenido del historial */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{entry.estatus}</h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getStatusColor(entry.estatus)}`}
                          >
                            {entry.estatus}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            <span>{date} a las {time}</span>
                          </div>
                        </div>
                        
                        {entry.descripcion && (
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border">
                            {entry.descripcion}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Información adicional del historial */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Solicitud creada el {formatDate(solicitud.fechaCreacion).date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Última actualización: {formatDate(solicitud.fechaUltimaActualizacion).date}</span>
            </div>
          </div>
        </div>

        {/* Nota informativa */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">¿Necesitas ayuda?</p>
              <p>
                Si tienes alguna pregunta sobre el progreso de tu trámite, 
                puedes contactar a tu notario asignado: <strong>{solicitud.notario.nombre}</strong>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
