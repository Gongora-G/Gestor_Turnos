import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Building, 
  Mail, 
  Phone, 
  Globe, 
  Clock, 
  Bell, 
  Shield, 
  Save,
  AlertCircle,
  CheckCircle,
  Wrench
} from 'lucide-react';
import configuracionService from '../services/configuracionService';
import type { UpdateConfiguracionClubDto } from '../types/configuracion';

const ConfiguracionGeneral: React.FC = () => {
  // const [configuracion, setConfiguracion] = useState<ConfiguracionClub | null>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  // Estados del formulario
  const [formData, setFormData] = useState<Partial<UpdateConfiguracionClubDto>>({
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    sitio_web: '',
    hora_apertura: '06:00',
    hora_cierre: '22:00',
    duracion_turno_minutos: 60,
    notificaciones_email: true,
    recordatorios_activos: true,
    backup_automatico: true,
    modo_mantenimiento: false,
  });

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    try {
      setLoading(true);
      const data = await configuracionService.getConfiguracionClub();
      // setConfiguracion(data); // Variable comentada temporalmente
      
      // Rellenar formulario con datos actuales
      setFormData({
        nombre: data.nombre || '',
        direccion: data.direccion || '',
        telefono: data.telefono || '',
        email: data.email || '',
        sitio_web: data.sitio_web || '',
        hora_apertura: data.hora_apertura || '06:00',
        hora_cierre: data.hora_cierre || '22:00',
        duracion_turno_minutos: data.duracion_turno_minutos || 60,
        notificaciones_email: data.notificaciones_email ?? true,
        recordatorios_activos: data.recordatorios_activos ?? true,
        backup_automatico: data.backup_automatico ?? true,
        modo_mantenimiento: data.modo_mantenimiento ?? false,
      });
    } catch (error: any) {
      console.error('Error al cargar configuración:', error);
      // No mostrar error en pantalla, solo registrar en consola
      // La configuración se creará automáticamente en el backend si no existe
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setGuardando(true);
      await configuracionService.updateConfiguracionClub(formData);
      mostrarMensaje('success', '¡Configuración actualizada correctamente!');
      await cargarConfiguracion(); // Recargar datos actualizados
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      mostrarMensaje('error', 'Error al guardar la configuración');
    } finally {
      setGuardando(false);
    }
  };

  const mostrarMensaje = (tipo: 'success' | 'error', texto: string) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 5000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <Settings className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Configuración General</h2>
            <p className="text-gray-400">Administra la información y configuraciones básicas de tu club</p>
          </div>
        </div>
      </div>

      {/* Info: Datos del registro */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 mb-6">
        <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-blue-300 text-sm">
            <span className="font-semibold">Los datos básicos del club</span> fueron configurados durante el registro inicial. 
            Puedes actualizarlos en cualquier momento desde aquí.
          </p>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sección: Información Básica */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center gap-3 mb-6">
            <Building className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-semibold text-white">Información Básica</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre del Club */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre del Club *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                maxLength={200}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ej: Club de Tenis Puerto Peñaliza"
              />
            </div>

            {/* Dirección */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Dirección
              </label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                maxLength={500}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ej: Calle Principal #123, Ciudad"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email de Contacto
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                maxLength={100}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="contacto@club.com"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Teléfono de Contacto
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                maxLength={20}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="+57 300 123 4567"
              />
            </div>

            {/* Sitio Web */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Sitio Web
              </label>
              <input
                type="url"
                name="sitio_web"
                value={formData.sitio_web}
                onChange={handleInputChange}
                maxLength={200}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="https://www.miclub.com"
              />
            </div>
          </div>
        </div>

        {/* Sección: Horarios y Turnos */}
        <div className="bg-gradient-to-br from-purple-800/20 to-purple-900/20 rounded-2xl p-6 border border-purple-700/30">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-semibold text-white">Horarios y Turnos</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Hora de Apertura */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Hora de Apertura
              </label>
              <input
                type="time"
                name="hora_apertura"
                value={formData.hora_apertura}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Hora de Cierre */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Hora de Cierre
              </label>
              <input
                type="time"
                name="hora_cierre"
                value={formData.hora_cierre}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Duración de Turno */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duración de Turno (minutos)
              </label>
              <input
                type="number"
                name="duracion_turno_minutos"
                value={formData.duracion_turno_minutos}
                onChange={handleInputChange}
                min={30}
                max={240}
                step={15}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Sección: Notificaciones y Sistema */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notificaciones */}
          <div className="bg-gradient-to-br from-yellow-800/20 to-yellow-900/20 rounded-2xl p-6 border border-yellow-700/30">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl font-semibold text-white">Notificaciones</h3>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="notificaciones_email"
                  checked={formData.notificaciones_email}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-yellow-500 focus:ring-2 focus:ring-yellow-500 cursor-pointer"
                />
                <span className="text-gray-300 group-hover:text-white transition-colors">
                  Notificaciones por Email
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="recordatorios_activos"
                  checked={formData.recordatorios_activos}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-yellow-500 focus:ring-2 focus:ring-yellow-500 cursor-pointer"
                />
                <span className="text-gray-300 group-hover:text-white transition-colors">
                  Recordatorios Automáticos
                </span>
              </label>
            </div>
          </div>

          {/* Sistema */}
          <div className="bg-gradient-to-br from-red-800/20 to-red-900/20 rounded-2xl p-6 border border-red-700/30">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-red-400" />
              <h3 className="text-xl font-semibold text-white">Sistema</h3>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="backup_automatico"
                  checked={formData.backup_automatico}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-gray-300 group-hover:text-white transition-colors">
                  Respaldo Automático
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="modo_mantenimiento"
                  checked={formData.modo_mantenimiento}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-red-500 focus:ring-2 focus:ring-red-500 cursor-pointer"
                />
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-red-400" />
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    Modo Mantenimiento
                  </span>
                </div>
              </label>
              <p className="text-xs text-gray-400 ml-8">⚠️ Desactiva temporalmente el acceso al sistema para usuarios</p>
            </div>
          </div>
        </div>

        {/* Botón de Guardar */}
        <div className="flex justify-end pt-4 border-t border-gray-700">
          <button
            type="submit"
            disabled={guardando}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {guardando ? (
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
      </form>
    </div>
  );
};

export default ConfiguracionGeneral;
