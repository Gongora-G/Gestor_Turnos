import type { 
  TipoMembresia, 
  Cancha, 
  ConfiguracionClub,
  CreateTipoMembresiaDto,
  UpdateTipoMembresiaDto,
  CreateCanchaDto,
  UpdateCanchaDto,
  UpdateConfiguracionClubDto
} from '../types/configuracion';

const API_BASE_URL = 'http://localhost:3002'; // Puerto del auth-service

class ConfiguracionService {
  private async getAuthHeaders() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // ===== TIPOS DE MEMBRESÍA =====
  
  async getTiposMembresia(): Promise<TipoMembresia[]> {
    const response = await fetch(`${API_BASE_URL}/tipos-membresia`, {
      headers: await this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async createTipoMembresia(data: CreateTipoMembresiaDto): Promise<TipoMembresia> {
    const response = await fetch(`${API_BASE_URL}/tipos-membresia`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updateTipoMembresia(id: string, data: UpdateTipoMembresiaDto): Promise<TipoMembresia> {
    const response = await fetch(`${API_BASE_URL}/tipos-membresia/${id}`, {
      method: 'PATCH',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async deleteTipoMembresia(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tipos-membresia/${id}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `HTTP error! status: ${response.status}`);
    }
  }

  async toggleTipoMembresiaActive(id: string): Promise<TipoMembresia> {
    const response = await fetch(`${API_BASE_URL}/tipos-membresia/${id}/toggle-active`, {
      method: 'PATCH',
      headers: await this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // ===== CANCHAS =====
  
  async getCanchas(): Promise<Cancha[]> {
    const response = await fetch(`${API_BASE_URL}/canchas`, {
      headers: await this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getCanchasActivas(): Promise<Cancha[]> {
    const response = await fetch(`${API_BASE_URL}/canchas/active`, {
      headers: await this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async createCancha(data: CreateCanchaDto): Promise<Cancha> {
    const response = await fetch(`${API_BASE_URL}/canchas`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updateCancha(id: string, data: UpdateCanchaDto): Promise<Cancha> {
    const response = await fetch(`${API_BASE_URL}/canchas/${id}`, {
      method: 'PATCH',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async deleteCancha(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/canchas/${id}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `HTTP error! status: ${response.status}`);
    }
  }

  async toggleCanchaActive(id: string): Promise<Cancha> {
    const response = await fetch(`${API_BASE_URL}/canchas/${id}/toggle-active`, {
      method: 'PATCH',
      headers: await this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // ===== CONFIGURACIÓN DEL CLUB =====
  
  async getConfiguracionClub(): Promise<ConfiguracionClub> {
    const response = await fetch(`${API_BASE_URL}/configuracion`, {
      headers: await this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateConfiguracionClub(data: UpdateConfiguracionClubDto): Promise<ConfiguracionClub> {
    const response = await fetch(`${API_BASE_URL}/configuracion`, {
      method: 'PATCH',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getHorarios(): Promise<{ apertura: string; cierre: string; duracionTurno: number }> {
    const response = await fetch(`${API_BASE_URL}/configuracion/horarios`, {
      headers: await this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async isMantenimientoActivo(): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/configuracion/mantenimiento`, {
      headers: await this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }
}

// Exportar instancia singleton
export const configuracionService = new ConfiguracionService();
export default configuracionService;