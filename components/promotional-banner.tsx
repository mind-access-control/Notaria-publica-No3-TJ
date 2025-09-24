"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Heart, Calendar, Gift, ArrowRight } from "lucide-react";

interface PromotionalBannerProps {
  onClose?: () => void;
  onOpenTramiteModal?: () => void;
  onOpenSpecificTramite?: (tramiteId: string) => void;
}

const promotionalCampaigns = [
  {
    id: "testamento-month",
    title: "Mes del Testamento",
    subtitle: "Protege el futuro de tu familia",
    description:
      "Durante todo el mes, obtén un 20% de descuento en la elaboración de testamentos. Aprovecha esta oportunidad única para asegurar el bienestar de tus seres queridos.",
    icon: Heart,
    color: "bg-gradient-to-r from-blue-500 to-blue-800",
    textColor: "text-white",
    badge: "20% Descuento",
    badgeColor: "bg-yellow-400 text-yellow-900",
    cta: "Iniciar Testamento",
    ctaLink: "/testamento-promocion",
    tramiteId: "testamento",
    validUntil: "30 de Septiembre, 2024",
    features: [
      "Asesoría gratuita",
      "Descuento del 20%",
      "Proceso simplificado",
      "Entrega en 24 horas",
    ],
  },
];

export function PromotionalBanner({
  onClose,
  onOpenTramiteModal,
  onOpenSpecificTramite,
}: PromotionalBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Solo hay un banner, no necesitamos rotación
  const currentCampaign = 0;

  if (!isVisible) return null;

  const campaign = promotionalCampaigns[currentCampaign];
  const IconComponent = campaign.icon;

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const handleCtaClick = () => {
    // Siempre abrir directamente el trámite específico sin pedir datos
    if (campaign.tramiteId && onOpenSpecificTramite) {
      onOpenSpecificTramite(campaign.tramiteId);
    } else if (onOpenTramiteModal) {
      onOpenTramiteModal();
    } else {
      window.open(campaign.ctaLink, "_blank");
    }
  };

  return (
    <div className="relative overflow-hidden">
      <Card
        className={`${campaign.color} ${campaign.textColor} border-0 shadow-sm animate-in slide-in-from-top duration-500`}
      >
        <CardContent className="px-1 py-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <div className="flex-shrink-0">
                <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center">
                  <IconComponent className="h-2 w-2" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Badge
                    className={`${campaign.badgeColor} text-xs font-bold px-1 py-0`}
                  >
                    {campaign.badge}
                  </Badge>
                  <span className="text-xs font-semibold truncate">
                    {campaign.title}
                  </span>
                  <span className="text-xs opacity-90 truncate">
                    - {campaign.description}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                onClick={handleCtaClick}
                size="sm"
                className="bg-white text-gray-900 hover:bg-gray-100 font-medium text-xs px-1.5 py-0 h-4"
              >
                {campaign.cta}
                <ArrowRight className="ml-1 h-2 w-2" />
              </Button>

              <Button
                onClick={handleClose}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 p-0 h-4 w-4"
              >
                <X className="h-2 w-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
