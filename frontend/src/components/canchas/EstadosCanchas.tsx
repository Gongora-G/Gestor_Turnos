import React, { useState, useEffect } from 'react';
import { canchasService, type EstadoCancha, type CreateEstadoCanchaDto } from '../../services/canchasService';
import { useToast } from '../../contexts/ToastContext';

const EstadosCanchas: React.FC = () => {
  const { success, error: showError } = useToast();
  const [estados, setEstados] = useState<EstadoCancha[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEstado, setSelectedEstado] = useState<EstadoCancha | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    color: '#10B981',
    icono: '✓',
    permiteReservas: true,
    visibleEnTurnos: true,
    esPredeterminado: false,
    orden: '1',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await canchasService.getEstadosCanchas();
      setEstados(data);
    } catch (error) {
      console.error('Error al cargar estados:', error);
      showError('Error al cargar', 'No se pudieron cargar los estados de cancha');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedEstado(null);
    setFormData({
      nombre: '',
      descripcion: '',
      color: '#10B981',
      icono: '✓',
      permiteReservas: true,
      visibleEnTurnos: true,
      esPredeterminado: false,
      orden: (estados.length + 1).toString(),
    });
    setIsModalOpen(true);
  };

  const handleEdit = (estado: EstadoCancha) => {
    setSelectedEstado(estado);
    setFormData({
      nombre: estado.nombre,
      descripcion: estado.descripcion || '',
      color: estado.color || '#10B981',
      icono: estado.icono || '✓',
      permiteReservas: estado.permiteReservas,
      visibleEnTurnos: estado.visibleEnTurnos,
      esPredeterminado: estado.esPredeterminado,
      orden: estado.orden.toString(),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data: CreateEstadoCanchaDto = {
        nombre: formData.nombre,
        descripcion: formData.descripcion || undefined,
        color: formData.color,
        icono: formData.icono,
        permiteReservas: formData.permiteReservas,
        visibleEnTurnos: formData.visibleEnTurnos,
        esPredeterminado: formData.esPredeterminado,
        orden: Number(formData.orden),
      };

      if (selectedEstado) {
        await canchasService.updateEstadoCancha(selectedEstado.id, data);
        success('Estado actualizado', `El estado "${formData.nombre}" ha sido actualizado`);
      } else {
        await canchasService.createEstadoCancha(data);
        success('Estado creado', `El estado "${formData.nombre}" ha sido creado exitosamente`);
      }

      setIsModalOpen(false);
      await loadData();
    } catch (error) {
      console.error('Error al guardar:', error);
      showError('Error al guardar', 'No se pudo guardar el estado de cancha');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este estado? Las canchas que lo usen quedarán sin estado asignado.')) return;

    try {
      await canchasService.deleteEstadoCancha(id);
      success('Estado eliminado', 'El estado de cancha ha sido eliminado exitosamente');
      await loadData();
    } catch (error: any) {
      console.error('Error al eliminar:', error);
      showError('Error al eliminar', error.response?.data?.message || 'No se puede eliminar este estado');
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      await canchasService.toggleEstadoCanchaActiva(id);
      success('Estado actualizado', 'El estado activo/inactivo ha sido actualizado');
      await loadData();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      showError('Error', 'No se pudo cambiar el estado activo/inactivo');
    }
  };

  const iconos = ['✓', '●', '⚠', '✕', '🔧', '⏸', '🔒', '✦'];

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
          Define los estados disponibles para las canchas (disponible, en mantenimiento, etc.)
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
          Nuevo Estado
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {estados.map((estado) => (
          <div
            key={estado.id}
            style={{
              background: estado.activa ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' : '#1a1a1a',
              borderRadius: '16px',
              padding: '24px',
              border: `2px solid ${estado.activa ? estado.color || '#8b5cf6' : '#374151'}`,
              boxShadow: estado.activa ? `0 8px 24px ${estado.color}20` : '0 4px 12px rgba(0,0,0,0.3)',
              opacity: estado.activa ? 1 : 0.6,
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
                    backgroundColor: estado.color || '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    boxShadow: `0 4px 12px ${estado.color}40`
                  }}
                >
                  <span style={{ color: 'white' }}>{estado.icono || '✓'}</span>
                </div>
                <div>
                  <h3 style={{ color: '#f9fafb', fontSize: '18px', fontWeight: '700', margin: 0 }}>{estado.nombre}</h3>
                  <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0, marginTop: '4px' }}>Orden: {estado.orden}</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                <button
                  onClick={() => handleToggleActive(estado.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '600',
                    borderWidth: '0',
                    borderStyle: 'none',
                    cursor: 'pointer',
                    background: estado.activa ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: estado.activa ? '#10b981' : '#ef4444'
                  }}
                >
                  {estado.activa ? '✓ Activa' : '✕ Inactiva'}
                </button>
                {estado.esPredeterminado && (
                  <span style={{
                    padding: '6px 12px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    color: '#60a5fa',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    ⭐ Predeterminado
                  </span>
                )}
              </div>
            </div>

            {estado.descripcion && (
              <p style={{ color: '#d1d5db', fontSize: '13px', marginBottom: '16px', lineHeight: '1.6' }}>{estado.descripcion}</p>
            )}

            <div style={{ marginBottom: '16px', display: 'grid', gap: '8px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                background: estado.permiteReservas ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                borderRadius: '8px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: estado.permiteReservas ? '#10b981' : '#6b7280'
                }} />
                <span style={{ color: '#d1d5db', fontSize: '13px', fontWeight: '500' }}>
                  {estado.permiteReservas ? '📅 Permite reservas' : '🚫 No permite reservas'}
                </span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                background: estado.visibleEnTurnos ? 'rgba(99, 102, 241, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                borderRadius: '8px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: estado.visibleEnTurnos ? '#6366f1' : '#6b7280'
                }} />
                <span style={{ color: '#d1d5db', fontSize: '13px', fontWeight: '500' }}>
                  {estado.visibleEnTurnos ? '👁️ Visible en turnos' : '🙈 Oculto en turnos'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleEdit(estado)}
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
                onClick={() => handleDelete(estado.id)}
                disabled={estado.esPredeterminado}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: 'transparent',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: estado.esPredeterminado ? '#374151' : '#ef4444',
                  borderRadius: '8px',
                  color: estado.esPredeterminado ? '#6b7280' : '#f87171',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: estado.esPredeterminado ? 'not-allowed' : 'pointer',
                  opacity: estado.esPredeterminado ? 0.5 : 1,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!estado.esPredeterminado) {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!estado.esPredeterminado) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {estados.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', gridColumn: '1 / -1' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚦</div>
          <p style={{ color: '#9ca3af', fontSize: '16px', fontWeight: '500' }}>No hay estados configurados</p>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>Crea el primer estado para tus canchas</p>
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
                background: selectedEstado ? 'rgba(99, 102, 241, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="24" height="24" fill="none" stroke={selectedEstado ? '#6366f1' : '#10b981'} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ color: '#f9fafb', fontSize: '22px', fontWeight: '700', margin: 0 }}>
                  {selectedEstado ? '✏️ Editar Estado' : '➕ Nuevo Estado'}
                </h2>
                <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0, marginTop: '4px' }}>
                  {selectedEstado ? 'Modifica el estado operativo' : 'Define un nuevo estado para las canchas'}
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
                    placeholder="Ej: Disponible, En Mantenimiento"
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
                    placeholder="Características de este estado..."
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

                {/* Selector de Iconos */}
                <div>
                  <label style={{ display: 'block', color: '#d1d5db', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                    😊 Icono
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '8px' }}>
                    {iconos.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData({ ...formData, icono: icon })}
                        style={{
                          padding: '10px',
                          fontSize: '20px',
                          background: formData.icono === icon ? 'rgba(16, 185, 129, 0.2)' : '#111827',
                          border: formData.icono === icon ? '2px solid #10b981' : '1px solid #374151',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                          if (formData.icono !== icon) {
                            e.currentTarget.style.background = 'rgba(55, 65, 81, 0.5)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (formData.icono !== icon) {
                            e.currentTarget.style.background = '#111827';
                          }
                        }}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Checkboxes con estilo mejorado */}
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    background: 'rgba(16, 185, 129, 0.05)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: '10px'
                  }}>
                    <input
                      type="checkbox"
                      id="permiteReservas"
                      checked={formData.permiteReservas}
                      onChange={(e) => setFormData({ ...formData, permiteReservas: e.target.checked })}
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer',
                        accentColor: '#10b981'
                      }}
                    />
                    <label 
                      htmlFor="permiteReservas" 
                      style={{ 
                        color: '#d1d5db', 
                        fontSize: '14px', 
                        fontWeight: '500',
                        cursor: 'pointer',
                        flex: 1
                      }}
                    >
                      📅 Permite reservas
                    </label>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    background: 'rgba(99, 102, 241, 0.05)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: '10px'
                  }}>
                    <input
                      type="checkbox"
                      id="visibleEnTurnos"
                      checked={formData.visibleEnTurnos}
                      onChange={(e) => setFormData({ ...formData, visibleEnTurnos: e.target.checked })}
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer',
                        accentColor: '#6366f1'
                      }}
                    />
                    <label 
                      htmlFor="visibleEnTurnos" 
                      style={{ 
                        color: '#d1d5db', 
                        fontSize: '14px', 
                        fontWeight: '500',
                        cursor: 'pointer',
                        flex: 1
                      }}
                    >
                      👁️ Visible en sistema de turnos
                    </label>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    background: 'rgba(251, 191, 36, 0.05)',
                    border: '1px solid rgba(251, 191, 36, 0.2)',
                    borderRadius: '10px'
                  }}>
                    <input
                      type="checkbox"
                      id="esPredeterminado"
                      checked={formData.esPredeterminado}
                      onChange={(e) => setFormData({ ...formData, esPredeterminado: e.target.checked })}
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer',
                        accentColor: '#fbbf24'
                      }}
                    />
                    <label 
                      htmlFor="esPredeterminado" 
                      style={{ 
                        color: '#d1d5db', 
                        fontSize: '14px', 
                        fontWeight: '500',
                        cursor: 'pointer',
                        flex: 1
                      }}
                    >
                      ⭐ Estado predeterminado
                    </label>
                  </div>
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
                  {selectedEstado ? '✅ Guardar Cambios' : '➕ Crear Estado'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstadosCanchas;
