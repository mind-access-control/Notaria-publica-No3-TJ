"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle, ArrowRight, X, Sparkles } from "lucide-react";

interface FloatingCTAProps {
  onOpenTramiteModal: () => void;
}

export function FloatingCTA({ onOpenTramiteModal }: FloatingCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Mostrar el CTA después de 3 segundos
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm">
      <Card
        className={`shadow-2xl border-0 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white overflow-hidden transition-all duration-500 ${
          isMinimized ? "w-16 h-16" : "w-80"
        }`}
      >
        <CardContent className="p-0 relative">
          {!isMinimized ? (
            <>
              {/* Botón de cerrar */}
              <Button
                onClick={handleClose}
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 text-white hover:bg-white/20 p-1 h-6 w-6 z-10"
              >
                <X className="h-3 w-3" />
              </Button>

              {/* Botón de minimizar */}
              <Button
                onClick={handleMinimize}
                size="sm"
                variant="ghost"
                className="absolute top-2 right-8 text-white hover:bg-white/20 p-1 h-6 w-6 z-10"
              >
                <div className="w-3 h-0.5 bg-white"></div>
              </Button>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-yellow-300" />
                  <span className="text-emerald-100 text-sm font-medium uppercase tracking-wide">
                    Asesoría Gratuita
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-2 leading-tight">
                  ¿Qué trámite necesitas realizar?
                </h3>

                <p className="text-emerald-100 text-sm mb-4 leading-relaxed">
                  Te ayudamos a encontrar exactamente lo que necesitas.
                  <span className="font-semibold text-white">
                    100% gratuito
                  </span>{" "}
                  y sin compromiso.
                </p>

                <Button
                  onClick={onOpenTramiteModal}
                  size="sm"
                  className="w-full bg-white text-emerald-700 hover:bg-emerald-50 font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Iniciar Mi Trámite
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full relative">
              {/* Botón de cerrar cuando está minimizado */}
              <Button
                onClick={handleClose}
                size="sm"
                variant="ghost"
                className="absolute -top-1 -right-1 text-white hover:bg-white/20 p-1 h-4 w-4 z-10"
              >
                <X className="h-2 w-2" />
              </Button>

              {/* Botón principal para expandir */}
              <Button
                onClick={handleMinimize}
                size="lg"
                className="w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-300 hover:scale-110"
              >
                <HelpCircle className="h-6 w-6" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
