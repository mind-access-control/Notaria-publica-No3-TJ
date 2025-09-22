"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSolicitudByNumber, Solicitud } from "@/lib/mock-data";
import { useAuth } from "@/contexts/auth-context";
import { Footer } from "@/components/footer";
import { PaymentModal } from "@/components/payment-modal";
import { useSolicitudesPersistence } from "@/hooks/use-solicitudes-persistence";
import {
  SolicitudPersistente,
  DocumentoPersistente,
  indexedDBPersistence,
} from "@/lib/indexeddb-persistence";
import {
  DollarSign,
  CheckCircle,
  FileText,
  Upload,
  Clock,
  AlertCircle,
} from "lucide-react";

interface Documento {
  id: string;
  nombre: string;
  descripcion: string;
  requerido: boolean;
  subido: boolean;
  archivo: File | null;
  datosExtraidos: any;
  fechaSubida: string | null;
}

const PASOS_FLUJO = [
  {
    id: "entrada_asesoria",
    titulo: "Entrada y Asesoría Inicial",
    descripcion: "Recepción inicial y orientación sobre el trámite",
    completado: true,
  },
  {
    id: "inicio_registro",
    titulo: "Inicio de Trámite y Registro",
    descripcion: "Creación de expediente y registro de datos básicos",
    completado: true,
  },
  {
    id: "carga_documentos",
    titulo: "Carga de Documentos y Extracción de Datos",
    descripcion: "Subida de documentos con OCR y validación automática",
    completado: false,
    activo: true,
  },
  {
    id: "validacion_prepago",
    titulo: "Validación y Pre-pago",
    descripcion:
      "Confirmación de costos y pago inicial para activar el trámite",
    completado: false,
  },
  {
    id: "validacion_licenciado",
    titulo: "Validación por Licenciado",
    descripcion: "Revisión y validación de documentos por el equipo legal",
    completado: false,
  },
  {
    id: "preparacion_escritura",
    titulo: "Preparación de Escritura",
    descripcion: "Elaboración del documento notarial",
    completado: false,
  },
  {
    id: "firma_notarial",
    titulo: "Firma Notarial",
    descripcion: "Firma del documento ante el notario",
    completado: false,
  },
  {
    id: "registro_propiedad",
    titulo: "Registro en RPPC",
    descripcion: "Inscripción en el Registro Público de la Propiedad",
    completado: false,
  },
];

const DOCUMENTOS_COMPRAVENTA: Omit<
  Documento,
  "subido" | "archivo" | "datosExtraidos" | "fechaSubida"
>[] = [
  {
    id: "ine_comprador",
    nombre: "INE del Comprador",
    descripcion: "Identificación oficial vigente del comprador",
    requerido: true,
  },
  {
    id: "ine_vendedor",
    nombre: "INE del Vendedor",
    descripcion: "Identificación oficial vigente del vendedor",
    requerido: true,
  },
  {
    id: "avaluo",
    nombre: "Avalúo del Inmueble",
    descripcion: "Avalúo comercial vigente del inmueble",
    requerido: true,
  },
  {
    id: "escritura",
    nombre: "Escritura Pública",
    descripcion: "Escritura pública de propiedad del vendedor",
    requerido: true,
  },
  {
    id: "clg",
    nombre: "Certificado de Libertad de Gravamen",
    descripcion: "CLG actualizado del inmueble",
    requerido: true,
  },
  {
    id: "comprobantes_pago",
    nombre: "Comprobantes de Pago",
    descripcion: "Comprobantes del acuerdo privado de compraventa",
    requerido: true,
  },
];

