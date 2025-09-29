"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Printer, FileText } from "lucide-react";

interface EscrituraFirmaAgendadaViewerProps {
  numeroSolicitud: string;
}

export function EscrituraFirmaAgendadaViewer({ numeroSolicitud }: EscrituraFirmaAgendadaViewerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [iframeKey, setIframeKey] = useState(Date.now());
  const containerRef = useRef<HTMLDivElement>(null);

  // Forzar limpieza completa del iframe
  useEffect(() => {
    console.log("🔄 ESCRITURA FIRMA AGENDADA - Componente montado");
    
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
      console.log("✅ ESCRITURA FIRMA AGENDADA - Iframe listo para cargar");
    }, 200);

    return () => {
      clearTimeout(timer);
      console.log("🧹 ESCRITURA FIRMA AGENDADA - Componente desmontado");
      
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
    console.log(`📥 Descargando escritura para firma para ${numeroSolicitud}`);
    const link = document.createElement('a');
    link.href = '/documentos/escrituras/Escrituras_Firma_Dummy.pdf';
    link.download = `Escritura_Firma_${numeroSolicitud}.pdf`;
    link.click();
  };

  const handlePrint = () => {
    console.log(`🖨️ Imprimiendo escritura para firma para ${numeroSolicitud}`);
    window.print();
  };

  return (
    <>
      {/* Barra de herramientas para Firma agendada */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-gray-900">Escritura</h3>
          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 text-xs">
            Firma agendada
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

      {/* Visor de documento - Mostrar directamente */}
      <div ref={containerRef} className="flex-1 overflow-hidden bg-gray-50 relative">
        {!isLoaded ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Cargando escritura para firma...</p>
            </div>
          </div>
        ) : (
          <iframe
            key={`escritura-firma-${iframeKey}`}
            src="/documentos/escrituras/Escrituras_Firma_Dummy.pdf"
            className="w-full h-full border-0"
            title="Escritura para Firma PDF"
            onLoad={() => console.log("✅ ESCRITURA FIRMA AGENDADA - Iframe cargado correctamente")}
            onError={() => console.log("❌ ESCRITURA FIRMA AGENDADA - Error cargando iframe")}
          />
        )}
      </div>
    </>
  );
}
