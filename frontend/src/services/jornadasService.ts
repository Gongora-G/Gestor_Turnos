import { apiService } from './api';
import type {
  JornadaConfig,
  ConfiguracionJornadas,
  RegistroJornadaDiaria,
  GuardarJornadaRequest,
  GuardarJornadaResponse,
  SiguienteJornada,
  FormularioJornada,
} from '../types/jornadas-config';

export class JornadasService {
  // 📅 CRUD Jornadas Config
  static async createJornada(jornadaData: FormularioJornada): Promise<JornadaConfig> {
    const response = await apiService.post<JornadaConfig>('/jornadas/config', jornadaData);
    return response;
  }

  static async getJornadas(): Promise<JornadaConfig[]> {
    const response = await apiService.get<JornadaConfig[]>('/jornadas/config');
    return response;
  }

  static async getJornada(id: string): Promise<JornadaConfig> {
    const response = await apiService.get<JornadaConfig>(`/jornadas/config/${id}`);
    return response;
  }

  static async updateJornada(id: string, jornadaData: Partial<FormularioJornada>): Promise<JornadaConfig> {
    const response = await apiService.put<JornadaConfig>(`/jornadas/config/${id}`, jornadaData);
    return response;
  }

  static async deleteJornada(id: string): Promise<{ message: string }> {
    const response = await apiService.delete<{ message: string }>(`/jornadas/config/${id}`);
    return response;
  }

  // ⚙️ Configuración General
  static async getConfiguracion(): Promise<ConfiguracionJornadas> {
    const response = await apiService.get<ConfiguracionJornadas>('/jornadas/configuracion');
    return response;
  }

  static async updateConfiguracion(config: Partial<ConfiguracionJornadas>): Promise<ConfiguracionJornadas> {
    const response = await apiService.put<ConfiguracionJornadas>('/jornadas/configuracion', config);
    return response;
  }

  // 🔄 Gestión de Jornada Actual
  static async getSiguienteJornada(): Promise<SiguienteJornada> {
    const response = await apiService.get<SiguienteJornada>('/jornadas/siguiente');
    return response;
  }

  static async activarSiguienteJornada(): Promise<{ jornadaAnterior: JornadaConfig; siguienteJornada: JornadaConfig }> {
    const response = await apiService.post<{ jornadaAnterior: JornadaConfig; siguienteJornada: JornadaConfig }>('/jornadas/activar-siguiente');
    return response;
  }

  static async getJornadaActualPorHorario(): Promise<JornadaConfig | null> {
    const response = await apiService.get<JornadaConfig | null>('/jornadas/actual-por-horario');
    return response;
  }

  // 🎯 NUEVO: Sistema de Registro de Jornadas
  static async getJornadaActual(): Promise<JornadaConfig | null> {
    const response = await apiService.get<JornadaConfig | null>('/jornadas/jornada-actual');
    return response;
  }

  // 💾 Guardar Jornada (Función principal del flujo)
  static async guardarJornada(data: GuardarJornadaRequest): Promise<GuardarJornadaResponse> {
    const response = await apiService.post<GuardarJornadaResponse>('/jornadas/guardar', data);
    return response;
  }

  // 🎯 NUEVO: Guardar jornada completa con todos los turnos
  static async guardarRegistroJornada(data: {
    jornadaConfigId: number;
    fecha: string;
    turnos: Array<{
      id: string;
      numeroCancha: number;
      horaInicio: string;
      horaFin: string;
      estado: string;
      clienteId?: string;
      clienteNombre?: string;
      monto?: number;
      metodoPago?: string;
    }>;
  }): Promise<{
    registroDiario: RegistroJornadaDiaria;
    siguienteJornada: JornadaConfig | null;
  }> {
    const response = await apiService.post<{
      registroDiario: RegistroJornadaDiaria;
      siguienteJornada: JornadaConfig | null;
    }>('/jornadas/guardar-jornada', data);
    return response;
  }

  // 📊 Historial y Reportes
  static async getHistorialJornadas(fechaInicio?: string, fechaFin?: string): Promise<RegistroJornadaDiaria[]> {
    const params = new URLSearchParams();
    if (fechaInicio) params.append('fechaInicio', fechaInicio);
    if (fechaFin) params.append('fechaFin', fechaFin);

    const response = await apiService.get<RegistroJornadaDiaria[]>(`/jornadas/historial?${params.toString()}`);
    return response;
  }

