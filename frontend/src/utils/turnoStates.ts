// Utilidades para manejo de estados de turnos - Simplificado a 2 estados

export const EstadoTurno = {
  EN_PROGRESO: 'en_progreso',
  COMPLETADO: 'completado'
} as const;

export type EstadoTurnoType = typeof EstadoTurno[keyof typeof EstadoTurno];

/**
 * Calcula el estado automático de un turno basado en la fecha y hora actual
 * Solo hay 2 estados: en_progreso (desde que se crea hasta que termine) y completado (cuando ya pasó el tiempo)
 */
export const calcularEstadoAutomatico = (
  fecha: string,
  horaInicio: string,
  horaFin: string,
  estadoActual?: string
): EstadoTurnoType => {
  const ahora = new Date();
  
  // Parsear la fecha del turno
  let fechaTurno: Date;
  if (fecha.includes('T')) {
    fechaTurno = new Date(fecha);
  } else {
    fechaTurno = new Date(fecha + 'T00:00:00');
  }
  
  // Crear fecha/hora de fin del turno
  const [horasFin, minutosFin] = horaFin.split(':').map(Number);
  const finTurno = new Date(fechaTurno.getFullYear(), fechaTurno.getMonth(), fechaTurno.getDate(), horasFin, minutosFin, 0, 0);
  
  // Si ya pasó la hora de fin, está completado
  if (ahora > finTurno) {
    return EstadoTurno.COMPLETADO;
  }
  
  // Si no ha terminado, está en progreso
  return EstadoTurno.EN_PROGRESO;
};

/**
 * Obtiene el texto amigable para mostrar el estado
 */
export const getEstadoTexto = (estado: string): string => {
  switch (estado) {
    case EstadoTurno.EN_PROGRESO:
      return 'En Progreso';
    case EstadoTurno.COMPLETADO:
      return 'Completado';
    default:
      return 'Desconocido';
  }
};

/**
 * Obtiene el color para mostrar el estado
 */
export const getEstadoColor = (estado: string): string => {
  switch (estado) {
    case EstadoTurno.EN_PROGRESO:
      return 'text-blue-400';
    case EstadoTurno.COMPLETADO:
      return 'text-green-400';
    default:
      return 'text-gray-400';
  }
};