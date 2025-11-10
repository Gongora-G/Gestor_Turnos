import React from 'react';
import { Eye, Edit2, Trash2, MapPin, Clock, Calendar, User, UserCheck, UserX } from 'lucide-react';
import { formatTo12Hour } from '../utils/dateTime';
import { formatTime12h } from '../utils/timeFormat';
import { calcularEstadoAutomatico, getEstadoTexto } from '../utils/turnoStates';

// Tipos locales para evitar problemas de importación
interface Turno {
  id: string;
  nombre?: string;
  numero_turno_dia?: number;
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
    tipo_membresia_color?: string;
    documento?: string;
  };
  // 🆕 Información de Jornada Asignada
  jornada_config_id?: number;
  jornada_config?: {
    id: number;
    codigo: string;
    nombre: string;
    hora_inicio: string;
    hora_fin: string;
    color: string;
  };
  estado: 'en_progreso' | 'completado';
  observaciones?: string;
  created_at: string;
  updated_at: string;
}

interface TurnoCardProps {
  turno: Turno;
  onVer: (turno: Turno) => void;
  onEditar: (turno: Turno) => void;
  onEliminar: (turno: Turno) => void;
}

export const TurnoCard: React.FC<TurnoCardProps> = ({
  turno,
  onVer,
  onEditar,
  onEliminar
}) => {
  // 🔧 USAR EL ESTADO REAL DEL TURNO (no calcular automáticamente)
  const estadoCalculado = turno.estado || calcularEstadoAutomatico(turno.fecha, turno.hora_inicio, turno.hora_fin);
  console.log(`🔍 TurnoCard ${turno.nombre}: estado prop=${turno.estado}, estadoFinal=${estadoCalculado}`);

  // Generar nombre de turno desde el backend o fallback
  const getTurnoDisplayName = (turno: Turno) => {
    if (turno.nombre) {
      return turno.nombre;
    }
    // Fallback si no tiene nombre
    const numeroTurno = turno.numero_turno_dia ? 
      turno.numero_turno_dia.toString().padStart(3, '0') : 
      turno.id.slice(-3).toUpperCase();
    return `Turno - ${numeroTurno}`;
  };

  // Generar nombre de cancha
  const getCanchaDisplayName = (turno: Turno) => {
    if (turno.cancha?.nombre) {
      return turno.cancha.nombre;
    }
    return `Cancha ${turno.cancha_id?.slice(0, 8) || 'Desconocida'}`;
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #374151',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      fontFamily: 'Inter, system-ui, sans-serif',
      width: '400px',
      minWidth: '400px',
      maxWidth: '400px'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
      e.currentTarget.style.borderColor = '#3b82f6';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
      e.currentTarget.style.borderColor = '#374151';
    }}
    >
      {/* Header con estado y acciones */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: estadoCalculado === 'completado' ? '#10b981' : '#3b82f6'
          }}></div>
          <div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#f9fafb',
              marginBottom: '6px',
              margin: 0
            }}>
              {getTurnoDisplayName(turno)}
            </h3>
            <span style={{
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: '600',
              color: 'white',
              background: estadoCalculado === 'completado' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
                         'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
            }}>
              {getEstadoTexto(estadoCalculado)}
            </span>
          </div>
        </div>
        
        {/* Botones de acción */}
        <div style={{ display: 'flex', gap: '4px' }}>

          <button
            onClick={() => onVer(turno)}
            style={{
              padding: '10px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '8px',
              color: '#60a5fa',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title="Ver detalles"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onEditar(turno)}
            style={{
              padding: '10px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '8px',
              color: '#34d399',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title="Editar turno"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onEliminar(turno)}
            style={{
              padding: '10px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '8px',
              color: '#f87171',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title="Eliminar turno"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Información principal del turno */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
        {/* Fecha y hora */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px',
          background: 'rgba(55, 65, 81, 0.3)',
          borderRadius: '12px',
          border: '1px solid #374151'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            borderRadius: '12px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Calendar size={20} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#f9fafb',
              marginBottom: '4px',
              margin: 0
            }}>
              {(() => {
                // Crear fecha en zona horaria local para evitar problemas de UTC
                const [year, month, day] = turno.fecha.split('-');
                const fechaLocal = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                return fechaLocal.toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });
              })()}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="#60a5fa" />
              <span style={{
                fontSize: '13px',
                fontWeight: '500',
                color: '#60a5fa'
              }}>
                {formatTo12Hour(turno.hora_inicio)} - {formatTo12Hour(turno.hora_fin)}
              </span>
            </div>
          </div>
        </div>

        {/* Cancha */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px',
          background: 'rgba(55, 65, 81, 0.3)',
          borderRadius: '12px',
          border: '1px solid #374151'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '12px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MapPin size={20} color="white" />
          </div>
          <div>
            <p style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#f9fafb',
              marginBottom: '4px',
              margin: 0
            }}>
              {getCanchaDisplayName(turno)}
            </p>
            {turno.cancha?.ubicacion && (
              <p style={{
                fontSize: '12px',
                color: '#34d399',
                fontWeight: '500',
                margin: 0
              }}>
                {turno.cancha.ubicacion}
              </p>
            )}
          </div>
        </div>

        {/* Usuario/Socio */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px',
          background: 'rgba(55, 65, 81, 0.3)',
          borderRadius: '12px',
          border: '1px solid #374151'
        }}>
          <div style={{
            background: turno.socio 
              ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' // Verde para socios
              : turno.usuario 
                ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' // Azul para usuarios
                : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)', // Gris para sin asignar
            borderRadius: '12px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {turno.socio ? (
              <UserCheck size={20} color="white" />
            ) : turno.usuario ? (
              <User size={20} color="white" />
            ) : (
              <UserX size={20} color="white" />
            )}
          </div>
          <div>
            {turno.socio ? (
              <>
                <p style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#f9fafb',
                  marginBottom: '2px',
                  margin: 0
                }}>
                  {turno.socio.nombre}
                </p>
                {turno.socio.tipo_membresia && (
                  <p style={{
                    fontSize: '11px',
                    color: turno.socio.tipo_membresia_color || '#a78bfa',
                    fontWeight: '500',
                    margin: 0,
                    marginBottom: '2px',
                    backgroundColor: turno.socio.tipo_membresia_color ? `${turno.socio.tipo_membresia_color}20` : 'transparent',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    display: 'inline-block'
                  }}>
                    {turno.socio.tipo_membresia}
                  </p>
                )}
                <p style={{
                  fontSize: '10px',
                  color: '#9ca3af',
                  fontWeight: '400',
                  margin: 0
                }}>
                  {turno.socio.documento ? `Doc: ${turno.socio.documento}` : 'Socio del club'}
                </p>
              </>
            ) : turno.usuario ? (
              <>
                <p style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#f9fafb',
                  marginBottom: '2px',
                  margin: 0
                }}>
                  {turno.usuario.nombre}
                </p>
                <p style={{
                  fontSize: '10px',
                  color: '#9ca3af',
                  fontWeight: '400',
                  margin: 0
                }}>
                  Usuario registrado
                </p>
              </>
            ) : (
              <>
                <p style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#9ca3af',
                  marginBottom: '2px',
                  margin: 0
                }}>
                  Sin asignar
                </p>
                <p style={{
                  fontSize: '10px',
                  color: '#6b7280',
                  fontWeight: '400',
                  margin: 0
                }}>
                  Turno disponible
                </p>
              </>
            )}
          </div>
        </div>

        {/* 🆕 Información de Jornada Asignada */}
        {turno.jornada_config && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px',
            background: 'rgba(55, 65, 81, 0.3)',
            borderRadius: '12px',
            border: '1px solid #374151'
          }}>
            <div style={{
              background: turno.jornada_config.color || 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6"/>
                <path d="m21 12-6 0m-6 0-6 0"/>
              </svg>
            </div>
            <div>
              <p style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#f9fafb',
                marginBottom: '4px',
                margin: 0
              }}>
                {turno.jornada_config.nombre}
              </p>
              <p style={{
                fontSize: '12px',
                color: '#a78bfa',
                fontWeight: '500',
                margin: 0
              }}>
                {formatTime12h(turno.jornada_config.hora_inicio)} - {formatTime12h(turno.jornada_config.hora_fin)}
              </p>
            </div>
          </div>
        )}

        {/* Indicador cuando no hay jornada asignada */}
        {!turno.jornada_config && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px',
            background: 'rgba(55, 65, 81, 0.3)',
            borderRadius: '12px',
            border: '1px solid #374151'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 12h8"/>
              </svg>
            </div>
            <div>
              <p style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#9ca3af',
                marginBottom: '4px',
                margin: 0
              }}>
                Sin jornada asignada
              </p>
              <p style={{
                fontSize: '12px',
                color: '#6b7280',
                fontWeight: '500',
                margin: 0
              }}>
                Fuera del horario configurado
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer con observaciones */}
      {turno.observaciones && (
        <div style={{
          paddingTop: '16px',
          borderTop: '1px solid #374151'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#9ca3af',
            fontStyle: 'italic',
            background: 'rgba(55, 65, 81, 0.3)',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #374151',
            lineHeight: '1.4'
          }}
          title={turno.observaciones}
          >
            💬 "{turno.observaciones}"
          </div>
        </div>
      )}
    </div>
  );
};