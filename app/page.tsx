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
        className="relative py-16 sm:py-20 lg:py-32 bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23059669%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8 lg:space-y-10 text-center lg:text-left">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                  Servicios Notariales Profesionales
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-slate-900 leading-tight tracking-tight">
                  Tu Notaría de{" "}
                  <span className="bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent font-bold">Confianza</span>
                  <br />
                  <span className="text-slate-700">en Tijuana</span>
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-2xl">
                  Más de{" "}
                  <span className="font-semibold bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent">
                    20 años
                  </span>{" "}
                  brindando servicios notariales con la más alta calidad,
                  rapidez y profesionalismo. Tu tranquilidad es nuestra
                  prioridad.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 max-w-2xl">
                <Button
                  size="lg"
                  onClick={() => setIsTramiteModalOpen(true)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-800 hover:from-blue-600 hover:to-blue-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 border-0 text-lg py-6"
                >
                  <HelpCircle className="mr-3 h-6 w-6" />
                  ¿Qué trámite necesitas?
                </Button>
                <Link href="/citas" className="group cursor-pointer flex-1">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-blue-500 hover:text-blue-700 bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 text-lg py-6"
                  >
                    <Calendar className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                    Agendar Cita
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative order-first lg:order-last">
              <div className="relative">
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full opacity-10 blur-xl"></div>

                {/* Main Image Container */}
                <div className="relative bg-gradient-to-br from-white to-slate-50 rounded-3xl p-8 shadow-2xl border border-slate-200">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-3xl"></div>
                  <img
                    src="/notaria3image.png"
                    alt="Notaría Pública No. 3 Tijuana"
                    className="relative w-full h-auto object-cover rounded-2xl shadow-lg"
                  />

                  {/* Overlay Badge */}
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-slate-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-slate-700">
                        Desde 2004
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Differentiators */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Nuestros Valores
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              ¿Por qué elegir{" "}
              <span className="bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent font-bold">nuestra notaría</span>?
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Nos diferenciamos por nuestro compromiso inquebrantable con la
              excelencia y la confianza
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="group text-center border-0 bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 rounded-2xl overflow-hidden">
              <CardHeader className="pb-6 pt-8">
                <div className="relative mx-auto mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <CardTitle className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Atención Personalizada
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-8">
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Cada cliente recibe atención dedicada y asesoría especializada
                  para su trámite específico
                </p>
              </CardContent>
            </Card>

            <Card className="group text-center border-0 bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 rounded-2xl overflow-hidden">
              <CardHeader className="pb-6 pt-8">
                <div className="relative mx-auto mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <CardTitle className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Tiempos Rápidos
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-8">
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Procesos eficientes que respetan tu tiempo y urgencias
                </p>
              </CardContent>
            </Card>

            <Card className="group text-center border-0 bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 rounded-2xl overflow-hidden">
              <CardHeader className="pb-6 pt-8">
                <div className="relative mx-auto mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <CardTitle className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Asesoría Sin Costo
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-8">
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Consulta inicial gratuita para orientarte en tu trámite
                  específico
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Cómo Funciona */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              ¿Cómo Funciona Nuestro Proceso?
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Un proceso simple y transparente para tu trámite notarial
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="border-border hover:shadow-lg transition-all hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-lg sm:text-xl">
                  1. Selecciona tu Trámite
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Indica qué tipo de trámite necesitas realizar
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button
                  onClick={() => setIsTramiteModalOpen(true)}
                  className="w-full bg-primary hover:bg-primary/90 cursor-pointer"
                >
                  Elegir Trámite
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-all hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-lg sm:text-xl">
                  2. Agenda tu Cita
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Reserva tu cita en línea de manera rápida y sencilla
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/citas" className="cursor-pointer">
                  <Button className="w-full bg-primary hover:bg-primary/90 cursor-pointer">
                    Agendar Ahora
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-all hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-lg sm:text-xl">
                  3. Completa tu Trámite
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Te guiamos paso a paso para completar tu documento legal
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
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
      <section className="py-12 bg-card border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Alianzas Estratégicas
            </h3>
            <p className="text-muted-foreground">
              Trabajamos con las principales instituciones financieras
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
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
                className="text-lg font-semibold text-muted-foreground"
              >
                {bank}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Necesitas Asesoría sobre tu Trámite?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Contáctanos hoy mismo y recibe orientación personalizada para tu
            trámite específico
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => setIsTramiteModalOpen(true)}
              className="bg-white text-blue-600 hover:bg-gray-50 cursor-pointer"
            >
              <HelpCircle className="mr-2 h-5 w-5" />
              Seleccionar Trámite
            </Button>
            <Link href="/contacto" className="cursor-pointer">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent cursor-pointer"
              >
                <Phone className="mr-2 h-5 w-5" />
                Llamar Ahora
              </Button>
            </Link>
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
