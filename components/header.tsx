"use client";

import { Button } from "@/components/ui/button";
import { Shield, User, LogOut, LogIn } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileNav } from "@/components/mobile-nav";
import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    logout();
    setIsLoggingOut(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-800 via-blue-900 to-slate-900 backdrop-blur supports-[backdrop-filter]:bg-slate-800/95 border-b border-slate-700 shadow-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-white" />
            <div className="text-lg font-bold text-white">
              Notaría Pública No. 3
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`transition-colors cursor-pointer px-3 py-2 rounded-md ${
                isActive("/")
                  ? "bg-white/20 text-white"
                  : "text-blue-100 hover:text-white hover:bg-white/10"
              }`}
            >
              Inicio
            </Link>
            <Link
              href="/servicios"
              className={`transition-colors cursor-pointer px-3 py-2 rounded-md ${
                isActive("/servicios")
                  ? "bg-white/20 text-white"
                  : "text-blue-100 hover:text-white hover:bg-white/10"
              }`}
            >
              Servicios
            </Link>
            <Link
              href="/nosotros"
              className={`transition-colors cursor-pointer px-3 py-2 rounded-md ${
                isActive("/nosotros")
                  ? "bg-white/20 text-white"
                  : "text-blue-100 hover:text-white hover:bg-white/10"
              }`}
            >
              Nosotros
            </Link>
            <Link
              href="/blog"
              className={`transition-colors cursor-pointer px-3 py-2 rounded-md ${
                isActive("/blog")
                  ? "bg-white/20 text-white"
                  : "text-blue-100 hover:text-white hover:bg-white/10"
              }`}
            >
              Blog
            </Link>
            <Link
              href="/contacto"
              className={`transition-colors cursor-pointer px-3 py-2 rounded-md ${
                isActive("/contacto")
                  ? "bg-white/20 text-white"
                  : "text-blue-100 hover:text-white hover:bg-white/10"
              }`}
            >
              Contacto
            </Link>
            <Link href="/citas" className="cursor-pointer">
              <Button
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 cursor-pointer"
              >
                Agendar Cita
              </Button>
            </Link>

            {/* Botones de autenticación */}
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-blue-300 border-t-white rounded-full animate-spin"></div>
                <span className="text-sm text-blue-100">Verificando...</span>
              </div>
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    <User className="h-4 w-4" />
                    {user?.nombre.split(" ")[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user?.nombre}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/mi-cuenta" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Mi Cuenta
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center gap-2 text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    {isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                    <LogIn className="h-4 w-4 mr-2" />
                    Iniciar Sesión
                  </Button>
                </Link>
              </div>
            )}

            <Link
              href="/login"
              className="text-xs text-blue-200 hover:text-white transition-colors"
              title="Acceso Administrativo"
            >
              Admin
            </Link>
          </div>

          <div className="md:hidden">
            <MobileNav currentPath={pathname} />
          </div>
        </div>
      </div>
    </nav>
  );
}
