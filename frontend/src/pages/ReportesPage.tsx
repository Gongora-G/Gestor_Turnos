import React, { useState, useEffect } from 'react';
import {
  FileText,
  Calendar,
  Download,
  TrendingUp,
  Users,
  ClipboardCheck,
  CalendarDays,
  BarChart3,
  Filter
} from 'lucide-react';
import { GlobalNavigation, GlobalFooter } from '../components';
import { apiService } from '../services/api';
import { useToast } from '../contexts/ToastContext';

type TipoReporte = 'asistencias' | 'turnos' | 'personal';
type PeriodoReporte = 'diario' | 'semanal' | 'quincenal' | 'mensual' | 'anual' | 'personalizado';

interface FiltrosReporte {
  periodo: PeriodoReporte;
  fechaInicio: string;
  fechaFin: string;
  jornadaId?: number;
  tipoPersonalId?: number;
}

export const ReportesPage: React.FC = () => {
  const [tipoReporte, setTipoReporte] = useState<TipoReporte>('asistencias');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Filtros
  const [filtros, setFiltros] = useState<FiltrosReporte>({
    periodo: 'mensual',
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: new Date().toISOString().split('T')[0],
  });

  // Datos de los reportes
  const [reporteAsistencias, setReporteAsistencias] = useState<any>(null);
  const [reporteTurnos, setReporteTurnos] = useState<any>(null);
  const [reportePersonal, setReportePersonal] = useState<any>(null);

  // Calcular fechas según el período seleccionado
  useEffect(() => {
    calcularFechasPorPeriodo(filtros.periodo);
  }, [filtros.periodo]);

  const calcularFechasPorPeriodo = (periodo: PeriodoReporte) => {
    const hoy = new Date();
    let fechaInicio = new Date();
    let fechaFin = new Date();

    switch (periodo) {
      case 'diario':
        fechaInicio = hoy;
        fechaFin = hoy;
        break;
      case 'semanal':
        // Inicio de la semana (lunes)
        const diaSemana = hoy.getDay();
        const diff = diaSemana === 0 ? -6 : 1 - diaSemana;
        fechaInicio = new Date(hoy);
        fechaInicio.setDate(hoy.getDate() + diff);
        fechaFin = new Date(fechaInicio);
        fechaFin.setDate(fechaInicio.getDate() + 6);
        break;
      case 'quincenal':
        const dia = hoy.getDate();
        if (dia <= 15) {
          fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
          fechaFin = new Date(hoy.getFullYear(), hoy.getMonth(), 15);
        } else {
          fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 16);
          fechaFin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
        }
        break;
      case 'mensual':
        fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        fechaFin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
        break;
      case 'anual':
        fechaInicio = new Date(hoy.getFullYear(), 0, 1);
        fechaFin = new Date(hoy.getFullYear(), 11, 31);
        break;
      case 'personalizado':
        return; // No cambiar fechas para personalizado
    }

    setFiltros(prev => ({
      ...prev,
      fechaInicio: fechaInicio.toISOString().split('T')[0],
      fechaFin: fechaFin.toISOString().split('T')[0],
    }));
  };

  const generarReporte = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        fechaInicio: filtros.fechaInicio,
        fechaFin: filtros.fechaFin,
      });

      if (filtros.jornadaId) params.append('jornadaId', filtros.jornadaId.toString());
      if (filtros.tipoPersonalId) params.append('tipoPersonalId', filtros.tipoPersonalId.toString());

      switch (tipoReporte) {
        case 'asistencias':
          const dataAsistencias = await apiService.get(`/reportes/asistencias?${params}`);
          setReporteAsistencias(dataAsistencias);
          break;
        case 'turnos':
          const dataTurnos = await apiService.get(`/reportes/turnos?${params}`);
          setReporteTurnos(dataTurnos);
          break;
        case 'personal':
          const dataPersonal = await apiService.get(`/reportes/personal?${params}`);
          setReportePersonal(dataPersonal);
          break;
      }

      toast.success('Reporte generado correctamente');
    } catch (error: any) {
      toast.error(error.message || 'Error al generar reporte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <GlobalNavigation />

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <BarChart3 className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                  Reportes y Estadísticas
                </h1>
                <p className="mt-2 text-gray-300">
                  Visualiza y analiza la información del sistema
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pestañas de tipo de reporte */}
        <div className="mb-6">
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setTipoReporte('asistencias')}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150
                  ${tipoReporte === 'asistencias'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                  }
                `}
              >
                <ClipboardCheck className="w-5 h-5" />
                Asistencias
              </button>
              <button
                onClick={() => setTipoReporte('turnos')}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150
                  ${tipoReporte === 'turnos'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                  }
                `}
              >
                <CalendarDays className="w-5 h-5" />
                Turnos
              </button>
              <button
                onClick={() => setTipoReporte('personal')}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150
                  ${tipoReporte === 'personal'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                  }
                `}
              >
                <Users className="w-5 h-5" />
                Personal
              </button>
            </nav>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Filtros</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Período */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Período
              </label>
              <select
                value={filtros.periodo}
                onChange={(e) => setFiltros(prev => ({ ...prev, periodo: e.target.value as PeriodoReporte }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="diario">Diario</option>
                <option value="semanal">Semanal</option>
                <option value="quincenal">Quincenal</option>
                <option value="mensual">Mensual</option>
                <option value="anual">Anual</option>
                <option value="personalizado">Personalizado</option>
              </select>
            </div>

            {/* Fecha inicio */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={filtros.fechaInicio}
                onChange={(e) => setFiltros(prev => ({ ...prev, fechaInicio: e.target.value, periodo: 'personalizado' }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Fecha fin */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Fecha Fin
              </label>
              <input
                type="date"
                value={filtros.fechaFin}
                onChange={(e) => setFiltros(prev => ({ ...prev, fechaFin: e.target.value, periodo: 'personalizado' }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Botón generar */}
            <div className="flex items-end">
              <button
                onClick={generarReporte}
                disabled={loading}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md transition-colors duration-150 flex items-center justify-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generando...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    Generar Reporte
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Área de contenido del reporte */}
        {tipoReporte === 'asistencias' && reporteAsistencias && (
          <ReporteAsistencias datos={reporteAsistencias} />
        )}

        {tipoReporte === 'turnos' && reporteTurnos && (
          <ReporteTurnos datos={reporteTurnos} />
        )}

        {tipoReporte === 'personal' && reportePersonal && (
          <ReportePersonal datos={reportePersonal} />
        )}

        {/* Estado vacío */}
        {!reporteAsistencias && !reporteTurnos && !reportePersonal && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
            <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              Selecciona los filtros y genera un reporte
            </h3>
            <p className="text-gray-500">
              Los resultados aparecerán aquí
            </p>
          </div>
        )}
      </div>

      <GlobalFooter />
    </div>
  );
};

// Componente para el reporte de asistencias
const ReporteAsistencias: React.FC<{ datos: any }> = ({ datos }) => {
  if (!datos || !datos.resumen) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-center">
        <p className="text-gray-400">No hay datos para mostrar</p>
      </div>
    );
  }

  const { resumen, porPersonal, porFecha, registrosDetallados } = datos;

  return (
    <div className="space-y-6">
      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-700/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-300 text-sm font-medium">Total Registros</span>
            <ClipboardCheck className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white">{resumen.totalRegistros}</p>
        </div>

        <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-700/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-300 text-sm font-medium">Asistencias</span>
            <Users className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white">{resumen.asistencias}</p>
        </div>

        <div className="bg-gradient-to-br from-red-900/50 to-red-800/30 border border-red-700/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-red-300 text-sm font-medium">Ausencias</span>
            <TrendingUp className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-3xl font-bold text-white">{resumen.ausencias}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-700/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-300 text-sm font-medium">% Asistencia</span>
            <BarChart3 className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white">{resumen.porcentajeAsistencia.toFixed(1)}%</p>
        </div>
      </div>

      {/* Estadísticas por Personal */}
      {porPersonal && porPersonal.length > 0 && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Asistencias por Personal
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Personal</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Tipo</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-300">Total</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-300">Asistencias</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-300">Ausencias</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-300">% Asistencia</th>
                </tr>
              </thead>
              <tbody>
                {porPersonal.map((item: any, index: number) => (
                  <tr key={index} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                    <td className="py-3 px-4 text-white">
                      {item.personal.nombre} {item.personal.apellido}
                    </td>
                    <td className="py-3 px-4 text-gray-300">{item.personal.tipoPersonal}</td>
                    <td className="py-3 px-4 text-center text-white">{item.totalRegistros}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-green-400 font-semibold">{item.asistencias}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-red-400 font-semibold">{item.ausencias}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-semibold ${
                        parseFloat(item.porcentaje) >= 80 ? 'text-green-400' :
                        parseFloat(item.porcentaje) >= 60 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {item.porcentaje}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Estadísticas por Fecha */}
      {porFecha && porFecha.length > 0 && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            Asistencias por Fecha
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {porFecha.slice(0, 9).map((item: any, index: number) => (
              <div key={index} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">
                    {new Date(item.fecha).toLocaleDateString('es-ES', { 
                      day: '2-digit', 
                      month: 'short' 
                    })}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    parseFloat(item.porcentaje) >= 80 ? 'bg-green-900/50 text-green-400' :
                    parseFloat(item.porcentaje) >= 60 ? 'bg-yellow-900/50 text-yellow-400' :
                    'bg-red-900/50 text-red-400'
                  }`}>
                    {item.porcentaje}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-400">✓ {item.asistencias}</span>
                  <span className="text-red-400">✗ {item.ausencias}</span>
                  <span className="text-gray-400">Total: {item.totalRegistros}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Registros Detallados */}
      {registrosDetallados && registrosDetallados.length > 0 && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              Registros Detallados ({registrosDetallados.length})
            </h3>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-md transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-gray-800">
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Fecha</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Personal</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Tipo</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Jornada</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-300">Hora Llegada</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-300">Estado</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {registrosDetallados.map((registro: any) => (
                  <tr key={registro.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                    <td className="py-3 px-4 text-gray-300 text-sm">
                      {new Date(registro.fecha).toLocaleDateString('es-ES')}
                    </td>
                    <td className="py-3 px-4 text-white text-sm">{registro.personal.nombre}</td>
                    <td className="py-3 px-4 text-gray-300 text-sm">{registro.personal.tipoPersonal}</td>
                    <td className="py-3 px-4 text-gray-300 text-sm">
                      {registro.jornadaConfig?.nombre || '-'}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-300 text-sm">
                      {registro.horaLlegada ? new Date(registro.horaLlegada).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {registro.presente ? (
                        <span className="px-2 py-1 bg-green-900/50 text-green-400 text-xs rounded-full">
                          Presente
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-900/50 text-red-400 text-xs rounded-full">
                          Ausente
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-sm">
                      {registro.observaciones || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente para el reporte de turnos
const ReporteTurnos: React.FC<{ datos: any }> = ({ datos }) => {
  if (!datos || !datos.resumen) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-center">
        <p className="text-gray-400">No hay datos de turnos para mostrar</p>
      </div>
    );
  }

  const { resumen, porFecha, porCancha, turnosDetallados } = datos;

  return (
    <div className="space-y-6">
      {/* Resumen General de Turnos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-700/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-300 text-sm font-medium">Total Turnos</span>
            <Calendar className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white">{resumen.totalTurnos}</p>
        </div>

        <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-700/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-300 text-sm font-medium">Completados</span>
            <ClipboardCheck className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white">{resumen.completados}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border border-yellow-700/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-yellow-300 text-sm font-medium">En Progreso</span>
            <TrendingUp className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-white">{resumen.enProgreso}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-700/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-300 text-sm font-medium">% Completado</span>
            <BarChart3 className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white">{resumen.porcentajeCompletado.toFixed(1)}%</p>
        </div>
      </div>

      {/* Turnos por Fecha */}
      {porFecha && porFecha.length > 0 && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            Turnos por Fecha
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {porFecha.map((item: any, index: number) => (
              <div key={index} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">
                    {new Date(item.fecha).toLocaleDateString('es-ES', { 
                      day: '2-digit', 
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-purple-900/50 text-purple-400">
                    {item.total} turnos
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-400">✓ {item.completados}</span>
                  <span className="text-yellow-400">⏱ {item.enProgreso}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Turnos por Cancha */}
      {porCancha && porCancha.length > 0 && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            Turnos por Cancha
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Cancha</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-300">Total</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-300">Completados</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-300">En Progreso</th>
                </tr>
              </thead>
              <tbody>
                {porCancha.map((item: any, index: number) => (
                  <tr key={index} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                    <td className="py-3 px-4 text-white">Cancha {item.canchaId.substring(0, 8)}</td>
                    <td className="py-3 px-4 text-center text-white">{item.total}</td>
                    <td className="py-3 px-4 text-center text-green-400 font-semibold">{item.completados}</td>
                    <td className="py-3 px-4 text-center text-yellow-400 font-semibold">{item.enProgreso}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Turnos Detallados */}
      {turnosDetallados && turnosDetallados.length > 0 && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              Turnos Detallados ({turnosDetallados.length})
            </h3>
          </div>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-gray-800">
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Fecha</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Hora</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Nombre</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Personal Asignado</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-300">Estado</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-300">Registro</th>
                </tr>
              </thead>
              <tbody>
                {turnosDetallados.map((turno: any) => (
                  <tr key={turno.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                    <td className="py-3 px-4 text-gray-300 text-sm">
                      {new Date(turno.fecha).toLocaleDateString('es-ES')}
                    </td>
                    <td className="py-3 px-4 text-gray-300 text-sm">
                      {turno.horaInicio} - {turno.horaFin}
                    </td>
                    <td className="py-3 px-4 text-white text-sm">{turno.nombre || `Turno #${turno.numeroTurnoDia}`}</td>
                    <td className="py-3 px-4 text-sm">
                      {turno.personalAsignado && turno.personalAsignado.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {turno.personalAsignado.map((p: any, idx: number) => (
                            <span 
                              key={idx} 
                              className={`px-2 py-1 rounded text-xs ${
                                p.tipo === 'Caddie' ? 'bg-blue-900/50 text-blue-300' :
                                p.tipo === 'Boleador' ? 'bg-purple-900/50 text-purple-300' :
                                'bg-gray-700 text-gray-300'
                              }`}
                            >
                              {p.nombre || p.tipo}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">Sin personal</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {turno.estado === 'completado' ? (
                        <span className="px-2 py-1 bg-green-900/50 text-green-400 text-xs rounded-full">
                          Completado
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-900/50 text-yellow-400 text-xs rounded-full">
                          En Progreso
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {turno.estadoRegistro === 'GUARDADO' ? (
                        <span className="px-2 py-1 bg-blue-900/50 text-blue-400 text-xs rounded-full">
                          Guardado
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded-full">
                          Activo
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente para el reporte de personal
const ReportePersonal: React.FC<{ datos: any }> = ({ datos }) => {
  if (!datos || !datos.resumen) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-center">
        <p className="text-gray-400">No hay datos de personal para mostrar</p>
      </div>
    );
  }

  const { resumen, personal } = datos;

  return (
    <div className="space-y-6">
      {/* Resumen General de Personal */}
      <div className="bg-gradient-to-br from-indigo-900/50 to-indigo-800/30 border border-indigo-700/50 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-indigo-400" />
          <h3 className="text-xl font-bold text-white">Total Personal Activo</h3>
        </div>
        <p className="text-5xl font-bold text-white">{resumen.totalPersonal}</p>
      </div>

      {/* Personal por Tipo */}
      {resumen.porTipo && resumen.porTipo.length > 0 && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            Personal por Tipo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumen.porTipo.map((tipo: any, index: number) => (
              <div key={index} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-semibold text-white">{tipo.tipoPersonal}</span>
                  <span className="text-2xl font-bold text-purple-400">{tipo.total}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Disponibles:</span>
                    <span className="text-green-400 font-semibold">{tipo.disponibles}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Ocupados:</span>
                    <span className="text-yellow-400 font-semibold">{tipo.ocupados}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Inactivos:</span>
                    <span className="text-red-400 font-semibold">{tipo.inactivos}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Listado Detallado de Personal */}
      {personal && personal.length > 0 && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              Personal Detallado ({personal.length})
            </h3>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-md transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-gray-800">
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Nombre</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Tipo</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-300">Estado</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Teléfono</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Email</th>
                </tr>
              </thead>
              <tbody>
                {personal.map((p: any) => (
                  <tr key={p.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                    <td className="py-3 px-4 text-white text-sm">{p.nombre}</td>
                    <td className="py-3 px-4 text-gray-300 text-sm">{p.tipoPersonal}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        p.estado?.toLowerCase() === 'disponible' ? 'bg-green-900/50 text-green-400' :
                        p.estado?.toLowerCase().includes('ocupado') ? 'bg-yellow-900/50 text-yellow-400' :
                        p.estado?.toLowerCase() === 'inactivo' ? 'bg-red-900/50 text-red-400' :
                        'bg-gray-700 text-gray-400'
                      }`}>
                        {p.estado || 'Sin estado'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300 text-sm">{p.telefono || '-'}</td>
                    <td className="py-3 px-4 text-gray-300 text-sm">{p.email || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
