export interface Cita {
  id: string;
  numeroSolicitud: string;
  cliente: {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
  };
  tipoTramite: string;
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:MM
  duracion: number; // en minutos
  sala: string;
  estado: "PROGRAMADA" | "EN_CURSO" | "COMPLETADA" | "CANCELADA";
  notas?: string;
  abogadoId: string;
}

// Función para generar hora actual + minutos
const getHoraActualMasMinutos = (minutos: number): string => {
  const ahora = new Date();
  const nuevaHora = new Date(ahora.getTime() + minutos * 60 * 1000);
  const horas = nuevaHora.getHours().toString().padStart(2, "0");
  const mins = nuevaHora.getMinutes().toString().padStart(2, "0");
  return `${horas}:${mins}`;
};

// Array para almacenar todas las citas
export const citas: Cita[] = [
  {
    id: "CITA-001",
    numeroSolicitud: "NT3-2025-00123",
    cliente: {
      id: "cliente-1",
      nombre: "María González López",
      email: "maria.gonzalez@email.com",
      telefono: "664-123-4567",
    },
    tipoTramite: "Testamento Público Abierto",
    fecha: "2025-09-11", // Hoy
    hora: getHoraActualMasMinutos(15), // En 15 minutos (PRÓXIMA)
    duracion: 60,
    sala: "Sala de Audiencias A",
    estado: "PROGRAMADA",
    notas: "Revisión de documentos y firma del testamento",
    abogadoId: "notario-1",
  },
  {
    id: "CITA-002",
    numeroSolicitud: "NT3-2025-00124",
    cliente: {
      id: "cliente-2",
      nombre: "Carlos Rodríguez Martínez",
      email: "carlos.rodriguez@email.com",
      telefono: "664-234-5678",
    },
    tipoTramite: "Escritura de Compraventa",
    fecha: "2025-09-11", // Hoy
    hora: getHoraActualMasMinutos(90), // En 1.5 horas
    duracion: 90,
    sala: "Sala de Audiencias B",
    estado: "PROGRAMADA",
    notas: "Firma de escritura de compraventa de inmueble",
    abogadoId: "notario-1",
  },
  {
    id: "CITA-003",
    numeroSolicitud: "NT3-2025-00125",
    cliente: {
      id: "cliente-3",
      nombre: "Ana Patricia Herrera",
      email: "ana.herrera@email.com",
      telefono: "664-345-6789",
    },
    tipoTramite: "Poder Notarial",
    fecha: "2025-09-12", // Mañana
    hora: "10:00",
    duracion: 45,
    sala: "Sala de Audiencias A",
    estado: "PROGRAMADA",
    notas: "Otorgamiento de poder notarial para gestión de bienes",
    abogadoId: "notario-1",
  },
  {
    id: "CITA-004",
    numeroSolicitud: "NT3-2025-00126",
    cliente: {
      id: "cliente-4",
      nombre: "Roberto Silva Torres",
      email: "roberto.silva@email.com",
      telefono: "664-456-7890",
    },
    tipoTramite: "Testamento Público Abierto",
    fecha: "2025-09-12", // Mañana
    hora: "14:00",
    duracion: 60,
    sala: "Sala de Audiencias C",
    estado: "PROGRAMADA",
    notas: "Revisión y firma de testamento",
    abogadoId: "notario-1",
  },
  {
    id: "CITA-005",
    numeroSolicitud: "NT3-2025-00127",
    cliente: {
      id: "cliente-5",
      nombre: "Laura Méndez García",
      email: "laura.mendez@email.com",
      telefono: "664-567-8901",
    },
    tipoTramite: "Escritura de Donación",
    fecha: "2025-09-13", // Pasado mañana
    hora: "15:30",
    duracion: 75,
    sala: "Sala de Audiencias B",
    estado: "PROGRAMADA",
    notas: "Firma de escritura de donación de vehículo",
    abogadoId: "notario-1",
  },
  {
    id: "CITA-006",
    numeroSolicitud: "NT3-2025-00128",
    cliente: {
      id: "cliente-6",
      nombre: "Miguel Ángel Pérez",
      email: "miguel.perez@email.com",
      telefono: "664-678-9012",
    },
    tipoTramite: "Poder Notarial",
    fecha: "2025-09-10", // Ayer (completada)
    hora: "16:00",
    duracion: 45,
    sala: "Sala de Audiencias A",
    estado: "COMPLETADA",
    notas: "Poder notarial para representación legal",
    abogadoId: "notario-1",
  },
];

// Función para obtener citas de un abogado
export const getCitasAbogado = async (
  abogadoId: string,
  fecha?: string
): Promise<Cita[]> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 300));

  let citasAbogado = citas.filter((cita) => cita.abogadoId === abogadoId);

  // Si se especifica una fecha, filtrar por esa fecha
  if (fecha) {
    citasAbogado = citasAbogado.filter((cita) => cita.fecha === fecha);
  }

  // Ordenar por fecha y hora
  citasAbogado.sort((a, b) => {
    const fechaA = new Date(`${a.fecha} ${a.hora}`);
    const fechaB = new Date(`${b.fecha} ${b.hora}`);
    return fechaA.getTime() - fechaB.getTime();
  });

  return citasAbogado;
};

// Función para obtener citas del día actual
export const getCitasHoy = async (abogadoId: string): Promise<Cita[]> => {
  const hoy = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  return getCitasAbogado(abogadoId, hoy);
};

// Función para obtener próximas citas (próximas 2 horas)
export const getProximasCitas = async (abogadoId: string): Promise<Cita[]> => {
  const ahora = new Date();
  const en2Horas = new Date(ahora.getTime() + 2 * 60 * 60 * 1000);

  const citasAbogado = await getCitasAbogado(abogadoId);

  return citasAbogado.filter((cita) => {
    const fechaCita = new Date(`${cita.fecha} ${cita.hora}`);
    return (
      fechaCita >= ahora &&
      fechaCita <= en2Horas &&
      cita.estado === "PROGRAMADA"
    );
  });
};
