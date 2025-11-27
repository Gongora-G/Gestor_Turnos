import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

export interface Tarea {
  id: number;
  nombre: string;
  descripcion?: string;
  categoria?: string;
  tiempoEstimado?: number;
  prioridad?: string;
  activa: boolean;
  clubId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TareaAsignada {
  id: string;
  tareaId: number;
  tarea?: Tarea;
  registroAsistenciaId: string;
  completada: boolean;
  horaCompletada?: Date;
  observaciones?: string;
  clubId: string;
}

export interface CreateTareaDto {
  nombre: string;
  descripcion?: string;
  categoria?: string;
  tiempoEstimado?: number;
  prioridad?: string;
  activa?: boolean;
}

export interface UpdateTareaDto {
  nombre?: string;
  descripcion?: string;
  categoria?: string;
  tiempoEstimado?: number;
  prioridad?: string;
  activa?: boolean;
}

export interface CompletarTareaDto {
  completada: boolean;
  observaciones?: string;
}

export interface EstadisticasTareas {
  totalAsignadas: number;
  completadas: number;
  pendientes: number;
  porcentajeCompletadas: number;
  tareasPorCategoria: Record<string, number>;
  tareasConMayorRetraso: Array<{
    id: string;
    nombre: string;
    horasTranscurridas: number;
  }>;
}

const tareasService = {
  // Obtener todas las tareas del club
  obtenerTareas: async (categoria?: string): Promise<Tarea[]> => {
    const token = localStorage.getItem('auth_token');
    const params = categoria ? { categoria } : {};
    const response = await axios.get(`${API_URL}/tareas`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return response.data;
  },

  // Obtener solo las tareas activas
  obtenerTareasActivas: async (): Promise<Tarea[]> => {
    const token = localStorage.getItem('auth_token');
    const response = await axios.get(`${API_URL}/tareas/activas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Obtener una tarea por ID
  obtenerTareaPorId: async (id: number): Promise<Tarea> => {
    const token = localStorage.getItem('auth_token');
    const response = await axios.get(`${API_URL}/tareas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Crear una nueva tarea
  crearTarea: async (dto: CreateTareaDto): Promise<Tarea> => {
    const token = localStorage.getItem('auth_token');
    const response = await axios.post(`${API_URL}/tareas`, dto, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Actualizar una tarea
  actualizarTarea: async (id: number, dto: UpdateTareaDto): Promise<Tarea> => {
    const token = localStorage.getItem('auth_token');
    const response = await axios.patch(`${API_URL}/tareas/${id}`, dto, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Eliminar (desactivar) una tarea
  eliminarTarea: async (id: number): Promise<void> => {
    const token = localStorage.getItem('auth_token');
    await axios.delete(`${API_URL}/tareas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Alternar el estado activa de una tarea
  toggleActiva: async (id: number): Promise<Tarea> => {
    const token = localStorage.getItem('auth_token');
    const response = await axios.patch(
      `${API_URL}/tareas/${id}/toggle-activa`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Asignar tareas a un registro de asistencia
  asignarTareas: async (registroId: string, tareaIds: number[]): Promise<TareaAsignada[]> => {
    const token = localStorage.getItem('auth_token');
    const response = await axios.post(
      `${API_URL}/tareas/asignar/${registroId}`,
      { tareaIds },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Obtener tareas asignadas a un registro de asistencia
  obtenerTareasDeRegistro: async (registroId: string): Promise<TareaAsignada[]> => {
    const token = localStorage.getItem('auth_token');
    const response = await axios.get(`${API_URL}/tareas/asignadas/${registroId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Marcar una tarea asignada como completada o pendiente
  completarTarea: async (id: string, dto: CompletarTareaDto): Promise<TareaAsignada> => {
    const token = localStorage.getItem('auth_token');
    const response = await axios.patch(`${API_URL}/tareas/asignada/${id}/completar`, dto, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Obtener categorías únicas
  obtenerCategorias: async (): Promise<string[]> => {
    const token = localStorage.getItem('auth_token');
    const response = await axios.get(`${API_URL}/tareas/categorias`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Obtener estadísticas de tareas
  obtenerEstadisticas: async (fechaInicio?: string, fechaFin?: string): Promise<EstadisticasTareas> => {
    const token = localStorage.getItem('auth_token');
    const params: any = {};
    if (fechaInicio) params.fechaInicio = fechaInicio;
    if (fechaFin) params.fechaFin = fechaFin;
    
    const response = await axios.get(`${API_URL}/tareas/estadisticas`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return response.data;
  },
};

export default tareasService;
