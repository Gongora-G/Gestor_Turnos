import React, { useState } from 'react';
import { X, User, Mail, Phone, CreditCard, Calendar, MapPin, FileText, Hash, Save } from 'lucide-react';
import { type TipoMembresia } from '../services/tiposMembresiaService';
import { type CrearSocioDto } from '../services/sociosService';
import { Modal } from './Modal';

interface CrearSocioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (socio: CrearSocioDto) => void;
  categorias: TipoMembresia[];
}

export const CrearSocioModal: React.FC<CrearSocioModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  categorias 
}) => {
  const [formData, setFormData] = useState<CrearSocioDto>({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    documento: '',
    tipo_documento: 'cedula',
    fecha_nacimiento: '',
    direccion: '',
    tipo_membresia_id: categorias[0]?.id || '',
    fecha_inicio_membresia: new Date().toISOString().split('T')[0],
    observaciones: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'nombre':
        if (!value.trim()) return 'El nombre es requerido';
        if (value.length < 2) return 'El nombre debe tener al menos 2 caracteres';
        return '';
      case 'apellido':
        if (!value.trim()) return 'El apellido es requerido';
        if (value.length < 2) return 'El apellido debe tener al menos 2 caracteres';
        return '';
      case 'email':
        if (!value.trim()) return 'El email es requerido';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Email inválido';
        return '';
      case 'documento':
        if (!value.trim()) return 'El documento es requerido';
        if (!/^\d{6,15}$/.test(value)) return 'El documento debe tener entre 6 y 15 dígitos';
        return '';
      case 'telefono':
        if (value && !/^\d{7,15}$/.test(value)) return 'El teléfono debe tener entre 7 y 15 dígitos';
        return '';
      case 'tipo_membresia_id':
        if (!value) return 'Debes seleccionar una categoría';
        return '';
      case 'fecha_inicio_membresia':
        if (!value) return 'La fecha de inicio es requerida';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validar campo en tiempo real
    const errorMsg = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: errorMsg
    }));
    
    // Limpiar error general si existe
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validar todos los campos
      const errors: Record<string, string> = {};
      ['nombre', 'apellido', 'email', 'documento', 'tipo_membresia_id', 'fecha_inicio_membresia'].forEach(field => {
        const errorMsg = validateField(field, formData[field as keyof CrearSocioDto] as string);
        if (errorMsg) errors[field] = errorMsg;
      });

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        setError('Por favor corrige los errores en el formulario');
        setLoading(false);
        return;
      }

      await onSave(formData);
      
      // Resetear formulario
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        documento: '',
        tipo_documento: 'cedula',
        fecha_nacimiento: '',
        direccion: '',
        tipo_membresia_id: categorias[0]?.id || '',
        fecha_inicio_membresia: new Date().toISOString().split('T')[0],
        observaciones: ''
      });
      
      onClose();
    } catch (err: any) {
      console.error('Error al crear socio:', err);
      
      // Extraer mensaje específico del backend
      let errorMessage = 'Error al crear socio';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
        
        // Identificar qué campo causó el error
        if (errorMessage.includes('email')) {
          setFieldErrors(prev => ({ ...prev, email: 'Este email ya está registrado en el sistema' }));
        }
        if (errorMessage.includes('documento')) {
          setFieldErrors(prev => ({ ...prev, documento: 'Este documento ya está registrado en el sistema' }));
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Estilos optimizados
  const inputStyles = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    background: 'rgba(255, 255, 255, 0.05)',
    fontSize: '14px',
    fontWeight: '500' as const,
    color: '#f9fafb',
    outline: 'none',
    transition: 'all 0.2s ease'
  };

  const selectStyles = {
    ...inputStyles,
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23f9fafb' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 12px center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px',
    paddingRight: '40px'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Nuevo Socio"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '2px solid #ef4444',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '24px',
            color: '#fecaca',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            boxShadow: '0 4px 6px rgba(239, 68, 68, 0.1)'
          }}>
            <div style={{
              width: '6px',
              minHeight: '20px',
              backgroundColor: '#ef4444',
              borderRadius: '3px'
            }} />
            <div>
              <div style={{ fontWeight: '700', marginBottom: '4px' }}>⚠️ Error</div>
              {error}
            </div>
          </div>
        )}

        {/* Información Personal */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            marginBottom: '20px',
            color: '#f9fafb',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '8px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              borderRadius: '8px',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={16} color="white" />
            </div>
            Información Personal
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            {/* Nombre */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#e2e8f0'
              }}>
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Ingresa el nombre"
                style={{
                  ...inputStyles,
                  borderColor: fieldErrors.nombre ? '#ef4444' : 'rgba(255, 255, 255, 0.2)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = fieldErrors.nombre ? '#ef4444' : '#3b82f6';
                  e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = fieldErrors.nombre ? '#ef4444' : 'rgba(255, 255, 255, 0.2)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              />
              {fieldErrors.nombre && (
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#fca5a5', 
                  fontSize: '13px', 
                  marginTop: '6px',
                  fontWeight: '500'
                }}>
                  <span style={{ fontSize: '14px' }}>⚠️</span>
                  {fieldErrors.nombre}
                </div>
              )}
            </div>

            {/* Apellido */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#e2e8f0'
              }}>
                Apellido *
              </label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
                placeholder="Ingresa el apellido"
                style={{
                  ...inputStyles,
                  borderColor: fieldErrors.apellido ? '#ef4444' : 'rgba(255, 255, 255, 0.2)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = fieldErrors.apellido ? '#ef4444' : '#3b82f6';
                  e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = fieldErrors.apellido ? '#ef4444' : 'rgba(255, 255, 255, 0.2)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              />
              {fieldErrors.apellido && (
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#fca5a5', 
                  fontSize: '13px', 
                  marginTop: '6px',
                  fontWeight: '500'
                }}>
                  <span style={{ fontSize: '14px' }}>⚠️</span>
                  {fieldErrors.apellido}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
            {/* Documento */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#e2e8f0'
              }}>
                <Hash size={16} />
                Documento *
              </label>
              <input
                type="text"
                name="documento"
                value={formData.documento}
                onChange={handleChange}
                required
                placeholder="Número de documento"
                style={{
                  ...inputStyles,
                  borderColor: fieldErrors.documento ? '#ef4444' : 'rgba(255, 255, 255, 0.2)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = fieldErrors.documento ? '#ef4444' : '#3b82f6';
                  e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = fieldErrors.documento ? '#ef4444' : 'rgba(255, 255, 255, 0.2)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              />
              {fieldErrors.documento && (
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#fca5a5', 
                  fontSize: '13px', 
                  marginTop: '6px',
                  fontWeight: '500'
                }}>
                  <span style={{ fontSize: '14px' }}>⚠️</span>
                  {fieldErrors.documento}
                </div>
              )}
            </div>

            {/* Tipo Documento */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#e2e8f0'
              }}>
                <CreditCard size={16} />
                Tipo *
              </label>
              <select
                name="tipo_documento"
                value={formData.tipo_documento}
                onChange={handleChange}
                required
                style={selectStyles}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              >
                <option value="cedula">Cédula</option>
                <option value="pasaporte">Pasaporte</option>
                <option value="extranjeria">Extranjería</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Fecha de Nacimiento */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#e2e8f0'
              }}>
                <Calendar size={16} />
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                style={inputStyles}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
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
                fontWeight: '600',
                marginBottom: '8px',
                color: '#e2e8f0'
              }}>
                <Phone size={16} />
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Número de teléfono"
                style={inputStyles}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
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
            marginBottom: '20px',
            color: '#f9fafb',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '8px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '8px',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Mail size={16} color="white" />
            </div>
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
                fontWeight: '600',
                marginBottom: '8px',
                color: '#e2e8f0'
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
                placeholder="correo@ejemplo.com"
                style={{
                  ...inputStyles,
                  borderColor: fieldErrors.email ? '#ef4444' : 'rgba(255, 255, 255, 0.2)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = fieldErrors.email ? '#ef4444' : '#3b82f6';
                  e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = fieldErrors.email ? '#ef4444' : 'rgba(255, 255, 255, 0.2)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              />
              {fieldErrors.email && (
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#fca5a5', 
                  fontSize: '13px', 
                  marginTop: '6px',
                  fontWeight: '500',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}>
                  <span style={{ fontSize: '14px' }}>⚠️</span>
                  {fieldErrors.email}
                </div>
              )}
            </div>

            {/* Dirección */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#e2e8f0'
              }}>
                <MapPin size={16} />
                Dirección
              </label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Dirección completa"
                style={inputStyles}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              />
            </div>
          </div>
        </div>

        {/* Información de Membresía */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            marginBottom: '20px',
            color: '#f9fafb',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '8px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              borderRadius: '8px',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CreditCard size={16} color="white" />
            </div>
            Información de Membresía
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Categoría de Socio */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#e2e8f0'
              }}>
                <User size={16} />
                Categoría de Socio *
              </label>
              <select
                name="tipo_membresia_id"
                value={formData.tipo_membresia_id}
                onChange={handleChange}
                required
                style={selectStyles}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              >
                <option value="">Selecciona una categoría</option>
                {categorias.filter(cat => cat.activo).map(categoria => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha de Inicio */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#e2e8f0'
              }}>
                <Calendar size={16} />
                Fecha de Inicio *
              </label>
              <input
                type="date"
                name="fecha_inicio_membresia"
                value={formData.fecha_inicio_membresia}
                onChange={handleChange}
                required
                style={inputStyles}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              />
            </div>
          </div>
        </div>

        {/* Observaciones */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px',
            color: '#e2e8f0'
          }}>
            <FileText size={16} />
            Observaciones
          </label>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            rows={3}
            placeholder="Información adicional sobre el socio..."
            style={{
              ...inputStyles,
              resize: 'vertical' as const,
              minHeight: '80px'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.background = 'rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          />
        </div>

        {/* Botones */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'transparent',
              color: '#9ca3af',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(156, 163, 175, 0.1)';
              e.currentTarget.style.color = '#f9fafb';
              e.currentTarget.style.borderColor = '#9ca3af';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#9ca3af';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <X size={16} />
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
              boxShadow: loading ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: loading ? 0.7 : 1
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
            <Save size={16} />
            {loading ? 'Creando...' : 'Crear Socio'}
          </button>
        </div>
      </form>
    </Modal>
  );
};