  static async getRegistroJornada(id: string): Promise<RegistroJornadaDiaria> {
    const response = await apiService.get<RegistroJornadaDiaria>(`/jornadas/registro/${id}`);
    return response;
  }

  /**
   * 🎯 NUEVO: Obtiene registros completos con jornadas y turnos
   * Este es el método principal para la vista "Registro de Jornadas"
   */
  static async getRegistrosCompletos(fecha?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (fecha) params.append('fecha', fecha);

    const response = await apiService.get<any[]>(`/jornadas/registros-completos?${params.toString()}`);
    return response;
  }

  // 🛠️ Templates y utilidades
  static async getTemplatesJornadas(): Promise<{ templates: Partial<JornadaConfig>[] }> {
    const response = await apiService.get<{ templates: Partial<JornadaConfig>[] }>('/jornadas/templates');
    return response;
  }

  static async getColoresDisponibles(): Promise<{ colores: { nombre: string; valor: string }[] }> {
    const response = await apiService.get<{ colores: { nombre: string; valor: string }[] }>('/jornadas/colores');
    return response;
  }

  // 🎯 Funciones auxiliares para el frontend
  static validarHorario(horaInicio: string, horaFin: string): { valida: boolean; error?: string } {
    if (!horaInicio || !horaFin) {
      return { valida: false, error: 'Ambas horas son requeridas' };
    }

    if (horaInicio >= horaFin) {
      return { valida: false, error: 'La hora de inicio debe ser menor que la hora de fin' };
    }

    return { valida: true };
  }

  static calcularDuracionJornada(horaInicio: string, horaFin: string): number {
    const [inicioHora, inicioMinuto] = horaInicio.split(':').map(Number);
    const [finHora, finMinuto] = horaFin.split(':').map(Number);

    const inicio = inicioHora * 60 + inicioMinuto;
    const fin = finHora * 60 + finMinuto;

    return fin - inicio; // retorna minutos
  }

  static formatearDuracion(minutos: number): string {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;

    if (horas === 0) return `${mins}min`;
    if (mins === 0) return `${horas}h`;
    return `${horas}h ${mins}min`;
  }

  static esHorarioActual(jornadaConfig: JornadaConfig): boolean {
    const ahora = new Date();
    const horaActual = ahora.toTimeString().slice(0, 5); // "HH:MM"
    const diaActual = JornadasService.getDiaSemanaActual();

    return (
      jornadaConfig.diasSemana.includes(diaActual) &&
      horaActual >= jornadaConfig.horario.horaInicio &&
      horaActual <= jornadaConfig.horario.horaFin
    );
  }

  static getDiaSemanaActual(): any {
    const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    return dias[new Date().getDay()];
  }

  static getTiempoRestanteJornada(jornadaConfig: JornadaConfig): number | null {
    if (!JornadasService.esHorarioActual(jornadaConfig)) {
      return null;
    }

    const ahora = new Date();
    const [finHora, finMinuto] = jornadaConfig.horario.horaFin.split(':').map(Number);
    
    const finJornada = new Date();
    finJornada.setHours(finHora, finMinuto, 0, 0);

    const diferencia = finJornada.getTime() - ahora.getTime();
    return Math.max(0, Math.floor(diferencia / 60000)); // retorna minutos
  }

  static formatearTiempoRestante(minutos: number): string {
    if (minutos <= 0) return 'Finalizada';
    
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;

    if (horas === 0) return `${mins} min restantes`;
    if (mins === 0) return `${horas}h restantes`;
    return `${horas}h ${mins}min restantes`;
  }

  // 🚀 Para migración desde turnos existentes
  static async migrarTurnosAJornada(jornadaConfigId: string, turnos: any[]): Promise<void> {
    // Esta función ayudará a migrar turnos existentes a una jornada específica
    // Se implementará cuando tengamos turnos activos
    console.log('Migrando turnos a jornada:', jornadaConfigId, turnos);
    // TODO: Implementar migración
  }
}

export default JornadasService;