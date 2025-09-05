"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Shield,
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Play,
  Share2,
  Facebook,
  Twitter,
  MessageCircle,
  Copy,
  Check,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getVideoPostBySlug } from "@/lib/blog-data";

// Componente para el menú de compartir
const ShareMenu = ({
  url,
  title,
  description,
  type,
}: {
  url: string;
  title: string;
  description: string;
  type: "article" | "video";
}) => {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleShare = (platform: string) => {
    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}&quote=${encodeURIComponent(title + " - " + description)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          title + " - " + description
        )}&url=${encodeURIComponent(url)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(
          title + " - " + description + " " + url
        )}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
      >
        <Share2 className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-8 bg-background border border-border rounded-lg shadow-lg p-2 z-50 min-w-[200px]">
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyLink}
              className="w-full justify-start cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-600" />
                  ¡Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Enlace
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare("facebook")}
              className="w-full justify-start cursor-pointer"
            >
              <Facebook className="h-4 w-4 mr-2 text-blue-600" />
              Facebook
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare("twitter")}
              className="w-full justify-start cursor-pointer"
            >
              <Twitter className="h-4 w-4 mr-2 text-blue-400" />
              Twitter
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare("whatsapp")}
              className="w-full justify-start cursor-pointer"
            >
              <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
              WhatsApp
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function VideoPage() {
  const params = useParams();
  const slug = params.slug as string;
  const video = getVideoPostBySlug(slug);

  if (!video) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Video no encontrado
          </h1>
          <p className="text-muted-foreground mb-8">
            El video que buscas no existe o ha sido movido.
          </p>
          <Link href="/blog">
            <Button className="cursor-pointer">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Video Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/blog">
            <Button variant="outline" className="cursor-pointer">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Blog
            </Button>
          </Link>
        </div>

        {/* Video Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <Play className="h-8 w-8 text-slate-600" />
            </div>
            <div className="min-w-0 flex-1">
              <Badge
                variant="secondary"
                className="text-primary bg-primary/10 mb-3"
              >
                {video.category}
              </Badge>
              <h1 className="text-3xl font-bold text-foreground mb-3">
                {video.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{video.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{video.views} vistas</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Video Educativo</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            {video.description}
          </p>
        </div>

        {/* Share Button */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-center gap-4">
            <p className="text-muted-foreground">
              ¿Te gustó este video? Compártelo con otros que puedan necesitarlo.
            </p>
            <ShareMenu
              url={typeof window !== "undefined" ? window.location.href : ""}
              title={video.title}
              description={video.description}
              type="video"
            />
          </div>
        </Card>

        {/* Video Player */}
        <Card className="mb-8 overflow-hidden">
          <div className="aspect-video bg-muted">
            <iframe
              src={video.videoUrl}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </Card>

        {/* Video Information */}
        <Card className="p-6 mb-8">
          <h3 className="font-semibold text-foreground mb-3">
            Información del Video
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Categoría:</strong> {video.category}
            </div>
            <div>
              <strong>Duración:</strong> {video.duration}
            </div>
            <div>
              <strong>Visualizaciones:</strong> {video.views}
            </div>
            <div>
              <strong>Tipo:</strong> Video Educativo
            </div>
          </div>
        </Card>

        {/* Call to Action */}
        <Card className="p-6 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-3">
            ¿Necesitas asesoría legal?
          </h3>
          <p className="text-muted-foreground mb-4">
            Nuestros notarios están listos para ayudarte con cualquier trámite
            legal.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contacto">
              <Button className="bg-primary hover:bg-primary/90 cursor-pointer">
                Consulta Gratuita
              </Button>
            </Link>
            <Link href="/simulador">
              <Button variant="outline" className="cursor-pointer">
                Simulador de Aranceles
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
