import { apiService } from './api';

export interface TipoMembresia {
  id: string;
  nombre: string;
  descripcion?: string;
  color: string;
  activo: boolean;
  precio?: number;
  club_id: string;
  created_at: string;
  updated_at: string;
}

export interface CrearTipoMembresiaDto {
  nombre: string;
  descripcion?: string;
  color: string;
  precio?: number;
}

export interface ActualizarTipoMembresiaDto {
  nombre?: string;
  descripcion?: string;
  color?: string;
  precio?: number;
  activo?: boolean;
}

class TiposMembresiaService {
  private readonly endpoint = '/tipos-membresia';

  async obtenerTipos(): Promise<TipoMembresia[]> {
    try {
      const response = await apiService.get<TipoMembresia[]>(this.endpoint);
      return response;
    } catch (error) {
      console.error('Error al obtener tipos de membresía:', error);
      throw error;
    }
  }

  async obtenerTipoPorId(id: string): Promise<TipoMembresia> {
    try {
      const response = await apiService.get<TipoMembresia>(`${this.endpoint}/${id}`);
      return response;
    } catch (error) {
      console.error('Error al obtener tipo de membresía:', error);
      throw error;
    }
  }

  async crearTipo(tipo: CrearTipoMembresiaDto): Promise<TipoMembresia> {
    try {
      const response = await apiService.post<TipoMembresia>(this.endpoint, tipo);
      return response;
    } catch (error) {
      console.error('Error al crear tipo de membresía:', error);
      throw error;
    }
  }

  async actualizarTipo(id: string, tipo: ActualizarTipoMembresiaDto): Promise<TipoMembresia> {
    try {
      const response = await apiService.patch<TipoMembresia>(`${this.endpoint}/${id}`, tipo);
      return response;
    } catch (error) {
      console.error('Error al actualizar tipo de membresía:', error);
      throw error;
    }
  }

  async eliminarTipo(id: string): Promise<void> {
    try {
      await apiService.delete<void>(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error('Error al eliminar tipo de membresía:', error);
      throw error;
    }
  }

  async toggleActivo(id: string): Promise<TipoMembresia> {
    try {
      const response = await apiService.patch<TipoMembresia>(`${this.endpoint}/${id}/toggle-active`);
      return response;
    } catch (error) {
      console.error('Error al cambiar estado del tipo de membresía:', error);
      throw error;
    }
  }
}

export const tiposMembresiaService = new TiposMembresiaService();