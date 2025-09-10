"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Plus,
  FileText,
  Users,
  Calendar,
  DollarSign,
  Upload,
  CheckCircle,
  AlertCircle,
  Eye,
  X,
  Loader2,
  Download,
  Printer,
  Send,
} from "lucide-react";

// Configuración de trámites con sus requisitos
const tramitesConfig = {
  compraventas: {
    nombre: "Compraventas",
    descripcion:
      "Contrato mediante el cual una persona (vendedor) se obliga a transferir la propiedad de un bien a otra (comprador) a cambio de un precio.",
    documentosRequeridos: [
      "Identificación oficial vigente (INE/Pasaporte)",
      "Comprobante de domicilio (no mayor a 3 meses)",
      "Escritura de propiedad o título de propiedad",
      "Avalúo comercial del inmueble",
      "Constancia de no adeudo de predial",
      "Constancia de no adeudo de agua",
      "Certificado de libertad de gravamen",
      "Contrato de compraventa privado (si aplica)",
    ],
    costos: { aranceles: 15000, impuestos: 5000, derechos: 2000, total: 22000 },
    tiempoEstimado: "15-20 días hábiles",
  },
  donaciones: {
    nombre: "Donaciones",
    descripcion:
      "Acto jurídico mediante el cual una persona (donante) transfiere gratuitamente un bien a otra (donatario).",
    documentosRequeridos: [
      "Identificación oficial vigente (INE/Pasaporte)",
      "Comprobante de domicilio (no mayor a 3 meses)",
      "Escritura de propiedad o título de propiedad",
      "Avalúo comercial del inmueble",
      "Constancia de no adeudo de predial",
      "Constancia de no adeudo de agua",
      "Certificado de libertad de gravamen",
      "Carta de aceptación de donación",
    ],
    costos: { aranceles: 12000, impuestos: 3000, derechos: 1500, total: 16500 },
    tiempoEstimado: "12-15 días hábiles",
  },
  permutas: {
    nombre: "Permutas",
    descripcion: "Intercambio de bienes inmuebles entre dos partes.",
    documentosRequeridos: [
      "Identificación oficial vigente (INE/Pasaporte)",
      "Comprobante de domicilio (no mayor a 3 meses)",
      "Escritura de propiedad de ambos bienes",
      "Avalúo comercial de ambos bienes",
      "Constancia de no adeudo de predial de ambos bienes",
      "Certificado de libertad de gravamen de ambos bienes",
    ],
    costos: { aranceles: 18000, impuestos: 6000, derechos: 2500, total: 26500 },
    tiempoEstimado: "20-25 días hábiles",
  },
  creditos_hipotecarios: {
    nombre: "Créditos Hipotecarios / Infonavit / Fovissste",
    descripcion: "Constitución de hipoteca para garantizar un crédito.",
    documentosRequeridos: [
      "Identificación oficial vigente (INE/Pasaporte)",
      "Comprobante de domicilio (no mayor a 3 meses)",
      "Escritura de propiedad",
      "Avalúo comercial del inmueble",
      "Constancia de no adeudo de predial",
      "Certificado de libertad de gravamen",
      "Contrato de crédito",
      "Póliza de seguro",
    ],
    costos: { aranceles: 20000, impuestos: 8000, derechos: 3000, total: 31000 },
    tiempoEstimado: "25-30 días hábiles",
  },
  contrato_mutuo: {
    nombre: "Contrato de Mutuo",
    descripcion:
      "Contrato mediante el cual una persona se obliga a transferir la propiedad de una suma de dinero a otra.",
    documentosRequeridos: [
      "Identificación oficial vigente (INE/Pasaporte)",
      "Comprobante de domicilio (no mayor a 3 meses)",
      "Comprobante de ingresos",
      "Referencias comerciales",
      "Garantías (si aplica)",
    ],
    costos: { aranceles: 8000, impuestos: 2000, derechos: 1000, total: 11000 },
    tiempoEstimado: "5-7 días hábiles",
  },
  reconocimiento_adeudo: {
    nombre: "Reconocimiento de Adeudo",
    descripcion:
      "Acto mediante el cual una persona reconoce formalmente una deuda.",
    documentosRequeridos: [
      "Identificación oficial vigente (INE/Pasaporte)",
      "Comprobante de domicilio (no mayor a 3 meses)",
      "Documentos que acrediten la deuda",
      "Comprobantes de pago parcial (si aplica)",
    ],
    costos: { aranceles: 5000, impuestos: 1000, derechos: 500, total: 6500 },
    tiempoEstimado: "3-5 días hábiles",
  },
  adjudicaciones_hereditarias: {
    nombre:
      "Adjudicaciones Hereditarias (testamentaria / Intestamentaria / continuación de Juicios Sucesorios)",
    descripcion: "Adjudicación de bienes hereditarios a los herederos.",
    documentosRequeridos: [
      "Identificación oficial vigente (INE/Pasaporte)",
      "Comprobante de domicilio (no mayor a 3 meses)",
      "Acta de defunción",
      "Testamento (si aplica)",
      "Acta de nacimiento de herederos",
      "Acta de matrimonio (si aplica)",
      "Inventario de bienes",
      "Avalúo de bienes",
    ],
    costos: {
      aranceles: 25000,
      impuestos: 10000,
      derechos: 5000,
      total: 40000,
    },
    tiempoEstimado: "30-45 días hábiles",
  },
  adjudicaciones: {
    nombre: "Adjudicaciones",
    descripcion:
      "Adjudicación de bienes en procesos judiciales o extrajudiciales.",
    documentosRequeridos: [
      "Identificación oficial vigente (INE/Pasaporte)",
      "Comprobante de domicilio (no mayor a 3 meses)",
      "Sentencia judicial (si aplica)",
      "Escritura de propiedad",
      "Avalúo comercial",
      "Constancia de no adeudo de predial",
    ],
    costos: { aranceles: 20000, impuestos: 8000, derechos: 3000, total: 31000 },
    tiempoEstimado: "20-25 días hábiles",
  },
  constitucion_sociedades: {
    nombre: "Constitución de Sociedades",
    descripcion:
      "Constitución de personas morales para el ejercicio de actividades comerciales.",
    documentosRequeridos: [
      "Identificación oficial vigente (INE/Pasaporte) de socios",
      "Comprobante de domicilio (no mayor a 3 meses)",
      "Acta constitutiva",
      "Poder notarial de representantes",
      "Constancia de reserva de nombre",
      "Capital social",
    ],
    costos: {
      aranceles: 30000,
      impuestos: 12000,
      derechos: 5000,
      total: 47000,
    },
    tiempoEstimado: "15-20 días hábiles",
  },
  liquidacion_copropiedad: {
    nombre: "Liquidación de Copropiedad",
    descripcion:
      "Liquidación de bienes en copropiedad entre varios propietarios.",
    documentosRequeridos: [
      "Identificación oficial vigente (INE/Pasaporte)",
      "Comprobante de domicilio (no mayor a 3 meses)",
      "Escritura de propiedad",
      "Avalúo comercial",
      "Acuerdo de liquidación",
      "Constancia de no adeudo de predial",
    ],
    costos: { aranceles: 18000, impuestos: 6000, derechos: 2500, total: 26500 },
    tiempoEstimado: "15-20 días hábiles",
  },
  cesion_derechos: {
    nombre: "Cesión de Derechos",
    descripcion: "Cesión de derechos sobre bienes inmuebles.",
    documentosRequeridos: [
      "Identificación oficial vigente (INE/Pasaporte)",
      "Comprobante de domicilio (no mayor a 3 meses)",
      "Escritura de propiedad",
      "Contrato de cesión",
      "Avalúo comercial",
    ],
    costos: { aranceles: 15000, impuestos: 5000, derechos: 2000, total: 22000 },
    tiempoEstimado: "12-15 días hábiles",
  },
  constitucion_servidumbre: {
    nombre: "Constitución de Servidumbre",
    descripcion: "Constitución de servidumbres sobre bienes inmuebles.",
    documentosRequeridos: [
      "Identificación oficial vigente (INE/Pasaporte)",
      "Comprobante de domicilio (no mayor a 3 meses)",
      "Escritura de propiedad",
      "Plano de servidumbre",
      "Avalúo comercial",
    ],
    costos: { aranceles: 12000, impuestos: 4000, derechos: 1500, total: 17500 },
    tiempoEstimado: "10-15 días hábiles",
  },
  convenios_modificatorios: {
    nombre: "Convenios Modificatorios",
    descripcion: "Modificación de contratos o escrituras existentes.",
    documentosRequeridos: [
      "Identificación oficial vigente (INE/Pasaporte)",
      "Comprobante de domicilio (no mayor a 3 meses)",
      "Escritura original",
      "Convenio modificatorio",
      "Avalúo comercial (si aplica)",
    ],
    costos: { aranceles: 10000, impuestos: 3000, derechos: 1000, total: 14000 },
    tiempoEstimado: "8-12 días hábiles",
  },
  elevacion_judicial: {
    nombre: "Elevación judicial a escritura pública",
    descripcion: "Elevación a escritura pública de sentencias judiciales.",
    documentosRequeridos: [
      "Identificación oficial vigente (INE/Pasaporte)",
      "Comprobante de domicilio (no mayor a 3 meses)",
      "Sentencia judicial",
      "Escritura de propiedad",
      "Avalúo comercial",
    ],
    costos: { aranceles: 20000, impuestos: 8000, derechos: 3000, total: 31000 },
    tiempoEstimado: "20-25 días hábiles",
  },
  dacion_pago: {
    nombre: "Dación en Pago",
    descripcion: "Pago de deuda mediante la entrega de un bien inmueble.",
    documentosRequeridos: [
      "Identificación oficial vigente (INE/Pasaporte)",
      "Comprobante de domicilio (no mayor a 3 meses)",
      "Escritura de propiedad",
      "Contrato de deuda",
      "Avalúo comercial",
      "Constancia de no adeudo de predial",
    ],
    costos: { aranceles: 18000, impuestos: 6000, derechos: 2500, total: 26500 },
    tiempoEstimado: "15-20 días hábiles",
  },
  formalizacion_contrato: {
    nombre:
      "Formalización de contrato privado de compraventa y titulación en propiedad",
    descripcion:
      "Formalización de contratos privados y titulación de propiedad.",
    documentosRequeridos: [
      "Identificación oficial vigente (INE/Pasaporte)",
      "Comprobante de domicilio (no mayor a 3 meses)",
      "Contrato privado",
      "Escritura de propiedad",
      "Avalúo comercial",
      "Constancia de no adeudo de predial",
    ],
    costos: { aranceles: 20000, impuestos: 8000, derechos: 3000, total: 31000 },
    tiempoEstimado: "20-25 días hábiles",
  },
  fideicomisos: {
    nombre:
      "Fideicomisos (constitución / transmisión de propiedad / extinción)",
    descripcion: "Constitución, transmisión o extinción de fideicomisos.",
    documentosRequeridos: [
      "Identificación oficial vigente (INE/Pasaporte)",
      "Comprobante de domicilio (no mayor a 3 meses)",
      "Contrato de fideicomiso",
      "Escritura de propiedad",
      "Avalúo comercial",
      "Constancia de no adeudo de predial",
    ],
    costos: {
      aranceles: 25000,
      impuestos: 10000,
      derechos: 5000,
      total: 40000,
    },
    tiempoEstimado: "25-30 días hábiles",
  },
  inicio_sucesion: {
    nombre: "Inicio de Sucesión (Testamentaria / Intestamentaria)",
    descripcion: "Inicio de proceso sucesorio testamentario o intestamentario.",
    documentosRequeridos: [
      "Identificación oficial vigente (INE/Pasaporte)",
      "Comprobante de domicilio (no mayor a 3 meses)",
      "Acta de defunción",
      "Testamento (si aplica)",
      "Acta de nacimiento de herederos",
      "Acta de matrimonio (si aplica)",
      "Inventario de bienes",
    ],
    costos: {
      aranceles: 30000,
      impuestos: 12000,
      derechos: 5000,
      total: 47000,
    },
    tiempoEstimado: "30-45 días hábiles",
  },
  cancelacion_hipoteca: {
    nombre: "Cancelación de Hipoteca",
    descripcion: "Cancelación de hipoteca una vez pagado el crédito.",
    documentosRequeridos: [
      "Identificación oficial vigente (INE/Pasaporte)",
      "Comprobante de domicilio (no mayor a 3 meses)",
      "Escritura de hipoteca",
      "Constancia de pago total",
      "Certificado de libertad de gravamen",
    ],
    costos: { aranceles: 8000, impuestos: 2000, derechos: 1000, total: 11000 },
    tiempoEstimado: "5-7 días hábiles",
  },
  protocolizacion_acta: {
    nombre: "Protocolización de Acta de Asamblea",
    descripcion: "Protocolización de actas de asamblea de sociedades.",
    documentosRequeridos: [
      "Identificación oficial vigente (INE/Pasaporte)",
      "Comprobante de domicilio (no mayor a 3 meses)",
      "Acta de asamblea",
      "Poder notarial de representantes",
      "Constancia de reserva de nombre",
    ],
    costos: { aranceles: 15000, impuestos: 5000, derechos: 2000, total: 22000 },
    tiempoEstimado: "10-15 días hábiles",
  },
  cambio_regimen_matrimonial: {
    nombre: "Cambio de Régimen Matrimonial",
    descripcion: "Cambio de régimen matrimonial de bienes.",
    documentosRequeridos: [
      "Identificación oficial vigente (INE/Pasaporte)",
      "Comprobante de domicilio (no mayor a 3 meses)",
      "Acta de matrimonio",
      "Escritura de propiedad",
      "Avalúo comercial",
      "Constancia de no adeudo de predial",
    ],
    costos: { aranceles: 20000, impuestos: 8000, derechos: 3000, total: 31000 },
    tiempoEstimado: "20-25 días hábiles",
  },
  cotejos: {
    nombre: "Cotejos",
    descripcion: "Cotejo de documentos con sus originales.",
    documentosRequeridos: [
      "Identificación oficial vigente (INE/Pasaporte)",
      "Comprobante de domicilio (no mayor a 3 meses)",
      "Documento original",
      "Copia a cotejar",
    ],
    costos: { aranceles: 2000, impuestos: 500, derechos: 200, total: 2700 },
    tiempoEstimado: "1-2 días hábiles",
  },
  fe_hechos: {
    nombre: "Fe de Hechos",
    descripcion: "Constancia notarial de hechos presenciados por el notario.",
    documentosRequeridos: [
      "Identificación oficial vigente (INE/Pasaporte)",
      "Comprobante de domicilio (no mayor a 3 meses)",
      "Testigos",
      "Documentos relacionados",
    ],
    costos: { aranceles: 5000, impuestos: 1000, derechos: 500, total: 6500 },
    tiempoEstimado: "3-5 días hábiles",
  },
  poderes: {
    nombre: "Poderes",
    descripcion: "Otorgamiento de poderes notariales.",
    documentosRequeridos: [
      "Identificación oficial vigente (INE/Pasaporte)",
      "Comprobante de domicilio (no mayor a 3 meses)",
      "Identificación del apoderado",
      "Documentos relacionados",
    ],
    costos: { aranceles: 8000, impuestos: 2000, derechos: 1000, total: 11000 },
    tiempoEstimado: "5-7 días hábiles",
  },
  rectificacion_escrituras: {
    nombre: "Rectificación de Escrituras",
    descripcion: "Rectificación de errores en escrituras públicas.",
    documentosRequeridos: [
      "Identificación oficial vigente (INE/Pasaporte)",
      "Comprobante de domicilio (no mayor a 3 meses)",
      "Escritura original",
      "Documentos que acrediten el error",
    ],
    costos: { aranceles: 10000, impuestos: 3000, derechos: 1000, total: 14000 },
    tiempoEstimado: "8-12 días hábiles",
  },
  testamentos: {
    nombre: "Testamentos",
    descripcion:
      "Acto jurídico mediante el cual una persona dispone de sus bienes para después de su muerte.",
    documentosRequeridos: [
      "Identificación oficial vigente (INE/Pasaporte)",
      "Comprobante de domicilio (no mayor a 3 meses)",
      "Acta de nacimiento",
      "Acta de matrimonio (si aplica)",
      "Acta de nacimiento de hijos (si aplica)",
      "Lista de bienes y deudas",
      "Identificación de testigos",
      "Identificación de albacea (si aplica)",
    ],
    costos: { aranceles: 8000, impuestos: 2000, derechos: 1000, total: 11000 },
    tiempoEstimado: "5-7 días hábiles",
  },
};

