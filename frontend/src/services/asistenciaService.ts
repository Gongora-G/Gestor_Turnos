import { apiService } from './api';

// ==========================================
// INTERFACES
// ==========================================
export interface Personal {
  id: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  email?: string;
  tipoPersonalId: number;
  tipoPersonal?: {
    id: number;
    nombre: string;
    codigo: string;
  };
  jornadaAsignadaId?: number;
  activo: boolean;
}

export interface RegistroAsistencia {
  id: string;
  personalId: string;
  personal: Personal;
  jornadaConfigId: number;
  jornadaConfig: {
    id: number;
    nombre: string;
    codigo: string;
    color: string;
  };
  fecha: string;
  horaLlegada: string;
  tareasCompletadas: boolean;
  tareasPendientes?: string;
  turnosRealizadosAyer: number;
  ordenCalculado?: number;
  observaciones?: string;
  presente: boolean;
  horaSalida?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrarAsistenciaDto {
  personalId: string;
  jornadaConfigId: number;
  fecha: string;
  presente?: boolean;
  tareasCompletadas?: boolean;
  tareasPendientes?: string;
  turnosRealizadosAyer?: number;
  observaciones?: string;
  clubId: string;
  registradoPor: string;
}

export interface ActualizarAsistenciaDto {
  tareasCompletadas?: boolean;
  tareasPendientes?: string;
  presente?: boolean;
  horaSalida?: string;
  observaciones?: string;
  ordenCalculado?: number;
}

export interface PersonalDisponible {
  id: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  tipo_personal: string;
  jornada_asignada_id?: number;
  ya_registro_hoy: boolean;
  estado_asistencia?: 'presente' | 'ausente'; // Nuevo campo para diferenciar
}

export interface EstadisticasAsistencia {
  totalRegistros: number;
  totalPresentes: number;
  totalConTareasCompletas: number;
  promedioTurnosAyer: number;
}

// ==========================================
// SERVICE
// ==========================================
class AsistenciaService {
  private baseEndpoint = '/asistencia';

  /**
   * 📝 Registrar llegada de personal
   */
  async registrarLlegada(data: RegistrarAsistenciaDto): Promise<RegistroAsistencia> {
    try {
      const response = await apiService.post<RegistroAsistencia>(`${this.baseEndpoint}/registrar`, data);
      return response;
    } catch (error) {
      console.error('Error al registrar llegada:', error);
      throw error;
    }
  }

  /**
   * 📋 Obtener asistencias por fecha y jornada
   */
  async obtenerAsistencias(fecha: string, jornadaConfigId?: number): Promise<RegistroAsistencia[]> {
    try {
      const params = new URLSearchParams({ fecha });
      if (jornadaConfigId) {
        params.append('jornadaConfigId', jornadaConfigId.toString());
      }

      const response = await apiService.get<RegistroAsistencia[]>(`${this.baseEndpoint}?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('Error al obtener asistencias:', error);
      throw error;
    }
  }

  /**
   * 📝 Actualizar registro de asistencia
   */
  async actualizarAsistencia(id: string, data: ActualizarAsistenciaDto): Promise<RegistroAsistencia> {
    try {
      const response = await apiService.put<RegistroAsistencia>(`${this.baseEndpoint}/${id}`, data);
      return response;
    } catch (error) {
      console.error('Error al actualizar asistencia:', error);
      throw error;
    }
  }

  /**
   * 🔢 Calcular orden automático
   */
  async calcularOrden(fecha: string, jornadaConfigId: number): Promise<void> {
    try {
      await apiService.post(`${this.baseEndpoint}/calcular-orden`, { fecha, jornadaConfigId });
    } catch (error) {
      console.error('Error al calcular orden:', error);
      throw error;
    }
  }

  /**
   * 👥 Obtener personal disponible para registrar
   */
  async obtenerPersonalDisponible(jornadaConfigId: number): Promise<PersonalDisponible[]> {
    try {
      const response = await apiService.get<PersonalDisponible[]>(
        `${this.baseEndpoint}/personal-disponible?jornadaConfigId=${jornadaConfigId}`
      );
      return response;
    } catch (error) {
      console.error('Error al obtener personal disponible:', error);
      throw error;
    }
  }

  /**
   * 🗑️ Eliminar registro de asistencia
   */
  async eliminarAsistencia(id: string): Promise<void> {
    try {
      await apiService.delete(`${this.baseEndpoint}/${id}`);
    } catch (error) {
      console.error('Error al eliminar asistencia:', error);
      throw error;
    }
  }

  /**
   * 📊 Obtener estadísticas de asistencia
   */
  async obtenerEstadisticas(fecha: string): Promise<EstadisticasAsistencia> {
    try {
      const response = await apiService.get<EstadisticasAsistencia>(
        `${this.baseEndpoint}/estadisticas?fecha=${fecha}`
      );
      return response;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }
}

export const asistenciaService = new AsistenciaService();
