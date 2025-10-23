import React from 'react';
import { X, User, Mail, Phone, Calendar, MapPin, CreditCard, AlertCircle } from 'lucide-react';

interface Socio {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  tipoMembresia: 'basica' | 'premium' | 'vip';
  fechaRegistro: string;
  estado: 'activo' | 'inactivo' | 'suspendido';
  direccion?: string;
  observaciones?: string;
}

interface VerSocioModalProps {
  isOpen: boolean;
  onClose: () => void;
  socio: Socio;
}

export const VerSocioModal: React.FC<VerSocioModalProps> = ({ 
  isOpen, 
  onClose, 
  socio 
}) => {
  if (!isOpen) return null;

  // Función para obtener el color del estado
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo': return '#10b981';
      case 'suspendido': return '#f59e0b';
      case 'inactivo': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Función para obtener el color de la membresía
  const getMembresiaColor = (tipo: string) => {
    switch (tipo) {
      case 'vip': return '#8b5cf6';
      case 'premium': return '#3b82f6';
      case 'basica': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#1f2937',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 24px 0 24px',
          borderBottom: '1px solid #374151',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#f9fafb',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <User size={24} />
            Detalles del Socio
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '0 24px 24px' }}>
          {/* Información Personal */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#f9fafb',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <User size={18} />
              Información Personal
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#9ca3af',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  ID del Socio
                </label>
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: '#111827',
                  borderRadius: '8px',
                  border: '1px solid #374151',
                  color: '#f9fafb',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  fontWeight: '600'
                }}>
                  {socio.id}
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#9ca3af',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Estado
                </label>
                <div style={{
                  padding: '8px 16px',
                  backgroundColor: getEstadoColor(socio.estado),
                  borderRadius: '20px',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  letterSpacing: '0.05em'
                }}>
                  {socio.estado}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#9ca3af',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Nombre Completo
                </label>
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: '#111827',
                  borderRadius: '8px',
                  border: '1px solid #374151',
                  color: '#f9fafb',
                  fontSize: '16px',
                  fontWeight: '500'
                }}>
                  {socio.nombre} {socio.apellidos}
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#9ca3af',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Tipo de Membresía
                </label>
                <div style={{
                  padding: '8px 16px',
                  backgroundColor: getMembresiaColor(socio.tipoMembresia),
                  borderRadius: '20px',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  letterSpacing: '0.05em'
                }}>
                  {socio.tipoMembresia}
                </div>
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#f9fafb',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Mail size={18} />
              Información de Contacto
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#9ca3af',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  <Mail size={12} />
                  Email
                </label>
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: '#111827',
                  borderRadius: '8px',
                  border: '1px solid #374151',
                  color: '#3b82f6',
                  fontSize: '14px'
                }}>
                  {socio.email}
                </div>
              </div>

              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#9ca3af',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  <Phone size={12} />
                  Teléfono
                </label>
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: '#111827',
                  borderRadius: '8px',
                  border: '1px solid #374151',
                  color: '#f9fafb',
                  fontSize: '14px',
                  fontFamily: 'monospace'
                }}>
                  {socio.telefono}
                </div>
              </div>
            </div>

            {socio.direccion && (
              <div style={{ marginTop: '16px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#9ca3af',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  <MapPin size={12} />
                  Dirección
                </label>
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: '#111827',
                  borderRadius: '8px',
                  border: '1px solid #374151',
                  color: '#f9fafb',
                  fontSize: '14px'
                }}>
                  {socio.direccion}
                </div>
              </div>
            )}
          </div>

          {/* Información de Registro */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#f9fafb',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Calendar size={18} />
              Información de Registro
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#9ca3af',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  <Calendar size={12} />
                  Fecha de Registro (Creación)
                </label>
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: '#111827',
                  borderRadius: '8px',
                  border: '1px solid #374151',
                  color: '#f9fafb',
                  fontSize: '14px',
                  fontFamily: 'monospace'
                }}>
                  {new Date(socio.fechaRegistro).toLocaleDateString('es-ES')}
                </div>
              </div>

              {socio.fechaNacimiento && (
                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#9ca3af',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    <CreditCard size={12} />
                    Fecha de Nacimiento
                  </label>
                  <div style={{
                    padding: '12px 16px',
                    backgroundColor: '#111827',
                    borderRadius: '8px',
                    border: '1px solid #374151',
                    color: '#f9fafb',
                    fontSize: '14px',
                    fontFamily: 'monospace'
                  }}>
                    {new Date(socio.fechaNacimiento).toLocaleDateString('es-ES')}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Observaciones */}
          {socio.observaciones && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#f9fafb',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={18} />
                Observaciones
              </h3>
              <div style={{
                padding: '16px',
                backgroundColor: '#111827',
                borderRadius: '8px',
                border: '1px solid #374151',
                color: '#f9fafb',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                {socio.observaciones}
              </div>
            </div>
          )}

          {/* Botones */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '20px', borderTop: '1px solid #374151' }}>
            <button
              onClick={onClose}
              style={{
                background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(75, 85, 99, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};