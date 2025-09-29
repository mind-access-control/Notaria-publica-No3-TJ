"use client";

interface GenericDocumentViewerProps {
  documentUrl?: string;
  title?: string;
}

export function GenericDocumentViewer({ documentUrl, title = "Documento PDF" }: GenericDocumentViewerProps) {
  return (
    <div className="flex-1 overflow-hidden bg-gray-50 relative">
      {!documentUrl ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Cargando documento...</p>
          </div>
        </div>
      ) : (
        <iframe
          src={documentUrl}
          className="w-full h-full border-0"
          title={title}
        />
      )}
    </div>
  );
}
