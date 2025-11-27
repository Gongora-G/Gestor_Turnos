import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Edit2, Trash2, Check, X, DollarSign, Tag, AlertCircle, CheckCircle } from 'lucide-react';
import configuracionService from '../services/configuracionService';
import type { TipoMembresia, CreateTipoMembresiaDto } from '../types/configuracion';
import { Modal } from './Modal';

const GestionMembresias: React.FC = () => {
  const [membresias, setMembresias] = useState<TipoMembresia[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [membresiaEditando, setMembresiaEditando] = useState<TipoMembresia | null>(null);
  const [membresiaAEliminar, setMembresiaAEliminar] = useState<TipoMembresia | null>(null);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  const [formData, setFormData] = useState<CreateTipoMembresiaDto>({
    nombre: '',
    descripcion: '',
    color: '#3b82f6',
    precio: 0,
    activo: true,
  });

  const coloresDisponibles = [
    { nombre: 'Azul', valor: '#3b82f6' },
    { nombre: 'Verde', valor: '#10b981' },
    { nombre: 'Púrpura', valor: '#8b5cf6' },
    { nombre: 'Rojo', valor: '#ef4444' },
    { nombre: 'Amarillo', valor: '#f59e0b' },
    { nombre: 'Rosa', valor: '#ec4899' },
    { nombre: 'Cyan', valor: '#06b6d4' },
    { nombre: 'Naranja', valor: '#f97316' },
  ];

  useEffect(() => {
    cargarMembresias();
  }, []);

  const cargarMembresias = async () => {
    try {
      setLoading(true);
      const data = await configuracionService.getTiposMembresia();
      setMembresias(data);
    } catch (error) {
      console.error('Error al cargar membresías:', error);
      mostrarMensaje('error', 'Error al cargar las membresías');
    } finally {
      setLoading(false);
    }
  };

  const abrirModalNuevo = () => {
    setMembresiaEditando(null);
    setFormData({
      nombre: '',
      descripcion: '',
      color: '#3b82f6',
      precio: 0,
      activo: true,
    });
    setMostrarModal(true);
  };

  const abrirModalEditar = (membresia: TipoMembresia) => {
    setMembresiaEditando(membresia);
    setFormData({
      nombre: membresia.nombre,
      descripcion: membresia.descripcion || '',
      color: membresia.color,
      precio: Number(membresia.precio) || 0,
      activo: membresia.activo,
    });
    setMostrarModal(true);
  };

  const abrirModalEliminar = (membresia: TipoMembresia) => {
    setMembresiaAEliminar(membresia);
    setMostrarModalEliminar(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (membresiaEditando) {
        await configuracionService.updateTipoMembresia(membresiaEditando.id, formData);
        mostrarMensaje('success', 'Membresía actualizada correctamente');
      } else {
        await configuracionService.createTipoMembresia(formData);
        mostrarMensaje('success', 'Membresía creada correctamente');
      }
      
      setMostrarModal(false);
      await cargarMembresias();
    } catch (error) {
      console.error('Error al guardar membresía:', error);
      mostrarMensaje('error', 'Error al guardar la membresía');
    }
  };

  const confirmarEliminar = async () => {
    if (!membresiaAEliminar) return;

    try {
      await configuracionService.deleteTipoMembresia(membresiaAEliminar.id);
      mostrarMensaje('success', 'Membresía eliminada correctamente');
      setMostrarModalEliminar(false);
      await cargarMembresias();
    } catch (error) {
      console.error('Error al eliminar membresía:', error);
      mostrarMensaje('error', 'Error al eliminar la membresía');
    }
  };

  const toggleActivo = async (membresia: TipoMembresia) => {
    try {
      await configuracionService.toggleTipoMembresiaActive(membresia.id);
      mostrarMensaje('success', `Membresía ${membresia.activo ? 'desactivada' : 'activada'} correctamente`);
      await cargarMembresias();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      mostrarMensaje('error', 'Error al cambiar el estado');
    }
  };

  const mostrarMensaje = (tipo: 'success' | 'error', texto: string) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 5000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
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
            <CreditCard className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Gestión de Membresías</h2>
            <p className="text-gray-400">Administra los tipos de membresía disponibles para los socios</p>
          </div>
        </div>
        <button
          onClick={abrirModalNuevo}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/30 transition-all"
        >
          <Plus className="w-5 h-5" />
          Nueva Membresía
        </button>
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

      {/* Lista de Membresías */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {membresias.map((membresia) => (
          <div
            key={membresia.id}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all"
          >
            {/* Header con color */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${membresia.color}20`, border: `2px solid ${membresia.color}40` }}
                >
                  <CreditCard className="w-6 h-6" style={{ color: membresia.color }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{membresia.nombre}</h3>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                      membresia.activo
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {membresia.activo ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
              </div>
            </div>

            {/* Descripción */}
            {membresia.descripcion && (
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{membresia.descripcion}</p>
            )}

            {/* Precio */}
            <div className="mb-4 p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Precio mensual</span>
                <div className="flex items-center gap-1 text-white font-bold text-lg">
                  <DollarSign className="w-5 h-5" />
                  {Number(membresia.precio).toLocaleString('es-CO')}
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-2">
              <button
                onClick={() => toggleActivo(membresia)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  membresia.activo
                    ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                    : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                }`}
              >
                {membresia.activo ? 'Desactivar' : 'Activar'}
              </button>
              <button
                onClick={() => abrirModalEditar(membresia)}
                className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-all"
                title="Editar"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => abrirModalEliminar(membresia)}
                className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-all"
                title="Eliminar"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        {/* Mensaje si no hay membresías */}
        {membresias.length === 0 && (
          <div className="col-span-full text-center py-12">
            <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No hay membresías registradas</p>
            <p className="text-gray-500 text-sm">Crea la primera membresía para comenzar</p>
          </div>
        )}
      </div>

      {/* Modal Crear/Editar */}
      {mostrarModal && (
        <Modal
          isOpen={mostrarModal}
          onClose={() => setMostrarModal(false)}
          title={membresiaEditando ? 'Editar Membresía' : 'Nueva Membresía'}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Nombre de la Membresía *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                maxLength={100}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Ej: Membresía Básica"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={3}
                maxLength={500}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                placeholder="Describe los beneficios y características de esta membresía"
              />
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Precio Mensual *
              </label>
              <input
                type="number"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })}
                required
                min={0}
                step={0.01}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="0.00"
              />
            </div>

            {/* Selector de Color */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Color de Identificación
              </label>
              <div className="grid grid-cols-4 gap-3">
                {coloresDisponibles.map((colorOpcion) => (
                  <button
                    key={colorOpcion.valor}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: colorOpcion.valor })}
                    className={`relative p-4 rounded-xl transition-all ${
                      formData.color === colorOpcion.valor
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: colorOpcion.valor }}
                  >
                    {formData.color === colorOpcion.valor && (
                      <Check className="w-5 h-5 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Estado Activo */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.activo}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                  className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                />
                <span className="text-gray-300 group-hover:text-white transition-colors">
                  Membresía activa (disponible para asignación)
                </span>
              </label>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setMostrarModal(false)}
                className="flex-1 px-6 py-3 bg-gray-700/50 hover:bg-gray-700 text-white rounded-xl transition-all font-medium border border-gray-600/50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl transition-all font-medium shadow-lg shadow-purple-500/30"
              >
                {membresiaEditando ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Confirmar Eliminación */}
      {mostrarModalEliminar && membresiaAEliminar && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          style={{ zIndex: 10000 }}
          onClick={() => setMostrarModalEliminar(false)}
        >
          <div 
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full border border-red-500/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-red-500/20 rounded-xl">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                  Eliminar Membresía
                </h3>
              </div>
              <button
                onClick={() => setMostrarModalEliminar(false)}
                className="p-2 hover:bg-gray-700/50 rounded-lg transition-all text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido */}
            <div className="space-y-4 mb-6">
              <p className="text-gray-300 text-lg">
                ¿Estás seguro de que deseas eliminar la membresía{' '}
                <span className="font-bold text-red-400">"{membresiaAEliminar.nombre}"</span>?
              </p>
              
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <p className="text-yellow-400 font-medium flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>Esta acción no se puede deshacer</span>
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Los socios con esta membresía quedarán sin tipo de membresía asignado.
                </p>
              </div>
            </div>

            {/* Botones */}
            <div className="flex space-x-3">
              <button
                onClick={() => setMostrarModalEliminar(false)}
                className="flex-1 px-6 py-3 bg-gray-700/50 hover:bg-gray-700 text-white rounded-xl transition-all font-medium border border-gray-600/50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminar}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all font-medium shadow-lg shadow-red-500/30"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionMembresias;
