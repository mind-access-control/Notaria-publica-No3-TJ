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
      nombre: "JONATHAN RUBEN HERNANDEZ GONZALEZ",
      email: "jon@jon.com",
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
      nombre: "Lic. Carlos López Martínez",
      email: "carlos.lopez@notaria3bc.com",
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
                    Lic. Carlos López Martínez
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
                      carlos.lopez@notaria3bc.com
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
  const [comments, setComments] = useState<
    Array<{
      id: string;
      text: string;
      comment: string;
      position: { top: number; left: number };
      timestamp: string;
      author: string;
      replies: Array<{
        id: string;
        comment: string;
        author: string;
        timestamp: string;
      }>;
      isEditing?: boolean;
      isReplying?: boolean;
      isResolved?: boolean;
    }>
  >([]);
  const [selectedText, setSelectedText] = useState<string>("");
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentPosition, setCommentPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const [showCommentViewModal, setShowCommentViewModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState<{
    id: string;
    text: string;
    comment: string;
    position: { top: number; left: number };
    timestamp: string;
  } | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(
    null
  );
  const [editText, setEditText] = useState<string>("");
  const [replyText, setReplyText] = useState<string>("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId) {
        const target = event.target as HTMLElement;
        if (!target.closest(".comment-menu")) {
          setOpenMenuId(null);
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [openMenuId, isOpen]);

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

  // Función para manejar la selección de texto
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const selectedText = selection.toString().trim();
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Calcular posición relativa al documento con mayor precisión
      if (documentRef) {
        const containerRect = documentRef.getBoundingClientRect();
        const position = {
          top: rect.top - containerRect.top + documentRef.scrollTop,
          left: rect.left - containerRect.left,
        };

        console.log("Posición calculada:", position);
        console.log("Scroll actual:", documentRef.scrollTop);

        setSelectedText(selectedText);
        setCommentPosition(position);
        setShowCommentModal(true);
      }
    }
  };

  // Función para agregar comentario
  const handleAddComment = (commentText: string) => {
    if (commentText.trim()) {
      const commentId = `comment-${Date.now()}`;

      // Obtener contexto más amplio para mayor precisión
      let contextText = selectedText;
      if (documentRef) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const container = range.commonAncestorContainer;

          // Obtener texto del párrafo completo
          let paragraphText = "";
          if (container.nodeType === Node.TEXT_NODE) {
            paragraphText = container.textContent || "";
          } else {
            paragraphText = container.textContent || "";
          }

          // Usar más contexto si es posible
          if (paragraphText.length > selectedText.length) {
            contextText = paragraphText.substring(
              0,
              Math.min(200, paragraphText.length)
            );
          }
        }
      }

      const newComment = {
        id: commentId,
        text: selectedText,
        context: contextText, // Agregar contexto
        comment: commentText,
        position: commentPosition,
        timestamp: new Date().toLocaleString("es-MX"),
        author: "JONATHAN RUBEN HERNANDEZ GONZALEZ",
        replies: [],
        isEditing: false,
        isReplying: false,
      };

      setComments([...comments, newComment]);
      setShowCommentModal(false);
      setSelectedText("");

      // Limpiar selección
      window.getSelection()?.removeAllRanges();
    }
  };

  // Función para eliminar comentario
  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter((comment) => comment.id !== commentId));
    setOpenMenuId(null); // Cerrar menú
  };

  // Función para agregar respuesta
  const handleAddReply = (commentId: string) => {
    if (replyText.trim()) {
      const newReply = {
        id: Date.now().toString(),
        comment: replyText,
        author: "JONATHAN RUBEN HERNANDEZ GONZALEZ",
        timestamp: new Date().toLocaleString("es-MX"),
      };

      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: [...comment.replies, newReply],
                isReplying: false,
              }
            : comment
        )
      );

      setReplyText("");
      setReplyingToCommentId(null);
    }
  };

  // Función para editar comentario
  const handleEditComment = (commentId: string) => {
    const comment = comments.find((c) => c.id === commentId);
    if (comment) {
      setEditText(comment.comment);
      setEditingCommentId(commentId);
      setOpenMenuId(null); // Cerrar menú
    }
  };

  // Función para guardar edición
  const handleSaveEdit = (commentId: string) => {
    if (editText.trim()) {
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, comment: editText, isEditing: false }
            : comment
        )
      );

      setEditText("");
      setEditingCommentId(null);
    }
  };

  // Función para cancelar edición
  const handleCancelEdit = () => {
    setEditText("");
    setEditingCommentId(null);
  };

  // Función para cancelar respuesta
  const handleCancelReply = () => {
    setReplyText("");
    setReplyingToCommentId(null);
  };

  // Función para abrir/cerrar menú
  const handleToggleMenu = (commentId: string) => {
    setOpenMenuId(openMenuId === commentId ? null : commentId);
  };

  // Función para cerrar menú
  const handleCloseMenu = () => {
    setOpenMenuId(null);
  };

  // Función para marcar comentario como resuelto
  const handleResolveComment = (commentId: string) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId ? { ...comment, isResolved: true } : comment
      )
    );
    setOpenMenuId(null);
  };

  // Función para navegar a un comentario específico (solo navegación, sin modal)
  const handleNavigateToComment = (comment: {
    id: string;
    text: string;
    comment: string;
    position: { top: number; left: number };
    timestamp: string;
  }) => {
    if (documentRef) {
      console.log("Navegando a comentario:", comment.text);
      console.log("ID del comentario:", comment.id);
      console.log("Contexto:", (comment as any).context);

      // Buscar el elemento ancla en el documento
      const anchorElement = documentRef.querySelector(`#${comment.id}`);

      if (anchorElement) {
        console.log("Ancla encontrada, haciendo scroll");

        // Hacer scroll al elemento ancla
        anchorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });

        // Resaltar temporalmente el texto después del scroll
        setTimeout(() => {
          const originalHTML = documentRef.innerHTML;
          const highlightedHTML = originalHTML.replace(
            new RegExp(
              `(${comment.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
              "gi"
            ),
            '<mark class="bg-yellow-400 px-1 py-0.5 rounded font-bold border-2 border-yellow-500 animate-pulse">$1</mark>'
          );

          documentRef.innerHTML = highlightedHTML;

          // Remover el resaltado después de 3 segundos
          setTimeout(() => {
            documentRef.innerHTML = originalHTML;
          }, 3000);
        }, 500);

        // Abrir el comentario en modal después del scroll
        setTimeout(() => {
          setSelectedComment(comment);
          setShowCommentViewModal(true);
        }, 800);
      } else {
        console.log("Ancla no encontrada, usando búsqueda por contexto");

        // Intentar búsqueda por contexto primero
        const contextText = (comment as any).context || comment.text;
        const walker = document.createTreeWalker(
          documentRef,
          NodeFilter.SHOW_TEXT,
          null
        );

        let node;
        let found = false;

        while ((node = walker.nextNode())) {
          if (node.textContent?.includes(contextText)) {
            console.log("Contexto encontrado, haciendo scroll");

            // Crear rango para el contexto encontrado
            const textIndex = node.textContent.indexOf(contextText);
            if (textIndex !== -1) {
              const range = document.createRange();
              range.setStart(node, textIndex);
              range.setEnd(node, textIndex + contextText.length);

              const rect = range.getBoundingClientRect();
              const containerRect = documentRef.getBoundingClientRect();
              const scrollTop =
                documentRef.scrollTop + rect.top - containerRect.top - 150;

              documentRef.scrollTo({
                top: Math.max(0, scrollTop),
                behavior: "smooth",
              });
            }

            found = true;
            break;
          }
        }

        // Si no encuentra contexto, usar posición guardada
        if (!found) {
          console.log("Contexto no encontrado, usando posición guardada");
          documentRef.scrollTo({
            top: comment.position.top - 150,
            behavior: "smooth",
          });
        }

        // Abrir el comentario en modal después del scroll
        setTimeout(() => {
          setSelectedComment(comment);
          setShowCommentViewModal(true);
        }, 800);
      }
    }
  };

  // Función para mostrar comentario en modal (solo para marcadores del documento)
  const handleShowCommentModal = (comment: {
    id: string;
    text: string;
    comment: string;
    position: { top: number; left: number };
    timestamp: string;
  }) => {
    setSelectedComment(comment);
    setShowCommentViewModal(true);
  };

  const highlightText = (text: string) => {
    // Resaltar datos importantes sin animación ni salto automático
    const importantData = [
      "INSTRUMENTO NÚMERO TREINTA Y DOS MIL SEISCIENTOS OCHENTA Y NUEVE",
      "JONATHAN RUBEN HERNANDEZ GONZALEZ",
      "853,500.00",
      "OCHOCIENTOS CINCUENTA Y TRES MIL QUINIENTOS PESOS",
      "la vivienda de interés social marcada con el número **UNO**",
    ];

    let result = text;

    // Primero agregar anclas de comentarios existentes usando contexto
    // Solo procesar comentarios activos (no resueltos)
    const activeComments = comments.filter((comment) => !comment.isResolved);

    activeComments.forEach((comment) => {
      // Usar contexto si está disponible, sino usar texto seleccionado
      const searchText = (comment as any).context || comment.text;
      const escapedText = searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${escapedText})`, "gi");

      // Buscar la primera ocurrencia del contexto completo
      const match = result.match(regex);
      if (match) {
        // Reemplazar solo la primera ocurrencia para mayor precisión
        result = result.replace(
          regex,
          `<span id="${comment.id}" class="comment-anchor"></span>$1`
        );
      } else {
        // Fallback al texto seleccionado si no encuentra contexto
        const escapedSelectedText = comment.text.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        );
        const selectedRegex = new RegExp(`(${escapedSelectedText})`, "gi");
        result = result.replace(
          selectedRegex,
          `<span id="${comment.id}" class="comment-anchor"></span>$1`
        );
      }
    });

    // Luego resaltar datos importantes
    importantData.forEach((data) => {
      const escapedData = data.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${escapedData})`, "gi");
      result = result.replace(
        regex,
        '<mark class="bg-yellow-300 px-1 py-0.5 rounded font-semibold border border-yellow-400">$1</mark>'
      );
    });

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
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
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

        {/* Panel de Pasos de Revisión */}
        <div className="p-4 border-b bg-white">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {documentSections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    index === currentStep
                      ? "bg-blue-100 text-blue-700 border border-blue-300"
                      : acceptedSteps.includes(index)
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {index + 1}. {section.title.split(" ")[0]}
                </button>
              ))}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousStep}
                disabled={currentStep === 0}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextStep}
                disabled={currentStep === documentSections.length - 1}
              >
                Siguiente
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRejectStep}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Rechazar
              </Button>
              <Button
                size="sm"
                onClick={handleAcceptStep}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Aceptar
              </Button>
            </div>
          </div>

          {/* Botón de Aceptar Escritura Completa */}
          {acceptedSteps.length === documentSections.length && (
            <div className="mt-4 text-center">
              <Button
                onClick={handleAceptarEscritura}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Aceptar Escritura Completa
              </Button>
            </div>
          )}
        </div>

        {/* Contenido del Modal */}
        <div className="flex flex-1 overflow-hidden">
          {/* Panel Izquierdo - Documento */}
          <div className="flex-1 p-1 overflow-auto bg-gray-50 relative">
            <div
              ref={setDocumentRef}
              className="bg-white p-3 min-h-[3000px] rounded-lg shadow-sm relative"
              dangerouslySetInnerHTML={{
                __html: highlightText(fullDocument),
              }}
              style={{ whiteSpace: "pre-line" }}
              onMouseUp={handleTextSelection}
            />
            <style jsx>{`
              .comment-anchor {
                display: inline !important;
                position: relative !important;
                width: 0 !important;
                height: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                background: none !important;
                visibility: hidden !important;
              }
            `}</style>

            {/* Marcadores de comentarios */}
            {comments
              .filter((comment) => !comment.isResolved)
              .map((comment) => (
                <div
                  key={comment.id}
                  className="absolute w-4 h-4 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 transition-colors shadow-lg"
                  style={{
                    top: comment.position.top,
                    left: comment.position.left,
                  }}
                  title={`Comentario: ${comment.comment.substring(0, 50)}...`}
                  onClick={() => handleShowCommentModal(comment)}
                />
              ))}
          </div>

          {/* Panel Derecho - Comentarios estilo Google Docs */}
          <div className="w-80 border-l bg-white overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Comentarios ({comments.length})
              </h3>

              {comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay comentarios aún</p>
                  <p className="text-sm mt-1">
                    Selecciona texto para agregar comentarios
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments
                    .filter((comment) => !comment.isResolved)
                    .map((comment) => (
                      <div
                        key={comment.id}
                        className="border border-gray-200 rounded-lg p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleNavigateToComment(comment)}
                      >
                        {/* Información del autor */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {comment.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .substring(0, 2)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {comment.author}
                              </p>
                              <p className="text-xs text-gray-500">
                                {comment.timestamp}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleResolveComment(comment.id);
                              }}
                              className="text-green-600 hover:text-green-800 p-1"
                              title="Marcar el debate como resuelto y ocultarlo"
                            >
                              ✓
                            </button>
                            <div className="relative comment-menu">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleMenu(comment.id);
                                }}
                                className="text-gray-400 hover:text-gray-600 p-1"
                                title="Más opciones"
                              >
                                ⋮
                              </button>
                              {openMenuId === comment.id && (
                                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-32">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditComment(comment.id);
                                    }}
                                    className="block w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    Editar
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteComment(comment.id);
                                    }}
                                    className="block w-full text-left px-3 py-1 text-sm text-red-600 hover:bg-gray-100"
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Texto comentado */}
                        <div className="bg-yellow-100 border border-yellow-300 rounded p-2 mb-2">
                          <p className="text-sm text-gray-800 italic">
                            "{comment.text}"
                          </p>
                        </div>

                        {/* Comentario */}
                        {editingCommentId === comment.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded text-sm"
                              rows={2}
                              autoFocus
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleSaveEdit(comment.id)}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                              >
                                Guardar
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-800 mb-2">
                            {comment.comment}
                          </p>
                        )}

                        {/* Respuestas */}
                        {comment.replies.length > 0 && (
                          <div className="ml-4 space-y-2">
                            {comment.replies.map((reply) => (
                              <div
                                key={reply.id}
                                className="bg-white border border-gray-200 rounded p-2"
                              >
                                <div className="flex items-center space-x-2 mb-1">
                                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                    {reply.author
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .substring(0, 2)}
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-gray-900">
                                      {reply.author}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {reply.timestamp}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-800">
                                  {reply.comment}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Campo de respuesta */}
                        {replyingToCommentId === comment.id ? (
                          <div className="mt-2 space-y-2">
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Responde o añade a otros con @"
                              className="w-full p-2 border border-gray-300 rounded text-sm"
                              rows={2}
                              autoFocus
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleAddReply(comment.id)}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                              >
                                Responder
                              </button>
                              <button
                                onClick={handleCancelReply}
                                className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setReplyingToCommentId(comment.id)}
                            className="text-sm text-blue-600 hover:text-blue-800 mt-1"
                          >
                            Responder
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Comentarios - Popup Pequeño */}
      {showCommentModal && (
        <div className="fixed inset-0 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg p-4 w-80 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Agregar Comentario
            </h3>

            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-2">Texto seleccionado:</p>
              <div className="bg-gray-100 p-2 rounded text-sm italic">
                "{selectedText}"
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tu comentario:
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded text-sm"
                rows={3}
                placeholder="Escribe tu comentario aquí..."
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    const textarea = e.target as HTMLTextAreaElement;
                    handleAddComment(textarea.value);
                  }
                }}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowCommentModal(false);
                  setSelectedText("");
                  window.getSelection()?.removeAllRanges();
                }}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  const textarea = document.querySelector(
                    "textarea"
                  ) as HTMLTextAreaElement;
                  handleAddComment(textarea.value);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Agregar
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Tip: Presiona Ctrl+Enter para agregar rápidamente
            </p>
          </div>
        </div>
      )}

      {/* Modal para Ver Comentario - Popup Pequeño */}
      {showCommentViewModal && selectedComment && (
        <div className="fixed inset-0 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg p-4 w-80 max-w-sm mx-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Comentario
              </h3>
              <button
                onClick={() => {
                  setShowCommentViewModal(false);
                  setSelectedComment(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>

            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1">Texto comentado:</p>
              <div className="bg-yellow-100 p-2 rounded border border-yellow-300">
                <p className="text-sm font-medium text-gray-800">
                  "{selectedComment.text}"
                </p>
              </div>
            </div>

            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1">Comentario:</p>
              <div className="bg-gray-50 p-2 rounded border border-gray-200">
                <p className="text-sm text-gray-800">
                  {selectedComment.comment}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {selectedComment.timestamp}
              </span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowCommentViewModal(false);
                    setSelectedComment(null);
                  }}
                >
                  Cerrar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleDeleteComment(selectedComment.id);
                    setShowCommentViewModal(false);
                    setSelectedComment(null);
                  }}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
