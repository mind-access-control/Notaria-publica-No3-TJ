"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle, ArrowRight, Sparkles } from "lucide-react";

interface CTASectionProps {
  onOpenTramiteModal: () => void;
}

export function CTASection({ onOpenTramiteModal }: CTASectionProps) {
  return (
    <section className="py-8 bg-gradient-to-r from-blue-50 via-white to-blue-50 border-b border-blue-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-blue-900 text-white overflow-hidden relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>

          <CardContent className="p-8 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-yellow-300" />
                <span className="text-emerald-100 text-sm font-medium uppercase tracking-wide">
                  Asesoría Personalizada
                </span>
                <Sparkles className="h-6 w-6 text-yellow-300" />
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                ¿Qué trámite necesitas realizar?
              </h2>

              <p className="text-lg sm:text-xl text-emerald-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                Te ayudamos a encontrar exactamente lo que necesitas.
                <span className="font-semibold text-white">
                  {" "}
                  Asesoría gratuita
                </span>{" "}
                y
                <span className="font-semibold text-white">
                  {" "}
                  proceso simplificado
                </span>{" "}
                para todos tus trámites notariales.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={onOpenTramiteModal}
                  size="lg"
                  className="bg-white text-blue-800 hover:bg-blue-50 text-lg px-8 py-6 h-auto font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                >
                  <HelpCircle className="mr-3 h-6 w-6" />
                  Iniciar Mi Trámite
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>

                <div className="text-center sm:text-left">
                  <p className="text-emerald-100 text-sm">
                    <span className="font-semibold">100% Gratuito</span> • Sin
                    compromiso
                  </p>
                  <p className="text-emerald-200 text-xs">
                    Respuesta inmediata
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
