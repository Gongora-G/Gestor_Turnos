import { apiService } from './api';

// Re-exportamos la interfaz Turno para que esté disponible para los componentes
export interface Turno {
  id: string;
  nombre?: string;
  numero_turno_dia?: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  cancha_id: string;
  cancha?: {
    id: string;
    nombre: string;
    ubicacion?: string;
  };
  usuario_id: string;
  usuario?: {
    id: string;
    nombre: string;
    email: string;
  };
  socio_id?: string;
  socio?: {
    id: string;
    nombre: string;
    tipo_membresia: string;
  };
  estado: 'en_progreso' | 'completado';
  observaciones?: string;
  created_at: string;
  updated_at: string;
}

export interface CrearTurnoDto {
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  cancha_id: string;
  usuario_id?: string;
  socio_id?: string;
  observaciones?: string;
}

export interface ActualizarTurnoDto {
  fecha?: string;
  hora_inicio?: string;
  hora_fin?: string;
  cancha_id?: string;
  estado?: 'en_progreso' | 'completado';
  observaciones?: string;
}

export interface FiltrosTurnos {
  fecha_inicio?: string;
  fecha_fin?: string;
  cancha_id?: string;
  estado?: string;
  usuario_id?: string;
  socio_id?: string;
}

class TurnosService {
  private readonly endpoint = '/turnos';

  async obtenerTurnos(filtros?: FiltrosTurnos): Promise<Turno[]> {
    try {
      const params = new URLSearchParams();
      if (filtros) {
        Object.entries(filtros).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
      }
      
      const queryString = params.toString();
      const url = queryString ? `${this.endpoint}?${queryString}` : this.endpoint;
      
      const response = await apiService.get<Turno[]>(url);
      return response;
    } catch (error) {
      console.error('Error al obtener turnos:', error);
      throw error;
    }
  }

  async obtenerTurnoPorId(id: string): Promise<Turno> {
    try {
      const response = await apiService.get<Turno>(`${this.endpoint}/${id}`);
      return response;
    } catch (error) {
      console.error('Error al obtener turno:', error);
      throw error;
    }
  }

  async crearTurno(turno: CrearTurnoDto): Promise<Turno> {
    try {
      const response = await apiService.post<Turno>(this.endpoint, turno);
      return response;
    } catch (error) {
      console.error('Error al crear turno:', error);
      throw error;
    }
  }

  async actualizarTurno(id: string, turno: ActualizarTurnoDto): Promise<Turno> {
    try {
      const response = await apiService.patch<Turno>(`${this.endpoint}/${id}`, turno);
      return response;
    } catch (error) {
      console.error('Error al actualizar turno:', error);
      throw error;
    }
  }

  async eliminarTurno(id: string): Promise<void> {
    try {
      await apiService.delete<void>(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error('Error al eliminar turno:', error);
      throw error;
    }
  }

  async cambiarEstadoTurno(id: string, estado: 'en_progreso' | 'completado'): Promise<Turno> {
    try {
      const response = await apiService.patch<Turno>(`${this.endpoint}/${id}/estado`, { estado });
      return response;
    } catch (error) {
      console.error('Error al cambiar estado del turno:', error);
      throw error;
    }
  }

  async obtenerTurnosDisponibles(fecha: string, cancha_id?: string): Promise<{ hora: string; disponible: boolean }[]> {
    try {
      const params = new URLSearchParams({ fecha });
      if (cancha_id) params.append('cancha_id', cancha_id);
      
      const response = await apiService.get<{ hora: string; disponible: boolean }[]>(`${this.endpoint}/disponibles?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('Error al obtener turnos disponibles:', error);
      throw error;
    }
  }
}

export const turnosService = new TurnosService();