"use client";

import { useState } from "react";
import {
  Solicitud,
  EstatusSolicitud,
  updateSolicitudStatus,
  uploadDocumento,
} from "@/lib/mock-data";
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
  CheckCircle,
  Lock,
} from "lucide-react";
import DocumentUploadBulk from "./document-upload-bulk";
import PaymentModal from "./payment-modal";
import RealDocumentViewer from "./real-document-viewer";
import DocumentosConIA from "./documentos-con-ia";

interface PendingActionsProps {
  solicitud: Solicitud;
  onSolicitudUpdate: (solicitud: Solicitud) => void;
}

export function PendingActions({
  solicitud,
  onSolicitudUpdate,
}: PendingActionsProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentoSolicitud | null>(null);

  const handleDocumentosSubidos = async (documentos: {
    [key: number]: File;
  }) => {
    setIsProcessing(true);

    try {
      // Subir cada documento
      for (const [documentoId, archivo] of Object.entries(documentos)) {
        await uploadDocumento(
          solicitud.numeroSolicitud,
          parseInt(documentoId),
          archivo
        );
      }

      // Actualizar la solicitud
      const solicitudActualizada = { ...solicitud };
      solicitudActualizada.documentosRequeridos =
        solicitudActualizada.documentosRequeridos.map((doc) => {
          if (documentos[doc.id]) {
            return {
              ...doc,
              subido: true,
              archivo: documentos[doc.id], // Guardar el archivo real
              fechaSubida: new Date().toISOString().split("T")[0],
            };
          }
          return doc;
        });

      onSolicitudUpdate(solicitudActualizada);
    } catch (error) {
      console.error("Error subiendo documentos:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDocumentoReemplazado = async (
    documentoId: number,
    archivo: File
  ) => {
    setIsProcessing(true);

    try {
      await uploadDocumento(solicitud.numeroSolicitud, documentoId, archivo);

      const solicitudActualizada = { ...solicitud };
      solicitudActualizada.documentosRequeridos =
        solicitudActualizada.documentosRequeridos.map((doc) => {
          if (doc.id === documentoId) {
            return {
              ...doc,
              archivo: archivo, // Guardar el archivo real
              fechaSubida: new Date().toISOString().split("T")[0],
            };
          }
          return doc;
        });

      onSolicitudUpdate(solicitudActualizada);
    } catch (error) {
      console.error("Error reemplazando documento:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDocumentoEliminado = (documentoId: number) => {
    const solicitudActualizada = { ...solicitud };
    solicitudActualizada.documentosRequeridos =
      solicitudActualizada.documentosRequeridos.map((doc) => {
        if (doc.id === documentoId) {
          return {
            ...doc,
            subido: false,
            archivo: undefined,
            fechaSubida: undefined,
          };
        }
        return doc;
      });

    onSolicitudUpdate(solicitudActualizada);
  };

  const handleVerDocumento = (documentoId: number) => {
    const documento = solicitud.documentosRequeridos.find(
      (doc) => doc.id === documentoId
    );
    if (documento) {
      setSelectedDocument(documento);
      setShowDocumentViewer(true);
    }
  };

  const handleDocumentoIndividual = async (
    documentoId: number,
    archivo: File
  ) => {
    setIsProcessing(true);

    try {
      await uploadDocumento(solicitud.numeroSolicitud, documentoId, archivo);

      const solicitudActualizada = { ...solicitud };
      solicitudActualizada.documentosRequeridos =
        solicitudActualizada.documentosRequeridos.map((doc) => {
          if (doc.id === documentoId) {
            return {
              ...doc,
              subido: true,
              archivo: archivo, // Guardar el archivo real
              fechaSubida: new Date().toISOString().split("T")[0],
            };
          }
          return doc;
        });

      onSolicitudUpdate(solicitudActualizada);
    } catch (error) {
      console.error("Error subiendo documento individual:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePagoRealizado = async (monto: number) => {
    setIsProcessing(true);

    try {
      const solicitudActualizada = { ...solicitud };
      solicitudActualizada.pagosRealizados += monto;
      solicitudActualizada.saldoPendiente -= monto;

      // NO cambiar de estatus automáticamente solo por pagar
      // El cambio de estatus debe ser manual y solo cuando todos los documentos estén subidos

      onSolicitudUpdate(solicitudActualizada);

      // Cerrar el modal después del pago
      setShowPaymentModal(false);
    } catch (error) {
      console.error("Error procesando pago:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Determinar si debe mostrar el bloqueo por pago
  const debeMostrarBloqueoPago = () => {
    // Ya no bloqueamos la subida de documentos por pagos
    return false;
  };

  // Verificar si se pueden subir más documentos
  const puedeSubirDocumentos = () => {
    // Siempre permitir subir documentos
    return true;
  };

  // Verificar si se puede avanzar de estatus
  const puedeAvanzarEstatus = () => {
    const documentosSubidos = solicitud.documentosRequeridos.filter(
      (doc) => doc.subido
    ).length;
    const documentosRequeridos = solicitud.documentosRequeridos.length;

    // Solo se puede avanzar si todos los documentos están subidos Y se ha realizado al menos un pago
    return (
      documentosSubidos === documentosRequeridos &&
      solicitud.pagosRealizados > 0
    );
  };

  const renderBorradorSection = () => {
    return (
      <div className="space-y-4">
        <div className="p-4 border border-purple-200 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-purple-900">
              Borrador del Documento
            </h3>
          </div>
          <p className="text-sm text-purple-700 mb-4">
            El borrador de tu testamento está listo para revisión. Por favor,
            revisa cuidadosamente todos los detalles antes de aprobar.
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
            Tu documento ha sido aprobado y está listo para ser firmado en la
            notaría. Contacta a tu notario para agendar la cita de firma.
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
            Tu testimonio notarial está listo. Puedes recogerlo en la notaría o
            solicitar envío a domicilio.
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
            <h3 className="font-semibold text-emerald-900">
              Trámite Completado
            </h3>
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
      case "ARMANDO_EXPEDIENTE":
        const todosDocumentosSubidos = solicitud.documentosRequeridos.filter(
          (doc) => doc.subido
        ).length === solicitud.documentosRequeridos.length;
        
        return (
          <div className="space-y-4">
            {!todosDocumentosSubidos ? (
              <DocumentUploadBulk
                documentosRequeridos={solicitud.documentosRequeridos}
                onDocumentosSubidos={handleDocumentosSubidos}
                onDocumentoReemplazado={handleDocumentoReemplazado}
                onDocumentoEliminado={handleDocumentoEliminado}
                onVerDocumento={handleVerDocumento}
                onDocumentoIndividual={handleDocumentoIndividual}
                bloqueado={false}
              />
            ) : (
              <DocumentosConIA
                documentos={solicitud.documentosRequeridos}
                onVerDocumento={handleVerDocumento}
              />
            )}

            {/* Mostrar sección de pago cuando todos los documentos estén subidos */}
            {todosDocumentosSubidos && solicitud.pagosRealizados === 0 && (
              <div className="mt-6 p-4 border border-blue-200 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">
                    Paso Siguiente: Realizar Pago
                  </h3>
                </div>
                <p className="text-sm text-blue-700 mb-4">
                  Todos los documentos han sido subidos correctamente. Para continuar con el trámite, 
                  es necesario realizar el pago correspondiente.
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-blue-800">
                    <strong>Costo total:</strong> ${solicitud.costoTotal.toLocaleString("es-MX")}
                  </div>
                  <Button
                    onClick={() => {
                      if (solicitud) {
                        window.location.href = `/solicitud/${solicitud.numeroSolicitud}/pago`;
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Realizar Pago
                  </Button>
                </div>
              </div>
            )}

            {/* Mostrar mensaje de pago completado */}
            {todosDocumentosSubidos && solicitud.pagosRealizados > 0 && (
              <div className="mt-6 p-4 border border-green-200 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-green-900">
                    Pago Realizado
                  </h3>
                </div>
                <p className="text-sm text-green-700">
                  Pago de ${solicitud.pagosRealizados.toLocaleString("es-MX")} realizado exitosamente. 
                  Tu trámite está listo para ser enviado a revisión.
                </p>
              </div>
            )}
          </div>
        );
      case "EN_REVISION_INTERNA":
        return (
          <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">En revisión interna</p>
                <p className="text-sm text-blue-700">
                  Nuestro equipo está revisando tus documentos. Te notificaremos
                  cuando esté listo.
                </p>
              </div>
            </div>
          </div>
        );
      case "BORRADOR_PARA_REVISION_CLIENTE":
        return renderBorradorSection();
      case "APROBADO_PARA_FIRMA":
        return renderFirmaSection();
      case "LISTO_PARA_ENTREGA":
        return renderEntregaSection();
      case "COMPLETADO":
        return renderCompletadoSection();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Acciones según el estatus */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            Acciones Pendientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {getActionsForStatus(solicitud.estatusActual)}
        </CardContent>
      </Card>

      {/* Modal de pago */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        saldoPendiente={solicitud.saldoPendiente}
        costoTotal={solicitud.costoTotal}
        pagosRealizados={solicitud.pagosRealizados}
        onPagoRealizado={handlePagoRealizado}
        documentosSubidos={
          solicitud.documentosRequeridos.filter((doc) => doc.subido).length
        }
        documentosRequeridos={solicitud.documentosRequeridos.length}
      />

      {/* Modal de visualización de documentos */}
      <RealDocumentViewer
        isOpen={showDocumentViewer}
        onClose={() => setShowDocumentViewer(false)}
        documento={selectedDocument}
      />
    </div>
  );
}
