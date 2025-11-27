import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Bell, 
  Download,
  AlertTriangle,
  FileText,
  Wrench,
  Save,
  CheckCircle,
  AlertCircle,
  Shield,
  Eye,
  RefreshCw,
  Settings as SettingsIcon
} from 'lucide-react';
import configuracionService from '../services/configuracionService';

const ConfiguracionSistema: React.FC = () => {
  // const [configuracion, setConfiguracion] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  const [parametros, setParametros] = useState({
    duracion_turno_minutos: 60,
    hora_apertura: '06:00',
    hora_cierre: '22:00',
    backup_automatico: true,
    notificaciones_email: true,
    recordatorios_activos: true,
    modo_mantenimiento: false
  });

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    try {
      setLoading(true);
      const data = await configuracionService.getConfiguracionClub();
      // setConfiguracion(data); // Variable comentada temporalmente
      setParametros({
        duracion_turno_minutos: data.duracion_turno_minutos || 60,
        hora_apertura: data.hora_apertura || '06:00',
        hora_cierre: data.hora_cierre || '22:00',
        backup_automatico: data.backup_automatico ?? true,
        notificaciones_email: data.notificaciones_email ?? true,
        recordatorios_activos: data.recordatorios_activos ?? true,
        modo_mantenimiento: data.modo_mantenimiento ?? false
      });
    } catch (error) {
      console.error('Error al cargar configuración:', error);
    } finally {
      setLoading(false);
    }
  };

  const guardarParametros = async () => {
    try {
      await configuracionService.updateConfiguracionClub(parametros);
      mostrarMensaje('success', 'Parámetros actualizados correctamente');
      await cargarConfiguracion();
    } catch (error) {
      console.error('Error al guardar:', error);
      mostrarMensaje('error', 'Error al guardar los parámetros');
    }
  };

  const mostrarMensaje = (tipo: 'success' | 'error', texto: string) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 5000);
  };

  const cardStyles = {
    background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #374151',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-500/20 rounded-xl">
            <Shield className="w-8 h-8 text-orange-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Configuración del Sistema</h2>
            <p className="text-gray-400">Gestiona configuraciones avanzadas y mantenimiento</p>
          </div>
        </div>
      </div>

      {/* Mensaje de feedback */}
      {mensaje && (
        <div className={`flex items-center gap-3 p-4 rounded-xl ${
          mensaje.tipo === 'success' 
            ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {mensaje.tipo === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{mensaje.texto}</span>
        </div>
      )}

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Respaldos de Datos */}
        <div style={cardStyles}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Database className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Respaldos de Datos</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Gestiona copias de seguridad automáticas de tus datos
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <RefreshCw className="w-4 h-4" />
                <span>Backup Automático</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={parametros.backup_automatico}
                  onChange={(e) => setParametros({ ...parametros, backup_automatico: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>

            <button
              className="w-full px-4 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-all flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Descargar Backup Manual
            </button>
          </div>
        </div>

        {/* Logs de Actividad */}
        <div style={cardStyles}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <FileText className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Logs de Actividad</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Revisa el historial de acciones realizadas en el sistema
          </p>
          <button
            className="w-full px-4 py-3 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-all flex items-center justify-center gap-2 font-medium"
          >
            <Eye className="w-5 h-5" />
            Ver Logs del Sistema
          </button>
        </div>

        {/* Notificaciones */}
        <div style={cardStyles}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <Bell className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Notificaciones</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Configura alertas y recordatorios del sistema
          </p>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={parametros.notificaciones_email}
                onChange={(e) => setParametros({ ...parametros, notificaciones_email: e.target.checked })}
                className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-yellow-500 focus:ring-2 focus:ring-yellow-500 cursor-pointer"
              />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                Notificaciones por Email
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={parametros.recordatorios_activos}
                onChange={(e) => setParametros({ ...parametros, recordatorios_activos: e.target.checked })}
                className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-yellow-500 focus:ring-2 focus:ring-yellow-500 cursor-pointer"
              />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                Recordatorios Automáticos
              </span>
            </label>
          </div>
        </div>

        {/* Parámetros Generales */}
        <div style={cardStyles}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-cyan-500/20 rounded-xl">
              <SettingsIcon className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Parámetros Generales</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Configuraciones predeterminadas del sistema
          </p>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Duración de Turno</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={parametros.duracion_turno_minutos}
                  onChange={(e) => setParametros({ ...parametros, duracion_turno_minutos: Number(e.target.value) })}
                  min={30}
                  max={240}
                  step={15}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <span className="text-sm text-gray-400">min</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Apertura</label>
                <input
                  type="time"
                  value={parametros.hora_apertura}
                  onChange={(e) => setParametros({ ...parametros, hora_apertura: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Cierre</label>
                <input
                  type="time"
                  value={parametros.hora_cierre}
                  onChange={(e) => setParametros({ ...parametros, hora_cierre: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modo Mantenimiento */}
        <div style={cardStyles} className="border-red-500/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-500/20 rounded-xl">
              <Wrench className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Modo Mantenimiento</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Desactiva temporalmente el acceso al sistema
          </p>
          
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg mb-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-xs">
                Al activar, los usuarios no podrán acceder al sistema hasta que lo desactives
              </p>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer group p-3 bg-gray-700/30 rounded-lg">
            <input
              type="checkbox"
              checked={parametros.modo_mantenimiento}
              onChange={(e) => setParametros({ ...parametros, modo_mantenimiento: e.target.checked })}
              className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-red-500 focus:ring-2 focus:ring-red-500 cursor-pointer"
            />
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">
              {parametros.modo_mantenimiento ? '🔴 Mantenimiento Activo' : '🟢 Sistema Operativo'}
            </span>
          </label>
        </div>

      </div>

      {/* Botón Guardar Cambios */}
      <div className="flex justify-end pt-4 border-t border-gray-700">
        <button
          onClick={guardarParametros}
          disabled={loading}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold shadow-lg shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Guardar Cambios
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ConfiguracionSistema;
