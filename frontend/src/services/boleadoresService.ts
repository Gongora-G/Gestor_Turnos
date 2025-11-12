import { apiService as api } from './api';

export interface Boleador {
  id: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  email?: string;
  nivel_juego: 'principiante' | 'intermedio' | 'avanzado' | 'profesional';
  deportes?: string;
  ranking_habilidad: number;
  tarifa_por_hora?: number;
  estado: 'disponible' | 'ocupado' | 'descanso' | 'inactivo';
  horarios_disponibles?: string;
  preferencias?: string;
  notas?: string;
  activo: boolean;
  clubId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBoleadorDto {
  nombre: string;
  apellido: string;
  telefono?: string;
  email?: string;
  nivel_juego?: string;
  deportes?: string;
  ranking_habilidad?: number;
  tarifa_por_hora?: number;
  estado?: string;
  horarios_disponibles?: string;
  preferencias?: string;
  notas?: string;
  activo?: boolean;
  clubId: string;
}

export interface UpdateBoleadorDto extends Partial<CreateBoleadorDto> {}

class BoleadoresService {
  private baseUrl = '/boleadores';

  async getAll(clubId?: string): Promise<Boleador[]> {
    const params = clubId ? `?clubId=${clubId}` : '';
    const response = await api.get(`${this.baseUrl}${params}`);
    return response.data;
  }

  async getById(id: string): Promise<Boleador> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async create(data: CreateBoleadorDto): Promise<Boleador> {
    const response = await api.post(this.baseUrl, data);
    return response.data;
  }

  async update(id: string, data: UpdateBoleadorDto): Promise<Boleador> {
    const response = await api.patch(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  async getAvailable(clubId: string, fecha: string, horaInicio: string, horaFin: string): Promise<Boleador[]> {
    const response = await api.get(`${this.baseUrl}/disponibles`, {
      params: { clubId, fecha, horaInicio, horaFin }
    });
    return response.data;
  }

  async getByNivel(clubId: string, nivel: string): Promise<Boleador[]> {
    const response = await api.get(`${this.baseUrl}/por-nivel`, {
      params: { clubId, nivel }
    });
    return response.data;
  }

  async updateEstado(id: string, estado: string): Promise<Boleador> {
    const response = await api.patch(`${this.baseUrl}/${id}/estado`, { estado });
    return response.data;
  }
}

export const boleadoresService = new BoleadoresService();