// Categorías de formatos notariales
export interface CategoriaFormato {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  color: string;
  tiposCompatibles: string[];
}

// Tipos de formatos notariales
export interface TipoFormato {
  id: string;
  nombre: string;
  descripcion: string;
  categoriasCompatibles: string[];
}

export const CATEGORIAS_FORMATOS: CategoriaFormato[] = [
  {
    id: "sucesiones",
    nombre: "Sucesiones",
    descripcion: "Testamentos, herencias y sucesiones",
    icono: "Scale",
    color: "bg-purple-100 text-purple-800",
    tiposCompatibles: ["testamento", "adjudicacion_herencia", "declaratoria_herederos"]
  },
  {
    id: "inmobiliaria",
    nombre: "Inmobiliaria",
    descripcion: "Compraventas, arrendamientos y actos inmobiliarios",
    icono: "Building",
    color: "bg-blue-100 text-blue-800",
    tiposCompatibles: ["compraventa", "donacion_inmueble", "hipoteca"]
  },
  {
    id: "mercantil",
    nombre: "Mercantil",
    descripcion: "Constitución de sociedades, contratos mercantiles",
    icono: "FileText",
    color: "bg-green-100 text-green-800",
    tiposCompatibles: ["constitucion_sociedad", "acta_asamblea", "poder_mercantil", "fusion_sociedades"]
  },
  {
    id: "civil",
    nombre: "Civil",
    descripcion: "Poderes, divorcios, reconocimientos",
    icono: "User",
    color: "bg-orange-100 text-orange-800",
    tiposCompatibles: ["poder_civil", "arrendamiento", "comodato", "contrato_mutuo", "poder_mercantil"]
  },
  {
    id: "familia",
    nombre: "Actos Familiares",
    descripcion: "Divorcios, reconocimientos de hijos, adopciones",
    icono: "Heart",
    color: "bg-pink-100 text-pink-800",
    tiposCompatibles: ["divorcio", "reconocimiento_hijos", "adopcion"]
  },
  {
    id: "otros",
    nombre: "Otros Servicios",
    descripcion: "Reconocimiento de firmas, certificaciones, protocolizaciones",
    icono: "Settings",
    color: "bg-gray-100 text-gray-800",
    tiposCompatibles: ["reconocimiento_firmas", "certificacion_copias", "protocolizacion"]
  }
];

// Tipos de formatos con sus categorías compatibles
export const TIPOS_FORMATOS: TipoFormato[] = [
  {
    id: "testamento",
    nombre: "Testamento",
    descripcion: "Testamento público abierto",
    categoriasCompatibles: ["sucesiones"]
  },
  {
    id: "adjudicacion_herencia",
    nombre: "Adjudicación de herencia",
    descripcion: "Adjudicación de bienes hereditarios",
    categoriasCompatibles: ["sucesiones"]
  },
  {
    id: "declaratoria_herederos",
    nombre: "Declaratoria de herederos",
    descripcion: "Declaratoria de herederos legítimos",
    categoriasCompatibles: ["sucesiones"]
  },
  {
    id: "compraventa",
    nombre: "Compraventa",
    descripcion: "Compraventa de inmuebles",
    categoriasCompatibles: ["inmobiliaria"]
  },
  {
    id: "donacion_inmueble",
    nombre: "Donación de inmueble",
    descripcion: "Donación de bienes inmuebles",
    categoriasCompatibles: ["inmobiliaria"]
  },
  {
    id: "hipoteca",
    nombre: "Hipoteca",
    descripcion: "Contrato de hipoteca",
    categoriasCompatibles: ["inmobiliaria"]
  },
  {
    id: "constitucion_sociedad",
    nombre: "Constitución de sociedad",
    descripcion: "Constitución de sociedades mercantiles",
    categoriasCompatibles: ["mercantil"]
  },
  {
    id: "acta_asamblea",
    nombre: "Acta de asamblea",
    descripcion: "Acta de asamblea de socios",
    categoriasCompatibles: ["mercantil"]
  },
  {
    id: "poder_mercantil",
    nombre: "Poder mercantil",
    descripcion: "Poder para actos mercantiles",
    categoriasCompatibles: ["mercantil", "civil"]
  },
  {
    id: "fusion_sociedades",
    nombre: "Fusión de sociedades",
    descripcion: "Fusión de sociedades mercantiles",
    categoriasCompatibles: ["mercantil"]
  },
  {
    id: "poder_civil",
    nombre: "Poder civil",
    descripcion: "Poder para actos civiles",
    categoriasCompatibles: ["civil"]
  },
  {
    id: "arrendamiento",
    nombre: "Arrendamiento",
    descripcion: "Contrato de arrendamiento",
    categoriasCompatibles: ["civil"]
  },
  {
    id: "comodato",
    nombre: "Comodato",
    descripcion: "Contrato de comodato",
    categoriasCompatibles: ["civil"]
  },
  {
    id: "contrato_mutuo",
    nombre: "Contrato de mutuo",
    descripcion: "Contrato de mutuo o préstamo",
    categoriasCompatibles: ["civil"]
  },
  {
    id: "divorcio",
    nombre: "Divorcio",
    descripcion: "Divorcio por mutuo consentimiento",
    categoriasCompatibles: ["familia"]
  },
  {
    id: "reconocimiento_hijos",
    nombre: "Reconocimiento de hijos",
    descripcion: "Reconocimiento de paternidad/maternidad",
    categoriasCompatibles: ["familia"]
  },
  {
    id: "adopcion",
    nombre: "Adopción",
    descripcion: "Proceso de adopción",
    categoriasCompatibles: ["familia"]
  },
  {
    id: "reconocimiento_firmas",
    nombre: "Reconocimiento de firmas",
    descripcion: "Reconocimiento de firmas y rúbricas",
    categoriasCompatibles: ["otros"]
  },
  {
    id: "certificacion_copias",
    nombre: "Certificación de copias",
    descripcion: "Certificación de copias de documentos",
    categoriasCompatibles: ["otros"]
  },
  {
    id: "protocolizacion",
    nombre: "Protocolización",
    descripcion: "Protocolización de documentos",
    categoriasCompatibles: ["otros"]
  }
];

