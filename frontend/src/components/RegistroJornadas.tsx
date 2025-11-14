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
  ChevronDown,
  BarChart3,
  Timer
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { Modal } from './Modal';
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
  const [jornadasSistema, setJornadasSistema] = useState<any[]>([]);
  const [loadingJornadas, setLoadingJornadas] = useState(false);
  const [jornadaSeleccionada, setJornadaSeleccionada] = useState<any>(null);
  const [modalDetallesAbierto, setModalDetallesAbierto] = useState(false);
  const [estadisticasJornada, setEstadisticasJornada] = useState<any>(null);
  const [loadingEstadisticas, setLoadingEstadisticas] = useState(false);
  
  // Nuevos estados para vista por días
  const [modalDiaAbierto, setModalDiaAbierto] = useState(false);
  const [diaSeleccionado, setDiaSeleccionado] = useState<string>('');
  const [registrosPorDia, setRegistrosPorDia] = useState<{[fecha: string]: any[]}>({});
  const [jornadasSistemaColapsado, setJornadasSistemaColapsado] = useState(true);
  const [estadisticasJornadas, setEstadisticasJornadas] = useState<{[jornadaId: string]: any}>({});
  const [loadingEstadisticasJornadas, setLoadingEstadisticasJornadas] = useState(false);
  
  // Estados para eliminación
  const [modalConfirmarEliminar, setModalConfirmarEliminar] = useState(false);
  const [registroAEliminar, setRegistroAEliminar] = useState<any>(null);
  
  // Estados para papelera
  const [modalPapeleraAbierto, setModalPapeleraAbierto] = useState(false);
  const [registrosPapelera, setRegistrosPapelera] = useState<any[]>([]);
  const [loadingPapelera, setLoadingPapelera] = useState(false);
  
  // Estados para eliminar día completo
  const [modalEliminarDia, setModalEliminarDia] = useState(false);
  const [diaAEliminar, setDiaAEliminar] = useState<{fecha: string; registros: any[]} | null>(null);
  
  // Estados para eliminación permanente y vaciar papelera
  const [modalEliminarPermanente, setModalEliminarPermanente] = useState(false);
  const [registroEliminarPermanente, setRegistroEliminarPermanente] = useState<any | null>(null);
  const [modalVaciarPapelera, setModalVaciarPapelera] = useState(false);
  
  const [filtros, setFiltros] = useState({
    fechaInicio: (() => {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() - 9); // Últimos 10 días (hoy + 9 anteriores)
      return fecha.toISOString().split('T')[0];
    })(),
    fechaFin: new Date().toISOString().split('T')[0],
    estado: 'todos'
  });

  // Funciones de conversión de hora
  const convertirA12Horas = (hora24: string): string => {
    if (!hora24) return '12:00 AM';
    const [horas, minutos] = hora24.split(':');
    const hora = parseInt(horas);
    const periodo = hora >= 12 ? 'PM' : 'AM';
    const hora12 = hora === 0 ? 12 : hora > 12 ? hora - 12 : hora;
    return `${hora12}:${minutos} ${periodo}`;
  };

  // Cargar jornadas reales del sistema
  const cargarJornadasSistema = async () => {
    try {
      setLoadingJornadas(true);
      console.log('🔍 Cargando jornadas del sistema...');
      
      const jornadasData = await JornadasService.obtenerJornadasConfiguradas();
      console.log('✅ Jornadas del sistema cargadas:', jornadasData);
      setJornadasSistema(jornadasData);
      
      // Las estadísticas se cargarán solo cuando el usuario expanda la sección
      
    } catch (error: any) {
      console.error('❌ Error al cargar jornadas del sistema:', error);
      setJornadasSistema([]);
    } finally {
      setLoadingJornadas(false);
    }
  };

  // Cargar estadísticas detalladas de una jornada
  const cargarEstadisticasJornada = async (jornada: any) => {
    try {
      setLoadingEstadisticas(true);
      console.log('📊 Cargando estadísticas para jornada:', jornada.nombre, 'ID:', jornada.id);
      
      // Obtener estadísticas de la jornada (último mes)
      const fechaHoy = new Date().toISOString().split('T')[0];
      const fechaHaceUnMes = new Date();
      fechaHaceUnMes.setMonth(fechaHaceUnMes.getMonth() - 1);
      const fechaInicio = fechaHaceUnMes.toISOString().split('T')[0];
      
      console.log('📅 Período de consulta:', fechaInicio, 'a', fechaHoy);
      
      const estadisticas = await JornadasService.getEstadisticasJornada(
        jornada.id,
        fechaInicio,
        fechaHoy
      );
      
      console.log('✅ Estadísticas cargadas:', estadisticas);
      
      // Si no hay estadísticas, crear un objeto vacío con información básica de la jornada
      if (!estadisticas) {
        const estadisticasVacias = {
          jornada: {
            id: jornada.id,
            codigo: jornada.codigo,
            nombre: jornada.nombre,
            horario: `${jornada.horaInicio} - ${jornada.horaFin}`,
            color: jornada.color || '#3b82f6'
          },
          periodo: {
            fechaInicio,
            fechaFin: fechaHoy,
            diasConActividad: 0
          },
          turnos: {
            total: 0,
            completados: 0,
            enProgreso: 0,
            promedioPorDia: 0
          },
          tiempo: {
            totalHoras: 0,
            promedioHorasPorDia: 0
          },
          eficiencia: {
            tasaCompletado: 0,
            tasaProgreso: 0
          },
          mensaje: 'Sin registros en el período seleccionado'
        };
        setEstadisticasJornada(estadisticasVacias);
      } else {
        setEstadisticasJornada(estadisticas);
      }
      
    } catch (error: any) {
      console.error('❌ Error al cargar estadísticas:', error);
      
      // Crear estadísticas vacías en caso de error
      const estadisticasError = {
        jornada: {
          id: jornada.id,
          codigo: jornada.codigo,
          nombre: jornada.nombre,
          horario: `${jornada.horaInicio} - ${jornada.horaFin}`,
          color: jornada.color || '#3b82f6'
        },
        periodo: {
          fechaInicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          fechaFin: new Date().toISOString().split('T')[0],
          diasConActividad: 0
        },
        turnos: {
          total: 0,
          completados: 0,
          enProgreso: 0,
          promedioPorDia: 0
        },
        tiempo: {
          totalHoras: 0,
          promedioHorasPorDia: 0
        },
        eficiencia: {
          tasaCompletado: 0,
          tasaProgreso: 0
        },
        error: true,
        mensaje: error.message || 'Error al cargar estadísticas'
      };
      setEstadisticasJornada(estadisticasError);
    } finally {
      setLoadingEstadisticas(false);
    }
  };

  // Abrir modal de detalles
  const abrirDetallesJornada = async (jornada: any) => {
    setJornadaSeleccionada(jornada);
    setModalDetallesAbierto(true);
    await cargarEstadisticasJornada(jornada);
  };

  // Abrir modal de día
  const abrirDetallesDia = (fecha: string) => {
    setDiaSeleccionado(fecha);
    setModalDiaAbierto(true);
  };

  // 🗑️ Funciones de eliminación
  const confirmarEliminarRegistro = (registro: any) => {
    console.error('🗑️ DEBUG CONFIRMAR - Registro completo:', registro);
    console.error('🗑️ DEBUG CONFIRMAR - ID del registro:', registro.id);
    console.error('🗑️ DEBUG CONFIRMAR - Tipo de ID:', typeof registro.id);
    console.error('🗑️ DEBUG CONFIRMAR - Todas las propiedades:', Object.keys(registro));
    setRegistroAEliminar(registro);
    setModalConfirmarEliminar(true);
  };

  const eliminarRegistro = async () => {
    if (!registroAEliminar) return;

    try {
      setLoading(true);
      console.error('🗑️ DEBUG - Eliminando registro:', registroAEliminar);
      console.error('🗑️ DEBUG - ID a eliminar:', registroAEliminar.id);
      console.error('🗑️ DEBUG - Tipo de ID:', typeof registroAEliminar.id);
      await JornadasService.eliminarRegistroDiario(registroAEliminar.id);
      
      success(
        '🗑️ Registro movido a papelera',
        'El registro se eliminará permanentemente en 30 días. Puedes restaurarlo desde la papelera.'
      );

      // Recargar registros
      await cargarRegistros();
      
      setModalConfirmarEliminar(false);
      setRegistroAEliminar(null);
      setModalDiaAbierto(false); // Cerrar el modal de detalles también
    } catch (err: any) {
      error('Error', err.response?.data?.message || 'No se pudo eliminar el registro');
    } finally {
      setLoading(false);
    }
  };

  // 📋 Funciones de papelera
  const cargarPapelera = async () => {
    try {
      setLoadingPapelera(true);
      const registros = await JornadasService.obtenerPapelera();
      setRegistrosPapelera(registros);
    } catch (err: any) {
      error('Error', 'No se pudo cargar la papelera');
    } finally {
      setLoadingPapelera(false);
    }
  };

  const abrirPapelera = async () => {
    setModalPapeleraAbierto(true);
    await cargarPapelera();
  };

  const restaurarRegistro = async (registroId: string) => {
    try {
      setLoading(true);
      await JornadasService.restaurarRegistroDiario(registroId);
      
      success(
        '♻️ Registro restaurado',
        'El registro ha sido restaurado correctamente'
      );

      // Recargar papelera y registros
      await cargarPapelera();
      await cargarRegistros();
    } catch (err: any) {
      error('Error', err.response?.data?.message || 'No se pudo restaurar el registro');
    } finally {
      setLoading(false);
    }
  };

  const confirmarEliminarPermanente = (registro: any) => {
    setRegistroEliminarPermanente(registro);
    setModalEliminarPermanente(true);
  };

  const eliminarPermanentemente = async () => {
    if (!registroEliminarPermanente) return;

    try {
      setLoading(true);
      await JornadasService.eliminarPermanentemente(registroEliminarPermanente.id);
      
      success(
        '💥 Registro eliminado permanentemente',
        'El registro ha sido eliminado definitivamente'
      );

      setModalEliminarPermanente(false);
      setRegistroEliminarPermanente(null);

      // Recargar papelera
      await cargarPapelera();
    } catch (err: any) {
      error('Error', err.response?.data?.message || 'No se pudo eliminar el registro');
    } finally {
      setLoading(false);
    }
  };

  const confirmarVaciarPapelera = () => {
    setModalVaciarPapelera(true);
  };

  const vaciarPapelera = async () => {
    try {
      setLoading(true);
      const resultado = await JornadasService.vaciarPapelera();
      
      success(
        '🗑️💥 Papelera vaciada',
        `Se eliminaron permanentemente ${resultado.eliminados} registros`
      );

      setModalVaciarPapelera(false);

      // Recargar papelera
      await cargarPapelera();
    } catch (err: any) {
      error('Error', err.response?.data?.message || 'No se pudo vaciar la papelera');
    } finally {
      setLoading(false);
    }
  };

  // Confirmar eliminación de día completo
  const confirmarEliminarDiaCompleto = (fecha: string, registros: any[]) => {
    setDiaAEliminar({ fecha, registros });
    setModalEliminarDia(true);
  };

  // Eliminar día completo
  const eliminarDiaCompleto = async () => {
    if (!diaAEliminar) return;

    try {
      setLoading(true);
      
      // Eliminar cada registro del día
      for (const registro of diaAEliminar.registros) {
        await JornadasService.eliminarRegistroDiario(registro.id);
      }

      success(
        '🗑️ Día completo movido a papelera',
        `Se movieron ${diaAEliminar.registros.length} jornadas a la papelera`
      );

      // Recargar registros y papelera
      await cargarRegistros();
      await cargarPapelera();
      
      setModalEliminarDia(false);
      setDiaAEliminar(null);
    } catch (err: any) {
      error('Error', err.response?.data?.message || 'No se pudo eliminar el día completo');
    } finally {
      setLoading(false);
    }
  };

  // Obtener resumen de un día
  const obtenerResumenDia = (fecha: string, registrosDia: any[]) => {
    const totalJornadas = registrosDia.length;
    const totalTurnos = registrosDia.reduce((sum, registro) => {
      return sum + (registro.estadisticas?.totalTurnos || 
                   registro.estadisticas?.total_turnos || 
                   registro.total_turnos || 
                   (registro.turnosRegistrados?.length || 0));
    }, 0);
    
    const turnosCompletados = registrosDia.reduce((sum, registro) => {
      return sum + (registro.estadisticas?.turnosCompletados || 
                   registro.estadisticas?.turnos_completados || 
                   registro.total_completados || 0);
    }, 0);

    return {
      totalJornadas,
      totalTurnos,
      turnosCompletados,
      turnosEnProgreso: totalTurnos - turnosCompletados,
      registros: registrosDia
    };
  };

  // Cargar estadísticas de todas las jornadas del sistema
  const cargarEstadisticasJornadas = async () => {
    if (jornadasSistema.length > 0) {
      await cargarEstadisticasJornadasConDatos(jornadasSistema);
    }
  };

  // Cargar estadísticas con datos de jornadas específicos
  const cargarEstadisticasJornadasConDatos = async (jornadas: any[]) => {
    try {
      setLoadingEstadisticasJornadas(true);
      console.log('📊 Cargando estadísticas de jornadas del sistema...');
      
      const estadisticasTemp: {[jornadaId: string]: any} = {};
      
      // Para cada jornada del sistema, obtener sus estadísticas
      for (const jornada of jornadas) {
        try {
          console.log(`📈 Cargando estadísticas para jornada ${jornada.codigo} (ID: ${jornada.id})...`);
          
          // Obtener estadísticas de los últimos 30 días
          const fechaHoy = new Date().toISOString().split('T')[0];
          const fechaHace30Dias = new Date();
          fechaHace30Dias.setDate(fechaHace30Dias.getDate() - 30);
          const fechaInicio = fechaHace30Dias.toISOString().split('T')[0];
          
          const estadisticas = await JornadasService.getEstadisticasJornada(
            jornada.id,
            fechaInicio,
            fechaHoy
          );
          
          console.log(`🔍 DEBUG - Estadísticas recibidas para ${jornada.codigo}:`, estadisticas);
          
          if (estadisticas && estadisticas.turnos) {
            estadisticasTemp[jornada.id] = {
              totalTurnos: estadisticas.turnos.total || 0,
              turnosCompletados: estadisticas.turnos.completados || 0,
              turnosEnProgreso: estadisticas.turnos.enProgreso || 0,
              diasConActividad: estadisticas.periodo?.diasConActividad || 0,
              promedioPorDia: estadisticas.turnos.promedioPorDia || 0
            };
          } else {
            // Si no hay estadísticas, crear un objeto vacío
            estadisticasTemp[jornada.id] = {
              totalTurnos: 0,
              turnosCompletados: 0,
              turnosEnProgreso: 0,
              diasConActividad: 0,
              promedioPorDia: 0
            };
          }
          
          console.log(`✅ Estadísticas cargadas para ${jornada.codigo}:`, estadisticasTemp[jornada.id]);
          
        } catch (error) {
          console.error(`❌ Error al cargar estadísticas para jornada ${jornada.codigo}:`, error);
          // En caso de error, poner estadísticas en 0
          estadisticasTemp[jornada.id] = {
            totalTurnos: 0,
            turnosCompletados: 0,
            turnosEnProgreso: 0,
            diasConActividad: 0,
            promedioPorDia: 0
          };
        }
      }
      
      setEstadisticasJornadas(estadisticasTemp);
      console.log('✅ Todas las estadísticas de jornadas cargadas:', estadisticasTemp);
      
    } catch (error: any) {
      console.error('❌ Error general al cargar estadísticas de jornadas:', error);
    } finally {
      setLoadingEstadisticasJornadas(false);
    }
  };

  // Cargar datos reales del backend
  const cargarRegistros = async () => {
    try {
      setLoading(true);
      console.log('🔍 Cargando registros de jornadas...');
      
      // Obtener registros de jornadas del backend para los últimos 10 días
      const registrosData = await JornadasService.getRegistroJornadaDiaria(
        filtros.fechaInicio,
        filtros.fechaFin
      );
      
      console.log('✅ Registros cargados:', registrosData);
      console.log('🔍 DEBUG - Primer registro completo:', registrosData[0]);
      console.log('🔍 DEBUG - Jornadas del sistema:', jornadasSistema);
      
      // Debug cada registro
      registrosData.forEach((registro, index) => {
        console.log(`📋 Registro ${index + 1}:`, {
          id: registro.id,
          fecha: registro.fecha,
          jornada_config_id: registro.jornada_config_id,
          jornadaConfigId: registro.jornadaConfigId,
          estadisticas: registro.estadisticas,
          total_turnos: registro.total_turnos,
          estado: registro.estado
        });
      });
      
      setRegistros(registrosData);
      
      // Organizar registros por día
      const registrosAgrupados: {[fecha: string]: any[]} = {};
      registrosData.forEach(registro => {
        const fecha = registro.fecha;
        if (!registrosAgrupados[fecha]) {
          registrosAgrupados[fecha] = [];
        }
        registrosAgrupados[fecha].push(registro);
      });
      
      setRegistrosPorDia(registrosAgrupados);
      console.log('📅 Registros agrupados por día:', registrosAgrupados);
      
    } catch (error: any) {
      console.error('❌ Error al cargar registros:', error);
      error(`Error al cargar registros: ${error.message || 'Error desconocido'}`);
      setRegistros([]);
      setRegistrosPorDia({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarRegistros();
    cargarJornadasSistema(); // Cargar jornadas del sistema al montar el componente
    cargarPapelera(); // Cargar papelera para mostrar el contador
  }, [filtros.fechaInicio, filtros.fechaFin, filtros.estado]);

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
        <div className="flex items-center gap-3">
          <button
            onClick={abrirPapelera}
            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors border border-red-500/30 relative"
          >
            <Trash2 className="w-4 h-4" />
            Papelera
            {registrosPapelera.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {registrosPapelera.length}
              </span>
            )}
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Fecha Inicio</label>
            <input
              type="date"
              value={filtros.fechaInicio}
              onChange={(e) => setFiltros(prev => ({ ...prev, fechaInicio: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Fecha Fin</label>
            <input
              type="date"
              value={filtros.fechaFin}
              onChange={(e) => setFiltros(prev => ({ ...prev, fechaFin: e.target.value }))}
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
        
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Mostrando: {filtros.fechaInicio} a {filtros.fechaFin}</span>
          </div>
          <button 
            onClick={() => {
              const hoy = new Date();
              const hace10Dias = new Date();
              hace10Dias.setDate(hoy.getDate() - 9);
              setFiltros(prev => ({
                ...prev,
                fechaInicio: hace10Dias.toISOString().split('T')[0],
                fechaFin: hoy.toISOString().split('T')[0]
              }));
            }}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Últimos 10 días
          </button>
        </div>
      </div>

      {/* Registros por Días - Vista Principal */}
      {/* Registros por Días - Vista Principal */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-white">Registros por Días ({filtros.fechaInicio} - {filtros.fechaFin})</h3>
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar Todo
          </button>
        </div>
        
        {Object.keys(registrosPorDia).length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-400 mb-2">Sin registros</h4>
            <p className="text-gray-500">No hay registros de jornadas para el período seleccionado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(registrosPorDia)
              .sort(([fechaA], [fechaB]) => fechaB.localeCompare(fechaA)) // Más reciente primero
              .map(([fecha, registrosDia]) => {
                const resumen = obtenerResumenDia(fecha, registrosDia);
                const fechaObj = new Date(fecha + 'T00:00:00');
                const esHoy = fecha === new Date().toISOString().split('T')[0];
                const esAyer = fecha === new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                
                let etiquetaDia = '';
                if (esHoy) etiquetaDia = '(Hoy)';
                else if (esAyer) etiquetaDia = '(Ayer)';

                return (
                  <div key={fecha} className="bg-gray-700 rounded-lg p-5 border border-gray-600 hover:border-blue-500 transition-all cursor-pointer group">
                    {/* Header del día */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                          {fechaObj.toLocaleDateString('es-ES', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'short' 
                          })}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {fecha} {etiquetaDia}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400">Jornadas</div>
                        <div className="text-lg font-bold text-blue-400">{resumen.totalJornadas}</div>
                      </div>
                    </div>

                    {/* Estadísticas del día */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center bg-gray-800 rounded-lg p-3">
                        <div className="text-lg font-bold text-green-400">{resumen.totalTurnos}</div>
                        <div className="text-xs text-gray-400">Total Turnos</div>
                      </div>
                      <div className="text-center bg-gray-800 rounded-lg p-3">
                        <div className="text-lg font-bold text-blue-400">{resumen.turnosCompletados}</div>
                        <div className="text-xs text-gray-400">Completados</div>
                      </div>
                      <div className="text-center bg-gray-800 rounded-lg p-3">
                        <div className="text-lg font-bold text-yellow-400">{resumen.turnosEnProgreso}</div>
                        <div className="text-xs text-gray-400">En Progreso</div>
                      </div>
                    </div>

                    {/* Jornadas del día (máximo 3) */}
                    <div className="space-y-2 mb-4">
                      {registrosDia.slice(0, 3).map((registro, index) => {
                        const jornadaId = registro.jornada_config_id || registro.jornadaConfigId;
                        const jornadaInfo = jornadasSistema.find(j => j.id == jornadaId);
                        const colorIndex = jornadasSistema.findIndex(j => j.id == jornadaId);
                        const color = coloresJornada[colorIndex % coloresJornada.length] || coloresJornada[0];

                        return (
                          <div key={index} className="flex items-center gap-2 text-sm group/item hover:bg-gray-700/30 rounded px-2 py-1 -mx-2">
                            <div className={`w-2 h-2 ${color.bg} rounded-full`}></div>
                            <span className="text-gray-300 flex-1">
                              {jornadaInfo ? `${jornadaInfo.codigo} - ${jornadaInfo.nombre}` : 'Jornada'}
                            </span>
                            <span className="text-gray-400 text-xs">
                              {registro.estadisticas?.totalTurnos || 
                               registro.total_turnos || 
                               (registro.turnosRegistrados?.length || 0)} turnos
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmarEliminarRegistro(registro);
                              }}
                              className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-red-600/20 text-red-400 rounded transition-all"
                              title="Mover a papelera"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                      {registrosDia.length > 3 && (
                        <div className="text-xs text-gray-500 text-center">
                          ... y {registrosDia.length - 3} jornadas más
                        </div>
                      )}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => abrirDetallesDia(fecha)}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Detalles
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmarEliminarDiaCompleto(fecha, registrosDia);
                        }}
                        className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors border border-red-500/30"
                        title="Eliminar día completo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Detalles de un registro individual (oculto por ahora) */}
      <div className="hidden">
        {registros.length > 0 && (
          <div className="space-y-4">
            {registros.map((registro) => {
              // Debug del registro actual
              console.log('🔍 DEBUG RENDER - Registro:', {
                id: registro.id,
                jornada_config_id: registro.jornada_config_id,
                jornadaConfigId: registro.jornadaConfigId,
                fecha: registro.fecha
              });
              
              // Buscar información de la jornada asociada
              const jornadaId = registro.jornada_config_id || registro.jornadaConfigId;
              console.log('🔍 DEBUG RENDER - Buscando jornada con ID:', jornadaId);
              console.log('🔍 DEBUG RENDER - Jornadas disponibles:', jornadasSistema.map(j => ({ id: j.id, nombre: j.nombre })));
              
              const jornadaInfo = jornadasSistema.find(j => j.id == jornadaId); // Usar == para comparar números/strings
              console.log('🔍 DEBUG RENDER - Jornada encontrada:', jornadaInfo);
              
              const colorIndex = jornadasSistema.findIndex(j => j.id == jornadaId);
              const color = coloresJornada[colorIndex % coloresJornada.length] || coloresJornada[0];

              return (
                <div key={registro.id} className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                  {/* Header con información de la jornada */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 ${color.bg} rounded-full`}></div>
                        <span className="text-white font-semibold text-lg">
                          {jornadaInfo ? `Jornada ${jornadaInfo.codigo} - ${jornadaInfo.nombre}` : 'Jornada Registrada'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Calendar className="w-4 h-4" />
                        <span>{registro.fecha}</span>
                      </div>
                    </div>
                    <button className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-gray-600 transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Información del horario y estado */}
                  <div className="flex items-center gap-6 mb-4 text-sm">
                    {jornadaInfo && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <Clock className="w-4 h-4" />
                        <span>Horario: {convertirA12Horas(jornadaInfo.horaInicio)} - {convertirA12Horas(jornadaInfo.horaFin)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        registro.estado === 'activa' 
                          ? 'bg-green-900 text-green-300 border border-green-700' 
                          : 'bg-gray-900 text-gray-300 border border-gray-700'
                      }`}>
                        {registro.estado === 'activa' ? '🟢 Activa' : '⭕ Cerrada'}
                      </span>
                    </div>
                    {registro.fecha_creacion && (
                      <div className="text-xs text-gray-400">
                        Registrada: {new Date(registro.fecha_creacion).toLocaleTimeString('es-ES', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    )}
                  </div>
                  
                  {/* Estadísticas principales */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-gray-800 rounded-lg p-3 text-center border border-gray-600">
                      <div className="text-2xl font-bold text-blue-400 mb-1">
                        {registro.estadisticas?.totalTurnos || 
                         registro.estadisticas?.total_turnos || 
                         registro.total_turnos || 
                         (registro.turnosRegistrados?.length || 0)}
                      </div>
                      <div className="text-gray-400 text-xs">Total Turnos</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Registrados en la jornada
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 text-center border border-gray-600">
                      <div className="text-2xl font-bold text-green-400 mb-1">
                        {registro.estadisticas?.turnosCompletados || 
                         registro.estadisticas?.turnos_completados || 
                         registro.total_completados || 0}
                      </div>
                      <div className="text-gray-400 text-xs">Completados</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {((registro.estadisticas?.totalTurnos || registro.turnosRegistrados?.length || 0) > 0) ? 
                          Math.round((
                            (registro.estadisticas?.turnosCompletados || 0) / 
                            (registro.estadisticas?.totalTurnos || registro.turnosRegistrados?.length || 1)
                          ) * 100) 
                          : 0}% del total
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 text-center border border-gray-600">
                      <div className="text-2xl font-bold text-yellow-400 mb-1">
                        {registro.estadisticas?.turnosEnProgreso || 
                         registro.estadisticas?.turnos_en_progreso ||
                         ((registro.estadisticas?.totalTurnos || registro.turnosRegistrados?.length || 0) - 
                          (registro.estadisticas?.turnosCompletados || 0))}
                      </div>
                      <div className="text-gray-400 text-xs">En Progreso</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Turnos pendientes
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 text-center border border-gray-600">
                      <div className="text-2xl font-bold text-purple-400 mb-1">
                        {jornadaInfo ? (() => {
                          try {
                            const inicio = jornadaInfo.horaInicio.split(':');
                            const fin = jornadaInfo.horaFin.split(':');
                            const inicioMinutos = parseInt(inicio[0]) * 60 + parseInt(inicio[1]);
                            const finMinutos = parseInt(fin[0]) * 60 + parseInt(fin[1]);
                            const duracion = Math.abs(finMinutos - inicioMinutos) / 60;
                            return `${duracion}h`;
                          } catch (error) {
                            return '4h';
                          }
                        })() : '-'}
                      </div>
                      <div className="text-gray-400 text-xs">Duración</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Tiempo total de jornada
                      </div>
                    </div>
                  </div>

                  {/* Detalles de Turnos Registrados */}
                  {registro.turnosRegistrados && registro.turnosRegistrados.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-600">
                      <h5 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                        📋 Turnos Registrados ({registro.turnosRegistrados.length})
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {registro.turnosRegistrados.slice(0, 4).map((turno: any, index: number) => (
                          <div key={index} className="bg-gray-900 rounded-lg p-3 border border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-white">
                                🎾 {(() => {
                                  console.log('🏟️ Datos turno:', turno);
                                  console.log('🏟️ numeroCancha:', turno.numeroCancha);
                                  console.log('🏟️ cancha:', turno.cancha);
                                  console.log('🏟️ nombreCancha:', turno.nombreCancha);
                                  
                                  // Usar el nombre de la cancha que viene del backend
                                  if (turno.nombreCancha) {
                                    return turno.nombreCancha;
                                  }
                                  
                                  const canchaId = turno.numeroCancha || turno.cancha;
                                  if (!canchaId) return 'Sin cancha asignada';
                                  
                                  // Si es un número largo, puede ser un ID de base de datos
                                  if (typeof canchaId === 'string' && canchaId.length > 10) {
                                    return `Cancha ID: ${canchaId.slice(-4)}`;
                                  }
                                  
                                  // Si es un número corto, asumir que es número de cancha
                                  return `Cancha ${canchaId}`;
                                })()}
                              </span>
                              <div className={`px-2 py-1 rounded text-xs ${
                                turno.estado === 'completado' || turno.estado === 'completada'
                                  ? 'bg-green-900 text-green-300'
                                  : 'bg-yellow-900 text-yellow-300'
                              }`}>
                                {turno.estado === 'completado' || turno.estado === 'completada' ? '✅ Completado' : '⏳ En Progreso'}
                              </div>
                            </div>
                            <div className="text-xs text-gray-400 space-y-1">
                              <div>⏰ {turno.horaInicio} - {turno.horaFin}</div>
                              {turno.clienteNombre && (
                                <div>👤 {turno.clienteNombre}</div>
                              )}
                              {turno.monto && (
                                <div>💰 ${turno.monto} ({turno.metodoPago || 'efectivo'})</div>
                              )}
                            </div>
                          </div>
                        ))}
                        {registro.turnosRegistrados.length > 4 && (
                          <div className="col-span-full text-center text-xs text-gray-500 mt-2">
                            ... y {registro.turnosRegistrados.length - 4} turnos más
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Información adicional */}
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-4">
                        <span>📊 ID Registro: {registro.id.slice(0, 8)}...</span>
                        {jornadaInfo && (
                          <span>🎯 Jornada Config ID: {jornadaInfo.id}</span>
                        )}
                        {registro.fecha_creacion && (
                          <span>📅 {new Date(registro.fecha_creacion).toLocaleDateString('es-ES')}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span>💾 Guardado en BD</span>
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Información del Sistema - Sección Colapsible */}
      <div className="bg-gray-800 rounded-lg p-6">
        <button
          onClick={() => {
            const nuevoEstado = !jornadasSistemaColapsado;
            setJornadasSistemaColapsado(nuevoEstado);
            
            // Si se está expandiendo y no hay estadísticas cargadas, cargarlas
            if (!nuevoEstado && Object.keys(estadisticasJornadas).length === 0 && jornadasSistema.length > 0) {
              cargarEstadisticasJornadas();
            }
          }}
          className="w-full flex items-center justify-between text-left hover:bg-gray-700 rounded-lg p-3 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-700 rounded-lg">
              <Timer className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Jornadas del Sistema</h3>
              <p className="text-sm text-gray-400">
                Configuración y estadísticas de las jornadas disponibles ({jornadasSistema.length} jornadas)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {jornadasSistemaColapsado ? 'Mostrar' : 'Ocultar'}
            </span>
            <ChevronDown 
              className={`w-5 h-5 text-gray-400 transition-transform ${
                jornadasSistemaColapsado ? '' : 'rotate-180'
              }`} 
            />
          </div>
        </button>

        {!jornadasSistemaColapsado && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-400">Vista general de las jornadas configuradas en el sistema</p>
              <button
                onClick={cargarEstadisticasJornadas}
                disabled={loadingEstadisticasJornadas}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${loadingEstadisticasJornadas ? 'animate-spin' : ''}`} />
                {loadingEstadisticasJornadas ? 'Cargando...' : 'Actualizar'}
              </button>
            </div>
            
            {loadingJornadas ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-400">Cargando jornadas del sistema...</span>
              </div>
            ) : jornadasSistema.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-400 mb-2">Sin jornadas configuradas</h4>
                <p className="text-gray-500">No hay jornadas configuradas en el sistema</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jornadasSistema.map((jornada: any, index: number) => {
                  const color = coloresJornada[index % coloresJornada.length];
                  return (
                    <div key={`jornada-${jornada.id}-${index}`} className={`bg-gray-700 rounded-lg p-4 ring-1 ${color.ring}`}>
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
                          <span>{convertirA12Horas(jornada.horaInicio)} - {convertirA12Horas(jornada.horaFin)}</span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mt-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-400">
                              {loadingEstadisticasJornadas ? (
                                <div className="animate-pulse bg-gray-600 h-5 w-8 rounded mx-auto"></div>
                              ) : (
                                estadisticasJornadas[jornada.id]?.totalTurnos || 0
                              )}
                            </div>
                            <div className="text-xs text-gray-400">Turnos</div>
                            {estadisticasJornadas[jornada.id] && (
                              <div className="text-xs text-gray-500 mt-1">
                                {estadisticasJornadas[jornada.id].promedioPorDia || 0}/día
                              </div>
                            )}
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-400">
                              {loadingEstadisticasJornadas ? (
                                <div className="animate-pulse bg-gray-600 h-5 w-8 rounded mx-auto"></div>
                              ) : (
                                estadisticasJornadas[jornada.id]?.turnosCompletados || 0
                              )}
                            </div>
                            <div className="text-xs text-gray-400">Completados</div>
                            {estadisticasJornadas[jornada.id] && estadisticasJornadas[jornada.id].totalTurnos > 0 && (
                              <div className="text-xs text-gray-500 mt-1">
                                {Math.round((estadisticasJornadas[jornada.id].turnosCompletados / estadisticasJornadas[jornada.id].totalTurnos) * 100)}%
                              </div>
                            )}
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-yellow-400">
                              {loadingEstadisticasJornadas ? (
                                <div className="animate-pulse bg-gray-600 h-5 w-8 rounded mx-auto"></div>
                              ) : (
                                estadisticasJornadas[jornada.id]?.turnosEnProgreso || 0
                              )}
                            </div>
                            <div className="text-xs text-gray-400">Pendientes</div>
                            {estadisticasJornadas[jornada.id] && (
                              <div className="text-xs text-gray-500 mt-1">
                                {estadisticasJornadas[jornada.id].diasConActividad || 0} días activos
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-gray-600">
                        <button 
                          onClick={() => abrirDetallesJornada(jornada)}
                          className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Detalles de Jornada */}
      <Modal 
        isOpen={modalDetallesAbierto} 
        onClose={() => {
          setModalDetallesAbierto(false);
          setJornadaSeleccionada(null);
          setEstadisticasJornada(null);
        }} 
        title={`Estadísticas - ${jornadaSeleccionada?.nombre || 'Jornada'}`}
        size="xl"
      >
        {loadingEstadisticas ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-400">Cargando estadísticas...</span>
          </div>
        ) : estadisticasJornada ? (
          <div className="space-y-6">
            {/* Información de la Jornada */}
            <div className="bg-gradient-to-r from-blue-900/20 to-blue-800/20 border border-blue-500/30 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: estadisticasJornada.jornada?.color || '#3b82f6' }}
                  ></div>
                  <h3 className="text-xl font-semibold text-white">
                    Jornada {estadisticasJornada.jornada?.codigo} - {estadisticasJornada.jornada?.nombre}
                  </h3>
                </div>
                {(estadisticasJornada.error || estadisticasJornada.mensaje) && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-yellow-900/30 border border-yellow-500/30 rounded-full">
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-yellow-300">
                      {estadisticasJornada.error ? 'Error en datos' : 'Sin actividad'}
                    </span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span>Horario: {estadisticasJornada.jornada?.horario}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>Período: {estadisticasJornada.periodo?.fechaInicio} - {estadisticasJornada.periodo?.fechaFin}</span>
                </div>
              </div>
              {estadisticasJornada.mensaje && (
                <div className="mt-4 p-3 bg-gray-700/50 border border-gray-600 rounded-lg">
                  <p className="text-sm text-gray-300">
                    💡 <strong>Información:</strong> {estadisticasJornada.mensaje}
                  </p>
                  {estadisticasJornada.turnos?.total === 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      Las estadísticas aparecerán aquí cuando se registren jornadas con turnos para este período.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Estadísticas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium text-gray-300">Total Turnos</span>
                </div>
                <div className="text-2xl font-bold text-blue-400">
                  {estadisticasJornada.turnos?.total || 0}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Promedio: {estadisticasJornada.turnos?.promedioPorDia || 0}/día
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-medium text-gray-300">Completados</span>
                </div>
                <div className="text-2xl font-bold text-green-400">
                  {estadisticasJornada.turnos?.completados || 0}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {estadisticasJornada.eficiencia?.tasaCompletado || 0}% de eficiencia
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <Timer className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-300">En Progreso</span>
                </div>
                <div className="text-2xl font-bold text-yellow-400">
                  {estadisticasJornada.turnos?.enProgreso || 0}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {estadisticasJornada.eficiencia?.tasaProgreso || 0}% pendientes
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <span className="text-sm font-medium text-gray-300">Días Activos</span>
                </div>
                <div className="text-2xl font-bold text-purple-400">
                  {estadisticasJornada.periodo?.diasConActividad || 0}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {estadisticasJornada.tiempo?.promedioHorasPorDia || 0}h/día promedio
                </div>
              </div>
            </div>

            {/* Gráfico de Eficiencia */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Análisis de Rendimiento
              </h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Turnos Completados</span>
                    <span className="text-green-400">{estadisticasJornada.eficiencia?.tasaCompletado || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${estadisticasJornada.eficiencia?.tasaCompletado || 0}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Turnos en Progreso</span>
                    <span className="text-yellow-400">{estadisticasJornada.eficiencia?.tasaProgreso || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${estadisticasJornada.eficiencia?.tasaProgreso || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen de Tiempo */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Timer className="w-5 h-5" />
                Resumen de Tiempo
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-300">Total de horas operadas:</span>
                  <span className="text-white font-medium">{estadisticasJornada.tiempo?.totalHoras || 0}h</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-300">Promedio por día activo:</span>
                  <span className="text-white font-medium">{estadisticasJornada.tiempo?.promedioHorasPorDia || 0}h</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-300">Días con actividad:</span>
                  <span className="text-white font-medium">{estadisticasJornada.periodo?.diasConActividad || 0} días</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-300">Turnos por día (promedio):</span>
                  <span className="text-white font-medium">{estadisticasJornada.turnos?.promedioPorDia || 0}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-400 mb-2">Sin estadísticas disponibles</h4>
            <p className="text-gray-500">No se encontraron datos para el período seleccionado</p>
          </div>
        )}
      </Modal>

      {/* Modal de Detalles del Día */}
      <Modal 
        isOpen={modalDiaAbierto} 
        onClose={() => {
          setModalDiaAbierto(false);
          setDiaSeleccionado('');
        }} 
        title={`Detalles del Día - ${diaSeleccionado ? new Date(diaSeleccionado + 'T00:00:00').toLocaleDateString('es-ES', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }) : ''}`}
        size="xl"
      >
        {diaSeleccionado && registrosPorDia[diaSeleccionado] ? (
          <div className="space-y-6">
            {/* Resumen del día */}
            <div className="bg-gradient-to-r from-blue-900/20 to-blue-800/20 border border-blue-500/30 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {new Date(diaSeleccionado + 'T00:00:00').toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {(() => {
                      const resumen = obtenerResumenDia(diaSeleccionado, registrosPorDia[diaSeleccionado]);
                      return `${resumen.totalJornadas} jornadas registradas • ${resumen.totalTurnos} turnos totales`;
                    })()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">
                    {obtenerResumenDia(diaSeleccionado, registrosPorDia[diaSeleccionado]).totalTurnos}
                  </div>
                  <div className="text-sm text-gray-400">Turnos del día</div>
                </div>
              </div>

              {/* Estadísticas del día */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {(() => {
                  const resumen = obtenerResumenDia(diaSeleccionado, registrosPorDia[diaSeleccionado]);
                  return (
                    <>
                      <div className="bg-gray-800 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-blue-400">{resumen.totalJornadas}</div>
                        <div className="text-xs text-gray-400">Jornadas</div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-green-400">{resumen.totalTurnos}</div>
                        <div className="text-xs text-gray-400">Total Turnos</div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-blue-400">{resumen.turnosCompletados}</div>
                        <div className="text-xs text-gray-400">Completados</div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-yellow-400">{resumen.turnosEnProgreso}</div>
                        <div className="text-xs text-gray-400">En Progreso</div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Detalle de cada jornada del día */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Jornadas del {diaSeleccionado}
              </h4>
              
              {registrosPorDia[diaSeleccionado].map((registro, index) => {
                const jornadaId = registro.jornada_config_id || registro.jornadaConfigId;
                const jornadaInfo = jornadasSistema.find(j => j.id == jornadaId);
                const colorIndex = jornadasSistema.findIndex(j => j.id == jornadaId);
                const color = coloresJornada[colorIndex % coloresJornada.length] || coloresJornada[0];

                return (
                  <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    {/* Header de la jornada */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 ${color.bg} rounded-full`}></div>
                        <div>
                          <h5 className="text-lg font-semibold text-white">
                            {jornadaInfo ? `Jornada ${jornadaInfo.codigo} - ${jornadaInfo.nombre}` : 'Jornada Registrada'}
                          </h5>
                          {jornadaInfo && (
                            <p className="text-sm text-gray-400">
                              {convertirA12Horas(jornadaInfo.horaInicio)} - {convertirA12Horas(jornadaInfo.horaFin)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-xl font-bold text-green-400">
                            {registro.estadisticas?.totalTurnos || 
                             registro.total_turnos || 
                             (registro.turnosRegistrados?.length || 0)}
                          </div>
                          <div className="text-xs text-gray-400">Turnos</div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            console.error('🔴 CLICK EN BOTÓN ELIMINAR - Registro:', registro);
                            confirmarEliminarRegistro(registro);
                          }}
                          className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors group"
                          title="Mover a papelera"
                        >
                          <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>

                    {/* Turnos de esta jornada */}
                    {registro.turnosRegistrados && registro.turnosRegistrados.length > 0 && (
                      <div>
                        <h6 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                          🎾 Turnos Registrados ({registro.turnosRegistrados.length})
                        </h6>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {registro.turnosRegistrados.map((turno: any, turnoIndex: number) => (
                            <div key={turnoIndex} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-white">
                                  🎾 {(() => {
                                    console.log('🏟️ Modal - Datos turno:', turno);
                                    console.log('🏟️ Modal - numeroCancha:', turno.numeroCancha);
                                    console.log('🏟️ Modal - cancha:', turno.cancha);
                                    console.log('🏟️ Modal - nombreCancha:', turno.nombreCancha);
                                    
                                    // Usar el nombre de la cancha que viene del backend
                                    if (turno.nombreCancha) {
                                      return turno.nombreCancha;
                                    }
                                    
                                    const canchaId = turno.numeroCancha || turno.cancha;
                                    if (!canchaId) return 'Sin cancha asignada';
                                    
                                    // Si es un número largo, puede ser un ID de base de datos
                                    if (typeof canchaId === 'string' && canchaId.length > 10) {
                                      return `Cancha ID: ${canchaId.slice(-4)}`;
                                    }
                                    
                                    // Si es un número corto, asumir que es número de cancha
                                    return `Cancha ${canchaId}`;
                                  })()}
                                </span>
                                <div className={`px-2 py-1 rounded text-xs font-medium ${
                                  turno.estado === 'completado' || turno.estado === 'completada'
                                    ? 'bg-green-900 text-green-300 border border-green-700'
                                    : 'bg-yellow-900 text-yellow-300 border border-yellow-700'
                                }`}>
                                  {turno.estado === 'completado' || turno.estado === 'completada' ? '✅ Completado' : '⏳ En Progreso'}
                                </div>
                              </div>
                              
                              <div className="space-y-1 text-xs text-gray-400">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-3 h-3" />
                                  <span>{turno.horaInicio} - {turno.horaFin}</span>
                                </div>
                                {turno.clienteNombre && (
                                  <div className="flex items-center gap-2">
                                    <Users className="w-3 h-3" />
                                    <span>{turno.clienteNombre}</span>
                                  </div>
                                )}
                                {turno.monto && (
                                  <div className="flex items-center gap-2">
                                    <span>💰</span>
                                    <span>${turno.monto} ({turno.metodoPago || 'efectivo'})</span>
                                  </div>
                                )}
                                {turno.notas && (
                                  <div className="flex items-start gap-2 mt-2 pt-2 border-t border-gray-700">
                                    <span>📝</span>
                                    <span className="text-gray-300 text-xs">{turno.notas}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer con información del registro */}
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-4">
                          <span>📊 ID: {registro.id.slice(0, 8)}...</span>
                          <span>⏰ {registro.fecha_creacion ? new Date(registro.fecha_creacion).toLocaleTimeString('es-ES') : 'Sin hora'}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            registro.estado === 'activa' 
                              ? 'bg-green-900 text-green-300' 
                              : 'bg-gray-900 text-gray-300'
                          }`}>
                            {registro.estado === 'activa' ? '🟢 Activa' : '⭕ Cerrada'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-400 mb-2">Sin información</h4>
            <p className="text-gray-500">No se encontraron detalles para este día</p>
          </div>
        )}
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal
        isOpen={modalConfirmarEliminar}
        onClose={() => {
          setModalConfirmarEliminar(false);
          setRegistroAEliminar(null);
        }}
        title="🗑️ Confirmar Eliminación"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-white font-semibold mb-2">¿Estás seguro?</h4>
                <p className="text-gray-300 text-sm mb-3">
                  Vas a mover este registro a la papelera:
                </p>
                
                {registroAEliminar && (
                  <div className="bg-gray-800 rounded-lg p-3 mb-3">
                    <div className="text-sm text-gray-300 space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span className="font-semibold">
                          {new Date(registroAEliminar.fecha).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-green-400" />
                        <span>
                          {registroAEliminar.estadisticas?.totalTurnos || 
                           registroAEliminar.total_turnos || 
                           (registroAEliminar.turnosRegistrados?.length || 0)} turnos registrados
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 text-xs">
                    ℹ️ <strong>Nota:</strong> El registro se moverá a la papelera y se eliminará permanentemente 
                    después de 30 días. Podrás restaurarlo antes de ese tiempo desde la sección de papelera.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                setModalConfirmarEliminar(false);
                setRegistroAEliminar(null);
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={eliminarRegistro}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Mover a Papelera
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de Papelera */}
      <Modal
        isOpen={modalPapeleraAbierto}
        onClose={() => setModalPapeleraAbierto(false)}
        title="🗑️ Papelera de Registros"
        size="xl"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 flex-1">
              <p className="text-blue-300 text-sm">
                ℹ️ Los registros en la papelera se eliminarán permanentemente después de 30 días. 
                Puedes restaurarlos antes de ese tiempo.
              </p>
            </div>
            {registrosPapelera.length > 0 && (
              <button
                onClick={confirmarVaciarPapelera}
                className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                disabled={loading}
              >
                <Trash2 className="w-4 h-4" />
                Vaciar Papelera
              </button>
            )}
          </div>

          {loadingPapelera ? (
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-spin" />
              <p className="text-gray-400">Cargando papelera...</p>
            </div>
          ) : registrosPapelera.length === 0 ? (
            <div className="text-center py-12">
              <Trash2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-400 mb-2">Papelera vacía</h4>
              <p className="text-gray-500">No hay registros eliminados</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {registrosPapelera.map((registro) => {
                const jornadaId = registro.jornada_config_id || registro.jornadaConfigId;
                const jornadaInfo = jornadasSistema.find(j => j.id == jornadaId);
                const diasTranscurridos = registro.fechaEliminacion || registro.fecha_eliminacion
                  ? Math.floor((new Date().getTime() - new Date(registro.fechaEliminacion || registro.fecha_eliminacion).getTime()) / (1000 * 60 * 60 * 24))
                  : 0;
                const diasRestantes = 30 - diasTranscurridos;

                return (
                  <div key={registro.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-red-500/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Calendar className="w-5 h-5 text-red-400" />
                          <div>
                            <h4 className="text-white font-semibold">
                              Registro del {new Date(registro.fecha).toLocaleDateString('es-ES', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </h4>
                            <p className="text-sm text-gray-400">
                              {jornadaInfo ? `${jornadaInfo.codigo} - ${jornadaInfo.nombre}` : 'Jornada'}
                              {' • '}
                              {registro.estadisticas?.totalTurnos || registro.total_turnos || 
                               (registro.turnosRegistrados?.length || 0)} turnos
                            </p>
                            {(registro.fechaEliminacion || registro.fecha_eliminacion) && (
                              <p className="text-xs text-red-400 mt-1">
                                🗑️ Eliminado el {new Date(registro.fechaEliminacion || registro.fecha_eliminacion).toLocaleDateString('es-ES', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Eliminado hace {diasTranscurridos} día{diasTranscurridos !== 1 ? 's' : ''}</span>
                          <span className={diasRestantes <= 7 ? 'text-red-400' : 'text-gray-500'}>
                            Se eliminará permanentemente en {diasRestantes} día{diasRestantes !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => confirmarEliminarPermanente(registro)}
                          className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors border border-red-500/30"
                          disabled={loading}
                          title="Eliminar permanentemente"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => restaurarRegistro(registro.id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                          disabled={loading}
                        >
                          <RefreshCw className="w-4 h-4" />
                          Restaurar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Modal>

      {/* Modal Confirmación Eliminar Permanente */}
      <Modal
        isOpen={modalEliminarPermanente}
        onClose={() => {
          setModalEliminarPermanente(false);
          setRegistroEliminarPermanente(null);
        }}
        title="💥 Eliminar Permanentemente"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-white font-semibold mb-2">⚠️ ¡Esta acción es PERMANENTE!</h4>
                <p className="text-red-200 text-sm mb-2">
                  El registro será eliminado definitivamente de la base de datos y <strong>NO se puede deshacer</strong>.
                </p>
              </div>
            </div>
          </div>

          {registroEliminarPermanente && (
            <div className="space-y-2">
              <h4 className="text-white font-semibold text-sm">Registro a eliminar:</h4>
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium text-sm">
                    {new Date(registroEliminarPermanente.fecha).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>• Jornada: {(() => {
                    const jornadaId = registroEliminarPermanente.jornada_config_id || registroEliminarPermanente.jornadaConfigId;
                    const jornadaInfo = jornadasSistema.find(j => j.id == jornadaId);
                    return jornadaInfo ? `${jornadaInfo.codigo} - ${jornadaInfo.nombre}` : 'Desconocida';
                  })()}</p>
                  <p>• Turnos: {registroEliminarPermanente.estadisticas?.totalTurnos || registroEliminarPermanente.total_turnos || (registroEliminarPermanente.turnosRegistrados?.length || 0)}</p>
                  <p className="text-red-400">• Eliminado el {new Date(registroEliminarPermanente.fecha_eliminacion || registroEliminarPermanente.fechaEliminacion).toLocaleDateString('es-ES')}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={() => {
                setModalEliminarPermanente(false);
                setRegistroEliminarPermanente(null);
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={eliminarPermanentemente}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Eliminar Permanentemente
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Confirmación Vaciar Papelera */}
      <Modal
        isOpen={modalVaciarPapelera}
        onClose={() => setModalVaciarPapelera(false)}
        title="🗑️💥 Vaciar Papelera"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-white font-semibold mb-2">⚠️ ¡Esta acción es PERMANENTE!</h4>
                <p className="text-red-200 text-sm">
                  Todos los registros de la papelera serán eliminados definitivamente y <strong>NO se pueden recuperar</strong>.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-semibold text-sm">Resumen de eliminación:</h4>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-300 text-sm">Total de registros:</span>
                <span className="text-2xl font-bold text-red-400">{registrosPapelera.length}</span>
              </div>
              <div className="text-sm text-gray-400 space-y-1">
                <p>• Se eliminarán {registrosPapelera.length} registros de jornada</p>
                <p>• Se perderán {registrosPapelera.reduce((sum, r) => 
                  sum + (r.estadisticas?.totalTurnos || r.total_turnos || (r.turnosRegistrados?.length || 0)), 0
                )} turnos asociados</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={() => setModalVaciarPapelera(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={vaciarPapelera}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Vaciando...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Vaciar Papelera ({registrosPapelera.length})
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de confirmación para eliminar día completo */}
      <Modal
        isOpen={modalEliminarDia}
        onClose={() => {
          setModalEliminarDia(false);
          setDiaAEliminar(null);
        }}
        title="🗑️ Eliminar Día Completo"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-white font-semibold mb-2">¿Estás seguro?</h4>
                <p className="text-gray-300 text-sm mb-3">
                  Vas a mover TODAS las jornadas de este día a la papelera:
                </p>
                
                {diaAEliminar && (
                  <div className="bg-gray-800 rounded-lg p-3 mb-3">
                    <div className="text-sm text-gray-300 space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span className="font-semibold">
                          {new Date(diaAEliminar.fecha).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-green-400" />
                        <span>
                          {diaAEliminar.registros.length} jornada{diaAEliminar.registros.length !== 1 ? 's' : ''} 
                          {' '}({diaAEliminar.registros.reduce((sum, r) => 
                            sum + (r.estadisticas?.totalTurnos || r.total_turnos || (r.turnosRegistrados?.length || 0)), 0
                          )} turnos en total)
                        </span>
                      </div>
                      
                      <div className="mt-3 space-y-1 pl-6">
                        {diaAEliminar.registros.map((registro, idx) => {
                          const jornadaId = registro.jornada_config_id || registro.jornadaConfigId;
                          const jornadaInfo = jornadasSistema.find(j => j.id == jornadaId);
                          return (
                            <div key={idx} className="text-xs text-gray-400">
                              • {jornadaInfo ? `${jornadaInfo.codigo} - ${jornadaInfo.nombre}` : 'Jornada'}
                              {' '}({registro.estadisticas?.totalTurnos || registro.total_turnos || (registro.turnosRegistrados?.length || 0)} turnos)
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 text-xs">
                    ℹ️ <strong>Nota:</strong> Los registros se moverán a la papelera y se eliminarán permanentemente 
                    después de 30 días. Podrás restaurarlos antes de ese tiempo.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                setModalEliminarDia(false);
                setDiaAEliminar(null);
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={eliminarDiaCompleto}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Eliminar Día Completo
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}