"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import AdminSidebar from "@/components/admin-sidebar";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const pathname = usePathname();

  // Skip authentication check for login page
  const isLoginPage = pathname === "/login";

  useEffect(() => {
    if (isLoginPage) {
      return;
    }

    // Check if user is authenticated and is admin
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, user, router, isLoginPage]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // For login page, just render children without layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null; // Will redirect to login
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        {/* Admin Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              Panel de Administración
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user?.nombre}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Cerrar Sesión</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
