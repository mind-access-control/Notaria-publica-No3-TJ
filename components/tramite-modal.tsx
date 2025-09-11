"use client";

import { useState, useEffect } from "react";

// Declaración de tipos para Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    speechRecognition: any;
  }
}
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  Download,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Shield,
  Home,
  Heart,
  Building,
  Scale,
  Search,
  Mic,
  MicOff,
  Gift,
  CreditCard,
} from "lucide-react";

interface TramiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTramite?: string;
  onTramiteSelect?: (tramiteId: string) => void;
}

const tramites = [
  {
    id: "testamento",
    name: "Testamento",
    icon: Heart,
    description: "Protege el futuro de tu familia",
    color: "bg-red-50 border-red-200 text-red-700",
    iconColor: "text-red-600",
    estimatedCost: "$3,200",
    timeRequired: "1-2 horas",
    keywords: [
      "testamento",
      "herencia",
      "bienes",
      "familia",
      "muerte",
      "sucesión",
    ],
    requirements: [
      "Identificación oficial vigente",
      "Comprobante de domicilio",
      "Datos de beneficiarios",
      "Lista de bienes y propiedades",
    ],
  },
  {
    id: "compraventa",
    name: "Compraventa de Inmuebles",
    icon: Home,
    description: "Escrituración segura de propiedades",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    iconColor: "text-blue-600",
    estimatedCost: "$25,000",
    timeRequired: "2-4 horas",
    keywords: [
      "compraventa",
      "casa",
      "terreno",
      "propiedad",
      "inmueble",
      "venta",
      "compra",
    ],
    requirements: [
      "Identificación oficial de comprador y vendedor",
      "Comprobante de domicilio",
      "Escritura anterior o título de propiedad",
      "Avalúo de la propiedad",
      "Comprobante de pago",
    ],
  },
  {
    id: "donacion",
    name: "Donación",
    icon: Gift,
    description: "Transferencia gratuita de bienes",
    color: "bg-pink-50 border-pink-200 text-pink-700",
    iconColor: "text-pink-600",
    estimatedCost: "$4,500",
    timeRequired: "1-2 horas",
    keywords: ["donación", "regalo", "donar", "transferir", "ceder"],
    requirements: [
      "Identificación oficial del donante y donatario",
      "Comprobante de domicilio",
      "Escritura anterior o título de propiedad",
      "Avalúo de la propiedad",
    ],
  },
  {
    id: "permuta",
    name: "Permuta",
    icon: Home,
    description: "Intercambio de propiedades",
    color: "bg-orange-50 border-orange-200 text-orange-700",
    iconColor: "text-orange-600",
    estimatedCost: "$12,000",
    timeRequired: "2-3 horas",
    keywords: ["permuta", "intercambio", "cambio", "trueque", "canje"],
    requirements: [
      "Identificación oficial de las partes",
      "Comprobante de domicilio",
      "Escrituras de ambas propiedades",
      "Avalúos de las propiedades",
    ],
  },
  {
    id: "credito-hipotecario",
    name: "Crédito Hipotecario / Infonavit / Fovissste",
    icon: CreditCard,
    description: "Financiamiento para vivienda",
    color: "bg-indigo-50 border-indigo-200 text-indigo-700",
    iconColor: "text-indigo-600",
    estimatedCost: "$12,000",
    timeRequired: "2-3 horas",
    keywords: [
      "crédito",
      "hipoteca",
      "infonavit",
      "fovissste",
      "préstamo",
      "casa",
      "vivienda",
    ],
    requirements: [
      "Identificación oficial",
      "Comprobante de ingresos",
      "Comprobante de domicilio",
      "Avalúo de la propiedad",
      "Documentos del banco",
    ],
  },
  {
    id: "contrato-mutuo",
    name: "Contrato de Mutuo",
    icon: CreditCard,
    description: "Préstamo de dinero con garantía",
    color: "bg-cyan-50 border-cyan-200 text-cyan-700",
    iconColor: "text-cyan-600",
    estimatedCost: "$3,000",
    timeRequired: "1-2 horas",
    keywords: ["mutuo", "préstamo", "dinero", "garantía", "intereses"],
    requirements: [
      "Identificación oficial de mutuante y mutuario",
      "Comprobante de domicilio",
      "Garantía del préstamo",
      "Comprobante de ingresos",
    ],
  },
  {
    id: "reconocimiento-adeudo",
    name: "Reconocimiento de Adeudo",
    icon: FileText,
    description: "Reconocimiento formal de deuda",
    color: "bg-yellow-50 border-yellow-200 text-yellow-700",
    iconColor: "text-yellow-600",
    estimatedCost: "$1,800",
    timeRequired: "30-60 minutos",
    keywords: ["adeudo", "deuda", "reconocimiento", "obligación", "pagar"],
    requirements: [
      "Identificación oficial del deudor",
      "Comprobante de domicilio",
      "Documentos que acrediten la deuda",
    ],
  },
  {
    id: "adjudicacion-hereditaria",
    name: "Adjudicaciones Hereditarias",
    icon: Scale,
    description: "Herencia testamentaria e intestamentaria",
    color: "bg-amber-50 border-amber-200 text-amber-700",
    iconColor: "text-amber-600",
    estimatedCost: "$8,500",
    timeRequired: "2-4 horas",
    keywords: [
      "adjudicación",
      "herencia",
      "sucesión",
      "testamentaria",
      "intestamentaria",
    ],
    requirements: [
      "Acta de defunción",
      "Identificación oficial de herederos",
      "Comprobante de domicilio",
      "Documentos de la herencia",
    ],
  },
  {
    id: "sociedad",
    name: "Constitución de Sociedades",
    icon: Building,
    description: "Formaliza tu empresa",
    color: "bg-purple-50 border-purple-200 text-purple-700",
    iconColor: "text-purple-600",
    estimatedCost: "$15,000",
    timeRequired: "2-3 horas",
    keywords: [
      "sociedad",
      "empresa",
      "negocio",
      "constituir",
      "compañía",
      "socios",
    ],
    requirements: [
      "Identificación oficial de socios",
      "Comprobante de domicilio",
      "Denominación social propuesta",
      "Capital social inicial",
      "Objeto social de la empresa",
    ],
  },
  {
    id: "liquidacion-copropiedad",
    name: "Liquidación de Copropiedad",
    icon: Home,
    description: "División de propiedad en común",
    color: "bg-slate-50 border-slate-200 text-slate-700",
    iconColor: "text-slate-600",
    estimatedCost: "$8,500",
    timeRequired: "2-3 horas",
    keywords: ["copropiedad", "liquidación", "división", "común", "partir"],
    requirements: [
      "Identificación oficial de copropietarios",
      "Comprobante de domicilio",
      "Escritura de la propiedad",
      "Avalúo de la propiedad",
    ],
  },
  {
    id: "cesion-derechos",
    name: "Cesión de Derechos",
    icon: FileText,
    description: "Transferencia de derechos patrimoniales",
    color: "bg-violet-50 border-violet-200 text-violet-700",
    iconColor: "text-violet-600",
    estimatedCost: "$3,500",
    timeRequired: "1-2 horas",
    keywords: ["cesión", "derechos", "transferir", "ceder", "patrimoniales"],
    requirements: [
      "Identificación oficial de cedente y cesionario",
      "Comprobante de domicilio",
      "Documentos que acrediten los derechos",
    ],
  },
  {
    id: "servidumbre",
    name: "Constitución de Servidumbre",
    icon: Home,
    description: "Derecho de uso sobre propiedad ajena",
    color: "bg-lime-50 border-lime-200 text-lime-700",
    iconColor: "text-lime-600",
    estimatedCost: "$4,500",
    timeRequired: "1-2 horas",
    keywords: ["servidumbre", "derecho", "uso", "paso", "servicio"],
    requirements: [
      "Identificación oficial de las partes",
      "Comprobante de domicilio",
      "Escrituras de las propiedades",
      "Plano de la servidumbre",
    ],
  },
  {
    id: "convenios-modificatorios",
    name: "Convenios Modificatorios",
    icon: FileText,
    description: "Modificación de contratos existentes",
    color: "bg-rose-50 border-rose-200 text-rose-700",
    iconColor: "text-rose-600",
    estimatedCost: "$3,000",
    timeRequired: "1-2 horas",
    keywords: ["convenio", "modificación", "contrato", "cambiar", "alterar"],
    requirements: [
      "Identificación oficial de las partes",
      "Comprobante de domicilio",
      "Contrato original",
      "Documentos de la modificación",
    ],
  },
  {
    id: "elevacion-judicial",
    name: "Elevación Judicial a Escritura Pública",
    icon: Scale,
    description: "Elevación de sentencia a escritura",
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
    iconColor: "text-emerald-600",
    estimatedCost: "$8,500",
    timeRequired: "2-3 horas",
    keywords: ["elevación", "judicial", "sentencia", "escritura", "juez"],
    requirements: [
      "Identificación oficial",
      "Comprobante de domicilio",
      "Sentencia judicial",
      "Documentos de la propiedad",
    ],
  },
  {
    id: "dacion-pago",
    name: "Dación en Pago",
    icon: CreditCard,
    description: "Pago de deuda con bienes",
    color: "bg-teal-50 border-teal-200 text-teal-700",
    iconColor: "text-teal-600",
    estimatedCost: "$4,500",
    timeRequired: "1-2 horas",
    keywords: ["dación", "pago", "deuda", "bienes", "satisfacer"],
    requirements: [
      "Identificación oficial de las partes",
      "Comprobante de domicilio",
      "Documentos de la deuda",
      "Avalúo de los bienes",
    ],
  },
  {
    id: "formalizacion-contrato",
    name: "Formalización de Contrato Privado",
    icon: FileText,
    description: "Elevación de contrato privado a escritura",
    color: "bg-indigo-50 border-indigo-200 text-indigo-700",
    iconColor: "text-indigo-600",
    estimatedCost: "$5,500",
    timeRequired: "1-2 horas",
    keywords: ["formalización", "contrato", "privado", "escritura", "elevar"],
    requirements: [
      "Identificación oficial de las partes",
      "Comprobante de domicilio",
      "Contrato privado original",
      "Documentos de la propiedad",
    ],
  },
  {
    id: "fideicomiso",
    name: "Fideicomisos",
    icon: Shield,
    description: "Constitución y transmisión de fideicomisos",
    color: "bg-teal-50 border-teal-200 text-teal-700",
    iconColor: "text-teal-600",
    estimatedCost: "$18,000",
    timeRequired: "3-4 horas",
    keywords: ["fideicomiso", "fiduciario", "fideicomitente", "fideicomisario"],
    requirements: [
      "Identificación oficial de las partes",
      "Comprobante de domicilio",
      "Documentos de la propiedad",
      "Contrato de fideicomiso",
    ],
  },
  {
    id: "inicio-sucesion",
    name: "Inicio de Sucesión",
    icon: Scale,
    description: "Inicio de proceso sucesorio",
    color: "bg-amber-50 border-amber-200 text-amber-700",
    iconColor: "text-amber-600",
    estimatedCost: "$8,500",
    timeRequired: "2-4 horas",
    keywords: [
      "sucesión",
      "inicio",
      "herencia",
      "testamentaria",
      "intestamentaria",
    ],
    requirements: [
      "Acta de defunción",
      "Identificación oficial de herederos",
      "Comprobante de domicilio",
      "Documentos de la herencia",
    ],
  },
  {
    id: "cancelacion-hipoteca",
    name: "Cancelación de Hipoteca",
    icon: CheckCircle,
    description: "Liberación de gravamen hipotecario",
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
    iconColor: "text-emerald-600",
    estimatedCost: "$4,500",
    timeRequired: "1-2 horas",
    keywords: ["cancelación", "hipoteca", "liberar", "pagar", "crédito"],
    requirements: [
      "Identificación oficial",
      "Comprobante de pago total",
      "Escritura con hipoteca",
      "Comprobante de domicilio",
    ],
  },
  {
    id: "protocolizacion-acta",
    name: "Protocolización de Acta de Asamblea",
    icon: FileText,
    description: "Protocolización de actas de asamblea",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    iconColor: "text-blue-600",
    estimatedCost: "$3,000",
    timeRequired: "1-2 horas",
    keywords: ["protocolización", "acta", "asamblea", "sociedad", "reunión"],
    requirements: [
      "Identificación oficial de asistentes",
      "Comprobante de domicilio",
      "Acta de asamblea",
      "Documentos de la sociedad",
    ],
  },
  {
    id: "cambio-regimen-matrimonial",
    name: "Cambio de Régimen Matrimonial",
    icon: Heart,
    description: "Modificación del régimen matrimonial",
    color: "bg-pink-50 border-pink-200 text-pink-700",
    iconColor: "text-pink-600",
    estimatedCost: "$4,500",
    timeRequired: "1-2 horas",
    keywords: ["régimen", "matrimonial", "cambio", "bienes", "mancomunado"],
    requirements: [
      "Identificación oficial de ambos cónyuges",
      "Comprobante de domicilio",
      "Acta de matrimonio",
      "Documentos de bienes",
    ],
  },
  {
    id: "cotejos",
    name: "Cotejos",
    icon: FileText,
    description: "Comparación de documentos",
    color: "bg-gray-50 border-gray-200 text-gray-700",
    iconColor: "text-gray-600",
    estimatedCost: "$800",
    timeRequired: "15-30 minutos",
    keywords: ["cotejo", "comparar", "documento", "verificar", "igual"],
    requirements: [
      "Identificación oficial",
      "Documentos a cotejar",
      "Comprobante de domicilio",
    ],
  },
  {
    id: "fe-hechos",
    name: "Fe de Hechos",
    icon: FileText,
    description: "Constancia notarial de hechos",
    color: "bg-slate-50 border-slate-200 text-slate-700",
    iconColor: "text-slate-600",
    estimatedCost: "$1,800",
    timeRequired: "30-60 minutos",
    keywords: ["fe", "hechos", "constancia", "notarial", "testimonio"],
    requirements: [
      "Identificación oficial",
      "Comprobante de domicilio",
      "Testigos del hecho",
    ],
  },
  {
    id: "poderes",
    name: "Poderes",
    icon: Shield,
    description: "Representación legal confiable",
    color: "bg-green-50 border-green-200 text-green-700",
    iconColor: "text-green-600",
    estimatedCost: "$2,200",
    timeRequired: "30-60 minutos",
    keywords: ["poder", "representar", "apoderado", "facultades", "delegar"],
    requirements: [
      "Identificación oficial del poderdante",
      "Identificación oficial del apoderado",
      "Comprobante de domicilio",
      "Especificar facultades del poder",
    ],
  },
  {
    id: "rectificacion-escrituras",
    name: "Rectificación de Escrituras",
    icon: FileText,
    description: "Corrección de errores en escrituras",
    color: "bg-orange-50 border-orange-200 text-orange-700",
    iconColor: "text-orange-600",
    estimatedCost: "$3,000",
    timeRequired: "1-2 horas",
    keywords: [
      "rectificación",
      "escritura",
      "corrección",
      "error",
      "modificar",
    ],
    requirements: [
      "Identificación oficial",
      "Comprobante de domicilio",
      "Escritura original",
      "Documentos que acrediten el error",
    ],
  },
];

