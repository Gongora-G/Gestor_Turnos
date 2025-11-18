import { apiService } from './api';
import type { 
  ConfiguracionJornadas, 
  RegistroJornadaDiaria, 
  JornadaConfig,
  FormularioJornada
} from '../types/jornadas-config';

export class ConfiguracionJornadasService {
  
  /**
   * Obtener la configuración de jornadas activa
   */
  static async obtenerConfiguracionActiva(): Promise<ConfiguracionJornadas | null> {
    try {
      const response = await apiService.get<ConfiguracionJornadas>('/jornadas/configuracion-activa');
      return response;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.log('No hay configuración activa');
        return null;
      }
      console.error('Error obteniendo configuración activa:', error);
      throw new Error('Error al obtener la configuración activa de jornadas');
    }
  }

  /**
   * Crear una nueva configuración completa de jornadas
   */
  static async crearConfiguracion(data: {
    nombre: string;
    descripcion?: string;
    esquema_tipo: string;
    activa?: boolean;
    dias_aplicables?: string[];
    jornadas: any[];
  }): Promise<ConfiguracionJornadas> {
    try {
      console.log('📤 Enviando configuración al backend:', JSON.stringify(data, null, 2));
      const response = await apiService.post<ConfiguracionJornadas>('/jornadas/configuracion-completa', data);
      return response;
    } catch (error) {
      console.error('Error creando configuración:', error);
      throw error;
    }
  }

  /**
   * Actualizar una configuración existente
   */
  static async actualizarConfiguracion(id: number, data: {
    nombre: string;
    descripcion?: string;
    esquema_tipo: string;
    activa?: boolean;
    dias_aplicables?: string[];
    jornadas: any[];
  }): Promise<ConfiguracionJornadas> {
    try {
      console.log('📤 Actualizando configuración en backend:', JSON.stringify(data, null, 2));
      const response = await apiService.put<ConfiguracionJornadas>('/jornadas/configuracion-completa', data);
      return response;
    } catch (error) {
      console.error('Error actualizando configuración:', error);
      throw error;
    }
  }

  /**
   * Obtener todas las jornadas configuradas
   */
  static async obtenerTodasLasJornadas(): Promise<JornadaConfig[]> {
    try {
      const response = await apiService.get<JornadaConfig[]>('/jornadas/config');
      return response;
    } catch (error) {
      console.error('Error obteniendo jornadas:', error);
      throw new Error('Error al obtener las jornadas configuradas');
    }
  }

  /**
   * Crear nueva jornada
   */
  static async crearJornada(dto: FormularioJornada): Promise<JornadaConfig> {
    try {
      console.log('📋 Datos a enviar:', dto);
      const response = await apiService.post<JornadaConfig>('/jornadas/config', dto);
      console.log('✅ Respuesta del servidor:', response);
      return response;
    } catch (error: any) {
      console.error('❌ Error creando jornada:', error);
      throw new Error(error.response?.data?.message || 'Error al crear la jornada');
    }
  }

  /**
   * Actualizar jornada existente
   */
  static async actualizarJornada(id: string, dto: Partial<FormularioJornada>): Promise<JornadaConfig> {
    try {
      const response = await apiService.put<JornadaConfig>(`/jornadas/config/${id}`, dto);
      return response;
    } catch (error: any) {
      console.error('Error actualizando jornada:', error);
      throw new Error(error.response?.data?.message || 'Error al actualizar la jornada');
    }
  }

  /**
   * Eliminar jornada
   */
  static async eliminarJornada(id: string): Promise<void> {
    try {
      await apiService.delete<void>(`/jornadas/config/${id}`);
    } catch (error: any) {
      console.error('Error eliminando jornada:', error);
      if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'No se puede eliminar la jornada activa');
      }
      throw new Error('Error al eliminar la jornada');
    }
  }

  /**
   * Obtener registros históricos
   */
  static async obtenerRegistrosHistoricos(fechaInicio?: string, fechaFin?: string): Promise<RegistroJornadaDiaria[]> {
    try {
      const response = await apiService.get<RegistroJornadaDiaria[]>(`/jornadas/historial`, {
        params: { fechaInicio, fechaFin }
      });
      return response;
    } catch (error) {
      console.error('Error obteniendo registros históricos:', error);
      throw new Error('Error al obtener el historial de jornadas');
    }
  }

  /**
   * Obtener plantillas predefinidas (helper del frontend)
   */
  static obtenerPlantillasEsquemas() {
    return {
      una: {
        nombre: 'Una Jornada',
        descripcion: 'Jornada única durante todo el día',
        jornadas: [
          {
            codigo: 'A',
            nombre: 'Jornada Única',
            hora_inicio: '07:00',
            hora_fin: '21:00',
            color: '#10b981'
          }
        ]
      },
      dos: {
        nombre: 'Dos Jornadas',
        descripcion: 'Jornada de mañana y tarde',
        jornadas: [
          {
            codigo: 'A',
            nombre: 'Jornada A',
            hora_inicio: '07:00',
            hora_fin: '12:00',
            color: '#10b981'
          },
          {
            codigo: 'B',
            nombre: 'Jornada B',
            hora_inicio: '15:00',
            hora_fin: '21:00',
            color: '#f59e0b'
          }
        ]
      },
      tres: {
        nombre: 'Tres Jornadas',
        descripcion: 'Jornada de mañana, tarde y noche',
        jornadas: [
          {
            codigo: 'A',
            nombre: 'Jornada A',
            hora_inicio: '07:00',
            hora_fin: '12:00',
            color: '#10b981'
          },
          {
            codigo: 'B',
            nombre: 'Jornada B',
            hora_inicio: '13:00',
            hora_fin: '18:00',
            color: '#f59e0b'
          },
          {
            codigo: 'C',
            nombre: 'Jornada C',
            hora_inicio: '18:30',
            hora_fin: '22:00',
            color: '#ef4444'
          }
        ]
      }
    };
  }
}

export default ConfiguracionJornadasService;