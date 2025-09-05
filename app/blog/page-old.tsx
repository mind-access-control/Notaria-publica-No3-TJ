"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Shield,
  ArrowLeft,
  BookOpen,
  Search,
  Calendar,
  User,
  Clock,
  FileText,
  HelpCircle,
  Play,
  Home,
  Building2,
  Scale,
  Users,
  Heart,
  Calculator,
  X,
  Share2,
  Facebook,
  Twitter,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { MobileNav } from "@/components/mobile-nav";
import { Footer } from "@/components/footer";
import { blogPosts, videoPosts } from "@/lib/blog-data";

// const blogPosts = [ // Usando datos importados de lib/blog-data.ts
  {
    id: 1,
    title: "Documentos Necesarios para Elaborar un Testamento",
    excerpt:
      "Guía completa sobre los requisitos y documentación necesaria para proteger el futuro de tu familia.",
    content: `Un testamento es uno de los documentos más importantes que puedes elaborar para proteger a tu familia y asegurar que tus bienes se distribuyan según tus deseos. En México, el testamento público abierto es la forma más común y segura de hacerlo.

**¿Por qué es importante hacer un testamento?**

Muchas personas piensan que hacer un testamento es solo para personas mayores o con grandes fortunas, pero esto es un error común. Un testamento es importante para cualquier persona que tenga bienes, sin importar su edad o el valor de sus propiedades.

**Documentos requeridos:**

1. **Identificación oficial vigente** (INE, pasaporte o cédula profesional)
2. **CURP** (Clave Única de Registro de Población)
3. **Comprobante de domicilio** no mayor a 3 meses
4. **Escrituras de propiedades** (si las tienes)
5. **Lista de beneficiarios** con sus datos completos

**Proceso paso a paso:**

1. **Consulta inicial**: Revisamos tu situación patrimonial
2. **Elaboración del testamento**: Redactamos el documento según tus deseos
3. **Revisión**: Te explicamos cada cláusula antes de firmar
4. **Firma ante notario**: El acto se realiza en presencia del notario
5. **Registro**: El testamento se registra en el Archivo General de Notarías

**Costos aproximados:**
- Testamento simple: $2,500 - $4,000 MXN
- Testamento con múltiples propiedades: $3,500 - $6,000 MXN

**Recomendaciones importantes:**
- Actualiza tu testamento cada 5 años o cuando haya cambios importantes
- Incluye a todos tus herederos, incluso los menores de edad
- Considera la situación fiscal de tus beneficiarios
- Guarda una copia certificada en lugar seguro

En nuestra notaría, te brindamos asesoría completa y personalizada para que tu testamento refleje exactamente tus deseos y proteja a tus seres queridos.`,
    category: "Testamentos",
    author: "Lic. María Elena Rodríguez",
    date: "2024-01-15",
    readTime: "5 min",
    image: "/testamento-documents-guide.jpg",
  },
  {
    id: 2,
    title: "Proceso de Compraventa: Paso a Paso",
    excerpt:
      "Todo lo que necesitas saber sobre el proceso de compraventa de inmuebles en Tijuana.",
    content: `La compraventa de un inmueble es una de las transacciones más importantes en la vida de cualquier persona. En Tijuana, este proceso requiere de varios pasos y documentos específicos que deben cumplirse para garantizar la seguridad jurídica de ambas partes.

**Fases del proceso de compraventa:**

**1. Fase Previa (15-30 días)**
- Verificación de documentos del inmueble
- Búsquedas en el Registro Público de la Propiedad
- Avalúo comercial del inmueble
- Verificación de adeudos y gravámenes

**2. Fase de Elaboración (10-15 días)**
- Redacción de la escritura de compraventa
- Revisión legal del documento
- Correcciones y ajustes necesarios
- Preparación para la firma

**3. Fase de Firma (1 día)**
- Firma de la escritura ante notario
- Pago de impuestos y derechos
- Entrega de llaves y posesión

**Documentos necesarios del vendedor:**
- Escritura de propiedad
- Identificación oficial
- Comprobante de domicilio
- Recibos de predial y agua (sin adeudos)
- Avalúo comercial vigente

**Documentos necesarios del comprador:**
- Identificación oficial
- Comprobante de domicilio
- Comprobante de ingresos
- En caso de crédito: autorización bancaria

**Costos involucrados:**
- Honorarios notariales: 0.3% del valor del inmueble
- IVA: 16% sobre honorarios
- Derechos de registro: 0.1% del valor
- Avalúo: $2,000 - $5,000 MXN
- Búsquedas: $800 MXN

**Recomendaciones importantes:**
- Verifica que el inmueble esté libre de gravámenes
- Confirma que no hay adeudos de servicios
- Revisa el avalúo antes de proceder
- Mantén comunicación constante con tu notario

En nuestra notaría, acompañamos a nuestros clientes en cada paso del proceso, asegurando transparencia y seguridad jurídica en todas las operaciones.`,
    category: "Compraventa",
    author: "Lic. Carlos Alberto Mendoza",
    date: "2024-01-10",
    readTime: "7 min",
    image: "/real-estate-transaction-process.jpg",
  },
  {
    id: 3,
    title: "Tipos de Poderes Notariales y Sus Usos",
    excerpt:
      "Conoce las diferencias entre poder general, especial y para pleitos y cobranzas.",
    content: `Los poderes notariales son instrumentos legales que permiten a una persona actuar en nombre de otra en diversos asuntos. Es fundamental entender las diferencias entre los tipos de poderes para elegir el más adecuado según tus necesidades.

**Tipos de poderes notariales:**

**1. Poder General para Actos de Dominio**
- **Alcance**: Permite vender, comprar, hipotecar y disponer de bienes
- **Duración**: Hasta que sea revocado
- **Uso común**: Representación en transacciones inmobiliarias
- **Costo**: $1,800 - $2,500 MXN

**2. Poder General para Pleitos y Cobranzas**
- **Alcance**: Representación en juicios y cobranzas
- **Duración**: Hasta que sea revocado
- **Uso común**: Representación legal en tribunales
- **Costo**: $1,500 - $2,200 MXN

**3. Poder Especial**
- **Alcance**: Limitado a actos específicos
- **Duración**: Según el acto específico
- **Uso común**: Trámites específicos como renovar licencias
- **Costo**: $1,200 - $1,800 MXN

**4. Poder para Administración**
- **Alcance**: Administrar bienes sin poder de disposición
- **Duración**: Hasta que sea revocado
- **Uso común**: Administración de propiedades
- **Costo**: $1,000 - $1,500 MXN

**Documentos necesarios:**
- Identificación oficial del poderdante
- Identificación oficial del apoderado
- Comprobante de domicilio
- En caso de bienes: escrituras correspondientes

**Proceso de elaboración:**
1. **Consulta**: Definimos el tipo de poder necesario
2. **Elaboración**: Redactamos el documento específico
3. **Revisión**: Explicamos cada facultad otorgada
4. **Firma**: El acto se realiza ante notario
5. **Registro**: Se registra en el archivo notarial

**Recomendaciones importantes:**
- Elige cuidadosamente a tu apoderado
- Especifica claramente las facultades otorgadas
- Considera la duración del poder
- Guarda una copia certificada
- Revoca el poder cuando ya no sea necesario

**Revocación de poderes:**
Los poderes pueden ser revocados en cualquier momento mediante escritura pública. Es importante notificar la revocación a terceros que pudieran verse afectados.

En nuestra notaría, te asesoramos para elegir el tipo de poder más adecuado a tus necesidades específicas.`,
    category: "Poderes",
    author: "Lic. Ana Patricia Flores",
    date: "2024-01-05",
    readTime: "4 min",
    image: "/notarial-powers-types.jpg",
  },
  {
    id: 4,
    title: "Constitución de Sociedades: Guía para Emprendedores",
    excerpt:
      "Pasos esenciales para formalizar tu empresa y elegir el tipo de sociedad adecuado.",
    content: `Constituir una sociedad es el primer paso formal para establecer tu empresa y darle personalidad jurídica. En México, existen varios tipos de sociedades, cada una con características específicas que se adaptan a diferentes necesidades empresariales.

**Tipos de sociedades más comunes:**

**1. Sociedad Anónima (S.A.)**
- **Capital**: Mínimo $50,000 MXN
- **Socios**: Mínimo 2, máximo ilimitado
- **Responsabilidad**: Limitada al capital aportado
- **Administración**: Por consejo de administración
- **Ideal para**: Empresas grandes, inversión extranjera

**2. Sociedad de Responsabilidad Limitada (S. de R.L.)**
- **Capital**: Mínimo $3,000 MXN
- **Socios**: Mínimo 2, máximo 50
- **Responsabilidad**: Limitada al capital aportado
- **Administración**: Por gerentes
- **Ideal para**: Pequeñas y medianas empresas

**3. Sociedad por Acciones Simplificada (S.A.S.)**
- **Capital**: Mínimo $1.00 MXN
- **Socios**: Mínimo 1, máximo ilimitado
- **Responsabilidad**: Limitada al capital aportado
- **Administración**: Por administrador único
- **Ideal para**: Startups, emprendimientos

**Proceso de constitución:**

**1. Preparación (5-10 días)**
- Definir el tipo de sociedad
- Elegir denominación social
- Determinar el objeto social
- Establecer el capital social
- Designar administradores

**2. Elaboración de estatutos (3-5 días)**
- Redacción de estatutos sociales
- Definición de órganos de administración
- Establecimiento de reglas de funcionamiento
- Revisión legal del documento

**3. Firma y registro (1-2 días)**
- Firma de la escritura constitutiva
- Pago de derechos e impuestos
- Registro en el Registro Público de Comercio
- Obtención del RFC

**Documentos necesarios:**
- Identificación oficial de socios
- Comprobante de domicilio
- Acta constitutiva
- Estatutos sociales
- Poderes de representación

**Costos aproximados:**
- S.A.: $8,000 - $15,000 MXN
- S. de R.L.: $5,000 - $10,000 MXN
- S.A.S.: $3,000 - $6,000 MXN

**Recomendaciones importantes:**
- Elige cuidadosamente la denominación social
- Define claramente el objeto social
- Establece reglas claras de administración
- Considera la estructura fiscal futura
- Planifica la distribución de utilidades

**Obligaciones posteriores:**
- Inscripción en el RFC
- Apertura de cuenta bancaria
- Registro ante autoridades fiscales
- Cumplimiento de obligaciones laborales

En nuestra notaría, te acompañamos en todo el proceso de constitución, asegurando que tu sociedad cumpla con todos los requisitos legales y esté preparada para el éxito empresarial.`,
    category: "Sociedades",
    author: "Lic. Roberto Javier Castillo",
    date: "2023-12-28",
    readTime: "6 min",
    image: "/business-incorporation-guide.jpg",
  },
  {
    id: 5,
    title: "Divorcio por Mutuo Consentimiento: Requisitos y Proceso",
    excerpt:
      "Información completa sobre el divorcio administrativo y sus ventajas.",
    content: `El divorcio por mutuo consentimiento es una alternativa rápida y económica para disolver un matrimonio cuando ambas partes están de acuerdo. Este proceso se realiza ante notario público y no requiere pasar por los tribunales.

**Ventajas del divorcio por mutuo consentimiento:**

- **Rapidez**: Se puede completar en 1-2 días
- **Economía**: Costos significativamente menores
- **Privacidad**: No se requiere comparecer ante juez
- **Flexibilidad**: Las partes acuerdan todos los términos
- **Eficiencia**: Menos trámites y documentación

**Requisitos para el divorcio:**

**1. Requisitos de las partes:**
- Ser mayores de edad
- Estar casados por el civil
- Estar de acuerdo en divorciarse
- No tener hijos menores de edad
- No tener bienes en común

**2. Documentos necesarios:**
- Acta de matrimonio original
- Identificación oficial de ambos cónyuges
- Comprobante de domicilio
- CURP de ambos cónyuges
- Convenio de divorcio (si aplica)

**Proceso paso a paso:**

**1. Consulta inicial (1 día)**
- Revisión de documentos
- Verificación de requisitos
- Explicación del proceso
- Elaboración del convenio

**2. Elaboración de escritura (1 día)**
- Redacción del acta de divorcio
- Inclusión del convenio acordado
- Revisión legal del documento
- Preparación para la firma

**3. Firma y registro (1 día)**
- Firma de la escritura ante notario
- Pago de derechos e impuestos
- Registro en el archivo notarial
- Entrega de copias certificadas

**Costos aproximados:**
- Divorcio simple: $6,000 - $8,000 MXN
- Con convenio: $8,000 - $12,000 MXN
- Con bienes: $10,000 - $15,000 MXN

**Convenio de divorcio:**
El convenio puede incluir:
- División de bienes
- Pensión alimenticia
- Custodia de hijos mayores
- Uso de domicilio conyugal
- Obligaciones mutuas

**Casos que requieren proceso judicial:**
- Hijos menores de edad
- Desacuerdo en términos del divorcio
- Bienes en común sin acuerdo
- Violencia doméstica
- Incapacidad de una de las partes

**Recomendaciones importantes:**
- Asegúrate de cumplir todos los requisitos
- Elabora un convenio detallado
- Considera las implicaciones fiscales
- Guarda copias certificadas del acta
- Actualiza tu estado civil en todos los documentos

**Documentos a actualizar después del divorcio:**
- INE (Identificación oficial)
- RFC
- Pasaporte
- Licencia de conducir
- Seguros y afores
- Cuentas bancarias

En nuestra notaría, te brindamos asesoría completa para que tu divorcio se realice de manera eficiente y sin complicaciones, protegiendo los derechos de ambas partes.`,
    category: "Familia",
    author: "Lic. Ana Patricia Flores",
    date: "2023-12-20",
    readTime: "5 min",
    image: "/divorce-mutual-consent.jpg",
  },
  {
    id: 6,
    title: "Cómo Calcular los Aranceles Notariales",
    excerpt:
      "Entiende cómo se determinan los costos de los servicios notariales en México.",
    content: `Los aranceles notariales están regulados por ley y varían según el tipo de acto notarial. Entender cómo se calculan estos costos te ayudará a planificar mejor tus trámites y evitar sorpresas en el momento del pago.

**Base legal de los aranceles:**

Los aranceles notariales se rigen por la Ley del Notariado del Estado de Baja California y el Código Civil del Estado. Estos establecen las tarifas base que pueden ser ajustadas según la ubicación geográfica y la complejidad del trámite.

**Factores que influyen en el costo:**

**1. Tipo de acto notarial:**
- Compraventa de inmuebles: 0.3% del valor
- Testamentos: $2,500 - $4,000 MXN
- Poderes: $1,200 - $2,500 MXN
- Sociedades: $5,000 - $15,000 MXN

**2. Valor del bien o acto:**
- Los actos con valor económico se calculan sobre el monto
- Los actos sin valor tienen tarifa fija
- Se aplican mínimos y máximos establecidos por ley

**3. Ubicación geográfica:**
- Tijuana: 100% de la tarifa base
- Tecate: 90% de la tarifa base
- Rosarito: 95% de la tarifa base
- Ensenada: 100% de la tarifa base

**4. Complejidad del trámite:**
- Documentos adicionales requeridos
- Búsquedas especiales necesarias
- Tiempo de elaboración requerido
- Consultas legales adicionales

**Desglose de costos típicos:**

**Para una compraventa de $1,000,000 MXN:**
- Honorarios notariales: $3,000 MXN
- IVA (16%): $480 MXN
- Derechos de registro: $1,000 MXN
- Avalúo: $3,000 MXN
- Búsquedas: $800 MXN
- Copias certificadas: $200 MXN
- **Total aproximado: $8,480 MXN**

**Para un testamento:**
- Honorarios notariales: $3,000 MXN
- IVA (16%): $480 MXN
- Registro: $300 MXN
- Copias: $200 MXN
- **Total aproximado: $3,980 MXN**

**Cómo obtener una cotización exacta:**

**1. Consulta inicial gratuita:**
- Revisión de documentos
- Evaluación de complejidad
- Cálculo preliminar de costos
- Explicación detallada del proceso

**2. Documentos para cotización:**
- Descripción del trámite requerido
- Valor del bien (si aplica)
- Ubicación del inmueble
- Documentos disponibles
- Urgencia del trámite

**3. Cotización detallada:**
- Desglose de todos los costos
- Tiempo estimado de elaboración
- Documentos adicionales necesarios
- Recomendaciones específicas

**Recomendaciones para ahorrar:**

- **Planifica con anticipación**: Evita urgencias que generen costos adicionales
- **Revisa documentos**: Asegúrate de tener toda la documentación necesaria
- **Compara servicios**: Evalúa diferentes notarías
- **Pregunta por descuentos**: Algunas notarías ofrecen descuentos por volumen
- **Considera paquetes**: Algunos trámites relacionados pueden tener descuentos

**Preguntas frecuentes:**

**¿Los aranceles son negociables?**
Los aranceles base están fijos por ley, pero algunos servicios adicionales pueden tener flexibilidad.

**¿Se puede pagar en parcialidades?**
Depende del tipo de trámite y la política de cada notaría.

**¿Qué incluyen los honorarios?**
Elaboración del documento, firma ante notario, registro y copias básicas.

En nuestra notaría, ofrecemos transparencia total en nuestros costos y te proporcionamos cotizaciones detalladas sin compromiso.`,
    category: "General",
    author: "Lic. María Elena Rodríguez",
    date: "2023-12-15",
    readTime: "4 min",
    image: "/notarial-fees-calculation.jpg",
  },
]; // Fin de definición local comentada

