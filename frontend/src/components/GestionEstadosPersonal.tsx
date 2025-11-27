import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Power, 
  PowerOff, 
  Shield, 
  AlertTriangle,
  Activity 
} from 'lucide-react';
import { apiService } from '../services/api';
import { useToast } from '../contexts/ToastContext';

interface EstadoPersonal {
  id: number;
  nombre: string;
  color: string;
  activo: boolean;
  esOcupado: boolean;
  esSistema: boolean;
  descripcion: string;
}

export default function GestionEstadosPersonal() {
  const toast = useToast();
  const [estados, setEstados] = useState<EstadoPersonal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showModalEliminar, setShowModalEliminar] = useState(false);
  const [estadoAEliminar, setEstadoAEliminar] = useState<EstadoPersonal | null>(null);
  const [editando, setEditando] = useState(false);
  const [estadoActual, setEstadoActual] = useState<Partial<EstadoPersonal>>({
    nombre: '',
    color: '#6B7280',
    activo: true,
    esOcupado: false,
    descripcion: '',
  });

  useEffect(() => {
    cargarEstados();
  }, []);

  const cargarEstados = async () => {
    try {
      setLoading(true);
      const response = await apiService.get<EstadoPersonal[]>('/estados-personal');
      setEstados(response);
      
      // Si no hay estados, inicializar automáticamente (solo una vez)
      if (response.length === 0 && !loading) {
        await inicializarEstadosSistema();
      }
    } catch (error) {
      console.error('Error cargando estados:', error);
      toast.error('Error al cargar estados del personal');
    } finally {
      setLoading(false);
    }
  };

  const inicializarEstadosSistema = async () => {
    try {
      await apiService.post('/estados-personal/inicializar', {});
      const response = await apiService.get<EstadoPersonal[]>('/estados-personal');
      setEstados(response);
      toast.success('Estados del sistema inicializados correctamente');
    } catch (error) {
      console.error('Error inicializando estados:', error);
      toast.error('Error al inicializar estados del sistema');
    }
  };

  const guardarEstado = async () => {
    try {
      if (editando) {
        await apiService.patch(`/estados-personal/${estadoActual.id}`, estadoActual);
        toast.success('Estado actualizado correctamente');
      } else {
        await apiService.post('/estados-personal', estadoActual);
        toast.success('Estado creado correctamente');
      }
      
      setShowModal(false);
      resetForm();
      cargarEstados();
    } catch (error: any) {
      const mensaje = error.response?.data?.message || 'Error al guardar el estado';
      toast.error(mensaje);
    }
  };

  const abrirModalEliminar = (estado: EstadoPersonal) => {
    if (estado.esSistema) {
      toast.error('No se pueden eliminar estados del sistema');
      return;
    }
    setEstadoAEliminar(estado);
    setShowModalEliminar(true);
  };

  const confirmarEliminarEstado = async () => {
    if (!estadoAEliminar) return;

    try {
      await apiService.delete(`/estados-personal/${estadoAEliminar.id}`);
      toast.success('Estado eliminado correctamente');
      setShowModalEliminar(false);
      setEstadoAEliminar(null);
      cargarEstados();
    } catch (error: any) {
      const mensaje = error.response?.data?.message || 'Error al eliminar el estado';
      toast.error(mensaje);
    }
  };

  const toggleActivo = async (estado: EstadoPersonal) => {
    try {
      await apiService.patch(`/estados-personal/${estado.id}/toggle-activo`, {});
      toast.success(`Estado ${estado.activo ? 'desactivado' : 'activado'} correctamente`);
      cargarEstados();
    } catch (error) {
      toast.error('Error al cambiar estado');
    }
  };

  const abrirModal = (estado?: EstadoPersonal) => {
    if (estado) {
      setEditando(true);
      setEstadoActual(estado);
    } else {
      setEditando(false);
      resetForm();
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setEstadoActual({
      nombre: '',
      color: '#6B7280',
      activo: true,
      esOcupado: false,
      descripcion: '',
    });
  };

  const coloresDisponibles = [
    { nombre: 'Verde', valor: '#10b981', descripcion: 'Disponible' },
    { nombre: 'Amarillo', valor: '#f59e0b', descripcion: 'Ocupado' },
    { nombre: 'Rojo', valor: '#ef4444', descripcion: 'No Disponible' },
    { nombre: 'Azul', valor: '#3b82f6', descripcion: 'En Servicio' },
    { nombre: 'Púrpura', valor: '#8b5cf6', descripcion: 'Descanso' },
    { nombre: 'Gris', valor: '#6b7280', descripcion: 'Inactivo' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 rounded-xl">
            <Activity className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Estados del Personal</h3>
            <p className="text-gray-400">Gestiona los estados personalizados para el personal del club</p>
          </div>
        </div>
        <button
          onClick={() => abrirModal()}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/30 transition-all"
        >
          <Plus className="w-5 h-5" />
          Nuevo Estado
        </button>
      </div>

      {/* Mensaje si no hay estados */}
      {estados.length === 0 && (
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-12 border border-gray-700/50 text-center">
          <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No hay estados configurados</h3>
          <p className="text-gray-400 mb-6">
            Crea estados personalizados para gestionar la disponibilidad de tu personal
          </p>
          <button
            onClick={() => abrirModal()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/30 transition-all"
          >
            <Plus className="w-5 h-5" />
            Crear Primer Estado
          </button>
        </div>
      )}

      {/* Lista de Estados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {estados.map((estado) => (
          <div
            key={estado.id}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all"
          >
            {/* Header con color */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ 
                    backgroundColor: `${estado.color}20`, 
                    border: `2px solid ${estado.color}40` 
                  }}
                >
                  <Activity className="w-6 h-6" style={{ color: estado.color }} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">{estado.nombre}</h4>
                  {estado.esSistema && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-blue-500/20 text-blue-400">
                      <Shield className="w-3 h-3" />
                      Sistema
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Descripción */}
            {estado.descripcion && (
              <p className="text-gray-400 text-sm mb-4">{estado.descripcion}</p>
            )}

            {/* Propiedades */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Estado:</span>
                <span className={`font-medium ${estado.activo ? 'text-green-400' : 'text-gray-500'}`}>
                  {estado.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              {estado.esOcupado && (
                <div className="flex items-center gap-2 text-sm text-yellow-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Marca como ocupado</span>
                </div>
              )}
            </div>

            {/* Acciones */}
            <div className="flex gap-2">
              <button
                onClick={() => toggleActivo(estado)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  estado.activo
                    ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                    : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                }`}
                title={estado.activo ? 'Desactivar' : 'Activar'}
              >
                {estado.activo ? (
                  <>
                    <PowerOff className="w-4 h-4 inline mr-1" />
                    Desactivar
                  </>
                ) : (
                  <>
                    <Power className="w-4 h-4 inline mr-1" />
                    Activar
                  </>
                )}
              </button>
              <button
                onClick={() => abrirModal(estado)}
                className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-all"
                title="Editar"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              {!estado.esSistema && (
                <button
                  onClick={() => abrirModalEliminar(estado)}
                  className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-all"
                  title="Eliminar"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full border border-purple-500/30 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">
              {editando ? 'Editar Estado' : 'Nuevo Estado'}
            </h3>

            <div className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre del Estado *
                </label>
                <input
                  type="text"
                  value={estadoActual.nombre}
                  onChange={(e) => setEstadoActual({ ...estadoActual, nombre: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ej: Disponible, Ocupado"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  value={estadoActual.descripcion}
                  onChange={(e) => setEstadoActual({ ...estadoActual, descripcion: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Descripción opcional"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Color de Identificación
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {coloresDisponibles.map((colorOpcion) => (
                    <button
                      key={colorOpcion.valor}
                      type="button"
                      onClick={() => setEstadoActual({ ...estadoActual, color: colorOpcion.valor })}
                      className={`relative p-4 rounded-xl transition-all ${
                        estadoActual.color === colorOpcion.valor
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: colorOpcion.valor }}
                      title={colorOpcion.descripcion}
                    >
                      {estadoActual.color === colorOpcion.valor && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Activity className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Opciones */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={estadoActual.esOcupado}
                    onChange={(e) => setEstadoActual({ ...estadoActual, esOcupado: e.target.checked })}
                    className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    Marca como ocupado (no disponible para turnos)
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={estadoActual.activo}
                    onChange={(e) => setEstadoActual({ ...estadoActual, activo: e.target.checked })}
                    className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    Estado activo
                  </span>
                </label>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3 bg-gray-700/50 hover:bg-gray-700 text-white rounded-xl transition-all font-medium border border-gray-600/50"
              >
                Cancelar
              </button>
              <button
                onClick={guardarEstado}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl transition-all font-medium shadow-lg shadow-purple-500/30"
              >
                {editando ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showModalEliminar && estadoAEliminar && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[10000]">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full border border-red-500/30 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Eliminar Estado</h3>
                <p className="text-gray-400 text-sm">Esta acción no se puede deshacer</p>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700/50">
              <p className="text-gray-300 mb-3">
                ¿Estás seguro de que deseas eliminar el estado <span className="font-bold text-white">"{estadoAEliminar.nombre}"</span>?
              </p>
              
              <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <p className="text-sm text-yellow-200">
                  El personal con este estado quedará sin estado asignado
                </p>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModalEliminar(false);
                  setEstadoAEliminar(null);
                }}
                className="flex-1 px-6 py-3 bg-gray-700/50 hover:bg-gray-700 text-white rounded-xl transition-all font-medium border border-gray-600/50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminarEstado}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all font-medium shadow-lg shadow-red-500/30"
              >
                Eliminar Estado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
