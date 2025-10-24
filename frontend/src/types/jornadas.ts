// Tipos para la gestión de jornadas de turnos

export interface Jornada {
  id: string;
  fechaJornada: string; // formato YYYY-MM-DD
  nombreJornada: string;
  datosTurnos: TurnoJornada[];
  totalTurnos: number;
  observaciones?: string;
  activa: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  usuarioCreacion?: string;
  usuarioActualizacion?: string;
}

export interface JornadaBackend {
  id: string;
  fechaJornada: Date;
  nombreJornada: string;
  datosTurnos: any; // JSON en backend
  totalTurnos: number;
  observaciones?: string;
  activa: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  usuarioCreacion?: string;
  usuarioActualizacion?: string;
}

// Datos de turno simplificados para almacenar en jornada
export interface TurnoJornada {
  id: string;
  cancha: string;
  numeroCancha?: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  socio: string;
  caddie?: string;
  precio: number;
  estado: string;
  observaciones?: string;
  fechaCreacion: string;
}

export interface CreateJornadaDto {
  fechaJornada: string;
  nombreJornada: string;
  datosTurnos: TurnoJornada[];
  totalTurnos?: number;
  observaciones?: string;
  activa?: boolean;
  usuarioCreacion?: string;
}

export interface UpdateJornadaDto {
  fechaJornada?: string;
  nombreJornada?: string;
  datosTurnos?: TurnoJornada[];
  totalTurnos?: number;
  observaciones?: string;
  activa?: boolean;
  usuarioActualizacion?: string;
}

export interface JornadaFilters {
  fechaInicio?: string;
  fechaFin?: string;
  busqueda?: string;
  activa?: boolean;
  page?: number;
  limit?: number;
}

export interface JornadasResponse {
  jornadas: Jornada[];
  total: number;
  totalPages: number;
}

export interface JornadaEstadisticas {
  totalJornadas: number;
  jornadasActivas: number;
  jornadasInactivas: number;
  totalTurnosGuardados: number;
  promedioTurnosPorJornada: number;
}

// Estados para la UI
export interface JornadaFormData {
  fechaJornada: string;
  nombreJornada: string;
  observaciones: string;
  activa: boolean;
}

export interface ModalState {
  crear: {
    isOpen: boolean;
  };
  editar: {
    isOpen: boolean;
    jornada: Jornada | null;
  };
  eliminar: {
    isOpen: boolean;
    jornada: Jornada | null;
  };
  ver: {
    isOpen: boolean;
    jornada: Jornada | null;
  };
}

// Utilidades para trabajar con jornadas
export const generateJornadaName = (fecha: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  };
  const fechaFormateada = fecha.toLocaleDateString('es-ES', options);
  return `Jornada ${fechaFormateada}`;
};

export const formatJornadaDate = (fecha: string | Date): string => {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

export const formatTurnosCount = (total: number): string => {
  if (total === 0) return 'Sin turnos';
  if (total === 1) return '1 turno';
  return `${total} turnos`;
};