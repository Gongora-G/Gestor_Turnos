import type { ApiResponse } from '@/types';
import { apiService } from './api';

// Re-exportamos la interfaz CanchaBackend para que esté disponible para los componentes
export interface CanchaBackend {
  id: string;
  nombre: string;
  ubicacion?: string;
  tipo?: string;
  precio_por_hora: number;
  disponible: boolean;
  created_at: string;
  updated_at: string;
}

export interface CrearCanchaDto {
  nombre: string;
  ubicacion?: string;
  descripcion?: string;
  capacidad: number;
  tipo?: string;
  precio_hora?: number;
}

export interface ActualizarCanchaDto {
  nombre?: string;
  ubicacion?: string;
  descripcion?: string;
  capacidad?: number;
  activa?: boolean;
  tipo?: string;
  precio_hora?: number;
}

class CanchasService {
  private readonly endpoint = '/canchas';

  async obtenerCanchas(): Promise<CanchaBackend[]> {
    try {
      const response = await apiService.get<CanchaBackend[]>(this.endpoint);
      return response;
    } catch (error) {
      console.error('Error al obtener canchas:', error);
      throw error;
    }
  }

  async obtenerCanchasActivas(): Promise<ApiResponse<CanchaBackend[]>> {
    try {
      const response = await apiService.get<CanchaBackend[]>(`${this.endpoint}/active`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener canchas activas:', error);
      throw error;
    }
  }

  async obtenerCanchaPorId(id: string): Promise<ApiResponse<CanchaBackend>> {
    try {
      const response = await apiService.get<CanchaBackend>(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener cancha:', error);
      throw error;
    }
  }

  async crearCancha(cancha: CrearCanchaDto): Promise<ApiResponse<CanchaBackend>> {
    try {
      const response = await apiService.post<CanchaBackend>(this.endpoint, cancha);
      return response.data;
    } catch (error) {
      console.error('Error al crear cancha:', error);
      throw error;
    }
  }

  async actualizarCancha(id: string, cancha: ActualizarCanchaDto): Promise<ApiResponse<CanchaBackend>> {
    try {
      const response = await apiService.patch<CanchaBackend>(`${this.endpoint}/${id}`, cancha);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar cancha:', error);
      throw error;
    }
  }

  async eliminarCancha(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiService.delete<void>(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar cancha:', error);
      throw error;
    }
  }

  async toggleActiva(id: string): Promise<ApiResponse<Cancha>> {
    try {
      const response = await apiService.patch<Cancha>(`${this.endpoint}/${id}/toggle-active`);
      return response.data;
    } catch (error) {
      console.error('Error al cambiar estado de la cancha:', error);
      throw error;
    }
  }
}

export const canchasService = new CanchasService();