import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts';
import { UserPlus, Mail, Lock, User, Phone, Eye, EyeOff, AlertCircle } from 'lucide-react';
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

    if (formData.password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
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
      setError(apiError.message || 'Error al registrar la cuenta');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: '#0f0f23'
    }}>
      {/* Panel izquierdo */}
      <div style={{
        width: '50%',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
        position: 'relative'
      }}>
        <div style={{ textAlign: 'center', color: 'white', maxWidth: '400px' }}>
          {/* Logo y marca */}
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 32px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            fontWeight: 'bold'
          }}>
            ✦
          </div>
          
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '16px',
            lineHeight: '1.2'
          }}>
            Tu futuro financiero,<br />
            simplificado.
          </h1>
          
          <p style={{
            fontSize: '16px',
            opacity: 0.9,
            marginBottom: '48px',
            lineHeight: '1.5'
          }}>
            Registra una cuenta para gestionar tus turnos de forma
            inteligente y segura. Accede a herramientas intuitivas para el
            control de gestos, presupuestos y más.
          </p>

          {/* Ilustración */}
          <div style={{
            width: '200px',
            height: '150px',
            margin: '0 auto',
            background: 'white',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            {/* Simulando la ilustración de finanzas */}
            <div style={{ position: 'relative', width: '160px', height: '120px' }}>
              {/* Persona */}
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '60px',
                width: '40px',
                height: '40px',
                background: '#fbbf24',
                borderRadius: '50%'
              }}></div>
              <div style={{
                position: 'absolute',
                top: '40px',
                left: '55px',
                width: '50px',
                height: '60px',
                background: '#3b82f6',
                borderRadius: '8px'
              }}></div>
              
              {/* Gráficos de barras */}
              <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                display: 'flex',
                gap: '4px',
                alignItems: 'end'
              }}>
                <div style={{ width: '12px', height: '20px', background: '#ef4444', borderRadius: '2px' }}></div>
                <div style={{ width: '12px', height: '35px', background: '#f59e0b', borderRadius: '2px' }}></div>
                <div style={{ width: '12px', height: '15px', background: '#10b981', borderRadius: '2px' }}></div>
                <div style={{ width: '12px', height: '40px', background: '#3b82f6', borderRadius: '2px' }}></div>
                <div style={{ width: '12px', height: '25px', background: '#8b5cf6', borderRadius: '2px' }}></div>
              </div>
              
              {/* Gráficos de barras del lado derecho */}
              <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                display: 'flex',
                gap: '4px',
                alignItems: 'end'
              }}>
                <div style={{ width: '12px', height: '30px', background: '#06b6d4', borderRadius: '2px' }}></div>
                <div style={{ width: '12px', height: '20px', background: '#84cc16', borderRadius: '2px' }}></div>
                <div style={{ width: '12px', height: '45px', background: '#f59e0b', borderRadius: '2px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel derecho */}
      <div style={{
        width: '50%',
        backgroundColor: '#1e1e2e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px'
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{
            color: 'white',
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            Crea tu cuenta
          </h2>

          {/* Error */}
          {error && (
            <div style={{
              backgroundColor: '#2d1b2d',
              border: '1px solid #4a2d4a',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <AlertCircle size={16} color="#f87171" />
              <span style={{ color: '#fca5a5', fontSize: '14px' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Nombre y Apellido */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                  Nombre
                </label>
                <div style={{ position: 'relative' }}>
                  <User 
                    size={16} 
                    color="#6b7280" 
                    style={{
                      position: 'absolute',
                      left: '12px',
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
                    placeholder="Ingresa tu nombre"
                    style={{
                      width: '100%',
                      height: '48px',
                      backgroundColor: '#2d2d3a',
                      border: 'none',
                      borderRadius: '8px',
                      paddingLeft: '40px',
                      paddingRight: '16px',
                      color: 'white',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ flex: 1 }}>
                <label style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                  Apellido
                </label>
                <div style={{ position: 'relative' }}>
                  <User 
                    size={16} 
                    color="#6b7280" 
                    style={{
                      position: 'absolute',
                      left: '12px',
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
                    placeholder="Ingresa tu apellido"
                    style={{
                      width: '100%',
                      height: '48px',
                      backgroundColor: '#2d2d3a',
                      border: 'none',
                      borderRadius: '8px',
                      paddingLeft: '40px',
                      paddingRight: '16px',
                      color: 'white',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                Correo Electrónico
              </label>
              <div style={{ position: 'relative' }}>
                <Mail 
                  size={16} 
                  color="#6b7280" 
                  style={{
                    position: 'absolute',
                    left: '12px',
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
                    height: '48px',
                    backgroundColor: '#2d2d3a',
                    border: 'none',
                    borderRadius: '8px',
                    paddingLeft: '40px',
                    paddingRight: '16px',
                    color: 'white',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Teléfono */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                Teléfono
              </label>
              <div style={{ position: 'relative' }}>
                <Phone 
                  size={16} 
                  color="#6b7280" 
                  style={{
                    position: 'absolute',
                    left: '12px',
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
                  placeholder="Ingresa tu número de teléfono"
                  style={{
                    width: '100%',
                    height: '48px',
                    backgroundColor: '#2d2d3a',
                    border: 'none',
                    borderRadius: '8px',
                    paddingLeft: '40px',
                    paddingRight: '16px',
                    color: 'white',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Contraseñas */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                  Contraseña
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock 
                    size={16} 
                    color="#6b7280" 
                    style={{
                      position: 'absolute',
                      left: '12px',
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
                    placeholder="Crea una contraseña segura"
                    style={{
                      width: '100%',
                      height: '48px',
                      backgroundColor: '#2d2d3a',
                      border: 'none',
                      borderRadius: '8px',
                      paddingLeft: '40px',
                      paddingRight: '40px',
                      color: 'white',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
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
                      <EyeOff size={16} color="#6b7280" />
                    ) : (
                      <Eye size={16} color="#6b7280" />
                    )}
                  </button>
                </div>
              </div>
              
              <div style={{ flex: 1 }}>
                <label style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                  Confirmar Contraseña
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock 
                    size={16} 
                    color="#6b7280" 
                    style={{
                      position: 'absolute',
                      left: '12px',
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
                    placeholder="Confirma tu contraseña"
                    style={{
                      width: '100%',
                      height: '48px',
                      backgroundColor: '#2d2d3a',
                      border: 'none',
                      borderRadius: '8px',
                      paddingLeft: '40px',
                      paddingRight: '40px',
                      color: 'white',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
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
                      <EyeOff size={16} color="#6b7280" />
                    ) : (
                      <Eye size={16} color="#6b7280" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Botón Registrarse */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: '48px',
                backgroundColor: loading ? '#364fc7' : '#4c6ef5',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '15px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background-color 0.2s',
                opacity: loading ? 0.7 : 1,
                marginBottom: '16px'
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
                    width: '16px',
                    height: '16px',
                    border: '2px solid white',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <span>Registrando...</span>
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>Registrarse</span>
                </>
              )}
            </button>

            {/* Separador */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '24px 0',
              color: '#6b7280',
              fontSize: '14px'
            }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#374151' }}></div>
              <span style={{ padding: '0 16px' }}>o</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#374151' }}></div>
            </div>

            {/* Registrarse con Google */}
            <button
              type="button"
              style={{
                width: '100%',
                height: '48px',
                backgroundColor: '#2d2d3a',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: 'white',
                fontSize: '15px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background-color 0.2s',
                marginBottom: '24px'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = '#374151';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = '#2d2d3a';
              }}
            >
              <Mail size={16} />
              <span>Registrarse con Google</span>
            </button>

            {/* Enlaces */}
            <div style={{ textAlign: 'center' }}>
              <p style={{
                color: '#9ca3af',
                fontSize: '14px',
                marginBottom: '16px'
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
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <span>Al crear una cuenta, aceptas nuestros </span>
                <a 
                  href="#" 
                  style={{
                    color: '#4c6ef5',
                    textDecoration: 'none'
                  }}
                >
                  Términos de Servicio
                </a>
                <span> y </span>
                <a 
                  href="#" 
                  style={{
                    color: '#4c6ef5',
                    textDecoration: 'none'
                  }}
                >
                  Política de Privacidad
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};