import React, { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus, Check, X, Filter } from 'lucide-react';
import tareasService from '../services/tareasService';
import type { Tarea, CreateTareaDto } from '../services/tareasService';
import { useToast } from '../contexts/ToastContext';
import { Modal } from './Modal';

const GestionTareas: React.FC = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tareaEditando, setTareaEditando] = useState<Tarea | null>(null);
  const { addToast } = useToast();

  const [formData, setFormData] = useState<CreateTareaDto>({
    nombre: '',
    descripcion: '',
    categoria: '',
    tiempoEstimado: undefined,
    prioridad: 'media',
    activa: true,
  });

  const categorias = ['limpieza', 'mantenimiento', 'administracion', 'atencion_cliente', 'inventario', 'otro'];
  const prioridades = ['baja', 'media', 'alta', 'urgente'];

  useEffect(() => {
    cargarTareas();
  }, [filtroCategoria]);

  const cargarTareas = async () => {
    try {
      setLoading(true);
      const data = await tareasService.obtenerTareas(filtroCategoria || undefined);
      setTareas(data);
    } catch (error: any) {
      addToast({ type: 'error', title: 'Error', message: error.response?.data?.message || 'Error al cargar tareas' });
    } finally {
      setLoading(false);
    }
  };

  const abrirModalCrear = () => {
    setTareaEditando(null);
    setFormData({
      nombre: '',
      descripcion: '',
      categoria: '',
      tiempoEstimado: undefined,
      prioridad: 'media',
      activa: true,
    });
    setMostrarModal(true);
  };

  const abrirModalEditar = (tarea: Tarea) => {
    setTareaEditando(tarea);
    setFormData({
      nombre: tarea.nombre,
      descripcion: tarea.descripcion || '',
      categoria: tarea.categoria || '',
      tiempoEstimado: tarea.tiempoEstimado,
      prioridad: tarea.prioridad || 'media',
      activa: tarea.activa,
    });
    setMostrarModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      addToast({ type: 'error', title: 'Error', message: 'El nombre de la tarea es obligatorio' });
      return;
    }

    try {
      if (tareaEditando) {
        await tareasService.actualizarTarea(tareaEditando.id, formData);
        addToast({ type: 'success', title: 'Éxito', message: 'Tarea actualizada exitosamente' });
      } else {
        await tareasService.crearTarea(formData);
        addToast({ type: 'success', title: 'Éxito', message: 'Tarea creada exitosamente' });
      }
      setMostrarModal(false);
      cargarTareas();
    } catch (error: any) {
      addToast({ type: 'error', title: 'Error', message: error.response?.data?.message || 'Error al guardar tarea' });
    }
  };

  const handleToggleActiva = async (tarea: Tarea) => {
    try {
      await tareasService.toggleActiva(tarea.id);
      addToast({
        type: 'success',
        title: 'Éxito',
        message: `Tarea ${tarea.activa ? 'desactivada' : 'activada'} exitosamente`
      });
      cargarTareas();
    } catch (error: any) {
      addToast({ type: 'error', title: 'Error', message: error.response?.data?.message || 'Error al cambiar estado' });
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas desactivar esta tarea?')) return;

    try {
      await tareasService.eliminarTarea(id);
      addToast({ type: 'success', title: 'Éxito', message: 'Tarea desactivada exitosamente' });
      cargarTareas();
    } catch (error: any) {
      addToast({ type: 'error', title: 'Error', message: error.response?.data?.message || 'Error al eliminar tarea' });
    }
  };

  const getPrioridadColor = (prioridad?: string) => {
    switch (prioridad) {
      case 'baja':
        return 'bg-gradient-to-r from-green-600 to-green-700 text-white';
      case 'media':
        return 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white';
      case 'alta':
        return 'bg-gradient-to-r from-orange-600 to-orange-700 text-white';
      case 'urgente':
        return 'bg-gradient-to-r from-red-600 to-red-700 text-white';
      default:
        return 'bg-gradient-to-r from-gray-600 to-gray-700 text-white';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con botón de crear y filtros */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-3xl">📋</span>
                Gestión de Tareas
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Define las tareas que el personal debe completar
              </p>
            </div>
          </div>
          <button
            onClick={abrirModalCrear}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Nueva Tarea</span>
          </button>
        </div>
        
        {/* Filtro de categoría */}
        <div className="mt-4 flex items-center space-x-3">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">📁 Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'limpieza' ? '🧹' : cat === 'mantenimiento' ? '🔧' : cat === 'administracion' ? '📊' : cat === 'atencion_cliente' ? '👥' : cat === 'inventario' ? '📦' : '📝'} {cat.replace('_', ' ').charAt(0).toUpperCase() + cat.replace('_', ' ').slice(1)}
              </option>
            ))}
          </select>
          <span className="text-gray-400 text-sm">
            {tareas.length} {tareas.length === 1 ? 'tarea' : 'tareas'} {filtroCategoria && `en ${filtroCategoria}`}
          </span>
        </div>
      </div>

      {/* Tabla de tareas */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gradient-to-r from-gray-900 to-gray-800">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                📝 Nombre
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                💬 Descripción
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                📁 Categoría
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                ⏱️ Tiempo Est.
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                ⚡ Prioridad
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                🔘 Estado
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-300 uppercase tracking-wider">
                ⚙️ Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {tareas.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="text-6xl">📋</div>
                    <div className="text-gray-400 font-medium">No hay tareas registradas</div>
                    <div className="text-gray-500 text-sm">Crea una nueva tarea para comenzar</div>
                  </div>
                </td>
              </tr>
            ) : (
              tareas.map((tarea) => (
                <tr 
                  key={tarea.id} 
                  className={`hover:bg-gray-750 transition-colors ${!tarea.activa ? 'opacity-50' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-white">{tarea.nombre}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-400 max-w-xs truncate">
                      {tarea.descripcion || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md">
                      {tarea.categoria === 'limpieza' ? '🧹' : tarea.categoria === 'mantenimiento' ? '🔧' : tarea.categoria === 'administracion' ? '📊' : tarea.categoria === 'atencion_cliente' ? '👥' : tarea.categoria === 'inventario' ? '📦' : '📝'} {tarea.categoria?.replace('_', ' ') || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {tarea.tiempoEstimado ? (
                      <span className="flex items-center gap-1">
                        <span className="text-blue-400">⏱️</span>
                        {tarea.tiempoEstimado} min
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full shadow-md ${getPrioridadColor(
                        tarea.prioridad
                      )}`}
                    >
                      {tarea.prioridad === 'baja' ? '🟢' : tarea.prioridad === 'media' ? '🟡' : tarea.prioridad === 'alta' ? '🟠' : tarea.prioridad === 'urgente' ? '🔴' : '⚪'} {tarea.prioridad || 'media'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActiva(tarea)}
                      className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-bold shadow-md ${
                        tarea.activa
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                          : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800'
                      } transition-all transform hover:scale-105`}
                    >
                      {tarea.activa ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Activa</span>
                        </>
                      ) : (
                        <>
                          <X className="w-3 h-3" />
                          <span>Inactiva</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => abrirModalEditar(tarea)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 rounded-lg transition-all"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEliminar(tarea.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-all"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de crear/editar */}
      <Modal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        title={tareaEditando ? '✏️ Editar Tarea' : '➕ Nueva Tarea'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              📝 Nombre <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Ej: Limpiar canchas"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              💬 Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
              rows={3}
              placeholder="Describe los detalles de la tarea..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                📁 Categoría
              </label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">Seleccionar...</option>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'limpieza' ? '🧹' : cat === 'mantenimiento' ? '🔧' : cat === 'administracion' ? '📊' : cat === 'atencion_cliente' ? '👥' : cat === 'inventario' ? '📦' : '📝'} {cat.replace('_', ' ').charAt(0).toUpperCase() + cat.replace('_', ' ').slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                ⚡ Prioridad
              </label>
              <select
                value={formData.prioridad}
                onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                {prioridades.map((prioridad) => (
                  <option key={prioridad} value={prioridad}>
                    {prioridad === 'baja' ? '🟢' : prioridad === 'media' ? '🟡' : prioridad === 'alta' ? '🟠' : '🔴'} {prioridad.charAt(0).toUpperCase() + prioridad.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              ⏱️ Tiempo Estimado (minutos)
            </label>
            <input
              type="number"
              value={formData.tiempoEstimado || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tiempoEstimado: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="30"
              min="1"
            />
          </div>

          <div className="flex items-center bg-gray-700/50 p-4 rounded-lg border border-gray-600">
            <input
              type="checkbox"
              id="activa"
              checked={formData.activa}
              onChange={(e) => setFormData({ ...formData, activa: e.target.checked })}
              className="w-5 h-5 text-blue-600 border-gray-500 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="activa" className="ml-3 text-sm text-gray-200 font-medium">
              ✅ Tarea activa (disponible para asignar)
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={() => setMostrarModal(false)}
              className="px-6 py-3 border-2 border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-all font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg font-semibold"
            >
              {tareaEditando ? '💾 Actualizar' : '➕ Crear'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GestionTareas;