export function TramiteModal({
  isOpen,
  onClose,
  preselectedTramite,
  onTramiteSelect,
}: TramiteModalProps) {
  const [selectedTramite, setSelectedTramite] = useState<string | null>(
    preselectedTramite || null
  );
  const [userInfo, setUserInfo] = useState({
    nombre: "",
    telefono: "",
    email: "",
    tramiteEspecifico: "",
  });
  const [step, setStep] = useState(1); // 1: selección, 2: asesoría (eliminamos el paso de datos personales)
  const [searchQuery, setSearchQuery] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [valorInmueble, setValorInmueble] = useState("");
  const [zonaInmueble, setZonaInmueble] = useState("");

  // Actualizar cuando cambie el trámite preseleccionado
  useEffect(() => {
    if (preselectedTramite) {
      setSelectedTramite(preselectedTramite);
      setStep(2);
    } else {
      setSelectedTramite(null);
      setStep(1);
    }
  }, [preselectedTramite]);

  // Filtrar trámites basado en la búsqueda
  const filteredTramites = tramites.filter((tramite) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      tramite.name.toLowerCase().includes(query) ||
      tramite.description.toLowerCase().includes(query) ||
      tramite.keywords.some((keyword) => keyword.toLowerCase().includes(query))
    );
  });

  const handleTramiteSelect = (tramiteId: string) => {
    setSelectedTramite(tramiteId);
    setStep(2);
  };

  const handleVoiceSearch = () => {
    if (isRecording) {
      // Parar grabación
      if ((window as any).speechRecognition) {
        (window as any).speechRecognition.stop();
      }
      setIsRecording(false);
    } else {
      // Iniciar grabación
      if (
        "webkitSpeechRecognition" in window ||
        "SpeechRecognition" in window
      ) {
        const SpeechRecognition =
          (window as any).SpeechRecognition ||
          (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = "es-MX";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
          setIsRecording(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript.toLowerCase();
          setSearchQuery(transcript);
          setIsRecording(false);
        };

        recognition.onerror = (event: any) => {
          console.error("Error en reconocimiento de voz:", event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.start();
      } else {
        // Fallback si no hay soporte de voz
        alert(
          "Tu navegador no soporta reconocimiento de voz. Usa el campo de texto."
        );
      }
    }
  };

  const handleContinue = () => {
    setStep(2);
  };

  const handleWhatsApp = () => {
    const tramite = tramites.find((t) => t.id === selectedTramite);
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
    const tramite = tramites.find((t) => t.id === selectedTramite);
    const subject = `Consulta sobre ${tramite?.name}`;
    const body = `Hola,\n\nMe interesa hacer un ${tramite?.name}.\n\nDatos de contacto:\nNombre: ${userInfo.nombre}\nTeléfono: ${userInfo.telefono}\nEmail: ${userInfo.email}\n\nDetalles adicionales:\n${userInfo.tramiteEspecifico}\n\nGracias.`;
    const mailtoUrl = `mailto:contacto@notaria3tijuana.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  const handleIniciarTramite = () => {
    if (onTramiteSelect) {
      // Si hay callback, usarlo para notificar la selección
      onTramiteSelect(selectedTramite!);
      onClose();
    } else {
      // Comportamiento original: redirigir a login
      const loginUrl = `/login?tramite=${selectedTramite}&redirect=${encodeURIComponent('/iniciar-tramite')}`;
      window.open(loginUrl, "_blank");
    }
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

    switch (tramiteId) {
      case "compraventa":
        porcentaje =
          zona === "centro" ? 0.025 : zona === "zona-rio" ? 0.03 : 0.035;
        costoMinimo = 15000;
        costoMaximo = 50000;
        break;
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

  const obtenerDesgloseCosto = (tramiteId: string) => {
    const desgloses = {
      testamento: {
        honorariosNotario: 1500,
        impuestos: 1200,
        gastosRegistro: 500,
        total: 3200,
      },
      compraventa: {
        honorariosNotario: 8000,
        impuestos: 12000,
        gastosRegistro: 3000,
        avaluo: 2000,
        total: 25000,
      },
      donacion: {
        honorariosNotario: 2000,
        impuestos: 1500,
        gastosRegistro: 1000,
        total: 4500,
      },
      permuta: {
        honorariosNotario: 4000,
        impuestos: 5000,
        gastosRegistro: 2000,
        avaluo: 1000,
        total: 12000,
      },
      "credito-hipotecario": {
        honorariosNotario: 4000,
        impuestos: 5000,
        gastosRegistro: 2000,
        avaluo: 1000,
        total: 12000,
      },
      sociedad: {
        honorariosNotario: 8000,
        impuestos: 4000,
        gastosRegistro: 2000,
        gastosPublicacion: 1000,
        total: 15000,
      },
      fideicomiso: {
        honorariosNotario: 10000,
        impuestos: 5000,
        gastosRegistro: 2000,
        gastosPublicacion: 1000,
        total: 18000,
      },
      "adjudicacion-hereditaria": {
        honorariosNotario: 4000,
        impuestos: 3000,
        gastosRegistro: 1500,
        total: 8500,
      },
      "liquidacion-copropiedad": {
        honorariosNotario: 4000,
        impuestos: 3000,
        gastosRegistro: 1500,
        total: 8500,
      },
      "elevacion-judicial": {
        honorariosNotario: 4000,
        impuestos: 3000,
        gastosRegistro: 1500,
        total: 8500,
      },
      "inicio-sucesion": {
        honorariosNotario: 4000,
        impuestos: 3000,
        gastosRegistro: 1500,
        total: 8500,
      },
    };

    return desgloses[tramiteId as keyof typeof desgloses] || null;
  };

  const resetModal = () => {
    setSelectedTramite(preselectedTramite || null);
    setUserInfo({ nombre: "", telefono: "", email: "", tramiteEspecifico: "" });
    setStep(preselectedTramite ? 2 : 1);
    setSearchQuery("");
    setIsRecording(false);
    setValorInmueble("");
    setZonaInmueble("");
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const tramite = selectedTramite
    ? tramites.find((t) => t.id === selectedTramite)
    : null;

  const costoCalculado =
    tramite &&
    ["compraventa", "donacion", "permuta", "credito-hipotecario"].includes(
      tramite.id
    )
      ? calcularCostoVariable(tramite.id, valorInmueble, zonaInmueble)
      : null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        {/* Header fijo */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-center">
                {step === 1 && "¿Qué trámite necesitas realizar?"}
                {step === 2 && `Asesoría para ${tramite?.name}`}
              </DialogTitle>
              <DialogDescription className="text-center mt-2">
                {step === 1 &&
                  "Selecciona el tipo de trámite que necesitas y te ayudaremos con toda la información"}
                {step === 2 &&
                  "Aquí tienes toda la información que necesitas para tu trámite"}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0 hover:bg-gray-100 ml-4"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Contenido scrolleable */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6 pb-8">
          {step === 1 && (
            <div className="space-y-6 mt-6">
              {/* Buscador */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    ¿Qué deseas hacer?
                  </h3>
                  <p className="text-sm text-gray-600">
                    Escribe o dicta lo que necesitas y te ayudamos a encontrar
                    el trámite correcto
                  </p>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Ej: testamento, compraventa, poder, sociedad..."
                      className="pl-10 pr-4"
                    />
                  </div>
                  <Button
                    onClick={handleVoiceSearch}
                    variant="outline"
                    className={`px-4 ${
                      isRecording ? "bg-red-50 border-red-200 text-red-600" : ""
                    }`}
                  >
                    {isRecording ? (
                      <MicOff className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {isRecording && (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-sm text-red-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      Escuchando... Di lo que necesitas
                    </div>
                  </div>
                )}
              </div>

              {/* Resultados */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {filteredTramites.length > 0 ? (
                  filteredTramites.map((tramite) => {
                    const IconComponent = tramite.icon;
                    return (
                      <Card
                        key={tramite.id}
                        className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${tramite.color} border-2`}
                        onClick={() => handleTramiteSelect(tramite.id)}
                      >
                        <CardHeader className="text-center">
                          <div className="mx-auto mb-4">
                            <IconComponent
                              className={`h-12 w-12 ${tramite.iconColor}`}
                            />
                          </div>
                          <CardTitle className="text-lg">
                            {tramite.name}
                          </CardTitle>
                          <CardDescription>
                            {tramite.description}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    );
                  })
                ) : (
                  <div className="col-span-2 text-center py-8">
                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No encontramos trámites
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Intenta con otras palabras o usa la búsqueda por voz
                    </p>
                    <Button
                      onClick={() => setSearchQuery("")}
                      variant="outline"
                      size="sm"
                    >
                      Ver todos los trámites
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && tramite && (
            <div className="space-y-6 mt-4 mb-8">
              {/* Información del trámite */}
              <Card className="border-2 border-emerald-200 bg-emerald-50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <tramite.icon className={`h-8 w-8 ${tramite.iconColor}`} />
                    <div>
                      <CardTitle className="text-xl">{tramite.name}</CardTitle>
                      <CardDescription className="text-base">
                        {tramite.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Párrafo de introducción */}
              <div className="text-center px-4 py-3 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-100">
                <p className="text-gray-700 text-base leading-relaxed">
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

              {/* Información del servicio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      Tiempo Requerido
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-blue-600">
                      {tramite.timeRequired}
                    </p>
                    <p className="text-sm text-gray-600">
                      * Tiempo aproximado en notaría
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-purple-600" />
                      Documentos Necesarios
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-purple-600">
                      {tramite.requirements.length} documentos
                    </p>
                    <p className="text-sm text-gray-600">
                      * Lista detallada abajo
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Requisitos */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    Documentos Requeridos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tramite.requirements.map((req, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Inversión Aproximada */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Inversión Aproximada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {costoCalculado ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calculator className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium text-blue-600">
                          Calculadora de Costos
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Valor del inmueble
                          </label>
                          <Input
                            value={valorInmueble}
                            onChange={(e) => setValorInmueble(e.target.value)}
                            placeholder="Ej: $500,000"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Zona del inmueble
                          </label>
                          <select
                            value={zonaInmueble}
                            onChange={(e) => setZonaInmueble(e.target.value)}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="">Selecciona una zona</option>
                            <option value="centro">Centro (2.5%)</option>
                            <option value="zona-rio">Zona Río (3%)</option>
                            <option value="otras">Otras zonas (3.5%)</option>
                          </select>
                        </div>
                      </div>

                      {costoCalculado && (
                        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                          <p className="text-lg font-bold text-green-600">
                            ${costoCalculado.costo.toLocaleString()}
                          </p>
                          <p className="text-xs text-green-600">
                            Basado en {costoCalculado.porcentaje}% del valor del
                            inmueble
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-green-600 mb-2">
                          {tramite.estimatedCost}
                        </p>
                        <p className="text-sm text-gray-600">
                          * Rango aproximado, puede variar según el caso
                          específico
                        </p>
                      </div>

                      {obtenerDesgloseCosto(tramite.id) && (
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Calculator className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-600">
                              Desglose de Costos
                            </span>
                          </div>
                          <div className="space-y-1 text-sm">
                            {obtenerDesgloseCosto(tramite.id)
                              ?.honorariosNotario && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Honorarios Notario:
                                </span>
                                <span className="font-medium">
                                  $
                                  {obtenerDesgloseCosto(
                                    tramite.id
                                  )?.honorariosNotario.toLocaleString()}
                                </span>
                              </div>
                            )}
                            {obtenerDesgloseCosto(tramite.id)?.impuestos && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Impuestos:
                                </span>
                                <span className="font-medium">
                                  $
                                  {obtenerDesgloseCosto(
                                    tramite.id
                                  )?.impuestos.toLocaleString()}
                                </span>
                              </div>
                            )}
                            {obtenerDesgloseCosto(tramite.id)
                              ?.gastosRegistro && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Gastos de Registro:
                                </span>
                                <span className="font-medium">
                                  $
                                  {obtenerDesgloseCosto(
                                    tramite.id
                                  )?.gastosRegistro.toLocaleString()}
                                </span>
                              </div>
                            )}
                            {(obtenerDesgloseCosto(tramite.id) as any)
                              ?.avaluo && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Avalúo:</span>
                                <span className="font-medium">
                                  $
                                  {(
                                    obtenerDesgloseCosto(tramite.id) as any
                                  )?.avaluo.toLocaleString()}
                                </span>
                              </div>
                            )}
                            {(obtenerDesgloseCosto(tramite.id) as any)
                              ?.gastosPublicacion && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Gastos de Publicación:
                                </span>
                                <span className="font-medium">
                                  $
                                  {(
                                    obtenerDesgloseCosto(tramite.id) as any
                                  )?.gastosPublicacion.toLocaleString()}
                                </span>
                              </div>
                            )}
                            <div className="border-t border-gray-300 pt-1 mt-2">
                              <div className="flex justify-between font-bold">
                                <span>Total:</span>
                                <span className="text-green-600">
                                  $
                                  {obtenerDesgloseCosto(
                                    tramite.id
                                  )?.total.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Acciones */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">
                  ¿Cómo quieres continuar?
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={handleIniciarTramite}
                    className="h-32 p-4 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
                    size="lg"
                  >
                    <FileText className="h-6 w-6 flex-shrink-0" />
                    <div className="text-center space-y-1">
                      <div className="font-bold text-base leading-tight">
                        Iniciar Expediente Digital
                      </div>
                      <div className="text-xs opacity-90 leading-tight px-2">
                        Completa tu trámite
                        <br />
                        paso a paso
                      </div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => window.open("/citas", "_blank")}
                    variant="outline"
                    className="h-32 p-4 flex flex-col items-center justify-center gap-2 border-2 border-slate-300 hover:border-emerald-500 hover:bg-emerald-50"
                    size="lg"
                  >
                    <Calendar className="h-6 w-6 text-slate-600 flex-shrink-0" />
                    <div className="text-center space-y-1">
                      <div className="font-bold text-base leading-tight text-slate-700">
                        Agendar Cita
                      </div>
                      <div className="text-xs text-slate-600 leading-tight px-2">
                        Ven a la notaría para
                        <br />
                        asesoría personal
                      </div>
                    </div>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={handleWhatsApp}
                    variant="outline"
                    className="h-20 p-3 flex items-center gap-3 border-2 border-green-200 hover:border-green-500 hover:bg-green-50"
                  >
                    <MessageCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div className="text-left min-w-0 flex-1">
                      <div className="font-semibold text-green-700 text-sm leading-tight">
                        Enviar por WhatsApp
                      </div>
                      <div className="text-xs text-green-600 leading-tight">
                        Recibe información
                        <br />
                        instantánea
                      </div>
                    </div>
                  </Button>

                  <Button
                    onClick={handleEmail}
                    variant="outline"
                    className="h-20 p-3 flex items-center gap-3 border-2 border-blue-200 hover:border-blue-500 hover:bg-blue-50"
                  >
                    <Mail className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div className="text-left min-w-0 flex-1">
                      <div className="font-semibold text-blue-700 text-sm leading-tight">
                        Enviar por Email
                      </div>
                      <div className="text-xs text-blue-600 leading-tight">
                        Recibe información
                        <br />
                        detallada
                      </div>
                    </div>
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  ¿Necesitas más información? Contáctanos
                </div>
                <Button
                  onClick={handleClose}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
