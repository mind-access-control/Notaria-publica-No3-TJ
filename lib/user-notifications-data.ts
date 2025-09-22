export interface UserNotification {
  id: string;
  tipo:
    | "revision_expediente"
    | "documento_listo_firma"
    | "cita_agendada"
    | "recordatorio_cita"
    | "documento_completado";
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  solicitudId?: string;
  citaId?: string;
  acciones?: {
    texto: string;
    accion: "agendar_cita" | "ver_documento" | "contactar_licenciado";
  }[];
}

export interface CitaDisponible {
  id: string;
  fecha: string;
  hora: string;
  sala: string;
  duracion: number;
  disponible: boolean;
}

export const userNotifications: UserNotification[] = [
  {
    id: "notif-1",
    tipo: "revision_expediente",
    titulo: "Estatus del Documento",
    mensaje:
      "Tu documento está siendo revisado por nuestro equipo legal. Te notificaremos cuando esté listo para firma.",
    fecha: "2025-01-09T10:30:00",
    leida: false,
    solicitudId: "NT3-2025-001",
    acciones: [
      {
        texto: "Ver Progreso",
        accion: "ver_documento",
      },
    ],
  },
  {
    id: "notif-2",
    tipo: "documento_listo_firma",
    titulo: "Cita Disponible",
    mensaje:
      "¡Tu documento está listo! Puedes agendar tu cita para la firma. Selecciona el horario que mejor te convenga.",
    fecha: "2025-01-09T14:15:00",
    leida: false,
    solicitudId: "NT3-2025-001",
    acciones: [
      {
        texto: "Agendar Cita",
        accion: "agendar_cita",
      },
    ],
  },
];

export const citasDisponibles: CitaDisponible[] = [
  {
    id: "cita-1",
    fecha: "2024-12-15",
    hora: "09:00",
    sala: "Sala A - Notaría Principal",
    duracion: 60,
    disponible: true,
  },
  {
    id: "cita-2",
    fecha: "2024-12-15",
    hora: "11:30",
    sala: "Sala B - Notaría Principal",
    duracion: 60,
    disponible: true,
  },
  {
    id: "cita-3",
    fecha: "2024-12-15",
    hora: "15:00",
    sala: "Sala C - Notaría Principal",
    duracion: 60,
    disponible: true,
  },
  {
    id: "cita-4",
    fecha: "2024-12-16",
    hora: "10:00",
    sala: "Sala A - Notaría Principal",
    duracion: 60,
    disponible: true,
  },
  {
    id: "cita-5",
    fecha: "2024-12-16",
    hora: "14:00",
    sala: "Sala B - Notaría Principal",
    duracion: 60,
    disponible: true,
  },
  {
    id: "cita-6",
    fecha: "2024-12-17",
    hora: "09:30",
    sala: "Sala A - Notaría Principal",
    duracion: 60,
    disponible: true,
  },
];

export function getUserNotifications(userId: string): UserNotification[] {
  // En un sistema real, esto vendría de una API
  return userNotifications.filter((notif) => !notif.leida);
}

export function getCitasDisponibles(
  fechaInicio?: string,
  limite: number = 3,
  offset: number = 0
): CitaDisponible[] {
  const hoy = new Date();

  // Crear citas dinámicas basadas en la fecha actual
  const citasDinamicas: CitaDisponible[] = [
    // Primeras 3 opciones (offset 0)
    {
      id: "cita-hoy-manana",
      fecha: hoy.toISOString().split("T")[0],
      hora: "09:00",
      sala: "Sala A - Notaría Principal",
      duracion: 60,
      disponible: true,
    },
    {
      id: "cita-hoy-tarde",
      fecha: hoy.toISOString().split("T")[0],
      hora: "15:00",
      sala: "Sala B - Notaría Principal",
      duracion: 60,
      disponible: true,
    },
    {
      id: "cita-manana-manana",
      fecha: new Date(hoy.getTime() + 1 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      hora: "10:00",
      sala: "Sala C - Notaría Principal",
      duracion: 60,
      disponible: true,
    },
    // Segundas 3 opciones (offset 3)
    {
      id: "cita-manana-tarde",
      fecha: new Date(hoy.getTime() + 1 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      hora: "14:00",
      sala: "Sala A - Notaría Principal",
      duracion: 60,
      disponible: true,
    },
    {
      id: "cita-pasado-manana",
      fecha: new Date(hoy.getTime() + 2 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      hora: "11:00",
      sala: "Sala B - Notaría Principal",
      duracion: 60,
      disponible: true,
    },
    {
      id: "cita-pasado-manana-tarde",
      fecha: new Date(hoy.getTime() + 2 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      hora: "16:00",
      sala: "Sala C - Notaría Principal",
      duracion: 60,
      disponible: true,
    },
    // Terceras 3 opciones (offset 6)
    {
      id: "cita-tres-dias",
      fecha: new Date(hoy.getTime() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      hora: "08:30",
      sala: "Sala A - Notaría Principal",
      duracion: 60,
      disponible: true,
    },
    {
      id: "cita-tres-dias-tarde",
      fecha: new Date(hoy.getTime() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      hora: "13:30",
      sala: "Sala B - Notaría Principal",
      duracion: 60,
      disponible: true,
    },
    {
      id: "cita-cuatro-dias",
      fecha: new Date(hoy.getTime() + 4 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      hora: "12:00",
      sala: "Sala C - Notaría Principal",
      duracion: 60,
      disponible: true,
    },
  ];

  // Calcular el rango de citas basado en el offset
  const inicio = offset * 3;
  const fin = inicio + limite;

  return citasDinamicas.slice(inicio, fin);
}

export function agendarCita(
  citaId: string,
  userId: string,
  solicitudId: string
): Promise<boolean> {
  return new Promise((resolve) => {
    // Simular proceso de agendamiento
    setTimeout(() => {
      // Marcar cita como no disponible
      const cita = citasDisponibles.find((c) => c.id === citaId);
      if (cita) {
        cita.disponible = false;
      }

      // Crear notificación de confirmación
      const fechaCita = cita?.fecha || new Date().toISOString().split("T")[0];
      const horaCita = cita?.hora || "09:00";

      const nuevaNotificacion: UserNotification = {
        id: `cita-confirmada-${Date.now()}`,
        tipo: "cita_agendada",
        titulo: "Cita Agendada Exitosamente",
        mensaje: `Tu cita ha sido agendada para el ${new Date(
          fechaCita
        ).toLocaleDateString("es-MX", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })} a las ${horaCita}. Te enviaremos un recordatorio por correo.`,
        fecha: new Date().toISOString(),
        leida: false,
        solicitudId,
        citaId,
      };

      userNotifications.unshift(nuevaNotificacion);
      resolve(true);
    }, 1000);
  });
}
