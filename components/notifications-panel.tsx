"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  FileText,
} from "lucide-react";

interface Notification {
  id: string;
  tipo: "asignacion" | "documento" | "pago" | "estado";
  titulo: string;
  mensaje: string;
  fecha: string;
  expedienteId?: string;
  leida: boolean;
}

interface NotificationsPanelProps {
  licenciadoId: string;
  isOpen: boolean;
  onToggle: () => void;
}

// Notificaciones mock para el licenciado
const mockNotifications: Notification[] = [
  {
    id: "notif-000",
    tipo: "asignacion",
    titulo: "Nuevo Expediente Asignado",
    mensaje: "NT3-2025-001 asignado para revisión - Compraventa casa.",
    fecha: "2025-01-15T18:30:00Z",
    expedienteId: "exp-001",
    leida: false,
  },
  {
    id: "notif-001",
    tipo: "asignacion",
    titulo: "Nueva Solicitud Asignada",
    mensaje: "Expediente NT3-2025-004 asignado para revisión.",
    fecha: "2025-01-15T17:00:00Z",
    expedienteId: "exp-004",
    leida: false,
  },
  {
    id: "notif-002",
    tipo: "documento",
    titulo: "Documentos Subidos",
    mensaje: "Documentos faltantes subidos para NT3-2025-001.",
    fecha: "2025-01-15T16:30:00Z",
    expedienteId: "exp-001",
    leida: false,
  },
  {
    id: "notif-003",
    tipo: "pago",
    titulo: "Pago Confirmado",
    mensaje: "Pago parcial de $18,000 confirmado en NT3-2025-003.",
    fecha: "2025-01-15T15:45:00Z",
    expedienteId: "exp-003",
    leida: true,
  },
  {
    id: "notif-004",
    tipo: "estado",
    titulo: "Expediente Listo para Firma",
    mensaje: "NT3-2025-004 listo para firma. Pagos confirmados.",
    fecha: "2025-01-15T14:00:00Z",
    expedienteId: "exp-004",
    leida: true,
  },
  {
    id: "notif-005",
    tipo: "documento",
    titulo: "Cita Aceptada",
    mensaje: "Cita de firma aceptada para NT3-2025-001 - lunes 28 oct 11:00 AM.",
    fecha: "2025-01-15T18:00:00Z",
    expedienteId: "exp-001",
    leida: false,
  },
];

export function NotificationsPanel({
  licenciadoId,
  isOpen,
  onToggle,
}: NotificationsPanelProps) {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [showAll, setShowAll] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getNotificationIcon = (tipo: string) => {
    switch (tipo) {
      case "asignacion":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "documento":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "pago":
        return <DollarSign className="h-4 w-4 text-blue-500" />;
      case "estado":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationColor = (tipo: string) => {
    switch (tipo) {
      case "asignacion":
        return "bg-gradient-to-r from-slate-50 via-blue-50 to-slate-100 border-slate-300";
      case "documento":
        return "bg-gradient-to-r from-slate-50 via-amber-50 to-slate-100 border-slate-300";
      case "pago":
        return "bg-gradient-to-r from-slate-50 via-blue-50 to-slate-100 border-slate-300";
      case "estado":
        return "bg-gradient-to-r from-slate-50 via-blue-50 to-slate-100 border-slate-300";
      default:
        return "bg-gradient-to-r from-slate-50 to-slate-100 border-slate-300";
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, leida: true } : notif
      )
    );
  };

  const dismissNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((notif) => notif.id !== notificationId)
    );
  };

  const unreadCount = notifications.filter((n) => !n.leida).length;
  const displayedNotifications = showAll
    ? notifications
    : notifications.slice(0, 3);

  return (
    <>
      {/* Overlay invisible para cerrar al hacer click fuera */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={onToggle}
        />
      )}
      
      {/* Panel colapsable */}
      {isOpen && (
        <div 
          className="fixed top-20 right-4 z-50 w-96 max-h-[500px] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="shadow-xl border-2 bg-gradient-to-br from-white via-slate-50 to-blue-50 border-slate-200">
            <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 via-blue-50 to-slate-100 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2 text-blue-900">
                  <Bell className="h-4 w-4 text-blue-600" />
                  ALERTAS
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="ml-2 text-xs h-5">
                      {unreadCount}
                    </Badge>
                  )}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggle}
                  className="h-5 w-5 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 p-3">
              {displayedNotifications.length === 0 ? (
                <div className="text-center py-3 text-gray-500">
                  <Bell className="h-6 w-6 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No hay notificaciones</p>
                </div>
              ) : (
                <>
                  {displayedNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-2 rounded-md border ${getNotificationColor(
                        notification.tipo
                      )} ${
                        !notification.leida ? "ring-1 ring-blue-200" : ""
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.tipo)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-xs font-medium text-gray-900 truncate">
                              {notification.titulo}
                            </h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                dismissNotification(notification.id)
                              }
                              className="h-5 w-5 p-0 text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-600 mb-1 line-clamp-2">
                            {notification.mensaje}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {formatDate(notification.fecha)}
                            </span>
                            {!notification.leida && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs h-5 px-2"
                              >
                                Leída
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {notifications.length > 3 && (
                    <div className="text-center pt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAll(!showAll)}
                        className="text-xs h-6 px-2"
                      >
                        {showAll ? "Ver menos" : "Ver todas"}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
