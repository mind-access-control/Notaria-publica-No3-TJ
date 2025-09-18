"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  FileText,
  Upload,
  Download,
  Send,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Calendar,
  DollarSign,
  Printer,
  Archive,
  Plus,
  X,
  Search,
  Filter,
  Loader2,
} from "lucide-react";

// Mock data para expedientes (usando la nueva estructura unificada)
const expedientesMock = {
  "EXP-001": {
    id: "EXP-001",
    cliente: "Juan Pérez García",
    telefono: "664-987-6543",
    email: "juan.perez@email.com",
    folio: "EXP-2024-001",
    observaciones: "Testamento complejo con múltiples beneficiarios",
    estado: "En revisión",
    progreso: 75,
    fechaCreacion: "2024-01-15",
    ultimaActividad: "2024-01-20",
    documentos: 8,
    totalDocumentos: 10,
    tramites: [
      {
        id: "TRM-002",
        tipo: "Testamento",
        formato: {
          id: "testamento-estandar",
          nombre: "Testamento Estándar",
          archivo: "FORMATO-TESTAMENTO-2019.pdf"
        },
        estado: "En revisión",
        progreso: 75,
        fechaInicio: "2024-01-15",
        fechaFin: null,
        documentos: 8,
        costos: {
          total: 3300,
          pagado: 3300,
          pendiente: 0,
        },
        cita: {
          fecha: "2024-01-25",
          hora: "10:00",
          notario: "Dr. Roberto Notario",
          estado: "Programada",
        },
      }
    ],
    datosPersonales: {
      nombre: "Juan",
      apellidoPaterno: "Pérez",
      apellidoMaterno: "García",
      fechaNacimiento: "1985-03-15",
      curp: "PEGJ850315HDFRRN01",
      rfc: "PEGJ850315ABC",
      telefono: "555-123-4567",
      email: "juan.perez@email.com",
      domicilio: {
        calle: "Av. Reforma",
        numero: "123",
        colonia: "Centro",
        municipio: "Tijuana",
        estado: "Baja California",
        codigoPostal: "22000",
      },
    },
    documentosRequeridos: [
      {
        id: 1,
        nombre: "Identificación oficial",
        tipo: "INE",
        estado: "Completado",
        archivo: "ine_juan_perez.pdf",
      },
      {
        id: 2,
        nombre: "Comprobante de domicilio",
        tipo: "CFE",
        estado: "Completado",
        archivo: "cfe_juan_perez.pdf",
      },
      {
        id: 3,
        nombre: "Acta de nacimiento",
        tipo: "Acta",
        estado: "Completado",
        archivo: "acta_nacimiento.pdf",
      },
      {
        id: 4,
        nombre: "CURP",
        tipo: "CURP",
        estado: "Completado",
        archivo: "curp_juan_perez.pdf",
      },
      {
        id: 5,
        nombre: "Testamento anterior (si existe)",
        tipo: "Testamento",
        estado: "Pendiente",
        archivo: null,
      },
      {
        id: 6,
        nombre: "Certificado médico",
        tipo: "Médico",
        estado: "Pendiente",
        archivo: null,
      },
      {
        id: 7,
        nombre: "Testigos (2 personas)",
        tipo: "Testigos",
        estado: "Pendiente",
        archivo: null,
      },
      {
        id: 8,
        nombre: "Pago de aranceles",
        tipo: "Pago",
        estado: "Completado",
        archivo: "comprobante_pago.pdf",
      },
      {
        id: 9,
        nombre: "Fotografías recientes",
        tipo: "Fotos",
        estado: "Completado",
        archivo: "fotos_juan_perez.pdf",
      },
      {
        id: 10,
        nombre: "Declaración de herederos",
        tipo: "Declaración",
        estado: "Pendiente",
        archivo: null,
      },
    ],
    historial: [
      {
        fecha: "2024-01-15",
        accion: "Expediente creado",
        usuario: "Admin",
        detalles: "Se inició el expediente para testamento",
      },
      {
        fecha: "2024-01-16",
        accion: "Documento subido",
        usuario: "Juan Pérez",
        detalles: "Se subió identificación oficial",
      },
      {
        fecha: "2024-01-17",
        accion: "Documento subido",
        usuario: "Juan Pérez",
        detalles: "Se subió comprobante de domicilio",
      },
      {
        fecha: "2024-01-18",
        accion: "Documento subido",
        usuario: "Juan Pérez",
        detalles: "Se subió acta de nacimiento",
      },
      {
        fecha: "2024-01-19",
        accion: "Documento subido",
        usuario: "Juan Pérez",
        detalles: "Se subió CURP",
      },
      {
        fecha: "2024-01-20",
        accion: "Pago realizado",
        usuario: "Juan Pérez",
        detalles: "Se realizó el pago de aranceles",
      },
    ],
    costos: {
      aranceles: 2500,
      impuestos: 500,
      derechos: 300,
      total: 3300,
      pagado: 3300,
      pendiente: 0,
    },
    cita: {
      fecha: "2024-01-25",
      hora: "10:00",
      notario: "Dr. Roberto Notario",
      sala: "Sala A",
      estado: "Programada",
    },
  },
  "EXP-002": {
    id: "EXP-002",
    cliente: "Ana Martínez Ruiz",
    telefono: "664-123-4567",
    email: "ana.martinez@email.com",
    folio: "EXP-2024-002",
    observaciones: "Cliente preferencial, proceso expedito",
    estado: "Completado",
    progreso: 100,
    fechaCreacion: "2024-01-10",
    ultimaActividad: "2024-01-18",
    documentos: 6,
    totalDocumentos: 6,
    tramites: [
      {
        id: "TRM-001",
        tipo: "Compraventa",
        formato: {
          id: "compraventa-testamento",
          nombre: "Formato Testamento (Personalizado)",
          archivo: "FORMATO-TESTAMENTO-2019.pdf"
        },
        estado: "Completado",
        progreso: 100,
        fechaInicio: "2024-01-10",
        fechaFin: "2024-01-18",
        documentos: 6,
        costos: {
          total: 2500,
          pagado: 2500,
          pendiente: 0,
        },
        cita: {
          fecha: "2024-01-18",
          hora: "14:00",
          notario: "Dr. Roberto Notario",
          estado: "Completada",
        },
      }
    ],
    datosPersonales: {
      nombre: "Ana",
      apellidoPaterno: "Martínez",
      apellidoMaterno: "Ruiz",
      fechaNacimiento: "1980-05-20",
      curp: "MARU800520MDFRZN01",
      rfc: "MARU800520ABC",
      telefono: "664-123-4567",
      email: "ana.martinez@email.com",
      domicilio: {
        calle: "Av. Revolución",
        numero: "456",
        colonia: "Zona Centro",
        municipio: "Tijuana",
        estado: "Baja California",
        codigoPostal: "22000",
      },
    },
    documentosRequeridos: [
      {
        id: 1,
        nombre: "Identificación oficial",
        tipo: "INE",
        estado: "Completado",
        archivo: "ine_ana_martinez.pdf",
      },
      {
        id: 2,
        nombre: "Comprobante de domicilio",
        tipo: "CFE",
        estado: "Completado",
        archivo: "cfe_ana_martinez.pdf",
      },
      {
        id: 3,
        nombre: "Escritura anterior",
        tipo: "Escritura",
        estado: "Completado",
        archivo: "escritura_anterior.pdf",
      },
      {
        id: 4,
        nombre: "Predial",
        tipo: "Predial",
        estado: "Completado",
        archivo: "predial_ana_martinez.pdf",
      },
      {
        id: 5,
        nombre: "Avalúo",
        tipo: "Avalúo",
        estado: "Completado",
        archivo: "avaluo_inmueble.pdf",
      },
      {
        id: 6,
        nombre: "Pago de aranceles",
        tipo: "Pago",
        estado: "Completado",
        archivo: "comprobante_pago.pdf",
      },
    ],
    historial: [
      {
        fecha: "2024-01-10",
        accion: "Expediente creado",
        usuario: "Admin",
        detalles: "Se inició el expediente para compraventa",
      },
      {
        fecha: "2024-01-12",
        accion: "Documento subido",
        usuario: "Ana Martínez",
        detalles: "Se subió identificación oficial",
      },
      {
        fecha: "2024-01-14",
        accion: "Documento subido",
        usuario: "Ana Martínez",
        detalles: "Se subió comprobante de domicilio",
      },
      {
        fecha: "2024-01-16",
        accion: "Pago realizado",
        usuario: "Ana Martínez",
        detalles: "Se realizó el pago de aranceles",
      },
      {
        fecha: "2024-01-18",
        accion: "Trámite completado",
        usuario: "Dr. Roberto Notario",
        detalles: "Compraventa finalizada exitosamente",
      },
    ],
    costos: {
      aranceles: 2000,
      impuestos: 400,
      derechos: 100,
      total: 2500,
      pagado: 2500,
      pendiente: 0,
    },
    cita: {
      fecha: "2024-01-18",
      hora: "14:00",
      notario: "Dr. Roberto Notario",
      sala: "Sala B",
      estado: "Completada",
    },
  },
  "EXP-003": {
    id: "EXP-003",
    cliente: "Roberto Silva",
    telefono: "664-555-1234",
    email: "roberto.silva@email.com",
    folio: "EXP-2024-003",
    observaciones: "Poder general para gestión de propiedades",
    estado: "Pendiente",
    progreso: 45,
    fechaCreacion: "2024-01-22",
    ultimaActividad: "2024-01-22",
    documentos: 2,
    totalDocumentos: 4,
    tramites: [
      {
        id: "TRM-003",
        tipo: "Poder",
        formato: {
          id: "poder-estandar",
          nombre: "Poder Estándar",
          archivo: "FORMATO-TESTAMENTO-2019.pdf"
        },
        estado: "Pendiente",
        progreso: 45,
        fechaInicio: "2024-01-22",
        fechaFin: null,
        documentos: 2,
        costos: {
          total: 1200,
          pagado: 600,
          pendiente: 600,
        },
        cita: {
          fecha: "2024-01-28",
          hora: "11:00",
          notario: "Lic. Ana García",
          estado: "Pendiente",
        },
      }
    ],
    datosPersonales: {
      nombre: "Roberto",
      apellidoPaterno: "Silva",
      apellidoMaterno: "González",
      fechaNacimiento: "1975-08-10",
      curp: "SIGR750810HDFLNB01",
      rfc: "SIGR750810ABC",
      telefono: "664-555-1234",
      email: "roberto.silva@email.com",
      domicilio: {
        calle: "Calle 5ta",
        numero: "789",
        colonia: "Zona Río",
        municipio: "Tijuana",
        estado: "Baja California",
        codigoPostal: "22320",
      },
    },
    documentosRequeridos: [
      {
        id: 1,
        nombre: "Identificación oficial",
        tipo: "INE",
        estado: "Completado",
        archivo: "ine_roberto_silva.pdf",
      },
      {
        id: 2,
        nombre: "Comprobante de domicilio",
        tipo: "CFE",
        estado: "Completado",
        archivo: "cfe_roberto_silva.pdf",
      },
      {
        id: 3,
        nombre: "Documento que acredite la representación",
        tipo: "Representación",
        estado: "Pendiente",
        archivo: null,
      },
      {
        id: 4,
        nombre: "Pago de aranceles",
        tipo: "Pago",
        estado: "Pendiente",
        archivo: null,
      },
    ],
    historial: [
      {
        fecha: "2024-01-22",
        accion: "Expediente creado",
        usuario: "Admin",
        detalles: "Se inició el expediente para poder general",
      },
      {
        fecha: "2024-01-22",
        accion: "Documento subido",
        usuario: "Roberto Silva",
        detalles: "Se subió identificación oficial",
      },
      {
        fecha: "2024-01-22",
        accion: "Documento subido",
        usuario: "Roberto Silva",
        detalles: "Se subió comprobante de domicilio",
      },
    ],
    costos: {
      aranceles: 1000,
      impuestos: 150,
      derechos: 50,
      total: 1200,
      pagado: 600,
      pendiente: 600,
    },
    cita: {
      fecha: "2024-01-28",
      hora: "11:00",
      notario: "Lic. Ana García",
      sala: "Sala C",
      estado: "Pendiente",
    },
  },
  "EXP-004": {
    id: "EXP-004",
    cliente: "María González",
    telefono: "664-777-8888",
    email: "maria.gonzalez@email.com",
    folio: "EXP-2024-004",
    observaciones: "Donación de inmueble familiar",
    estado: "En revisión",
    progreso: 60,
    fechaCreacion: "2024-01-20",
    ultimaActividad: "2024-01-23",
    documentos: 5,
    totalDocumentos: 8,
    tramites: [
      {
        id: "TRM-004",
        tipo: "Donación",
        formato: {
          id: "donacion-estandar",
          nombre: "Donación Estándar",
          archivo: "FORMATO-TESTAMENTO-2019.pdf"
        },
        estado: "En revisión",
        progreso: 60,
        fechaInicio: "2024-01-20",
        fechaFin: null,
        documentos: 5,
        costos: {
          total: 1800,
          pagado: 1800,
          pendiente: 0,
        },
        cita: {
          fecha: "2024-01-26",
          hora: "15:00",
          notario: "Dr. Roberto Notario",
          estado: "Programada",
        },
      }
    ],
    datosPersonales: {
      nombre: "María",
      apellidoPaterno: "González",
      apellidoMaterno: "López",
      fechaNacimiento: "1970-12-03",
      curp: "GOLM701203MDFNPR01",
      rfc: "GOLM701203ABC",
      telefono: "664-777-8888",
      email: "maria.gonzalez@email.com",
      domicilio: {
        calle: "Blvd. Agua Caliente",
        numero: "321",
        colonia: "Zona Dorada",
        municipio: "Tijuana",
        estado: "Baja California",
        codigoPostal: "22420",
      },
    },
    documentosRequeridos: [
      {
        id: 1,
        nombre: "Identificación oficial",
        tipo: "INE",
        estado: "Completado",
        archivo: "ine_maria_gonzalez.pdf",
      },
      {
        id: 2,
        nombre: "Comprobante de domicilio",
        tipo: "CFE",
        estado: "Completado",
        archivo: "cfe_maria_gonzalez.pdf",
      },
      {
        id: 3,
        nombre: "Escritura del inmueble",
        tipo: "Escritura",
        estado: "Completado",
        archivo: "escritura_inmueble.pdf",
      },
      {
        id: 4,
        nombre: "Avalúo del inmueble",
        tipo: "Avalúo",
        estado: "Completado",
        archivo: "avaluo_inmueble.pdf",
      },
      {
        id: 5,
        nombre: "Predial al corriente",
        tipo: "Predial",
        estado: "Completado",
        archivo: "predial_maria_gonzalez.pdf",
      },
      {
        id: 6,
        nombre: "Documento de donatario",
        tipo: "Donatario",
        estado: "Pendiente",
        archivo: null,
      },
      {
        id: 7,
        nombre: "Pago de aranceles",
        tipo: "Pago",
        estado: "Pendiente",
        archivo: null,
      },
      {
        id: 8,
        nombre: "Testigos (2 personas)",
        tipo: "Testigos",
        estado: "Pendiente",
        archivo: null,
      },
    ],
    historial: [
      {
        fecha: "2024-01-20",
        accion: "Expediente creado",
        usuario: "Admin",
        detalles: "Se inició el expediente para donación de inmueble",
      },
      {
        fecha: "2024-01-21",
        accion: "Documento subido",
        usuario: "María González",
        detalles: "Se subió identificación oficial",
      },
      {
        fecha: "2024-01-22",
        accion: "Documento subido",
        usuario: "María González",
        detalles: "Se subió comprobante de domicilio",
      },
      {
        fecha: "2024-01-23",
        accion: "Documento subido",
        usuario: "María González",
        detalles: "Se subió escritura del inmueble",
      },
    ],
    costos: {
      aranceles: 1500,
      impuestos: 250,
      derechos: 50,
      total: 1800,
      pagado: 1800,
      pendiente: 0,
    },
    cita: {
      fecha: "2024-01-26",
      hora: "15:00",
      notario: "Dr. Roberto Notario",
      sala: "Sala A",
      estado: "Programada",
    },
  },
  "EXP-005": {
    id: "EXP-005",
    cliente: "Carlos López",
    telefono: "664-999-0000",
    email: "carlos.lopez@email.com",
    folio: "EXP-2024-005",
    observaciones: "Fideicomiso empresarial complejo",
    estado: "Pendiente",
    progreso: 30,
    fechaCreacion: "2024-01-24",
    ultimaActividad: "2024-01-24",
    documentos: 1,
    totalDocumentos: 12,
    tramites: [
      {
        id: "TRM-005",
        tipo: "Fideicomiso",
        formato: {
          id: "fideicomiso-estandar",
          nombre: "Fideicomiso Estándar",
          archivo: "FORMATO-TESTAMENTO-2019.pdf"
        },
        estado: "Pendiente",
        progreso: 30,
        fechaInicio: "2024-01-24",
        fechaFin: null,
        documentos: 1,
        costos: {
          total: 5000,
          pagado: 1500,
          pendiente: 3500,
        },
        cita: {
          fecha: "2024-01-30",
          hora: "09:00",
          notario: "Lic. Ana García",
          estado: "Pendiente",
        },
      }
    ],
    datosPersonales: {
      nombre: "Carlos",
      apellidoPaterno: "López",
      apellidoMaterno: "Hernández",
      fechaNacimiento: "1965-07-15",
      curp: "LOHC650715HDFPRN01",
      rfc: "LOHC650715ABC",
      telefono: "664-999-0000",
      email: "carlos.lopez@email.com",
      domicilio: {
        calle: "Av. Universidad",
        numero: "987",
        colonia: "Zona Universitaria",
        municipio: "Tijuana",
        estado: "Baja California",
        codigoPostal: "22330",
      },
    },
    documentosRequeridos: [
      {
        id: 1,
        nombre: "Identificación oficial",
        tipo: "INE",
        estado: "Completado",
        archivo: "ine_carlos_lopez.pdf",
      },
      {
        id: 2,
        nombre: "Comprobante de domicilio",
        tipo: "CFE",
        estado: "Pendiente",
        archivo: null,
      },
      {
        id: 3,
        nombre: "Acta constitutiva de la empresa",
        tipo: "Acta Constitutiva",
        estado: "Pendiente",
        archivo: null,
      },
      {
        id: 4,
        nombre: "Poder notarial",
        tipo: "Poder",
        estado: "Pendiente",
        archivo: null,
      },
      {
        id: 5,
        nombre: "Estados financieros",
        tipo: "Financieros",
        estado: "Pendiente",
        archivo: null,
      },
      {
        id: 6,
        nombre: "Avalúo de bienes",
        tipo: "Avalúo",
        estado: "Pendiente",
        archivo: null,
      },
      {
        id: 7,
        nombre: "Pago de aranceles",
        tipo: "Pago",
        estado: "Pendiente",
        archivo: null,
      },
      {
        id: 8,
        nombre: "Testigos (2 personas)",
        tipo: "Testigos",
        estado: "Pendiente",
        archivo: null,
      },
      {
        id: 9,
        nombre: "Documentos de beneficiarios",
        tipo: "Beneficiarios",
        estado: "Pendiente",
        archivo: null,
      },
      {
        id: 10,
        nombre: "Certificado médico",
        tipo: "Médico",
        estado: "Pendiente",
        archivo: null,
      },
      {
        id: 11,
        nombre: "Fotografías recientes",
        tipo: "Fotos",
        estado: "Pendiente",
        archivo: null,
      },
      {
        id: 12,
        nombre: "Declaración de bienes",
        tipo: "Declaración",
        estado: "Pendiente",
        archivo: null,
      },
    ],
    historial: [
      {
        fecha: "2024-01-24",
        accion: "Expediente creado",
        usuario: "Admin",
        detalles: "Se inició el expediente para fideicomiso empresarial",
      },
      {
        fecha: "2024-01-24",
        accion: "Documento subido",
        usuario: "Carlos López",
        detalles: "Se subió identificación oficial",
      },
    ],
    costos: {
      aranceles: 4000,
      impuestos: 800,
      derechos: 200,
      total: 5000,
      pagado: 1500,
      pendiente: 3500,
    },
    cita: {
      fecha: "2024-01-30",
      hora: "09:00",
      notario: "Lic. Ana García",
      sala: "Sala B",
      estado: "Pendiente",
    },
  },
  "EXP-006": {
    id: "EXP-006",
    cliente: "Patricia Herrera",
    telefono: "664-111-2222",
    email: "patricia.herrera@email.com",
    folio: "EXP-2024-006",
    observaciones: "Caso complejo con múltiples trámites para sucesión",
    estado: "En proceso",
    progreso: 65,
    fechaCreacion: "2024-01-12",
    ultimaActividad: "2024-01-25",
    documentos: 15,
    totalDocumentos: 20,
    tramites: [
      {
        id: "TRM-006A",
        tipo: "Testamento",
        formato: {
          id: "testamento-estandar",
          nombre: "Testamento Estándar",
          archivo: "FORMATO-TESTAMENTO-2019.pdf"
        },
        estado: "Completado",
        progreso: 100,
        fechaInicio: "2024-01-12",
        fechaFin: "2024-01-20",
        documentos: 8,
        costos: {
          total: 3000,
          pagado: 3000,
          pendiente: 0,
        },
        cita: {
          fecha: "2024-01-20",
          hora: "14:00",
          notario: "Dr. Roberto Notario",
          estado: "Completada",
        },
      },
      {
        id: "TRM-006B",
        tipo: "Compraventa",
        formato: {
          id: "compraventa-estandar",
          nombre: "Compraventa Estándar",
          archivo: "compraventa.pdf"
        },
        estado: "En revisión",
        progreso: 45,
        fechaInicio: "2024-01-22",
        fechaFin: null,
        documentos: 7,
        costos: {
          total: 4500,
          pagado: 1500,
          pendiente: 3000,
        },
        cita: {
          fecha: "2024-01-30",
          hora: "16:00",
          notario: "Lic. Ana García",
          estado: "Programada",
        },
      }
    ],
    datosPersonales: {
      nombre: "Patricia",
      apellidoPaterno: "Herrera",
      apellidoMaterno: "Morales",
      fechaNacimiento: "1955-04-08",
      curp: "HEMP550408MDFRRR01",
      rfc: "HEMP550408ABC",
      telefono: "664-111-2222",
      email: "patricia.herrera@email.com",
      domicilio: {
        calle: "Calle 2da",
        numero: "654",
        colonia: "Zona Centro",
        municipio: "Tijuana",
        estado: "Baja California",
        codigoPostal: "22000",
      },
    },
    documentosRequeridos: [
      {
        id: 1,
        nombre: "Identificación oficial",
        tipo: "INE",
        estado: "Completado",
        archivo: "ine_patricia_herrera.pdf",
      },
      {
        id: 2,
        nombre: "Comprobante de domicilio",
        tipo: "CFE",
        estado: "Completado",
        archivo: "cfe_patricia_herrera.pdf",
      },
      {
        id: 3,
        nombre: "Acta de nacimiento",
        tipo: "Acta",
        estado: "Completado",
        archivo: "acta_nacimiento_patricia.pdf",
      },
      {
        id: 4,
        nombre: "CURP",
        tipo: "CURP",
        estado: "Completado",
        archivo: "curp_patricia_herrera.pdf",
      },
      {
        id: 5,
        nombre: "Testamento anterior",
        tipo: "Testamento",
        estado: "Completado",
        archivo: "testamento_anterior.pdf",
      },
      {
        id: 6,
        nombre: "Certificado médico",
        tipo: "Médico",
        estado: "Completado",
        archivo: "certificado_medico.pdf",
      },
      {
        id: 7,
        nombre: "Testigos (2 personas)",
        tipo: "Testigos",
        estado: "Completado",
        archivo: "testigos_patricia.pdf",
      },
      {
        id: 8,
        nombre: "Pago de aranceles - Testamento",
        tipo: "Pago",
        estado: "Completado",
        archivo: "pago_testamento.pdf",
      },
      {
        id: 9,
        nombre: "Fotografías recientes",
        tipo: "Fotos",
        estado: "Completado",
        archivo: "fotos_patricia.pdf",
      },
      {
        id: 10,
        nombre: "Declaración de herederos",
        tipo: "Declaración",
        estado: "Completado",
        archivo: "declaracion_herederos.pdf",
      },
      {
        id: 11,
        nombre: "Escritura anterior - Compraventa",
        tipo: "Escritura",
        estado: "Completado",
        archivo: "escritura_anterior_compraventa.pdf",
      },
      {
        id: 12,
        nombre: "Predial - Compraventa",
        tipo: "Predial",
        estado: "Completado",
        archivo: "predial_compraventa.pdf",
      },
      {
        id: 13,
        nombre: "Avalúo - Compraventa",
        tipo: "Avalúo",
        estado: "Completado",
        archivo: "avaluo_compraventa.pdf",
      },
      {
        id: 14,
        nombre: "Pago de aranceles - Compraventa",
        tipo: "Pago",
        estado: "Pendiente",
        archivo: null,
      },
      {
        id: 15,
        nombre: "Testigos - Compraventa",
        tipo: "Testigos",
        estado: "Pendiente",
        archivo: null,
      },
      {
        id: 16,
        nombre: "Documentos del comprador",
        tipo: "Comprador",
        estado: "Pendiente",
        archivo: null,
      },
      {
        id: 17,
        nombre: "Documentos del vendedor",
        tipo: "Vendedor",
        estado: "Pendiente",
        archivo: null,
      },
      {
        id: 18,
        nombre: "Certificado de libertad de gravámenes",
        tipo: "Certificado",
        estado: "Pendiente",
        archivo: null,
      },
      {
        id: 19,
        nombre: "Fotografías del inmueble",
        tipo: "Fotos",
        estado: "Pendiente",
        archivo: null,
      },
      {
        id: 20,
        nombre: "Declaración de valor",
        tipo: "Declaración",
        estado: "Pendiente",
        archivo: null,
      },
    ],
    historial: [
      {
        fecha: "2024-01-12",
        accion: "Expediente creado",
        usuario: "Admin",
        detalles: "Se inició el expediente para testamento",
      },
      {
        fecha: "2024-01-13",
        accion: "Documento subido",
        usuario: "Patricia Herrera",
        detalles: "Se subió identificación oficial",
      },
      {
        fecha: "2024-01-14",
        accion: "Documento subido",
        usuario: "Patricia Herrera",
        detalles: "Se subió comprobante de domicilio",
      },
      {
        fecha: "2024-01-15",
        accion: "Documento subido",
        usuario: "Patricia Herrera",
        detalles: "Se subió acta de nacimiento",
      },
      {
        fecha: "2024-01-16",
        accion: "Documento subido",
        usuario: "Patricia Herrera",
        detalles: "Se subió CURP",
      },
      {
        fecha: "2024-01-17",
        accion: "Pago realizado",
        usuario: "Patricia Herrera",
        detalles: "Se realizó el pago de aranceles para testamento",
      },
      {
        fecha: "2024-01-20",
        accion: "Testamento completado",
        usuario: "Dr. Roberto Notario",
        detalles: "Testamento finalizado exitosamente",
      },
      {
        fecha: "2024-01-22",
        accion: "Nuevo trámite agregado",
        usuario: "Admin",
        detalles: "Se agregó trámite de compraventa al expediente",
      },
      {
        fecha: "2024-01-23",
        accion: "Documento subido",
        usuario: "Patricia Herrera",
        detalles: "Se subió escritura anterior para compraventa",
      },
      {
        fecha: "2024-01-24",
        accion: "Documento subido",
        usuario: "Patricia Herrera",
        detalles: "Se subió predial para compraventa",
      },
      {
        fecha: "2024-01-25",
        accion: "Documento subido",
        usuario: "Patricia Herrera",
        detalles: "Se subió avalúo para compraventa",
      },
    ],
    costos: {
      aranceles: 6000,
      impuestos: 1200,
      derechos: 300,
      total: 7500,
      pagado: 4500,
      pendiente: 3000,
    },
    cita: {
      fecha: "2024-01-30",
      hora: "16:00",
      notario: "Lic. Ana García",
      sala: "Sala A",
      estado: "Programada",
    },
  },
};