// Función para obtener categoría por ID
export const getCategoriaById = (id: string): CategoriaFormato | undefined => {
  return CATEGORIAS_FORMATOS.find(categoria => categoria.id === id);
};

// Función para obtener categoría por nombre
export const getCategoriaByNombre = (nombre: string): CategoriaFormato | undefined => {
  return CATEGORIAS_FORMATOS.find(categoria => categoria.nombre === nombre);
};

// Función para obtener tipo por ID
export const getTipoById = (id: string): TipoFormato | undefined => {
  return TIPOS_FORMATOS.find(tipo => tipo.id === id);
};

// Función para obtener tipo por nombre
export const getTipoByNombre = (nombre: string): TipoFormato | undefined => {
  return TIPOS_FORMATOS.find(tipo => tipo.nombre === nombre);
};

// Función para obtener todas las categorías
export const getAllCategorias = (): CategoriaFormato[] => {
  return CATEGORIAS_FORMATOS;
};

// Función para obtener todos los tipos
export const getAllTipos = (): TipoFormato[] => {
  return TIPOS_FORMATOS;
};

// Función para obtener categorías compatibles con un tipo
export const getCategoriasCompatiblesConTipo = (tipoId: string): CategoriaFormato[] => {
  const tipo = getTipoById(tipoId);
  if (!tipo) return [];
  
  return CATEGORIAS_FORMATOS.filter(categoria => 
    tipo.categoriasCompatibles.includes(categoria.id)
  );
};

// Función para obtener tipos compatibles con una categoría
export const getTiposCompatiblesConCategoria = (categoriaId: string): TipoFormato[] => {
  const categoria = getCategoriaById(categoriaId);
  if (!categoria) return [];
  
  return TIPOS_FORMATOS.filter(tipo => 
    categoria.tiposCompatibles.includes(tipo.id)
  );
};

// Función para obtener categorías compatibles con un tipo por nombre
export const getCategoriasCompatiblesConTipoNombre = (tipoNombre: string): CategoriaFormato[] => {
  const tipo = getTipoByNombre(tipoNombre);
  if (!tipo) return [];
  
  return CATEGORIAS_FORMATOS.filter(categoria => 
    tipo.categoriasCompatibles.includes(categoria.id)
  );
};

// Función para obtener tipos compatibles con una categoría por nombre
export const getTiposCompatiblesConCategoriaNombre = (categoriaNombre: string): TipoFormato[] => {
  const categoria = getCategoriaByNombre(categoriaNombre);
  if (!categoria) return [];
  
  return TIPOS_FORMATOS.filter(tipo => 
    categoria.tiposCompatibles.includes(tipo.id)
  );
};
