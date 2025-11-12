import React from 'react';
import { Eye, Edit2, Trash2, MapPin, Clock, Calendar, User, UserCheck, UserX } from 'lucide-react';
import { formatTo12Hour } from '../utils/dateTime';
import { formatTime12h } from '../utils/timeFormat';
import { calcularEstadoAutomatico, getEstadoTexto } from '../utils/turnoStates';

// Tipos locales para evitar problemas de importación
interface PersonalInfo {
  id: string;
  nombre: string;
  apellido: string;
  tipoPersonal: {
    nombre: string;
    color?: string;
  };
}

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
  personal_asignado?: string[];
  estado: 'en_progreso' | 'completado';
  observaciones?: string;
  created_at: string;
  updated_at: string;
}

interface TurnoCardProps {
  turno: Turno;
  personalData?: PersonalInfo[];
  onVer: (turno: Turno) => void;
  onEditar: (turno: Turno) => void;
  onEliminar: (turno: Turno) => void;
}

export const TurnoCard: React.FC<TurnoCardProps> = ({
  turno,
  personalData = [],
  onVer,
  onEditar,
  onEliminar
}) => {
  // 🔧 USAR EL ESTADO REAL DEL TURNO (no calcular automáticamente)
  const estadoCalculado = turno.estado || calcularEstadoAutomatico(turno.fecha, turno.hora_inicio, turno.hora_fin);
  console.log(`🔍 TurnoCard ${turno.nombre}: estado prop=${turno.estado}, estadoFinal=${estadoCalculado}`);
  
  // Obtener personal asignado con sus datos completos
  const personalAsignado = turno.personal_asignado
    ?.map(id => personalData.find(p => p.id === id))
    .filter((p): p is PersonalInfo => p !== undefined) || [];

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
      padding: '20px',
      border: '1px solid #374151',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      fontFamily: 'Inter, system-ui, sans-serif',
      width: '400px',
      minWidth: '350px',
      maxWidth: '450px',
      flexShrink: 0
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

      {/* Grid compacto de 2 columnas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        
        {/* Fecha y Hora - Ocupa 2 columnas */}
        <div style={{
          gridColumn: '1 / -1',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 14px',
          background: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '10px',
          border: '1px solid rgba(59, 130, 246, 0.2)'
        }}>
          <Calendar size={18} color="#60a5fa" />
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#f9fafb',
              margin: 0,
              marginBottom: '2px'
            }}>
              {(() => {
                const [year, month, day] = turno.fecha.split('-');
                const fechaLocal = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                return fechaLocal.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
              })()}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={12} color="#60a5fa" />
              <span style={{ fontSize: '11px', fontWeight: '500', color: '#60a5fa' }}>
                {formatTo12Hour(turno.hora_inicio)} - {formatTo12Hour(turno.hora_fin)}
              </span>
            </div>
          </div>
        </div>

        {/* Cancha */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px',
          background: 'rgba(16, 185, 129, 0.1)',
          borderRadius: '10px',
          border: '1px solid rgba(16, 185, 129, 0.2)'
        }}>
          <MapPin size={16} color="#34d399" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#f9fafb',
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {getCanchaDisplayName(turno)}
            </p>
            {turno.cancha?.ubicacion && (
              <p style={{ fontSize: '10px', color: '#34d399', margin: 0 }}>
                {turno.cancha.ubicacion}
              </p>
            )}
          </div>
        </div>

        {/* Usuario/Socio */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px',
          background: turno.socio 
            ? 'rgba(5, 150, 105, 0.1)' 
            : turno.usuario 
              ? 'rgba(37, 99, 235, 0.1)' 
              : 'rgba(107, 114, 128, 0.1)',
          borderRadius: '10px',
          border: turno.socio 
            ? '1px solid rgba(5, 150, 105, 0.2)' 
            : turno.usuario 
              ? '1px solid rgba(37, 99, 235, 0.2)' 
              : '1px solid rgba(107, 114, 128, 0.2)'
        }}>
          {turno.socio ? (
            <UserCheck size={14} color={turno.socio ? '#34d399' : '#60a5fa'} />
          ) : turno.usuario ? (
            <User size={14} color="#60a5fa" />
          ) : (
            <UserX size={14} color="#9ca3af" />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#f9fafb',
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {turno.socio?.nombre || turno.usuario?.nombre || 'Sin asignar'}
            </p>
            <p style={{ fontSize: '10px', color: '#9ca3af', margin: 0 }}>
              {turno.socio ? 'Socio' : turno.usuario ? 'Usuario' : 'Disponible'}
            </p>
          </div>
        </div>

        {/* Jornada - Solo si existe */}
        {turno.jornada_config && (
          <div style={{
            gridColumn: '1 / -1',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 12px',
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(139, 92, 246, 0.2)'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6"/>
              <path d="m21 12-6 0m-6 0-6 0"/>
            </svg>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '11px', fontWeight: '600', color: '#f9fafb', margin: 0 }}>
                {turno.jornada_config.nombre}
              </p>
              <p style={{ fontSize: '10px', color: '#a78bfa', margin: 0 }}>
                {formatTime12h(turno.jornada_config.hora_inicio)} - {formatTime12h(turno.jornada_config.hora_fin)}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Personal Asignado - Compacto y horizontal */}
      {personalAsignado.length > 0 && (
        <div style={{
          padding: '12px',
          background: 'rgba(139, 92, 246, 0.08)',
          borderRadius: '10px',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          marginBottom: '12px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#a78bfa',
              textTransform: 'uppercase',
              letterSpacing: '0.3px'
            }}>
              Personal ({personalAsignado.length})
            </span>
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px'
          }}>
            {personalAsignado.map((persona) => (
              <div
                key={persona.id}
                style={{
                  padding: '6px 10px',
                  background: 'rgba(139, 92, 246, 0.15)',
                  border: '1px solid rgba(139, 92, 246, 0.25)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: persona.tipoPersonal.color || '#a78bfa',
                  boxShadow: `0 0 6px ${persona.tipoPersonal.color || '#a78bfa'}80`
                }}></div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#e9d5ff'
                }}>
                  {persona.nombre} {persona.apellido}
                </span>
                <span style={{
                  fontSize: '9px',
                  fontWeight: '500',
                  color: '#c4b5fd',
                  padding: '2px 6px',
                  background: 'rgba(139, 92, 246, 0.2)',
                  borderRadius: '4px'
                }}>
                  {persona.tipoPersonal.nombre}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Observaciones - Solo si existen */}
      {turno.observaciones && (
        <div style={{
          fontSize: '11px',
          color: '#9ca3af',
          fontStyle: 'italic',
          background: 'rgba(55, 65, 81, 0.3)',
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid #374151',
          lineHeight: '1.3',
          marginTop: '8px'
        }}
        title={turno.observaciones}
        >
          💬 {turno.observaciones}
        </div>
      )}
    </div>
  );
};