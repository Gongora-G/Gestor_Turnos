import React, { useState, useEffect } from 'react';
import { canchasService, type CanchaBackend, type TipoSuperficieCancha, type EstadoCancha } from '../../services/canchasService';
import CanchaModal from './CanchaModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { useToast } from '../../contexts/ToastContext';

// Agregar animación de spinner
const spinnerStyle = document.createElement('style');
spinnerStyle.innerHTML = '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
if (!document.head.querySelector('[data-spinner-style]')) {
  spinnerStyle.setAttribute('data-spinner-style', 'true');
  document.head.appendChild(spinnerStyle);
}

const GestionCanchas: React.FC = () => {
  const { success, error: showError } = useToast();
  const [canchas, setCanchas] = useState<CanchaBackend[]>([]);
  const [tiposSuperficie, setTiposSuperficie] = useState<TipoSuperficieCancha[]>([]);
  const [estados, setEstados] = useState<EstadoCancha[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCancha, setSelectedCancha] = useState<CanchaBackend | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<number | ''>('');
  const [filterSuperficie, setFilterSuperficie] = useState<number | ''>('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [canchaToDelete, setCanchaToDelete] = useState<{ id: string; nombre: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [canchasData, superficiesData, estadosData] = await Promise.all([
        canchasService.obtenerCanchas(),
        canchasService.getTiposSuperficie(),
        canchasService.getEstadosCanchas(),
      ]);
      setCanchas(canchasData);
      setTiposSuperficie(superficiesData);
      setEstados(estadosData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      showError('Error al cargar', 'No se pudieron cargar las canchas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedCancha(null);
    setIsModalOpen(true);
  };

  const handleEdit = (cancha: CanchaBackend) => {
    setSelectedCancha(cancha);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, nombre: string) => {
    setCanchaToDelete({ id, nombre });
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!canchaToDelete) return;

    try {
      setIsDeleting(true);
      await canchasService.eliminarCancha(canchaToDelete.id);
      success('Cancha eliminada', `La cancha "${canchaToDelete.nombre}" ha sido eliminada exitosamente`);
      await loadData();
      setDeleteModalOpen(false);
      setCanchaToDelete(null);
    } catch (error) {
      console.error('Error al eliminar:', error);
      showError('Error al eliminar', 'No se pudo eliminar la cancha');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setCanchaToDelete(null);
  };

  const handleToggleActive = async (id: string) => {
    try {
      await canchasService.toggleCanchaActiva(id);
      success('Estado actualizado', 'El estado de la cancha ha sido actualizado');
      await loadData();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      showError('Error', 'No se pudo cambiar el estado de la cancha');
    }
  };

  const filteredCanchas = canchas.filter(cancha => {
    const matchesSearch = cancha.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cancha.ubicacion?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = filterEstado === '' || cancha.estadoId === filterEstado;
    const matchesSuperficie = filterSuperficie === '' || cancha.superficieId === filterSuperficie;
    
    return matchesSearch && matchesEstado && matchesSuperficie;
  });

  const getSuperficieNombre = (id?: number) => {
    if (!id) return '-';
    return tiposSuperficie.find(s => s.id === id)?.nombre || '-';
  };

  const getEstadoInfo = (id?: number) => {
    if (!id) return { nombre: '-', color: '#gray' };
    const estado = estados.find(e => e.id === id);
    return {
      nombre: estado?.nombre || '-',
      color: estado?.color || '#6B7280'
    };
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px' 
      }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          border: '3px solid #374151',
          borderTop: '3px solid #10b981',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <div style={{ padding: 0 }}>
      {/* Header & Actions */}
      <div style={{ 
        marginBottom: '24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: '1', maxWidth: '500px', minWidth: '280px' }}>
          <input
            type="text"
            placeholder="🔍 Buscar por nombre o ubicación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '10px',
              color: '#f9fafb',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#10b981';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#374151';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>
        
        <button
          onClick={handleCreate}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.2)';
          }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Cancha
        </button>
      </div>

      {/* Filters */}
      <div style={{ 
        marginBottom: '24px', 
        display: 'flex', 
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value ? Number(e.target.value) : '')}
          style={{
            padding: '10px 16px',
            background: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '10px',
            color: '#f9fafb',
            fontSize: '14px',
            cursor: 'pointer',
            outline: 'none',
            minWidth: '200px'
          }}
        >
          <option value="" style={{ background: '#1f2937' }}>📊 Todos los estados</option>
          {estados.filter(e => e.activa).map(estado => (
            <option key={estado.id} value={estado.id} style={{ background: '#1f2937' }}>
              {estado.nombre}
            </option>
          ))}
        </select>

        <select
          value={filterSuperficie}
          onChange={(e) => setFilterSuperficie(e.target.value ? Number(e.target.value) : '')}
          style={{
            padding: '10px 16px',
            background: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '10px',
            color: '#f9fafb',
            fontSize: '14px',
            cursor: 'pointer',
            outline: 'none',
            minWidth: '200px'
          }}
        >
          <option value="" style={{ background: '#1f2937' }}>🎨 Todas las superficies</option>
          {tiposSuperficie.filter(s => s.activa).map(superficie => (
            <option key={superficie.id} value={superficie.id} style={{ background: '#1f2937' }}>
              {superficie.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div style={{ 
        overflowX: 'auto',
        background: '#1f2937',
        borderRadius: '12px',
        border: '1px solid #374151'
      }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse'
        }}>
          <thead style={{ background: '#111827' }}>
            <tr>
              <th style={{ 
                padding: '16px', 
                textAlign: 'left', 
                fontSize: '11px', 
                fontWeight: '600', 
                color: '#9ca3af', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                borderBottom: '1px solid #374151'
              }}>
                Cancha
              </th>
              <th style={{ 
                padding: '16px', 
                textAlign: 'left', 
                fontSize: '11px', 
                fontWeight: '600', 
                color: '#9ca3af', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                borderBottom: '1px solid #374151'
              }}>
                Ubicación
              </th>
              <th style={{ 
                padding: '16px', 
                textAlign: 'left', 
                fontSize: '11px', 
                fontWeight: '600', 
                color: '#9ca3af', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                borderBottom: '1px solid #374151'
              }}>
                Superficie
              </th>
              <th style={{ 
                padding: '16px', 
                textAlign: 'left', 
                fontSize: '11px', 
                fontWeight: '600', 
                color: '#9ca3af', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                borderBottom: '1px solid #374151'
              }}>
                Estado Operativo
              </th>
              <th style={{ 
                padding: '16px', 
                textAlign: 'left', 
                fontSize: '11px', 
                fontWeight: '600', 
                color: '#9ca3af', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                borderBottom: '1px solid #374151'
              }}>
                Capacidad
              </th>
              <th style={{ 
                padding: '16px', 
                textAlign: 'left', 
                fontSize: '11px', 
                fontWeight: '600', 
                color: '#9ca3af', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                borderBottom: '1px solid #374151'
              }}>
                Precio/Hora
              </th>
              <th style={{ 
                padding: '16px', 
                textAlign: 'center', 
                fontSize: '11px', 
                fontWeight: '600', 
                color: '#9ca3af', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                borderBottom: '1px solid #374151'
              }}>
                Activo
              </th>
              <th style={{ 
                padding: '16px', 
                textAlign: 'right', 
                fontSize: '11px', 
                fontWeight: '600', 
                color: '#9ca3af', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                borderBottom: '1px solid #374151'
              }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCanchas.map((cancha, index) => {
              const estadoInfo = getEstadoInfo(cancha.estadoId);
              return (
                <tr 
                  key={cancha.id}
                  style={{
                    borderBottom: index < filteredCanchas.length - 1 ? '1px solid #374151' : 'none',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#111827'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '16px', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div>
                        <div style={{ 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: '#f9fafb',
                          marginBottom: '4px'
                        }}>
                          {cancha.nombre}
                          {cancha.numero && (
                            <span style={{ marginLeft: '8px', color: '#6b7280', fontWeight: '400' }}>
                              #{cancha.numero}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '13px', color: '#9ca3af' }}>
                          {cancha.tipo || 'Sin tipo'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', whiteSpace: 'nowrap', fontSize: '14px', color: '#d1d5db' }}>
                    {cancha.ubicacion || '-'}
                  </td>
                  <td style={{ padding: '16px', whiteSpace: 'nowrap', fontSize: '14px', color: '#d1d5db' }}>
                    {getSuperficieNombre(cancha.superficieId)}
                  </td>
                  <td style={{ padding: '16px', whiteSpace: 'nowrap' }}>
                    <span
                      style={{
                        padding: '6px 12px',
                        display: 'inline-flex',
                        fontSize: '12px',
                        fontWeight: '600',
                        borderRadius: '20px',
                        backgroundColor: `${estadoInfo.color}20`,
                        color: estadoInfo.color
                      }}
                    >
                      {estadoInfo.nombre}
                    </span>
                  </td>
                  <td style={{ padding: '16px', whiteSpace: 'nowrap', fontSize: '14px', color: '#d1d5db' }}>
                    👥 {cancha.capacidad} personas
                  </td>
                  <td style={{ padding: '16px', whiteSpace: 'nowrap', fontSize: '14px', color: '#d1d5db', fontWeight: '600' }}>
                    {cancha.precioHora ? `$${Number(cancha.precioHora).toLocaleString()}` : '-'}
                  </td>
                  <td style={{ padding: '16px', whiteSpace: 'nowrap', textAlign: 'center' }}>
                    <button
                      onClick={() => handleToggleActive(cancha.id)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: cancha.activa ? '#10b98120' : '#ef444420',
                        color: cancha.activa ? '#10b981' : '#ef4444',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = cancha.activa ? '#10b98130' : '#ef444430';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = cancha.activa ? '#10b98120' : '#ef444420';
                      }}
                    >
                      {cancha.activa ? '✓ Activa' : '✗ Inactiva'}
                    </button>
                  </td>
                  <td style={{ padding: '16px', whiteSpace: 'nowrap', textAlign: 'right' }}>
                    <button
                      onClick={() => handleEdit(cancha)}
                      style={{
                        marginRight: '12px',
                        color: '#3b82f6',
                        fontSize: '14px',
                        fontWeight: '500',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#60a5fa'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#3b82f6'}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDelete(cancha.id, cancha.nombre)}
                      style={{
                        color: '#ef4444',
                        fontSize: '14px',
                        fontWeight: '500',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#f87171'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#ef4444'}
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredCanchas.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            background: '#1f2937'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏟️</div>
            <p style={{ color: '#9ca3af', fontSize: '16px', fontWeight: '500' }}>
              No se encontraron canchas
            </p>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>
              Prueba ajustando los filtros o crea una nueva cancha
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <CanchaModal
          cancha={selectedCancha}
          tiposSuperficie={tiposSuperficie.filter(s => s.activa)}
          estados={estados.filter(e => e.activa)}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            loadData();
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && canchaToDelete && (
        <DeleteConfirmModal
          title="¿Eliminar Cancha?"
          message="Esta acción eliminará permanentemente la cancha del sistema."
          itemName={canchaToDelete.nombre}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          loading={isDeleting}
        />
      )}
    </div>
  );
};

export default GestionCanchas;
