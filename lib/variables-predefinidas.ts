// Variables predefinidas para plantillas notariales
export interface VariablePredefinida {
  id: string;
  nombre: string;
  etiqueta: string;
  tipo: "texto" | "fecha" | "numero" | "moneda" | "direccion" | "persona";
  descripcion: string;
  categoria: string;
  obligatoria: boolean;
  valorPorDefecto?: string;
  validaciones: string[];
  icono: string;
}

// Variables predefinidas organizadas por categoría
export const VARIABLES_PREDEFINIDAS: VariablePredefinida[] = [
  // Variables generales
  {
    id: "fecha",
    nombre: "fecha",
    etiqueta: "Fecha",
    tipo: "fecha",
    descripcion: "Fecha actual del documento",
    categoria: "general",
    obligatoria: true,
    validaciones: ["fecha_valida"],
    icono: "Calendar"
  },
  {
    id: "hora",
    nombre: "hora",
    etiqueta: "Hora",
    tipo: "texto",
    descripcion: "Hora actual del documento",
    categoria: "general",
    obligatoria: true,
    validaciones: ["hora_valida"],
    icono: "Clock"
  },
  {
    id: "municipio",
    nombre: "municipio",
    etiqueta: "Municipio",
    tipo: "texto",
    descripcion: "Municipio donde se otorga el documento",
    categoria: "general",
    obligatoria: true,
    validaciones: ["texto_requerido"],
    icono: "MapPin"
  },
  {
    id: "estado",
    nombre: "estado",
    etiqueta: "Estado",
    tipo: "texto",
    descripcion: "Estado donde se otorga el documento",
    categoria: "general",
    obligatoria: true,
    validaciones: ["texto_requerido"],
    icono: "MapPin"
  },
  {
    id: "lugar",
    nombre: "lugar",
    etiqueta: "Lugar",
    tipo: "texto",
    descripcion: "Lugar específico del otorgamiento",
    categoria: "general",
    obligatoria: true,
    validaciones: ["texto_requerido"],
    icono: "MapPin"
  },

  // Variables de personas (testador, vendedor, comprador, etc.)
  {
    id: "testador.nombre",
    nombre: "testador.nombre",
    etiqueta: "Nombre del Testador",
    tipo: "texto",
    descripcion: "Nombre completo del testador",
    categoria: "personas",
    obligatoria: true,
    validaciones: ["texto_requerido", "solo_letras"],
    icono: "User"
  },
  {
    id: "testador.apellidoPaterno",
    nombre: "testador.apellidoPaterno",
    etiqueta: "Apellido Paterno",
    tipo: "texto",
    descripcion: "Apellido paterno del testador",
    categoria: "personas",
    obligatoria: true,
    validaciones: ["texto_requerido", "solo_letras"],
    icono: "User"
  },
  {
    id: "testador.apellidoMaterno",
    nombre: "testador.apellidoMaterno",
    etiqueta: "Apellido Materno",
    tipo: "texto",
    descripcion: "Apellido materno del testador",
    categoria: "personas",
    obligatoria: true,
    validaciones: ["texto_requerido", "solo_letras"],
    icono: "User"
  },
  {
    id: "testador.edad",
    nombre: "testador.edad",
    etiqueta: "Edad",
    tipo: "numero",
    descripcion: "Edad del testador",
    categoria: "personas",
    obligatoria: true,
    validaciones: ["numero_positivo", "edad_valida"],
    icono: "User"
  },
  {
    id: "testador.fechaNacimiento",
    nombre: "testador.fechaNacimiento",
    etiqueta: "Fecha de Nacimiento",
    tipo: "fecha",
    descripcion: "Fecha de nacimiento del testador",
    categoria: "personas",
    obligatoria: true,
    validaciones: ["fecha_valida", "fecha_pasada"],
    icono: "Calendar"
  },
  {
    id: "testador.lugarNacimiento",
    nombre: "testador.lugarNacimiento",
    etiqueta: "Lugar de Nacimiento",
    tipo: "texto",
    descripcion: "Lugar de nacimiento del testador",
    categoria: "personas",
    obligatoria: true,
    validaciones: ["texto_requerido"],
    icono: "MapPin"
  },
  {
    id: "testador.curp",
    nombre: "testador.curp",
    etiqueta: "CURP",
    tipo: "texto",
    descripcion: "CURP del testador",
    categoria: "personas",
    obligatoria: true,
    validaciones: ["curp_valida"],
    icono: "User"
  },
  {
    id: "testador.direccion",
    nombre: "testador.direccion",
    etiqueta: "Dirección",
    tipo: "direccion",
    descripcion: "Dirección completa del testador",
    categoria: "personas",
    obligatoria: true,
    validaciones: ["texto_requerido"],
    icono: "MapPin"
  },
  {
    id: "testador.identificacion",
    nombre: "testador.identificacion",
    etiqueta: "Identificación",
    tipo: "texto",
    descripcion: "Tipo y número de identificación",
    categoria: "personas",
    obligatoria: true,
    validaciones: ["texto_requerido"],
    icono: "User"
  },

  // Variables de vendedor (para compraventas)
  {
    id: "vendedor.nombre",
    nombre: "vendedor.nombre",
    etiqueta: "Nombre del Vendedor",
    tipo: "texto",
    descripcion: "Nombre completo del vendedor",
    categoria: "personas",
    obligatoria: true,
    validaciones: ["texto_requerido", "solo_letras"],
    icono: "User"
  },
  {
    id: "vendedor.apellidoPaterno",
    nombre: "vendedor.apellidoPaterno",
    etiqueta: "Apellido Paterno del Vendedor",
    tipo: "texto",
    descripcion: "Apellido paterno del vendedor",
    categoria: "personas",
    obligatoria: true,
    validaciones: ["texto_requerido", "solo_letras"],
    icono: "User"
  },
  {
    id: "vendedor.apellidoMaterno",
    nombre: "vendedor.apellidoMaterno",
    etiqueta: "Apellido Materno del Vendedor",
    tipo: "texto",
    descripcion: "Apellido materno del vendedor",
    categoria: "personas",
    obligatoria: true,
    validaciones: ["texto_requerido", "solo_letras"],
    icono: "User"
  },
  {
    id: "vendedor.direccion",
    nombre: "vendedor.direccion",
    etiqueta: "Dirección del Vendedor",
    tipo: "direccion",
    descripcion: "Dirección completa del vendedor",
    categoria: "personas",
    obligatoria: true,
    validaciones: ["texto_requerido"],
    icono: "MapPin"
  },
  {
    id: "vendedor.identificacion",
    nombre: "vendedor.identificacion",
    etiqueta: "Identificación del Vendedor",
    tipo: "texto",
    descripcion: "Tipo y número de identificación del vendedor",
    categoria: "personas",
    obligatoria: true,
    validaciones: ["texto_requerido"],
    icono: "User"
  },

  // Variables de comprador (para compraventas)
  {
    id: "comprador.nombre",
    nombre: "comprador.nombre",
    etiqueta: "Nombre del Comprador",
    tipo: "texto",
    descripcion: "Nombre completo del comprador",
    categoria: "personas",
    obligatoria: true,
    validaciones: ["texto_requerido", "solo_letras"],
    icono: "User"
  },
  {
    id: "comprador.apellidoPaterno",
    nombre: "comprador.apellidoPaterno",
    etiqueta: "Apellido Paterno del Comprador",
    tipo: "texto",
    descripcion: "Apellido paterno del comprador",
    categoria: "personas",
    obligatoria: true,
    validaciones: ["texto_requerido", "solo_letras"],
    icono: "User"
  },
  {
    id: "comprador.apellidoMaterno",
    nombre: "comprador.apellidoMaterno",
    etiqueta: "Apellido Materno del Comprador",
    tipo: "texto",
    descripcion: "Apellido materno del comprador",
    categoria: "personas",
    obligatoria: true,
    validaciones: ["texto_requerido", "solo_letras"],
    icono: "User"
  },
  {
    id: "comprador.direccion",
    nombre: "comprador.direccion",
    etiqueta: "Dirección del Comprador",
    tipo: "direccion",
    descripcion: "Dirección completa del comprador",
    categoria: "personas",
    obligatoria: true,
    validaciones: ["texto_requerido"],
    icono: "MapPin"
  },
  {
    id: "comprador.identificacion",
    nombre: "comprador.identificacion",
    etiqueta: "Identificación del Comprador",
    tipo: "texto",
    descripcion: "Tipo y número de identificación del comprador",
    categoria: "personas",
    obligatoria: true,
    validaciones: ["texto_requerido"],
    icono: "User"
  },

  // Variables de inmuebles
  {
    id: "inmueble.direccion",
    nombre: "inmueble.direccion",
    etiqueta: "Dirección del Inmueble",
    tipo: "direccion",
    descripcion: "Dirección completa del inmueble",
    categoria: "inmuebles",
    obligatoria: true,
    validaciones: ["texto_requerido"],
    icono: "Building"
  },
  {
    id: "inmueble.superficie",
    nombre: "inmueble.superficie",
    etiqueta: "Superficie",
    tipo: "numero",
    descripcion: "Superficie del inmueble en metros cuadrados",
    categoria: "inmuebles",
    obligatoria: true,
    validaciones: ["numero_positivo"],
    icono: "Building"
  },
  {
    id: "inmueble.folio",
    nombre: "inmueble.folio",
    etiqueta: "Folio",
    tipo: "texto",
    descripcion: "Folio del Registro Público de la Propiedad",
    categoria: "inmuebles",
    obligatoria: true,
    validaciones: ["texto_requerido"],
    icono: "FileText"
  },

  // Variables de precios
  {
    id: "precio.numero",
    nombre: "precio.numero",
    etiqueta: "Precio (Número)",
    tipo: "moneda",
    descripcion: "Precio en números",
    categoria: "precios",
    obligatoria: true,
    validaciones: ["moneda_valida"],
    icono: "DollarSign"
  },
  {
    id: "precio.letra",
    nombre: "precio.letra",
    etiqueta: "Precio (Letra)",
    tipo: "texto",
    descripcion: "Precio escrito en letra",
    categoria: "precios",
    obligatoria: true,
    validaciones: ["texto_requerido"],
    icono: "DollarSign"
  },

  // Variables de notario
  {
    id: "notario.nombre",
    nombre: "notario.nombre",
    etiqueta: "Nombre del Notario",
    tipo: "texto",
    descripcion: "Nombre completo del notario",
    categoria: "notario",
    obligatoria: true,
    validaciones: ["texto_requerido"],
    icono: "Scale"
  },
  {
    id: "notario.numero",
    nombre: "notario.numero",
    etiqueta: "Número de Notario",
    tipo: "numero",
    descripcion: "Número de notario público",
    categoria: "notario",
    obligatoria: true,
    validaciones: ["numero_positivo"],
    icono: "Scale"
  },
  {
    id: "notario.cedula",
    nombre: "notario.cedula",
    etiqueta: "Cédula del Notario",
    tipo: "texto",
    descripcion: "Número de cédula profesional del notario",
    categoria: "notario",
    obligatoria: true,
    validaciones: ["texto_requerido"],
    icono: "Scale"
  },

  // Variables de testigos
  {
    id: "testigo1.nombre",
    nombre: "testigo1.nombre",
    etiqueta: "Nombre del Testigo 1",
    tipo: "texto",
    descripcion: "Nombre completo del primer testigo",
    categoria: "testigos",
    obligatoria: true,
    validaciones: ["texto_requerido"],
    icono: "User"
  },
  {
    id: "testigo1.identificacion",
    nombre: "testigo1.identificacion",
    etiqueta: "Identificación del Testigo 1",
    tipo: "texto",
    descripcion: "Identificación del primer testigo",
    categoria: "testigos",
    obligatoria: true,
    validaciones: ["texto_requerido"],
    icono: "User"
  },
  {
    id: "testigo2.nombre",
    nombre: "testigo2.nombre",
    etiqueta: "Nombre del Testigo 2",
    tipo: "texto",
    descripcion: "Nombre completo del segundo testigo",
    categoria: "testigos",
    obligatoria: true,
    validaciones: ["texto_requerido"],
    icono: "User"
  },
  {
    id: "testigo2.identificacion",
    nombre: "testigo2.identificacion",
    etiqueta: "Identificación del Testigo 2",
    tipo: "texto",
    descripcion: "Identificación del segundo testigo",
    categoria: "testigos",
    obligatoria: true,
    validaciones: ["texto_requerido"],
    icono: "User"
  }
];