const faqs = [
  {
    category: "Testamentos",
    questions: [
      {
        question: "¿Qué documentos necesito para hacer un testamento?",
        answer:
          "Para elaborar un testamento necesitas: identificación oficial vigente, CURP, comprobante de domicilio, y en caso de bienes inmuebles, las escrituras correspondientes. También es recomendable tener una lista de beneficiarios con sus datos completos.",
      },
      {
        question: "¿Puedo cambiar mi testamento después de firmado?",
        answer:
          "Sí, puedes modificar tu testamento las veces que consideres necesario. El testamento más reciente será el que tenga validez legal. Es importante acudir con un notario para hacer las modificaciones correspondientes.",
      },
      {
        question: "¿Cuánto cuesta hacer un testamento?",
        answer:
          "El costo de un testamento varía según el valor de los bienes. Contáctanos para una cotización personalizada. Ofrecemos consulta inicial gratuita para explicarte todos los costos involucrados.",
      },
    ],
  },
  {
    category: "Compraventa",
    questions: [
      {
        question: "¿Cuánto tiempo toma el proceso de compraventa?",
        answer:
          "El proceso típico de compraventa toma entre 15 a 30 días hábiles, dependiendo de la complejidad del caso y la disponibilidad de documentos. Trabajamos para agilizar el proceso sin comprometer la seguridad jurídica.",
      },
      {
        question: "¿Qué pasa si el inmueble tiene adeudos?",
        answer:
          "Antes de proceder con la escrituración, verificamos que el inmueble esté libre de gravámenes y adeudos. Si existen, deben ser liquidados antes de la firma de la escritura para garantizar una transacción segura.",
      },
      {
        question: "¿Necesito avalúo para la compraventa?",
        answer:
          "Sí, el avalúo comercial es obligatorio para determinar el valor real del inmueble y calcular los impuestos correspondientes. Trabajamos con peritos valuadores certificados para garantizar avalúos precisos.",
      },
    ],
  },
  {
    category: "Poderes",
    questions: [
      {
        question: "¿Cuál es la diferencia entre poder general y especial?",
        answer:
          "El poder general otorga facultades amplias para diversos actos, mientras que el poder especial se limita a actos específicos. El poder general es más versátil, pero el especial ofrece mayor control sobre las facultades otorgadas.",
      },
      {
        question: "¿Puedo revocar un poder notarial?",
        answer:
          "Sí, puedes revocar un poder notarial en cualquier momento acudiendo ante notario. La revocación debe ser notificada a terceros que pudieran verse afectados para que tenga plenos efectos legales.",
      },
    ],
  },
];

