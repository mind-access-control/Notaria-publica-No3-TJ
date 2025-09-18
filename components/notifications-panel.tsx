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
  abogadoId: string;
  isOpen: boolean;
  onToggle: () => void;
}

// Notificaciones mock para el abogado
const mockNotifications: Notification[] = [
  {
    id: "notif-001",
    tipo: "asignacion",
    titulo: "Nueva Solicitud Asignada",
    mensaje: "Se te ha asignado el expediente NT3-2025-004 para revisión.",
    fecha: "2025-01-15T17:00:00Z",
    expedienteId: "exp-004",
    leida: false,
  },
  {
    id: "notif-002",
    tipo: "documento",
    titulo: "Documentos Subidos",
    mensaje:
      "El cliente ha subido documentos faltantes para el expediente NT3-2025-001.",
    fecha: "2025-01-15T16:30:00Z",
    expedienteId: "exp-001",
    leida: false,
  },
  {
    id: "notif-003",
    tipo: "pago",
    titulo: "Pago Confirmado",
    mensaje:
      "El expediente NT3-2025-003 tiene un pago parcial confirmado por $18,000.",
    fecha: "2025-01-15T15:45:00Z",
    expedienteId: "exp-003",
    leida: true,
  },
  {
    id: "notif-004",
    tipo: "estado",
    titulo: "Expediente Listo para Firma",
    mensaje:
      "El expediente NT3-2025-004 está listo para firma. Todos los pagos han sido confirmados.",
    fecha: "2025-01-15T14:00:00Z",
    expedienteId: "exp-004",
    leida: true,
  },
];

export function NotificationsPanel({
  abogadoId,
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
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case "estado":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationColor = (tipo: string) => {
    switch (tipo) {
      case "asignacion":
        return "bg-blue-50 border-blue-200";
      case "documento":
        return "bg-yellow-50 border-yellow-200";
      case "pago":
        return "bg-green-50 border-green-200";
      case "estado":
        return "bg-emerald-50 border-emerald-200";
      default:
        return "bg-gray-50 border-gray-200";
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
    <div className="relative">
      {/* Botón de campana flotante */}
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        className="fixed top-4 right-4 z-50 bg-white shadow-lg hover:bg-gray-50"
      >
        <Bell className="h-4 w-4 mr-2" />
        {unreadCount > 0 && (
          <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {/* Panel colapsable */}
      {isOpen && (
        <div className="fixed top-16 right-4 z-40 w-80 max-h-[calc(100vh-5rem)] overflow-y-auto">
          <Card className="shadow-xl border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5 text-emerald-600" />
                  ALERTAS
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {unreadCount}
                    </Badge>
                  )}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggle}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {displayedNotifications.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No hay notificaciones</p>
                </div>
              ) : (
                <>
                  {displayedNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${getNotificationColor(
                        notification.tipo
                      )} ${
                        !notification.leida ? "ring-2 ring-emerald-200" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.tipo)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {notification.titulo}
                            </h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                dismissNotification(notification.id)
                              }
                              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">
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
                                className="text-xs h-6 px-2"
                              >
                                Marcar como leída
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {notifications.length > 3 && (
                    <div className="text-center pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAll(!showAll)}
                        className="text-xs"
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
    </div>
  );
}
