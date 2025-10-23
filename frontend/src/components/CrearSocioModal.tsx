import React, { useState } from 'react';
import { X, User, Mail, Phone, CreditCard, Calendar, MapPin } from 'lucide-react';

interface CreateSocioForm {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  tipoMembresia: string;
  fechaIngreso: string;
  direccion: string;
  documento: string;
}

interface CrearSocioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (socio: CreateSocioForm) => void;
}

export const CrearSocioModal: React.FC<CrearSocioModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [formData, setFormData] = useState<CreateSocioForm>({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    tipoMembresia: 'basica',
    fechaIngreso: new Date().toISOString().split('T')[0],
    direccion: '',
    documento: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validación básica
      if (!formData.nombre || !formData.apellido || !formData.email || !formData.documento) {
        throw new Error('Por favor completa todos los campos obligatorios');
      }

      await onSave(formData);
      
      // Resetear formulario
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        tipoMembresia: 'basica',
        fechaIngreso: new Date().toISOString().split('T')[0],
        direccion: '',
        documento: ''
      });
      
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear socio');
    } finally {
      setLoading(false);
    }
  };

  // Estilos profesionales para el modal
  const selectStyles = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '2px solid transparent',
    background: 'linear-gradient(#111827, #111827) padding-box, linear-gradient(135deg, #3b82f6, #8b5cf6) border-box',
    fontSize: '14px',
    fontWeight: '500',
    color: '#f9fafb',
    outline: 'none',
    transition: 'all 0.3s ease',
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23f9fafb' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 12px center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px',
    paddingRight: '40px'
  };

  const inputStyles = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '2px solid transparent',
    background: 'linear-gradient(#111827, #111827) padding-box, linear-gradient(135deg, #3b82f6, #8b5cf6) border-box',
    fontSize: '14px',
    fontWeight: '500',
    color: '#f9fafb',
    outline: 'none',
    transition: 'all 0.3s ease'
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
        borderRadius: '20px',
        width: '100%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
        border: '1px solid #374151'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 24px 0 24px'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: '700',
            color: '#f9fafb',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <User size={24} />
            Crear Nuevo Socio
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
              e.currentTarget.style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#9ca3af';
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '24px' }}>
            {error && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #ef4444',
                borderRadius: '10px',
                padding: '12px',
                marginBottom: '24px',
                color: '#ef4444',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            {/* Información Personal */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                marginBottom: '16px',
                color: '#f9fafb',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <User size={18} />
                Información Personal
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                {/* Nombre */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '8px',
                    color: '#f9fafb'
                  }}>
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    style={inputStyles}
                    onFocus={(e) => {
                      e.target.style.background = 'linear-gradient(#111827, #111827) padding-box, linear-gradient(135deg, #8b5cf6, #3b82f6) border-box';
                      e.target.style.transform = 'scale(1.02)';
                    }}
                    onBlur={(e) => {
                      e.target.style.background = 'linear-gradient(#111827, #111827) padding-box, linear-gradient(135deg, #3b82f6, #8b5cf6) border-box';
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                </div>

                {/* Apellido */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '8px',
                    color: '#f9fafb'
                  }}>
                    Apellido *
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                    style={inputStyles}
                    onFocus={(e) => {
                      e.target.style.background = 'linear-gradient(#111827, #111827) padding-box, linear-gradient(135deg, #8b5cf6, #3b82f6) border-box';
                      e.target.style.transform = 'scale(1.02)';
                    }}
                    onBlur={(e) => {
                      e.target.style.background = 'linear-gradient(#111827, #111827) padding-box, linear-gradient(135deg, #3b82f6, #8b5cf6) border-box';
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Documento */}
                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '8px',
                    color: '#f9fafb'
                  }}>
                    <CreditCard size={16} />
                    Documento *
                  </label>
                  <input
                    type="text"
                    name="documento"
                    value={formData.documento}
                    onChange={handleChange}
                    required
                    style={inputStyles}
                    onFocus={(e) => {
                      e.target.style.background = 'linear-gradient(#111827, #111827) padding-box, linear-gradient(135deg, #8b5cf6, #3b82f6) border-box';
                      e.target.style.transform = 'scale(1.02)';
                    }}
                    onBlur={(e) => {
                      e.target.style.background = 'linear-gradient(#111827, #111827) padding-box, linear-gradient(135deg, #3b82f6, #8b5cf6) border-box';
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '8px',
                    color: '#f9fafb'
                  }}>
                    <Phone size={16} />
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    style={inputStyles}
                    onFocus={(e) => {
                      e.target.style.background = 'linear-gradient(#111827, #111827) padding-box, linear-gradient(135deg, #8b5cf6, #3b82f6) border-box';
                      e.target.style.transform = 'scale(1.02)';
                    }}
                    onBlur={(e) => {
                      e.target.style.background = 'linear-gradient(#111827, #111827) padding-box, linear-gradient(135deg, #3b82f6, #8b5cf6) border-box';
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                marginBottom: '16px',
                color: '#f9fafb',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Mail size={18} />
                Información de Contacto
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                {/* Email */}
                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '8px',
                    color: '#f9fafb'
                  }}>
                    <Mail size={16} />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={inputStyles}
                    onFocus={(e) => {
                      e.target.style.background = 'linear-gradient(#111827, #111827) padding-box, linear-gradient(135deg, #8b5cf6, #3b82f6) border-box';
                      e.target.style.transform = 'scale(1.02)';
                    }}
                    onBlur={(e) => {
                      e.target.style.background = 'linear-gradient(#111827, #111827) padding-box, linear-gradient(135deg, #3b82f6, #8b5cf6) border-box';
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                </div>

                {/* Dirección */}
                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '8px',
                    color: '#f9fafb'
                  }}>
                    <MapPin size={16} />
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    style={inputStyles}
                    onFocus={(e) => {
                      e.target.style.background = 'linear-gradient(#111827, #111827) padding-box, linear-gradient(135deg, #8b5cf6, #3b82f6) border-box';
                      e.target.style.transform = 'scale(1.02)';
                    }}
                    onBlur={(e) => {
                      e.target.style.background = 'linear-gradient(#111827, #111827) padding-box, linear-gradient(135deg, #3b82f6, #8b5cf6) border-box';
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Información de Membresía */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Tipo de Membresía */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  color: '#f9fafb'
                }}>
                  <CreditCard size={16} />
                  Tipo de Membresía *
                </label>
                <select
                  name="tipoMembresia"
                  value={formData.tipoMembresia}
                  onChange={handleChange}
                  required
                  style={selectStyles}
                  onFocus={(e) => {
                    e.target.style.background = 'linear-gradient(#111827, #111827) padding-box, linear-gradient(135deg, #8b5cf6, #3b82f6) border-box';
                    e.target.style.transform = 'scale(1.02)';
                  }}
                  onBlur={(e) => {
                    e.target.style.background = 'linear-gradient(#111827, #111827) padding-box, linear-gradient(135deg, #3b82f6, #8b5cf6) border-box';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <option value="basica">Básica</option>
                  <option value="premium">Premium</option>
                  <option value="vip">VIP</option>
                </select>
              </div>

              {/* Fecha de Ingreso */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  color: '#f9fafb'
                }}>
                  <Calendar size={16} />
                  Fecha de Ingreso *
                </label>
                <input
                  type="date"
                  name="fechaIngreso"
                  value={formData.fechaIngreso}
                  onChange={handleChange}
                  required
                  style={inputStyles}
                  onFocus={(e) => {
                    e.target.style.background = 'linear-gradient(#111827, #111827) padding-box, linear-gradient(135deg, #8b5cf6, #3b82f6) border-box';
                    e.target.style.transform = 'scale(1.02)';
                  }}
                  onBlur={(e) => {
                    e.target.style.background = 'linear-gradient(#111827, #111827) padding-box, linear-gradient(135deg, #3b82f6, #8b5cf6) border-box';
                    e.target.style.transform = 'scale(1)';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div style={{
            padding: '24px',
            borderTop: '1px solid #374151',
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                border: '2px solid #374151',
                background: 'transparent',
                color: '#9ca3af',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#374151';
                e.currentTarget.style.color = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#9ca3af';
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                border: 'none',
                background: loading 
                  ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
                  : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: loading ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                }
              }}
            >
              {loading ? 'Creando...' : 'Crear Socio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};