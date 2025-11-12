import { apiService } from './api';

export interface CampoPersonalizado {
  nombre: string;
  tipo: 'text' | 'number' | 'select' | 'checkbox' | 'textarea';
  label: string;
  requerido: boolean;
  opciones?: string[];
  placeholder?: string;
}

export interface TipoPersonal {
  id: number;
  nombre: string;
  codigo: string;
  descripcion?: string;
  activo: boolean;
  campos_personalizados: CampoPersonalizado[];
  clubId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTipoPersonalDto {
  nombre: string;
  codigo: string;
  descripcion?: string;
  activo?: boolean;
  campos_personalizados?: CampoPersonalizado[];
  clubId: string;
}

export interface UpdateTipoPersonalDto {
  nombre?: string;
  codigo?: string;
  descripcion?: string;
  activo?: boolean;
  campos_personalizados?: CampoPersonalizado[];
}

class TiposPersonalService {
  async getAll(clubId: string): Promise<TipoPersonal[]> {
    return await apiService.get<TipoPersonal[]>(`/tipos-personal?clubId=${clubId}`);
  }

  async getAllActivos(clubId: string): Promise<TipoPersonal[]> {
    return await apiService.get<TipoPersonal[]>(`/tipos-personal/activos?clubId=${clubId}`);
  }

  async getById(id: number): Promise<TipoPersonal> {
    return await apiService.get<TipoPersonal>(`/tipos-personal/${id}`);
  }

  async create(data: CreateTipoPersonalDto): Promise<TipoPersonal> {
    return await apiService.post<TipoPersonal>('/tipos-personal', data);
  }

  async update(id: number, data: UpdateTipoPersonalDto): Promise<TipoPersonal> {
    return await apiService.patch<TipoPersonal>(`/tipos-personal/${id}`, data);
  }

  async delete(id: number): Promise<void> {
    await apiService.delete(`/tipos-personal/${id}`);
  }

  async crearTiposPorDefecto(clubId: string): Promise<TipoPersonal[]> {
    return await apiService.post<TipoPersonal[]>(`/tipos-personal/seed/${clubId}`);
  }
}

export const tiposPersonalService = new TiposPersonalService();
