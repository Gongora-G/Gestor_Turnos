import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  GlobalNavigation, 
  CrearTurnoModal, 
  TurnoCard, 
  VerTurnoModal, 
  EditarTurnoModal, 
  EliminarTurnoModal 
} from '../components';
import { Plus, Filter, Search, Save, Calendar } from 'lucide-react';
import { turnosService, canchasService } from '../services';
import { jornadasService } from '../services/jornadasService';
import { calcularEstadoAutomatico } from '../utils/turnoStates';
import { useToast } from '../contexts/ToastContext';

// Tipos locales para evitar problemas de importación
interface Turno {
  id: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  cancha_id: string;
  cancha?: {
    id: string;
    nombre: string;
    ubicacion?: string;
  };
  usuario_id: string;
  usuario?: {
    id: string;
    nombre: string;
    email: string;
  };
  socio_id?: string;
  socio?: {
    id: string;
    nombre: string;
    tipo_membresia: string;
  };
  estado: 'en_progreso' | 'completado';
  observaciones?: string;
  created_at: string;
  updated_at: string;
}

interface CanchaBackend {
  id: string;
  nombre: string;
  ubicacion?: string;
  tipo?: string;
  precio_por_hora: number;
  disponible: boolean;
  created_at: string;
  updated_at: string;
}

