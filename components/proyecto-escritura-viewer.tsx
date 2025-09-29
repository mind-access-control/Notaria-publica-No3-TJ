"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Printer } from "lucide-react";

interface ProyectoEscrituraViewerProps {
  numeroSolicitud: string;
}

export function ProyectoEscrituraViewer({ numeroSolicitud }: ProyectoEscrituraViewerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [iframeKey, setIframeKey] = useState(Date.now());
  const containerRef = useRef<HTMLDivElement>(null);

  // Forzar limpieza completa del iframe
  useEffect(() => {
    console.log("🔄 PROYECTO ESCRITURA - Componente montado");
    
    // Limpiar cualquier iframe existente
    if (containerRef.current) {
      const existingIframes = containerRef.current.querySelectorAll('iframe');
      existingIframes.forEach(iframe => {
        iframe.src = 'about:blank';
        iframe.remove();
      });
    }

    setIsLoaded(false);
    setIframeKey(Date.now());
    
    // Delay más largo para asegurar limpieza completa
    const timer = setTimeout(() => {
      setIsLoaded(true);
      console.log("✅ PROYECTO ESCRITURA - Iframe listo para cargar");
    }, 200);

    return () => {
      clearTimeout(timer);
      console.log("🧹 PROYECTO ESCRITURA - Componente desmontado");
      
      // Limpieza adicional al desmontar
      if (containerRef.current) {
        const iframes = containerRef.current.querySelectorAll('iframe');
        iframes.forEach(iframe => {
          iframe.src = 'about:blank';
        });
      }
    };
  }, []);

  const handleDownload = () => {
    console.log(`📥 Descargando proyecto de escritura para ${numeroSolicitud}`);
    const link = document.createElement('a');
    link.href = '/documentos_legales/Contrato_Compraventa_Borrador.pdf';
    link.download = `Proyecto_Escritura_${numeroSolicitud}.pdf`;
    link.click();
  };

  const handlePrint = () => {
    console.log(`🖨️ Imprimiendo proyecto de escritura para ${numeroSolicitud}`);
    window.print();
  };

  return (
    <>
      {/* Barra de herramientas para Proyecto de escritura */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-gray-900">Escritura</h3>
          <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300 text-xs">
            Proyecto de escritura
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-7"
            onClick={handleDownload}
          >
            <Download className="h-3 w-3 mr-1" />
            Descargar
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-7"
            onClick={handlePrint}
          >
            <Printer className="h-3 w-3 mr-1" />
            Imprimir
          </Button>
        </div>
      </div>

      {/* Visor de documento */}
      <div ref={containerRef} className="flex-1 overflow-hidden bg-gray-50 relative">
        {!isLoaded ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Cargando proyecto de escritura...</p>
            </div>
          </div>
        ) : (
          <iframe
            key={`proyecto-escritura-${iframeKey}`}
            src="/documentos_legales/Contrato_Compraventa_Borrador.pdf"
            className="w-full h-full border-0"
            title="Proyecto de Escritura PDF"
            onLoad={() => console.log("✅ PROYECTO ESCRITURA - Iframe cargado correctamente")}
            onError={() => console.log("❌ PROYECTO ESCRITURA - Error cargando iframe")}
          />
        )}
      </div>
    </>
  );
}
