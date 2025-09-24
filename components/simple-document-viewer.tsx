"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SimpleDocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    name: string;
    url: string;
    type: string;
    size: number;
  } | null;
}

export function SimpleDocumentViewer({
  isOpen,
  onClose,
  document,
}: SimpleDocumentViewerProps) {
  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full flex flex-col">
        {/* Header del modal */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {document.name}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Contenido del documento - Solo documento */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="h-full">
            {document.type?.includes("pdf") ? (
              <iframe
                src={document.url}
                className="w-full h-full min-h-[500px] border-0"
                title={document.name}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <img
                  src={document.url}
                  alt={document.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer con información del documento */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              <span className="font-medium">Tipo:</span> {document.type}
            </div>
            <div>
              <span className="font-medium">Tamaño:</span>{" "}
              {(document.size / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