export const TurnosPage: React.FC = () => {
  const { addToast } = useToast();
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [canchas, setCanchas] = useState<CanchaBackend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [guardandoJornada, setGuardandoJornada] = useState(false);
  
  // Estados de modales
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [verTurnoModal, setVerTurnoModal] = useState<{ abierto: boolean; turno: Turno | null }>({
    abierto: false,
    turno: null
  });
  const [editarTurnoModal, setEditarTurnoModal] = useState<{ abierto: boolean; turno: Turno | null }>({
    abierto: false,
    turno: null
  });
  const [eliminarTurnoModal, setEliminarTurnoModal] = useState<{ abierto: boolean; turno: Turno | null }>({
    abierto: false,
    turno: null
  });

  // Cargar turnos y canchas del backend
  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Cargando datos...');
      const [turnosResponse, canchasResponse] = await Promise.all([
        turnosService.obtenerTurnos(),
        canchasService.obtenerCanchas()
      ]);
      
      console.log('✅ Turnos cargados:', turnosResponse);
      console.log('✅ Canchas cargadas:', canchasResponse);
      
      setTurnos(turnosResponse);
      setCanchas(canchasResponse);
      
    } catch (error: any) {
      console.error('❌ Error al cargar datos:', error);
      
      if (error.statusCode === 401) {
        console.log('🔒 Error de autenticación, redirigiendo...');
        return;
      }
      
      setError(`Error al conectar con el servidor: ${error.message || 'Error desconocido'}`);
      setTurnos([]);
      setCanchas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Handlers para modales
  const handleVerTurno = (turno: Turno) => {
    setVerTurnoModal({ abierto: true, turno });
  };

  const handleEditarTurno = (turno: Turno) => {
    setEditarTurnoModal({ abierto: true, turno });
  };

  const handleEliminarTurno = (turno: Turno) => {
    setEliminarTurnoModal({ abierto: true, turno });
  };

  // Función para crear turno
  const handleCrearTurno = async (turnoData: Partial<TurnoBackend>) => {
    try {
      await turnosService.crearTurno(turnoData);
      await cargarDatos(); // Recargar datos
    } catch (error) {
      console.error('Error al crear turno:', error);
      throw error;
    }
  };

  // Función para actualizar turno
  const handleActualizarTurno = async (turnoData: Partial<TurnoBackend>) => {
    try {
      if (!editarTurnoModal.turno?.id) throw new Error('ID de turno no encontrado');
      await turnosService.actualizarTurno(editarTurnoModal.turno.id, turnoData);
      await cargarDatos(); // Recargar datos
    } catch (error) {
      console.error('Error al actualizar turno:', error);
      throw error;
    }
  };

  // Función para eliminar turno
  const handleConfirmarEliminar = async (turnoId: string) => {
    try {
      await turnosService.eliminarTurno(turnoId);
      await cargarDatos(); // Recargar datos
    } catch (error) {
      console.error('Error al eliminar turno:', error);
      throw error;
    }
  };

  // Función para guardar jornada actual
  const handleGuardarJornada = async () => {
    if (turnos.length === 0) {
      addToast('No hay turnos para guardar en la jornada', 'warning');
      return;
    }

    setGuardandoJornada(true);
    try {
      console.log('💾 Guardando jornada con turnos:', turnos);
      
      // Usar el servicio para crear jornada desde turnos actuales
      const response = await jornadasService.crearDesdeActuales(turnos);
      
      if (response.success) {
        addToast(
          `Jornada guardada correctamente con ${turnos.length} turnos`,
          'success'
        );
        
        // Limpiar turnos actuales después de guardar
        setTurnos([]);
        
        // Opcional: Recargar datos desde el servidor
        await cargarDatos();
      } else {
        addToast(
          response.error || 'Error al guardar la jornada',
          'error'
        );
      }
    } catch (error: any) {
      console.error('❌ Error guardando jornada:', error);
      addToast(
        'Error al guardar la jornada: ' + (error.message || 'Error desconocido'),
        'error'
      );
    } finally {
      setGuardandoJornada(false);
    }
  };

  // Filtrar turnos
  const turnosFiltrados = turnos.filter(turno => {
    const coincideBusqueda = turno.id?.toLowerCase().includes(busqueda.toLowerCase()) ||
                           turno.observaciones?.toLowerCase().includes(busqueda.toLowerCase()) ||
                           turno.cancha?.nombre?.toLowerCase().includes(busqueda.toLowerCase());
    
    // Calcular el estado actual del turno para el filtrado
    const estadoActual = calcularEstadoAutomatico(turno.fecha, turno.hora_inicio, turno.hora_fin, 'activo');
    const coincideEstado = filtroEstado === 'todos' || estadoActual === filtroEstado;
    
    return coincideBusqueda && coincideEstado;
  });

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0f0f23',
        color: '#ffffff',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        <GlobalNavigation />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '400px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '3px solid rgba(59, 130, 246, 0.3)',
              borderTop: '3px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p style={{
              fontSize: '16px',
              color: '#9ca3af',
              margin: 0
            }}>
              Cargando turnos...
            </p>
          </div>
        </div>
        <style>
          {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
        </style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0f0f23',
        color: '#ffffff',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        <GlobalNavigation />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '400px'
        }}>
          <div style={{
            textAlign: 'center',
            maxWidth: '400px',
            padding: '24px'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'rgba(239, 68, 68, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#f9fafb',
              marginBottom: '8px',
              margin: '0 0 8px 0'
            }}>
              Error al cargar los turnos
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#9ca3af',
              marginBottom: '24px',
              margin: '0 0 24px 0'
            }}>
              {error}
            </p>
            <button 
              onClick={cargarDatos}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f0f23',
      color: '#ffffff',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <GlobalNavigation />
      
      {/* Header con controles */}
      <div style={{
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        borderBottom: '1px solid #374151',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '24px',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            
            {/* Título */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <h1 style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  marginBottom: '8px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  margin: 0
                }}>
                  Gestión de Turnos
                </h1>
                <p style={{
                  fontSize: '16px',
                  color: '#9ca3af',
                  margin: 0
                }}>
                  {turnos.length} {turnos.length === 1 ? 'turno registrado' : 'turnos registrados'}
                  {turnosFiltrados.length !== turnos.length && 
                    ` (${turnosFiltrados.length} ${turnosFiltrados.length === 1 ? 'mostrado' : 'mostrados'})`
                  }
                </p>
              </div>

              {/* Botón Crear Turno */}
              <button
                onClick={() => setModalCrearAbierto(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                }}
              >
                <Plus size={20} />
                Crear Turno
              </button>
            </div>

            {/* Controles de filtro y búsqueda */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap'
              }}>
                {/* Búsqueda */}
                <div style={{
                  position: 'relative',
                  flex: '1',
                  minWidth: '300px'
                }}>
                  <Search 
                    size={20}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#9ca3af'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Buscar por ID, observaciones o cancha..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    style={{
                      width: '100%',
                      paddingLeft: '44px',
                      paddingRight: '16px',
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      background: 'rgba(55, 65, 81, 0.5)',
                      border: '1px solid #374151',
                      borderRadius: '12px',
                      color: '#f9fafb',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#374151';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Filtro de estado */}
                <div style={{
                  position: 'relative',
                  minWidth: '200px'
                }}>
                  <Filter 
                    size={20}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#9ca3af',
                      pointerEvents: 'none'
                    }}
                  />
                  <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    style={{
                      paddingLeft: '44px',
                      paddingRight: '32px',
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      background: 'rgba(55, 65, 81, 0.5)',
                      border: '1px solid #374151',
                      borderRadius: '12px',
                      color: '#f9fafb',
                      fontSize: '14px',
                      outline: 'none',
                      cursor: 'pointer',
                      minWidth: '200px'
                    }}
                  >
                    <option value="todos">Todos los estados</option>
                    <option value="en_progreso">En Progreso</option>
                    <option value="completado">Completados</option>
                  </select>
                </div>
              </div>

              {/* Indicador de filtros activos */}
              {(busqueda || filtroEstado !== 'todos') && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '14px',
                  color: '#9ca3af'
                }}>
                  <span>Filtros activos:</span>
                  {busqueda && (
                    <span style={{
                      background: 'rgba(59, 130, 246, 0.2)',
                      color: '#60a5fa',
                      padding: '4px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      Búsqueda: "{busqueda}"
                    </span>
                  )}
                  {filtroEstado !== 'todos' && (
                    <span style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#34d399',
                      padding: '4px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      Estado: {filtroEstado}
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setBusqueda('');
                      setFiltroEstado('todos');
                    }}
                    style={{
                      color: '#60a5fa',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      textDecoration: 'underline',
                      marginLeft: '8px'
                    }}
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de turnos */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '32px 24px'
      }}>
        {turnosFiltrados.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '48px 24px'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'rgba(55, 65, 81, 0.5)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h3z" />
              </svg>
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#f9fafb',
              marginBottom: '8px',
              margin: 0
            }}>
              {turnos.length === 0 ? 'No hay turnos registrados' : 'No se encontraron turnos'}
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#9ca3af',
              marginBottom: '24px',
              margin: '8px 0 24px 0'
            }}>
              {turnos.length === 0 
                ? 'Comienza creando tu primer turno' 
                : 'Prueba ajustando los filtros de búsqueda'
              }
            </p>
            {turnos.length === 0 && (
              <button
                onClick={() => setModalCrearAbierto(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Plus size={20} />
                Crear Primer Turno
              </button>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
            gap: '24px'
          }}>
            {turnosFiltrados.map((turno) => (
              <TurnoCard
                key={turno.id}
                turno={turno}
                onVer={() => handleVerTurno(turno)}
                onEditar={() => handleEditarTurno(turno)}
                onEliminar={() => handleEliminarTurno(turno)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modales */}
      <CrearTurnoModal
        isOpen={modalCrearAbierto}
        onClose={() => setModalCrearAbierto(false)}
        onTurnoCreated={cargarDatos}
      />

      <VerTurnoModal
        isOpen={verTurnoModal.abierto}
        onClose={() => setVerTurnoModal({ abierto: false, turno: null })}
        turno={verTurnoModal.turno}
      />

      <EditarTurnoModal
        isOpen={editarTurnoModal.abierto}
        onClose={() => setEditarTurnoModal({ abierto: false, turno: null })}
        onSave={handleActualizarTurno}
        turno={editarTurnoModal.turno}
        canchas={canchas}
      />

      <EliminarTurnoModal
        isOpen={eliminarTurnoModal.abierto}
        onClose={() => setEliminarTurnoModal({ abierto: false, turno: null })}
        onConfirm={handleConfirmarEliminar}
        turno={eliminarTurnoModal.turno}
      />

      {/* Botón flotante para guardar jornada */}
      {turnos.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1000
        }}>
          <button
            onClick={handleGuardarJornada}
            disabled={guardandoJornada}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 24px',
              background: guardandoJornada 
                ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: guardandoJornada ? 'not-allowed' : 'pointer',
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.3s ease',
              opacity: guardandoJornada ? 0.7 : 1,
              transform: guardandoJornada ? 'scale(0.95)' : 'scale(1)'
            }}
            onMouseEnter={(e) => {
              if (!guardandoJornada) {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(16, 185, 129, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = guardandoJornada ? 'scale(0.95)' : 'scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.3)';
            }}
          >
            {guardandoJornada ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Guardando...
              </>
            ) : (
              <>
                <Save size={20} />
                Guardar Jornada ({turnos.length})
              </>
            )}
          </button>
          
          {/* Tooltip */}
          <div style={{
            position: 'absolute',
            bottom: '100%',
            right: '0',
            marginBottom: '8px',
            padding: '8px 12px',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            borderRadius: '8px',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            opacity: 0,
            pointerEvents: 'none',
            transition: 'opacity 0.2s ease'
          }}>
            Guarda todos los turnos actuales como una jornada histórica
          </div>
        </div>
      )}

      {/* Estilos para la animación de spin */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};