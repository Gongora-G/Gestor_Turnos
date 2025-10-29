import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts';
import { useSearchParams } from 'react-router-dom';
import { formatDateTime, getInitials } from '../utils';
import type { UserRole } from '../types';
import { AppLayout } from '../components';
import { 
  Calendar, 
  Clock, 
  Users, 
  BarChart3, 
  TrendingUp,
  DollarSign,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    const success = searchParams.get('success');
    const oauthResult = searchParams.get('oauth_result');
    
    if (oauthResult === 'success') {
      setSuccessMessage('¡OAuth configurado correctamente!');
    } else if (success === 'logged_in') {
      setSuccessMessage('¡Has iniciado sesión correctamente!');
    }
    
    if (success || oauthResult) {
      setSearchParams({});
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  }, [searchParams, setSearchParams]);

  // Datos de ejemplo para el dashboard
  const estadisticas = {
    turnosHoy: 12,
    turnosActivos: 8,
    turnosCompletados: 156,
    sociosActivos: 247,
    ingresosMensual: 45600,
    canchasOcupadas: 4,
    totalCanchas: 6
  };

  const turnosRecientes = [
    { id: '1', socio: 'Juan Pérez', cancha: 1, hora: '10:00', estado: 'activo' },
    { id: '2', socio: 'María García', cancha: 3, hora: '11:30', estado: 'activo' },
    { id: '3', socio: 'Carlos López', cancha: 2, hora: '14:00', estado: 'completado' },
    { id: '4', socio: 'Ana Martín', cancha: 5, hora: '16:00', estado: 'activo' }
  ];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
      case 'completado': return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      case 'cancelado': return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      default: return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
    }
  };

  return (
    <AppLayout>
      {/* Success Message */}
      {successMessage && (
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 text-center text-sm font-medium">
          {successMessage}
        </div>
      )}

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Dashboard del Club de Tenis
          </h1>
          <p className="text-lg text-gray-400">
            Resumen de actividades y estadísticas del día
          </p>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Turnos de hoy */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg p-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Calendar size={24} className="text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">
                  {estadisticas.turnosHoy}
                </div>
                <div className="text-sm text-gray-400">Turnos Hoy</div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              <span className="text-green-400 font-medium">+12%</span> vs ayer
            </div>
          </div>

          {/* Turnos activos */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 hover:scale-105 cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg p-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock size={24} className="text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">
                  {estadisticas.turnosActivos}
                </div>
                <div className="text-sm text-gray-400">En Progreso</div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Juegos en curso actualmente
            </div>
          </div>

          {/* Socios activos */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:scale-105 cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users size={24} className="text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">
                  {estadisticas.sociosActivos}
                </div>
                <div className="text-sm text-gray-400">Socios Activos</div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              <span className="text-green-400 font-medium">+5</span> nuevos este mes
            </div>
          </div>

          {/* Ingresos mensuales */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg p-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <DollarSign size={24} className="text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">
                  ${estadisticas.ingresosMensual.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Ingresos del Mes</div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              <span className="text-green-400 font-medium">+8%</span> vs mes anterior
            </div>
          </div>
        </div>

        {/* Grid de dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Turnos recientes */}
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
              <Activity size={20} className="text-blue-400" />
              Turnos Recientes
            </h3>
            
            <div className="space-y-3">
              {turnosRecientes.map((turno) => (
                <div 
                  key={turno.id}
                  className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-200 hover:bg-gray-700/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-semibold text-white">
                      {turno.socio.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium text-white mb-1">
                        {turno.socio}
                      </div>
                      <div className="text-xs text-gray-400">
                        Cancha #{turno.cancha} - {turno.hora}
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                    turno.estado === 'activo' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                    turno.estado === 'completado' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                    turno.estado === 'cancelado' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                    'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                  }`}>
                    {turno.estado}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Estado de las canchas */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
              <BarChart3 size={20} className="text-green-400" />
              Estado de Canchas
            </h3>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Ocupación</span>
                <span className="text-sm font-semibold text-white">
                  {estadisticas.canchasOcupadas}/{estadisticas.totalCanchas}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-300"
                  style={{ width: `${(estadisticas.canchasOcupadas / estadisticas.totalCanchas) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((cancha) => (
                <div 
                  key={cancha}
                  className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600"
                >
                  <span className="text-white text-sm font-medium">
                    Cancha #{cancha}
                  </span>
                  <div className="flex items-center gap-2">
                    {cancha <= estadisticas.canchasOcupadas ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-red-300 text-xs">Ocupada</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-green-300 text-xs">Disponible</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export { DashboardPage };