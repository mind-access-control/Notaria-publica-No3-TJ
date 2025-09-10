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
}

const tramites = [
  {
    id: "testamento",
    name: "Testamento",
    icon: Heart,
    description: "Protege el futuro de tu familia",
    color: "bg-red-50 border-red-200 text-red-700",
    iconColor: "text-red-600",
    estimatedCost: "$2,500 - $4,000",
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
    estimatedCost: "$15,000 - $50,000",
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
    estimatedCost: "$3,000 - $8,000",
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
    estimatedCost: "$8,000 - $25,000",
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
    estimatedCost: "$8,000 - $20,000",
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
    estimatedCost: "$2,000 - $5,000",
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
    estimatedCost: "$1,000 - $3,000",
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
    estimatedCost: "$5,000 - $15,000",
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
    estimatedCost: "$8,000 - $25,000",
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
    estimatedCost: "$5,000 - $15,000",
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
    estimatedCost: "$2,000 - $6,000",
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
    estimatedCost: "$3,000 - $8,000",
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
    estimatedCost: "$2,000 - $5,000",
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
    estimatedCost: "$5,000 - $15,000",
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
    estimatedCost: "$3,000 - $8,000",
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
    estimatedCost: "$3,000 - $10,000",
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
    estimatedCost: "$10,000 - $30,000",
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
    estimatedCost: "$5,000 - $15,000",
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
    estimatedCost: "$3,000 - $8,000",
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
    estimatedCost: "$2,000 - $5,000",
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
    estimatedCost: "$3,000 - $8,000",
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
    estimatedCost: "$500 - $1,500",
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
    estimatedCost: "$1,000 - $3,000",
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
    estimatedCost: "$1,500 - $3,000",
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
    estimatedCost: "$2,000 - $5,000",
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
    const expedienteUrl = `/expediente-digital?tramite=${selectedTramite}`;
    window.open(expedienteUrl, "_blank");
  };

  const resetModal = () => {
    setSelectedTramite(preselectedTramite || null);
    setUserInfo({ nombre: "", telefono: "", email: "", tramiteEspecifico: "" });
    setStep(preselectedTramite ? 2 : 1);
    setSearchQuery("");
    setIsRecording(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const tramite = selectedTramite
    ? tramites.find((t) => t.id === selectedTramite)
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {step === 1 && "¿Qué trámite necesitas realizar?"}
            {step === 2 && `Asesoría para ${tramite?.name}`}
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === 1 &&
              "Selecciona el tipo de trámite que necesitas y te ayudaremos con toda la información"}
            {step === 2 &&
              "Aquí tienes toda la información que necesitas para tu trámite"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6 mt-6">
            {/* Buscador */}
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ¿Qué deseas hacer?
                </h3>
                <p className="text-sm text-gray-600">
                  Escribe o dicta lo que necesitas y te ayudamos a encontrar el
                  trámite correcto
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <CardDescription>{tramite.description}</CardDescription>
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
          <div className="space-y-6 mt-6">
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

            {/* Costos y tiempo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Costo Estimado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">
                    {tramite.estimatedCost}
                  </p>
                  <p className="text-sm text-gray-600">
                    * El costo final puede variar según la complejidad
                  </p>
                </CardContent>
              </Card>

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

            {/* Acciones */}
            <div className="space-y-4">
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

            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleClose}>Cerrar</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
