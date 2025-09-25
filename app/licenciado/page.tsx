"use client";

import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  LogOut,
} from "lucide-react";
import { AbogadoKanbanDashboard } from "@/components/abogado-kanban-dashboard";
import { CitasDashboard } from "@/components/citas-dashboard";
import { ArchivoDashboard } from "@/components/archivo-dashboard";
import { NotificationsPanel } from "@/components/notifications-panel";
import { LicenciadoSidebar } from "@/components/licenciado-sidebar";

export default function LicenciadoDashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("expedientes");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Verificar que el usuario sea licenciado
    if (user?.role !== "licenciado") {
      router.push("/mi-cuenta");
      return;
    }
  }, [isAuthenticated, user, router]);


  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <LicenciadoSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        user={user}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="p-6">
          {/* Contenido dinámico según el tab seleccionado */}
          {activeTab === "expedientes" && (
            <AbogadoKanbanDashboard licenciadoId={user.id} />
          )}
          
          {activeTab === "citas" && (
            <CitasDashboard />
          )}
          
          {activeTab === "archivo" && (
            <ArchivoDashboard />
          )}
        </div>
      </div>

      {/* Panel de notificaciones */}
      <NotificationsPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </div>
  );
}
