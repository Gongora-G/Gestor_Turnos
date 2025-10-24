import { apiService } from './api';
import type { 
  Jornada, 
  JornadaBackend, 
  CreateJornadaDto, 
  UpdateJornadaDto,
  JornadasResponse,
  JornadaFilters,
  JornadaEstadisticas,
  TurnoJornada,
  ApiResponse
} from '../types';

class JornadasService {
  private readonly endpoint = '/jornadas';

  // Crear nueva jornada
  async crear(data: CreateJornadaDto): Promise<ApiResponse<Jornada>> {
    try {
      console.log('🆕 Creando jornada:', data);
      const response = await apiService.post<JornadaBackend>(this.endpoint, data);
      return {
        success: true,
        data: this.transformFromBackend(response),
      };
    } catch (error: any) {
      console.error('❌ Error creando jornada:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al crear la jornada',
      };
    }
  }

  // Obtener lista de jornadas con filtros y paginación
  async obtenerLista(filtros: JornadaFilters = {}): Promise<ApiResponse<JornadasResponse>> {
    try {
      console.log('📋 Obteniendo lista de jornadas con filtros:', filtros);
      
      const params = this.buildQueryParams(filtros);
      const response = await apiService.get<{
        jornadas: JornadaBackend[];
        total: number;
        totalPages: number;
      }>(`${this.endpoint}?${params}`);

      const transformedData: JornadasResponse = {
        jornadas: response.jornadas.map(jornada => this.transformFromBackend(jornada)),
        total: response.total,
        totalPages: response.totalPages
      };

      return {
        success: true,
        data: transformedData,
      };
    } catch (error: any) {
      console.error('❌ Error obteniendo jornadas:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener las jornadas',
      };
    }
  }

  // Obtener jornada por ID
  async obtenerPorId(id: string): Promise<ApiResponse<Jornada>> {
    try {
      console.log('🔍 Obteniendo jornada por ID:', id);
      const response = await apiService.get<JornadaBackend>(`${this.endpoint}/${id}`);
      return {
        success: true,
        data: this.transformFromBackend(response),
      };
    } catch (error: any) {
      console.error('❌ Error obteniendo jornada:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener la jornada',
      };
    }
  }

  // Actualizar jornada
  async actualizar(id: string, data: UpdateJornadaDto): Promise<ApiResponse<Jornada>> {
    try {
      console.log('✏️ Actualizando jornada:', { id, data });
      const response = await apiService.patch<JornadaBackend>(`${this.endpoint}/${id}`, data);
      return {
        success: true,
        data: this.transformFromBackend(response),
      };
    } catch (error: any) {
      console.error('❌ Error actualizando jornada:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al actualizar la jornada',
      };
    }
  }

  // Eliminar jornada
  async eliminar(id: string): Promise<ApiResponse<void>> {
    try {
      console.log('🗑️ Eliminando jornada:', id);
      await apiService.delete(`${this.endpoint}/${id}`);
      return {
        success: true,
        data: undefined,
      };
    } catch (error: any) {
      console.error('❌ Error eliminando jornada:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al eliminar la jornada',
      };
    }
  }

  // Alternar estado activa
  async toggleActiva(id: string): Promise<ApiResponse<Jornada>> {
    try {
      console.log('🔄 Cambiando estado de jornada:', id);
      const response = await apiService.patch<JornadaBackend>(`${this.endpoint}/${id}/toggle-activa`);
      return {
        success: true,
        data: this.transformFromBackend(response),
      };
    } catch (error: any) {
      console.error('❌ Error cambiando estado de jornada:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cambiar el estado de la jornada',
      };
    }
  }

  // Obtener jornadas por fecha específica
  async obtenerPorFecha(fecha: string): Promise<ApiResponse<Jornada[]>> {
    try {
      console.log('📅 Obteniendo jornadas por fecha:', fecha);
      const response = await apiService.get<JornadaBackend[]>(`${this.endpoint}/fecha/${fecha}`);
      return {
        success: true,
        data: response.map(jornada => this.transformFromBackend(jornada)),
      };
    } catch (error: any) {
      console.error('❌ Error obteniendo jornadas por fecha:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener las jornadas por fecha',
      };
    }
  }

