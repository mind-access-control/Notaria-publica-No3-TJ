"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ExpedienteDigital } from "@/components/expediente-digital";
import { AuthModal } from "@/components/auth-modal";
import { PortalPrivado } from "@/components/portal-privado";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Lock, User, FileText, ArrowRight } from "lucide-react";

interface UserData {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  tipoUsuario: "individual" | "empresarial";
  empresa?: string;
}

export default function ExpedienteDigitalPage() {
  const searchParams = useSearchParams();
  const tramiteId = searchParams.get("tramite") || "testamento";
  const usuario = searchParams.get("usuario") || "Usuario";
  const expedienteId = searchParams.get("expediente");
  const datosCodificados = searchParams.get("datos");

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const authStatus = localStorage.getItem("isAuthenticated");
    const storedUserData = localStorage.getItem("userData");

    if (authStatus === "true" && storedUserData) {
      setIsAuthenticated(true);
      setUserData(JSON.parse(storedUserData));
    }

    setIsLoading(false);
  }, []);

  const handleLogin = (user: UserData) => {
    setUserData(user);
    setIsAuthenticated(true);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userData");
    setIsAuthenticated(false);
    setUserData(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si el usuario está autenticado, mostrar el portal privado
  if (isAuthenticated && userData) {
    return <PortalPrivado userData={userData} onLogout={handleLogout} />;
  }

  // Si no está autenticado, mostrar la pantalla de login
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-10 w-10 text-emerald-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Portal Privado de Trámites
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Accede a tu portal personal para gestionar tus trámites notariales
              de forma segura y eficiente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="border-2 border-emerald-200 bg-emerald-50">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Lock className="h-6 w-6 text-emerald-600" />
                  <CardTitle className="text-xl">Acceso Seguro</CardTitle>
                </div>
                <CardDescription>
                  Tu información está protegida con los más altos estándares de
                  seguridad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    Encriptación de extremo a extremo
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    Cumplimiento con normativas de protección de datos
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    Acceso solo con autenticación verificada
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <CardTitle className="text-xl">Gestión Completa</CardTitle>
                </div>
                <CardDescription>
                  Administra todos tus trámites desde un solo lugar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Sube y organiza tus documentos
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Sigue el progreso en tiempo real
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Recibe notificaciones automáticas
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Card className="max-w-md mx-auto border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl">Acceder al Portal</CardTitle>
                <CardDescription>
                  Inicia sesión o crea tu cuenta para comenzar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button
                    onClick={() => setShowAuthModal(true)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg"
                  >
                    <User className="h-5 w-5 mr-2" />
                    Iniciar Sesión / Registrarse
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      ¿Necesitas ayuda?
                    </p>
                    <Button variant="outline" size="sm">
                      Contactar Soporte
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Información adicional sobre el trámite seleccionado */}
          {tramiteId && (
            <div className="mt-12 text-center">
              <Card className="max-w-2xl mx-auto border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Trámite Seleccionado
                  </CardTitle>
                  <CardDescription>
                    Has seleccionado:{" "}
                    <span className="font-semibold capitalize">
                      {tramiteId.replace("-", " ")}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Una vez que accedas a tu portal privado, podrás comenzar
                    este trámite de forma segura y organizada.
                  </p>
                  <Button
                    onClick={() => setShowAuthModal(true)}
                    variant="outline"
                    className="bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                  >
                    Comenzar Trámite
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      <Footer />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}
