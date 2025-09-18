import { Home, Heart, Building } from "lucide-react";

export interface TramiteData {
  id: string;
  name: string;
  icon: any;
  description: string;
  color: string;
  iconColor: string;
  isMain: boolean;
  estimatedCost: string;
  timeRequired: string;
  keywords: string[];
  requirements: string[];
  costo?: {
    min: number;
    max: number;
  };
}

export const tramites: TramiteData[] = [
  {
    id: "compraventa",
    name: "Compraventa de Inmuebles",
    icon: Home,
    description: "Escrituración segura de propiedades",
    color: "bg-gradient-to-br from-blue-500 to-blue-900 border-2 border-blue-950 text-white shadow-lg",
    iconColor: "text-white",
    isMain: true,
    estimatedCost: "$20,000 - $30,000",
    timeRequired: "2-4 horas",
    costo: {
      min: 20000,
      max: 30000
    },
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
    id: "testamento",
    name: "Testamento",
    icon: Heart,
    description: "Protege el futuro de tu familia",
    color: "bg-gradient-to-br from-blue-500 to-blue-900 border-2 border-blue-950 text-white shadow-lg",
    iconColor: "text-white",
    isMain: true,
    estimatedCost: "$2,500 - $3,500",
    timeRequired: "1-2 horas",
    costo: {
      min: 2500,
      max: 3500
    },
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
      "Acta de nacimiento",
      "Lista de bienes y propiedades",
      "Comprobante de estado civil",
    ],
  },
  {
    id: "sociedad",
    name: "Constitución de Sociedad y/o Empresa",
    icon: Building,
    description: "Formaliza tu empresa legalmente",
    color: "bg-gradient-to-br from-blue-500 to-blue-900 border-2 border-blue-950 text-white shadow-lg",
    iconColor: "text-white",
    isMain: true,
    estimatedCost: "$12,000 - $18,000",
    timeRequired: "2-3 horas",
    costo: {
      min: 12000,
      max: 18000
    },
    keywords: [
      "sociedad",
      "empresa",
      "constitución",
      "negocio",
      "comercial",
      "corporativo",
    ],
    requirements: [
      "Identificación oficial de socios",
      "Comprobante de domicilio",
      "Acta constitutiva",
      "Registro de marca (si aplica)",
      "Comprobante de capital social",
    ],
  },
];

// Función para obtener un trámite por ID
export const getTramiteById = (id: string): TramiteData | undefined => {
  return tramites.find(tramite => tramite.id === id);
};

// Función para obtener todos los trámites
export const getAllTramites = (): TramiteData[] => {
  return tramites;
};

