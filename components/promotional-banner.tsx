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
    color: "bg-gradient-to-r from-blue-400 to-blue-800",
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
        className={`${campaign.color} ${campaign.textColor} border-0 shadow-lg animate-in slide-in-from-top duration-500`}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <IconComponent className="h-6 w-6" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={`${campaign.badgeColor} text-xs font-bold`}>
                    {campaign.badge}
                  </Badge>
                  <h3 className="text-lg font-bold truncate">
                    {campaign.title}
                  </h3>
                </div>

                <p className="text-sm opacity-90 mb-2 line-clamp-2">
                  {campaign.description}
                </p>

                <div className="flex items-center gap-4 text-xs opacity-80">
                  <span>Válido hasta: {campaign.validUntil}</span>
                  <div className="flex items-center gap-1">
                    {campaign.features.slice(0, 2).map((feature, index) => (
                      <span key={index} className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <Button
                onClick={handleCtaClick}
                size="sm"
                className="bg-white text-gray-900 hover:bg-gray-100 font-semibold"
              >
                {campaign.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                onClick={handleClose}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
