import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Users, 
  Palette,
  CheckCircle
} from 'lucide-react';
import { tiposMembresiaService, type TipoMembresia, type CrearTipoMembresiaDto, type ActualizarTipoMembresiaDto } from '../services/tiposMembresiaService';
import { Modal } from './Modal';
import { useToast } from '../contexts/ToastContext';

interface GestionCategoriasProps {
  categorias: TipoMembresia[];
  onActualizar: () => void;
}

const COLORES_DISPONIBLES = [
  { nombre: 'Azul', valor: '#3b82f6' },
  { nombre: 'Verde', valor: '#10b981' },
  { nombre: 'Púrpura', valor: '#8b5cf6' },
  { nombre: 'Amarillo', valor: '#fbbf24' },
  { nombre: 'Rojo', valor: '#ef4444' },
  { nombre: 'Naranja', valor: '#f59e0b' },
  { nombre: 'Rosa', valor: '#ec4899' },
  { nombre: 'Índigo', valor: '#6366f1' },
  { nombre: 'Gris', valor: '#6b7280' },
  { nombre: 'Esmeralda', valor: '#059669' },
  { nombre: 'Cyan', valor: '#06b6d4' },
  { nombre: 'Lime', valor: '#65a30d' }
];

export const GestionCategorias: React.FC<GestionCategoriasProps> = ({
  categorias,
  onActualizar
}) => {
  const { addToast } = useToast();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState<TipoMembresia | null>(null);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [formData, setFormData] = useState<CrearTipoMembresiaDto>({
    nombre: '',
    descripcion: '',
    color: '#3b82f6'
  });

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      color: '#3b82f6'
    });
    setModalAbierto(false);
    setEditandoId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      addToast({
        type: 'error',
        title: 'Error de validación',
        message: 'El nombre de la categoría es requerido'
      });
      return;
    }

    setCargando(true);
    try {
      if (editandoId) {
        const dataActualizar: ActualizarTipoMembresiaDto = {
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          color: formData.color
        };
        await tiposMembresiaService.actualizarTipo(editandoId, dataActualizar);
        addToast({
          type: 'success',
          title: 'Categoría actualizada',
          message: `La categoría "${formData.nombre}" se ha actualizado correctamente`
        });
      } else {
        await tiposMembresiaService.crearTipo(formData);
        addToast({
          type: 'success',
          title: 'Categoría creada',
          message: `La categoría "${formData.nombre}" se ha creado correctamente`
        });
      }
      
      resetForm();
      onActualizar();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      addToast({
        type: 'error',
        title: 'Error al guardar',
        message: 'No se pudo guardar la categoría. Inténtalo de nuevo.'
      });
    } finally {
      setCargando(false);
    }
  };

  const iniciarEdicion = (categoria: TipoMembresia) => {
    setFormData({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || '',
      color: categoria.color
    });
    setEditandoId(categoria.id);
    setModalAbierto(true);
  };

  const confirmarEliminacion = (categoria: TipoMembresia) => {
    setCategoriaAEliminar(categoria);
    setModalEliminar(true);
  };

  const eliminarCategoria = async () => {
    if (!categoriaAEliminar) return;
    
    setCargando(true);
    try {
      await tiposMembresiaService.eliminarTipo(categoriaAEliminar.id);
      addToast({
        type: 'success',
        title: 'Categoría eliminada',
        message: `La categoría "${categoriaAEliminar.nombre}" se ha eliminado correctamente`
      });
      setModalEliminar(false);
      setCategoriaAEliminar(null);
      onActualizar();
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      addToast({
        type: 'error',
        title: 'Error al eliminar',
        message: 'No se pudo eliminar la categoría. Inténtalo de nuevo.'
      });
    } finally {
      setCargando(false);
    }
  };

  const toggleEstado = async (categoria: TipoMembresia) => {
    setCargando(true);
    try {
      await tiposMembresiaService.toggleActivo(categoria.id);
      addToast({
        type: 'success',
        title: categoria.activo ? 'Categoría desactivada' : 'Categoría activada',
        message: `La categoría "${categoria.nombre}" se ha ${categoria.activo ? 'desactivado' : 'activado'} correctamente`
      });
      onActualizar();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      addToast({
        type: 'error',
        title: 'Error al cambiar estado',
        message: 'No se pudo cambiar el estado de la categoría'
      });
    } finally {
      setCargando(false);
    }
  };

  const iniciarCreacion = () => {
    resetForm();
    setModalAbierto(true);
  };

  const categoriasOrdenadas = [...categorias].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #374151',
      color: '#fff'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            borderRadius: '8px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Users size={20} color="white" />
          </div>
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#f9fafb',
              margin: 0,
              lineHeight: '1.2'
            }}>
              Categorías de Socios
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#9ca3af',
              margin: '2px 0 0'
            }}>
              Personaliza los tipos de socios de tu club
            </p>
          </div>
        </div>

        <button
          onClick={iniciarCreacion}
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
        >
          <Plus size={14} />
          Nueva Categoría
        </button>
      </div>

      {/* Modal para crear/editar categoría */}
      <Modal
        isOpen={modalAbierto}
        onClose={resetForm}
        title={editandoId ? 'Editar Categoría' : 'Nueva Categoría'}
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <Palette size={16} style={{ color: '#3b82f6' }} />
            <p style={{ 
              margin: 0, 
              color: '#9ca3af', 
              fontSize: '14px'
            }}>
              {editandoId ? 'Modifica los datos de la categoría' : 'Configura los datos de la nueva categoría'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#e2e8f0',
                marginBottom: '6px'
              }}>
                Nombre de la Categoría
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="ej: Socio Propietario"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  fontSize: '14px',
                  color: '#f9fafb',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#e2e8f0',
                marginBottom: '6px'
              }}>
                Descripción
              </label>
              <input
                type="text"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Describe el tipo de socio..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  fontSize: '14px',
                  color: '#f9fafb',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#e2e8f0',
              marginBottom: '8px'
            }}>
              Color Identificativo
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(40px, 1fr))',
              gap: '8px',
              maxWidth: '400px'
            }}>
              {COLORES_DISPONIBLES.map((color) => (
                <button
                  key={color.valor}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.valor })}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: formData.color === color.valor ? '2px solid #fff' : '1px solid rgba(255, 255, 255, 0.2)',
                    background: color.valor,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  title={color.nombre}
                >
                  {formData.color === color.valor && <CheckCircle size={16} color="white" />}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={resetForm}
              style={{
                background: 'rgba(156, 163, 175, 0.2)',
                border: '1px solid rgba(156, 163, 175, 0.3)',
                borderRadius: '8px',
                color: '#9ca3af',
                padding: '10px 16px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <X size={16} />
              Cancelar
            </button>

            <button
              type="submit"
              disabled={cargando}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: cargando ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                opacity: cargando ? 0.6 : 1
              }}
            >
              <Save size={16} />
              {cargando ? 'Guardando...' : (editandoId ? 'Actualizar' : 'Crear Categoría')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Lista de categorías */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {categoriasOrdenadas.map((categoria) => (
          <div
            key={categoria.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              background: categoria.activo 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(156, 163, 175, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              opacity: categoria.activo ? 1 : 0.6,
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: categoria.color,
                  flexShrink: 0
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: categoria.activo ? '#f9fafb' : '#9ca3af',
                  marginBottom: '2px'
                }}>
                  {categoria.nombre}
                  {!categoria.activo && (
                    <span style={{
                      marginLeft: '8px',
                      fontSize: '11px',
                      color: '#ef4444',
                      fontWeight: '500'
                    }}>
                      (Inactiva)
                    </span>
                  )}
                </div>
                {categoria.descripcion && (
                  <div style={{
                    fontSize: '12px',
                    color: categoria.activo ? '#9ca3af' : '#6b7280'
                  }}>
                    {categoria.descripcion}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={() => toggleEstado(categoria)}
                disabled={cargando}
                style={{
                  background: categoria.activo ? '#ef4444' : '#10b981',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  padding: '6px',
                  cursor: cargando ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '500',
                  opacity: cargando ? 0.6 : 1
                }}
                title={categoria.activo ? 'Desactivar' : 'Activar'}
              >
                {categoria.activo ? 'Desactivar' : 'Activar'}
              </button>

              <button
                onClick={() => iniciarEdicion(categoria)}
                disabled={cargando}
                style={{
                  background: '#3b82f6',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  padding: '6px',
                  cursor: cargando ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: cargando ? 0.6 : 1
                }}
                title="Editar"
              >
                <Edit3 size={14} />
              </button>

              <button
                onClick={() => confirmarEliminacion(categoria)}
                disabled={cargando}
                style={{
                  background: '#ef4444',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  padding: '6px',
                  cursor: cargando ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: cargando ? 0.6 : 1
                }}
                title="Eliminar"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {categorias.length === 0 && (
          <div style={{
            padding: '32px',
            textAlign: 'center',
            color: '#9ca3af',
            background: 'rgba(156, 163, 175, 0.05)',
            borderRadius: '12px',
            border: '1px dashed rgba(156, 163, 175, 0.3)'
          }}>
            <Users size={32} style={{ opacity: 0.5, marginBottom: '8px' }} />
            <p style={{ margin: 0, fontSize: '14px' }}>
              No hay categorías configuradas.<br />
              Haz clic en "Nueva Categoría" para comenzar.
            </p>
          </div>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      <Modal
        isOpen={modalEliminar}
        onClose={() => {
          setModalEliminar(false);
          setCategoriaAEliminar(null);
        }}
        title="Confirmar Eliminación"
        size="md"
      >
        {categoriaAEliminar && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {/* Icono de advertencia */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '8px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '2px solid rgba(239, 68, 68, 0.3)'
              }}>
                <Trash2 size={28} color="#ef4444" />
              </div>
            </div>

            {/* Mensaje */}
            <div style={{ textAlign: 'center', color: '#f9fafb' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                margin: '0 0 12px 0'
              }}>
                ¿Eliminar Categoría?
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#9ca3af',
                margin: '0 0 8px 0',
                lineHeight: '1.5'
              }}>
                Esta acción eliminará permanentemente la categoría:
              </p>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                margin: '16px 0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  justifyContent: 'center'
                }}>
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: categoriaAEliminar.color,
                      flexShrink: 0
                    }}
                  />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{
                      fontWeight: '600',
                      color: '#f9fafb',
                      fontSize: '16px'
                    }}>
                      {categoriaAEliminar.nombre}
                    </div>
                    {categoriaAEliminar.descripcion && (
                      <div style={{
                        fontSize: '12px',
                        color: '#9ca3af'
                      }}>
                        {categoriaAEliminar.descripcion}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <p style={{
                fontSize: '13px',
                color: '#ef4444',
                margin: 0,
                fontWeight: '500'
              }}>
                Esta acción no se puede deshacer.
              </p>
            </div>

            {/* Botones */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              paddingTop: '8px'
            }}>
              <button
                onClick={() => {
                  setModalEliminar(false);
                  setCategoriaAEliminar(null);
                }}
                disabled={cargando}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'transparent',
                  color: '#9ca3af',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: cargando ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: cargando ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!cargando) {
                    e.currentTarget.style.backgroundColor = 'rgba(156, 163, 175, 0.1)';
                    e.currentTarget.style.color = '#f9fafb';
                    e.currentTarget.style.borderColor = '#9ca3af';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!cargando) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#9ca3af';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }
                }}
              >
                <X size={16} />
                Cancelar
              </button>
              
              <button
                onClick={eliminarCategoria}
                disabled={cargando}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  background: cargando 
                    ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
                    : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: cargando ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: cargando ? 'none' : '0 4px 12px rgba(239, 68, 68, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: cargando ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!cargando) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!cargando) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                  }
                }}
              >
                <Trash2 size={16} />
                {cargando ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default GestionCategorias;