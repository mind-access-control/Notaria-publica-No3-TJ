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
      window.open(loginUrl, "_blank");
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
      "Identificación oficial: INE o pasaporte vigente",
      "CURP",
      "RFC y Constancia de Situación Fiscal (CSF)",
      "Acta de nacimiento (reciente o legible)",
      "Comprobante de domicilio (agua/luz/estado de cuenta, no mayor a 3 meses)",
      "Datos bancarios (CLABE y banco) para dispersión y comprobación de fondos",
    ];

    const documentosAdicionales = [];

    // Agregar comprobante de estado civil si no es soltero
    if (estadoCivil && estadoCivil !== "soltero") {
      if (estadoCivil === "casado") {
        documentosAdicionales.push("Acta de matrimonio");
      } else if (estadoCivil === "divorciado") {
        documentosAdicionales.push("Acta de divorcio");
      } else if (estadoCivil === "viudo") {
        documentosAdicionales.push("Acta de defunción del cónyuge");
      }
    }

    // Agregar documentos de crédito bancario si aplica
    if (usarCredito) {
      documentosAdicionales.push(
        "Carta oferta / condiciones del banco",
        "Avalúo bancario (si el banco lo exige; a veces lo gestiona el banco)",
        "Pólizas requeridas por el crédito (vida/daños), si aplican",
        "Instrucciones de dispersión del banco y datos del representante que firmará la hipoteca"
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
        className="max-w-4xl max-h-[90vh] p-0 overflow-hidden"
      >
        {/* Header fijo */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-1">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DialogTitle className="text-base font-semibold text-center">
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
              className="h-8 w-8 p-0 hover:bg-gray-100 ml-4"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Contenido scrolleable */}
        <div className="overflow-y-auto max-h-[calc(85vh-50px)] p-2 pb-3">
          <div className="space-y-3 mt-1 mb-2">
            {/* Información del trámite */}
            <Card className="border border-blue-200 bg-blue-50">
              <CardHeader className="pb-1 pt-3">
                <div>
                  <CardTitle className="text-base">{tramite.name}</CardTitle>
                  <CardDescription className="text-xs mb-1">
                    {tramite.description}
                  </CardDescription>
                  <p className="text-gray-700 text-xs leading-relaxed">
                    {tramite.id === "testamento" &&
                      "Proteger el futuro de tu familia es uno de los actos más importantes que puedes realizar. Un testamento bien estructurado garantiza que tus seres queridos estén protegidos y tus bienes se distribuyan según tus deseos."}
                    {tramite.id === "compraventa" &&
                      "La compraventa de inmuebles es una de las transacciones más importantes en la vida. Nuestro servicio garantiza que tu inversión esté protegida con todos los documentos legales necesarios."}
                    {tramite.id === "donacion" &&
                      "Las donaciones son una forma noble de transferir bienes a tus seres queridos. Te ayudamos a realizar este proceso de manera legal y segura, protegiendo tanto al donante como al donatario."}
                    {tramite.id === "permuta" &&
                      "El intercambio de propiedades puede ser una excelente alternativa a la compraventa tradicional. Te asesoramos para que ambas partes obtengan el mejor beneficio de esta transacción."}
                    {tramite.id === "credito-hipotecario" &&
                      "Obtener un crédito hipotecario es el primer paso hacia la casa de tus sueños. Te acompañamos en todo el proceso para que tu financiamiento sea aprobado sin complicaciones."}
                    {tramite.id === "contrato-mutuo" &&
                      "Los contratos de mutuo son una forma segura de prestar o recibir dinero con garantías legales. Te ayudamos a estructurar el acuerdo más conveniente para todas las partes."}
                    {tramite.id === "reconocimiento-adeudo" &&
                      "Reconocer una deuda formalmente es el primer paso para resolver cualquier situación financiera. Te asesoramos para que este proceso sea transparente y legal."}
                    {tramite.id === "adjudicacion-hereditaria" &&
                      "Las adjudicaciones hereditarias permiten transferir legalmente los bienes de una herencia. Te guiamos a través de todo el proceso sucesorio para que recibas lo que te corresponde."}
                    {tramite.id === "sociedad" &&
                      "Constituir una sociedad es el primer paso para formalizar tu empresa. Te ayudamos a elegir el tipo de sociedad más conveniente y a cumplir con todos los requisitos legales."}
                    {tramite.id === "liquidacion-copropiedad" &&
                      "La liquidación de copropiedad permite dividir equitativamente una propiedad en común. Te asesoramos para que este proceso sea justo y legal para todos los copropietarios."}
                    {tramite.id === "cesion-derechos" &&
                      "La cesión de derechos patrimoniales es una herramienta legal muy útil. Te ayudamos a transferir tus derechos de manera segura y legal."}
                    {tramite.id === "servidumbre" &&
                      "Las servidumbres son derechos de uso sobre propiedades ajenas que pueden ser muy valiosos. Te asesoramos para constituir o modificar estos derechos de manera legal."}
                    {tramite.id === "convenios-modificatorios" &&
                      "Los convenios modificatorios permiten actualizar contratos existentes según las nuevas necesidades. Te ayudamos a modificar tus acuerdos de manera legal y efectiva."}
                    {tramite.id === "elevacion-judicial" &&
                      "La elevación judicial a escritura pública convierte una sentencia en un documento notarial. Te acompañamos en este proceso para que tu sentencia tenga plena validez legal."}
                    {tramite.id === "dacion-pago" &&
                      "La dación en pago es una alternativa legal para saldar deudas con bienes. Te asesoramos para que esta transacción sea beneficiosa para todas las partes involucradas."}
                    {tramite.id === "formalizacion-contrato" &&
                      "Elevar un contrato privado a escritura pública le da mayor validez legal. Te ayudamos a formalizar tus acuerdos para que tengan plena seguridad jurídica."}
                    {tramite.id === "fideicomiso" &&
                      "Los fideicomisos son una herramienta poderosa para la administración y transmisión de bienes. Te asesoramos para estructurar el fideicomiso más conveniente para tus necesidades."}
                    {tramite.id === "inicio-sucesion" &&
                      "Iniciar una sucesión es el primer paso para recibir una herencia. Te guiamos a través de todo el proceso para que obtengas lo que te corresponde de manera legal."}
                    {tramite.id === "cancelacion-hipoteca" &&
                      "Cancelar una hipoteca es el último paso para ser completamente dueño de tu propiedad. Te ayudamos a completar este proceso de manera eficiente."}
                    {tramite.id === "protocolizacion-acta" &&
                      "La protocolización de actas de asamblea da validez legal a las decisiones de tu empresa. Te asesoramos para que tus actas cumplan con todos los requisitos legales."}
                    {tramite.id === "cambio-regimen-matrimonial" &&
                      "Cambiar el régimen matrimonial puede ser necesario según las circunstancias de vida. Te asesoramos para que esta modificación sea beneficiosa para ambos cónyuges."}
                    {tramite.id === "cotejos" &&
                      "Los cotejos son una herramienta legal para verificar la autenticidad de documentos. Te ayudamos a comparar y validar tus documentos de manera oficial."}
                    {tramite.id === "fe-hechos" &&
                      "Las fe de hechos son constancias notariales que dan validez legal a eventos importantes. Te asesoramos para que tus hechos queden debidamente documentados."}
                    {tramite.id === "poderes" &&
                      "Los poderes son una herramienta legal muy útil para delegar facultades. Te ayudamos a redactar el poder más conveniente para tus necesidades específicas."}
                    {tramite.id === "rectificacion-escrituras" &&
                      "Rectificar escrituras es necesario cuando hay errores que deben corregirse. Te asesoramos para que tus documentos queden perfectos y sin errores."}
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
                      "Este trámite es fundamental para proteger tus intereses legales. Te brindamos la asesoría especializada que necesitas para completarlo de manera exitosa y segura."}
                  </p>
                </div>
              </CardHeader>
            </Card>

            {/* Preguntas dinámicas para compraventa */}
            {tramite.id === "compraventa" && (
              <Card>
                <CardHeader className="pb-1 pt-2">
                  <CardTitle className="text-xs flex items-center gap-2">
                    <Users className="h-3 w-3 text-blue-600" />
                    Información Adicional
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Para personalizar la lista de documentos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  {/* Pregunta de estado civil */}
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      ¿Cuál es tu estado civil?
                    </label>
                    <div className="grid grid-cols-2 gap-1">
                      {["soltero", "casado", "divorciado", "viudo"].map(
                        (estado) => (
                          <button
                            key={estado}
                            onClick={() => setEstadoCivil(estado)}
                            className={`px-2 py-1 text-xs rounded-md border transition-colors ${
                              estadoCivil === estado
                                ? "bg-blue-100 border-blue-300 text-blue-700"
                                : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {estado.charAt(0).toUpperCase() + estado.slice(1)}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Pregunta de crédito bancario */}
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      ¿Utilizarás crédito bancario para la compra?
                    </label>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setUsarCredito(true)}
                        className={`flex-1 px-2 py-1 text-xs rounded-md border transition-colors ${
                          usarCredito
                            ? "bg-blue-100 border-blue-300 text-blue-700"
                            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Sí
                      </button>
                      <button
                        onClick={() => setUsarCredito(false)}
                        className={`flex-1 px-2 py-1 text-xs rounded-md border transition-colors ${
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

            {/* Requisitos */}
            <Card>
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
                    : tramite.requirements
                  ).map((req, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-2.5 w-2.5 text-blue-500 flex-shrink-0" />
                      <span className="text-xs">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Calculadora de Aranceles - Solo para compraventa */}
            {tramite.id === "compraventa" ? (
              <Card className="bg-gray-50">
                <CardHeader className="pb-1 pt-2">
                  <CardTitle className="text-xs flex items-center gap-2 text-gray-700">
                    <Calculator className="h-3 w-3 text-gray-500" />
                    Calculadora de Aranceles
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-1">
                    <div>
                      <label className="text-xs font-medium text-gray-600">
                        Valor del inmueble
                      </label>
                      <Input
                        value={valorInmueble}
                        onChange={(e) => setValorInmueble(e.target.value)}
                        placeholder="Ej: $500,000"
                        className="mt-1 h-6 text-xs"
                      />
                    </div>

                    {valorInmueble &&
                      !isNaN(
                        parseFloat(valorInmueble.replace(/[$,]/g, ""))
                      ) && (
                        <div className="bg-white p-2 rounded border border-gray-200 space-y-1">
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
                              <>
                                <div className="text-xs font-semibold text-gray-700 mb-2">
                                  Desglose de Aranceles
                                </div>

                                {/* ISAI */}
                                <div className="space-y-1">
                                  <div className="text-xs font-medium text-gray-600">
                                    ISAI (Impuesto Sobre Adquisición de
                                    Inmuebles)
                                  </div>
                                  <div className="text-xs space-y-0.5 ml-2">
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">
                                        ISAI por tramos:
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
                                        Subtotal ISAI:
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
                                    Honorarios Notariales
                                  </div>
                                  <div className="text-xs space-y-0.5 ml-2">
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
                                        Subtotal:
                                      </span>
                                      <span className="font-medium">
                                        ${honorarios.subtotal.toLocaleString()}
                                      </span>
                                    </div>
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
                                        Total Honorarios:
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
                                    RPPC (Registro Público)
                                  </div>
                                  <div className="text-xs space-y-0.5 ml-2">
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">
                                        Análisis documento:
                                      </span>
                                      <span className="font-medium">
                                        ${rppc.analisis.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">
                                        Inscripción compraventa:
                                      </span>
                                      <span className="font-medium">
                                        $
                                        {rppc.inscripcionCompraventa.toLocaleString()}
                                      </span>
                                    </div>
                                    {usarCredito && (
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">
                                          Inscripción hipoteca:
                                        </span>
                                        <span className="font-medium">
                                          $
                                          {rppc.inscripcionHipoteca.toLocaleString()}
                                        </span>
                                      </div>
                                    )}
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">
                                        Certificados varios:
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

                                {/* Total */}
                                <div className="border-t pt-2 mt-2">
                                  <div className="flex justify-between text-sm font-bold">
                                    <span className="text-gray-800">
                                      TOTAL ARANCELES:
                                    </span>
                                    <span className="text-blue-600">
                                      ${totalAranceles.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </>
                            );
                          })()}
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
            <div className="space-y-2">
              <h3 className="text-xs font-semibold">
                ¿Cómo quieres continuar?
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Button
                  onClick={handleIniciarTramite}
                  className="h-20 p-2 flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  size="lg"
                >
                  <FileText className="h-4 w-4 flex-shrink-0" />
                  <div className="text-center space-y-1">
                    <div className="font-bold text-xs leading-tight">
                      Iniciar Expediente Digital
                    </div>
                    <div className="text-xs opacity-90 leading-tight px-1">
                      Completa tu trámite paso a paso
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => window.open("/citas", "_blank")}
                  variant="outline"
                  className="h-20 p-2 flex flex-col items-center justify-center gap-1 border-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50"
                  size="lg"
                >
                  <Calendar className="h-4 w-4 text-slate-600 flex-shrink-0" />
                  <div className="text-center space-y-1">
                    <div className="font-bold text-xs leading-tight text-slate-700">
                      Agendar Cita
                    </div>
                    <div className="text-xs text-slate-600 leading-tight px-1">
                      Ven a la notaría para asesoría personal
                    </div>
                  </div>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Button
                  onClick={handleWhatsApp}
                  variant="outline"
                  className="h-14 p-2 flex items-center gap-2 border-2 border-blue-200 hover:border-blue-500 hover:bg-blue-50"
                >
                  <MessageCircle className="h-3 w-3 text-blue-600 flex-shrink-0" />
                  <div className="text-left min-w-0 flex-1">
                    <div className="font-semibold text-blue-700 text-xs leading-tight">
                      Enviar por WhatsApp
                    </div>
                    <div className="text-xs text-blue-600 leading-tight">
                      Información instantánea
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={handleEmail}
                  variant="outline"
                  className="h-14 p-2 flex items-center gap-2 border-2 border-blue-200 hover:border-blue-500 hover:bg-blue-50"
                >
                  <Mail className="h-3 w-3 text-blue-600 flex-shrink-0" />
                  <div className="text-left min-w-0 flex-1">
                    <div className="font-semibold text-blue-700 text-xs leading-tight">
                      Enviar por Email
                    </div>
                    <div className="text-xs text-blue-600 leading-tight">
                      Información detallada
                    </div>
                  </div>
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                ¿Necesitas más información? Contáctanos
              </div>
              <Button
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1"
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
