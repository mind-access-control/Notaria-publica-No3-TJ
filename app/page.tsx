"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  Calendar,
  FileText,
  Shield,
  Clock,
  CreditCard,
  Users,
  Phone,
  Mail,
  BookOpen,
  Play,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { TramiteModal } from "@/components/tramite-modal";
import { PromotionalBanner } from "@/components/promotional-banner";
import { FloatingCTA } from "@/components/floating-cta";
import { AIChatbot } from "@/components/ai-chatbot";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [isTramiteModalOpen, setIsTramiteModalOpen] = useState(false);
  const [preselectedTramite, setPreselectedTramite] = useState<
    string | undefined
  >(undefined);

  // Redirigir usuarios autenticados a su cuenta
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (user?.role === "admin") {
        router.push("/admin");
      } else if (user?.role === "notario" || user?.role === "abogado") {
        router.push("/abogado");
      } else {
        router.push("/mi-cuenta");
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si el usuario está autenticado, no mostrar la landing page (se redirigirá)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Banner Promocional */}
      <PromotionalBanner
        onOpenTramiteModal={() => {
          setPreselectedTramite(undefined);
          setIsTramiteModalOpen(true);
        }}
        onOpenSpecificTramite={(tramiteId) => {
          setPreselectedTramite(tramiteId);
          setIsTramiteModalOpen(true);
        }}
      />

      {/* Hero Section */}
      <section
        id="inicio"
        className="relative min-h-[50vh] flex items-center overflow-hidden"
      >
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <img
            src="/Imagen9-1920x1279.jpg"
            alt="Notaría Pública No. 3 Tijuana"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-relaxed tracking-tight">
                Tu Notaría de{" "}
                <span className="bg-gradient-to-r from-blue-300 to-blue-200 bg-clip-text text-transparent font-medium">
                  Confianza
                </span>
                <br />
                <span className="text-slate-100">en Tijuana</span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-100 leading-relaxed max-w-xl mx-auto">
                Más de{" "}
                <span className="font-medium bg-gradient-to-r from-blue-300 to-blue-200 bg-clip-text text-transparent">
                  20 años
                </span>{" "}
                brindando servicios notariales con la más alta calidad, rapidez
                y profesionalismo. Tu tranquilidad es nuestra prioridad.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 max-w-2xl mx-auto pt-4">
                <Button
                  size="lg"
                  onClick={() => setIsTramiteModalOpen(true)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 border-0 text-base py-3"
                >
                  <HelpCircle className="mr-3 h-6 w-6" />
                  ¿Qué trámite necesitas?
                </Button>
                <Link href="/citas" className="group cursor-pointer flex-1">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 bg-white/5 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 text-base py-3"
                  >
                    <Calendar className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                    Agendar Cita
                  </Button>
                </Link>
              </div>

              {/* Trust Badge */}
              <div className="flex justify-center pt-3">
                <div className="bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-white/10">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-xs font-normal text-slate-200">
                      Desde 2004 • Más de 20 años de experiencia
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Differentiators */}
      <section className="py-6 sm:py-8 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium mb-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Nuestros Valores
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900 mb-4 leading-tight">
              ¿Por qué elegir{" "}
              <span className="bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent font-semibold">
                nuestra notaría
              </span>
              ?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Nos diferenciamos por nuestro compromiso inquebrantable con la
              excelencia y la confianza
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card className="group text-center border-0 bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 rounded-2xl overflow-hidden">
              <CardHeader className="pb-2 pt-4">
                <div className="relative mx-auto mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <CardTitle className="text-sm sm:text-base font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                  Atención Personalizada
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cada cliente recibe atención dedicada y asesoría especializada
                  para su trámite específico
                </p>
              </CardContent>
            </Card>

            <Card className="group text-center border-0 bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 rounded-2xl overflow-hidden">
              <CardHeader className="pb-2 pt-4">
                <div className="relative mx-auto mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <CardTitle className="text-sm sm:text-base font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                  Tiempos Rápidos
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Procesos eficientes que respetan tu tiempo y urgencias
                </p>
              </CardContent>
            </Card>

            <Card className="group text-center border-0 bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 rounded-2xl overflow-hidden">
              <CardHeader className="pb-2 pt-4">
                <div className="relative mx-auto mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <CardTitle className="text-sm sm:text-base font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                  Asesoría Sin Costo
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Consulta inicial gratuita para orientarte en tu trámite
                  específico
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Cómo Funciona */}
      <section className="py-6 sm:py-8 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">
              ¿Cómo Funciona Nuestro Proceso?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Un proceso simple y transparente para tu trámite notarial
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card className="border-border hover:shadow-lg transition-all hover:scale-105">
              <CardHeader className="text-center pb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <HelpCircle className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-base">
                  1. Selecciona tu Trámite
                </CardTitle>
                <CardDescription className="text-xs">
                  Indica qué tipo de trámite necesitas realizar
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-4">
                <Button
                  onClick={() => setIsTramiteModalOpen(true)}
                  className="w-full bg-primary hover:bg-primary/90 cursor-pointer"
                >
                  Elegir Trámite
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-all hover:scale-105">
              <CardHeader className="text-center pb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-base">
                  2. Agenda tu Cita
                </CardTitle>
                <CardDescription className="text-xs">
                  Reserva tu cita en línea de manera rápida y sencilla
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-4">
                <Link href="/citas" className="cursor-pointer">
                  <Button className="w-full bg-primary hover:bg-primary/90 cursor-pointer">
                    Agendar Ahora
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-all hover:scale-105">
              <CardHeader className="text-center pb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-sm sm:text-base">
                  3. Completa tu Trámite
                </CardTitle>
                <CardDescription className="text-xs">
                  Te guiamos paso a paso para completar tu documento legal
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-4">
                <Link href="/continuar-tramite" className="cursor-pointer">
                  <Button className="w-full bg-primary hover:bg-primary/90 cursor-pointer">
                    Comenzar
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Bank Partnerships */}
      <section className="py-4 bg-card border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <h3 className="text-lg font-medium text-foreground mb-1">
              Alianzas Estratégicas
            </h3>
            <p className="text-sm text-muted-foreground">
              Trabajamos con las principales instituciones financieras
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 opacity-60">
            {[
              "BBVA",
              "Santander",
              "Banamex",
              "Banorte",
              "HSBC",
              "Scotiabank",
            ].map((bank) => (
              <div
                key={bank}
                className="text-sm font-medium text-muted-foreground"
              >
                {bank}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Modal de Trámite */}
      <TramiteModal
        isOpen={isTramiteModalOpen}
        onClose={() => {
          setIsTramiteModalOpen(false);
          setPreselectedTramite(undefined);
        }}
        preselectedTramite={preselectedTramite}
      />

      {/* CTA Flotante */}
      <FloatingCTA
        onOpenTramiteModal={() => {
          setPreselectedTramite(undefined);
          setIsTramiteModalOpen(true);
        }}
      />

      {/* Chatbot solo para usuarios no autenticados */}
      {!isAuthenticated && <AIChatbot />}
    </div>
  );
}
