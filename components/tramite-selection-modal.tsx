"use client";

import { useState, useEffect } from "react";

// Declaración de tipos para Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    speechRecognition: any;
  }
}
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Search, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { tramites as tramitesData } from "@/lib/tramites-data";

interface TramiteSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTramiteSelect: (tramiteId: string) => void;
  preselectedTramite?: string;
}

// Usar los datos importados
const tramites = tramitesData;

export function TramiteSelectionModal({
  isOpen,
  onClose,
  onTramiteSelect,
  preselectedTramite,
}: TramiteSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  // Resetear cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  // Filtrar trámites basado en la búsqueda
  const filteredTramites = tramites.filter((tramite) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      tramite.name.toLowerCase().includes(query) ||
      tramite.description.toLowerCase().includes(query) ||
      tramite.keywords.some((keyword) => keyword.toLowerCase().includes(query))
    );
  });

  const handleTramiteSelect = (tramiteId: string) => {
    onTramiteSelect(tramiteId);
  };

  const handleVoiceSearch = () => {
    if (isRecording) {
      // Parar grabación
      if ((window as any).speechRecognition) {
        (window as any).speechRecognition.stop();
      }
      setIsRecording(false);
    } else {
      // Iniciar grabación
      if (
        "webkitSpeechRecognition" in window ||
        "SpeechRecognition" in window
      ) {
        const SpeechRecognition =
          (window as any).SpeechRecognition ||
          (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = "es-MX";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
          setIsRecording(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript.toLowerCase();
          setSearchQuery(transcript);
          setIsRecording(false);
        };

        recognition.onerror = (event: any) => {
          console.error("Error en reconocimiento de voz:", event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.start();
      } else {
        // Fallback si no hay soporte de voz
        alert(
          "Tu navegador no soporta reconocimiento de voz. Usa el campo de texto."
        );
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        id="tramite-selection-modal-container"
        className="max-w-4xl max-h-[90vh] p-0 overflow-hidden"
      >
        {/* Header fijo */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-1">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DialogTitle className="text-base font-semibold text-center">
                ¿Qué trámite necesitas realizar?
              </DialogTitle>
              <DialogDescription className="text-center text-xs">
                Selecciona el tipo de trámite que necesitas y te ayudaremos con
                toda la información
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-100 ml-4"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Contenido scrolleable */}
        <div className="overflow-y-auto max-h-[calc(85vh-50px)] p-2 pb-3">
          <div className="space-y-2 mt-1">
            {/* Buscador */}
            <div className="space-y-1">
              <div className="text-center">
                <h3 className="text-xs font-semibold text-gray-900">
                  ¿Qué deseas hacer?
                </h3>
                <p className="text-xs text-gray-600">
                  Escribe o dicta lo que necesitas y te ayudamos a encontrar el
                  trámite correcto
                </p>
              </div>

              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ej: testamento, compraventa, poder, sociedad..."
                    className="pl-10 pr-4"
                  />
                </div>
                <Button
                  onClick={handleVoiceSearch}
                  variant="outline"
                  className={`px-4 ${
                    isRecording ? "bg-red-50 border-red-200 text-red-600" : ""
                  }`}
                >
                  {isRecording ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {isRecording && (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 text-sm text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    Escuchando... Di lo que necesitas
                  </div>
                </div>
              )}
            </div>

            {/* Resultados */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
              {filteredTramites.length > 0 ? (
                filteredTramites.map((tramite) => {
                  const IconComponent = tramite.icon;
                  return (
                    <button
                      key={tramite.id}
                      className={`group relative p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] text-left ${
                        tramite.color
                      } hover:shadow-lg ${
                        tramite.isMain
                          ? "ring-2 ring-blue-200 ring-opacity-50"
                          : ""
                      }`}
                      onClick={() => handleTramiteSelect(tramite.id)}
                    >
                      <div className="space-y-2">
                        <h3
                          className={`font-semibold text-sm leading-tight group-hover:text-opacity-90 ${
                            tramite.isMain ? "text-white" : "text-blue-800"
                          }`}
                        >
                          {tramite.name}
                        </h3>
                        <p
                          className={`text-xs leading-relaxed ${
                            tramite.isMain ? "opacity-90" : "opacity-80"
                          }`}
                        >
                          {tramite.description}
                        </p>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            tramite.isMain ? "bg-blue-500" : "bg-current"
                          }`}
                        ></div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="col-span-2 text-center py-8">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No encontramos trámites
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Intenta con otras palabras o usa la búsqueda por voz
                  </p>
                  <Button
                    onClick={() => setSearchQuery("")}
                    variant="outline"
                    size="sm"
                  >
                    Ver todos los trámites
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
