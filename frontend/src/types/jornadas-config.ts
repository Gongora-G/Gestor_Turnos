// 📅 Tipos para el Sistema de Jornadas Configurables
// Permite a cada club configurar sus propias jornadas con horarios personalizados

export interface HorarioJornada {
  horaInicio: string;    // "07:00"
  horaFin: string;       // "12:00"
}

export interface JornadaConfig {
  id: string;
  nombre: string;        // "Jornada A", "Mañana", "Tarde", etc.
  descripcion?: string;  // "Jornada de la mañana"
  horario: HorarioJornada;
  activa: boolean;       // Si está habilitada
  orden: number;         // Orden de rotación (1, 2, 3...)
  diasSemana: DiaSemana[]; // Días que aplica esta jornada
  color?: string;        // Color para UI (#3B82F6)
}

export interface ConfiguracionJornadas {
  id: string;
  clubId: string;
  jornadas: JornadaConfig[];
  jornadaActual?: string; // ID de la jornada activa
  rotacionAutomatica: boolean; // Si cambia automáticamente por horario
  configuradoPor: string; // ID del usuario que configuró
  fechaConfiguracion: string;
  fechaActualizacion?: string;
}

export interface RegistroJornadaDiaria {
  id: string;
  clubId: string;
  jornadaConfigId: string; // Referencia a JornadaConfig
  fecha: string;           // "2025-10-28"
  horaInicio: string;      // "07:00"
  horaFin?: string;        // "12:00" (cuando se guarda)
  turnosRegistrados: TurnoJornada[];
  estadisticas: EstadisticasJornada;
  estado: EstadoJornada;
  creadoPor: string;       // ID del usuario
  fechaCreacion: string;
  fechaCierre?: string;
}

export interface TurnoJornada {
  id: string;
  socioNombre: string;
  cancha: number;
  horaInicio: string;
  horaFin?: string;
  duracion?: number; // minutos
  tipoMembresia: string;
  estado: 'activo' | 'completado' | 'cancelado';
}

export interface EstadisticasJornada {
  totalTurnos: number;
  turnosCompletados: number;
  turnosCancelados: number;
  canchasMasUsadas: number[];
  duracionPromedio: number; // minutos
  ingresosTotales: number;
}

export type EstadoJornada = 'activa' | 'completada' | 'cancelada';

export type DiaSemana = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';

// 🔄 Para la rotación automática de jornadas
export interface SiguienteJornada {
  jornadaActual: JornadaConfig | null;
  siguienteJornada: JornadaConfig | null;
  tiempoRestante?: number; // minutos hasta el cambio
  cambioAutomatico: boolean;
}

// 📊 Para reportes de jornadas
export interface ReporteJornadas {
  periodo: {
    fechaInicio: string;
    fechaFin: string;
  };
  totalJornadas: number;
  jornadasPorTipo: Record<string, number>;
  promedioTurnosPorJornada: number;
  jornadaMasProductiva: {
    nombre: string;
    promedio: number;
  };
  tendencias: {
    dia: string;
    jornada: string;
    turnos: number;
  }[];
}

// 🎯 Para el flujo de "Guardar Jornada"
export interface GuardarJornadaRequest {
  jornadaConfigId: string;
  turnosActuales: TurnoJornada[];
  horaFin: string;
  observaciones?: string;
  activarSiguienteJornada: boolean;
}

export interface GuardarJornadaResponse {
  registroJornada: RegistroJornadaDiaria;
  siguienteJornada?: JornadaConfig;
  mensaje: string;
}

// 🔧 Para validaciones
export interface ValidacionJornada {
  valida: boolean;
  errores: string[];
  advertencias: string[];
}

// 📱 Para UI
export interface JornadaUI extends JornadaConfig {
  esActual: boolean;
  tiempoRestante?: string; // "2h 30min"
  turnosActivos: number;
  puedeActivar: boolean;
}

// 🏗️ Para formularios
export interface FormularioJornada {
  nombre: string;
  descripcion: string;
  horaInicio: string;
  horaFin: string;
  diasSemana: DiaSemana[];
  color: string;
  activa: boolean;
}

// 📅 Constantes útiles
export const DIAS_SEMANA: { value: DiaSemana; label: string }[] = [
  { value: 'lunes', label: 'Lunes' },
  { value: 'martes', label: 'Martes' },
  { value: 'miercoles', label: 'Miércoles' },
  { value: 'jueves', label: 'Jueves' },
  { value: 'viernes', label: 'Viernes' },
  { value: 'sabado', label: 'Sábado' },
  { value: 'domingo', label: 'Domingo' }
];

export const COLORES_JORNADA = [
  '#3B82F6', // Azul
  '#10B981', // Verde
  '#F59E0B', // Amarillo
  '#EF4444', // Rojo
  '#8B5CF6', // Púrpura
  '#06B6D4', // Cian
  '#84CC16', // Lima
  '#F97316'  // Naranja
];

// 🚀 Templates de jornadas comunes
export const TEMPLATES_JORNADAS: Partial<JornadaConfig>[] = [
  {
    nombre: 'Jornada Mañana',
    descripcion: 'Jornada matutina',
    horario: { horaInicio: '07:00', horaFin: '12:00' },
    orden: 1,
    color: '#3B82F6',
    diasSemana: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
  },
  {
    nombre: 'Jornada Tarde',
    descripcion: 'Jornada vespertina',
    horario: { horaInicio: '15:00', horaFin: '21:00' },
    orden: 2,
    color: '#10B981',
    diasSemana: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
  },
  {
    nombre: 'Jornada Completa',
    descripcion: 'Jornada de día completo',
    horario: { horaInicio: '07:00', horaFin: '21:00' },
    orden: 1,
    color: '#F59E0B',
    diasSemana: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
  }
];