export default function ExpedienteDetalle() {
  const params = useParams();
  const router = useRouter();
  const expedienteId = params.id as string;

  const [expediente, setExpediente] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("datos");
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isEditCitaModalOpen, setIsEditCitaModalOpen] = useState(false);
  const [editingCita, setEditingCita] = useState<any>(null);
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [bulkFiles, setBulkFiles] = useState<FileList | null>(null);
  const [isProcessingBulkOCR, setIsProcessingBulkOCR] = useState(false);

  useEffect(() => {
    // Simular carga de expediente
    setTimeout(() => {
      const expedienteData =
        expedientesMock[expedienteId as keyof typeof expedientesMock];
      if (expedienteData) {
        setExpediente(expedienteData);
      } else {
        // Si no se encuentra el expediente, intentar con otros IDs comunes
        const fallbackIds = ["EXP-004", "EXP-005", "EXP-006"];
        const fallbackData = fallbackIds.find(id => 
          expedientesMock[id as keyof typeof expedientesMock]
        );
        
        if (fallbackData) {
          setExpediente(expedientesMock[fallbackData as keyof typeof expedientesMock]);
        }
      }
      setIsLoading(false);
    }, 1000);
  }, [expedienteId]);

  const handleVerDocumento = (documento: any) => {
    setSelectedDocument(documento);
    setIsDocumentModalOpen(true);
  };

  const handleSubirDocumento = (documento: any) => {
    setSelectedDocument(documento);
    setIsUploadModalOpen(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleConfirmUpload = () => {
    if (uploadedFile && selectedDocument) {
      // Simular subida exitosa
      const updatedExpediente = { ...expediente };
      const docIndex = updatedExpediente.documentosRequeridos.findIndex(
        (doc: any) => doc.id === selectedDocument.id
      );
      if (docIndex !== -1) {
        updatedExpediente.documentosRequeridos[docIndex].estado = "Completado";
        updatedExpediente.documentosRequeridos[docIndex].archivo =
          uploadedFile.name;
        updatedExpediente.documentos += 1;
        updatedExpediente.progreso = Math.round(
          (updatedExpediente.documentos / updatedExpediente.totalDocumentos) *
            100
        );
        setExpediente(updatedExpediente);
      }
      setIsUploadModalOpen(false);
      setUploadedFile(null);
      setSelectedDocument(null);
    }
  };

  const handleEditarDatos = () => {
    setEditingData({ ...expediente.datosPersonales });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingData) {
      const updatedExpediente = { ...expediente };
      updatedExpediente.datosPersonales = editingData;
      setExpediente(updatedExpediente);
      setIsEditModalOpen(false);
      setEditingData(null);
    }
  };

  const handleGenerarDocumento = () => {
    setIsPreviewModalOpen(true);
  };

  const handleImprimir = () => {
    // Crear ventana de impresión
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const content = `
        <html>
          <head>
            <title>${expediente.tramite} - ${expediente.cliente}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .content { line-height: 1.6; }
              .signature { margin-top: 50px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${expediente.tramite.toUpperCase()}</h1>
            </div>
            <div class="content">
              <p>Yo, <strong>${expediente.datosPersonales.nombre} ${
        expediente.datosPersonales.apellidoPaterno
      } ${expediente.datosPersonales.apellidoMaterno}</strong>, 
              mayor de edad, con domicilio en ${
                expediente.datosPersonales.domicilio.calle
              } ${expediente.datosPersonales.domicilio.numero}, 
              Colonia ${expediente.datosPersonales.domicilio.colonia}, ${
        expediente.datosPersonales.domicilio.municipio
      }, 
              ${expediente.datosPersonales.domicilio.estado}, C.P. ${
        expediente.datosPersonales.domicilio.codigoPostal
      }, 
              en pleno uso de mis facultades mentales, declaro que...</p>
              
              <p>Este documento ha sido generado el ${new Date().toLocaleDateString(
                "es-MX"
              )} para el expediente ${expediente.id}.</p>
              
              <div class="signature">
                <p>Firma: _________________________</p>
                <p>Fecha: _________________________</p>
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

  const handleEnviar = () => {
    setIsSendModalOpen(true);
  };

  const handleSendEmail = () => {
    const subject = `${expediente.tramite} - Expediente ${expediente.id}`;
    const body = `Estimado/a ${expediente.cliente},\n\nAdjunto encontrará el documento de ${expediente.tramite} correspondiente a su expediente ${expediente.id}.\n\nSaludos cordiales,\nNotaría Tijuana`;
    const mailtoLink = `mailto:${
      expediente.datosPersonales.email
    }?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
    setIsSendModalOpen(false);
  };

  const handleSendWhatsApp = () => {
    const message = `Hola ${expediente.cliente}, su ${expediente.tramite} del expediente ${expediente.id} está listo. Puede revisarlo en el siguiente enlace: ${window.location.origin}/expediente/${expediente.id}`;
    const whatsappLink = `https://wa.me/52${expediente.datosPersonales.telefono.replace(
      /\D/g,
      ""
    )}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, "_blank");
    setIsSendModalOpen(false);
  };

  const handleDownloadPDF = () => {
    // Simular descarga de PDF
    const element = document.createElement("a");
    const file = new Blob(
      [
        `${expediente.tramite} - ${
          expediente.cliente
        }\n\nDocumento generado el ${new Date().toLocaleDateString("es-MX")}`,
      ],
      { type: "text/plain" }
    );
    element.href = URL.createObjectURL(file);
    element.download = `${expediente.tramite}_${expediente.id}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setIsSendModalOpen(false);
  };

  const handleEliminarExpediente = () => {
    if (
      confirm(
        "¿Estás seguro de que quieres eliminar este expediente? Esta acción no se puede deshacer."
      )
    ) {
      // Simular eliminación
      alert("Expediente eliminado exitosamente");
      router.push("/admin");
    }
  };

  const handleArchivar = () => {
    if (
      confirm(
        "¿Estás seguro de que quieres archivar este expediente? Podrás reactivarlo desde el panel de administración."
      )
    ) {
      // Simular archivado
      const updatedExpediente = { ...expediente, estado: "Archivado" };
      setExpediente(updatedExpediente);
      alert("Expediente archivado exitosamente");
    }
  };

  const handleEditarCita = () => {
    setEditingCita({ ...expediente.cita });
    setIsEditCitaModalOpen(true);
  };

  const handleSaveCita = () => {
    if (editingCita) {
      const updatedExpediente = { ...expediente };
      updatedExpediente.cita = editingCita;
      setExpediente(updatedExpediente);
      setIsEditCitaModalOpen(false);
      setEditingCita(null);
    }
  };

  const handleBulkUpload = () => {
    setIsBulkUploadModalOpen(true);
  };

  const handleBulkFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setBulkFiles(files);
    }
  };

  const handleProcessBulkUpload = async () => {
    if (!bulkFiles) return;

    setIsProcessingBulkOCR(true);

    // Simular procesamiento de múltiples archivos
    for (let i = 0; i < bulkFiles.length; i++) {
      const file = bulkFiles[i];

      // Simular clasificación automática
      const tipoClasificado = clasificarDocumento(file.name, file.type);
      const datosExtraidos = await simularOCR(file, tipoClasificado);

      // Actualizar expediente con documento clasificado
      const updatedExpediente = { ...expediente };
      const docIndex = updatedExpediente.documentosRequeridos.findIndex(
        (doc: any) => doc.nombre === tipoClasificado
      );

      if (docIndex !== -1) {
        updatedExpediente.documentosRequeridos[docIndex].estado = "Completado";
        updatedExpediente.documentosRequeridos[docIndex].archivo = file.name;
        updatedExpediente.documentos += 1;
        updatedExpediente.progreso = Math.round(
          (updatedExpediente.documentos / updatedExpediente.totalDocumentos) *
            100
        );
      }

      setExpediente(updatedExpediente);

      // Prellenar datos si es posible
      if (datosExtraidos) {
        prellenarDatos(datosExtraidos);
      }
    }

    setIsProcessingBulkOCR(false);
    setIsBulkUploadModalOpen(false);
    setBulkFiles(null);
  };

  const clasificarDocumento = (fileName: string, fileType: string): string => {
    const nombre = fileName.toLowerCase();

    if (nombre.includes("ine") || nombre.includes("identificacion"))
      return "Identificación oficial";
    if (
      nombre.includes("domicilio") ||
      nombre.includes("cfe") ||
      nombre.includes("luz")
    )
      return "Comprobante de domicilio";
    if (nombre.includes("nacimiento") || nombre.includes("acta"))
      return "Acta de nacimiento";
    if (nombre.includes("curp")) return "CURP";
    if (nombre.includes("rfc")) return "RFC";
    if (nombre.includes("matrimonio")) return "Acta de matrimonio";
    if (nombre.includes("testamento")) return "Testamento anterior (si existe)";
    if (nombre.includes("medico") || nombre.includes("salud"))
      return "Certificado médico";
    if (nombre.includes("pago") || nombre.includes("comprobante"))
      return "Pago de aranceles";
    if (nombre.includes("foto") || nombre.includes("imagen"))
      return "Fotografías recientes";

    return "Documento general";
  };

  const simularOCR = async (file: File, tipo: string): Promise<any> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    switch (tipo) {
      case "Identificación oficial":
        return {
          nombre: "Juan Carlos",
          apellidoPaterno: "Pérez",
          apellidoMaterno: "García",
          curp: "PEGJ850315HDFRRN01",
          fechaNacimiento: "1985-03-15",
        };
      case "Comprobante de domicilio":
        return {
          domicilio: {
            calle: "Av. Reforma",
            numero: "123",
            colonia: "Centro",
            municipio: "Tijuana",
            estado: "Baja California",
            codigoPostal: "22000",
          },
        };
      case "Acta de nacimiento":
        return {
          nombre: "Juan Carlos",
          apellidoPaterno: "Pérez",
          apellidoMaterno: "García",
          fechaNacimiento: "1985-03-15",
          curp: "PEGJ850315HDFRRN01",
        };
      default:
        return null;
    }
  };

  const prellenarDatos = (datos: any) => {
    const updatedExpediente = { ...expediente };
    updatedExpediente.datosPersonales = {
      ...updatedExpediente.datosPersonales,
      ...(datos.nombre && { nombre: datos.nombre }),
      ...(datos.apellidoPaterno && { apellidoPaterno: datos.apellidoPaterno }),
      ...(datos.apellidoMaterno && { apellidoMaterno: datos.apellidoMaterno }),
      ...(datos.fechaNacimiento && { fechaNacimiento: datos.fechaNacimiento }),
      ...(datos.curp && { curp: datos.curp }),
      ...(datos.rfc && { rfc: datos.rfc }),
      ...(datos.domicilio && {
        domicilio: {
          ...updatedExpediente.datosPersonales.domicilio,
          ...datos.domicilio,
        },
      }),
    };
    setExpediente(updatedExpediente);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando expediente...</p>
        </div>
      </div>
    );
  }

  if (!expediente) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Expediente no encontrado
          </h1>
          <Button onClick={() => router.push("/admin/expedientes")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Expedientes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/expedientes")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Expediente {expediente.id}
            </h1>
            <p className="text-gray-600">
              {expediente.cliente} - {expediente.tramite}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge
            variant={
              expediente.estado === "Completado"
                ? "default"
                : expediente.estado === "En revisión"
                ? "secondary"
                : expediente.estado === "Archivado"
                ? "destructive"
                : "outline"
            }
          >
            {expediente.estado}
          </Badge>
          <Button onClick={handleEditarDatos} variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button onClick={handleGenerarDocumento}>
            <FileText className="h-4 w-4 mr-2" />
            Generar Documento
          </Button>
          <Button onClick={handleEliminarExpediente} variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progreso del Expediente</span>
            <span className="text-sm text-gray-600">
              {expediente.progreso}%
            </span>
          </div>
          <Progress value={expediente.progreso} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>
              {expediente.documentos} de {expediente.totalDocumentos} documentos
            </span>
            <span>Última actividad: {expediente.ultimaActividad}</span>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="datos">Datos Personales</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="costos">Costos</TabsTrigger>
          <TabsTrigger value="cita">Cita</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
        </TabsList>

        {/* Datos Personales Tab */}
        <TabsContent value="datos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>
                Datos del cliente para el trámite
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nombre</Label>
                  <Input value={expediente.datosPersonales.nombre} readOnly />
                </div>
                <div>
                  <Label>Apellido Paterno</Label>
                  <Input
                    value={expediente.datosPersonales.apellidoPaterno}
                    readOnly
                  />
                </div>
                <div>
                  <Label>Apellido Materno</Label>
                  <Input
                    value={expediente.datosPersonales.apellidoMaterno}
                    readOnly
                  />
                </div>
                <div>
                  <Label>Fecha de Nacimiento</Label>
                  <Input
                    value={expediente.datosPersonales.fechaNacimiento}
                    readOnly
                  />
                </div>
                <div>
                  <Label>CURP</Label>
                  <Input value={expediente.datosPersonales.curp} readOnly />
                </div>
                <div>
                  <Label>RFC</Label>
                  <Input value={expediente.datosPersonales.rfc} readOnly />
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <Input value={expediente.datosPersonales.telefono} readOnly />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={expediente.datosPersonales.email} readOnly />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">Domicilio</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Calle</Label>
                    <Input
                      value={expediente.datosPersonales.domicilio.calle}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Número</Label>
                    <Input
                      value={expediente.datosPersonales.domicilio.numero}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Colonia</Label>
                    <Input
                      value={expediente.datosPersonales.domicilio.colonia}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Municipio</Label>
                    <Input
                      value={expediente.datosPersonales.domicilio.municipio}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Estado</Label>
                    <Input
                      value={expediente.datosPersonales.domicilio.estado}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Código Postal</Label>
                    <Input
                      value={expediente.datosPersonales.domicilio.codigoPostal}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documentos Tab */}
        <TabsContent value="documentos" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Documentos Requeridos</CardTitle>
                  <CardDescription>
                    Lista de documentos necesarios para el trámite
                  </CardDescription>
                </div>
                <Button onClick={handleBulkUpload} variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Carga Masiva
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expediente.documentosRequeridos.map((documento: any) => (
                  <div
                    key={documento.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {documento.estado === "Completado" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{documento.nombre}</h3>
                        <p className="text-sm text-gray-500">
                          Tipo: {documento.tipo}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          documento.estado === "Completado"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {documento.estado}
                      </Badge>
                      {documento.archivo ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVerDocumento(documento)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleSubirDocumento(documento)}
                        >
                          <Upload className="h-4 w-4 mr-1" />
                          Subir
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Costos Tab */}
        <TabsContent value="costos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Desglose de Costos</CardTitle>
              <CardDescription>
                Detalle de aranceles, impuestos y derechos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Aranceles Notariales:</span>
                      <span>
                        ${expediente.costos.aranceles.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Impuestos:</span>
                      <span>
                        ${expediente.costos.impuestos.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Derechos de Registro:</span>
                      <span>
                        ${expediente.costos.derechos.toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>${expediente.costos.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Pagado:</span>
                      <span className="text-green-600">
                        ${expediente.costos.pagado.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pendiente:</span>
                      <span
                        className={
                          expediente.costos.pendiente > 0
                            ? "text-red-600"
                            : "text-green-600"
                        }
                      >
                        ${expediente.costos.pendiente.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cita Tab */}
        <TabsContent value="cita" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Información de la Cita</CardTitle>
                  <CardDescription>
                    Detalles de la cita programada
                  </CardDescription>
                </div>
                <Button onClick={handleEditarCita} variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Cita
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Fecha</Label>
                  <Input value={expediente.cita.fecha} readOnly />
                </div>
                <div>
                  <Label>Hora</Label>
                  <Input value={expediente.cita.hora} readOnly />
                </div>
                <div>
                  <Label>Notario</Label>
                  <Input value={expediente.cita.notario} readOnly />
                </div>
                <div>
                  <Label>Sala</Label>
                  <Input value={expediente.cita.sala} readOnly />
                </div>
                <div className="md:col-span-2">
                  <Label>Estado</Label>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{expediente.cita.estado}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Historial Tab */}
        <TabsContent value="historial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Actividades</CardTitle>
              <CardDescription>
                Registro de todas las acciones realizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expediente.historial.map((actividad: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 border rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      <Clock className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{actividad.accion}</h4>
                        <span className="text-sm text-gray-500">
                          {actividad.fecha}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {actividad.detalles}
                      </p>
                      <p className="text-xs text-gray-500">
                        Por: {actividad.usuario}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t">
        <div className="flex space-x-2">
          <Button onClick={handleImprimir} variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button onClick={handleEnviar} variant="outline">
            <Send className="h-4 w-4 mr-2" />
            Enviar
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleArchivar} variant="outline">
            <Archive className="h-4 w-4 mr-2" />
            Archivar
          </Button>
        </div>
      </div>

      {/* Modal para Ver Documento */}
      <Dialog open={isDocumentModalOpen} onOpenChange={setIsDocumentModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.nombre}</DialogTitle>
            <DialogDescription>Visualización del documento</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-100 p-8 rounded-lg text-center">
              <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Vista previa del documento</p>
              <p className="text-sm text-gray-500">
                {selectedDocument?.archivo}
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsDocumentModalOpen(false)}
              >
                Cerrar
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Descargar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Generar Documento */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Vista Previa del {expediente.tramite}</DialogTitle>
            <DialogDescription>
              Documento generado con los datos del cliente
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-white border p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-center mb-6">
                TESTAMENTO
              </h2>
              <div className="space-y-4 text-sm">
                <p>
                  Yo,{" "}
                  <strong>
                    {expediente.datosPersonales.nombre}{" "}
                    {expediente.datosPersonales.apellidoPaterno}{" "}
                    {expediente.datosPersonales.apellidoMaterno}
                  </strong>
                  , mayor de edad, con domicilio en{" "}
                  {expediente.datosPersonales.domicilio.calle}{" "}
                  {expediente.datosPersonales.domicilio.numero}, Colonia{" "}
                  {expediente.datosPersonales.domicilio.colonia},{" "}
                  {expediente.datosPersonales.domicilio.municipio},
                  {expediente.datosPersonales.domicilio.estado}, C.P.{" "}
                  {expediente.datosPersonales.domicilio.codigoPostal}, en pleno
                  uso de mis facultades mentales, declaro que...
                </p>

                <p>
                  Este es un ejemplo de cómo se vería el testamento con los
                  datos del cliente cargados automáticamente.
                </p>

                <p>Fecha: {new Date().toLocaleDateString("es-MX")}</p>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsPreviewModalOpen(false)}
              >
                Cerrar
              </Button>
              <Button onClick={handleImprimir}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button onClick={handleEnviar}>
                <Send className="h-4 w-4 mr-2" />
                Enviar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Subir Documento */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Subir Documento</DialogTitle>
            <DialogDescription>
              Subir {selectedDocument?.nombre} para el expediente
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file-upload">Seleccionar archivo</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileUpload}
                className="mt-1"
              />
              {uploadedFile && (
                <p className="text-sm text-green-600 mt-2">
                  Archivo seleccionado: {uploadedFile.name}
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsUploadModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleConfirmUpload} disabled={!uploadedFile}>
                <Upload className="h-4 w-4 mr-2" />
                Subir
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Enviar Documento */}
      <Dialog open={isSendModalOpen} onOpenChange={setIsSendModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Enviar Documento</DialogTitle>
            <DialogDescription>
              Selecciona cómo deseas enviar el documento
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <Button
                onClick={handleSendEmail}
                variant="outline"
                className="justify-start"
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar por Correo
              </Button>
              <Button
                onClick={handleSendWhatsApp}
                variant="outline"
                className="justify-start"
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar por WhatsApp
              </Button>
              <Button
                onClick={handleDownloadPDF}
                variant="outline"
                className="justify-start"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar PDF
              </Button>
              <Button
                onClick={handleImprimir}
                variant="outline"
                className="justify-start"
              >
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
            </div>
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setIsSendModalOpen(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Editar Datos */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Datos del Cliente</DialogTitle>
            <DialogDescription>
              Modificar información personal del cliente
            </DialogDescription>
          </DialogHeader>
          {editingData && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-nombre">Nombre</Label>
                  <Input
                    id="edit-nombre"
                    value={editingData.nombre}
                    onChange={(e) =>
                      setEditingData((prev) => ({
                        ...prev,
                        nombre: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-apellidoPaterno">Apellido Paterno</Label>
                  <Input
                    id="edit-apellidoPaterno"
                    value={editingData.apellidoPaterno}
                    onChange={(e) =>
                      setEditingData((prev) => ({
                        ...prev,
                        apellidoPaterno: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-apellidoMaterno">Apellido Materno</Label>
                  <Input
                    id="edit-apellidoMaterno"
                    value={editingData.apellidoMaterno}
                    onChange={(e) =>
                      setEditingData((prev) => ({
                        ...prev,
                        apellidoMaterno: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-telefono">Teléfono</Label>
                  <Input
                    id="edit-telefono"
                    value={editingData.telefono}
                    onChange={(e) =>
                      setEditingData((prev) => ({
                        ...prev,
                        telefono: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingData.email}
                    onChange={(e) =>
                      setEditingData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-curp">CURP</Label>
                  <Input
                    id="edit-curp"
                    value={editingData.curp}
                    onChange={(e) =>
                      setEditingData((prev) => ({
                        ...prev,
                        curp: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Domicilio</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-calle">Calle</Label>
                    <Input
                      id="edit-calle"
                      value={editingData.domicilio.calle}
                      onChange={(e) =>
                        setEditingData((prev) => ({
                          ...prev,
                          domicilio: {
                            ...prev.domicilio,
                            calle: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-numero">Número</Label>
                    <Input
                      id="edit-numero"
                      value={editingData.domicilio.numero}
                      onChange={(e) =>
                        setEditingData((prev) => ({
                          ...prev,
                          domicilio: {
                            ...prev.domicilio,
                            numero: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-colonia">Colonia</Label>
                    <Input
                      id="edit-colonia"
                      value={editingData.domicilio.colonia}
                      onChange={(e) =>
                        setEditingData((prev) => ({
                          ...prev,
                          domicilio: {
                            ...prev.domicilio,
                            colonia: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-municipio">Municipio</Label>
                    <Input
                      id="edit-municipio"
                      value={editingData.domicilio.municipio}
                      onChange={(e) =>
                        setEditingData((prev) => ({
                          ...prev,
                          domicilio: {
                            ...prev.domicilio,
                            municipio: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-estado">Estado</Label>
                    <Input
                      id="edit-estado"
                      value={editingData.domicilio.estado}
                      onChange={(e) =>
                        setEditingData((prev) => ({
                          ...prev,
                          domicilio: {
                            ...prev.domicilio,
                            estado: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-codigoPostal">Código Postal</Label>
                    <Input
                      id="edit-codigoPostal"
                      value={editingData.domicilio.codigoPostal}
                      onChange={(e) =>
                        setEditingData((prev) => ({
                          ...prev,
                          domicilio: {
                            ...prev.domicilio,
                            codigoPostal: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSaveEdit}>Guardar Cambios</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal para Editar Cita */}
      <Dialog open={isEditCitaModalOpen} onOpenChange={setIsEditCitaModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Cita</DialogTitle>
            <DialogDescription>
              Modifica los detalles de la cita programada
            </DialogDescription>
          </DialogHeader>
          {editingCita && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-fecha">Fecha</Label>
                <Input
                  id="edit-fecha"
                  type="date"
                  value={editingCita.fecha}
                  onChange={(e) =>
                    setEditingCita((prev) => ({
                      ...prev,
                      fecha: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-hora">Hora</Label>
                <Input
                  id="edit-hora"
                  type="time"
                  value={editingCita.hora}
                  onChange={(e) =>
                    setEditingCita((prev) => ({
                      ...prev,
                      hora: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-notario">Notario</Label>
                <Input
                  id="edit-notario"
                  value={editingCita.notario}
                  onChange={(e) =>
                    setEditingCita((prev) => ({
                      ...prev,
                      notario: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-sala">Sala</Label>
                <Input
                  id="edit-sala"
                  value={editingCita.sala}
                  onChange={(e) =>
                    setEditingCita((prev) => ({
                      ...prev,
                      sala: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-estado">Estado</Label>
                <Select
                  value={editingCita.estado}
                  onValueChange={(value) =>
                    setEditingCita((prev) => ({ ...prev, estado: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Programada">Programada</SelectItem>
                    <SelectItem value="Confirmada">Confirmada</SelectItem>
                    <SelectItem value="Completada">Completada</SelectItem>
                    <SelectItem value="Cancelada">Cancelada</SelectItem>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsEditCitaModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveCita}>Guardar Cambios</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Carga Masiva de Documentos */}
      <Dialog
        open={isBulkUploadModalOpen}
        onOpenChange={setIsBulkUploadModalOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Carga Masiva de Documentos</DialogTitle>
            <DialogDescription>
              Sube múltiples documentos y el sistema los clasificará
              automáticamente
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bulk-files">Seleccionar archivos</Label>
              <Input
                id="bulk-files"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleBulkFileSelect}
                className="mt-1"
              />
              {bulkFiles && (
                <p className="text-sm text-green-600 mt-2">
                  {bulkFiles.length} archivo(s) seleccionado(s)
                </p>
              )}
            </div>
            <div className="text-sm text-gray-600">
              <p>El sistema clasificará automáticamente los documentos y:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Extraerá datos personales con OCR</li>
                <li>Asignará cada documento al tipo correspondiente</li>
                <li>Prellenará los datos del cliente</li>
              </ul>
            </div>
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
              disabled={!bulkFiles || isProcessingBulkOCR}
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
        </DialogContent>
      </Dialog>

      {/* Indicador de Procesamiento OCR */}
      {isProcessingBulkOCR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-lg font-medium">
              Procesando documentos con OCR...
            </p>
            <p className="text-sm text-gray-600">
              Clasificando y extrayendo datos automáticamente
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