// Componente para generar imágenes profesionales por categoría
const ArticleImage = ({
  category,
  title,
}: {
  category: string;
  title: string;
}) => {
  const getImageContent = () => {
    switch (category) {
      case "Testamentos":
        return (
          <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-t-lg flex items-center justify-center relative overflow-hidden border border-slate-200">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 to-slate-200/30"></div>
            <div className="relative z-10 text-center">
              <Scale className="h-14 w-14 text-slate-600 mx-auto mb-3" />
              <div className="text-slate-700 font-medium text-sm tracking-wide">
                TESTAMENTOS
              </div>
            </div>
          </div>
        );
      case "Compraventa":
        return (
          <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-t-lg flex items-center justify-center relative overflow-hidden border border-slate-200">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 to-slate-200/30"></div>
            <div className="relative z-10 text-center">
              <Home className="h-14 w-14 text-slate-600 mx-auto mb-3" />
              <div className="text-slate-700 font-medium text-sm tracking-wide">
                COMPRAVENTA
              </div>
            </div>
          </div>
        );
      case "Poderes":
        return (
          <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-t-lg flex items-center justify-center relative overflow-hidden border border-slate-200">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 to-slate-200/30"></div>
            <div className="relative z-10 text-center">
              <FileText className="h-14 w-14 text-slate-600 mx-auto mb-3" />
              <div className="text-slate-700 font-medium text-sm tracking-wide">
                PODERES
              </div>
            </div>
          </div>
        );
      case "Sociedades":
        return (
          <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-t-lg flex items-center justify-center relative overflow-hidden border border-slate-200">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 to-slate-200/30"></div>
            <div className="relative z-10 text-center">
              <Building2 className="h-14 w-14 text-slate-600 mx-auto mb-3" />
              <div className="text-slate-700 font-medium text-sm tracking-wide">
                SOCIEDADES
              </div>
            </div>
          </div>
        );
      case "Familia":
        return (
          <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-t-lg flex items-center justify-center relative overflow-hidden border border-slate-200">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 to-slate-200/30"></div>
            <div className="relative z-10 text-center">
              <Heart className="h-14 w-14 text-slate-600 mx-auto mb-3" />
              <div className="text-slate-700 font-medium text-sm tracking-wide">
                FAMILIA
              </div>
            </div>
          </div>
        );
      case "General":
        return (
          <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-t-lg flex items-center justify-center relative overflow-hidden border border-slate-200">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 to-slate-200/30"></div>
            <div className="relative z-10 text-center">
              <Calculator className="h-14 w-14 text-slate-600 mx-auto mb-3" />
              <div className="text-slate-700 font-medium text-sm tracking-wide">
                GENERAL
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-t-lg flex items-center justify-center border border-slate-200">
            <FileText className="h-16 w-16 text-slate-500" />
          </div>
        );
    }
  };

  return getImageContent();
};

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  // Estados para modales eliminados - ahora usamos páginas individuales

  // Funciones de modal eliminadas - ahora usamos páginas individuales

  const categories = [
    "all",
    "Testamentos",
    "Compraventa",
    "Poderes",
    "Sociedades",
    "Familia",
    "General",
  ];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <div className="text-lg font-bold text-foreground">
                Notaría Pública No. 3
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-foreground hover:text-primary transition-colors cursor-pointer"
              >
                Inicio
              </Link>
              <Link
                href="/servicios"
                className="text-foreground hover:text-primary transition-colors cursor-pointer"
              >
                Servicios
              </Link>
              <Link
                href="/nosotros"
                className="text-foreground hover:text-primary transition-colors cursor-pointer"
              >
                Nosotros
              </Link>
              <Link
                href="/contacto"
                className="text-foreground hover:text-primary transition-colors cursor-pointer"
              >
                Contacto
              </Link>
              <Link href="/citas" className="cursor-pointer">
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 cursor-pointer"
                >
                  Agendar Cita
                </Button>
              </Link>
            </div>

            <div className="md:hidden">
              <MobileNav currentPath="/blog" />
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-background to-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <Link
              href="/"
              className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Inicio
            </Link>

            <Badge variant="secondary" className="text-primary bg-primary/10">
              Centro de Conocimiento
            </Badge>

            <h1 className="text-4xl lg:text-5xl font-bold text-foreground text-balance">
              Blog <span className="text-primary">Educativo</span>
            </h1>

            <p className="text-xl text-muted-foreground text-pretty leading-relaxed max-w-3xl mx-auto">
              Artículos informativos, guías prácticas y respuestas a las
              preguntas más frecuentes sobre servicios notariales. Mantente
              informado con contenido de calidad de nuestros expertos.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar artículos..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? "bg-primary hover:bg-primary/90"
                      : ""
                  }
                >
                  {category === "all" ? "Todos" : category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="articles" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 bg-muted">
              <TabsTrigger
                value="articles"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
              >
                <BookOpen className="h-4 w-4" />
                Artículos
              </TabsTrigger>
              <TabsTrigger
                value="videos"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
              >
                <Play className="h-4 w-4" />
                Videos
              </TabsTrigger>
              <TabsTrigger
                value="faqs"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
              >
                <HelpCircle className="h-4 w-4" />
                Preguntas Frecuentes
              </TabsTrigger>
            </TabsList>

            {/* Articles Tab */}
            <TabsContent value="articles" className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="border-border hover:shadow-lg transition-all hover:scale-105 group"
                  >
                    <div className="aspect-video rounded-t-lg overflow-hidden">
                      <ArticleImage
                        category={post.category}
                        title={post.title}
                      />
                    </div>

                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant="secondary"
                          className="text-primary bg-primary/10"
                        >
                          {post.category}
                        </Badge>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </div>
                      </div>

                      <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </CardTitle>

                      <CardDescription className="line-clamp-3">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(post.date).toLocaleDateString("es-MX")}
                          </span>
                        </div>
                      </div>

                              <Link href={`/articulos/${post.slug}`}>
          <Button className="w-full mt-4 bg-primary hover:bg-primary/90 cursor-pointer">
            <FileText className="mr-2 h-4 w-4" />
            Leer Artículo
          </Button>
        </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No se encontraron artículos con los criterios seleccionados.
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Videos Tab */}
            <TabsContent value="videos" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Videos Educativos del Notario
                </h2>
                <p className="text-muted-foreground">
                  Explicaciones breves y claras sobre temas legales importantes
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videoPosts.map((video, index) => (
                          <Link href={`/videos/${video.slug}`}>
          <Card
            key={index}
            className="border-border hover:shadow-lg transition-all hover:scale-105 group cursor-pointer"
          >
                    <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-lg" />
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 to-slate-200/60 rounded-t-lg flex items-center justify-center">
                        <Play className="h-12 w-12 text-slate-600 bg-white rounded-full p-3 shadow-lg hover:scale-110 transition-transform" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>

                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant="secondary"
                          className="text-primary bg-primary/10"
                        >
                          {video.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {video.views} vistas
                        </span>
                      </div>

                      <CardTitle className="text-base group-hover:text-primary transition-colors">
                        {video.title}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
                ))}
              </div>
            </TabsContent>

            {/* FAQs Tab */}
            <TabsContent value="faqs" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Preguntas Frecuentes
                </h2>
                <p className="text-muted-foreground">
                  Respuestas a las dudas más comunes sobre servicios notariales
                </p>
              </div>

              <div className="space-y-8">
                {faqs.map((category, categoryIndex) => (
                  <Card key={categoryIndex} className="border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-primary" />
                        {category.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion
                        type="single"
                        collapsible
                        className="space-y-2"
                      >
                        {category.questions.map((faq, faqIndex) => (
                          <AccordionItem
                            key={faqIndex}
                            value={`${categoryIndex}-${faqIndex}`}
                            className="border border-border rounded-lg px-4"
                          >
                            <AccordionTrigger className="text-left hover:no-underline hover:text-primary">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Tienes Más Preguntas?</h2>
          <p className="text-xl mb-8 opacity-90">
            Nuestro equipo de expertos está listo para resolver todas tus dudas
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contacto">
              <Button
                size="lg"
                variant="secondary"
                className="bg-background text-foreground hover:bg-background/90"
              >
                Consulta Gratuita
              </Button>
            </Link>
            <Link href="/citas">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
              >
                Agendar Cita
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Modales eliminados - ahora usamos páginas individuales */}

    </div>
  );
}
