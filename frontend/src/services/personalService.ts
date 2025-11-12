// Personal Service - Fixed version
import { apiService } from './api';

export interface CreateCaddieDto {
  nombre: string;
  apellido: string;
  telefono?: string;
  email?: string;
  nivel_experiencia?: number;
  nivel_juego?: string;
  ranking_habilidad?: number;
  tarifa_por_hora?: number;
  clubId: string;
}

export interface CreateBoleadorDto {
  nombre: string;
  apellido: string;
  telefono?: string;
  email?: string;
  nivel_experiencia?: number;
  nivel_juego?: string;
  ranking_habilidad?: number;
  tarifa_por_hora?: number;
  clubId: string;
}

export interface UpdateCaddieDto extends Partial<CreateCaddieDto> {}
export interface UpdateBoleadorDto extends Partial<CreateBoleadorDto> {}

export interface CaddieResponse {
  id: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  email?: string;
  nivel_experiencia?: number;
  nivel_juego?: string;
  ranking_habilidad?: number;
  tarifa_por_hora?: number;
  estado: 'disponible' | 'ocupado' | 'descanso' | 'inactivo';
  activo: boolean;
  clubId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoleadorResponse {
  id: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  email?: string;
  nivel_experiencia?: number;
  nivel_juego?: string;
  ranking_habilidad?: number;
  tarifa_por_hora?: number;
  estado: 'disponible' | 'ocupado' | 'descanso' | 'inactivo';
  activo: boolean;
  clubId: string;
  createdAt: string;
  updatedAt: string;
}

class PersonalService {
  async getAllCaddies(): Promise<CaddieResponse[]> {
    return await apiService.get<CaddieResponse[]>('/caddies');
  }

  async getCaddieById(id: string): Promise<CaddieResponse> {
    return await apiService.get<CaddieResponse>(`/caddies/${id}`);
  }

  async createCaddie(data: CreateCaddieDto): Promise<CaddieResponse> {
    return await apiService.post<CaddieResponse>('/caddies', data);
  }

  async updateCaddie(id: string, data: UpdateCaddieDto): Promise<CaddieResponse> {
    return await apiService.patch<CaddieResponse>(`/caddies/${id}`, data);
  }

  async deleteCaddie(id: string): Promise<void> {
    await apiService.delete(`/caddies/${id}`);
  }

  async getAllBoleadores(): Promise<BoleadorResponse[]> {
    return await apiService.get<BoleadorResponse[]>('/boleadores');
  }

  async getBoleadorById(id: string): Promise<BoleadorResponse> {
    return await apiService.get<BoleadorResponse>(`/boleadores/${id}`);
  }

  async createBoleador(data: CreateBoleadorDto): Promise<BoleadorResponse> {
    return await apiService.post<BoleadorResponse>('/boleadores', data);
  }

  async updateBoleador(id: string, data: UpdateBoleadorDto): Promise<BoleadorResponse> {
    return await apiService.patch<BoleadorResponse>(`/boleadores/${id}`, data);
  }

  async deleteBoleador(id: string): Promise<void> {
    await apiService.delete(`/boleadores/${id}`);
  }

  async getAvailablePersonal(
    tipo: 'caddie' | 'boleador',
    fecha: string,
    hora: string
  ): Promise<CaddieResponse[] | BoleadorResponse[]> {
    const endpoint = tipo === 'caddie' ? 'caddies' : 'boleadores';
    return await apiService.get(`/${endpoint}/available?fecha=${fecha}&hora=${hora}`);
  }
}

export const personalService = new PersonalService();