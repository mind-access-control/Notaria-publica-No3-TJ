"use client";

import { Button } from "@/components/ui/button";
import { X, Edit, Save, CheckCircle2 } from "lucide-react";

interface AdvancedDocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    name: string;
    url: string;
    type: string;
    size: number;
    extractedData?: {
      data: any;
      confidence: number;
      documentType: string;
    };
  } | null;
  onSave?: () => void;
  onCancel?: () => void;
  isEditing?: boolean;
  setIsEditing?: (editing: boolean) => void;
  editingData?: any;
  setEditingData?: (data: any) => void;
  onValidate?: () => void;
  isValidated?: boolean;
  documentFields?: Array<{
    key: string;
    label: string;
    type: string;
  }>;
}

export function AdvancedDocumentViewer({
  isOpen,
  onClose,
  document,
  onSave,
  onCancel,
  isEditing = false,
  setIsEditing,
  editingData,
  setEditingData,
  onValidate,
  isValidated = false,
  documentFields = [
    { key: "nombre", label: "Nombre completo", type: "text" },
    { key: "fechaNacimiento", label: "Fecha de nacimiento", type: "date" },
    { key: "domicilio", label: "Domicilio", type: "text" },
  ],
}: AdvancedDocumentViewerProps) {
  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] w-full flex flex-col">
        {/* Header del modal */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {document.name}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Contenido del documento */}
        <div className="flex-1 p-4 overflow-auto">
          {document.extractedData?.data ? (
            // Si hay información extraída, mostrar lado a lado
            <div className="flex h-full gap-4">
              {/* Lado izquierdo - Documento */}
              <div className="w-1/2">
                <h4 className="font-medium text-gray-900 mb-3">Documento</h4>
                <div className="h-full overflow-auto">
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

              {/* Lado derecho - Data extraída */}
              <div className="w-1/2">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">
                    Información Extraída
                  </h4>
                  {setIsEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {isEditing ? "Cancelar" : "Editar"}
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  {documentFields.map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                      </label>
                      {isEditing && setEditingData ? (
                        field.type === "textarea" ? (
                          <textarea
                            value={editingData?.[field.key] || ""}
                            onChange={(e) =>
                              setEditingData({
                                ...editingData,
                                [field.key]: e.target.value,
                              })
                            }
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        ) : (
                          <input
                            type={field.type}
                            value={editingData?.[field.key] || ""}
                            onChange={(e) =>
                              setEditingData({
                                ...editingData,
                                [field.key]: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        )
                      ) : (
                        <div
                          className={`px-3 py-2 bg-gray-50 border border-gray-200 rounded-md ${
                            field.type === "textarea" ? "min-h-[76px]" : ""
                          }`}
                        >
                          {editingData?.[field.key] ||
                            document.extractedData.data[field.key] ||
                            "No disponible"}
                        </div>
                      )}
                    </div>
                  ))}

                  {isEditing && onSave && onCancel && (
                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        onClick={onSave}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Guardar
                      </Button>
                      <Button onClick={onCancel} variant="outline">
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  )}

                  {!isEditing && onValidate && !isValidated && (
                    <div className="pt-4 border-t">
                      <Button
                        onClick={onValidate}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Validar Documento
                      </Button>
                    </div>
                  )}

                  {isValidated && (
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">Documento Validado</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Confianza:</span>{" "}
                        {Math.round(
                          (document.extractedData.confidence || 0) * 100
                        )}
                        %
                      </div>
                      <div>
                        <span className="font-medium">Tipo:</span>{" "}
                        {document.extractedData.documentType}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Si no hay información extraída, mostrar solo el documento
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
          )}
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
