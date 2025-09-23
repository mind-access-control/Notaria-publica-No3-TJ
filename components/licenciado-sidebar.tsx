"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  BarChart3,
  Settings,
  FileText,
  Users,
  Calendar,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  BookOpen,
  Archive,
  HelpCircle,
  User,
} from "lucide-react";

interface LicenciadoSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  user: {
    nombre: string;
    role: string;
  };
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  {
    id: "expedientes",
    label: "Expedientes",
    icon: Activity,
    description: "Gestión de expedientes",
  },
  {
    id: "documentacion",
    label: "Post firma",
    icon: FileText,
    description: "Post firma y archivos",
  },
  {
    id: "clientes",
    label: "Clientes",
    icon: Users,
    description: "Gestión de clientes",
  },
  {
    id: "citas",
    label: "Citas",
    icon: Calendar,
    description: "Agenda y citas",
  },
  {
    id: "reportes",
    label: "Reportes",
    icon: BarChart3,
    description: "Análisis y estadísticas",
  },
  {
    id: "configuracion",
    label: "Configuración",
    icon: Settings,
    description: "Perfil y preferencias",
  },
];

const bottomMenuItems = [
  {
    id: "archivo",
    label: "Archivo",
    icon: Archive,
    description: "Expedientes archivados",
  },
];

export function LicenciadoSidebar({
  activeTab,
  onTabChange,
  onLogout,
  user,
  isCollapsed,
  onToggleCollapse,
}: LicenciadoSidebarProps) {
  return (
    <div
      className={`bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 text-white shadow-2xl transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } h-screen fixed left-0 top-0 z-40 overflow-y-auto`}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Notaría #3</h2>
                <p className="text-xs text-blue-200">Sistema Legal</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="text-white hover:bg-white/10 p-2"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user.nombre}</p>
              <Badge className="bg-blue-500/20 text-blue-200 border-blue-400/30 text-xs">
                {user.role === "licenciado" ? "Licenciado" : "Notario"}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <div className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => onTabChange(item.id)}
              className={`w-full justify-start h-auto p-3 transition-all duration-200 focus:outline-none focus:ring-0 text-white hover:text-white focus:text-white ${
                isActive
                  ? "bg-blue-600/50 shadow-lg border-l-4 border-blue-400 focus:bg-blue-600/60"
                  : "hover:bg-white/10 focus:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3 w-full">
                <Icon className="h-5 w-5 flex-shrink-0 text-white" />
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-white">{item.label}</p>
                    <p className="text-xs opacity-75 text-white">{item.description}</p>
                  </div>
                )}
              </div>
            </Button>
          );
        })}
      </div>

      {/* Bottom Menu */}
      <div className="p-4 border-t border-white/10 space-y-2">
        {bottomMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => onTabChange(item.id)}
              className={`w-full justify-start h-auto p-3 transition-all duration-200 focus:outline-none focus:ring-0 text-white hover:text-white focus:text-white ${
                isActive
                  ? "bg-blue-600/50 shadow-lg border-l-4 border-blue-400 focus:bg-blue-600/60"
                  : "hover:bg-white/10 focus:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3 w-full">
                <Icon className="h-5 w-5 flex-shrink-0 text-white" />
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-white">{item.label}</p>
                    <p className="text-xs opacity-75 text-white">{item.description}</p>
                  </div>
                )}
              </div>
            </Button>
          );
        })}
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <Button
          variant="ghost"
          onClick={onLogout}
          className="w-full justify-start h-auto p-3 text-red-200 hover:bg-red-500/20 hover:text-red-100 transition-all duration-200"
        >
          <div className="flex items-center gap-3 w-full">
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">Cerrar Sesión</p>
              </div>
            )}
          </div>
        </Button>
      </div>
    </div>
  );
}
