"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calculator,
  FileText,
  CheckCircle,
  Users,
  Upload,
  Loader2,
  FileCheck,
  Calendar,
  Mail,
  MessageCircle,
} from "lucide-react";
import { tramites as tramitesData, getTramiteById } from "@/lib/tramites-data";

interface TramiteAdviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTramiteId: string;
  onTramiteSelect?: (tramiteId: string) => void;
}

// Usar los datos importados
const tramites = tramitesData;

export function TramiteAdviceModal({
  isOpen,
  onClose,
  selectedTramiteId,
  onTramiteSelect,
}: TramiteAdviceModalProps) {
  const { isAuthenticated } = useAuth();
  const [userInfo, setUserInfo] = useState({
    nombre: "",
    telefono: "",
    email: "",
    tramiteEspecifico: "",
  });
  const [valorInmueble, setValorInmueble] = useState("");
  const [zonaInmueble, setZonaInmueble] = useState("");

  // Estados para preguntas dinámicas
  const [estadoCivil, setEstadoCivil] = useState<string>("");
  const [usarCredito, setUsarCredito] = useState<boolean>(false);
  const [tipoPersona, setTipoPersona] = useState<string>("comprador");

  // Estados para el flujo de upload y análisis de IA
  const [contratoSubido, setContratoSubido] = useState<boolean>(false);
  const [analizandoContrato, setAnalizandoContrato] = useState<boolean>(false);
  const [archivoContrato, setArchivoContrato] = useState<File | null>(null);
  const [mostrarSecciones, setMostrarSecciones] = useState<boolean>(false);

  const tramite = tramites.find((t) => t.id === selectedTramiteId);

  // Limpiar datos obsoletos al abrir el modal
  useEffect(() => {
    if (isOpen && selectedTramiteId) {
      const datosExistentes = JSON.parse(
        localStorage.getItem("arancelesCalculados") || "[]"
      );
      const datosActuales = datosExistentes.find(
        (item: any) => item.tramite === selectedTramiteId
      );

      if (datosActuales) {
        console.log("Cargando datos existentes:", datosActuales);
        setZonaInmueble(datosActuales.zonaInmueble || "");
        setEstadoCivil(datosActuales.estadoCivil || "");
        setUsarCredito(datosActuales.usarCredito || false);
        setTipoPersona(datosActuales.tipoPersona || "comprador");
        setValorInmueble(datosActuales.valorInmueble || "");
      }
    }
  }, [isOpen, selectedTramiteId]);

  const handleWhatsApp = () => {
    const message = `Hola, me interesa hacer un ${
      tramite?.name
    }. Mi nombre es ${userInfo.nombre}, teléfono: ${userInfo.telefono}. ${
      userInfo.tramiteEspecifico
        ? `Detalles: ${userInfo.tramiteEspecifico}`
        : ""
    }`;
    const whatsappUrl = `https://wa.me/526641234567?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleEmail = () => {
    const subject = `Consulta sobre ${tramite?.name}`;
    const body = `Hola,\n\nMe interesa hacer un ${tramite?.name}.\n\nDatos de contacto:\nNombre: ${userInfo.nombre}\nTeléfono: ${userInfo.telefono}\nEmail: ${userInfo.email}\n\nDetalles adicionales:\n${userInfo.tramiteEspecifico}\n\nGracias.`;
    const mailtoUrl = `mailto:contacto@notaria3tijuana.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  // Función para manejar el upload del contrato
  const handleUploadContrato = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleUploadContrato llamado");
    const file = event.target.files?.[0];
    console.log("Archivo seleccionado:", file);
    
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const fileType = file.type;
      
      if (!allowedTypes.includes(fileType)) {
        alert('Por favor selecciona un archivo PDF, DOC o DOCX válido.');
        return;
      }
      
      // Validar tamaño (máximo 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert('El archivo es demasiado grande. El tamaño máximo permitido es 10MB.');
        return;
      }
      
      console.log("Archivo válido, iniciando proceso...");
      setArchivoContrato(file);
      setContratoSubido(true);
      setAnalizandoContrato(true);
      
      // Simular análisis de IA
      setTimeout(() => {
        console.log("Análisis completado, extrayendo datos...");
        // Simular datos extraídos del contrato
        const precioSimulado = "2950000"; // Precio predeterminado
        const estadoCivilSimulado = "casado";
        const tipoPersonaSimulado = "comprador";
        
        // Auto-llenar campos
        setValorInmueble(precioSimulado);
        setEstadoCivil(estadoCivilSimulado);
        setTipoPersona(tipoPersonaSimulado);
        
        setAnalizandoContrato(false);
        setMostrarSecciones(true);
        console.log("Datos extraídos y secciones mostradas");
      }, 3000); // 3 segundos de simulación
    } else {
      console.log("No se seleccionó ningún archivo");
    }
  };

  const handleIniciarTramite = () => {
    // Guardar datos calculados si existen
    if (
      selectedTramiteId &&
      valorInmueble &&
      !isNaN(parseFloat(valorInmueble.replace(/[,$]/g, "")))
    ) {
      const valor = parseFloat(valorInmueble.replace(/[,$]/g, ""));
      const costosCalculados = calcularCostoVariable(
        selectedTramiteId,
        valorInmueble
      );

      if (costosCalculados) {
        console.log(
          "ANTES de crear datosCalculados - estadoCivil:",
          estadoCivil
        );
        console.log(
          "ANTES de crear datosCalculados - usarCredito:",
          usarCredito
        );

        const datosCalculados = {
          tramite: selectedTramiteId,
          valorInmueble: valorInmueble,
          estadoCivil: estadoCivil,
          usarCredito: usarCredito,
          tipoPersona: tipoPersona,
          costosCalculados: costosCalculados,
          fechaCalculo: new Date().toISOString(),
          id: `calc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };

        console.log("Guardando datos desde modal:", datosCalculados);
        console.log("Estado civil:", estadoCivil);
        console.log("Usar crédito:", usarCredito);
        console.log("Valor inmueble:", valorInmueble);

        // Obtener datos existentes y agregar el nuevo
        const datosExistentes = JSON.parse(
          localStorage.getItem("arancelesCalculados") || "[]"
        );
        datosExistentes.push(datosCalculados);
        localStorage.setItem(
          "arancelesCalculados",
          JSON.stringify(datosExistentes)
        );

        console.log(
          "Datos guardados desde modal:",
          localStorage.getItem("arancelesCalculados")
        );
      }
    }

    if (onTramiteSelect) {
      // Si hay callback, usarlo para notificar la selección
      onTramiteSelect(selectedTramiteId);
      onClose();
    } else {
      // Comportamiento original: redirigir a login
      const loginUrl = `/login?tramite=${selectedTramiteId}&redirect=${encodeURIComponent(
        "/iniciar-tramite"
      )}`;
      window.location.href = loginUrl;
    }
  };

  // Función para calcular ISAI (Impuesto Sobre Adquisición de Inmuebles) - Tijuana
  const calcularISAI = (valorInmueble: number) => {
    const tramos = [
      { limite: 0, porcentaje: 0 },
      { limite: 100000, porcentaje: 0.015 }, // 1.5%
      { limite: 200000, porcentaje: 0.02 }, // 2.0%
      { limite: 300000, porcentaje: 0.025 }, // 2.5%
      { limite: 400000, porcentaje: 0.03 }, // 3.0%
      { limite: 500000, porcentaje: 0.035 }, // 3.5%
      { limite: 600000, porcentaje: 0.04 }, // 4.0%
      { limite: 700000, porcentaje: 0.045 }, // 4.5%
    ];

    let isai = 0;
    let valorRestante = valorInmueble;

    for (let i = 1; i < tramos.length; i++) {
      const tramoAnterior = tramos[i - 1];
      const tramoActual = tramos[i];

      if (valorRestante <= 0) break;

      const baseTramo = Math.min(
        valorRestante,
        tramoActual.limite - tramoAnterior.limite
      );
      isai += baseTramo * tramoActual.porcentaje;
      valorRestante -= baseTramo;
    }

    // Adicional sobretasa 0.4%
    const sobretasa = valorInmueble * 0.004;

    return {
      isai: isai,
      sobretasa: sobretasa,
      total: isai + sobretasa,
    };
  };

  // Función para calcular honorarios notariales
  const calcularHonorariosNotariales = (
    valorInmueble: number,
    usarCredito: boolean
  ) => {
    // Honorarios compraventa: 1.0% del valor (POC)
    const honorariosCompraventa = valorInmueble * 0.01;

    // Honorarios hipoteca: 0.5% del valor del inmueble (POC)
    const honorariosHipoteca = usarCredito ? valorInmueble * 0.005 : 0;

    const subtotal = honorariosCompraventa + honorariosHipoteca;
    const iva = subtotal * 0.16; // IVA 16%

    return {
      compraventa: honorariosCompraventa,
      hipoteca: honorariosHipoteca,
      subtotal: subtotal,
      iva: iva,
      total: subtotal + iva,
    };
  };

  // Función para calcular costos RPPC (Registro Público de la Propiedad y del Comercio)
  const calcularCostosRPPC = () => {
    return {
      analisis: 379.1,
      inscripcionCompraventa: 11398.6,
      inscripcionHipoteca: 11398.6,
      certificadoInscripcion: 483.12,
      certificacionPartida: 520.33,
      certificadoNoInscripcion: 1223.46,
      certificadoNoPropiedad: 83.62,
    };
  };

  // Función para calcular el costo total de aranceles
  const calcularArancelesTotales = (
    valorInmueble: number,
    usarCredito: boolean
  ) => {
    const isai = calcularISAI(valorInmueble);
    const honorarios = calcularHonorariosNotariales(valorInmueble, usarCredito);
    const rppc = calcularCostosRPPC();

    const totalAranceles =
      isai.total +
      honorarios.total +
      rppc.inscripcionCompraventa +
      (usarCredito ? rppc.inscripcionHipoteca : 0);

    return {
      isai,
      honorarios,
      rppc,
      total: totalAranceles,
    };
  };

  const calcularCostoVariable = (
    tramiteId: string,
    valor: string
  ) => {
    const valorNum = parseFloat(valor.replace(/[,$]/g, ""));
    if (!valorNum || valorNum <= 0) return null;

    let porcentaje = 0;
    let costoMinimo = 0;
    let costoMaximo = 0;

    // Solo para compraventa, usar el cálculo detallado
    if (tramiteId === "compraventa") {
      const aranceles = calcularArancelesTotales(valorNum, usarCredito);
      return {
        ...aranceles,
        valorInmueble: valorNum,
      };
    }

    switch (tramiteId) {
      case "donacion":
        porcentaje = 0.025; // Promedio de las zonas
        costoMinimo = 3000;
        costoMaximo = 8000;
        break;
      case "permuta":
        porcentaje = 0.025; // Promedio de las zonas
        costoMinimo = 8000;
        costoMaximo = 25000;
        break;
      case "credito-hipotecario":
        porcentaje = 0.02; // Promedio de las zonas
        costoMinimo = 8000;
        costoMaximo = 20000;
        break;
      default:
        return null;
    }

    const costoCalculado = valorNum * porcentaje;
    const costoFinal = Math.max(
      costoMinimo,
      Math.min(costoMaximo, costoCalculado)
    );

    return {
      costo: costoFinal,
      porcentaje: porcentaje * 100,
    };
  };

  // Función para generar documentos dinámicos basados en las respuestas del usuario
  const obtenerDocumentosDinamicos = (tramiteId: string) => {
    if (tramiteId !== "compraventa") {
      return [];
    }

    const documentosBase = [
      { texto: "Identificación oficial", tooltip: "INE o pasaporte vigente" },
      { texto: "CURP", tooltip: "" },
      { texto: "RFC y CSF", tooltip: "Constancia de Situación Fiscal" },
      { texto: "Acta de nacimiento", tooltip: "Reciente o legible" },
      {
        texto: "Comprobante de domicilio",
        tooltip: "Agua/luz/estado de cuenta, no mayor a 3 meses",
      },
      {
        texto: "Datos bancarios",
        tooltip: "CLABE y banco para dispersión y comprobación de fondos",
      },
    ];

    // Documentos específicos según el tipo de persona
    if (tipoPersona === "vendedor") {
      documentosBase.push(
        {
          texto: "Título de propiedad",
          tooltip: "Escritura o documento que acredite la propiedad",
        },
        {
          texto: "Predial al corriente",
          tooltip: "Comprobante de pago del predial sin adeudos",
        },
        {
          texto: "Constancia de no adeudo",
          tooltip: "Del agua, luz y otros servicios",
        }
      );
    } else if (tipoPersona === "comprador") {
      documentosBase.push(
        {
          texto: "Comprobante de ingresos",
          tooltip: "Estados de cuenta, recibos de nómina o declaraciones",
        },
        {
          texto: "Avalúo del inmueble",
          tooltip: "Avalúo bancario o comercial del inmueble a adquirir",
        }
      );
    }

    const documentosAdicionales = [];

    // Agregar comprobante de estado civil si no es soltero
    if (estadoCivil && estadoCivil !== "soltero") {
      if (estadoCivil === "casado") {
        documentosAdicionales.push({
          texto: "Acta de matrimonio",
          tooltip: "",
        });
      } else if (estadoCivil === "divorciado") {
        documentosAdicionales.push({ texto: "Acta de divorcio", tooltip: "" });
      } else if (estadoCivil === "viudo") {
        documentosAdicionales.push({
          texto: "Acta de defunción",
          tooltip: "Del cónyuge",
        });
      }
    }

    // Agregar documentos de crédito bancario si aplica
    if (usarCredito) {
      documentosAdicionales.push(
        { texto: "Carta oferta bancaria", tooltip: "Condiciones del banco" },
        {
          texto: "Avalúo bancario",
          tooltip: "Si el banco lo exige; a veces lo gestiona el banco",
        },
        {
          texto: "Pólizas de seguro",
          tooltip: "Vida/daños requeridas por el crédito",
        },
        {
          texto: "Instrucciones de dispersión",
          tooltip: "Datos del representante que firmará la hipoteca",
        }
      );
    }

    return [...documentosBase, ...documentosAdicionales];
  };

  if (!tramite) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        id="tramite-advice-modal-container"
        className="!w-[70vw] !max-w-none max-h-[90vh] p-0 overflow-hidden"
      >
        {/* Header fijo */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-1">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold text-center">
                Asesoría para {tramite.name}
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 hover:bg-gray-100 ml-2"
            >
              <span className="text-xs">×</span>
            </Button>
          </div>
        </div>

        {/* Contenido scrolleable */}
        <div className="overflow-y-auto max-h-[calc(85vh-40px)] pt-1 pb-2">
          <div className="space-y-3 mb-1">
            {/* Paso 1: Upload del contrato */}
            {tramite.id === "compraventa" && !mostrarSecciones && (
            <Card className="border border-blue-200 bg-blue-50">
                <CardContent className="p-6 text-center">
                  {!contratoSubido ? (
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <div className="p-4 bg-blue-100 rounded-full">
                          <Upload className="h-8 w-8 text-blue-600" />
                  </div>
                  </div>
                      <div>
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">
                          Sube tu contrato de compraventa
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Nuestra IA analizará automáticamente tu contrato para extraer la información necesaria
                        </p>
                  </div>
                      <div className="flex justify-center">
                        <div className="relative">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleUploadContrato}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            id="file-upload"
                          />
                          <Button 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium"
                            asChild
                          >
                            <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-2">
                              <Upload className="h-4 w-4" />
                              Seleccionar archivo
                            </label>
                          </Button>
                </div>
                      </div>
                    </div>
                  ) : analizandoContrato ? (
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">
                          Analizando contrato...
                        </h3>
                        <p className="text-gray-600">
                          Nuestra IA está extrayendo información de tu contrato
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <div className="p-4 bg-green-100 rounded-full">
                          <FileCheck className="h-8 w-8 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-green-800 mb-2">
                          ¡Contrato analizado exitosamente!
                        </h3>
                        <p className="text-gray-600">
                          Hemos extraído la información de tu contrato
                        </p>
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
            )}

            {/* Información adicional y documentos en dos columnas - Solo mostrar después del análisis */}
            {mostrarSecciones && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Columna izquierda - Información adicional */}
              <div className="bg-blue-50 p-3 rounded border border-blue-200 space-y-2">
                {/* Preguntas dinámicas para compraventa */}
                {tramite.id === "compraventa" && (
                  <>
                    {/* Pregunta de tipo de persona - PRIMERA */}
                      <div>
                      <label className="text-sm font-semibold text-blue-800 mb-0.5 block">
                        ¿Es comprador o vendedor?
                        </label>
                      <div className="flex gap-1.5">
                              <button
                                onClick={() => {
                            setTipoPersona("comprador");
                                  // Guardar inmediatamente en localStorage
                                  const datosExistentes = JSON.parse(
                              localStorage.getItem("arancelesCalculados") ||
                                "[]"
                                  );
                            const indiceExistente = datosExistentes.findIndex(
                                      (item: any) =>
                                        item.tramite === selectedTramiteId
                                    );
                                  if (indiceExistente >= 0) {
                              datosExistentes[indiceExistente].tipoPersona =
                                "comprador";
                                  } else {
                                  datosExistentes.push({
                                    tramite: selectedTramiteId,
                                estadoCivil: estadoCivil,
                                    usarCredito: usarCredito,
                                tipoPersona: "comprador",
                                    valorInmueble: valorInmueble,
                                    fechaCalculo: new Date().toISOString(),
                                    id: `temp-${Date.now()}`,
                                  });
                                  }
                                  localStorage.setItem(
                                    "arancelesCalculados",
                                    JSON.stringify(datosExistentes)
                                  );
                                }}
                          className={`flex-1 px-2 py-1.5 text-xs font-medium rounded border transition-all duration-200 ${
                            tipoPersona === "comprador"
                              ? "bg-blue-100 border-blue-400 text-blue-800 shadow-sm"
                              : "bg-white border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 cursor-pointer"
                          }`}
                        >
                          Comprador
                              </button>
                          <button
                            onClick={() => {
                            setTipoPersona("vendedor");
                              // Guardar inmediatamente en localStorage
                              const datosExistentes = JSON.parse(
                                localStorage.getItem("arancelesCalculados") ||
                                  "[]"
                              );
                              const indiceExistente = datosExistentes.findIndex(
                                (item: any) =>
                                  item.tramite === selectedTramiteId
                              );
                              if (indiceExistente >= 0) {
                              datosExistentes[indiceExistente].tipoPersona =
                                "vendedor";
                              } else {
                                datosExistentes.push({
                                  tramite: selectedTramiteId,
                                zonaInmueble: zonaInmueble,
                                  estadoCivil: estadoCivil,
                                usarCredito: usarCredito,
                                tipoPersona: "vendedor",
                                  valorInmueble: valorInmueble,
                                  fechaCalculo: new Date().toISOString(),
                                  id: `temp-${Date.now()}`,
                                });
                              }
                              localStorage.setItem(
                                "arancelesCalculados",
                                JSON.stringify(datosExistentes)
                              );
                            }}
                          className={`flex-1 px-2 py-1.5 text-xs font-medium rounded border transition-all duration-200 ${
                            tipoPersona === "vendedor"
                              ? "bg-blue-100 border-blue-400 text-blue-800 shadow-sm"
                              : "bg-white border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 cursor-pointer"
                          }`}
                        >
                          Vendedor
                          </button>
                      </div>
                    </div>

                    {/* Pregunta de estado civil */}
                    <div>
                      <label className="text-sm font-semibold text-blue-800 mb-0.5 block">
                        ¿Estado civil?
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {["soltero", "casado", "divorciado", "viudo"].map(
                          (estado) => (
                          <button
                              key={estado}
                            onClick={() => {
                                setEstadoCivil(estado);
                              // Guardar inmediatamente en localStorage
                              const datosExistentes = JSON.parse(
                                  localStorage.getItem(
                                    "arancelesCalculados"
                                  ) || "[]"
                              );
                                const indiceExistente =
                                  datosExistentes.findIndex(
                                (item: any) =>
                                  item.tramite === selectedTramiteId
                              );
                              if (indiceExistente >= 0) {
                                  datosExistentes[
                                    indiceExistente
                                  ].estadoCivil = estado;
                              } else {
                                datosExistentes.push({
                                  tramite: selectedTramiteId,
                                  estadoCivil: estado,
                                  usarCredito: usarCredito,
                                  tipoPersona: tipoPersona,
                                  valorInmueble: valorInmueble,
                                  fechaCalculo: new Date().toISOString(),
                                  id: `temp-${Date.now()}`,
                                });
                              }
                              localStorage.setItem(
                                "arancelesCalculados",
                                JSON.stringify(datosExistentes)
                              );
                            }}
                              className={`px-2 py-1.5 text-xs font-medium rounded border transition-all duration-200 ${
                                estadoCivil === estado
                                  ? "bg-blue-100 border-blue-400 text-blue-800 shadow-sm"
                                  : "bg-white border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 cursor-pointer"
                              }`}
                            >
                              {estado.charAt(0).toUpperCase() +
                                estado.slice(1)}
                          </button>
                          )
                        )}
                        </div>
                      </div>

                    {/* Pregunta de crédito bancario */}
                      <div>
                      <label className="text-sm font-semibold text-blue-800 mb-0.5 block">
                        ¿Crédito bancario?
                        </label>
                      <div className="flex gap-1.5">
                          <button
                            onClick={() => {
                            setUsarCredito(true);
                              // Guardar inmediatamente en localStorage
                              const datosExistentes = JSON.parse(
                                localStorage.getItem("arancelesCalculados") ||
                                  "[]"
                              );
                              const indiceExistente = datosExistentes.findIndex(
                                (item: any) =>
                                  item.tramite === selectedTramiteId
                              );
                              if (indiceExistente >= 0) {
                              datosExistentes[indiceExistente].usarCredito =
                                true;
                              } else {
                                datosExistentes.push({
                                  tramite: selectedTramiteId,
                                  estadoCivil: estadoCivil,
                                usarCredito: true,
                                tipoPersona: tipoPersona,
                                  valorInmueble: valorInmueble,
                                  fechaCalculo: new Date().toISOString(),
                                  id: `temp-${Date.now()}`,
                                });
                              }
                              localStorage.setItem(
                                "arancelesCalculados",
                                JSON.stringify(datosExistentes)
                              );
                            }}
                          className={`flex-1 px-2 py-1.5 text-xs font-medium rounded border transition-all duration-200 ${
                            usarCredito
                              ? "bg-blue-100 border-blue-400 text-blue-800 shadow-sm"
                              : "bg-white border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 cursor-pointer"
                          }`}
                        >
                          Sí
                          </button>
                          <button
                            onClick={() => {
                            setUsarCredito(false);
                              // Guardar inmediatamente en localStorage
                              const datosExistentes = JSON.parse(
                                localStorage.getItem("arancelesCalculados") ||
                                  "[]"
                              );
                              const indiceExistente = datosExistentes.findIndex(
                                (item: any) =>
                                  item.tramite === selectedTramiteId
                              );
                              if (indiceExistente >= 0) {
                              datosExistentes[indiceExistente].usarCredito =
                                false;
                              } else {
                                datosExistentes.push({
                                  tramite: selectedTramiteId,
                                  estadoCivil: estadoCivil,
                                usarCredito: false,
                                tipoPersona: tipoPersona,
                                  valorInmueble: valorInmueble,
                                  fechaCalculo: new Date().toISOString(),
                                  id: `temp-${Date.now()}`,
                                });
                              }
                              localStorage.setItem(
                                "arancelesCalculados",
                                JSON.stringify(datosExistentes)
                              );
                            }}
                          className={`flex-1 px-2 py-1.5 text-xs font-medium rounded border transition-all duration-200 ${
                            !usarCredito
                              ? "bg-blue-100 border-blue-400 text-blue-800 shadow-sm"
                              : "bg-white border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 cursor-pointer"
                          }`}
                        >
                          No
                          </button>
                        </div>
                      </div>
                  </>
                )}
              </div>

              {/* Columna derecha - Documentos requeridos */}
              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <ul className="space-y-1">
                      {(tramite.id === "compraventa"
                        ? obtenerDocumentosDinamicos(tramite.id)
                        : tramite.requirements.map((req) => ({
                            texto: req,
                            tooltip: "",
                          }))
                      ).map((req, index) => (
                    <li key={index} className="flex items-start gap-1.5 p-1.5 bg-white rounded border border-blue-200">
                      <CheckCircle className="h-3 w-3 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-blue-800 leading-relaxed">
                              {req.texto}
                            </span>
                            {req.tooltip && (
                              <div className="group relative">
                            <div className="w-3 h-3 rounded-full bg-blue-300 text-blue-700 text-xs flex items-center justify-center cursor-help hover:bg-blue-400 transition-colors">
                                  ?
                                </div>
                            <div className="absolute left-0 top-4 z-10 w-48 p-2 bg-blue-800 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                  {req.tooltip}
                                </div>
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
              </div>
            </div>
            )}

            {/* Calculadora de Aranceles - Solo para compraventa y después del análisis */}
            {tramite.id === "compraventa" && mostrarSecciones && (
              <div className="bg-white border border-blue-200 rounded shadow-lg">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 px-4 py-1 text-center">
                  <span className="text-base font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
                    ¡Calcula los aranceles del trámite!
                  </span>
                    </div>
                <div className="p-3">
                  {/* Valor del Inmueble */}
                  <div className="bg-blue-50 p-3 rounded border border-blue-200 mb-2">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      Valor del Inmueble
                    </h4>

                      <div className="flex items-center gap-2">
                      <label className="text-xs font-medium text-blue-700 whitespace-nowrap min-w-[100px]">
                          Precio de venta:
                        </label>
                        <Input
                          value={valorInmueble}
                          onChange={(e) => {
                            setValorInmueble(e.target.value);
                            // Guardar inmediatamente en localStorage
                            const datosExistentes = JSON.parse(
                              localStorage.getItem("arancelesCalculados") ||
                                "[]"
                            );
                            const indiceExistente = datosExistentes.findIndex(
                              (item: any) => item.tramite === selectedTramiteId
                            );
                            if (indiceExistente >= 0) {
                              datosExistentes[indiceExistente].valorInmueble =
                                e.target.value;
                            } else {
                              datosExistentes.push({
                                tramite: selectedTramiteId,
                                zonaInmueble: zonaInmueble,
                                estadoCivil: estadoCivil,
                                usarCredito: usarCredito,
                                tipoPersona: tipoPersona,
                                valorInmueble: e.target.value,
                                fechaCalculo: new Date().toISOString(),
                                id: `temp-${Date.now()}`,
                              });
                            }
                            localStorage.setItem(
                              "arancelesCalculados",
                              JSON.stringify(datosExistentes)
                            );
                            console.log(
                              "Valor inmueble guardado inmediatamente:",
                              e.target.value
                            );
                          }}
                          placeholder="Ej: $1,500,000"
                        className="h-8 text-xs flex-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                  </div>

                  {/* Desglose de Costos */}
                    {valorInmueble &&
                      !isNaN(
                        parseFloat(valorInmueble.replace(/[$,]/g, ""))
                      ) && (
                        <div className="bg-white border border-blue-200 rounded p-3 shadow-sm">
                          {(() => {
                            const valor = parseFloat(
                              valorInmueble.replace(/[$,]/g, "")
                            );
                            const isai = calcularISAI(valor);
                            const honorarios = calcularHonorariosNotariales(
                              valor,
                              usarCredito
                            );
                            const rppc = calcularCostosRPPC();

                            const totalAranceles =
                              isai.total +
                              honorarios.total +
                              rppc.inscripcionCompraventa +
                              (usarCredito ? rppc.inscripcionHipoteca : 0);

                            return (
                                <div className="space-y-1">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0.5">
                                  {/* ISAI */}
                                  <div className="bg-blue-50 p-0.5 rounded border border-blue-200">
                                    <div className="text-xs font-semibold text-blue-700 mb-0.5 uppercase tracking-wide">
                                    ISAI
                                  </div>
                                    <div className="space-y-0.5">
                                      <div className="flex justify-between text-xs">
                                        <span className="text-blue-600">Por tramos:</span>
                                        <span className="font-semibold text-blue-800">${isai.isai.toLocaleString()}</span>
                                    </div>
                                      <div className="flex justify-between text-xs">
                                        <span className="text-blue-600">Sobretasa 0.4%:</span>
                                        <span className="font-semibold text-blue-800">${isai.sobretasa.toLocaleString()}</span>
                                    </div>
                                      <div className="flex justify-between text-xs font-bold border-t border-blue-300 pt-0.5">
                                        <span className="text-blue-700">Subtotal:</span>
                                        <span className="text-blue-900">${isai.total.toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Honorarios Notariales */}
                                  <div className="bg-blue-50 p-0.5 rounded border border-blue-200">
                                    <div className="text-xs font-semibold text-blue-700 mb-0.5 uppercase tracking-wide">
                                    Honorarios
                                  </div>
                                    <div className="space-y-0.5">
                                      <div className="flex justify-between text-xs">
                                        <span className="text-blue-600">Compraventa (1.0%):</span>
                                        <span className="font-semibold text-blue-800">${honorarios.compraventa.toLocaleString()}</span>
                                    </div>
                                    {usarCredito && (
                                        <div className="flex justify-between text-xs">
                                          <span className="text-blue-600">Hipoteca (0.5%):</span>
                                          <span className="font-semibold text-blue-800">${honorarios.hipoteca.toLocaleString()}</span>
                                      </div>
                                    )}
                                      <div className="flex justify-between text-xs">
                                        <span className="text-blue-600">IVA (16%):</span>
                                        <span className="font-semibold text-blue-800">${honorarios.iva.toLocaleString()}</span>
                                    </div>
                                      <div className="flex justify-between text-xs font-bold border-t border-blue-300 pt-0.5">
                                        <span className="text-blue-700">Total:</span>
                                        <span className="text-blue-900">${honorarios.total.toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* RPPC */}
                                  <div className="bg-blue-50 p-0.5 rounded border border-blue-200">
                                    <div className="text-xs font-semibold text-blue-700 mb-0.5 uppercase tracking-wide">
                                    RPPC
                                  </div>
                                    <div className="space-y-0.5">
                                      <div className="flex justify-between text-xs">
                                        <span className="text-blue-600">Análisis:</span>
                                        <span className="font-semibold text-blue-800">${rppc.analisis.toLocaleString()}</span>
                                    </div>
                                      <div className="flex justify-between text-xs">
                                        <span className="text-blue-600">Inscripción:</span>
                                        <span className="font-semibold text-blue-800">${rppc.inscripcionCompraventa.toLocaleString()}</span>
                                    </div>
                                    {usarCredito && (
                                        <div className="flex justify-between text-xs">
                                          <span className="text-blue-600">Hipoteca:</span>
                                          <span className="font-semibold text-blue-800">${rppc.inscripcionHipoteca.toLocaleString()}</span>
                                      </div>
                                    )}
                                      <div className="flex justify-between text-xs">
                                        <span className="text-blue-600">Certificados:</span>
                                        <span className="font-semibold text-blue-800">${(
                                          rppc.certificadoInscripcion +
                                          rppc.certificacionPartida +
                                          rppc.certificadoNoInscripcion +
                                          rppc.certificadoNoPropiedad
                                        ).toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                          {/* Total */}
                                <div className="bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300 rounded p-1">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-blue-800">
                                TOTAL ARANCELES:
                              </span>
                                    <span className="text-sm font-bold text-blue-900">
                                      ${totalAranceles.toLocaleString()}
                              </span>
                            </div>
                          </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                  </div>
                  </div>
            )}

            {/* Footer con opciones de acción - Solo mostrar después de subir documento */}
            {mostrarSecciones && (
              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2 justify-center">
                <Button
                    onClick={() => {
                      // Cerrar el modal primero
                      onClose();
                      
                      // Verificar si ya estamos en la página de iniciar trámite
                      const currentPath = window.location.pathname;
                      console.log('Modal - Ruta actual:', currentPath);
                      
                      if (currentPath === '/iniciar-tramite') {
                        // Si ya estamos en iniciar-tramite, solo actualizar la URL con el parámetro
                        console.log('Modal - Ya en iniciar-tramite, actualizando URL');
                        window.history.replaceState({}, '', '/iniciar-tramite?tramite=compraventa');
                        // Recargar la página para que detecte el parámetro
                        window.location.reload();
                      } else {
                        // Si no estamos en iniciar-tramite, verificar autenticación
                        if (isAuthenticated) {
                          // Si está logueado, ir directo a iniciar trámite con compraventa pre-seleccionado
                          console.log('Modal - Usuario autenticado, yendo a iniciar-tramite');
                          window.location.href = '/iniciar-tramite?tramite=compraventa';
                        } else {
                          // Si no está logueado, ir al login con redirect
                          console.log('Modal - Usuario no autenticado, yendo al login');
                          window.location.href = '/login?redirect=' + encodeURIComponent('/iniciar-tramite?tramite=compraventa');
                        }
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs"
                  size="sm"
                >
                    <FileText className="h-3 w-3 mr-1" />
                    Iniciar Expediente
                </Button>
                <Button
                    onClick={() => {
                      // Lógica para agendar cita
                      console.log("Agendar cita");
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 text-xs"
                  size="sm"
                >
                    <Calendar className="h-3 w-3 mr-1" />
                    Agendar Cita
                </Button>
                <Button
                    onClick={() => {
                      // Lógica para WhatsApp
                      window.open("https://wa.me/1234567890", "_blank");
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 text-xs"
                  size="sm"
                >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    WhatsApp
                </Button>
                <Button
                    onClick={() => {
                      // Lógica para email
                      window.location.href = "mailto:contacto@notaria.com";
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 text-xs"
                  size="sm"
                >
                    <Mail className="h-3 w-3 mr-1" />
                    Email
                </Button>
              <Button
                onClick={onClose}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1.5 text-xs"
                size="sm"
              >
                Cerrar
              </Button>
            </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
