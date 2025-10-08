import { apiService } from './api';
import type { AuthResponse, LoginCredentials, RegisterData, User } from '../types';

export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);
    
    // Store token and user info
    localStorage.setItem('auth_token', response.access_token);
    localStorage.setItem('auth_user', JSON.stringify(response.user));
    
    return response;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/register', data);
    
    // Store token and user info
    localStorage.setItem('auth_token', response.access_token);
    localStorage.setItem('auth_user', JSON.stringify(response.user));
    
    return response;
  }

  async getProfile(): Promise<User> {
    return await apiService.get<User>('/auth/profile');
  }

  async validateToken(): Promise<{ valid: boolean; user: User }> {
    return await apiService.get<{ valid: boolean; user: User }>('/auth/validate');
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('auth_user');
    if (userStr) {
      try {
        return JSON.parse(userStr) as User;
      } catch (error) {
        console.error('Error parsing stored user:', error);
        return null;
      }
    }
    return null;
  }

  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    const user = this.getStoredUser();
    return !!(token && user);
  }
}

export const authService = new AuthService();