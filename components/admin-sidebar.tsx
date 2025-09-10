"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Users,
  Calendar,
  DollarSign,
  Bell,
  BarChart3,
  Settings,
  Eye,
  Wand2,
  Scale,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    description: "Resumen general y métricas",
  },
  {
    title: "Expedientes",
    href: "/admin/expedientes",
    icon: FileText,
    description: "Gestión de expedientes",
  },
  {
    title: "Trámites",
    href: "/admin/tramites",
    icon: Scale,
    description: "Configuración de trámites",
  },
  {
    title: "Usuarios",
    href: "/admin/usuarios",
    icon: Users,
    description: "Gestión de usuarios y roles",
  },
  {
    title: "Citas",
    href: "/admin/citas",
    icon: Calendar,
    description: "Programación de citas",
  },
  {
    title: "OCR",
    href: "/admin/ocr",
    icon: Eye,
    description: "Reconocimiento óptico",
  },
  {
    title: "Formatos",
    href: "/admin/formatos",
    icon: Wand2,
    description: "Plantillas de escrituras",
  },
  {
    title: "Cobros",
    href: "/admin/cobros",
    icon: DollarSign,
    description: "Gestión de pagos",
  },
  {
    title: "Notificaciones",
    href: "/admin/notificaciones",
    icon: Bell,
    description: "Sistema de notificaciones",
  },
  {
    title: "Reportes",
    href: "/admin/reportes",
    icon: BarChart3,
    description: "Analytics y reportes",
  },
];

interface AdminSidebarProps {
  className?: string;
}

export default function AdminSidebar({ className }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Panel Admin
              </h2>
              <p className="text-sm text-gray-500">Notaría Pública No. 3</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                  isCollapsed && "justify-center"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {item.description}
                    </div>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && (
          <div className="space-y-2">
            <div className="text-xs text-gray-500">
              Sistema de Gestión Notarial
            </div>
            <div className="text-xs text-gray-400">Versión 1.0.0</div>
          </div>
        )}
      </div>
    </div>
  );
}
