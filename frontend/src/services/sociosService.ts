import type { ApiResponse } from '@/types';
import { apiService } from './api';

export interface Socio {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  documento: string;
  tipo_documento: 'cedula' | 'pasaporte' | 'extranjeria';
  fecha_nacimiento?: string;
  direccion?: string;
  tipo_membresia_id: string;
  tipo_membresia?: {
    id: string;
    nombre: string;
    descripcion?: string;
    color: string;
    precio?: number;
  };
  fecha_inicio_membresia: string;
  fecha_vencimiento?: string;
  estado: 'activo' | 'inactivo' | 'suspendido';
  observaciones?: string;
  club_id: string;
  created_at: string;
  updated_at: string;
}

export interface CrearSocioDto {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  documento: string;
  tipo_documento: 'cedula' | 'pasaporte' | 'extranjeria';
  fecha_nacimiento?: string;
  direccion?: string;
  tipo_membresia_id: string;
  fecha_inicio_membresia: string;
  observaciones?: string;
}

export interface ActualizarSocioDto {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  documento?: string;
  tipo_documento?: 'cedula' | 'pasaporte' | 'extranjeria';
  fecha_nacimiento?: string;
  direccion?: string;
  tipo_membresia_id?: string;
  fecha_inicio_membresia?: string;
  estado?: 'activo' | 'inactivo' | 'suspendido';
  observaciones?: string;
}

export interface FiltrosSocios {
  nombre?: string;
  email?: string;
  documento?: string;
  tipo_membresia_id?: string;
  estado?: 'activo' | 'inactivo' | 'suspendido';
  fecha_inicio?: string;
  fecha_fin?: string;
}

class SociosService {
  private readonly endpoint = '/socios';

  async obtenerSocios(filtros?: FiltrosSocios): Promise<ApiResponse<Socio[]>> {
    try {
      const params = new URLSearchParams();
      if (filtros) {
        Object.entries(filtros).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
      }
      
      const queryString = params.toString();
      const url = queryString ? `${this.endpoint}?${queryString}` : this.endpoint;
      
      const response = await apiService.get<Socio[]>(url);
      
      // El apiService ya devuelve response.data, así que response es directamente el array de socios
      return {
        data: response as Socio[],
        message: 'Socios obtenidos exitosamente',
        success: true
      };
    } catch (error) {
      console.error('Error al obtener socios:', error);
      throw error;
    }
  }

  async obtenerSocioPorId(id: string): Promise<ApiResponse<Socio>> {
    try {
      const response = await apiService.get<Socio>(`${this.endpoint}/${id}`);
      return {
        data: response as Socio,
        message: 'Socio obtenido exitosamente',
        success: true
      };
    } catch (error) {
      console.error('Error al obtener socio:', error);
      throw error;
    }
  }

  async crearSocio(socio: CrearSocioDto): Promise<ApiResponse<Socio>> {
    try {
      const response = await apiService.post<Socio>(this.endpoint, socio);
      return {
        data: response as Socio,
        message: 'Socio creado exitosamente',
        success: true
      };
    } catch (error) {
      console.error('Error al crear socio:', error);
      throw error;
    }
  }

  async actualizarSocio(id: string, socio: ActualizarSocioDto): Promise<ApiResponse<Socio>> {
    try {
      const response = await apiService.patch<Socio>(`${this.endpoint}/${id}`, socio);
      return {
        data: response as Socio,
        message: 'Socio actualizado exitosamente',
        success: true
      };
    } catch (error) {
      console.error('Error al actualizar socio:', error);
      throw error;
    }
  }

  async eliminarSocio(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiService.delete<void>(`${this.endpoint}/${id}`);
      return {
        data: response as void,
        message: 'Socio eliminado exitosamente',
        success: true
      };
    } catch (error) {
      console.error('Error al eliminar socio:', error);
      throw error;
    }
  }

  async cambiarEstadoSocio(id: string, estado: 'activo' | 'inactivo' | 'suspendido'): Promise<ApiResponse<Socio>> {
    try {
      const response = await apiService.patch<Socio>(`${this.endpoint}/${id}/estado`, { estado });
      return {
        data: response as Socio,
        message: 'Estado del socio actualizado exitosamente',
        success: true
      };
    } catch (error) {
      console.error('Error al cambiar estado del socio:', error);
      throw error;
    }
  }

  async renovarMembresia(id: string, tipo_membresia_id: string, fecha_inicio: string): Promise<ApiResponse<Socio>> {
    try {
      const response = await apiService.patch<Socio>(`${this.endpoint}/${id}/renovar-membresia`, {
        tipo_membresia_id,
        fecha_inicio_membresia: fecha_inicio
      });
      return {
        data: response as Socio,
        message: 'Membresía renovada exitosamente',
        success: true
      };
    } catch (error) {
      console.error('Error al renovar membresía:', error);
      throw error;
    }
  }

  async obtenerSociosActivos(): Promise<ApiResponse<Socio[]>> {
    try {
      const response = await apiService.get<Socio[]>(`${this.endpoint}/activos`);
      return {
        data: response as Socio[],
        message: 'Socios activos obtenidos exitosamente',
        success: true
      };
    } catch (error) {
      console.error('Error al obtener socios activos:', error);
      throw error;
    }
  }

  async buscarSocio(termino: string): Promise<ApiResponse<Socio[]>> {
    try {
      const response = await apiService.get<Socio[]>(`${this.endpoint}/buscar?q=${encodeURIComponent(termino)}`);
      return {
        data: response as Socio[],
        message: 'Búsqueda completada exitosamente',
        success: true
      };
    } catch (error) {
      console.error('Error al buscar socio:', error);
      throw error;
    }
  }
}

export const sociosService = new SociosService();
