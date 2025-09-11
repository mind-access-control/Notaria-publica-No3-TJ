"use client";

import { useState, useRef } from "react";
import { Solicitud, EstatusSolicitud } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  CheckCircle2, 
  FileText, 
  CreditCard, 
  Eye, 
  Download,
  AlertCircle,
  Clock,
  CheckCircle
} from "lucide-react";

interface PendingActionsProps {
  solicitud: Solicitud;
  onDocumentUpload: (documentoId: number, archivo: File) => void;
}

export function PendingActions({ solicitud, onDocumentUpload }: PendingActionsProps) {
  const [uploadingDoc, setUploadingDoc] = useState<number | null>(null);
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const handleFileUpload = async (documentoId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingDoc(documentoId);
    
    // Simular upload
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onDocumentUpload(documentoId, file);
    setUploadingDoc(null);
  };

  const triggerFileUpload = (documentoId: number) => {
    fileInputRefs.current[documentoId]?.click();
  };

  const renderDocumentosSection = () => {
    const documentosPendientes = solicitud.documentosRequeridos.filter(doc => !doc.subido);
    const documentosCompletados = solicitud.documentosRequeridos.filter(doc => doc.subido);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Documentos Requeridos</h3>
          <Badge variant="outline">
            {documentosCompletados.length} / {solicitud.documentosRequeridos.length} completados
          </Badge>
        </div>

        {/* Documentos pendientes */}
        {documentosPendientes.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Pendientes de subir:</h4>
            {documentosPendientes.map((documento) => (
              <div key={documento.id} className="flex items-center justify-between p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{documento.nombre}</p>
                  <p className="text-sm text-gray-600">{documento.descripcion}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    ref={(el) => fileInputRefs.current[documento.id] = el}
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => handleFileUpload(documento.id, e)}
                  />
                  <Button
                    size="sm"
                    onClick={() => triggerFileUpload(documento.id)}
                    disabled={uploadingDoc === documento.id}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    {uploadingDoc === documento.id ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Subiendo...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Subir Archivo
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Documentos completados */}
        {documentosCompletados.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Completados:</h4>
            {documentosCompletados.map((documento) => (
              <div key={documento.id} className="flex items-center justify-between p-4 border border-emerald-200 bg-emerald-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{documento.nombre}</p>
                    <p className="text-sm text-gray-600">
                      Subido: {documento.fechaSubida && new Date(documento.fechaSubida).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                    Completado
                  </Badge>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderPaymentSection = () => {
    const tieneSaldoPendiente = solicitud.saldoPendiente > 0;
    
    if (!tieneSaldoPendiente) {
      return (
        <div className="flex items-center gap-3 p-4 border border-emerald-200 bg-emerald-50 rounded-lg">
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          <div>
            <p className="font-medium text-emerald-900">Pago completado</p>
            <p className="text-sm text-emerald-700">Todos los pagos han sido procesados</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Para continuar con el trámite, es necesario completar el pago pendiente de ${solicitud.saldoPendiente.toLocaleString('es-MX')}.
          </AlertDescription>
        </Alert>
        
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-900">Pago pendiente</p>
              <p className="text-sm text-red-700">
                Saldo: ${solicitud.saldoPendiente.toLocaleString('es-MX')}
              </p>
            </div>
            <Button className="bg-red-600 hover:bg-red-700">
              <CreditCard className="h-4 w-4 mr-2" />
              Realizar Pago
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderBorradorSection = () => {
    return (
      <div className="space-y-4">
        <div className="p-4 border border-purple-200 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-purple-900">Borrador del Documento</h3>
          </div>
          <p className="text-sm text-purple-700 mb-4">
            El borrador de tu testamento está listo para revisión. Por favor, revisa cuidadosamente todos los detalles antes de aprobar.
          </p>
          <div className="flex gap-3">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Eye className="h-4 w-4 mr-2" />
              Revisar Borrador
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Descargar PDF
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderFirmaSection = () => {
    return (
      <div className="space-y-4">
        <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 className="h-5 w-5 text-orange-600" />
            <h3 className="font-semibold text-orange-900">Listo para Firma</h3>
          </div>
          <p className="text-sm text-orange-700 mb-4">
            Tu documento ha sido aprobado y está listo para ser firmado en la notaría. 
            Contacta a tu notario para agendar la cita de firma.
          </p>
          <div className="flex gap-3">
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Clock className="h-4 w-4 mr-2" />
              Agendar Cita de Firma
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Ver Documento
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderEntregaSection = () => {
    return (
      <div className="space-y-4">
        <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-green-900">Listo para Entrega</h3>
          </div>
          <p className="text-sm text-green-700 mb-4">
            Tu testimonio notarial está listo. Puedes recogerlo en la notaría o solicitar envío a domicilio.
          </p>
          <div className="flex gap-3">
            <Button className="bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Descargar Testimonio
            </Button>
            <Button variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Agendar Recogida
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderCompletadoSection = () => {
    return (
      <div className="space-y-4">
        <div className="p-4 border border-emerald-200 bg-emerald-50 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <h3 className="font-semibold text-emerald-900">Trámite Completado</h3>
          </div>
          <p className="text-sm text-emerald-700 mb-4">
            ¡Felicidades! Tu trámite notarial ha sido completado exitosamente. 
            Puedes descargar tu testimonio desde aquí.
          </p>
          <div className="flex gap-3">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Download className="h-4 w-4 mr-2" />
              Descargar Testimonio Final
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Ver Historial Completo
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const getActionsForStatus = (estatus: EstatusSolicitud) => {
    switch (estatus) {
      case 'ARMANDO_EXPEDIENTE':
        return renderDocumentosSection();
      case 'EN_REVISION_INTERNA':
        return (
          <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">En revisión interna</p>
                <p className="text-sm text-blue-700">
                  Nuestro equipo está revisando tus documentos. Te notificaremos cuando esté listo.
                </p>
              </div>
            </div>
          </div>
        );
      case 'BORRADOR_PARA_REVISION_CLIENTE':
        return renderBorradorSection();
      case 'APROBADO_PARA_FIRMA':
        return renderFirmaSection();
      case 'LISTO_PARA_ENTREGA':
        return renderEntregaSection();
      case 'COMPLETADO':
        return renderCompletadoSection();
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          Acciones Pendientes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sección de pagos (siempre visible si hay saldo pendiente) */}
        {solicitud.saldoPendiente > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-red-600" />
              Estado de Pagos
            </h3>
            {renderPaymentSection()}
          </div>
        )}

        {/* Acciones específicas según el estatus */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Próximos Pasos
          </h3>
          {getActionsForStatus(solicitud.estatusActual)}
        </div>
      </CardContent>
    </Card>
  );
}
