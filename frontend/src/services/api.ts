import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { ApiError } from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3002';
    console.log('🔧 API Service configurado con baseURL:', baseURL);
    
    this.api = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Add auth token
    this.api.interceptors.request.use(
      (config) => {
        console.log('📤 Enviando petición a:', config.method?.toUpperCase(), config.baseURL + config.url);
        console.log('📤 Datos de la petición:', config.data);
        
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error('❌ Error en request interceptor:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle errors
    this.api.interceptors.response.use(
      (response) => {
        console.log('✅ Respuesta recibida:', response.status, response.statusText);
        console.log('📥 Datos de respuesta:', response.data);
        return response;
      },
      (error) => {
        console.error('❌ Error en response interceptor:', error);
        console.error('❌ Error response:', error.response);
        console.error('❌ Error request:', error.request);
        console.error('❌ Error message:', error.message);
        
        if (error.response?.status === 401) {
          // Token expired or invalid
          console.log('🔒 Token inválido o expirado, limpiando autenticación...');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          sessionStorage.removeItem('auth_token');
          sessionStorage.removeItem('auth_user');
          // NO redirigir automáticamente, dejar que React Router maneje esto
          // window.location.href = '/login';
        }

        const apiError: ApiError = {
          message: error.response?.data?.message || error.message || 'Ocurrió un error inesperado',
          statusCode: error.response?.status || 500,
          error: error.response?.data?.error || 'Internal Server Error',
        };

        return Promise.reject(apiError);
      }
    );
  }

  // Generic GET request
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get<T>(url, config);
    return response.data;
  }

  // Generic POST request
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }

  // Generic PUT request
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.put<T>(url, data, config);
    return response.data;
  }

  // Generic PATCH request
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.patch<T>(url, data, config);
    return response.data;
  }

  // Generic DELETE request
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.delete<T>(url, config);
    return response.data;
  }
}

export const apiService = new ApiService();