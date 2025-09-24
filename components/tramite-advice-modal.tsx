"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
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
  Calendar,
  Mail,
  MessageCircle,
  CheckCircle,
  DollarSign,
  Users,
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

  const tramite = tramites.find((t) => t.id === selectedTramiteId);

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
        valorInmueble,
        zonaInmueble
      );

      if (costosCalculados) {
        const datosCalculados = {
          tramite: selectedTramiteId,
          valorInmueble: valorInmueble,
          zonaInmueble: zonaInmueble,
          estadoCivil: estadoCivil,
          usarCredito: usarCredito,
          costosCalculados: costosCalculados,
          fechaCalculo: new Date().toISOString(),
          id: `calc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };

        console.log("Guardando datos desde modal:", datosCalculados);

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
    valor: string,
    zona: string
  ) => {
    const valorNum = parseFloat(valor.replace(/[,$]/g, ""));
    if (!valorNum || valorNum <= 0) return null;

    let porcentaje = 0;
    let costoMinimo = 0;
    let costoMaximo = 0;

    // Solo para compraventa, usar el cálculo detallado
    if (tramiteId === "compraventa") {
      return calcularArancelesTotales(valorNum, usarCredito);
    }

    switch (tramiteId) {
      case "donacion":
        porcentaje =
          zona === "centro" ? 0.02 : zona === "zona-rio" ? 0.025 : 0.03;
        costoMinimo = 3000;
        costoMaximo = 8000;
        break;
      case "permuta":
        porcentaje =
          zona === "centro" ? 0.02 : zona === "zona-rio" ? 0.025 : 0.03;
        costoMinimo = 8000;
        costoMaximo = 25000;
        break;
      case "credito-hipotecario":
        porcentaje =
          zona === "centro" ? 0.015 : zona === "zona-rio" ? 0.02 : 0.025;
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
      zona: zona,
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
              <DialogTitle className="text-sm font-semibold text-center">
                Asesoría para {tramite.name}
              </DialogTitle>
              <DialogDescription className="text-center text-xs">
                Aquí tienes toda la información que necesitas para tu trámite
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 hover:bg-gray-100 ml-2"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Contenido scrolleable */}
        <div className="overflow-y-auto max-h-[calc(85vh-40px)] pt-1 pb-2">
          <div className="space-y-3 mb-1">
            {/* Información del trámite */}
            <Card className="border border-blue-200 bg-blue-50">
              <CardContent className="px-3 py-1">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold text-blue-800">
                    {tramite.name}
                  </div>
                  <div className="text-gray-400">•</div>
                  <div className="text-sm text-gray-600">
                    {tramite.description}
                  </div>
                  <div className="text-gray-400">•</div>
                  <div className="text-sm text-gray-600">
                    {tramite.id === "compraventa" &&
                      "Servicio especializado en escrituración segura de propiedades"}
                    {tramite.id === "testamento" &&
                      "Protección legal para el futuro de tu familia"}
                    {tramite.id === "donacion" &&
                      "Transferencia legal y segura de bienes"}
                    {tramite.id === "permuta" &&
                      "Intercambio equitativo de propiedades"}
                    {tramite.id === "credito-hipotecario" &&
                      "Financiamiento seguro para tu hogar"}
                    {tramite.id === "sociedad" &&
                      "Constitución legal de empresas"}
                    {tramite.id === "fideicomiso" &&
                      "Administración profesional de bienes"}
                    {tramite.id === "adjudicacion-hereditaria" &&
                      "Transferencia legal de herencias"}
                    {tramite.id === "liquidacion-copropiedad" &&
                      "División equitativa de propiedades"}
                    {tramite.id === "elevacion-judicial" &&
                      "Conversión de sentencias a escrituras"}
                    {tramite.id === "inicio-sucesion" &&
                      "Proceso legal de herencias"}
                    {tramite.id === "contrato-mutuo" &&
                      "Contratos de préstamo seguros"}
                    {tramite.id === "reconocimiento-adeudo" &&
                      "Reconocimiento formal de deudas"}
                    {tramite.id === "cesion-derechos" &&
                      "Transferencia de derechos patrimoniales"}
                    {tramite.id === "servidumbre" &&
                      "Constitución de derechos de uso"}
                    {tramite.id === "convenios-modificatorios" &&
                      "Modificación de contratos existentes"}
                    {tramite.id === "dacion-pago" &&
                      "Pago con bienes en lugar de dinero"}
                    {tramite.id === "formalizacion-contrato" &&
                      "Elevación de contratos privados"}
                    {tramite.id === "cancelacion-hipoteca" &&
                      "Liberación de gravámenes hipotecarios"}
                    {tramite.id === "protocolizacion-acta" &&
                      "Validación legal de actas empresariales"}
                    {tramite.id === "cambio-regimen-matrimonial" &&
                      "Modificación del régimen matrimonial"}
                    {tramite.id === "cotejos" &&
                      "Verificación de autenticidad de documentos"}
                    {tramite.id === "fe-hechos" &&
                      "Constancias notariales de eventos"}
                    {tramite.id === "poderes" &&
                      "Delegación de facultades legales"}
                    {tramite.id === "rectificacion-escrituras" &&
                      "Corrección de errores en documentos"}
                    {![
                      "testamento",
                      "compraventa",
                      "donacion",
                      "permuta",
                      "credito-hipotecario",
                      "contrato-mutuo",
                      "reconocimiento-adeudo",
                      "adjudicacion-hereditaria",
                      "sociedad",
                      "liquidacion-copropiedad",
                      "cesion-derechos",
                      "servidumbre",
                      "convenios-modificatorios",
                      "elevacion-judicial",
                      "dacion-pago",
                      "formalizacion-contrato",
                      "fideicomiso",
                      "inicio-sucesion",
                      "cancelacion-hipoteca",
                      "protocolizacion-acta",
                      "cambio-regimen-matrimonial",
                      "cotejos",
                      "fe-hechos",
                      "poderes",
                      "rectificacion-escrituras",
                    ].includes(tramite.id) &&
                      "Servicio especializado en trámites legales"}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información adicional y documentos en dos columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {/* Columna izquierda - Información adicional */}
              <div className="space-y-2 flex flex-col">
                {/* Preguntas dinámicas para compraventa */}
                {tramite.id === "compraventa" && (
                  <Card className="flex-1">
                    <CardHeader className="pb-1 pt-2">
                      <CardTitle className="text-xs flex items-center gap-2">
                        <Users className="h-3 w-3 text-blue-600" />
                        Información Adicional
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Para personalizar documentos
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-0">
                      {/* Pregunta de estado civil */}
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-1 block">
                          ¿Estado civil?
                        </label>
                        <div className="grid grid-cols-2 gap-1">
                          {["soltero", "casado", "divorciado", "viudo"].map(
                            (estado) => (
                              <button
                                key={estado}
                                onClick={() => setEstadoCivil(estado)}
                                className={`px-1 py-1 text-xs rounded-md border transition-colors ${
                                  estadoCivil === estado
                                    ? "bg-blue-100 border-blue-300 text-blue-700"
                                    : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
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
                        <label className="text-xs font-medium text-gray-700 mb-1 block">
                          ¿Crédito bancario?
                        </label>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setUsarCredito(true)}
                            className={`flex-1 px-1 py-1 text-xs rounded-md border transition-colors ${
                              usarCredito
                                ? "bg-blue-100 border-blue-300 text-blue-700"
                                : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            Sí
                          </button>
                          <button
                            onClick={() => setUsarCredito(false)}
                            className={`flex-1 px-1 py-1 text-xs rounded-md border transition-colors ${
                              !usarCredito
                                ? "bg-blue-100 border-blue-300 text-blue-700"
                                : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Columna derecha - Documentos requeridos */}
              <div className="flex flex-col">
                <Card className="flex-1">
                  <CardHeader className="pb-1 pt-2">
                    <CardTitle className="text-xs flex items-center gap-2">
                      <FileText className="h-3 w-3 text-blue-600" />
                      Documentos Requeridos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-0.5">
                      {(tramite.id === "compraventa"
                        ? obtenerDocumentosDinamicos(tramite.id)
                        : tramite.requirements.map((req) => ({
                            texto: req,
                            tooltip: "",
                          }))
                      ).map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-2.5 w-2.5 text-blue-500 flex-shrink-0 mt-0.5" />
                          <div className="flex items-center gap-1">
                            <span className="text-xs leading-relaxed">
                              {req.texto}
                            </span>
                            {req.tooltip && (
                              <div className="group relative">
                                <div className="w-3 h-3 rounded-full bg-blue-200 text-blue-600 text-xs flex items-center justify-center cursor-help">
                                  ?
                                </div>
                                <div className="absolute left-0 top-4 z-10 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                  {req.tooltip}
                                </div>
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Calculadora de Aranceles - Solo para compraventa */}
            {tramite.id === "compraventa" ? (
              <Card className="bg-gray-50">
                <CardHeader className="pb-1 pt-1">
                  <CardTitle className="text-xs flex items-center gap-2 text-gray-700">
                    <Calculator className="h-3 w-3 text-gray-500" />
                    Calculadora de Aranceles
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium text-gray-600 whitespace-nowrap">
                        Valor del inmueble:
                      </label>
                      <Input
                        value={valorInmueble}
                        onChange={(e) => setValorInmueble(e.target.value)}
                        placeholder="Ej: $500,000"
                        className="h-6 text-xs flex-1"
                      />
                    </div>

                    {valorInmueble &&
                      !isNaN(
                        parseFloat(valorInmueble.replace(/[$,]/g, ""))
                      ) && (
                        <div className="bg-white p-1 rounded border border-gray-200 space-y-1">
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
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                                {/* ISAI */}
                                <div className="space-y-1">
                                  <div className="text-xs font-medium text-gray-600">
                                    ISAI
                                  </div>
                                  <div className="text-xs space-y-0.5">
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">
                                        Por tramos:
                                      </span>
                                      <span className="font-medium">
                                        ${isai.isai.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">
                                        Sobretasa 0.4%:
                                      </span>
                                      <span className="font-medium">
                                        ${isai.sobretasa.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="flex justify-between border-t pt-1 font-semibold">
                                      <span className="text-gray-700">
                                        Subtotal:
                                      </span>
                                      <span className="text-gray-900">
                                        ${isai.total.toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Honorarios Notariales */}
                                <div className="space-y-1">
                                  <div className="text-xs font-medium text-gray-600">
                                    Honorarios
                                  </div>
                                  <div className="text-xs space-y-0.5">
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">
                                        Compraventa (1.0%):
                                      </span>
                                      <span className="font-medium">
                                        $
                                        {honorarios.compraventa.toLocaleString()}
                                      </span>
                                    </div>
                                    {usarCredito && (
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">
                                          Hipoteca (0.5%):
                                        </span>
                                        <span className="font-medium">
                                          $
                                          {honorarios.hipoteca.toLocaleString()}
                                        </span>
                                      </div>
                                    )}
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">
                                        IVA (16%):
                                      </span>
                                      <span className="font-medium">
                                        ${honorarios.iva.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="flex justify-between border-t pt-1 font-semibold">
                                      <span className="text-gray-700">
                                        Total:
                                      </span>
                                      <span className="text-gray-900">
                                        ${honorarios.total.toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* RPPC */}
                                <div className="space-y-1">
                                  <div className="text-xs font-medium text-gray-600">
                                    RPPC
                                  </div>
                                  <div className="text-xs space-y-0.5">
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">
                                        Análisis:
                                      </span>
                                      <span className="font-medium">
                                        ${rppc.analisis.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">
                                        Inscripción:
                                      </span>
                                      <span className="font-medium">
                                        $
                                        {rppc.inscripcionCompraventa.toLocaleString()}
                                      </span>
                                    </div>
                                    {usarCredito && (
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">
                                          Hipoteca:
                                        </span>
                                        <span className="font-medium">
                                          $
                                          {rppc.inscripcionHipoteca.toLocaleString()}
                                        </span>
                                      </div>
                                    )}
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">
                                        Certificados:
                                      </span>
                                      <span className="font-medium">
                                        $
                                        {(
                                          rppc.certificadoInscripcion +
                                          rppc.certificacionPartida +
                                          rppc.certificadoNoInscripcion +
                                          rppc.certificadoNoPropiedad
                                        ).toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}

                          {/* Total */}
                          <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between text-sm font-bold">
                              <span className="text-gray-800">
                                TOTAL ARANCELES:
                              </span>
                              <span className="text-blue-600">
                                $
                                {(() => {
                                  const valor = parseFloat(
                                    valorInmueble.replace(/[$,]/g, "")
                                  );
                                  const isai = calcularISAI(valor);
                                  const honorarios =
                                    calcularHonorariosNotariales(
                                      valor,
                                      usarCredito
                                    );
                                  const rppc = calcularCostosRPPC();
                                  return (
                                    isai.total +
                                    honorarios.total +
                                    rppc.inscripcionCompraventa +
                                    (usarCredito ? rppc.inscripcionHipoteca : 0)
                                  ).toLocaleString();
                                })()}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-50">
                <CardHeader className="pb-1">
                  <CardTitle className="text-xs flex items-center gap-2 text-gray-700">
                    <DollarSign className="h-3 w-3 text-gray-500" />
                    Costo Aproximado
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      {tramite.estimatedCost}
                    </p>
                    <p className="text-xs text-gray-500">
                      * Rango aproximado, puede variar según el caso específico
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Acciones */}
            <div className="space-y-1">
              <h3 className="text-xs font-semibold">
                ¿Cómo quieres continuar?
              </h3>

              <div className="grid grid-cols-2 gap-1">
                <Button
                  onClick={handleIniciarTramite}
                  className="h-10 px-2 flex items-center gap-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  size="sm"
                >
                  <FileText className="h-3 w-3 flex-shrink-0" />
                  <span className="text-xs font-semibold">
                    Iniciar Expediente
                  </span>
                </Button>

                <Button
                  onClick={() => window.open("/citas", "_blank")}
                  variant="outline"
                  className="h-10 px-2 flex items-center gap-1 border-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50"
                  size="sm"
                >
                  <Calendar className="h-3 w-3 text-slate-600 flex-shrink-0" />
                  <span className="text-xs font-semibold text-slate-700">
                    Agendar Cita
                  </span>
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-1">
                <Button
                  onClick={handleWhatsApp}
                  variant="outline"
                  className="h-8 px-2 flex items-center gap-1 border border-blue-200 hover:border-blue-500 hover:bg-blue-50"
                  size="sm"
                >
                  <MessageCircle className="h-3 w-3 text-blue-600 flex-shrink-0" />
                  <span className="text-xs text-blue-700">WhatsApp</span>
                </Button>

                <Button
                  onClick={handleEmail}
                  variant="outline"
                  className="h-8 px-2 flex items-center gap-1 border border-blue-200 hover:border-blue-500 hover:bg-blue-50"
                  size="sm"
                >
                  <Mail className="h-3 w-3 text-blue-600 flex-shrink-0" />
                  <span className="text-xs text-blue-700">Email</span>
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-1 mt-1 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                ¿Necesitas más información? Contáctanos
              </div>
              <Button
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1"
                size="sm"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