  // Obtener estadísticas
  async obtenerEstadisticas(): Promise<ApiResponse<JornadaEstadisticas>> {
    try {
      console.log('📊 Obteniendo estadísticas de jornadas');
      const response = await apiService.get<JornadaEstadisticas>(`${this.endpoint}/estadisticas`);
      return {
        success: true,
        data: response,
      };
    } catch (error: any) {
      console.error('❌ Error obteniendo estadísticas:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener las estadísticas',
      };
    }
  }

  // Crear jornada desde turnos actuales
  async crearDesdeActuales(turnos: any[], fecha?: string): Promise<ApiResponse<Jornada>> {
    try {
      const fechaJornada = fecha || new Date().toISOString().split('T')[0];
      const nombreJornada = this.generarNombreJornada(new Date(fechaJornada));
      
      // Transformar turnos al formato simplificado
      const datosTurnos: TurnoJornada[] = turnos.map(turno => ({
        id: turno.id,
        cancha: turno.cancha?.nombre || 'Sin cancha',
        numeroCancha: turno.cancha?.numero?.toString(),
        fecha: turno.fecha,
        horaInicio: turno.horaInicio,
        horaFin: turno.horaFin,
        socio: turno.socio?.nombre || 'Sin socio',
        caddie: turno.caddie?.nombre,
        precio: turno.precio || 0,
        estado: turno.estado,
        observaciones: turno.observaciones,
        fechaCreacion: turno.fechaCreacion
      }));

      const createData: CreateJornadaDto = {
        fechaJornada,
        nombreJornada,
        datosTurnos,
        totalTurnos: datosTurnos.length,
        observaciones: `Jornada guardada automáticamente con ${datosTurnos.length} turnos`,
        activa: true
      };

      return await this.crear(createData);
    } catch (error: any) {
      console.error('❌ Error creando jornada desde turnos actuales:', error);
      return {
        success: false,
        error: 'Error al crear la jornada desde los turnos actuales',
      };
    }
  }

  // Transformar datos del backend al frontend
  private transformFromBackend(data: JornadaBackend): Jornada {
    return {
      id: data.id,
      fechaJornada: typeof data.fechaJornada === 'string' 
        ? data.fechaJornada 
        : data.fechaJornada.toISOString().split('T')[0],
      nombreJornada: data.nombreJornada,
      datosTurnos: Array.isArray(data.datosTurnos) ? data.datosTurnos : [],
      totalTurnos: data.totalTurnos,
      observaciones: data.observaciones,
      activa: data.activa,
      fechaCreacion: typeof data.fechaCreacion === 'string' 
        ? data.fechaCreacion 
        : data.fechaCreacion.toISOString(),
      fechaActualizacion: typeof data.fechaActualizacion === 'string' 
        ? data.fechaActualizacion 
        : data.fechaActualizacion.toISOString(),
      usuarioCreacion: data.usuarioCreacion,
      usuarioActualizacion: data.usuarioActualizacion
    };
  }

  // Construir parámetros de consulta
  private buildQueryParams(filtros: JornadaFilters): string {
    const params = new URLSearchParams();
    
    if (filtros.page) params.append('page', filtros.page.toString());
    if (filtros.limit) params.append('limit', filtros.limit.toString());
    if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
    if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
    if (filtros.busqueda) params.append('busqueda', filtros.busqueda);
    if (filtros.activa !== undefined) params.append('activa', filtros.activa.toString());
    
    return params.toString();
  }

  // Generar nombre automático de jornada
  private generarNombreJornada(fecha: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    const fechaFormateada = fecha.toLocaleDateString('es-ES', options);
    return `Jornada ${fechaFormateada}`;
  }
}

export const jornadasService = new JornadasService();