export default function SolicitudStatusPage() {
  const params = useParams();
  const router = useRouter();
  const numeroSolicitud = params.numeroSolicitud as string;
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    canAccessSolicitud,
    logout,
  } = useAuth();

  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [solicitudPersistente, setSolicitudPersistente] =
    useState<SolicitudPersistente | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);

  // Hook para persistencia
  const {
    loadSolicitud,
    updateDocumentos,
    addPago,
    updateEstado,
    addHistorial,
    createSolicitud,
  } = useSolicitudesPersistence();
  const [documentos, setDocumentos] = useState<Documento[]>(
    DOCUMENTOS_COMPRAVENTA.map((doc) => ({
      ...doc,
      subido: false,
      archivo: null,
      datosExtraidos: null,
      fechaSubida: null,
    }))
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Documento | null>(null);
  const [showFileInput, setShowFileInput] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("documentos");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);
  const [tempData, setTempData] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchSolicitud = async () => {
      if (authLoading) return;

      if (!isAuthenticated) {
        router.push(
          `/login?redirect=${encodeURIComponent(window.location.pathname)}`
        );
        return;
      }

      if (!canAccessSolicitud(numeroSolicitud)) {
        setAccessDenied(true);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Cargar datos persistentes usando el hook
        let dataPersistente = await loadSolicitud(numeroSolicitud);

        // Si no existe la solicitud, crear una nueva
        if (!dataPersistente) {
          await createSolicitud(numeroSolicitud, "compraventa", 25000);
          dataPersistente = await loadSolicitud(numeroSolicitud);
        }

        if (dataPersistente) {
          setSolicitudPersistente(dataPersistente);

          // Convertir documentos persistentes a formato local
          const documentosLocales = dataPersistente.documentos.map(
            (docPersistente) => ({
              id: docPersistente.id,
              nombre: docPersistente.nombre,
              descripcion: docPersistente.descripcion,
              requerido: docPersistente.requerido,
              subido: docPersistente.subido,
              archivo: docPersistente.archivoBase64
                ? indexedDBPersistence.base64ToFile(
                    docPersistente.archivoBase64,
                    docPersistente.nombre,
                    "application/pdf"
                  )
                : null,
              datosExtraidos: docPersistente.datosExtraidos,
              fechaSubida: docPersistente.fechaSubida,
            })
          );

          setDocumentos(documentosLocales);

          // Actualizar estado de pago si existe
          if (dataPersistente.pagos && dataPersistente.pagos.length > 0) {
            setPaymentCompleted(dataPersistente.saldoPendiente === 0);
          }
        }

        // También cargar datos mock para compatibilidad (solo si no hay datos persistentes)
        if (!dataPersistente) {
          const data = await getSolicitudByNumber(numeroSolicitud);
          if (data) {
            setSolicitud(data);
          } else {
            setError("Solicitud no encontrada");
          }
        } else {
          // Si tenemos datos persistentes, crear datos mock básicos para compatibilidad
          const mockData = {
            numeroSolicitud: dataPersistente.numeroSolicitud,
            tipoTramite: dataPersistente.tipoTramite,
            fechaCreacion: dataPersistente.fechaCreacion,
            costoTotal: dataPersistente.costoTotal,
            saldoPendiente: dataPersistente.saldoPendiente,
            estatusActual: dataPersistente.estado,
            documentosRequeridos: dataPersistente.documentos,
            fechaUltimaActualizacion: dataPersistente.ultimaActualizacion,
          };
          setSolicitud(mockData as any);
        }
      } catch (err) {
        setError("Error al cargar la solicitud");
        console.error("Error fetching solicitud:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (numeroSolicitud) {
      fetchSolicitud();
    }
  }, [
    numeroSolicitud,
    isAuthenticated,
    authLoading,
    canAccessSolicitud,
    router,
  ]);

  // Efecto para detectar cuando todos los documentos estén completos
  useEffect(() => {
    const documentosRequeridos = documentos.filter((doc) => doc.requerido);
    const documentosCompletos = documentosRequeridos.filter(
      (doc) => doc.subido
    );

    // Solo activar si hay documentos completos (no en el estado inicial)
    // y todos los documentos requeridos están subidos
    if (
      documentosCompletos.length === documentosRequeridos.length &&
      documentosRequeridos.length > 0 &&
      documentosCompletos.length > 0 && // Asegurar que hay al menos un documento subido
      PASOS_FLUJO[2].activo
    ) {
      updateFlujoDocumentosCompletos();
    }
  }, [documentos]);

  const handleFileUpload = (documentoId: string, file: File) => {
    // Simular extracción de datos con OCR
    const datosSimulados = {
      ine_comprador: {
        nombre: "Juan Carlos",
        apellidoPaterno: "Pérez",
        apellidoMaterno: "García",
        fechaNacimiento: "1985-03-15",
        domicilio: "Calle Principal 123, Col. Centro, Tijuana, BC",
        folio: "ABC123456789",
        curp: "PEGJ850315HBCRRN01",
      },
      ine_vendedor: {
        nombre: "María Elena",
        apellidoPaterno: "López",
        apellidoMaterno: "Martínez",
        fechaNacimiento: "1978-07-22",
        domicilio: "Av. Revolución 456, Col. Zona Centro, Tijuana, BC",
        folio: "DEF987654321",
        curp: "LOMM780722MBCPRR02",
      },
      avaluo: {
        claveCatastral: "001-123-456-789",
        valorComercial: 2500000,
        propietario: "María Elena López Martínez",
        direccion: "Av. Revolución 456, Col. Zona Centro, Tijuana, BC",
        superficie: "120 m²",
        fechaAvaluo: "2025-01-10",
      },
      escritura: {
        numeroEscritura: "12345",
        libro: "150",
        folio: "789",
        propietario: "María Elena López Martínez",
        descripcion: "Casa habitación de 2 plantas, 3 recámaras, 2 baños",
        fechaEscritura: "2010-05-15",
      },
      clg: {
        folio: "CLG-2025-001",
        propietario: "María Elena López Martínez",
        gravamen: "Sin gravamen",
        fechaEmision: "2025-01-08",
      },
      comprobantes_pago: {
        montoTotal: 2500000,
        montoPagado: 1500000,
        saldoPendiente: 1000000,
        metodoPago: "Transferencia bancaria",
        referencia: "TRF-2025-001234",
      },
    };

    setDocumentos((prev) => {
      const nuevosDocumentos = prev.map((doc) =>
        doc.id === documentoId
          ? {
              ...doc,
              subido: true,
              archivo: file,
              datosExtraidos:
                datosSimulados[documentoId as keyof typeof datosSimulados] ||
                null,
              fechaSubida: new Date().toISOString(),
            }
          : doc
      );

      // Guardar documentos persistentemente
      if (numeroSolicitud) {
        const documentosPersistentes = nuevosDocumentos.map((doc) => ({
          id: doc.id,
          nombre: doc.nombre,
          descripcion: doc.descripcion,
          requerido: doc.requerido,
          subido: doc.subido,
          fechaSubida: doc.fechaSubida,
          datosExtraidos: doc.datosExtraidos,
          archivoBase64: doc.archivo ? undefined : undefined, // Se guardará después
        }));

        // Convertir archivo a base64 y guardar
        if (file) {
          indexedDBPersistence.fileToBase64(file).then((base64) => {
            const docPersistente = documentosPersistentes.find(
              (d) => d.id === documentoId
            );
            if (docPersistente) {
              docPersistente.archivoBase64 = base64;
            }
            updateDocumentos(numeroSolicitud, documentosPersistentes);
          });
        } else {
          updateDocumentos(numeroSolicitud, documentosPersistentes);
        }

        // Agregar al historial
        addHistorial(numeroSolicitud, {
          id: `hist-${Date.now()}`,
          fecha: new Date().toISOString(),
          accion: "Documento subido",
          detalles: `Se subió el documento: ${
            nuevosDocumentos.find((d) => d.id === documentoId)?.nombre
          }`,
          usuario: "Cliente",
        });
      }

      // Verificar si todos los documentos están completos después de esta actualización
      const documentosRequeridos = nuevosDocumentos.filter(
        (doc) => doc.requerido
      );
      const documentosCompletos = documentosRequeridos.filter(
        (doc) => doc.subido
      );

      if (
        documentosCompletos.length === documentosRequeridos.length &&
        documentosRequeridos.length > 0 &&
        documentosCompletos.length > 0 && // Asegurar que hay al menos un documento subido
        PASOS_FLUJO[2].activo
      ) {
        // Usar setTimeout para asegurar que el estado se actualice primero
        setTimeout(() => {
          updateFlujoDocumentosCompletos();
        }, 100);
      }

      return nuevosDocumentos;
    });
    setShowFileInput(null);
  };

  const handleViewDocument = (documento: Documento) => {
    setSelectedDoc(documento);
    setShowModal(true);
  };

  const handleFileInputChange = (
    documentoId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(documentoId, file);
    }
  };

  const calcularProgreso = () => {
    const documentosSubidos = documentos.filter((doc) => doc.subido).length;
    const progresoDocumentos = Math.round(
      (documentosSubidos / documentos.length) * 100
    );

    // Si el pago está completo, el progreso es 100%
    if (paymentCompleted) {
      return 100;
    }

    // Si los documentos están completos pero no hay pago, mostrar 60%
    // (paso 3 completado, paso 4 activo)
    if (documentosSubidos === documentos.length) {
      return 60;
    }

    return progresoDocumentos;
  };

  const getPasoActual = () => {
    return PASOS_FLUJO.find((paso) => paso.activo) || PASOS_FLUJO[2];
  };

  const handleEditData = (documento: Documento) => {
    setEditingData(documento);
    setTempData({ ...documento.datosExtraidos });
    setShowEditModal(true);
    setShowModal(false);
  };

  const handleSaveData = () => {
    if (editingData && tempData) {
      const documentoActualizado = { ...editingData, datosExtraidos: tempData };

      setDocumentos((prev) =>
        prev.map((doc) =>
          doc.id === editingData.id ? documentoActualizado : doc
        )
      );

      // Actualizar el selectedDoc para que muestre los datos corregidos
      setSelectedDoc(documentoActualizado);

      setShowEditModal(false);
      setEditingData(null);
      setTempData(null);
      // Regresar al modal de visualización del documento
      setShowModal(true);
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingData(null);
    setTempData(null);
    // Regresar al modal de visualización del documento
    setShowModal(true);
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    setPaymentCompleted(true);

    // Guardar pago persistentemente
    if (numeroSolicitud) {
      addPago(numeroSolicitud, {
        id: `pago-${Date.now()}`,
        monto: paymentData.monto,
        metodo: paymentData.metodo,
        referencia: paymentData.referencia,
        tipo: paymentData.tipo,
        fecha: new Date().toISOString(),
        estado: "confirmado",
      });

      // Actualizar estado de la solicitud
      updateEstado(numeroSolicitud, "EN_REVISION_ABOGADO");
    }

    // Actualizar el estado de los pasos
    updateFlujoPasos();

    // Mostrar modal de éxito
    setShowSuccessModal(true);

    // Redirigir después de 5 segundos
    setTimeout(() => {
      router.push("/mi-cuenta");
    }, 5000);
  };

  const updateFlujoPasos = () => {
    // Marcar paso 4 (validacion_prepago) como completado
    PASOS_FLUJO[3].completado = true;
    PASOS_FLUJO[3].activo = false;

    // Activar paso 5 (validacion_licenciado)
    PASOS_FLUJO[4].activo = true;
  };

  const updateFlujoDocumentosCompletos = () => {
    // Marcar paso 3 (carga_documentos) como completado
    PASOS_FLUJO[2].completado = true;
    PASOS_FLUJO[2].activo = false;

    // Activar paso 4 (validacion_prepago)
    PASOS_FLUJO[3].activo = true;
  };

  const canProceedToPayment = () => {
    const documentosRequeridos = documentos.filter((doc) => doc.requerido);
    const documentosCompletos = documentosRequeridos.filter(
      (doc) => doc.subido
    );
    return documentosCompletos.length === documentosRequeridos.length;
  };

  const updateField = (field: string, value: string) => {
    setTempData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Acceso Denegado
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              No tienes permisos para acceder a esta solicitud
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !solicitud) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600">
              {error || "No se pudo cargar la información"}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">N</span>
              </div>
              <div className="text-lg font-bold text-gray-900">
                Notaría Pública No. 3
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.role}</span>
              <button
                onClick={async () => {
                  await logout();
                  router.push("/");
                }}
                className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header de la solicitud */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-emerald-600 font-bold text-lg">📄</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Trámite de Compraventa
                </h1>
                <p className="text-gray-600">
                  Solicitud: {solicitud.numeroSolicitud}
                </p>
              </div>
            </div>
          </div>

          {/* Progreso del flujo */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Progreso del Trámite</h2>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${calcularProgreso()}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{calcularProgreso()}% completado</span>
              <span>
                {documentos.filter((doc) => doc.subido).length} de{" "}
                {documentos.length} documentos
              </span>
            </div>

            {/* Pasos del flujo horizontal compacto */}
            <div className="mt-6">
              <div className="flex items-center justify-between relative">
                {/* Línea conectora */}
                <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>

                {PASOS_FLUJO.map((paso, index) => (
                  <div
                    key={paso.id}
                    className="flex flex-col items-center relative z-10"
                  >
                    {/* Icono circular */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        paso.completado
                          ? "bg-green-500 border-green-500 text-white"
                          : paso.activo
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "bg-gray-100 border-gray-300 text-gray-400"
                      }`}
                    >
                      {paso.completado ? (
                        <span className="text-lg font-bold">✓</span>
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>

                    {/* Contenido del paso */}
                    <div className="mt-3 text-center max-w-32">
                      <h4
                        className={`text-xs font-semibold mb-1 ${
                          paso.completado
                            ? "text-green-700"
                            : paso.activo
                            ? "text-blue-700"
                            : "text-gray-500"
                        }`}
                      >
                        {paso.titulo}
                      </h4>
                      <p
                        className={`text-xs leading-tight ${
                          paso.completado
                            ? "text-green-600"
                            : paso.activo
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      >
                        {paso.descripcion}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Estado actual destacado */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {PASOS_FLUJO.findIndex((p) => p.activo) + 1}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800">
                      Estado actual: {getPasoActual().titulo}
                    </h4>
                    <p className="text-sm text-blue-600">
                      {getPasoActual().descripcion}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs de navegación */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab("documentos")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "documentos"
                      ? "border-emerald-500 text-emerald-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  📄 Documentos
                </button>
                <button
                  onClick={() => setActiveTab("seguimiento")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "seguimiento"
                      ? "border-emerald-500 text-emerald-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  🔔 Seguimiento y Notificaciones
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Tab: Documentos */}
              {activeTab === "documentos" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Documentos Requeridos
                  </h3>

                  {/* Carga masiva - PRIMERO */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-emerald-800 mb-1">
                          🚀 Carga Masiva
                        </h4>
                        <p className="text-sm text-emerald-600">
                          Sube todos los documentos de una vez - Selecciona
                          múltiples archivos
                        </p>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          files.forEach((file, index) => {
                            const documento = documentos[index];
                            if (documento && !documento.subido) {
                              handleFileUpload(documento.id, file);
                            }
                          });

                          // Verificar si todos los documentos están completos después de la carga masiva
                          setTimeout(() => {
                            const documentosRequeridos = documentos.filter(
                              (doc) => doc.requerido
                            );
                            const documentosCompletos =
                              documentosRequeridos.filter((doc) => doc.subido);

                            if (
                              documentosCompletos.length ===
                                documentosRequeridos.length &&
                              documentosRequeridos.length > 0 &&
                              documentosCompletos.length > 0 && // Asegurar que hay al menos un documento subido
                              PASOS_FLUJO[2].activo
                            ) {
                              updateFlujoDocumentosCompletos();
                            }
                          }, 1000); // Esperar 1 segundo para que se procesen todos los archivos
                        }}
                        className="hidden"
                        id="bulk-upload"
                      />
                      <label
                        htmlFor="bulk-upload"
                        className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer font-medium shadow-md transition-all duration-200 hover:shadow-lg"
                      >
                        📁 Subir Todos
                      </label>
                    </div>
                  </div>

                  {/* Documentos individuales */}
                  <div className="space-y-4">
                    {documentos.map((documento) => (
                      <div
                        key={documento.id}
                        className={`p-4 border rounded-lg transition-all duration-200 ${
                          documento.subido
                            ? "border-green-500 bg-green-50 shadow-sm"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">
                              {documento.subido ? "✅" : "📄"}
                            </span>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {documento.nombre}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {documento.descripcion}
                              </p>
                              {documento.subido && documento.fechaSubida && (
                                <p className="text-xs text-green-600">
                                  Subido:{" "}
                                  {new Date(
                                    documento.fechaSubida
                                  ).toLocaleDateString()}{" "}
                                  a las{" "}
                                  {new Date(
                                    documento.fechaSubida
                                  ).toLocaleTimeString()}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {documento.subido ? (
                              <>
                                <button
                                  onClick={() => handleViewDocument(documento)}
                                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                >
                                  👁️ Ver
                                </button>
                                <button
                                  onClick={() => {
                                    const input = document.getElementById(
                                      `file-${documento.id}`
                                    ) as HTMLInputElement;
                                    input?.click();
                                  }}
                                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                >
                                  🔄 Reemplazar
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => {
                                  const input = document.getElementById(
                                    `file-${documento.id}`
                                  ) as HTMLInputElement;
                                  input?.click();
                                }}
                                className="px-3 py-1 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                              >
                                Subir
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Input de archivo oculto */}
                        <input
                          id={`file-${documento.id}`}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          onChange={(e) =>
                            handleFileInputChange(documento.id, e)
                          }
                          className="hidden"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Botón para proceder al pago */}
                  {canProceedToPayment() && !paymentCompleted && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <DollarSign className="h-8 w-8 text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          ¡Documentos Completados!
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Todos los documentos requeridos han sido subidos y
                          procesados. Ahora puedes proceder con el pago para
                          activar tu solicitud.
                        </p>
                        <button
                          onClick={() => setShowPaymentModal(true)}
                          className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-lg shadow-lg"
                        >
                          Proceder al Pago
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Estado de pago completado */}
                  {paymentCompleted && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          ¡Pago Confirmado!
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Tu solicitud ha sido activada exitosamente. El equipo
                          legal revisará tus documentos y te notificará sobre el
                          siguiente paso.
                        </p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          <CheckCircle className="h-4 w-4" />
                          Solicitud Activa
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Seguimiento y Notificaciones */}
              {activeTab === "seguimiento" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">
                      🔔 Seguimiento y Notificaciones
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600">
                        En tiempo real
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Estado Actual */}
                    <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-6 rounded-lg border border-emerald-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-emerald-800">
                            Estado Actual del Trámite
                          </h4>
                          <p className="text-sm text-emerald-600">
                            {getPasoActual().titulo}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">
                        {getPasoActual().descripcion}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">
                            Progreso: {calcularProgreso()}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">
                            Documentos:{" "}
                            {documentos.filter((doc) => doc.subido).length}/
                            {documentos.length}
                          </span>
                        </div>
                        {paymentCompleted && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">
                              Pago confirmado
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Historial de Actividades */}
                    <div className="bg-white border border-gray-200 rounded-lg">
                      <div className="p-4 border-b border-gray-200">
                        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                          📋 Historial de Actividades
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Todas las acciones realizadas en tu solicitud
                        </p>
                      </div>
                      <div className="p-4 space-y-4">
                        {/* Actividades simuladas */}
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-medium text-gray-900">
                                Solicitud creada exitosamente
                              </h5>
                              <span className="text-xs text-gray-500">
                                {new Date().toLocaleDateString()}{" "}
                                {new Date().toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Tu solicitud {solicitud?.numeroSolicitud} ha sido
                              registrada en el sistema.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <FileText className="h-4 w-4 text-blue-600" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-medium text-gray-900">
                                Documentos requeridos enviados
                              </h5>
                              <span className="text-xs text-gray-500">
                                {new Date().toLocaleDateString()}{" "}
                                {new Date().toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Se han enviado las instrucciones para subir los
                              documentos necesarios.
                            </p>
                          </div>
                        </div>

                        {documentos.filter((doc) => doc.subido).length > 0 && (
                          <div className="flex gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                <Upload className="h-4 w-4 text-emerald-600" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="font-medium text-gray-900">
                                  Documentos subidos (
                                  {
                                    documentos.filter((doc) => doc.subido)
                                      .length
                                  }
                                  )
                                </h5>
                                <span className="text-xs text-gray-500">
                                  {new Date().toLocaleDateString()}{" "}
                                  {new Date().toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                Se han procesado{" "}
                                {documentos.filter((doc) => doc.subido).length}{" "}
                                documentos con OCR.
                              </p>
                            </div>
                          </div>
                        )}

                        {paymentCompleted && (
                          <div className="flex gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <DollarSign className="h-4 w-4 text-green-600" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="font-medium text-gray-900">
                                  Pago confirmado
                                </h5>
                                <span className="text-xs text-gray-500">
                                  {new Date().toLocaleDateString()}{" "}
                                  {new Date().toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                El pago ha sido procesado exitosamente. Tu
                                solicitud está activa.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Próximos pasos */}
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                              <Clock className="h-4 w-4 text-yellow-600" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-medium text-gray-900">
                                Próximo paso
                              </h5>
                              <span className="text-xs text-gray-500">
                                Pendiente
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {paymentCompleted
                                ? "El Licenciado revisará tus documentos y validará la información."
                                : documentos.filter((doc) => doc.subido)
                                    .length === documentos.length
                                ? "Realiza el pago inicial para activar tu solicitud."
                                : "Completa la subida de documentos y realiza el pago inicial."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Notificaciones importantes */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                        <h4 className="font-semibold text-yellow-800">
                          Notificaciones Importantes
                        </h4>
                      </div>
                      <div className="space-y-2 text-sm text-yellow-700">
                        <p>
                          • Recibirás notificaciones por email sobre el progreso
                          de tu trámite
                        </p>
                        <p>
                          • El tiempo estimado de procesamiento es de 7-10 días
                          hábiles
                        </p>
                        <p>• Mantén tus documentos actualizados y vigentes</p>
                        {!paymentCompleted && (
                          <p>
                            • <strong>Acción requerida:</strong> Completa el
                            pago para activar tu solicitud
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Modal para ver documento */}
      {showModal && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-7xl h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                📄 {selectedDoc.nombre}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Información del archivo */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-gray-800">
                  📋 Información del Archivo
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 font-medium">Nombre:</span>
                    <p className="font-semibold text-gray-900">
                      {selectedDoc.archivo?.name || selectedDoc.nombre}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Tamaño:</span>
                    <p className="font-semibold text-gray-900">
                      {selectedDoc.archivo
                        ? `${(selectedDoc.archivo.size / 1024 / 1024).toFixed(
                            2
                          )} MB`
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Tipo:</span>
                    <p className="font-semibold text-gray-900">
                      {selectedDoc.archivo?.type || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Fecha:</span>
                    <p className="font-semibold text-gray-900">
                      {selectedDoc.fechaSubida
                        ? new Date(
                            selectedDoc.fechaSubida
                          ).toLocaleDateString() +
                          " " +
                          new Date(selectedDoc.fechaSubida).toLocaleTimeString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vista previa del archivo */}
              {selectedDoc.archivo && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 text-gray-800">
                    👁️ Vista Previa del Documento
                  </h4>
                  <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                    {selectedDoc.archivo.type.startsWith("image/") ? (
                      <div className="text-center p-4">
                        <img
                          src={URL.createObjectURL(selectedDoc.archivo)}
                          alt="Vista previa del documento"
                          className="max-w-full max-h-[70vh] mx-auto rounded shadow-lg"
                        />
                        <p className="text-sm text-gray-600 mt-3 font-medium">
                          📷 {selectedDoc.archivo.name}
                        </p>
                      </div>
                    ) : selectedDoc.archivo.type === "application/pdf" ? (
                      <div className="w-full h-[70vh]">
                        <iframe
                          src={URL.createObjectURL(selectedDoc.archivo)}
                          className="w-full h-full border-0"
                          title={`Vista previa de ${selectedDoc.archivo.name}`}
                        />
                        <div className="p-3 bg-gray-50 border-t border-gray-200">
                          <p className="text-sm text-gray-600 font-medium">
                            📄 {selectedDoc.archivo.name} -{" "}
                            {(selectedDoc.archivo.size / 1024 / 1024).toFixed(
                              2
                            )}{" "}
                            MB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-6xl text-gray-400 mb-4">📄</div>
                        <p className="text-lg font-medium text-gray-700 mb-2">
                          Documento: {selectedDoc.archivo.name}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          Tipo: {selectedDoc.archivo.type}
                        </p>
                        <p className="text-xs text-gray-500">
                          Tamaño:{" "}
                          {(selectedDoc.archivo.size / 1024 / 1024).toFixed(2)}{" "}
                          MB
                        </p>
                        <p className="text-sm text-gray-500 mt-4">
                          Vista previa no disponible para este tipo de archivo
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Datos extraídos por OCR */}
              {selectedDoc.datosExtraidos && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 text-green-800">
                    🤖 Datos Extraídos por OCR
                  </h4>
                  <div className="space-y-3 text-sm">
                    {Object.entries(selectedDoc.datosExtraidos).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center gap-3 p-2 bg-white rounded border"
                        >
                          <span className="text-gray-600 w-40 font-medium capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}:
                          </span>
                          <span className="font-semibold text-gray-900 flex-1">
                            {String(value)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="flex gap-2">
                  {selectedDoc.archivo && (
                    <button
                      onClick={() => {
                        const url = URL.createObjectURL(selectedDoc.archivo!);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = selectedDoc.archivo!.name;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      📥 Descargar
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={() => handleEditData(selectedDoc)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                  >
                    ✏️ Corregir Datos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edición de datos */}
      {showEditModal && editingData && tempData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                ✏️ Corregir Datos - {editingData.nombre}
              </h2>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Información del documento */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-blue-800">
                  📄 Documento
                </h4>
                <p className="text-blue-700">{editingData.nombre}</p>
                <p className="text-sm text-blue-600">
                  {editingData.descripcion}
                </p>
              </div>

              {/* Formulario de edición */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-4 text-gray-800">
                  🤖 Datos Extraídos por OCR
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(tempData).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}:
                      </label>
                      <input
                        type="text"
                        value={String(value)}
                        onChange={(e) => updateField(key, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder={`Ingresa ${key
                          .replace(/([A-Z])/g, " $1")
                          .trim()
                          .toLowerCase()}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveData}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                >
                  💾 Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pago */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
        expedienteData={{
          numeroSolicitud: solicitud?.numeroSolicitud || "NT3-2025-001",
          tipoTramite: "compraventa",
          costoEstimado: 25000,
          documentosCompletos: documentos.filter((doc) => doc.subido).length,
          documentosRequeridos: documentos.length,
        }}
      />

      {/* Modal de Éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                ¡Solicitud Enviada Exitosamente!
              </h2>
              <p className="text-gray-600 mb-4">
                Tu trámite ha sido asignado a un licenciado quien le dará
                seguimiento profesional.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Próximos pasos:
                </h3>
                <ul className="text-sm text-blue-700 text-left space-y-1">
                  <li>• El licenciado revisará tus documentos</li>
                  <li>• Recibirás notificaciones por email</li>
                  <li>• Podrás seguir el progreso en "Mis Solicitudes"</li>
                  <li>• Tiempo estimado: 7-10 días hábiles</li>
                </ul>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push("/mi-cuenta")}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Ver Mis Solicitudes
                </button>
                <button
                  onClick={() => router.push("/iniciar-tramite")}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Iniciar Nuevo Trámite
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Serás redirigido automáticamente en unos segundos...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
