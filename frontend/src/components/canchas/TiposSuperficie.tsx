import React, { useState, useEffect } from 'react';
import { canchasService, type TipoSuperficieCancha, type CreateTipoSuperficieDto } from '../../services/canchasService';
import { useToast } from '../../contexts/ToastContext';

const TiposSuperficie: React.FC = () => {
  const { success, error: showError } = useToast();
  const [tipos, setTipos] = useState<TipoSuperficieCancha[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState<TipoSuperficieCancha | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    color: '#3B82F6',
    velocidad: 'media' as 'rapida' | 'media' | 'lenta',
    requiereMantenimientoEspecial: false,
    orden: '1',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await canchasService.getTiposSuperficie();
      setTipos(data);
    } catch (error) {
      console.error('Error al cargar tipos:', error);
      showError('Error al cargar', 'No se pudieron cargar los tipos de superficie');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedTipo(null);
    setFormData({
      nombre: '',
      descripcion: '',
      color: '#3B82F6',
      velocidad: 'media',
      requiereMantenimientoEspecial: false,
      orden: (tipos.length + 1).toString(),
    });
    setIsModalOpen(true);
  };

  const handleEdit = (tipo: TipoSuperficieCancha) => {
    setSelectedTipo(tipo);
    setFormData({
      nombre: tipo.nombre,
      descripcion: tipo.descripcion || '',
      color: tipo.color || '#3B82F6',
      velocidad: tipo.velocidad || 'media',
      requiereMantenimientoEspecial: tipo.requiereMantenimientoEspecial,
      orden: tipo.orden.toString(),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data: CreateTipoSuperficieDto = {
        nombre: formData.nombre,
        descripcion: formData.descripcion || undefined,
        color: formData.color,
        velocidad: formData.velocidad,
        requiereMantenimientoEspecial: formData.requiereMantenimientoEspecial,
        orden: Number(formData.orden),
      };

      if (selectedTipo) {
        await canchasService.updateTipoSuperficie(selectedTipo.id, data);
        success('Tipo actualizado', `El tipo de superficie "${formData.nombre}" ha sido actualizado`);
      } else {
        await canchasService.createTipoSuperficie(data);
        success('Tipo creado', `El tipo de superficie "${formData.nombre}" ha sido creado exitosamente`);
      }

      setIsModalOpen(false);
      await loadData();
    } catch (error) {
      console.error('Error al guardar:', error);
      showError('Error al guardar', 'No se pudo guardar el tipo de superficie');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este tipo de superficie? Las canchas que lo usen quedarán sin superficie asignada.')) return;

    try {
      await canchasService.deleteTipoSuperficie(id);
      success('Tipo eliminado', 'El tipo de superficie ha sido eliminado exitosamente');
      await loadData();
    } catch (error: any) {
      console.error('Error al eliminar:', error);
      showError('Error al eliminar', error.response?.data?.message || 'No se puede eliminar este tipo de superficie');
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      await canchasService.toggleTipoSuperficieActiva(id);
      success('Estado actualizado', 'El estado del tipo de superficie ha sido actualizado');
      await loadData();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      showError('Error', 'No se pudo cambiar el estado del tipo de superficie');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>
          Define los tipos de superficie disponibles para las canchas del club
        </p>
        <button
          onClick={handleCreate}
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: 'white',
            borderWidth: '0',
            borderStyle: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Tipo
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {tipos.map((tipo) => (
          <div
            key={tipo.id}
            style={{
              background: tipo.activa ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' : '#1a1a1a',
              borderRadius: '16px',
              padding: '24px',
              border: `2px solid ${tipo.activa ? tipo.color || '#8b5cf6' : '#374151'}`,
              boxShadow: tipo.activa ? `0 8px 24px ${tipo.color}20` : '0 4px 12px rgba(0,0,0,0.3)',
              opacity: tipo.activa ? 1 : 0.6,
              transition: 'all 0.3s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    backgroundColor: tipo.color || '#8b5cf6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 12px ${tipo.color}40`
                  }}
                >
                  <svg width="28" height="28" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ color: '#f9fafb', fontSize: '18px', fontWeight: '700', margin: 0 }}>{tipo.nombre}</h3>
                  <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0, marginTop: '4px' }}>Orden: {tipo.orden}</p>
                </div>
              </div>
              <button
                onClick={() => handleToggleActive(tipo.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  background: tipo.activa ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: tipo.activa ? '#10b981' : '#ef4444'
                }}
              >
                {tipo.activa ? '✓ Activa' : '✕ Inactiva'}
              </button>
            </div>

            {tipo.descripcion && (
              <p style={{ color: '#d1d5db', fontSize: '13px', marginBottom: '16px', lineHeight: '1.6' }}>{tipo.descripcion}</p>
            )}

            <div style={{ marginBottom: '16px' }}>
              {tipo.requiereMantenimientoEspecial && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  background: 'rgba(251, 191, 36, 0.15)',
                  borderRadius: '8px',
                  border: '1px solid rgba(251, 191, 36, 0.3)'
                }}>
                  <svg width="16" height="16" fill="none" stroke="#fbbf24" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span style={{ color: '#fbbf24', fontSize: '12px', fontWeight: '500' }}>Requiere mantenimiento especial</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleEdit(tipo)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: 'transparent',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: '#8b5cf6',
                  borderRadius: '8px',
                  color: '#a78bfa',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                ✏️ Editar
              </button>
              <button
                onClick={() => handleDelete(tipo.id)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: 'transparent',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: '#ef4444',
                  borderRadius: '8px',
                  color: '#f87171',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {tipos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', gridColumn: '1 / -1' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎨</div>
          <p style={{ color: '#9ca3af', fontSize: '16px', fontWeight: '500' }}>No hay tipos de superficie configurados</p>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>Crea el primer tipo de superficie para tus canchas</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            style={{
              background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '600px',
              width: '90%',
              border: '1px solid #374151',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
              <div style={{
                padding: '12px',
                background: selectedTipo ? 'rgba(99, 102, 241, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="24" height="24" fill="none" stroke={selectedTipo ? '#6366f1' : '#10b981'} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ color: '#f9fafb', fontSize: '22px', fontWeight: '700', margin: 0 }}>
                  {selectedTipo ? '✏️ Editar Tipo de Superficie' : '➕ Nuevo Tipo de Superficie'}
                </h2>
                <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0, marginTop: '4px' }}>
                  {selectedTipo ? 'Modifica los detalles de la superficie' : 'Define las características de la nueva superficie'}
                </p>
              </div>
            </div>

            <div style={{ height: '1px', background: '#374151', margin: '20px 0' }} />

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: '20px' }}>
                {/* Nombre */}
                <div>
                  <label style={{ display: 'block', color: '#d1d5db', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                    🏷️ Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: '#111827',
                      border: '1px solid #374151',
                      borderRadius: '10px',
                      color: '#f9fafb',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    placeholder="Ej: Arcilla, Césped, Cemento"
                    onFocus={(e) => e.target.style.borderColor = '#10b981'}
                    onBlur={(e) => e.target.style.borderColor = '#374151'}
                  />
                </div>

                {/* Descripción */}
                <div>
                  <label style={{ display: 'block', color: '#d1d5db', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                    📝 Descripción
                  </label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    rows={2}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: '#111827',
                      border: '1px solid #374151',
                      borderRadius: '10px',
                      color: '#f9fafb',
                      fontSize: '14px',
                      outline: 'none',
                      resize: 'vertical',
                      transition: 'all 0.2s'
                    }}
                    placeholder="Características y detalles de la superficie..."
                    onFocus={(e) => e.target.style.borderColor = '#10b981'}
                    onBlur={(e) => e.target.style.borderColor = '#374151'}
                  />
                </div>

                {/* Grid: Color y Orden */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#d1d5db', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                      🎨 Color
                    </label>
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      style={{
                        width: '100%',
                        height: '48px',
                        padding: '4px',
                        background: '#111827',
                        border: '1px solid #374151',
                        borderRadius: '10px',
                        cursor: 'pointer'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#d1d5db', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                      🔢 Orden
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.orden}
                      onChange={(e) => setFormData({ ...formData, orden: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: '#111827',
                        border: '1px solid #374151',
                        borderRadius: '10px',
                        color: '#f9fafb',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'all 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#10b981'}
                      onBlur={(e) => e.target.style.borderColor = '#374151'}
                    />
                  </div>
                </div>

                {/* Velocidad de Juego - COMENTADO: No necesario por ahora */}
                {/* <div>
                  <label style={{ display: 'block', color: '#d1d5db', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                    ⚡ Velocidad de Juego
                  </label>
                  <select
                    value={formData.velocidad}
                    onChange={(e) => setFormData({ ...formData, velocidad: e.target.value as any })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: '#111827',
                      border: '1px solid #374151',
                      borderRadius: '10px',
                      color: '#f9fafb',
                      fontSize: '14px',
                      outline: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#10b981'}
                    onBlur={(e) => e.target.style.borderColor = '#374151'}
                  >
                    <option value="lenta" style={{ background: '#111827' }}>🐌 Lenta</option>
                    <option value="media" style={{ background: '#111827' }}>🏃 Media</option>
                    <option value="rapida" style={{ background: '#111827' }}>⚡ Rápida</option>
                  </select>
                </div> */}

                {/* Checkbox Mantenimiento */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '10px'
                }}>
                  <input
                    type="checkbox"
                    id="requiereMantenimiento"
                    checked={formData.requiereMantenimientoEspecial}
                    onChange={(e) => setFormData({ ...formData, requiereMantenimientoEspecial: e.target.checked })}
                    style={{
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer',
                      accentColor: '#10b981'
                    }}
                  />
                  <label 
                    htmlFor="requiereMantenimiento" 
                    style={{ 
                      color: '#d1d5db', 
                      fontSize: '14px', 
                      fontWeight: '500',
                      cursor: 'pointer',
                      flex: 1
                    }}
                  >
                    🔧 Requiere mantenimiento especial
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'transparent',
                    border: '1px solid #374151',
                    borderRadius: '10px',
                    color: '#d1d5db',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#1f2937'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {selectedTipo ? '✅ Guardar Cambios' : '➕ Crear Tipo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TiposSuperficie;
