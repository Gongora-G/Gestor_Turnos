import React from 'react';
import { Eye, Edit2, Trash2, MapPin, Clock, Calendar, User, Circle } from 'lucide-react';
import { formatTo12Hour } from '../utils/dateTime';
import { calcularEstadoAutomatico, getEstadoColor, getEstadoTexto } from '../utils/turnoStates';

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
  const estadoCalculado = calcularEstadoAutomatico(turno.fecha, turno.hora_inicio, turno.hora_fin);
  const estadoColor = getEstadoColor(estadoCalculado);

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
      fontFamily: 'Inter, system-ui, sans-serif'
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
              fontSize: '14px',
              fontWeight: '600',
              color: '#f9fafb',
              marginBottom: '4px',
              margin: 0
            }}>
              {new Date(turno.fecha).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
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
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            borderRadius: '12px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <User size={20} color="white" />
          </div>
          <div>
            <p style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#f9fafb',
              marginBottom: '4px',
              margin: 0
            }}>
              {turno.socio?.nombre || turno.usuario?.nombre || 'Usuario no especificado'}
            </p>
            {turno.socio?.tipo_membresia && (
              <p style={{
                fontSize: '12px',
                color: '#a78bfa',
                fontWeight: '500',
                margin: 0
              }}>
                Membresía: {turno.socio.tipo_membresia}
              </p>
            )}
          </div>
        </div>
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