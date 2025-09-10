"use client";

import { useState, useRef, useEffect } from "react";

// Declaración de tipos para Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Mic,
  MicOff,
  FileText,
  CheckCircle,
  Clock,
  Camera,
  Download,
  Send,
  Trash2,
  Plus,
  Mail,
  MessageCircle,
} from "lucide-react";

interface ExpedienteDigitalProps {
  tramiteId: string;
  usuario: string;
  expedienteId?: string | null;
  datosCodificados?: string | null;
}

interface Documento {
  id: string;
  nombre: string;
  tipo: string;
  archivo?: File;
  url?: string;
  estado: "pendiente" | "subido" | "procesado";
  fechaSubida: Date;
}

interface DatosPersonales {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  lugarNacimiento: string;
  estadoCivil: string;
  ocupacion: string;
  codigoPostal: string;
  colonia: string;
  municipio: string;
  estado: string;
  calle: string;
  numero: string;
  telefono: string;
  email: string;
  curp: string;
  rfc: string;
}

export function ExpedienteDigital({
  tramiteId,
  usuario,
  expedienteId,
  datosCodificados,
}: ExpedienteDigitalProps) {
  const [datosPersonales, setDatosPersonales] = useState<DatosPersonales>({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    fechaNacimiento: "",
    lugarNacimiento: "",
    estadoCivil: "",
    ocupacion: "",
    codigoPostal: "",
    colonia: "",
    municipio: "",
    estado: "",
    calle: "",
    numero: "",
    telefono: "",
    email: "",
    curp: "",
    rfc: "",
  });

  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentField, setCurrentField] = useState<string | null>(null);
  const [progreso, setProgreso] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [linkActualizado, setLinkActualizado] = useState(false);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [colonias, setColonias] = useState<string[]>([]);
  const [buscandoColonias, setBuscandoColonias] = useState(false);
  // Estados para el asistente de voz (removido por ahora)
  // const [modoAsistente, setModoAsistente] = useState(false);
  // const [campoActual, setCampoActual] = useState<string | null>(null);
  // const [mensajeAsistente, setMensajeAsistente] = useState("");
  // const [asistenteSilenciado, setAsistenteSilenciado] = useState(false);

  // Calcular progreso inicial
  useEffect(() => {
    setProgreso(calcularProgreso());
  }, [datosPersonales, documentos]);

  // Guardar automáticamente en localStorage cuando cambien los datos
  useEffect(() => {
    if (expedienteId) {
      const expedienteCompleto = {
        datosPersonales,
        documentos: documentos.map((doc) => ({
          id: doc.id,
          nombre: doc.nombre,
          tipo: doc.tipo,
          estado: doc.estado,
          fechaSubida: doc.fechaSubida.toISOString(),
        })),
        progreso,
        fechaActualizacion: new Date().toISOString(),
      };

      // Guardar en localStorage
      localStorage.setItem(
        `expediente_${expedienteId}`,
        JSON.stringify(expedienteCompleto)
      );

      console.log("Expediente guardado automáticamente");
    }
  }, [datosPersonales, documentos, progreso, expedienteId]);

  // Función para actualizar el link manualmente
  const actualizarLink = () => {
    if (expedienteId) {
      const expedienteCompleto = {
        datosPersonales,
        documentos: documentos.map((doc) => ({
          id: doc.id,
          nombre: doc.nombre,
          tipo: doc.tipo,
          estado: doc.estado,
          fechaSubida: doc.fechaSubida.toISOString(),
        })),
        progreso,
        fechaActualizacion: new Date().toISOString(),
      };

      const datosCodificados = btoa(JSON.stringify(expedienteCompleto));
      const nuevaUrl = `${window.location.origin}/expediente-digital?tramite=${tramiteId}&expediente=${expedienteId}&datos=${datosCodificados}`;

      window.history.replaceState({}, "", nuevaUrl);
      setLinkActualizado(true);
      setTimeout(() => setLinkActualizado(false), 3000);
    }
  };

  // Inicializar timestamp solo en el cliente para evitar errores de hidratación
  useEffect(() => {
    setLastUpdate(new Date().toLocaleString());
  }, []);

  // Cargar datos desde URL o localStorage
  useEffect(() => {
    if (datosCodificados) {
      try {
        const expedienteCompleto = JSON.parse(atob(datosCodificados));

        // Cargar datos personales
        if (expedienteCompleto.datosPersonales) {
          setDatosPersonales(expedienteCompleto.datosPersonales);
        }

        // Cargar documentos
        if (expedienteCompleto.documentos) {
          const documentosCargados = expedienteCompleto.documentos.map(
            (doc: any) => ({
              ...doc,
              fechaSubida: new Date(doc.fechaSubida),
            })
          );
          setDocumentos(documentosCargados);
        }

        // Cargar progreso
        if (expedienteCompleto.progreso) {
          setProgreso(expedienteCompleto.progreso);
        }

        console.log(
          "Expediente completo cargado desde URL:",
          expedienteCompleto
        );
      } catch (error) {
        console.error("Error decodificando datos de la URL:", error);
      }
    } else if (expedienteId) {
      // Intentar cargar desde localStorage si no hay datos en URL
      const expedienteGuardado = localStorage.getItem(
        `expediente_${expedienteId}`
      );
      if (expedienteGuardado) {
        try {
          const expedienteCompleto = JSON.parse(expedienteGuardado);

          if (expedienteCompleto.datosPersonales) {
            setDatosPersonales(expedienteCompleto.datosPersonales);
          }

          if (expedienteCompleto.documentos) {
            const documentosCargados = expedienteCompleto.documentos.map(
              (doc: any) => ({
                ...doc,
                fechaSubida: new Date(doc.fechaSubida),
              })
            );
            setDocumentos(documentosCargados);
          }

          if (expedienteCompleto.progreso) {
            setProgreso(expedienteCompleto.progreso);
          }

          console.log(
            "Expediente cargado desde localStorage:",
            expedienteCompleto
          );
        } catch (error) {
          console.error("Error cargando desde localStorage:", error);
        }
      }
    }
  }, [datosCodificados, expedienteId]);

  // Función para cargar expediente desde base de datos simulada
  const cargarExpedienteDesdeBD = (id: string) => {
    // Simulación de base de datos de expedientes
    const expedientesBD = {
      "EXP-001": {
        datosPersonales: {
          nombre: "Juan Carlos",
          apellidoPaterno: "García",
          apellidoMaterno: "López",
          fechaNacimiento: "1985-03-15",
          lugarNacimiento: "Tijuana, Baja California",
          estadoCivil: "Casado",
          ocupacion: "Ingeniero",
          domicilio: {
            codigoPostal: "22000",
            colonia: "Zona Centro",
            municipio: "Tijuana",
            estado: "Baja California",
            calle: "Revolución",
            numero: "123",
          },
          telefono: "6641234567",
          email: "juan.garcia@email.com",
          curp: "GALJ850315HBCRPN01",
          rfc: "GALJ850315ABC",
        },
        documentos: [
          {
            id: "doc1",
            nombre: "INE",
            tipo: "Identificación Oficial",
            archivo: null,
            subido: true,
            fechaSubida: new Date("2024-01-15"),
          },
          {
            id: "doc2",
            nombre: "Comprobante de Domicilio",
            tipo: "Comprobante de Domicilio",
            archivo: null,
            subido: true,
            fechaSubida: new Date("2024-01-16"),
          },
        ],
        progreso: 75,
      },
      "EXP-002": {
        datosPersonales: {
          nombre: "María Elena",
          apellidoPaterno: "Rodríguez",
          apellidoMaterno: "González",
          fechaNacimiento: "1990-07-22",
          lugarNacimiento: "Mexicali, Baja California",
          estadoCivil: "Soltera",
          ocupacion: "Abogada",
          domicilio: {
            codigoPostal: "22010",
            colonia: "Colonia Altamira",
            municipio: "Tijuana",
            estado: "Baja California",
            calle: "Av. Universidad",
            numero: "456",
          },
          telefono: "6649876543",
          email: "maria.rodriguez@email.com",
          curp: "ROGM900722HBCRPN02",
          rfc: "ROGM900722DEF",
        },
        documentos: [
          {
            id: "doc1",
            nombre: "INE",
            tipo: "Identificación Oficial",
            archivo: null,
            subido: true,
            fechaSubida: new Date("2024-01-18"),
          },
        ],
        progreso: 45,
      },
      "EXP-003": {
        datosPersonales: {
          nombre: "Carlos Alberto",
          apellidoPaterno: "Martínez",
          apellidoMaterno: "Hernández",
          fechaNacimiento: "1978-11-08",
          lugarNacimiento: "Ensenada, Baja California",
          estadoCivil: "Divorciado",
          ocupacion: "Empresario",
          domicilio: {
            codigoPostal: "22020",
            colonia: "Colonia Del Mar",
            municipio: "Tijuana",
            estado: "Baja California",
            calle: "Blvd. Agua Caliente",
            numero: "789",
          },
          telefono: "6645551234",
          email: "carlos.martinez@email.com",
          curp: "MAHC781108HBCRPN03",
          rfc: "MAHC781108GHI",
        },
        documentos: [
          {
            id: "doc1",
            nombre: "INE",
            tipo: "Identificación Oficial",
            archivo: null,
            subido: true,
            fechaSubida: new Date("2024-01-10"),
          },
          {
            id: "doc2",
            nombre: "Comprobante de Domicilio",
            tipo: "Comprobante de Domicilio",
            archivo: null,
            subido: true,
            fechaSubida: new Date("2024-01-11"),
          },
          {
            id: "doc3",
            nombre: "Acta de Nacimiento",
            tipo: "Acta de Nacimiento",
            archivo: null,
            subido: true,
            fechaSubida: new Date("2024-01-12"),
          },
        ],
        progreso: 90,
      },
    };

    const expediente = expedientesBD[id as keyof typeof expedientesBD];
    if (expediente) {
      setDatosPersonales(expediente.datosPersonales);
      setDocumentos(expediente.documentos);
      setProgreso(expediente.progreso);
      console.log("Expediente cargado desde base de datos:", expediente);
    } else {
      console.log("Expediente no encontrado en base de datos:", id);
    }
  };

  // Cargar expediente desde BD si no hay datos en localStorage
  useEffect(() => {
    if (expedienteId && !datosCodificados) {
      const expedienteGuardado = localStorage.getItem(
        `expediente_${expedienteId}`
      );
      if (!expedienteGuardado) {
        cargarExpedienteDesdeBD(expedienteId);
      }
    }
  }, [expedienteId, datosCodificados]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const tramites = {
    testamento: {
      nombre: "Testamento",
      documentosRequeridos: [
        "Identificación oficial vigente",
        "Comprobante de domicilio",
        "Acta de nacimiento",
        "Lista de bienes y propiedades",
        "Datos de beneficiarios",
      ],
    },
    compraventa: {
      nombre: "Compraventa de Inmuebles",
      documentosRequeridos: [
        "Identificación oficial (comprador y vendedor)",
        "Comprobante de domicilio",
        "Escritura anterior o título de propiedad",
        "Avalúo de la propiedad",
        "Comprobante de pago",
      ],
    },
    donacion: {
      nombre: "Donación",
      documentosRequeridos: [
        "Identificación oficial del donante",
        "Identificación oficial del donatario",
        "Comprobante de domicilio",
        "Escritura anterior o título de propiedad",
        "Avalúo de la propiedad",
      ],
    },
    permuta: {
      nombre: "Permuta",
      documentosRequeridos: [
        "Identificación oficial de ambas partes",
        "Comprobante de domicilio",
        "Escrituras anteriores de ambas propiedades",
        "Avalúos de ambas propiedades",
        "Comprobante de pago de diferencia",
      ],
    },
    "credito-hipotecario": {
      nombre: "Crédito Hipotecario / Infonavit / Fovissste",
      documentosRequeridos: [
        "Identificación oficial del deudor",
        "Comprobante de domicilio",
        "Escritura de la propiedad",
        "Avalúo de la propiedad",
        "Contrato de crédito",
      ],
    },
    "contrato-mutuo": {
      nombre: "Contrato de Mutuo",
      documentosRequeridos: [
        "Identificación oficial del mutuante",
        "Identificación oficial del mutuario",
        "Comprobante de domicilio",
        "Comprobante de ingresos",
        "Garantía o aval",
      ],
    },
    "reconocimiento-adeudo": {
      nombre: "Reconocimiento de Adeudo",
      documentosRequeridos: [
        "Identificación oficial del deudor",
        "Comprobante de domicilio",
        "Documentos que acrediten la deuda",
        "Comprobante de ingresos",
        "Garantía o aval",
      ],
    },
    "adjudicacion-hereditaria": {
      nombre: "Adjudicaciones Hereditarias",
      documentosRequeridos: [
        "Identificación oficial de herederos",
        "Acta de defunción",
        "Testamento o declaración de herederos",
        "Inventario de bienes",
        "Comprobante de domicilio",
      ],
    },
    sociedad: {
      nombre: "Constitución de Sociedades",
      documentosRequeridos: [
        "Identificación oficial de socios",
        "Comprobante de domicilio",
        "Acta constitutiva",
        "Poderes de representación",
        "Comprobante de capital social",
      ],
    },
    "liquidacion-copropiedad": {
      nombre: "Liquidación de Copropiedad",
      documentosRequeridos: [
        "Identificación oficial de copropietarios",
        "Comprobante de domicilio",
        "Escritura de la propiedad",
        "Avalúo de la propiedad",
        "Acuerdo de liquidación",
      ],
    },
    "cesion-derechos": {
      nombre: "Cesión de Derechos",
      documentosRequeridos: [
        "Identificación oficial del cedente",
        "Identificación oficial del cesionario",
        "Comprobante de domicilio",
        "Documentos que acrediten los derechos",
        "Comprobante de pago",
      ],
    },
    servidumbre: {
      nombre: "Constitución de Servidumbre",
      documentosRequeridos: [
        "Identificación oficial de ambas partes",
        "Comprobante de domicilio",
        "Escrituras de las propiedades",
        "Plano de la servidumbre",
        "Comprobante de pago",
      ],
    },
    "convenios-modificatorios": {
      nombre: "Convenios Modificatorios",
      documentosRequeridos: [
        "Identificación oficial de las partes",
        "Comprobante de domicilio",
        "Escritura original",
        "Documentos de modificación",
        "Comprobante de pago",
      ],
    },
    "elevacion-judicial": {
      nombre: "Elevación Judicial a Escritura Pública",
      documentosRequeridos: [
        "Identificación oficial de las partes",
        "Comprobante de domicilio",
        "Sentencia judicial",
        "Documentos del juicio",
        "Comprobante de pago",
      ],
    },
    "dacion-pago": {
      nombre: "Dación en Pago",
      documentosRequeridos: [
        "Identificación oficial del deudor",
        "Identificación oficial del acreedor",
        "Comprobante de domicilio",
        "Documentos de la deuda",
        "Escritura de la propiedad",
      ],
    },
    "formalizacion-contrato": {
      nombre: "Formalización de Contrato Privado",
      documentosRequeridos: [
        "Identificación oficial de las partes",
        "Comprobante de domicilio",
        "Contrato privado",
        "Documentos de la propiedad",
        "Comprobante de pago",
      ],
    },
    fideicomiso: {
      nombre: "Fideicomisos",
      documentosRequeridos: [
        "Identificación oficial del fiduciante",
        "Identificación oficial del fiduciario",
        "Identificación oficial del fideicomisario",
        "Comprobante de domicilio",
        "Documentos de los bienes",
      ],
    },
    "inicio-sucesion": {
      nombre: "Inicio de Sucesión",
      documentosRequeridos: [
        "Identificación oficial de herederos",
        "Acta de defunción",
        "Testamento o declaración de herederos",
        "Inventario de bienes",
        "Comprobante de domicilio",
      ],
    },
    "cancelacion-hipoteca": {
      nombre: "Cancelación de Hipoteca",
      documentosRequeridos: [
        "Identificación oficial del deudor",
        "Comprobante de domicilio",
        "Escritura de la propiedad",
        "Comprobante de pago total",
        "Documentos de la hipoteca",
      ],
    },
    "protocolizacion-acta": {
      nombre: "Protocolización de Acta de Asamblea",
      documentosRequeridos: [
        "Identificación oficial de asistentes",
        "Comprobante de domicilio",
        "Acta de asamblea",
        "Documentos de la sociedad",
        "Poderes de representación",
      ],
    },
    "cambio-regimen-matrimonial": {
      nombre: "Cambio de Régimen Matrimonial",
      documentosRequeridos: [
        "Identificación oficial de ambos cónyuges",
        "Acta de matrimonio",
        "Comprobante de domicilio",
        "Documentos de bienes",
        "Comprobante de pago",
      ],
    },
    cotejos: {
      nombre: "Cotejos",
      documentosRequeridos: [
        "Identificación oficial",
        "Comprobante de domicilio",
        "Documentos a cotejar",
        "Documentos originales",
        "Comprobante de pago",
      ],
    },
    "fe-hechos": {
      nombre: "Fe de Hechos",
      documentosRequeridos: [
        "Identificación oficial",
        "Comprobante de domicilio",
        "Documentos del hecho",
        "Testigos (si aplica)",
        "Comprobante de pago",
      ],
    },
    poderes: {
      nombre: "Poderes",
      documentosRequeridos: [
        "Identificación oficial del poderdante",
        "Identificación oficial del apoderado",
        "Comprobante de domicilio",
        "Especificación de facultades",
        "Comprobante de pago",
      ],
    },
    "rectificacion-escrituras": {
      nombre: "Rectificación de Escrituras",
      documentosRequeridos: [
        "Identificación oficial de las partes",
        "Comprobante de domicilio",
        "Escritura original",
        "Documentos de rectificación",
        "Comprobante de pago",
      ],
    },
  };

  const tramite =
    tramites[tramiteId as keyof typeof tramites] || tramites.testamento;

  const calcularProgreso = () => {
    // Solo contar los campos que están realmente en el formulario
    const camposRequeridos = [
      "nombre",
      "apellidoPaterno",
      "apellidoMaterno",
      "fechaNacimiento",
      "codigoPostal",
      "colonia",
      "municipio",
      "estado",
      "calle",
      "numero",
      "telefono",
      "curp",
    ];

    const camposCompletos = camposRequeridos.filter(
      (campo) => datosPersonales[campo as keyof DatosPersonales]?.trim() !== ""
    ).length;

    const documentosSubidos = documentos.filter(
      (doc) => doc.estado === "subido"
    ).length;

    const totalCampos = camposRequeridos.length; // 17 campos
    const totalDocumentos = tramite.documentosRequeridos.length; // Documentos específicos del trámite

    // Debug detallado
    const camposFaltantes = camposRequeridos.filter(
      (campo) => !datosPersonales[campo as keyof DatosPersonales]?.trim()
    );

    console.log("Debug progreso detallado:", {
      camposCompletos,
      totalCampos,
      documentosSubidos,
      totalDocumentos,
      camposFaltantes,
      datosPersonales,
    });

    const progresoDatos = (camposCompletos / totalCampos) * 50;
    const progresoDocumentos = (documentosSubidos / totalDocumentos) * 50;

    const progresoTotal = Math.round(progresoDatos + progresoDocumentos);
    console.log("Progreso calculado:", {
      progresoDatos,
      progresoDocumentos,
      progresoTotal,
    });

    setProgreso(progresoTotal);
    setLastUpdate(new Date().toLocaleString());
    return progresoTotal;
  };

  const handleInputChange = (campo: keyof DatosPersonales, valor: string) => {
    setDatosPersonales((prev) => ({ ...prev, [campo]: valor }));
    setProgreso(calcularProgreso());
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const nuevoDocumento: Documento = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          nombre: file.name,
          tipo: file.type,
          archivo: file,
          estado: "subido",
          fechaSubida: new Date(),
        };
        setDocumentos((prev) => [...prev, nuevoDocumento]);
      });
      setProgreso(calcularProgreso());
    }
  };

  const handleOCRUpload = () => {
    // Crear input de archivo para seleccionar imagen
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "camera"; // Para usar la cámara en móviles

    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        setIsProcessingOCR(true);

        // Mostrar preview de la imagen
        const reader = new FileReader();
        reader.onload = (e: any) => {
          // Aquí normalmente se enviaría la imagen a un servicio OCR real
          // Por ahora simulamos la extracción de datos

          // Simular delay de procesamiento OCR
          setTimeout(() => {
            const camposExtraidos = {
              nombre: "Juan Carlos",
              apellidoPaterno: "García",
              apellidoMaterno: "López",
              fechaNacimiento: "1985-03-15",
              curp: "GALJ850315HBCRPN01",
            };

            setDatosPersonales((prev) => ({ ...prev, ...camposExtraidos }));
            setProgreso(calcularProgreso());
            setIsProcessingOCR(false);
            alert("Datos extraídos exitosamente de la imagen.");
          }, 3000);
        };
        reader.readAsDataURL(file);
      }
    };

    input.click();
  };

  const startRecording = (campo: string) => {
    setCurrentField(campo);
    setIsRecording(true);

    // Verificar si el navegador soporta reconocimiento de voz
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = "es-MX";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        console.log("Reconocimiento de voz iniciado");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log("Texto reconocido:", transcript);

        // Procesar el texto según el campo
        if (false) {
          // modoAsistente removido
          if (campo === "nombre") {
            // Procesar nombre completo de manera más inteligente
            const nombreProcesado = procesarNombreCompleto(transcript);

            // Llenar los campos según lo que se detectó
            if (nombreProcesado.nombre) {
              handleInputChange("nombre", nombreProcesado.nombre);
            }
            if (nombreProcesado.apellidoPaterno) {
              handleInputChange(
                "apellidoPaterno",
                nombreProcesado.apellidoPaterno
              );
            }
            if (nombreProcesado.apellidoMaterno) {
              handleInputChange(
                "apellidoMaterno",
                nombreProcesado.apellidoMaterno
              );
            }

            // Decidir el siguiente paso (asistente removido)
            // if (nombreProcesado.completo) {
            //   continuarAsistente(...);
            // } else if (...) {
            //   continuarAsistente(...);
            // } else {
            //   continuarAsistente(...);
            // }
          } else if (campo === "fechaNacimiento") {
            // Convertir fecha de nacimiento a formato correcto
            const fechaProcesada = procesarFechaNacimiento(transcript);
            console.log("Fecha procesada:", fechaProcesada);
            handleInputChange("fechaNacimiento", fechaProcesada);

            // Continuar con CURP (asistente removido)
            // continuarAsistente(...);
          } else {
            // Para otros campos, usar el texto tal como viene
            handleInputChange(campo as keyof DatosPersonales, transcript);

            // Continuar con el siguiente campo
            const campos = [
              {
                actual: "apellidoPaterno",
                siguiente: "apellidoMaterno",
                mensaje: "Excelente! Ahora dime tu apellido materno.",
              },
              {
                actual: "apellidoMaterno",
                siguiente: "fechaNacimiento",
                mensaje:
                  "Muy bien! Ahora dime tu fecha de nacimiento (día, mes y año).",
              },
              {
                actual: "curp",
                siguiente: "telefono",
                mensaje: "Excelente! Ahora dime tu número de teléfono.",
              },
              {
                actual: "telefono",
                siguiente: "domicilio",
                mensaje:
                  "Muy bien! Por último, dime tu domicilio completo (calle, número, colonia, ciudad).",
              },
              {
                actual: "domicilio",
                siguiente: "completado",
                mensaje:
                  "¡Perfecto! Hemos terminado de recopilar tus datos personales. Ahora puedes revisar la información y continuar con los documentos.",
              },
            ];

            // Lógica del asistente removida
            // const campoInfo = campos.find((c) => c.actual === campo);
            // if (campoInfo) {
            //   if (campoInfo.siguiente === "completado") {
            //     finalizarAsistente();
            //   } else {
            //     continuarAsistente(...);
            //   }
            // }
          }
        } else {
          // Modo manual - solo llenar el campo
          handleInputChange(campo as keyof DatosPersonales, transcript);
        }

        setIsRecording(false);
        setCurrentField(null);
      };

      recognition.onerror = (event: any) => {
        console.error("Error en reconocimiento de voz:", event.error);
        setIsRecording(false);
        setCurrentField(null);

        // Mostrar mensaje de error al usuario
        if (event.error === "not-allowed") {
          alert(
            "Permisos de micrófono denegados. Por favor, permite el acceso al micrófono."
          );
        } else if (event.error === "no-speech") {
          alert("No se detectó habla. Intenta hablar más cerca del micrófono.");
        } else {
          alert("Error en el reconocimiento de voz. Intenta de nuevo.");
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
        setCurrentField(null);
      };

      recognition.start();
    } else {
      // Fallback si no hay soporte de voz
      alert(
        "Tu navegador no soporta reconocimiento de voz. Usa el campo de texto."
      );
      setIsRecording(false);
      setCurrentField(null);
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setCurrentField(null);
    }
  };

  const eliminarDocumento = (id: string) => {
    setDocumentos((prev) => prev.filter((doc) => doc.id !== id));
    setProgreso(calcularProgreso());
  };

  const buscarColonias = async (codigoPostal: string) => {
    if (codigoPostal.length !== 5) return;

    setBuscandoColonias(true);
    try {
      // Base de datos de códigos postales de México (simplificada)
      const datosPostales: {
        [key: string]: {
          colonias: string[];
          municipio: string;
          estado: string;
        };
      } = {
        // Tijuana, Baja California
        "22000": {
          colonias: [
            "Zona Centro",
            "Zona Río",
            "Colonia Cacho",
            "Colonia Chapultepec",
          ],
          municipio: "Tijuana",
          estado: "Baja California",
        },
        "22010": {
          colonias: ["Colonia Altamira", "Colonia Condesa", "Colonia Roma"],
          municipio: "Tijuana",
          estado: "Baja California",
        },
        "22020": {
          colonias: ["Colonia Del Mar", "Colonia Playas", "Colonia Libertad"],
          municipio: "Tijuana",
          estado: "Baja California",
        },
        "22030": {
          colonias: ["Colonia Industrial", "Colonia Obrera", "Colonia Morelos"],
          municipio: "Tijuana",
          estado: "Baja California",
        },
        "22040": {
          colonias: ["Colonia Guerrero", "Colonia Juárez", "Colonia Doctores"],
          municipio: "Tijuana",
          estado: "Baja California",
        },
        "22050": {
          colonias: [
            "Colonia Nápoles",
            "Colonia Del Valle",
            "Colonia Narvarte",
          ],
          municipio: "Tijuana",
          estado: "Baja California",
        },
        "22060": {
          colonias: [
            "Colonia San Ángel",
            "Colonia Coyoacán",
            "Colonia Tlalpan",
          ],
          municipio: "Tijuana",
          estado: "Baja California",
        },
        "22070": {
          colonias: ["Colonia Polanco", "Colonia Anzures", "Colonia Granada"],
          municipio: "Tijuana",
          estado: "Baja California",
        },
        "22080": {
          colonias: ["Colonia Santa Fe", "Colonia Lomas", "Colonia Pedregal"],
          municipio: "Tijuana",
          estado: "Baja California",
        },
        "22090": {
          colonias: [
            "Colonia Tlatelolco",
            "Colonia Nonoalco",
            "Colonia Guerrero",
          ],
          municipio: "Tijuana",
          estado: "Baja California",
        },

        // Ciudad de México
        "01000": {
          colonias: ["Álvaro Obregón", "Centro", "Guerrero"],
          municipio: "Álvaro Obregón",
          estado: "Ciudad de México",
        },
        "01010": {
          colonias: ["San Ángel", "San Ángel Inn", "Tlacopac"],
          municipio: "Álvaro Obregón",
          estado: "Ciudad de México",
        },
        "01020": {
          colonias: ["San Ángel", "Tlacopac", "San Ángel Inn"],
          municipio: "Álvaro Obregón",
          estado: "Ciudad de México",
        },
        "01030": {
          colonias: ["San Ángel", "Tlacopac", "San Ángel Inn"],
          municipio: "Álvaro Obregón",
          estado: "Ciudad de México",
        },
        "01040": {
          colonias: ["San Ángel", "Tlacopac", "San Ángel Inn"],
          municipio: "Álvaro Obregón",
          estado: "Ciudad de México",
        },
        "01050": {
          colonias: ["San Ángel", "Tlacopac", "San Ángel Inn"],
          municipio: "Álvaro Obregón",
          estado: "Ciudad de México",
        },
        "01060": {
          colonias: ["San Ángel", "Tlacopac", "San Ángel Inn"],
          municipio: "Álvaro Obregón",
          estado: "Ciudad de México",
        },
        "01070": {
          colonias: ["San Ángel", "Tlacopac", "San Ángel Inn"],
          municipio: "Álvaro Obregón",
          estado: "Ciudad de México",
        },
        "01080": {
          colonias: ["San Ángel", "Tlacopac", "San Ángel Inn"],
          municipio: "Álvaro Obregón",
          estado: "Ciudad de México",
        },
        "01090": {
          colonias: ["San Ángel", "Tlacopac", "San Ángel Inn"],
          municipio: "Álvaro Obregón",
          estado: "Ciudad de México",
        },

        // Guadalajara, Jalisco
        "44100": {
          colonias: ["Centro", "Zona Centro", "Centro Histórico"],
          municipio: "Guadalajara",
          estado: "Jalisco",
        },
        "44110": {
          colonias: ["Americana", "Lafayette", "Moderno"],
          municipio: "Guadalajara",
          estado: "Jalisco",
        },
        "44120": {
          colonias: ["Americana", "Lafayette", "Moderno"],
          municipio: "Guadalajara",
          estado: "Jalisco",
        },
        "44130": {
          colonias: ["Americana", "Lafayette", "Moderno"],
          municipio: "Guadalajara",
          estado: "Jalisco",
        },
        "44140": {
          colonias: ["Americana", "Lafayette", "Moderno"],
          municipio: "Guadalajara",
          estado: "Jalisco",
        },
        "44150": {
          colonias: ["Americana", "Lafayette", "Moderno"],
          municipio: "Guadalajara",
          estado: "Jalisco",
        },
        "44160": {
          colonias: ["Americana", "Lafayette", "Moderno"],
          municipio: "Guadalajara",
          estado: "Jalisco",
        },
        "44170": {
          colonias: ["Americana", "Lafayette", "Moderno"],
          municipio: "Guadalajara",
          estado: "Jalisco",
        },
        "44180": {
          colonias: ["Americana", "Lafayette", "Moderno"],
          municipio: "Guadalajara",
          estado: "Jalisco",
        },
        "44190": {
          colonias: ["Americana", "Lafayette", "Moderno"],
          municipio: "Guadalajara",
          estado: "Jalisco",
        },

        // Monterrey, Nuevo León
        "64000": {
          colonias: ["Centro", "Zona Centro", "Centro Histórico"],
          municipio: "Monterrey",
          estado: "Nuevo León",
        },
        "64010": {
          colonias: ["Centro", "Zona Centro", "Centro Histórico"],
          municipio: "Monterrey",
          estado: "Nuevo León",
        },
        "64020": {
          colonias: ["Centro", "Zona Centro", "Centro Histórico"],
          municipio: "Monterrey",
          estado: "Nuevo León",
        },
        "64030": {
          colonias: ["Centro", "Zona Centro", "Centro Histórico"],
          municipio: "Monterrey",
          estado: "Nuevo León",
        },
        "64040": {
          colonias: ["Centro", "Zona Centro", "Centro Histórico"],
          municipio: "Monterrey",
          estado: "Nuevo León",
        },
        "64050": {
          colonias: ["Centro", "Zona Centro", "Centro Histórico"],
          municipio: "Monterrey",
          estado: "Nuevo León",
        },
        "64060": {
          colonias: ["Centro", "Zona Centro", "Centro Histórico"],
          municipio: "Monterrey",
          estado: "Nuevo León",
        },
        "64070": {
          colonias: ["Centro", "Zona Centro", "Centro Histórico"],
          municipio: "Monterrey",
          estado: "Nuevo León",
        },
        "64080": {
          colonias: ["Centro", "Zona Centro", "Centro Histórico"],
          municipio: "Monterrey",
          estado: "Nuevo León",
        },
        "64090": {
          colonias: ["Centro", "Zona Centro", "Centro Histórico"],
          municipio: "Monterrey",
          estado: "Nuevo León",
        },

        // Puebla, Puebla
        "72000": {
          colonias: ["Centro", "Zona Centro", "Centro Histórico"],
          municipio: "Puebla",
          estado: "Puebla",
        },
        "72010": {
          colonias: ["Centro", "Zona Centro", "Centro Histórico"],
          municipio: "Puebla",
          estado: "Puebla",
        },
        "72020": {
          colonias: ["Centro", "Zona Centro", "Centro Histórico"],
          municipio: "Puebla",
          estado: "Puebla",
        },
        "72030": {
          colonias: ["Centro", "Zona Centro", "Centro Histórico"],
          municipio: "Puebla",
          estado: "Puebla",
        },
        "72040": {
          colonias: ["Centro", "Zona Centro", "Centro Histórico"],
          municipio: "Puebla",
          estado: "Puebla",
        },
        "72050": {
          colonias: ["Centro", "Zona Centro", "Centro Histórico"],
          municipio: "Puebla",
          estado: "Puebla",
        },
        "72060": {
          colonias: ["Centro", "Zona Centro", "Centro Histórico"],
          municipio: "Puebla",
          estado: "Puebla",
        },
        "72070": {
          colonias: ["Centro", "Zona Centro", "Centro Histórico"],
          municipio: "Puebla",
          estado: "Puebla",
        },
        "72080": {
          colonias: ["Centro", "Zona Centro", "Centro Histórico"],
          municipio: "Puebla",
          estado: "Puebla",
        },
        "72090": {
          colonias: ["Centro", "Zona Centro", "Centro Histórico"],
          municipio: "Puebla",
          estado: "Puebla",
        },

        // Tu código postal específico (57130)
        "57130": {
          colonias: ["Colonia 1", "Colonia 2", "Colonia 3", "Colonia 4"],
          municipio: "Municipio",
          estado: "Estado de México",
        },

        // Códigos postales comunes adicionales
        "50000": {
          colonias: ["Centro", "Zona Centro"],
          municipio: "Toluca",
          estado: "Estado de México",
        },
        "50010": {
          colonias: ["Centro", "Zona Centro"],
          municipio: "Toluca",
          estado: "Estado de México",
        },
        "50020": {
          colonias: ["Centro", "Zona Centro"],
          municipio: "Toluca",
          estado: "Estado de México",
        },
        "50030": {
          colonias: ["Centro", "Zona Centro"],
          municipio: "Toluca",
          estado: "Estado de México",
        },
        "50040": {
          colonias: ["Centro", "Zona Centro"],
          municipio: "Toluca",
          estado: "Estado de México",
        },
        "50050": {
          colonias: ["Centro", "Zona Centro"],
          municipio: "Toluca",
          estado: "Estado de México",
        },
        "50060": {
          colonias: ["Centro", "Zona Centro"],
          municipio: "Toluca",
          estado: "Estado de México",
        },
        "50070": {
          colonias: ["Centro", "Zona Centro"],
          municipio: "Toluca",
          estado: "Estado de México",
        },
        "50080": {
          colonias: ["Centro", "Zona Centro"],
          municipio: "Toluca",
          estado: "Estado de México",
        },
        "50090": {
          colonias: ["Centro", "Zona Centro"],
          municipio: "Toluca",
          estado: "Estado de México",
        },
      };

      console.log("Buscando CP:", codigoPostal);
      console.log("Datos disponibles:", Object.keys(datosPostales));

      const datosEncontrados =
        datosPostales[codigoPostal as keyof typeof datosPostales];

      console.log("Datos encontrados:", datosEncontrados);

      if (datosEncontrados) {
        setColonias(datosEncontrados.colonias);
        // Llenar automáticamente municipio y estado
        setDatosPersonales((prev) => ({
          ...prev,
          municipio: datosEncontrados.municipio,
          estado: datosEncontrados.estado,
        }));
        console.log(
          "Municipio y estado actualizados:",
          datosEncontrados.municipio,
          datosEncontrados.estado
        );
      } else {
        setColonias([]);
        // Limpiar municipio y estado si no se encuentra el CP
        setDatosPersonales((prev) => ({
          ...prev,
          municipio: "",
          estado: "",
        }));
        console.log("CP no encontrado, limpiando municipio y estado");
      }
    } catch (error) {
      console.error("Error buscando colonias:", error);
      setColonias([]);
    } finally {
      setBuscandoColonias(false);
    }
  };

  const procesarNombreCompleto = (texto: string) => {
    const palabras = texto.trim().split(/\s+/);
    const resultado = {
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      completo: false,
    };

    if (palabras.length >= 4) {
      // 4+ palabras: asumir que las primeras 2 son nombres, las siguientes son apellidos
      resultado.nombre = palabras.slice(0, 2).join(" ");
      resultado.apellidoPaterno = palabras[2];
      resultado.apellidoMaterno = palabras.slice(3).join(" ");
      resultado.completo = true;
    } else if (palabras.length === 3) {
      // 3 palabras: asumir que la primera es nombre, las otras 2 son apellidos
      resultado.nombre = palabras[0];
      resultado.apellidoPaterno = palabras[1];
      resultado.apellidoMaterno = palabras[2];
      resultado.completo = true;
    } else if (palabras.length === 2) {
      // 2 palabras: asumir que la primera es nombre, la segunda es apellido paterno
      resultado.nombre = palabras[0];
      resultado.apellidoPaterno = palabras[1];
    } else if (palabras.length === 1) {
      // 1 palabra: solo nombre
      resultado.nombre = palabras[0];
    }

    console.log("Nombre procesado:", resultado);
    return resultado;
  };

  const procesarFechaNacimiento = (texto: string) => {
    console.log("Procesando fecha:", texto);

    // Limpiar el texto y extraer números
    const numeros = texto.replace(/\D/g, "");

    // Si tiene 8 dígitos, asumir formato DDMMAAAA
    if (numeros.length === 8) {
      const dia = numeros.substring(0, 2);
      const mes = numeros.substring(2, 4);
      const año = numeros.substring(4, 8);
      const resultado = `${año}-${mes}-${dia}`;
      console.log("Fecha procesada (8 dígitos):", resultado);
      return resultado;
    }

    // Si tiene 6 dígitos, asumir formato DDMMAA
    if (numeros.length === 6) {
      const dia = numeros.substring(0, 2);
      const mes = numeros.substring(2, 4);
      const año = numeros.substring(4, 6);
      const añoCompleto = parseInt(año) > 50 ? `19${año}` : `20${año}`;
      const resultado = `${añoCompleto}-${mes}-${dia}`;
      console.log("Fecha procesada (6 dígitos):", resultado);
      return resultado;
    }

    // Intentar extraer día, mes y año del texto hablado
    const palabras = texto.toLowerCase().split(/[\s,.-]+/);
    let dia = "",
      mes = "",
      año = "";

    // Buscar números que podrían ser día, mes o año
    const numerosEncontrados = palabras.filter((p) => /^\d+$/.test(p));
    console.log("Números encontrados:", numerosEncontrados);

    if (numerosEncontrados.length >= 3) {
      // Asumir que el primer número es el día, el segundo el mes, el tercero el año
      dia = numerosEncontrados[0].padStart(2, "0");
      mes = numerosEncontrados[1].padStart(2, "0");
      año = numerosEncontrados[2];

      // Si el año tiene 2 dígitos, convertirlo a 4
      if (año.length === 2) {
        año = parseInt(año) > 50 ? `19${año}` : `20${año}`;
      }

      const resultado = `${año}-${mes}-${dia}`;
      console.log("Fecha procesada (3+ números):", resultado);
      return resultado;
    }

    // Intentar procesar fechas en formato hablado (ej: "15 de marzo de 1985")
    const meses: { [key: string]: string } = {
      enero: "01",
      febrero: "02",
      marzo: "03",
      abril: "04",
      mayo: "05",
      junio: "06",
      julio: "07",
      agosto: "08",
      septiembre: "09",
      octubre: "10",
      noviembre: "11",
      diciembre: "12",
    };

    for (let i = 0; i < palabras.length; i++) {
      if (meses[palabras[i]]) {
        mes = meses[palabras[i]] || "";
        // Buscar día antes del mes
        if (i > 0 && /^\d+$/.test(palabras[i - 1])) {
          dia = palabras[i - 1].padStart(2, "0");
        }
        // Buscar año después del mes
        if (i < palabras.length - 1 && /^\d+$/.test(palabras[i + 1])) {
          año = palabras[i + 1];
          if (año.length === 2) {
            año = parseInt(año) > 50 ? `19${año}` : `20${año}`;
          }
        }
        break;
      }
    }

    if (dia && mes && año) {
      const resultado = `${año}-${mes}-${dia}`;
      console.log("Fecha procesada (formato hablado):", resultado);
      return resultado;
    }

    // Si no se puede procesar, devolver el texto original
    console.log("No se pudo procesar la fecha, devolviendo texto original");
    return texto;
  };

  // Funciones del asistente de voz (removidas por ahora)
  /*
  const hablar = (texto: string, callback?: () => void) => {
    if ("speechSynthesis" in window && !asistenteSilenciado) {
      // Cancelar cualquier síntesis anterior
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = "es-MX";
      utterance.rate = 1.2; // Más rápido
      utterance.pitch = 1.1; // Ligeramente más alto para sonar más natural
      utterance.volume = 0.9; // Un poco más alto

      utterance.onstart = () => {
        console.log("Asistente hablando...");
      };

      utterance.onend = () => {
        console.log("Asistente terminó de hablar");
        // Ejecutar callback después de terminar de hablar
        if (callback) {
          setTimeout(callback, 500); // Pequeña pausa antes de escuchar
        }
      };

      window.speechSynthesis.speak(utterance);
    } else if (callback) {
      // Si no hay síntesis de voz, ejecutar callback inmediatamente
      callback();
    }
  };

  const iniciarAsistente = () => {
    setModoAsistente(true);
    setCampoActual("nombre");
    const mensaje =
      "Hola! Soy tu asistente virtual. Te voy a ayudar a llenar tu expediente paso a paso. Primero, dime tu nombre completo.";
    setMensajeAsistente(mensaje);

    // Hacer que el asistente hable y automáticamente escuche después
    hablar(mensaje, () => {
      startRecording("nombre");
    });
  };

  const continuarAsistente = (
    campo: string,
    siguienteCampo: string,
    mensaje: string
  ) => {
    setCampoActual(siguienteCampo);
    setMensajeAsistente(mensaje);

    // Hacer que el asistente hable y automáticamente escuche después
    hablar(mensaje, () => {
      startRecording(siguienteCampo);
    });
  };

  const finalizarAsistente = () => {
    const mensajeFinal =
      "¡Perfecto! Hemos terminado de recopilar tus datos personales. Ahora puedes revisar la información y continuar con los documentos.";
    
    hablar(mensajeFinal, () => {
      setModoAsistente(false);
      setCampoActual(null);
      setMensajeAsistente("");
      setIsRecording(false);
    });
  };
  */

  const generarLinkExpediente = () => {
    // Crear un ID único para el expediente
    const expedienteId = `exp_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Crear objeto completo con datos y documentos
    const expedienteCompleto = {
      datosPersonales,
      documentos: documentos.map((doc) => ({
        id: doc.id,
        nombre: doc.nombre,
        tipo: doc.tipo,
        estado: doc.estado,
        fechaSubida: doc.fechaSubida.toISOString(),
      })),
      progreso,
      fechaCreacion: new Date().toISOString(),
    };

    // Guardar en localStorage para persistencia
    localStorage.setItem(
      `expediente_${expedienteId}`,
      JSON.stringify(expedienteCompleto)
    );

    // Codificar los datos en base64 para incluirlos en la URL
    const datosCodificados = btoa(JSON.stringify(expedienteCompleto));

    // Generar el link único
    const baseUrl = window.location.origin;
    const linkExpediente = `${baseUrl}/expediente-digital?tramite=${tramiteId}&expediente=${expedienteId}&datos=${datosCodificados}`;

    return linkExpediente;
  };

  const copiarLink = async () => {
    const link = generarLinkExpediente();
    try {
      await navigator.clipboard.writeText(link);
      alert(
        "¡Link copiado al portapapeles! Puedes compartirlo o guardarlo para continuar más tarde."
      );
    } catch (err) {
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert(
        "¡Link copiado al portapapeles! Puedes compartirlo o guardarlo para continuar más tarde."
      );
    }
  };

  const enviarExpediente = () => {
    const link = generarLinkExpediente();
    alert(
      `Expediente enviado exitosamente. Te contactaremos pronto.\n\nTu link personalizado: ${link}`
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Expediente Digital - {tramite.nombre}
        </h1>
        <p className="text-gray-600">
          Completa tu información paso a paso. Tu progreso se guarda
          automáticamente.
        </p>

        {/* Notificación de link actualizado */}
        {linkActualizado && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            <div className="flex items-center justify-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">¡Link actualizado!</span>
            </div>
            <p className="text-sm mt-1">
              El link en tu navegador ahora contiene la versión más reciente de
              tu expediente.
            </p>
          </div>
        )}

        {/* Botón para actualizar link manualmente */}
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={actualizarLink}
            className="text-green-600 border-green-300 hover:bg-green-50"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Actualizar Link
          </Button>
        </div>

        {expedienteId && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Expediente cargado desde link personalizado</strong>
              <br />
              ID: {expedienteId}
            </p>
          </div>
        )}
        <div className="mt-4">
          <Progress value={progreso} className="w-full max-w-md mx-auto" />
          <p className="text-sm text-gray-500 mt-2">{progreso}% completado</p>
        </div>
      </div>

      {/* Asistente Virtual - Removido temporalmente */}
      {false && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Mic className="h-5 w-5" />
              Asistente Virtual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <p className="text-blue-800 font-medium">
                  Asistente removido temporalmente
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Datos Personales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Datos Personales
          </CardTitle>
          <CardDescription>
            Completa tu información personal. Puedes escribir, dictar o usar
            OCR.
          </CardDescription>
          {/* Botón de asistente removido temporalmente */}
          {false && (
            <div className="mt-4">
              <Button
                onClick={() => {}}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={true}
              >
                <Mic className="h-4 w-4 mr-2" />
                Asistente Temporalmente No Disponible
              </Button>
            </div>
          )}
          {isRecording && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>Escuchando... Habla ahora</span>
            </div>
          )}
          {isProcessingOCR && (
            <div className="flex items-center gap-2 text-blue-600 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Procesando imagen... Extrayendo datos</span>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Nombre *</label>
              <div className="flex gap-2">
                <Input
                  value={datosPersonales.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  placeholder="Tu nombre"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startRecording("nombre")}
                  disabled={isRecording && currentField !== "nombre"}
                  className={
                    isRecording && currentField === "nombre"
                      ? "bg-red-50 border-red-200 text-red-600"
                      : ""
                  }
                >
                  {isRecording && currentField === "nombre" ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Apellido Paterno *
              </label>
              <div className="flex gap-2">
                <Input
                  value={datosPersonales.apellidoPaterno}
                  onChange={(e) =>
                    handleInputChange("apellidoPaterno", e.target.value)
                  }
                  placeholder="Apellido paterno"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startRecording("apellidoPaterno")}
                  disabled={isRecording && currentField !== "apellidoPaterno"}
                  className={
                    isRecording && currentField === "apellidoPaterno"
                      ? "bg-red-50 border-red-200 text-red-600"
                      : ""
                  }
                >
                  {isRecording && currentField === "apellidoPaterno" ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Apellido Materno *
              </label>
              <div className="flex gap-2">
                <Input
                  value={datosPersonales.apellidoMaterno}
                  onChange={(e) =>
                    handleInputChange("apellidoMaterno", e.target.value)
                  }
                  placeholder="Apellido materno"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startRecording("apellidoMaterno")}
                  disabled={isRecording && currentField !== "apellidoMaterno"}
                  className={
                    isRecording && currentField === "apellidoMaterno"
                      ? "bg-red-50 border-red-200 text-red-600"
                      : ""
                  }
                >
                  {isRecording && currentField === "apellidoMaterno" ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Fecha de Nacimiento *
              </label>
              <Input
                type="date"
                value={datosPersonales.fechaNacimiento}
                onChange={(e) =>
                  handleInputChange("fechaNacimiento", e.target.value)
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">CURP *</label>
              <div className="flex gap-2">
                <Input
                  value={datosPersonales.curp}
                  onChange={(e) =>
                    handleInputChange("curp", e.target.value.toUpperCase())
                  }
                  placeholder="CURP"
                  maxLength={18}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleOCRUpload}
                  disabled={isProcessingOCR}
                  className={isProcessingOCR ? "opacity-50" : ""}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Teléfono *
              </label>
              <Input
                value={datosPersonales.telefono}
                onChange={(e) => handleInputChange("telefono", e.target.value)}
                placeholder="Número de teléfono"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Código Postal *
              </label>
              <Input
                value={datosPersonales.codigoPostal}
                onChange={(e) => {
                  const cp = e.target.value.replace(/\D/g, "").slice(0, 5);
                  handleInputChange("codigoPostal", cp);
                  if (cp.length === 5) {
                    buscarColonias(cp);
                  }
                }}
                placeholder="22000"
                maxLength={5}
                className="w-32"
              />
              {buscandoColonias && (
                <p className="text-xs text-blue-600 mt-1">
                  Buscando colonias...
                </p>
              )}
            </div>

            {colonias.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Colonia *
                </label>
                <select
                  value={datosPersonales.colonia}
                  onChange={(e) => handleInputChange("colonia", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecciona una colonia</option>
                  {colonias.map((colonia, index) => (
                    <option key={index} value={colonia}>
                      {colonia}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(datosPersonales.municipio || datosPersonales.estado) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Municipio
                  </label>
                  <Input
                    value={datosPersonales.municipio}
                    readOnly
                    className="bg-gray-50"
                    placeholder="Se llena automáticamente"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Estado
                  </label>
                  <Input
                    value={datosPersonales.estado}
                    readOnly
                    className="bg-gray-50"
                    placeholder="Se llena automáticamente"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Calle *
                </label>
                <Input
                  value={datosPersonales.calle}
                  onChange={(e) => handleInputChange("calle", e.target.value)}
                  placeholder="Nombre de la calle"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Número *
                </label>
                <Input
                  value={datosPersonales.numero}
                  onChange={(e) => handleInputChange("numero", e.target.value)}
                  placeholder="123"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Referencias (opcional)
              </label>
              <Input
                value={datosPersonales.lugarNacimiento} // Reutilizando este campo para referencias
                onChange={(e) =>
                  handleInputChange("lugarNacimiento", e.target.value)
                }
                placeholder="Ej: Entre calles 5 y 6, cerca del parque, edificio azul..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Documentos Requeridos
          </CardTitle>
          <CardDescription>
            Sube los documentos necesarios para tu trámite.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tramite.documentosRequeridos.map((doc, index) => {
              const documentoSubido = documentos.find((d) =>
                d.nombre.toLowerCase().includes(doc.toLowerCase().split(" ")[0])
              );
              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 border rounded-lg ${
                    documentoSubido
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {documentoSubido ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <FileText className="h-5 w-5 text-gray-400" />
                    )}
                    <span className="text-sm">{doc}</span>
                  </div>
                  <Badge
                    variant={documentoSubido ? "default" : "outline"}
                    className={`text-xs ${
                      documentoSubido ? "bg-green-600" : ""
                    }`}
                  >
                    {documentoSubido ? "Subido" : "Requerido"}
                  </Badge>
                </div>
              );
            })}

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-4">
                Arrastra archivos aquí o haz clic para seleccionar
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="mr-2"
              >
                <Upload className="h-4 w-4 mr-2" />
                Subir Archivos
              </Button>
              <Button
                onClick={handleOCRUpload}
                variant="outline"
                disabled={isProcessingOCR}
                className={isProcessingOCR ? "opacity-50" : ""}
              >
                <Camera className="h-4 w-4 mr-2" />
                {isProcessingOCR
                  ? "Procesando..."
                  : "Tomar Foto / Seleccionar Imagen"}
              </Button>
            </div>

            {documentos.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Archivos subidos:</h4>
                {documentos.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{doc.nombre}</span>
                      <Badge variant="secondary" className="text-xs">
                        {doc.estado}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => eliminarDocumento(doc.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Acciones */}
      <div className="flex justify-between items-center pt-6 border-t">
        <div className="text-sm text-gray-600">
          <p>Tu expediente se guarda automáticamente</p>
          {lastUpdate && <p>Última actualización: {lastUpdate}</p>}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => {
              const link = generarLinkExpediente();
              const subject = "Continuar con mi trámite - Expediente Digital";
              const body = `Hola, quiero continuar con mi trámite de ${tramite.nombre}. Aquí está el link personalizado para acceder a mi expediente digital:\n\n${link}\n\nEste link contiene todos mis datos y me permite continuar el trámite en cualquier momento.\n\nGracias.`;
              window.open(
                `mailto:?subject=${encodeURIComponent(
                  subject
                )}&body=${encodeURIComponent(body)}`
              );
            }}
            className="flex-1 min-w-0"
          >
            <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">Enviar por Correo</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const link = generarLinkExpediente();
              const message = `Hola, quiero continuar con mi trámite de ${tramite.nombre}. Aquí está el link personalizado para acceder a mi expediente digital: ${link}\n\nEste link contiene todos mis datos y me permite continuar el trámite en cualquier momento.`;
              window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
            }}
            className="flex-1 min-w-0"
          >
            <MessageCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">Enviar por WhatsApp</span>
          </Button>
          <Button
            variant="outline"
            onClick={copiarLink}
            className="flex-1 min-w-0"
          >
            <Download className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">Copiar Link</span>
          </Button>
          <Button
            onClick={enviarExpediente}
            disabled={progreso < 50}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 flex-1 min-w-0"
          >
            <Send className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">Enviar a Notaría ({progreso}%)</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
