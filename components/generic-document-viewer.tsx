"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Printer, FileText, Eye } from "lucide-react";

interface GenericDocumentViewerProps {
  documentUrl?: string;
  title?: string;
  showToolbar?: boolean;
}

export function GenericDocumentViewer({ 
  documentUrl, 
  title = "Documento PDF",
  showToolbar = true 
}: GenericDocumentViewerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [iframeKey, setIframeKey] = useState(Date.now());
  const containerRef = useRef<HTMLDivElement>(null);
  
  console.log('🔍 GenericDocumentViewer renderizando:', { documentUrl, title, showToolbar });

  // Inicializar el visor
  useEffect(() => {
    if (!documentUrl) return;
    
    console.log("🔄 GenericDocumentViewer - Inicializando visor");
    
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
    
    const timer = setTimeout(() => {
      setIsLoaded(true);
      console.log("✅ GenericDocumentViewer - Iframe listo");
    }, 150);

    return () => {
      clearTimeout(timer);
      console.log("🧹 GenericDocumentViewer - Limpieza");
      
      if (containerRef.current) {
        const iframes = containerRef.current.querySelectorAll('iframe');
        iframes.forEach(iframe => {
          iframe.src = 'about:blank';
        });
      }
    };
  }, [documentUrl]);

  const handleDownload = () => {
    if (!documentUrl) return;
    console.log(`📥 Descargando: ${title}`);
    const link = document.createElement('a');
    link.href = documentUrl;
    link.download = `${title}.pdf`;
    link.click();
  };

  const handlePrint = () => {
    console.log(`🖨️ Imprimiendo: ${title}`);
    window.print();
  };
  
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Barra de herramientas */}
      {showToolbar && (
        <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 text-xs">
              <Eye className="h-3 w-3 mr-1" />
              Vista previa
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
      )}

      {/* Visor de documento */}
      <div ref={containerRef} className="flex-1 overflow-hidden bg-gray-50 relative">
        {!documentUrl ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Cargando documento...</p>
            </div>
          </div>
        ) : !isLoaded ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Preparando visualización...</p>
            </div>
          </div>
        ) : (
          <iframe
            key={`doc-viewer-${iframeKey}`}
            src={documentUrl}
            className="w-full h-full border-0"
            title={title}
            onLoad={() => console.log(`✅ ${title} - PDF cargado correctamente`)}
            onError={() => console.log(`❌ ${title} - Error cargando PDF`)}
          />
        )}
      </div>
    </div>
  );
}
