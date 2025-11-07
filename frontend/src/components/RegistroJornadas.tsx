import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Eye, 
  Search, 
  Filter,
  FileText,
  Users,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  X,
  Download,
  MapPin,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { JornadasService } from '../services/jornadasService';

// Interfaces simplificadas para el registro de jornadas
interface RegistroJornadaDiaria {
  id: string;
  fecha: string;
  nombre: string;
  descripcion: string;
  estado: 'activa' | 'cerrada';
  jornadas_detalle: JornadaRegistroDetalle[];
  estadisticas: {
    total_turnos: number;
    turnos_completados: number;
    turnos_pendientes: number;
    duracion_total: string;
  };
  created_at: string;
}

interface JornadaRegistroDetalle {
  codigo: string;
  nombre: string;
  hora_inicio: string;
  hora_fin: string;
  turnos: TurnoDetalle[];
  estadisticas: {
    total_turnos: number;
    turnos_completados: number;
    turnos_en_progreso: number;
    duracion_promedio: string;
    canchas_mas_usadas: string[];
  };
}

interface TurnoDetalle {
  id: string;
  nombre: string;
  hora_inicio: string;
  hora_fin: string;
  cancha: string;
  estado: 'completado' | 'en_progreso' | 'pendiente';
  notas?: string;
}

export default function RegistroJornadas() {
  const { success, error, warning } = useToast();
  const [loading, setLoading] = useState(false);
  const [registros, setRegistros] = useState<RegistroJornadaDiaria[]>([]);
  const [filtros, setFiltros] = useState({
    fecha: new Date().toISOString().split('T')[0],
    estado: 'todos'
  });

  // Datos de ejemplo para mostrar la vista
  const jornadasEjemplo: JornadaRegistroDetalle[] = [
    {
      codigo: 'A',
      nombre: 'Jornada Mañana',
      hora_inicio: '07:00',
      hora_fin: '12:00',
      turnos: [],
      estadisticas: {
        total_turnos: 0,
        turnos_completados: 0,
        turnos_en_progreso: 0,
        duracion_promedio: '0h',
        canchas_mas_usadas: []
      }
    },
    {
      codigo: 'B',
      nombre: 'Jornada Tarde',
      hora_inicio: '15:00',
      hora_fin: '21:00',
      turnos: [],
      estadisticas: {
        total_turnos: 0,
        turnos_completados: 0,
        turnos_en_progreso: 0,
        duracion_promedio: '0h',
        canchas_mas_usadas: []
      }
    }
  ];

  // Funciones de conversión de hora
  const convertirA12Horas = (hora24: string): string => {
    if (!hora24) return '12:00 AM';
    const [horas, minutos] = hora24.split(':');
    const hora = parseInt(horas);
    const periodo = hora >= 12 ? 'PM' : 'AM';
    const hora12 = hora === 0 ? 12 : hora > 12 ? hora - 12 : hora;
    return `${hora12}:${minutos} ${periodo}`;
  };

  // Cargar datos reales del backend
  const cargarRegistros = async () => {
    try {
      setLoading(true);
      console.log('🔍 Cargando registros de jornadas...');
      
      // Obtener registros de jornadas del backend
      const registrosData = await JornadasService.getRegistroJornadaDiaria(
        filtros.fecha,
        filtros.fecha
      );
      
      console.log('✅ Registros cargados:', registrosData);
      setRegistros(registrosData);
      
    } catch (error: any) {
      console.error('❌ Error al cargar registros:', error);
      error(`Error al cargar registros: ${error.message || 'Error desconocido'}`);
      setRegistros([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarRegistros();
  }, [filtros.fecha, filtros.estado]);

  // Colores para las jornadas (igual que en ConfiguracionJornadas)
  const coloresJornada = [
    { bg: 'bg-blue-500', text: 'text-blue-300', ring: 'ring-blue-500' },
    { bg: 'bg-green-500', text: 'text-green-300', ring: 'ring-green-500' },
    { bg: 'bg-purple-500', text: 'text-purple-300', ring: 'ring-purple-500' },
    { bg: 'bg-yellow-500', text: 'text-yellow-300', ring: 'ring-yellow-500' },
    { bg: 'bg-red-500', text: 'text-red-300', ring: 'ring-red-500' },
  ];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Cargando registro de jornadas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-8 h-8 text-green-500" />
            Registro de Jornadas
          </h1>
          <p className="text-gray-400 mt-1">
            Gestiona y supervisa los turnos de cada jornada configurada
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Fecha</label>
            <input
              type="date"
              value={filtros.fecha}
              onChange={(e) => setFiltros(prev => ({ ...prev, fecha: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Estado</label>
            <select
              value={filtros.estado}
              onChange={(e) => setFiltros(prev => ({ ...prev, estado: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos los estados</option>
              <option value="activa">Jornadas activas</option>
              <option value="cerrada">Jornadas cerradas</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button 
              onClick={cargarRegistros}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Configuración Activa */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Jornadas del Sistema</h3>
        <p className="text-gray-400 mb-6">Vista general de las jornadas configuradas en el sistema</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jornadasEjemplo.map((jornada: JornadaRegistroDetalle, index: number) => {
            const color = coloresJornada[index % coloresJornada.length];
            return (
              <div key={`jornada-${jornada.codigo}-${index}`} className={`bg-gray-700 rounded-lg p-4 ring-1 ${color.ring}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-3 h-3 ${color.bg} rounded-full`}></div>
                  <span className="text-white font-medium">Jornada {jornada.codigo}</span>
                  <span className="text-xs bg-gray-600 px-2 py-0.5 rounded text-gray-300">
                    {jornada.codigo}
                  </span>
                </div>
                
                <h4 className="text-white font-medium mb-2">{jornada.nombre}</h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="w-4 h-4" />
                    <span>{convertirA12Horas(jornada.hora_inicio)} - {convertirA12Horas(jornada.hora_fin)}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">0</div>
                      <div className="text-xs text-gray-400">Turnos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">0</div>
                      <div className="text-xs text-gray-400">Completados</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-400">0</div>
                      <div className="text-xs text-gray-400">Pendientes</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-600">
                  <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    Ver Detalles
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Registros de Jornadas */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-white">Registros del Día: {filtros.fecha}</h3>
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
        
        {registros.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-400 mb-2">Sin registros</h4>
            <p className="text-gray-500">No hay registros de jornadas para la fecha seleccionada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {registros.map((registro) => (
              <div key={registro.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-medium">{registro.fecha}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      registro.estado === 'activa' 
                        ? 'bg-green-900 text-green-300' 
                        : 'bg-gray-900 text-gray-300'
                    }`}>
                      {registro.estado === 'activa' ? 'Activa' : 'Cerrada'}
                    </span>
                  </div>
                  <button className="text-blue-400 hover:text-blue-300">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">{registro.estadisticas.total_turnos}</div>
                    <div className="text-gray-400">Total Turnos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">{registro.estadisticas.turnos_completados}</div>
                    <div className="text-gray-400">Completados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-400">{registro.estadisticas.turnos_pendientes}</div>
                    <div className="text-gray-400">Pendientes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">{registro.estadisticas.duracion_total}</div>
                    <div className="text-gray-400">Duración Total</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}