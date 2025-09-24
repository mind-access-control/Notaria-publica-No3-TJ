"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  Clock,
  Calendar,
  User,
  LogOut,
} from "lucide-react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Solicitud, EstatusSolicitud } from "@/lib/mock-data";

export default function RevisionBorradorPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const numeroSolicitud = params.numeroSolicitud as string;

  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Solicitud hardcodeada para la demo
  const solicitudDemo: Solicitud = {
    numeroSolicitud: "NT3-2025-00123",
    tipoTramite: "Compraventa de Inmuebles",
    estatusActual: "REVISION_BORRADOR" as EstatusSolicitud,
    fechaCreacion: "2025-01-15",
    fechaUltimaActualizacion: "2025-01-20",
    cliente: {
      id: "user-123",
      nombre: "Graciela Rodriguez Lopez",
      email: "graciela.rodriguez@email.com",
      telefono: "+52 664 123 4567",
    },
    documentosRequeridos: [
      {
        id: 1,
        nombre: "INE",
        descripcion: "Identificación oficial vigente",
        subido: true,
        archivo: "ine.pdf",
      },
      {
        id: 2,
        nombre: "Comprobante de Domicilio",
        descripcion: "Comprobante de domicilio no mayor a 3 meses",
        subido: true,
        archivo: "comprobante_domicilio.pdf",
      },
      {
        id: 3,
        nombre: "CURP",
        descripcion: "Clave Única de Registro de Población",
        subido: true,
        archivo: "curp.pdf",
      },
      {
        id: 4,
        nombre: "RFC y Constancia de Situación Fiscal (CSF)",
        descripcion:
          "Registro Federal de Contribuyentes y constancia de situación fiscal",
        subido: true,
        archivo: "rfc.pdf",
      },
      {
        id: 5,
        nombre: "Acta de Nacimiento",
        descripcion: "Acta de nacimiento certificada",
        subido: true,
        archivo: "acta_nacimiento.pdf",
      },
      {
        id: 6,
        nombre: "Acta de Matrimonio",
        descripcion: "Acta de matrimonio (si aplica)",
        subido: true,
        archivo: "acta_matrimonio.pdf",
      },
    ],
    historial: [
      {
        fecha: "2025-01-15",
        estatus: "ARMANDO_EXPEDIENTE" as EstatusSolicitud,
        descripcion: "Solicitud creada y documentos subidos",
      },
      {
        fecha: "2025-01-16",
        estatus: "PAGO_PENDIENTE" as EstatusSolicitud,
        descripcion: "Documentos validados, pendiente de pago",
      },
      {
        fecha: "2025-01-17",
        estatus: "EN_REVISION_INTERNA" as EstatusSolicitud,
        descripcion: "Pago realizado, en revisión interna",
      },
      {
        fecha: "2025-01-20",
        estatus: "REVISION_BORRADOR" as EstatusSolicitud,
        descripcion: "Documento de escritura listo para revisión",
      },
    ],
    pagosRealizados: 25000,
    saldoPendiente: 0,
    notario: {
      id: "lic-001",
      nombre: "Dr. Xavier Ibañez Veramendi",
      email: "xavier.ibanez@notaria3bc.com",
      telefono: "+52 664 555 0123",
    },
    costoTotal: 25000,
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    // Simular proceso de logout
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push("/login");
  };

  const handleVerPrescritura = () => {
    setShowDocumentViewer(true);
  };

  const handleAcceptDocument = () => {
    // Simular aceptación del documento y envío a la siguiente etapa
    router.push(`/solicitud/${numeroSolicitud}/agendar-cita`);
  };

  const handleBackToTracking = () => {
    router.push(`/solicitud/${numeroSolicitud}/seguimiento`);
  };

  const handleMiCuenta = () => {
    router.push("/mi-cuenta");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToTracking}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Volver al Seguimiento</span>
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">
                Revisión de Borrador - {solicitudDemo.numeroSolicitud}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMiCuenta}
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>Mi Cuenta</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
                <span>{isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información de la Solicitud */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Documento de Escritura</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">
                      Documento Listo para Revisión
                    </span>
                  </div>
                  <p className="text-blue-800 text-sm">
                    Tu documento de escritura está listo para tu revisión y
                    aprobación. Por favor, revisa cuidadosamente todos los datos
                    antes de proceder.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium text-gray-700">
                      Tipo de Trámite:
                    </span>
                    <span className="text-gray-900">
                      {solicitudDemo.tipoTramite}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium text-gray-700">
                      Número de Solicitud:
                    </span>
                    <span className="text-gray-900">
                      {solicitudDemo.numeroSolicitud}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium text-gray-700">Cliente:</span>
                    <span className="text-gray-900">
                      {solicitudDemo.cliente.nombre}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium text-gray-700">
                      Estado Actual:
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-yellow-50 text-yellow-700 border-yellow-200"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      Revisión de Borrador
                    </Badge>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleVerPrescritura}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Ver Prescritura
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panel Lateral */}
          <div className="space-y-6">
            {/* Licenciado Asignado */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Licenciado Asignado</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">
                    Dr. Xavier Ibañez Veramendi
                  </p>
                  <p className="text-sm text-gray-600">Derecho Notarial</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">Teléfono:</span>
                    <span className="text-gray-900">+52 664 555 0123</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">Email:</span>
                    <span className="text-gray-900">
                      xavier.ibanez@notaria3bc.com
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMiCuenta}
                  className="w-full"
                >
                  Mi Cuenta
                </Button>
              </CardContent>
            </Card>

            {/* Progreso del Trámite */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Progreso del Trámite</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {solicitudDemo.historial.map((entrada, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div
                          className={`w-3 h-3 rounded-full mt-1 ${
                            entrada.estatus === solicitudDemo.estatusActual
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {entrada.descripcion}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(entrada.fecha).toLocaleDateString("es-MX")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal del Visor de Documento */}
      <DocumentViewerModal
        isOpen={showDocumentViewer}
        onClose={() => setShowDocumentViewer(false)}
        onAccept={handleAcceptDocument}
      />
    </div>
  );
}

// Componente del modal de visor de documento
function DocumentViewerModal({
  isOpen,
  onClose,
  onAccept,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [acceptedSteps, setAcceptedSteps] = useState<number[]>([]);
  const [documentRef, setDocumentRef] = useState<HTMLDivElement | null>(null);
  const [fullDocument, setFullDocument] = useState<string>("");

  // Cargar el documento completo al montar el componente
  useEffect(() => {
    const loadDocument = async () => {
      try {
        const response = await fetch(
          "/documentos_legales/Copia de 32689.docx.md"
        );
        const text = await response.text();
        setFullDocument(text);
      } catch (error) {
        console.error("Error cargando el documento:", error);
        // Fallback al documento hardcodeado si falla la carga
        setFullDocument(
          "Error al cargar el documento. Por favor, intente nuevamente."
        );
      }
    };

    if (isOpen) {
      loadDocument();
    }
  }, [isOpen]);

  // Hacer scroll automático cuando cambie el paso actual
  useEffect(() => {
    if (documentRef && fullDocument && currentStep < documentSections.length) {
      // Esperar un poco más para asegurar que el DOM esté completamente renderizado
      setTimeout(() => {
        const section = documentSections[currentStep];
        scrollToSection(section.anchorId, section.scrollToText);
      }, 300);
    }
  }, [currentStep, documentRef, fullDocument]);

  // Hacer scroll inicial cuando se carga el documento
  useEffect(() => {
    if (documentRef && fullDocument && currentStep === 0) {
      setTimeout(() => {
        const section = documentSections[0];
        scrollToSection(section.anchorId, section.scrollToText);
      }, 500);
    }
  }, [documentRef, fullDocument]);

  const documentSections = [
    {
      title: "Encabezado y Datos Generales",
      description:
        "Revisa el encabezado del documento y los datos generales del contrato",
      highlightText:
        "INSTRUMENTO NÚMERO TREINTA Y DOS MIL SEISCIENTOS OCHENTA Y NUEVE",
      scrollToText:
        "INSTRUMENTO NÚMERO TREINTA Y DOS MIL SEISCIENTOS OCHENTA Y NUEVE",
      anchorId: "encabezado",
    },
    {
      title: "Datos del Comprador",
      description: "Verifica los datos del comprador en el contrato",
      highlightText: "JONATHAN RUBEN HERNANDEZ GONZALEZ",
      scrollToText: "PARTE COMPRADORA",
      anchorId: "comprador",
    },
    {
      title: "Datos del Inmueble",
      description: "Revisa la descripción y ubicación del inmueble",
      highlightText:
        "la vivienda de interés social marcada con el número **UNO**",
      scrollToText: "PRIMERA.- la sociedad mercantil denominada",
      anchorId: "inmueble",
    },
    {
      title: "Condiciones de Pago",
      description: "Verifica el precio y condiciones de pago",
      highlightText: "853,500.00",
      scrollToText: "OCHOCIENTOS CINCUENTA Y TRES MIL QUINIENTOS PESOS",
      anchorId: "pago",
    },
    {
      title: "Términos Legales",
      description: "Revisa los términos legales y condiciones del contrato",
      highlightText: "TÍTULOS DE LAS CLÁUSULAS",
      scrollToText: "TÍTULOS DE LAS CLÁUSULAS",
      anchorId: "terminos",
    },
  ];

  const highlightText = (text: string, highlight: string) => {
    if (!highlight) return text;
    console.log("Aplicando resaltado:", highlight);
    console.log(
      "Texto completo contiene el highlight:",
      text.includes(highlight)
    );
    // Escapar caracteres especiales de regex
    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedHighlight})`, "gi");
    const result = text.replace(
      regex,
      '<mark class="bg-yellow-400 px-2 py-1 rounded font-bold border-2 border-yellow-500 animate-pulse">$1</mark>'
    );
    console.log("Texto resaltado aplicado:", result !== text);
    console.log("Resultado contiene mark:", result.includes("<mark"));
    return result;
  };

  const scrollToHighlight = (textToFind: string) => {
    if (!documentRef || !textToFind) {
      console.log("No documentRef or textToFind:", { documentRef, textToFind });
      return;
    }

    console.log("Buscando texto:", textToFind);

    // Buscar el texto en el contenido HTML renderizado
    const walker = document.createTreeWalker(
      documentRef,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node;
    let found = false;

    while ((node = walker.nextNode())) {
      if (node.textContent?.includes(textToFind)) {
        console.log("Texto encontrado:", textToFind);
        const range = document.createRange();
        range.selectNodeContents(node);
        const rect = range.getBoundingClientRect();

        // Calcular la posición de scroll necesaria
        const containerRect = documentRef.getBoundingClientRect();
        const scrollTop =
          documentRef.scrollTop + rect.top - containerRect.top - 150;

        documentRef.scrollTo({
          top: Math.max(0, scrollTop),
          behavior: "smooth",
        });

        found = true;
        break;
      }
    }

    // Si no se encontró el texto exacto, buscar texto similar
    if (!found) {
      console.log("Texto exacto no encontrado, buscando términos similares");
      const searchTerms = textToFind
        .split(" ")
        .filter((term) => term.length > 3);

      for (const term of searchTerms) {
        console.log("Buscando término:", term);
        const walker2 = document.createTreeWalker(
          documentRef,
          NodeFilter.SHOW_TEXT,
          null
        );

        while ((node = walker2.nextNode())) {
          if (node.textContent?.includes(term)) {
            console.log("Término encontrado:", term);
            const range = document.createRange();
            range.selectNodeContents(node);
            const rect = range.getBoundingClientRect();

            const containerRect = documentRef.getBoundingClientRect();
            const scrollTop =
              documentRef.scrollTop + rect.top - containerRect.top - 150;

            documentRef.scrollTo({
              top: Math.max(0, scrollTop),
              behavior: "smooth",
            });

            found = true;
            break;
          }
        }
        if (found) break;
      }
    }

    if (!found) {
      console.log("No se encontró ningún texto para:", textToFind);
    }
  };

  // Nueva función para navegar usando anclas HTML
  const scrollToSection = (anchorId: string, textToFind: string) => {
    if (!documentRef || !textToFind) return;

    console.log("Navegando a sección:", anchorId, "buscando:", textToFind);

    // Buscar el texto en el contenido HTML renderizado
    const walker = document.createTreeWalker(
      documentRef,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node;
    let found = false;

    while ((node = walker.nextNode())) {
      if (node.textContent?.includes(textToFind)) {
        console.log("Texto encontrado para ancla:", textToFind);

        // Crear un elemento span con el ID
        const anchorElement = document.createElement("span");
        anchorElement.id = anchorId;
        anchorElement.style.display = "inline";

        // Insertar el elemento antes del nodo de texto
        node.parentNode?.insertBefore(anchorElement, node);

        // Hacer scroll al elemento
        anchorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });

        // Remover el elemento después de un delay
        setTimeout(() => {
          if (anchorElement.parentNode) {
            anchorElement.parentNode.removeChild(anchorElement);
          }
        }, 2000);

        found = true;
        break;
      }
    }

    // Si no se encontró el texto exacto, buscar texto similar
    if (!found) {
      console.log(
        "Texto exacto no encontrado para ancla, buscando términos similares"
      );
      const searchTerms = textToFind
        .split(" ")
        .filter((term) => term.length > 3);

      for (const term of searchTerms) {
        const walker2 = document.createTreeWalker(
          documentRef,
          NodeFilter.SHOW_TEXT,
          null
        );

        while ((node = walker2.nextNode())) {
          if (node.textContent?.includes(term)) {
            console.log("Término encontrado para ancla:", term);

            const anchorElement = document.createElement("span");
            anchorElement.id = anchorId;
            anchorElement.style.display = "inline";

            node.parentNode?.insertBefore(anchorElement, node);

            anchorElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "nearest",
            });

            setTimeout(() => {
              if (anchorElement.parentNode) {
                anchorElement.parentNode.removeChild(anchorElement);
              }
            }, 2000);

            found = true;
            break;
          }
        }
        if (found) break;
      }
    }

    if (!found) {
      console.log("No se encontró ningún texto para ancla:", anchorId);
    }
  };

  const handleAcceptStep = () => {
    if (!acceptedSteps.includes(currentStep)) {
      setAcceptedSteps([...acceptedSteps, currentStep]);
    }

    if (currentStep < documentSections.length - 1) {
      setCurrentStep(currentStep + 1);
      // Esperar a que el DOM se actualice antes de hacer scroll
      setTimeout(() => {
        const section = documentSections[currentStep + 1];
        scrollToSection(section.anchorId, section.scrollToText);
      }, 200);
    }
  };

  const handleRejectStep = () => {
    // En una implementación real, esto podría abrir un modal para comentarios
    alert(
      "Sección rechazada. Por favor, contacta al licenciado para más información."
    );
  };

  const handleNextStep = () => {
    if (currentStep < documentSections.length - 1) {
      setCurrentStep(currentStep + 1);
      // Esperar a que el DOM se actualice antes de hacer scroll
      setTimeout(() => {
        const section = documentSections[currentStep + 1];
        scrollToSection(section.anchorId, section.scrollToText);
      }, 200);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Esperar a que el DOM se actualice antes de hacer scroll
      setTimeout(() => {
        const section = documentSections[currentStep - 1];
        scrollToSection(section.anchorId, section.scrollToText);
      }, 200);
    }
  };

  const handleAceptarEscritura = () => {
    onAccept();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-[98vw] h-[98vh] flex flex-col overflow-hidden">
        {/* Header del Modal */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Revisión de Documento de Escritura
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Paso {currentStep + 1} de {documentSections.length}
              </span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      ((currentStep + 1) / documentSections.length) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Contenido del Modal */}
        <div className="flex flex-1 overflow-hidden">
          {/* Panel Izquierdo - Documento */}
          <div className="flex-1 p-1 overflow-auto bg-gray-50">
            <div
              ref={setDocumentRef}
              className="bg-white p-3 min-h-[3000px] rounded-lg shadow-sm"
              dangerouslySetInnerHTML={{
                __html: highlightText(
                  fullDocument,
                  documentSections[currentStep]?.highlightText || ""
                ),
              }}
              style={{ whiteSpace: "pre-line" }}
            />
          </div>

          {/* Panel Derecho - Pasos de Revisión */}
          <div className="w-96 p-6 border-l bg-white overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Pasos de Revisión
                </h3>
                <p className="text-sm text-gray-600">
                  Revisa cada sección del documento y acepta o rechaza según
                  corresponda.
                </p>
              </div>

              {/* Lista de Pasos */}
              <div className="space-y-3">
                {documentSections.map((section, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      index === currentStep
                        ? "border-blue-500 bg-blue-50"
                        : acceptedSteps.includes(index)
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    }`}
                    onClick={() => {
                      setCurrentStep(index);
                      setTimeout(() => {
                        scrollToSection(section.anchorId, section.scrollToText);
                      }, 100);
                    }}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          acceptedSteps.includes(index)
                            ? "bg-green-500 text-white"
                            : index === currentStep
                            ? "bg-blue-500 text-white"
                            : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {acceptedSteps.includes(index) ? "✓" : index + 1}
                      </div>
                      <span
                        className={`font-medium ${
                          index === currentStep
                            ? "text-blue-900"
                            : acceptedSteps.includes(index)
                            ? "text-green-900"
                            : "text-gray-700"
                        }`}
                      >
                        {section.title}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 ml-8">
                      {section.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Controles de Navegación */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={handlePreviousStep}
                    disabled={currentStep === 0}
                    className="flex-1"
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleNextStep}
                    disabled={currentStep === documentSections.length - 1}
                    className="flex-1"
                  >
                    Siguiente
                  </Button>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={handleRejectStep}
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Rechazar
                  </Button>
                  <Button
                    onClick={handleAcceptStep}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aceptar esta Sección
                  </Button>
                </div>

                {/* Botón de Aceptar Escritura Completa */}
                {acceptedSteps.length === documentSections.length && (
                  <Button
                    onClick={handleAceptarEscritura}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Aceptar Escritura Completa
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
