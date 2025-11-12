import { apiService } from './api';
import type { TipoPersonal } from './tiposPersonalService';

export interface PersonalUnificado {
  id: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  email?: string;
  tipoPersonalId: number;
  tipoPersonal: TipoPersonal;
  datosEspecificos: Record<string, any>;
  tarifaPorHora?: number;
  estado: 'disponible' | 'ocupado' | 'descanso' | 'inactivo';
  horariosDisponibles?: string;
  notas?: string;
  activo: boolean;
  clubId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePersonalDto {
  nombre: string;
  apellido: string;
  telefono?: string;
  email?: string;
  tipoPersonalId: number;
  datosEspecificos?: Record<string, any>;
  tarifaPorHora?: number;
  estado?: 'disponible' | 'ocupado' | 'descanso' | 'inactivo';
  horariosDisponibles?: string;
  notas?: string;
  activo?: boolean;
  clubId: string;
}

export interface UpdatePersonalDto {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  email?: string;
  tipoPersonalId?: number;
  datosEspecificos?: Record<string, any>;
  tarifaPorHora?: number;
  estado?: 'disponible' | 'ocupado' | 'descanso' | 'inactivo';
  horariosDisponibles?: string;
  notas?: string;
  activo?: boolean;
}

export interface EstadisticasPersonal {
  total: number;
  disponibles: number;
  ocupados: number;
  porTipo: Array<{ tipo: string; cantidad: number }>;
}

class PersonalUnificadoService {
  async getAll(clubId: string, tipoPersonalId?: number): Promise<PersonalUnificado[]> {
    const params = tipoPersonalId ? `?clubId=${clubId}&tipoPersonalId=${tipoPersonalId}` : `?clubId=${clubId}`;
    return await apiService.get<PersonalUnificado[]>(`/personal${params}`);
  }

  async getAllActivos(clubId: string, tipoPersonalId?: number): Promise<PersonalUnificado[]> {
    const params = tipoPersonalId ? `?clubId=${clubId}&tipoPersonalId=${tipoPersonalId}` : `?clubId=${clubId}`;
    return await apiService.get<PersonalUnificado[]>(`/personal/activos${params}`);
  }

  async getDisponibles(clubId: string, tipoPersonalId?: number): Promise<PersonalUnificado[]> {
    const params = tipoPersonalId ? `?clubId=${clubId}&tipoPersonalId=${tipoPersonalId}` : `?clubId=${clubId}`;
    return await apiService.get<PersonalUnificado[]>(`/personal/disponibles${params}`);
  }

  async getByTipo(clubId: string, codigoTipo: string): Promise<PersonalUnificado[]> {
    return await apiService.get<PersonalUnificado[]>(`/personal/tipo/${codigoTipo}?clubId=${clubId}`);
  }

  async getById(id: string): Promise<PersonalUnificado> {
    return await apiService.get<PersonalUnificado>(`/personal/${id}`);
  }

  async create(data: CreatePersonalDto): Promise<PersonalUnificado> {
    return await apiService.post<PersonalUnificado>('/personal', data);
  }

  async update(id: string, data: UpdatePersonalDto): Promise<PersonalUnificado> {
    return await apiService.patch<PersonalUnificado>(`/personal/${id}`, data);
  }

  async updateEstado(
    id: string,
    estado: 'disponible' | 'ocupado' | 'descanso' | 'inactivo'
  ): Promise<PersonalUnificado> {
    return await apiService.patch<PersonalUnificado>(`/personal/${id}/estado`, { estado });
  }

  async delete(id: string): Promise<void> {
    await apiService.delete(`/personal/${id}`);
  }

  async softDelete(id: string): Promise<PersonalUnificado> {
    return await apiService.patch<PersonalUnificado>(`/personal/${id}/soft-delete`);
  }

  async getEstadisticas(clubId: string): Promise<EstadisticasPersonal> {
    return await apiService.get<EstadisticasPersonal>(`/personal/estadisticas?clubId=${clubId}`);
  }
}

export const personalUnificadoService = new PersonalUnificadoService();
