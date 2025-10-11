import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts';
import { UserPlus, Mail, Lock, User, Phone, Eye, EyeOff, AlertCircle, Info } from 'lucide-react';
import { PasswordRequirements } from '../components/ui';
import type { RegisterData, ApiError } from '../types';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // Validaciones del frontend
    const newFieldErrors: Record<string, string> = {};

    if (formData.password !== confirmPassword) {
      newFieldErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Validar formato de email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      newFieldErrors.email = 'Por favor, ingresa un email válido con dominio existente (ej: usuario@gmail.com)';
    }

    // Validar contraseña
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (formData.password.length < 8) {
      newFieldErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!passwordRegex.test(formData.password)) {
      newFieldErrors.password = 'La contraseña debe incluir mayúscula, minúscula, número y carácter especial';
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    try {
      const { phone, ...dataToSend } = formData;
      await register({
        ...dataToSend,
        ...(phone && { phone }),
      });
      navigate('/dashboard');
    } catch (error) {
      const apiError = error as ApiError;
      
      // Manejar errores específicos del backend
      if (apiError.message?.toLowerCase().includes('email ya está registrado') || 
          apiError.message?.toLowerCase().includes('correo electrónico ya está registrado')) {
        setFieldErrors({ email: apiError.message });
      } else if (apiError.message?.toLowerCase().includes('contraseña')) {
        setFieldErrors({ password: apiError.message });
      } else {
        setError(apiError.message || 'Error al registrar la cuenta. Por favor, intenta nuevamente.');
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0f0f23',
      padding: '16px'
    }}>
      {/* Contenedor principal centrado */}
      <div style={{
        maxWidth: '1000px',
        width: '100%',
        height: '85vh',
        backgroundColor: '#1e1e2e',
        borderRadius: '16px',
        overflow: 'hidden',    
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
        display: 'flex'
      }}>
        {/* Panel izquierdo */}
        <div style={{
          width: '45%',
          background: 'linear-gradient(135deg, #4c6ef5 0%, #364fc7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          position: 'relative'
        }}>
          <div style={{ textAlign: 'center', color: 'white', maxWidth: '300px' }}>
            {/* Logo y marca */}
            <div style={{
              width: '60px',
              height: '60px',
              margin: '0 auto 20px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              📅
            </div>
            
            <h1 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '12px',
              lineHeight: '1.2'
            }}>
              Gestión de Turnos<br />
              Inteligente
            </h1>
            
            <p style={{
              fontSize: '14px',
              opacity: 0.9,
              marginBottom: '24px',
              lineHeight: '1.4'
            }}>
              Únete a nuestra plataforma y organiza tus citas de manera
              eficiente. Controla horarios, clientes y servicios desde
              un solo lugar.
            </p>

            {/* Ilustración de gestión de turnos */}
            <div style={{
              width: '160px',
              height: '120px',
              margin: '0 auto',
              background: 'white',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              {/* Simulando calendario y turnos */}
              <div style={{ position: 'relative', width: '120px', height: '80px' }}>
                {/* Calendario */}
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  width: '50px',
                  height: '40px',
                  background: '#4c6ef5',
                  borderRadius: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{ width: '32px', height: '3px', background: 'white', marginBottom: '3px', borderRadius: '1px' }}></div>
                  <div style={{ width: '24px', height: '3px', background: 'white', marginBottom: '3px', borderRadius: '1px' }}></div>
                  <div style={{ width: '28px', height: '3px', background: 'white', borderRadius: '1px' }}></div>
                </div>
                
                {/* Reloj */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '12px',
                  width: '32px',
                  height: '32px',
                  background: '#10b981',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{ width: '16px', height: '16px', border: '2px solid white', borderRadius: '50%', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '6px', left: '6px', width: '2px', height: '5px', background: 'white', borderRadius: '1px' }}></div>
                    <div style={{ position: 'absolute', top: '4px', left: '6px', width: '2px', height: '3px', background: 'white', borderRadius: '1px' }}></div>
                  </div>
                </div>
                
                {/* Personas/Clientes */}
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '16px',
                  display: 'flex',
                  gap: '4px'
                }}>
                  <div style={{ width: '12px', height: '12px', background: '#f59e0b', borderRadius: '50%' }}></div>
                  <div style={{ width: '12px', height: '12px', background: '#ef4444', borderRadius: '50%' }}></div>
                  <div style={{ width: '12px', height: '12px', background: '#8b5cf6', borderRadius: '50%' }}></div>
                </div>
                
                {/* Indicadores de estado */}
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}>
                  <div style={{ width: '16px', height: '2px', background: '#10b981', borderRadius: '1px' }}></div>
                  <div style={{ width: '12px', height: '2px', background: '#f59e0b', borderRadius: '1px' }}></div>
                  <div style={{ width: '20px', height: '2px', background: '#4c6ef5', borderRadius: '1px' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel derecho */}
        <div style={{
          width: '55%',
          backgroundColor: '#1e1e2e',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ width: '100%', maxWidth: '360px' }}>
            <h2 style={{
              color: 'white',
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              Crea tu cuenta
            </h2>

            {/* Error */}
            {error && (
              <div style={{
                backgroundColor: '#2d1b2d',
                border: '1px solid #4a2d4a',
                borderRadius: '6px',
                padding: '8px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={14} color="#f87171" />
                <span style={{ color: '#fca5a5', fontSize: '12px' }}>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Nombre y Apellido */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '3px', display: 'block' }}>
                    Nombre
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User 
                      size={14} 
                      color="#6b7280" 
                      style={{
                        position: 'absolute',
                        left: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 1
                      }}
                    />
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      style={{
                        width: '100%',
                        height: '34px',
                        backgroundColor: '#2d2d3a',
                        border: 'none',
                        borderRadius: '5px',
                        paddingLeft: '28px',
                        paddingRight: '10px',
                        color: 'white',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
                
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '3px', display: 'block' }}>
                    Apellido
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User 
                      size={14} 
                      color="#6b7280" 
                      style={{
                        position: 'absolute',
                        left: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 1
                      }}
                    />
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Tu apellido"
                      style={{
                        width: '100%',
                        height: '34px',
                        backgroundColor: '#2d2d3a',
                        border: 'none',
                        borderRadius: '5px',
                        paddingLeft: '28px',
                        paddingRight: '10px',
                        color: 'white',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '3px', display: 'block' }}>
                  Correo Electrónico
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail 
                    size={14} 
                    color="#6b7280" 
                    style={{
                      position: 'absolute',
                      left: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 1
                    }}
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ejemplo@dominio.com"
                    style={{
                      width: '100%',
                      height: '34px',
                      backgroundColor: '#2d2d3a',
                      border: fieldErrors.email ? '1px solid #ef4444' : 'none',
                      borderRadius: '5px',
                      paddingLeft: '28px',
                      paddingRight: '10px',
                      color: 'white',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  {/* Error específico de email */}
                  {fieldErrors.email && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginTop: '4px',
                      color: '#ef4444',
                      fontSize: '11px'
                    }}>
                      <AlertCircle size={12} />
                      <span>{fieldErrors.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Teléfono */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '3px', display: 'block' }}>
                  Teléfono
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone 
                    size={14} 
                    color="#6b7280" 
                    style={{
                      position: 'absolute',
                      left: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 1
                    }}
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    placeholder="Tu número de teléfono"
                    style={{
                      width: '100%',
                      height: '34px',
                      backgroundColor: '#2d2d3a',
                      border: 'none',
                      borderRadius: '5px',
                      paddingLeft: '28px',
                      paddingRight: '10px',
                      color: 'white',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Contraseñas en una sola fila */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '3px', display: 'block' }}>
                    Contraseña
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock 
                      size={14} 
                      color="#6b7280" 
                      style={{
                        position: 'absolute',
                        left: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 1
                      }}
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setShowPasswordRequirements(true)}
                      onBlur={() => setShowPasswordRequirements(false)}
                      placeholder="Contraseña"
                      style={{
                        width: '100%',
                        height: '34px',
                        backgroundColor: '#2d2d3a',
                        border: fieldErrors.password ? '1px solid #ef4444' : 'none',
                        borderRadius: '5px',
                        paddingLeft: '28px',
                        paddingRight: '28px',
                        color: 'white',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {showPassword ? (
                        <EyeOff size={12} color="#6b7280" />
                      ) : (
                        <Eye size={12} color="#6b7280" />
                      )}
                    </button>
                  </div>
                  {/* Requisitos de contraseña */}
                  <PasswordRequirements 
                    password={formData.password} 
                    show={showPasswordRequirements || !!fieldErrors.password} 
                  />
                  {/* Error específico de contraseña */}
                  {fieldErrors.password && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginTop: '4px',
                      color: '#ef4444',
                      fontSize: '11px'
                    }}>
                      <AlertCircle size={12} />
                      <span>{fieldErrors.password}</span>
                    </div>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '3px', display: 'block' }}>
                    Confirmar
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock 
                      size={14} 
                      color="#6b7280" 
                      style={{
                        position: 'absolute',
                        left: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 1
                      }}
                    />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      required
                      value={confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirmar"
                      style={{
                        width: '100%',
                        height: '34px',
                        backgroundColor: '#2d2d3a',
                        border: fieldErrors.confirmPassword ? '1px solid #ef4444' : 'none',
                        borderRadius: '5px',
                        paddingLeft: '28px',
                        paddingRight: '28px',
                        color: 'white',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={12} color="#6b7280" />
                      ) : (
                        <Eye size={12} color="#6b7280" />
                      )}
                    </button>
                  </div>
                  {/* Error específico de confirmar contraseña */}
                  {fieldErrors.confirmPassword && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginTop: '4px',
                      color: '#ef4444',
                      fontSize: '11px'
                    }}>
                      <AlertCircle size={12} />
                      <span>{fieldErrors.confirmPassword}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Botón Registrarse */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  height: '38px',
                  backgroundColor: loading ? '#364fc7' : '#4c6ef5',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'background-color 0.2s',
                  opacity: loading ? 0.7 : 1,
                  marginBottom: '12px'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#364fc7';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#4c6ef5';
                  }
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '14px',
                      height: '14px',
                      border: '2px solid white',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <span>Registrando...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={14} />
                    <span>Registrarse</span>
                  </>
                )}
              </button>

              {/* Separador */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                margin: '12px 0',
                color: '#6b7280',
                fontSize: '12px'
              }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#374151' }}></div>
                <span style={{ padding: '0 12px' }}>o</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#374151' }}></div>
              </div>

              {/* Registrarse con Google */}
              <button
                type="button"
                onClick={() => {
                  window.location.href = 'http://localhost:3002/auth/google?context=register';
                }}
                style={{
                  width: '100%',
                  height: '36px',
                  backgroundColor: '#2d2d3a',
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'background-color 0.2s',
                  marginBottom: '12px'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#374151';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#2d2d3a';
                }}
              >
                <Mail size={14} />
                <span>Registrarse con Google</span>
              </button>

              {/* Enlaces */}
              <div style={{ textAlign: 'center' }}>
                <p style={{
                  color: '#9ca3af',
                  fontSize: '12px',
                  marginBottom: '8px'
                }}>
                  ¿Ya tienes una cuenta?{' '}
                  <Link
                    to="/login"
                    style={{
                      color: '#4c6ef5',
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}
                  >
                    Inicia sesión aquí
                  </Link>
                </p>
                
                <div style={{
                  color: '#6b7280',
                  fontSize: '10px',
                  lineHeight: '1.3'
                }}>
                  Al crear una cuenta, aceptas nuestros{' '}
                  <button
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#4c6ef5',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      padding: 0,
                      font: 'inherit'
                    }}
                    onClick={() => navigate('/terms-of-service')}
                  >
                    Términos de Servicio
                  </button>
                  {' '}y{' '}
                  <button
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#4c6ef5',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      padding: 0,
                      font: 'inherit'
                    }}
                    onClick={() => navigate('/privacy-policy')}
                  >
                    Política de Privacidad
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};