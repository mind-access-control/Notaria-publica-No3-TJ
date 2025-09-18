"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle, X, MessageCircle, Phone, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FloatingHelpButtonProps {
  onOpenTramiteModal: () => void;
}

export function FloatingHelpButton({
  onOpenTramiteModal,
}: FloatingHelpButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleWhatsApp = () => {
    const message =
      "Hola, necesito ayuda con un trámite notarial. ¿Podrían asesorarme?";
    const whatsappUrl = `https://wa.me/526641234567?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCall = () => {
    window.open("tel:+526641234567", "_self");
  };

  const handleEmail = () => {
    const subject = "Consulta sobre trámite notarial";
    const body =
      "Hola,\n\nNecesito asesoría sobre un trámite notarial. ¿Podrían ayudarme?\n\nGracias.";
    const mailtoUrl = `mailto:contacto@notaria3tijuana.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isExpanded && (
        <Card className="mb-4 w-80 shadow-2xl border-0 bg-white">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  ¿Necesitas ayuda?
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsExpanded(false)}
                  className="p-1 h-auto"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <Button
                onClick={onOpenTramiteModal}
                className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
              >
                <HelpCircle className="mr-3 h-4 w-4" />
                ¿Qué trámite necesitas?
              </Button>

              <Button
                onClick={handleWhatsApp}
                variant="outline"
                className="w-full justify-start"
              >
                <MessageCircle className="mr-3 h-4 w-4 text-green-600" />
                WhatsApp
              </Button>

              <Button
                onClick={handleCall}
                variant="outline"
                className="w-full justify-start"
              >
                <Phone className="mr-3 h-4 w-4 text-blue-600" />
                Llamar
              </Button>

              <Button
                onClick={handleEmail}
                variant="outline"
                className="w-full justify-start"
              >
                <Mail className="mr-3 h-4 w-4 text-gray-600" />
                Email
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        size="lg"
        className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <HelpCircle className="h-6 w-6" />
      </Button>
    </div>
  );
}
