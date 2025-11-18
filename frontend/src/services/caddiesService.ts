import { apiService as api } from './api';

export interface Caddie {
  id: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  email?: string;
  especialidades?: string;
  nivel_experiencia: number;
  tarifa_por_hora?: number;
  estado: 'disponible' | 'ocupado' | 'descanso' | 'inactivo';
  horarios_disponibles?: string;
  notas?: string;
  activo: boolean;
  clubId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCaddieDto {
  nombre: string;
  apellido: string;
  telefono?: string;
  email?: string;
  especialidades?: string;
  nivel_experiencia?: number;
  tarifa_por_hora?: number;
  estado?: string;
  horarios_disponibles?: string;
  notas?: string;
  activo?: boolean;
  clubId: string;
}

export interface UpdateCaddieDto extends Partial<CreateCaddieDto> {}

class CaddiesService {
  private baseUrl = '/caddies';

  async getAll(clubId?: string): Promise<Caddie[]> {
    const params = clubId ? `?clubId=${clubId}` : '';
    const response = await api.get(`${this.baseUrl}${params}`) as { data: Caddie[] };
    return response.data;
  }

  async getById(id: string): Promise<Caddie> {
    const response = await api.get(`${this.baseUrl}/${id}`) as { data: Caddie };
    return response.data;
  }

  async create(data: CreateCaddieDto): Promise<Caddie> {
    const response = await api.post(this.baseUrl, data) as { data: Caddie };
    return response.data;
  }

  async update(id: string, data: UpdateCaddieDto): Promise<Caddie> {
    const response = await api.patch(`${this.baseUrl}/${id}`, data) as { data: Caddie };
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  async getAvailable(clubId: string, fecha: string, horaInicio: string, horaFin: string): Promise<Caddie[]> {
    const response = await api.get(`${this.baseUrl}/disponibles`, {
      params: { clubId, fecha, horaInicio, horaFin }
    }) as { data: Caddie[] };
    return response.data;
  }

  async updateEstado(id: string, estado: string): Promise<Caddie> {
    const response = await api.patch(`${this.baseUrl}/${id}/estado`, { estado }) as { data: Caddie };
    return response.data;
  }
}

export const caddiesService = new CaddiesService();