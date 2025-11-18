import { apiService } from './api';

// ========== INTERFACES ==========
export interface TipoSuperficieCancha {
  id: number;
  nombre: string;
  descripcion?: string;
  color?: string;
  velocidad?: 'rapida' | 'media' | 'lenta';
  requiereMantenimientoEspecial: boolean;
  activa: boolean;
  orden: number;
  clubId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EstadoCancha {
  id: number;
  nombre: string;
  descripcion?: string;
  color?: string;
  icono?: string;
  permiteReservas: boolean;
  visibleEnTurnos: boolean;
  activa: boolean;
  orden: number;
  esPredeterminado: boolean;
  clubId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CanchaBackend {
  id: string;
  nombre: string;
  numero?: number;
  ubicacion?: string;
  descripcion?: string;
  capacidad: number;
  activa: boolean;
  tipo?: string;
  precioHora?: number;
  superficieId?: number;
  estadoId?: number;
  clubId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CrearCanchaDto {
  nombre: string;
  numero?: number;
  ubicacion?: string;
  descripcion?: string;
  capacidad?: number;
  tipo?: string;
  precioHora?: number;
  superficieId?: number;
  estadoId?: number;
}

export interface ActualizarCanchaDto {
  nombre?: string;
  numero?: number;
  ubicacion?: string;
  descripcion?: string;
  capacidad?: number;
  activa?: boolean;
  tipo?: string;
  precioHora?: number;
  superficieId?: number;
  estadoId?: number;
}

export interface CreateTipoSuperficieDto {
  nombre: string;
  descripcion?: string;
  color?: string;
  velocidad?: 'rapida' | 'media' | 'lenta';
  requiereMantenimientoEspecial?: boolean;
  orden?: number;
}

export interface CreateEstadoCanchaDto {
  nombre: string;
  descripcion?: string;
  color?: string;
  icono?: string;
  permiteReservas?: boolean;
  visibleEnTurnos?: boolean;
  orden?: number;
  esPredeterminado?: boolean;
}

// ========== SERVICIOS ==========
class CanchasService {
  private readonly baseEndpoint = '/configuracion';

  // ===== TIPOS DE SUPERFICIE =====
  async getTiposSuperficie(): Promise<TipoSuperficieCancha[]> {
    try {
      const response = await apiService.get<TipoSuperficieCancha[]>(`${this.baseEndpoint}/tipos-superficie`);
      return response;
    } catch (error) {
      console.error('Error al obtener tipos de superficie:', error);
      throw error;
    }
  }

  async createTipoSuperficie(data: CreateTipoSuperficieDto): Promise<TipoSuperficieCancha> {
    try {
      const response = await apiService.post<TipoSuperficieCancha>(`${this.baseEndpoint}/tipos-superficie`, data);
      return response;
    } catch (error) {
      console.error('Error al crear tipo de superficie:', error);
      throw error;
    }
  }

  async updateTipoSuperficie(id: number, data: Partial<CreateTipoSuperficieDto>): Promise<TipoSuperficieCancha> {
    try {
      const response = await apiService.patch<TipoSuperficieCancha>(`${this.baseEndpoint}/tipos-superficie/${id}`, data);
      return response;
    } catch (error) {
      console.error('Error al actualizar tipo de superficie:', error);
      throw error;
    }
  }

  async deleteTipoSuperficie(id: number): Promise<void> {
    try {
      await apiService.delete<void>(`${this.baseEndpoint}/tipos-superficie/${id}`);
    } catch (error) {
      console.error('Error al eliminar tipo de superficie:', error);
      throw error;
    }
  }

  async toggleTipoSuperficieActiva(id: number): Promise<TipoSuperficieCancha> {
    try {
      const response = await apiService.patch<TipoSuperficieCancha>(`${this.baseEndpoint}/tipos-superficie/${id}/toggle-active`);
      return response;
    } catch (error) {
      console.error('Error al cambiar estado del tipo de superficie:', error);
      throw error;
    }
  }

  // ===== ESTADOS DE CANCHA =====
  async getEstadosCanchas(): Promise<EstadoCancha[]> {
    try {
      const response = await apiService.get<EstadoCancha[]>(`${this.baseEndpoint}/estados-cancha`);
      return response;
    } catch (error) {
      console.error('Error al obtener estados de cancha:', error);
      throw error;
    }
  }

  async createEstadoCancha(data: CreateEstadoCanchaDto): Promise<EstadoCancha> {
    try {
      const response = await apiService.post<EstadoCancha>(`${this.baseEndpoint}/estados-cancha`, data);
      return response;
    } catch (error) {
      console.error('Error al crear estado de cancha:', error);
      throw error;
    }
  }

  async updateEstadoCancha(id: number, data: Partial<CreateEstadoCanchaDto>): Promise<EstadoCancha> {
    try {
      const response = await apiService.patch<EstadoCancha>(`${this.baseEndpoint}/estados-cancha/${id}`, data);
      return response;
    } catch (error) {
      console.error('Error al actualizar estado de cancha:', error);
      throw error;
    }
  }

  async deleteEstadoCancha(id: number): Promise<void> {
    try {
      await apiService.delete<void>(`${this.baseEndpoint}/estados-cancha/${id}`);
    } catch (error) {
      console.error('Error al eliminar estado de cancha:', error);
      throw error;
    }
  }

  async toggleEstadoCanchaActiva(id: number): Promise<EstadoCancha> {
    try {
      const response = await apiService.patch<EstadoCancha>(`${this.baseEndpoint}/estados-cancha/${id}/toggle-active`);
      return response;
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      throw error;
    }
  }

  // ===== CANCHAS =====
  async obtenerCanchas(): Promise<CanchaBackend[]> {
    try {
      const response = await apiService.get<CanchaBackend[]>(`${this.baseEndpoint}/canchas`);
      return response;
    } catch (error) {
      console.error('Error al obtener canchas:', error);
      throw error;
    }
  }

  async obtenerCanchaPorId(id: string): Promise<CanchaBackend> {
    try {
      const response = await apiService.get<CanchaBackend>(`${this.baseEndpoint}/canchas/${id}`);
      return response;
    } catch (error) {
      console.error('Error al obtener cancha:', error);
      throw error;
    }
  }

  async crearCancha(cancha: CrearCanchaDto): Promise<CanchaBackend> {
    try {
      const response = await apiService.post<CanchaBackend>(`${this.baseEndpoint}/canchas`, cancha);
      return response;
    } catch (error) {
      console.error('Error al crear cancha:', error);
      throw error;
    }
  }

  async actualizarCancha(id: string, cancha: ActualizarCanchaDto): Promise<CanchaBackend> {
    try {
      const response = await apiService.patch<CanchaBackend>(`${this.baseEndpoint}/canchas/${id}`, cancha);
      return response;
    } catch (error) {
      console.error('Error al actualizar cancha:', error);
      throw error;
    }
  }

  async eliminarCancha(id: string): Promise<void> {
    try {
      await apiService.delete<void>(`${this.baseEndpoint}/canchas/${id}`);
    } catch (error) {
      console.error('Error al eliminar cancha:', error);
      throw error;
    }
  }

  async toggleCanchaActiva(id: string): Promise<CanchaBackend> {
    try {
      const response = await apiService.patch<CanchaBackend>(`${this.baseEndpoint}/canchas/${id}/toggle-active`);
      return response;
    } catch (error) {
      console.error('Error al cambiar estado de la cancha:', error);
      throw error;
    }
  }
}

export const canchasService = new CanchasService();