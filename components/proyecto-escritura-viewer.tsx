"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Printer, FileText } from "lucide-react";

interface ProyectoEscrituraViewerProps {
  numeroSolicitud: string;
}

export function ProyectoEscrituraViewer({ numeroSolicitud }: ProyectoEscrituraViewerProps) {
  const [isLoaded, setIsLoaded] = useState(true); // Cambiar a true para permitir inyección de contenido
  const [iframeKey, setIframeKey] = useState(Date.now());
  const containerRef = useRef<HTMLDivElement>(null);

  // Efecto para limpiar contenido al montar
  useEffect(() => {
    console.log("🔄 PROYECTO ESCRITURA - Componente montado");
    
    // Limpiar solo iframes, no el contenido de texto
    if (containerRef.current) {
      const existingIframes = containerRef.current.querySelectorAll('iframe');
      existingIframes.forEach(iframe => {
        iframe.src = 'about:blank';
        iframe.remove();
      });
    }

    return () => {
      console.log("🧹 PROYECTO ESCRITURA - Componente desmontado");
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

      {/* Visor de documento - Permitir inyección de texto resaltado */}
      <div ref={containerRef} className="flex-1 overflow-hidden bg-gray-50 relative pdf-viewer-container">
        {/* El contenido del contrato con resaltado se inyectará aquí via JavaScript */}
        <div className="h-full w-full">
          {/* Contenido dinámico se inyectará aquí */}
        </div>
      </div>
    </>
  );
}
