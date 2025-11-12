import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Users, Settings } from 'lucide-react';
import { tiposPersonalService } from '../services/tiposPersonalService';
import type { TipoPersonal, CampoPersonalizado } from '../services/tiposPersonalService';
import { useToast } from '../contexts/ToastContext';

export const TiposPersonalConfig: React.FC = () => {
  const [tipos, setTipos] = useState<TipoPersonal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTipo, setEditingTipo] = useState<TipoPersonal | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tipoToDelete, setTipoToDelete] = useState<TipoPersonal | null>(null);
  const toast = useToast();

  // Obtener el clubId del usuario actual (ajustar según tu implementación)
  const clubId = localStorage.getItem('clubId') || 'default-club-id';

  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    descripcion: '',
    activo: true,
    campos_personalizados: [] as CampoPersonalizado[],
  });

  useEffect(() => {
    cargarTipos();
  }, []);

  const cargarTipos = async () => {
    try {
      setLoading(true);
      const data = await tiposPersonalService.getAll(clubId);
      setTipos(data);
    } catch (error) {
      toast.error('Error al cargar tipos de personal');
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (tipo?: TipoPersonal) => {
    if (tipo) {
      setEditingTipo(tipo);
      setFormData({
        nombre: tipo.nombre,
        codigo: tipo.codigo,
        descripcion: tipo.descripcion || '',
        activo: tipo.activo,
        campos_personalizados: tipo.campos_personalizados || [],
      });
    } else {
      setEditingTipo(null);
      setFormData({
        nombre: '',
        codigo: '',
        descripcion: '',
        activo: true,
        campos_personalizados: [],
      });
    }
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditingTipo(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTipo) {
        await tiposPersonalService.update(editingTipo.id, formData);
        toast.success('Tipo de personal actualizado correctamente');
      } else {
        await tiposPersonalService.create({
          ...formData,
          clubId,
        });
        toast.success('Tipo de personal creado correctamente');
      }
      
      await cargarTipos();
      cerrarModal();
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar');
    }
  };

  const handleDelete = (tipo: TipoPersonal) => {
    setTipoToDelete(tipo);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!tipoToDelete) return;
    
    try {
      setLoading(true);
      await tiposPersonalService.delete(tipoToDelete.id);
      toast.success('Tipo eliminado correctamente');
      await cargarTipos();
      setShowDeleteModal(false);
      setTipoToDelete(null);
    } catch (error) {
      toast.error('Error al eliminar. Puede que tenga personal asignado.');
    } finally {
      setLoading(false);
    }
  };

  const crearTiposPorDefecto = async () => {
    try {
      await tiposPersonalService.crearTiposPorDefecto(clubId);
      toast.success('Tipos por defecto creados correctamente');
      await cargarTipos();
    } catch (error) {
      toast.error('Error al crear tipos por defecto');
    }
  };

  const agregarCampo = () => {
    setFormData({
      ...formData,
      campos_personalizados: [
        ...formData.campos_personalizados,
        {
          nombre: '',
          tipo: 'text',
          label: '',
          requerido: false,
        },
      ],
    });
  };

  const eliminarCampo = (index: number) => {
    const nuevosCampos = [...formData.campos_personalizados];
    nuevosCampos.splice(index, 1);
    setFormData({ ...formData, campos_personalizados: nuevosCampos });
  };

  const actualizarCampo = (index: number, campo: Partial<CampoPersonalizado>) => {
    const nuevosCampos = [...formData.campos_personalizados];
    nuevosCampos[index] = { ...nuevosCampos[index], ...campo };
    setFormData({ ...formData, campos_personalizados: nuevosCampos });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-7 h-7" />
            Configuración de Tipos de Personal
          </h1>
          <p className="text-gray-400 mt-1">
            Gestiona los tipos de personal configurables para tu club
          </p>
        </div>
        <div className="flex gap-2">
          {tipos.length === 0 && (
            <button
              onClick={crearTiposPorDefecto}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Crear Tipos por Defecto
            </button>
          )}
          <button
            onClick={() => abrirModal()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nuevo Tipo
          </button>
        </div>
      </div>

      {/* Grid de Tipos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tipos.map((tipo) => (
          <div
            key={tipo.id}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">{tipo.nombre}</h3>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => abrirModal(tipo)}
                  className="p-1 hover:bg-gray-700 rounded transition"
                >
                  <Edit className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => handleDelete(tipo)}
                  className="p-1 hover:bg-gray-700 rounded transition"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <p className="text-gray-400">
                <span className="font-medium">Código:</span> {tipo.codigo}
              </p>
              {tipo.descripcion && (
                <p className="text-gray-400">{tipo.descripcion}</p>
              )}
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  tipo.activo ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {tipo.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              {tipo.campos_personalizados && tipo.campos_personalizados.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-xs text-gray-500 mb-2">Campos personalizados:</p>
                  <div className="flex flex-wrap gap-1">
                    {tipo.campos_personalizados.map((campo, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                        {campo.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {tipos.length === 0 && (
        <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            No hay tipos de personal configurados
          </h3>
          <p className="text-gray-500 mb-4">
            Crea tipos personalizados o usa los predeterminados
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 bg-gray-800 p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editingTipo ? 'Editar Tipo de Personal' : 'Nuevo Tipo de Personal'}
              </h2>
              <button
                onClick={cerrarModal}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Código *
                  </label>
                  <input
                    type="text"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toLowerCase() })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    required
                    disabled={!!editingTipo}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  rows={2}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="activo"
                  checked={formData.activo}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="activo" className="text-sm text-gray-300">
                  Activo
                </label>
              </div>

              {/* Campos Personalizados */}
              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">Campos Personalizados</h3>
                  <button
                    type="button"
                    onClick={agregarCampo}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Campo
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.campos_personalizados.map((campo, index) => (
                    <div key={index} className="bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300">Campo {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => eliminarCampo(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Nombre del campo"
                          value={campo.nombre}
                          onChange={(e) => actualizarCampo(index, { nombre: e.target.value })}
                          className="bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Etiqueta visible"
                          value={campo.label}
                          onChange={(e) => actualizarCampo(index, { label: e.target.value })}
                          className="bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                        <select
                          value={campo.tipo}
                          onChange={(e) => actualizarCampo(index, { tipo: e.target.value as any })}
                          className="bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        >
                          <option value="text">Texto</option>
                          <option value="number">Número</option>
                          <option value="select">Selección</option>
                          <option value="checkbox">Checkbox</option>
                          <option value="textarea">Área de texto</option>
                        </select>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={campo.requerido}
                            onChange={(e) => actualizarCampo(index, { requerido: e.target.checked })}
                            className="w-4 h-4 rounded"
                          />
                          <label className="text-sm text-gray-300">Requerido</label>
                        </div>
                      </div>

                      {campo.tipo === 'select' && (
                        <input
                          type="text"
                          placeholder="Opciones (separadas por coma)"
                          value={campo.opciones?.join(', ') || ''}
                          onChange={(e) => actualizarCampo(index, { 
                            opciones: e.target.value.split(',').map(o => o.trim()).filter(o => o)
                          })}
                          className="mt-2 w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                      )}

                      {(campo.tipo === 'text' || campo.tipo === 'textarea') && (
                        <input
                          type="text"
                          placeholder="Placeholder"
                          value={campo.placeholder || ''}
                          onChange={(e) => actualizarCampo(index, { placeholder: e.target.value })}
                          className="mt-2 w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editingTipo ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && tipoToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-md w-full shadow-2xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-900/50 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-lg font-medium text-white">
                  Confirmar Eliminación
                </h3>
              </div>
              
              <p className="text-gray-300 mb-6">
                ¿Estás seguro de que deseas eliminar el tipo{' '}
                <span className="font-semibold text-white">
                  {tipoToDelete.nombre}
                </span>
                ?
                <br />
                <span className="text-sm text-gray-400 mt-2 block">
                  Esta acción no se puede deshacer y puede fallar si hay personal asignado a este tipo.
                </span>
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setTipoToDelete(null);
                  }}
                  className="px-4 py-2 text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors duration-150"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-150 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