// Función para obtener variables por categoría
export const getVariablesPorCategoria = (categoria: string): VariablePredefinida[] => {
  return VARIABLES_PREDEFINIDAS.filter(variable => variable.categoria === categoria);
};

// Función para obtener todas las categorías de variables
export const getCategoriasVariables = (): string[] => {
  const categorias = [...new Set(VARIABLES_PREDEFINIDAS.map(v => v.categoria))];
  return categorias;
};

// Función para obtener variable por ID
export const getVariableById = (id: string): VariablePredefinida | undefined => {
  return VARIABLES_PREDEFINIDAS.find(variable => variable.id === id);
};

// Función para obtener variables por tipo de plantilla
export const getVariablesPorTipoPlantilla = (tipo: string): VariablePredefinida[] => {
  switch (tipo) {
    case "testamento":
      return VARIABLES_PREDEFINIDAS.filter(v => 
        v.categoria === "general" || 
        v.categoria === "personas" || 
        v.categoria === "notario" || 
        v.categoria === "testigos" ||
        v.id.includes("testador")
      );
    case "compraventa":
      return VARIABLES_PREDEFINIDAS.filter(v => 
        v.categoria === "general" || 
        v.categoria === "personas" || 
        v.categoria === "inmuebles" || 
        v.categoria === "precios" || 
        v.categoria === "notario" ||
        v.id.includes("vendedor") ||
        v.id.includes("comprador") ||
        v.id.includes("inmueble")
      );
    default:
      return VARIABLES_PREDEFINIDAS;
  }
};
