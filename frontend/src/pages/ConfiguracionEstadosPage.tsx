import { useState, useEffect } from 'react';
import { 
  Settings, 
  Plus, 
  Edit2, 
  Trash2, 
  Power, 
  PowerOff, 
  Shield, 
  AlertTriangle 
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

export default function ConfiguracionEstadosPage() {
  const toast = useToast();
  const [estados, setEstados] = useState<EstadoPersonal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
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
    } catch (error) {
      console.error('Error cargando estados:', error);
      toast.error('Error al cargar estados del personal');
    } finally {
      setLoading(false);
    }
  };

  const handleCrear = async () => {
    try {
      await apiService.post('/estados-personal', estadoActual);
      toast.success('Estado creado exitosamente');
      setShowModal(false);
      cargarEstados();
      limpiarFormulario();
    } catch (error: any) {
      console.error('Error creando estado:', error);
      toast.error(error.response?.data?.message || 'Error al crear estado');
    }
  };

  const handleEditar = async () => {
    try {
      await apiService.patch(`/estados-personal/${estadoActual.id}`, estadoActual);
      toast.success('Estado actualizado exitosamente');
      setShowModal(false);
      cargarEstados();
      limpiarFormulario();
    } catch (error: any) {
      console.error('Error actualizando estado:', error);
      toast.error(error.response?.data?.message || 'Error al actualizar estado');
    }
  };

  const handleEliminar = async (estado: EstadoPersonal) => {
    if (estado.esSistema) {
      toast.error('No se pueden eliminar estados del sistema');
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar el estado "${estado.nombre}"?`)) {
      return;
    }

    try {
      await apiService.delete(`/estados-personal/${estado.id}`);
      toast.success('Estado eliminado exitosamente');
      cargarEstados();
    } catch (error: any) {
      console.error('Error eliminando estado:', error);
      toast.error(error.response?.data?.message || 'Error al eliminar estado');
    }
  };

  const handleToggleActivo = async (estado: EstadoPersonal) => {
    if (estado.esSistema && estado.activo) {
      toast.error('No se pueden desactivar estados del sistema');
      return;
    }

    try {
      await apiService.patch(`/estados-personal/${estado.id}/toggle-activo`, {});
      toast.success(`Estado ${estado.activo ? 'desactivado' : 'activado'} exitosamente`);
      cargarEstados();
    } catch (error: any) {
      console.error('Error cambiando estado:', error);
      toast.error(error.response?.data?.message || 'Error al cambiar estado');
    }
  };

  const abrirModalCrear = () => {
    limpiarFormulario();
    setEditando(false);
    setShowModal(true);
  };

  const abrirModalEditar = (estado: EstadoPersonal) => {
    setEstadoActual(estado);
    setEditando(true);
    setShowModal(true);
  };

  const limpiarFormulario = () => {
    setEstadoActual({
      nombre: '',
      color: '#6B7280',
      activo: true,
      esOcupado: false,
      descripcion: '',
    });
  };

  const inicializarEstadosSistema = async () => {
    try {
      await apiService.post('/estados-personal/inicializar', {});
      toast.success('Estados del sistema inicializados');
      cargarEstados();
    } catch (error: any) {
      console.error('Error inicializando estados:', error);
      toast.error(error.response?.data?.message || 'Error al inicializar estados');
    }
  };

  const coloresPreset = [
    { nombre: 'Verde', valor: '#10B981' },
    { nombre: 'Amarillo', valor: '#F59E0B' },
    { nombre: 'Rojo', valor: '#EF4444' },
    { nombre: 'Azul', valor: '#3B82F6' },
    { nombre: 'Púrpura', valor: '#8B5CF6' },
    { nombre: 'Gris', valor: '#6B7280' },
    { nombre: 'Rosa', valor: '#EC4899' },
    { nombre: 'Cyan', valor: '#06B6D4' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Settings className="w-10 h-10 text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold">Estados del Personal</h1>
              <p className="text-gray-400 mt-1">Gestiona los estados personalizados del personal</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={inicializarEstadosSistema}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span>Inicializar Sistema</span>
            </button>
            <button
              onClick={abrirModalCrear}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Crear Estado</span>
            </button>
          </div>
        </div>

        {/* Tabla de Estados */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Color
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
                      <p className="mt-2 text-gray-400">Cargando estados...</p>
                    </td>
                  </tr>
                ) : estados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <AlertTriangle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">No hay estados configurados</p>
                      <button
                        onClick={inicializarEstadosSistema}
                        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
                      >
                        Inicializar Estados del Sistema
                      </button>
                    </td>
                  </tr>
                ) : (
                  estados.map((estado) => (
                    <tr key={estado.id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          {estado.esSistema && (
                            <span title="Estado del sistema">
                              <Shield className="w-4 h-4 text-yellow-500" />
                            </span>
                          )}
                          <span className="font-medium">{estado.nombre}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-6 h-6 rounded border border-gray-600"
                            style={{ backgroundColor: estado.color }}
                          ></div>
                          <span className="text-xs text-gray-400">{estado.color}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            estado.esOcupado
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : 'bg-green-500/20 text-green-300'
                          }`}
                        >
                          {estado.esOcupado ? 'Ocupado' : 'Libre'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-400">{estado.descripcion || '-'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActivo(estado)}
                          disabled={estado.esSistema && estado.activo}
                          className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
                            estado.activo
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-gray-600/20 text-gray-400'
                          } ${estado.esSistema && estado.activo ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
                        >
                          {estado.activo ? <Power className="w-3 h-3" /> : <PowerOff className="w-3 h-3" />}
                          <span>{estado.activo ? 'Activo' : 'Inactivo'}</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => abrirModalEditar(estado)}
                            className="p-2 text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {!estado.esSistema && (
                            <button
                              onClick={() => handleEliminar(estado)}
                              className="p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Crear/Editar */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4">
                {editando ? 'Editar Estado' : 'Crear Nuevo Estado'}
              </h3>

              <div className="space-y-4">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Nombre del Estado *
                  </label>
                  <input
                    type="text"
                    value={estadoActual.nombre}
                    onChange={(e) => setEstadoActual({ ...estadoActual, nombre: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: En Capacitación"
                  />
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Color del Badge *
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {coloresPreset.map((preset) => (
                      <button
                        key={preset.valor}
                        onClick={() => setEstadoActual({ ...estadoActual, color: preset.valor })}
                        className={`px-3 py-2 rounded flex items-center space-x-2 border-2 transition-colors ${
                          estadoActual.color === preset.valor
                            ? 'border-blue-500'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <div
                          className="w-5 h-5 rounded"
                          style={{ backgroundColor: preset.valor }}
                        ></div>
                        <span className="text-xs">{preset.nombre}</span>
                      </button>
                    ))}
                  </div>
                  <input
                    type="color"
                    value={estadoActual.color}
                    onChange={(e) => setEstadoActual({ ...estadoActual, color: e.target.value })}
                    className="w-full h-10 bg-gray-700 border border-gray-600 rounded-md cursor-pointer"
                  />
                </div>

                {/* Es Ocupado */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="esOcupado"
                    checked={estadoActual.esOcupado}
                    onChange={(e) => setEstadoActual({ ...estadoActual, esOcupado: e.target.checked })}
                    className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="esOcupado" className="text-sm text-gray-300">
                    Marcar como "Ocupado" (personal no disponible para turnos)
                  </label>
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Descripción (opcional)
                  </label>
                  <textarea
                    value={estadoActual.descripcion}
                    onChange={(e) => setEstadoActual({ ...estadoActual, descripcion: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Describe cuándo usar este estado..."
                  />
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowModal(false);
                    limpiarFormulario();
                  }}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={editando ? handleEditar : handleCrear}
                  disabled={!estadoActual.nombre || !estadoActual.color}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {editando ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