export default function NuevoExpedientePage() {
  const router = useRouter();
  const [pasoActual, setPasoActual] = useState(1);
  const [tramiteSeleccionado, setTramiteSeleccionado] = useState<string>("");
  const [tabActual, setTabActual] = useState("documentos");
  const [datosCliente, setDatosCliente] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    email: "",
    telefono: "",
    curp: "",
    rfc: "",
    fechaNacimiento: "",
    estadoCivil: "",
    nacionalidad: "",
    ocupacion: "",
    domicilio: {
      calle: "",
      numero: "",
      colonia: "",
      codigoPostal: "",
      ciudad: "",
      estado: "",
    },
  });
  const [documentosSubidos, setDocumentosSubidos] = useState<{
    [key: string]: File;
  }>({});
  const [documentosClasificados, setDocumentosClasificados] = useState<{
    [key: string]: {
      file: File;
      tipo: string;
      confianza: number;
      datosExtraidos?: any;
    };
  }>({});
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const [isProcessingBulkOCR, setIsProcessingBulkOCR] = useState(false);
  const [isGeneratingDocument, setIsGeneratingDocument] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(
    null
  );

  const tramiteInfo = tramiteSeleccionado
    ? tramitesConfig[tramiteSeleccionado as keyof typeof tramitesConfig]
    : null;

  const handleSiguiente = () => {
    if (pasoActual === 1) {
      if (tramiteSeleccionado) {
        setPasoActual(2);
      }
    }
  };

  const handleAnterior = () => {
    if (pasoActual > 1) {
      setPasoActual(pasoActual - 1);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setDatosCliente((prev) => {
        const parentValue = prev[parent as keyof typeof prev];
        return {
          ...prev,
          [parent]: {
            ...(parentValue && typeof parentValue === "object"
              ? parentValue
              : {}),
            [child]: value,
          },
        };
      });
    } else {
      setDatosCliente((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles: { [key: string]: File } = {};
      Array.from(files).forEach((file, index) => {
        const fileId = `doc-${Date.now()}-${index}`;
        newFiles[fileId] = file;
      });
      setDocumentosSubidos((prev) => ({ ...prev, ...newFiles }));

      // Simular clasificación automática para documentos individuales
      Object.entries(newFiles).forEach(([fileId, file]) => {
        const tipo = clasificarDocumento(file.name);
        const confianza = Math.random() * 0.3 + 0.7; // 70-100%
        const datosExtraidos = simularOCR(file.name);

        setDocumentosClasificados((prev) => ({
          ...prev,
          [fileId]: {
            file,
            tipo,
            confianza,
            datosExtraidos,
          },
        }));
      });

      // Prellenar datos si es el primer documento
      if (Object.keys(documentosClasificados).length === 0) {
        const documentosParaPrellenar = Object.fromEntries(
          Object.entries(newFiles).map(([fileId, file]) => [
            fileId,
            {
              file,
              tipo: clasificarDocumento(file.name),
              confianza: Math.random() * 0.3 + 0.7,
              datosExtraidos: simularOCR(file.name),
            },
          ])
        );
        prellenarDatos(documentosParaPrellenar);
      }
    }
  };

  const handleBulkFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setBulkFiles(Array.from(files));
    }
  };

  const handleProcessBulkUpload = async () => {
    if (bulkFiles.length === 0) return;

    setIsProcessingBulkOCR(true);

    // Simular procesamiento OCR
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newDocumentosClasificados: {
      [key: string]: {
        file: File;
        tipo: string;
        confianza: number;
        datosExtraidos?: any;
      };
    } = {};

    bulkFiles.forEach((file, index) => {
      const fileId = `bulk-${Date.now()}-${index}`;
      const tipo = clasificarDocumento(file.name);
      const confianza = Math.random() * 0.3 + 0.7; // 70-100%
      const datosExtraidos = simularOCR(file.name);

      newDocumentosClasificados[fileId] = {
        file,
        tipo,
        confianza,
        datosExtraidos,
      };
    });

    setDocumentosClasificados((prev) => ({
      ...prev,
      ...newDocumentosClasificados,
    }));

    // Prellenar datos del cliente
    prellenarDatos(newDocumentosClasificados);

    setIsProcessingBulkOCR(false);
    setIsBulkUploadModalOpen(false);
    setBulkFiles([]);
  };

  const clasificarDocumento = (fileName: string): string => {
    const name = fileName.toLowerCase();
    if (name.includes("ine") || name.includes("identificacion"))
      return "Identificación oficial";
    if (name.includes("domicilio") || name.includes("comprobante"))
      return "Comprobante de domicilio";
    if (name.includes("escritura") || name.includes("titulo"))
      return "Escritura de propiedad";
    if (name.includes("avaluo")) return "Avalúo comercial";
    if (name.includes("predial")) return "Constancia de no adeudo de predial";
    if (name.includes("agua")) return "Constancia de no adeudo de agua";
    if (name.includes("gravamen")) return "Certificado de libertad de gravamen";
    if (name.includes("contrato")) return "Contrato de compraventa privado";
    return "Documento general";
  };

  const simularOCR = (fileName: string): any => {
    // Simular extracción de datos con OCR
    return {
      nombre: "Juan",
      apellidoPaterno: "Pérez",
      apellidoMaterno: "García",
      curp: "PEGJ800101HDFRRN01",
      rfc: "PEGJ800101ABC",
      domicilio: {
        calle: "Av. Revolución",
        numero: "123",
        colonia: "Centro",
        codigoPostal: "22000",
        ciudad: "Tijuana",
        estado: "Baja California",
      },
    };
  };

  const prellenarDatos = (documentos: { [key: string]: any }) => {
    const datosExtraidos = Object.values(documentos).find(
      (doc) => doc.datosExtraidos
    )?.datosExtraidos;

    if (datosExtraidos && typeof datosExtraidos === "object") {
      setDatosCliente((prev) => ({
        ...prev,
        ...(datosExtraidos as any),
        domicilio: {
          ...prev.domicilio,
          ...((datosExtraidos as any).domicilio || {}),
        },
      }));
    }
  };

  const handleEliminarDocumento = (documentoId: string) => {
    setDocumentosSubidos((prev) => {
      const newDocs = { ...prev };
      delete newDocs[documentoId];
      return newDocs;
    });

    setDocumentosClasificados((prev) => {
      const newDocs = { ...prev };
      delete newDocs[documentoId];
      return newDocs;
    });
  };

  const handleVerDocumento = (documentoId: string) => {
    const documento =
      documentosSubidos[documentoId] || documentosClasificados[documentoId];
    if (documento) {
      const file = "file" in documento ? documento.file : documento;
      if (file instanceof File) {
        const url = URL.createObjectURL(file);
        window.open(url, "_blank");
      }
    }
  };

  const handleGenerarDocumento = async () => {
    if (!tramiteInfo || !datosCliente.nombre) return;

    setIsGeneratingDocument(true);

    // Simular generación de documento
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const documentoGenerado = generarDocumentoLegal(
      tramiteSeleccionado,
      datosCliente
    );
    setGeneratedDocument(documentoGenerado);
    setIsGeneratingDocument(false);
  };

  const generarDocumentoLegal = (tramite: string, datos: any): string => {
    const fecha = new Date().toLocaleDateString("es-MX");
    const nombreCompleto =
      `${datos.nombre} ${datos.apellidoPaterno} ${datos.apellidoMaterno}`.trim();

    switch (tramite) {
      case "testamentos":
        return `TESTAMENTO PÚBLICO ABIERTO

En la ciudad de ${datos.domicilio.ciudad || "Tijuana"}, Estado de ${
          datos.domicilio.estado || "Baja California"
        }, a los ${fecha}, ante mí, el Lic. [NOMBRE DEL NOTARIO], Notario Público número [NÚMERO] del Estado de ${
          datos.domicilio.estado || "Baja California"
        }, comparece el señor(a) ${nombreCompleto}, mayor de edad, con domicilio en ${
          datos.domicilio.calle || ""
        } ${datos.domicilio.numero || ""}, Colonia ${
          datos.domicilio.colonia || ""
        }, C.P. ${
          datos.domicilio.codigoPostal || ""
        }, de esta ciudad, portador de identificación oficial ${
          datos.curp ? `CURP: ${datos.curp}` : "INE"
        }, quien en pleno uso de sus facultades mentales y de manera libre y espontánea, otorga el presente TESTAMENTO PÚBLICO ABIERTO, bajo las siguientes cláusulas:

PRIMERA.- Declaro ser ${nombreCompleto}, ${
          datos.nacionalidad || "mexicano(a)"
        }, de ${
          datos.estadoCivil || "estado civil"
        }, mayor de edad, con domicilio en ${datos.domicilio.calle || ""} ${
          datos.domicilio.numero || ""
        }, Colonia ${datos.domicilio.colonia || ""}, C.P. ${
          datos.domicilio.codigoPostal || ""
        }, de esta ciudad.

SEGUNDA.- Declaro que no me encuentro bajo interdicción, inhabilitación o limitación alguna que me impida disponer de mis bienes.

TERCERA.- Instituyo como mis únicos y universales herederos a [NOMBRE DE HEREDEROS], quienes sucederán en todos mis bienes, derechos y obligaciones.

CUARTA.- Nombro como albacea a [NOMBRE DEL ALBACEA], quien se encargará de la administración y liquidación de mi patrimonio.

QUINTA.- Revoco, anulo y dejo sin efecto cualquier testamento o disposición de última voluntad que hubiere otorgado con anterioridad a la fecha del presente.

SEXTA.- Declaro que el presente testamento se otorga con las formalidades que establece la ley, y que conozco las consecuencias jurídicas del mismo.

En constancia de lo anterior, firmo el presente testamento en unión del notario y de los testigos instrumentales.

[FIRMAS]

NOTARIO PÚBLICO: ________________
TESTIGO 1: ________________
TESTIGO 2: ________________
TESTADOR: ${nombreCompleto}`;

      case "compraventas":
        return `ESCRITURA PÚBLICA DE COMPRAVENTA

En la ciudad de ${datos.domicilio.ciudad || "Tijuana"}, Estado de ${
          datos.domicilio.estado || "Baja California"
        }, a los ${fecha}, ante mí, el Lic. [NOMBRE DEL NOTARIO], Notario Público número [NÚMERO] del Estado de ${
          datos.domicilio.estado || "Baja California"
        }, comparecen:

VENDEDOR: ${nombreCompleto}, mayor de edad, con domicilio en ${
          datos.domicilio.calle || ""
        } ${datos.domicilio.numero || ""}, Colonia ${
          datos.domicilio.colonia || ""
        }, C.P. ${
          datos.domicilio.codigoPostal || ""
        }, portador de identificación oficial ${
          datos.curp ? `CURP: ${datos.curp}` : "INE"
        }.

COMPRADOR: [NOMBRE DEL COMPRADOR], mayor de edad, con domicilio en [DOMICILIO DEL COMPRADOR], portador de identificación oficial [IDENTIFICACIÓN].

Quienes otorgan la presente ESCRITURA PÚBLICA DE COMPRAVENTA, bajo las siguientes cláusulas:

PRIMERA.- El VENDEDOR vende y el COMPRADOR compra el inmueble ubicado en [DIRECCIÓN DEL INMUEBLE], con las siguientes características: [CARACTERÍSTICAS DEL INMUEBLE].

SEGUNDA.- El precio de la compraventa es de $[PRECIO] (PESOS [PRECIO EN LETRA]), que el COMPRADOR se obliga a pagar al VENDEDOR en la forma y términos convenidos.

TERCERA.- El VENDEDOR se obliga a entregar al COMPRADOR el inmueble libre de gravámenes, embargos, limitaciones de dominio o cualquier otro impedimento.

CUARTA.- El COMPRADOR se obliga a pagar todos los impuestos, derechos y contribuciones que se causen con motivo de esta operación.

QUINTA.- Ambas partes se obligan a cumplir con todas las formalidades legales que se requieran para la perfección de esta compraventa.

[FIRMAS]

VENDEDOR: ${nombreCompleto}
COMPRADOR: [NOMBRE DEL COMPRADOR]
NOTARIO PÚBLICO: ________________`;

      case "donaciones":
        return `ESCRITURA PÚBLICA DE DONACIÓN

En la ciudad de ${datos.domicilio.ciudad || "Tijuana"}, Estado de ${
          datos.domicilio.estado || "Baja California"
        }, a los ${fecha}, ante mí, el Lic. [NOMBRE DEL NOTARIO], Notario Público número [NÚMERO] del Estado de ${
          datos.domicilio.estado || "Baja California"
        }, comparecen:

DONANTE: ${nombreCompleto}, mayor de edad, con domicilio en ${
          datos.domicilio.calle || ""
        } ${datos.domicilio.numero || ""}, Colonia ${
          datos.domicilio.colonia || ""
        }, C.P. ${
          datos.domicilio.codigoPostal || ""
        }, portador de identificación oficial ${
          datos.curp ? `CURP: ${datos.curp}` : "INE"
        }.

DONATARIO: [NOMBRE DEL DONATARIO], mayor de edad, con domicilio en [DOMICILIO DEL DONATARIO], portador de identificación oficial [IDENTIFICACIÓN].

Quienes otorgan la presente ESCRITURA PÚBLICA DE DONACIÓN, bajo las siguientes cláusulas:

PRIMERA.- El DONANTE dona gratuitamente al DONATARIO el inmueble ubicado en [DIRECCIÓN DEL INMUEBLE], con las siguientes características: [CARACTERÍSTICAS DEL INMUEBLE].

SEGUNDA.- El DONATARIO acepta la donación en los términos en que se le hace.

TERCERA.- El DONANTE se obliga a entregar al DONATARIO el inmueble libre de gravámenes, embargos, limitaciones de dominio o cualquier otro impedimento.

CUARTA.- El DONATARIO se obliga a pagar todos los impuestos, derechos y contribuciones que se causen con motivo de esta operación.

[FIRMAS]

DONANTE: ${nombreCompleto}
DONATARIO: [NOMBRE DEL DONATARIO]
NOTARIO PÚBLICO: ________________`;

      default:
        return `DOCUMENTO LEGAL GENERADO

Trámite: ${tramiteInfo?.nombre || "No especificado"}
Cliente: ${nombreCompleto}
Fecha: ${fecha}

[CONTENIDO DEL DOCUMENTO SEGÚN EL TRÁMITE SELECCIONADO]

Este documento ha sido generado automáticamente basándose en los datos proporcionados y debe ser revisado y firmado ante notario público.

[FIRMAS]

CLIENTE: ${nombreCompleto}
NOTARIO PÚBLICO: ________________`;
    }
  };

  const handleImprimirDocumento = () => {
    if (!generatedDocument) return;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const content = `
        <html>
          <head>
            <title>${tramiteInfo?.nombre || "Documento Legal"}</title>
            <style>
              body { font-family: 'Times New Roman', serif; margin: 20px; line-height: 1.6; }
              .header { text-align: center; margin-bottom: 30px; }
              .content { max-width: 800px; margin: 0 auto; }
              .documento { white-space: pre-line; }
              .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="content">
              <div class="header">
                <h1>${tramiteInfo?.nombre || "Documento Legal"}</h1>
                <p>Notaría Tijuana</p>
              </div>
              
              <div class="documento">${generatedDocument}</div>
              
              <div class="footer">
                <p>Documento generado el ${new Date().toLocaleDateString(
                  "es-MX"
                )}</p>
                <p>Notaría Tijuana - Sistema de Gestión de Expedientes</p>
              </div>
            </div>
          </body>
        </html>
      `;
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDescargarDocumento = () => {
    if (!generatedDocument) return;

    const blob = new Blob([generatedDocument], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${tramiteInfo?.nombre || "documento"}_${
      datosCliente.nombre
    }_${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCrearExpediente = () => {
    console.log("Creando expediente:", {
      tramite: tramiteSeleccionado,
      datosCliente,
      documentos: Object.keys(documentosSubidos).length,
    });
    alert("Expediente creado exitosamente");
    router.push("/admin/expedientes");
  };

  const handleImprimirRequisitos = () => {
    if (!tramiteInfo) return;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const content = `
        <html>
          <head>
            <title>Requisitos para ${tramiteInfo.nombre}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
              .header { text-align: center; margin-bottom: 30px; }
              .content { max-width: 800px; margin: 0 auto; }
              .requisitos { margin: 20px 0; }
              .requisitos ul { list-style-type: none; padding: 0; }
              .requisitos li { margin: 8px 0; padding: 8px; background: #f5f5f5; border-left: 4px solid #3b82f6; }
              .costos { background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0; }
              .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="content">
              <div class="header">
                <h1>${tramiteInfo.nombre}</h1>
                <p>Notaría Tijuana</p>
              </div>
              
              <div class="requisitos">
                <h2>Documentos Requeridos:</h2>
                <ul>
                  ${tramiteInfo.documentosRequeridos
                    .map((doc) => `<li>${doc}</li>`)
                    .join("")}
                </ul>
              </div>
              
              <div class="costos">
                <h3>Desglose de Costos:</h3>
                <p><strong>Aranceles:</strong> $${tramiteInfo.costos.aranceles.toLocaleString()}</p>
                <p><strong>Impuestos:</strong> $${tramiteInfo.costos.impuestos.toLocaleString()}</p>
                <p><strong>Derechos:</strong> $${tramiteInfo.costos.derechos.toLocaleString()}</p>
                <p><strong>Total:</strong> $${tramiteInfo.costos.total.toLocaleString()}</p>
              </div>
              
              <p><strong>Tiempo Estimado:</strong> ${
                tramiteInfo.tiempoEstimado
              }</p>
              
              <div class="footer">
                <p>Documento generado el ${new Date().toLocaleDateString(
                  "es-MX"
                )}</p>
                <p>Notaría Tijuana - Sistema de Gestión de Expedientes</p>
              </div>
            </div>
          </body>
        </html>
      `;
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleEnviarPorEmail = () => {
    if (!tramiteInfo) return;

    const subject = `Requisitos para ${tramiteInfo.nombre} - Notaría Tijuana`;
    const body = `Estimado/a cliente,

Adjunto encontrará la información completa para el trámite de ${
      tramiteInfo.nombre
    }:

DESCRIPCIÓN:
${tramiteInfo.descripcion}

DOCUMENTOS REQUERIDOS:
${tramiteInfo.documentosRequeridos
  .map((doc, index) => `${index + 1}. ${doc}`)
  .join("\n")}

COSTOS:
- Aranceles: $${tramiteInfo.costos.aranceles.toLocaleString()}
- Impuestos: $${tramiteInfo.costos.impuestos.toLocaleString()}
- Derechos: $${tramiteInfo.costos.derechos.toLocaleString()}
- TOTAL: $${tramiteInfo.costos.total.toLocaleString()}

TIEMPO ESTIMADO: ${tramiteInfo.tiempoEstimado}

Para cualquier consulta, no dude en contactarnos.

Saludos cordiales,
Notaría Tijuana`;

    const mailtoLink = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  const handleEnviarPorWhatsApp = () => {
    if (!tramiteInfo) return;

    const message = `Hola! Te envío la información para el trámite de *${
      tramiteInfo.nombre
    }*:

📋 *Documentos requeridos:*
${tramiteInfo.documentosRequeridos
  .map((doc, index) => `${index + 1}. ${doc}`)
  .join("\n")}

💰 *Costos:*
• Aranceles: $${tramiteInfo.costos.aranceles.toLocaleString()}
• Impuestos: $${tramiteInfo.costos.impuestos.toLocaleString()}
• Derechos: $${tramiteInfo.costos.derechos.toLocaleString()}
• *TOTAL: $${tramiteInfo.costos.total.toLocaleString()}*

⏰ *Tiempo estimado:* ${tramiteInfo.tiempoEstimado}

¿Tienes alguna pregunta? ¡Estoy aquí para ayudarte!

Notaría Tijuana`;

    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, "_blank");
  };

  const handleGenerarLink = () => {
    if (!tramiteInfo) return;

    const linkId = `req-${Date.now()}`;
    const link = `${window.location.origin}/requisitos/${linkId}`;

    navigator.clipboard
      .writeText(link)
      .then(() => {
        alert(
          `Link generado y copiado al portapapeles:\n${link}\n\nEste link contiene toda la información de requisitos y puede ser compartido con el cliente.`
        );
      })
      .catch(() => {
        prompt("Link generado (copia este texto):", link);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/expedientes")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Expedientes
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Nuevo Expediente</h1>
          <p className="text-gray-600 mt-2">
            Crear un nuevo expediente notarial
          </p>
        </div>

        {/* Paso 1: Selección de Trámite */}
        {pasoActual === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-900">
                Paso 1: Selección de Trámite
              </CardTitle>
              <CardDescription>
                Selecciona el tipo de trámite notarial que se realizará
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tramite">Tipo de Trámite</Label>
                  <Select
                    value={tramiteSeleccionado}
                    onValueChange={setTramiteSeleccionado}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un trámite" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(tramitesConfig).map(([key, tramite]) => (
                        <SelectItem key={key} value={key}>
                          {tramite.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {tramiteInfo && (
                  <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="text-xl font-semibold text-blue-900 mb-4">
                      {tramiteInfo.nombre}
                    </h3>
                    <p className="text-blue-800 mb-4">
                      {tramiteInfo.descripcion}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-900">
                          ${tramiteInfo.costos.total.toLocaleString()}
                        </div>
                        <div className="text-sm text-blue-700">Costo Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-900">
                          {tramiteInfo.documentosRequeridos.length}
                        </div>
                        <div className="text-sm text-blue-700">Documentos</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-900">
                          {tramiteInfo.tiempoEstimado}
                        </div>
                        <div className="text-sm text-blue-700">Tiempo</div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-medium text-blue-900 mb-2">
                        Documentos Requeridos:
                      </h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        {tramiteInfo.documentosRequeridos.map((doc, index) => (
                          <li
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Opciones de Impresión y Envío */}
                    <div className="mt-6 pt-4 border-t border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-3">
                        Compartir Información:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleImprimirRequisitos}
                          className="text-blue-700 border-blue-300 hover:bg-blue-50"
                        >
                          <Printer className="h-4 w-4 mr-2" />
                          Imprimir
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleEnviarPorEmail}
                          className="text-blue-700 border-blue-300 hover:bg-blue-50"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Enviar por Email
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleEnviarPorWhatsApp}
                          className="text-blue-700 border-blue-300 hover:bg-blue-50"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Enviar por WhatsApp
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleGenerarLink}
                          className="text-blue-700 border-blue-300 hover:bg-blue-50"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Generar Link
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    onClick={handleSiguiente}
                    disabled={!tramiteSeleccionado}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Paso 2: Gestión de Documentos y Datos (con pestañas) */}
        {pasoActual === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-900">
                  Paso 2: Documentos y Datos del Cliente
                </CardTitle>
                <CardDescription>
                  Gestiona los documentos y completa los datos del cliente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={tabActual} onValueChange={setTabActual}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="documentos"
                      className="flex items-center space-x-2"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Documentos</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="datos"
                      className="flex items-center space-x-2"
                    >
                      <Users className="h-4 w-4" />
                      <span>Datos del Cliente</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="documentos" className="mt-6">
                    <div className="space-y-6">
                      {/* Botones de carga */}
                      <div className="flex flex-wrap gap-3">
                        <Button
                          onClick={() => setIsBulkUploadModalOpen(true)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Carga Masiva
                        </Button>
                        <div className="relative">
                          <input
                            type="file"
                            multiple
                            onChange={handleFileSelect}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          />
                          <Button variant="outline">
                            <Plus className="h-4 w-4 mr-2" />
                            Cargar Individual
                          </Button>
                        </div>
                      </div>

                      {/* Lista de Documentos Requeridos */}
                      {tramiteInfo && (
                        <div>
                          <h3 className="text-lg font-semibold mb-4">
                            Documentos Requeridos para {tramiteInfo.nombre}
                          </h3>
                          <div className="space-y-3">
                            {tramiteInfo.documentosRequeridos.map(
                              (documento, index) => {
                                const documentoCargado = Object.values(
                                  documentosClasificados
                                ).find((doc) => doc.tipo === documento);
                                return (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-3 border rounded-lg"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div className="flex-shrink-0">
                                        {documentoCargado ? (
                                          <CheckCircle className="h-5 w-5 text-green-500" />
                                        ) : (
                                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                                        )}
                                      </div>
                                      <div>
                                        <h4 className="font-medium">
                                          {documento}
                                        </h4>
                                        {documentoCargado && (
                                          <p className="text-sm text-green-600">
                                            {documentoCargado.file.name} (
                                            {Math.round(
                                              documentoCargado.confianza * 100
                                            )}
                                            % confianza)
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      {documentoCargado ? (
                                        <div className="flex items-center space-x-2">
                                          <div className="text-right">
                                            <p className="text-xs text-green-600 font-medium">
                                              ✓ Cargado
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              {Math.round(
                                                documentoCargado.confianza * 100
                                              )}
                                              % confianza
                                            </p>
                                          </div>
                                          <div className="flex space-x-1">
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              onClick={() => {
                                                const fileId = Object.keys(
                                                  documentosClasificados
                                                ).find(
                                                  (key) =>
                                                    documentosClasificados[
                                                      key
                                                    ] === documentoCargado
                                                );
                                                if (fileId)
                                                  handleVerDocumento(fileId);
                                              }}
                                              className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
                                              title="Ver documento"
                                            >
                                              <Eye className="h-3 w-3" />
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              onClick={() => {
                                                const fileId = Object.keys(
                                                  documentosClasificados
                                                ).find(
                                                  (key) =>
                                                    documentosClasificados[
                                                      key
                                                    ] === documentoCargado
                                                );
                                                if (fileId)
                                                  handleEliminarDocumento(
                                                    fileId
                                                  );
                                              }}
                                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                              title="Eliminar documento"
                                            >
                                              <X className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="flex space-x-1">
                                          <Badge variant="outline">
                                            Pendiente
                                          </Badge>
                                          <div className="relative">
                                            <input
                                              type="file"
                                              onChange={(e) => {
                                                if (e.target.files?.[0]) {
                                                  const file =
                                                    e.target.files[0];
                                                  const fileId = `doc-${Date.now()}-${index}`;

                                                  // Agregar a documentos subidos
                                                  setDocumentosSubidos(
                                                    (prev) => ({
                                                      ...prev,
                                                      [fileId]: file,
                                                    })
                                                  );

                                                  // Clasificar automáticamente
                                                  const tipo =
                                                    clasificarDocumento(
                                                      file.name
                                                    );
                                                  const confianza =
                                                    Math.random() * 0.3 + 0.7; // 70-100%
                                                  const datosExtraidos =
                                                    simularOCR(file.name);

                                                  setDocumentosClasificados(
                                                    (prev) => ({
                                                      ...prev,
                                                      [fileId]: {
                                                        file,
                                                        tipo,
                                                        confianza,
                                                        datosExtraidos,
                                                      },
                                                    })
                                                  );

                                                  // Prellenar datos si es el primer documento
                                                  if (
                                                    Object.keys(
                                                      documentosClasificados
                                                    ).length === 0
                                                  ) {
                                                    const documentoParaPrellenar =
                                                      {
                                                        [fileId]: {
                                                          file,
                                                          tipo,
                                                          confianza,
                                                          datosExtraidos,
                                                        },
                                                      };
                                                    prellenarDatos(
                                                      documentoParaPrellenar
                                                    );
                                                  }
                                                }
                                              }}
                                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                            />
                                            <Button size="sm" variant="outline">
                                              <Upload className="h-3 w-3 mr-1" />
                                              Subir
                                            </Button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>

                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                              <strong>Progreso:</strong>{" "}
                              {Object.keys(documentosClasificados).length} de{" "}
                              {tramiteInfo.documentosRequeridos.length}{" "}
                              documentos cargados
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Lista de Documentos Cargados */}
                      {Object.keys(documentosClasificados).length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-lg font-semibold mb-3 text-green-700">
                            Documentos Cargados (
                            {Object.keys(documentosClasificados).length})
                          </h4>
                          <div className="space-y-2">
                            {Object.entries(documentosClasificados).map(
                              ([fileId, doc]) => (
                                <div
                                  key={fileId}
                                  className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                                >
                                  <div className="flex items-center space-x-3">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <div>
                                      <p className="font-medium text-green-800">
                                        {doc.file.name}
                                      </p>
                                      <p className="text-sm text-green-600">
                                        Clasificado como: {doc.tipo}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        Confianza:{" "}
                                        {Math.round(doc.confianza * 100)}%
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex space-x-1">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleVerDocumento(fileId)}
                                      className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800"
                                      title="Ver documento"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() =>
                                        handleEliminarDocumento(fileId)
                                      }
                                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                      title="Eliminar documento"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {/* Información sobre datos extraídos */}
                      {Object.keys(documentosClasificados).length > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-700">
                            <strong>Datos extraídos:</strong> Los datos del
                            cliente se han prellenado automáticamente basándose
                            en los documentos cargados. Puedes revisar y
                            modificar esta información en la pestaña "Datos del
                            Cliente".
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="datos" className="mt-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="nombre">Nombre(s) *</Label>
                          <Input
                            id="nombre"
                            value={datosCliente.nombre}
                            onChange={(e) =>
                              handleInputChange("nombre", e.target.value)
                            }
                            placeholder="Nombre(s)"
                          />
                        </div>
                        <div>
                          <Label htmlFor="apellidoPaterno">
                            Apellido Paterno *
                          </Label>
                          <Input
                            id="apellidoPaterno"
                            value={datosCliente.apellidoPaterno}
                            onChange={(e) =>
                              handleInputChange(
                                "apellidoPaterno",
                                e.target.value
                              )
                            }
                            placeholder="Apellido Paterno"
                          />
                        </div>
                        <div>
                          <Label htmlFor="apellidoMaterno">
                            Apellido Materno
                          </Label>
                          <Input
                            id="apellidoMaterno"
                            value={datosCliente.apellidoMaterno}
                            onChange={(e) =>
                              handleInputChange(
                                "apellidoMaterno",
                                e.target.value
                              )
                            }
                            placeholder="Apellido Materno"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={datosCliente.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            placeholder="email@ejemplo.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="telefono">Teléfono</Label>
                          <Input
                            id="telefono"
                            value={datosCliente.telefono}
                            onChange={(e) =>
                              handleInputChange("telefono", e.target.value)
                            }
                            placeholder="(664) 123-4567"
                          />
                        </div>
                        <div>
                          <Label htmlFor="curp">CURP</Label>
                          <Input
                            id="curp"
                            value={datosCliente.curp}
                            onChange={(e) =>
                              handleInputChange("curp", e.target.value)
                            }
                            placeholder="CURP"
                          />
                        </div>
                        <div>
                          <Label htmlFor="rfc">RFC</Label>
                          <Input
                            id="rfc"
                            value={datosCliente.rfc}
                            onChange={(e) =>
                              handleInputChange("rfc", e.target.value)
                            }
                            placeholder="RFC"
                          />
                        </div>
                        <div>
                          <Label htmlFor="fechaNacimiento">
                            Fecha de Nacimiento
                          </Label>
                          <Input
                            id="fechaNacimiento"
                            type="date"
                            value={datosCliente.fechaNacimiento}
                            onChange={(e) =>
                              handleInputChange(
                                "fechaNacimiento",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="estadoCivil">Estado Civil</Label>
                          <Select
                            value={datosCliente.estadoCivil}
                            onValueChange={(value) =>
                              handleInputChange("estadoCivil", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar estado civil" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="soltero">
                                Soltero(a)
                              </SelectItem>
                              <SelectItem value="casado">Casado(a)</SelectItem>
                              <SelectItem value="divorciado">
                                Divorciado(a)
                              </SelectItem>
                              <SelectItem value="viudo">Viudo(a)</SelectItem>
                              <SelectItem value="union_libre">
                                Unión Libre
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="nacionalidad">Nacionalidad</Label>
                          <Input
                            id="nacionalidad"
                            value={datosCliente.nacionalidad}
                            onChange={(e) =>
                              handleInputChange("nacionalidad", e.target.value)
                            }
                            placeholder="Mexicana"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ocupacion">Ocupación</Label>
                          <Input
                            id="ocupacion"
                            value={datosCliente.ocupacion}
                            onChange={(e) =>
                              handleInputChange("ocupacion", e.target.value)
                            }
                            placeholder="Ocupación"
                          />
                        </div>
                      </div>

                      {/* Domicilio */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Domicilio</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <Label htmlFor="calle">Calle</Label>
                            <Input
                              id="calle"
                              value={datosCliente.domicilio.calle}
                              onChange={(e) =>
                                handleInputChange(
                                  "domicilio.calle",
                                  e.target.value
                                )
                              }
                              placeholder="Nombre de la calle"
                            />
                          </div>
                          <div>
                            <Label htmlFor="numero">Número</Label>
                            <Input
                              id="numero"
                              value={datosCliente.domicilio.numero}
                              onChange={(e) =>
                                handleInputChange(
                                  "domicilio.numero",
                                  e.target.value
                                )
                              }
                              placeholder="123"
                            />
                          </div>
                          <div>
                            <Label htmlFor="colonia">Colonia</Label>
                            <Input
                              id="colonia"
                              value={datosCliente.domicilio.colonia}
                              onChange={(e) =>
                                handleInputChange(
                                  "domicilio.colonia",
                                  e.target.value
                                )
                              }
                              placeholder="Colonia"
                            />
                          </div>
                          <div>
                            <Label htmlFor="codigoPostal">Código Postal</Label>
                            <Input
                              id="codigoPostal"
                              value={datosCliente.domicilio.codigoPostal}
                              onChange={(e) =>
                                handleInputChange(
                                  "domicilio.codigoPostal",
                                  e.target.value
                                )
                              }
                              placeholder="22000"
                            />
                          </div>
                          <div>
                            <Label htmlFor="ciudad">Ciudad</Label>
                            <Input
                              id="ciudad"
                              value={datosCliente.domicilio.ciudad}
                              onChange={(e) =>
                                handleInputChange(
                                  "domicilio.ciudad",
                                  e.target.value
                                )
                              }
                              placeholder="Tijuana"
                            />
                          </div>
                          <div>
                            <Label htmlFor="estado">Estado</Label>
                            <Input
                              id="estado"
                              value={datosCliente.domicilio.estado}
                              onChange={(e) =>
                                handleInputChange(
                                  "domicilio.estado",
                                  e.target.value
                                )
                              }
                              placeholder="Baja California"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Sección de Generación de Documento */}
                      {datosCliente.nombre && datosCliente.apellidoPaterno && (
                        <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
                          <h3 className="text-lg font-semibold mb-4">
                            Generación de Documento Legal
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Una vez completados los datos del cliente, puedes
                            generar el documento legal correspondiente al
                            trámite seleccionado.
                          </p>

                          {!generatedDocument ? (
                            <div className="flex items-center space-x-4">
                              <Button
                                onClick={handleGenerarDocumento}
                                disabled={isGeneratingDocument}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                {isGeneratingDocument ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Generando...
                                  </>
                                ) : (
                                  <>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Generar Documento
                                  </>
                                )}
                              </Button>
                              <p className="text-sm text-gray-500">
                                El documento se generará automáticamente con los
                                datos del cliente
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="p-4 bg-white border rounded-lg">
                                <h4 className="font-medium text-green-700 mb-2">
                                  ✓ Documento Generado Exitosamente
                                </h4>
                                <p className="text-sm text-gray-600">
                                  El documento legal ha sido generado y está
                                  listo para revisión y firma.
                                </p>
                              </div>

                              <div className="flex flex-wrap gap-3">
                                <Button
                                  onClick={handleImprimirDocumento}
                                  variant="outline"
                                  className="flex items-center space-x-2"
                                >
                                  <Printer className="h-4 w-4" />
                                  <span>Imprimir</span>
                                </Button>
                                <Button
                                  onClick={handleDescargarDocumento}
                                  variant="outline"
                                  className="flex items-center space-x-2"
                                >
                                  <Download className="h-4 w-4" />
                                  <span>Descargar</span>
                                </Button>
                                <Button
                                  onClick={() => setGeneratedDocument(null)}
                                  variant="ghost"
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Regenerar
                                </Button>
                              </div>

                              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h5 className="font-medium text-blue-900 mb-2">
                                  Vista Previa del Documento:
                                </h5>
                                <div className="max-h-64 overflow-y-auto text-sm text-gray-700 whitespace-pre-line border rounded p-3 bg-white">
                                  {generatedDocument}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={handleAnterior}>
                    Anterior
                  </Button>
                  <Button
                    onClick={handleCrearExpediente}
                    disabled={
                      !datosCliente.nombre || !datosCliente.apellidoPaterno
                    }
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Crear Expediente
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modal para Carga Masiva de Documentos */}
        <Dialog
          open={isBulkUploadModalOpen}
          onOpenChange={setIsBulkUploadModalOpen}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Carga Masiva de Documentos</DialogTitle>
              <DialogDescription>
                Sube múltiples documentos para clasificación automática y
                extracción de datos
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bulk-files">Seleccionar Archivos</Label>
                <input
                  id="bulk-files"
                  type="file"
                  multiple
                  onChange={handleBulkFileSelect}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Formatos soportados: PDF, JPG, PNG, DOC, DOCX
                </p>
              </div>

              {bulkFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Archivos seleccionados:</h4>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {bulkFiles.map((file, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        • {file.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  Funcionalidades OCR:
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Clasificación automática de documentos</li>
                  <li>• Extracción de datos personales</li>
                  <li>• Prellenado automático de formularios</li>
                  <li>• Validación de información</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsBulkUploadModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleProcessBulkUpload}
                  disabled={bulkFiles.length === 0 || isProcessingBulkOCR}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isProcessingBulkOCR ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Procesar Documentos
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
