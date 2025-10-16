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
    role: 'caddie_master',
    // Datos del Club
    clubName: '',
    clubAddress: '',
    clubCity: '',
    clubCountry: 'Colombia',
    totalCourts: 1,
    clubContactEmail: '',
    clubContactPhone: '',
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
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0f0f23',
      padding: '20px'
    }}>
      {/* Contenedor principal centrado */}
      <div style={{
        maxWidth: '1100px',
        width: '100%',
        maxHeight: '90vh',
        backgroundColor: '#1e1e2e',
        borderRadius: '16px',
        overflow: 'hidden',    
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
        display: 'flex'
      }}>
        {/* Panel izquierdo */}
        <div style={{
          width: '50%',
          background: 'linear-gradient(135deg, #4c6ef5 0%, #364fc7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
          position: 'relative'
        }}>
          <div style={{ textAlign: 'center', color: 'white', maxWidth: '350px' }}>
            {/* Logo y marca */}
            <div style={{
              width: '70px',
              height: '70px',
              margin: '0 auto 32px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: 'bold'
            }}>
              🎾
            </div>
            
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '16px',
              lineHeight: '1.2'
            }}>
              🎾 CaddieFlow<br />
              Sistema de Gestión
            </h1>
            
            <p style={{
              fontSize: '15px',
              opacity: 0.9,
              marginBottom: '40px',
              lineHeight: '1.5'
            }}>
              Registro exclusivo para <strong>Caddie Masters</strong> y <strong>Profesores</strong>.
              Gestiona caddies, turnos y estadísticas de tu club de tenis.
            </p>

            {/* Ilustración de gestión de turnos */}
            <div style={{
              width: '180px',
              height: '140px',
              margin: '0 auto',
              background: 'white',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              {/* Simulando calendario y turnos */}
              <div style={{ position: 'relative', width: '140px', height: '100px' }}>
                {/* Calendario */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  width: '60px',
                  height: '50px',
                  background: '#4c6ef5',
                  borderRadius: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{ width: '40px', height: '4px', background: 'white', marginBottom: '4px', borderRadius: '2px' }}></div>
                  <div style={{ width: '30px', height: '4px', background: 'white', marginBottom: '4px', borderRadius: '2px' }}></div>
                  <div style={{ width: '35px', height: '4px', background: 'white', borderRadius: '2px' }}></div>
                </div>
                
                {/* Reloj */}
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  width: '40px',
                  height: '40px',
                  background: '#10b981',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{ width: '20px', height: '20px', border: '2px solid white', borderRadius: '50%', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '8px', left: '8px', width: '2px', height: '6px', background: 'white', borderRadius: '1px' }}></div>
                    <div style={{ position: 'absolute', top: '6px', left: '8px', width: '2px', height: '4px', background: 'white', borderRadius: '1px' }}></div>
                  </div>
                </div>
                
                {/* Personas/Clientes */}
                <div style={{
                  position: 'absolute',
                  bottom: '15px',
                  left: '20px',
                  display: 'flex',
                  gap: '6px'
                }}>
                  <div style={{ width: '16px', height: '16px', background: '#f59e0b', borderRadius: '50%' }}></div>
                  <div style={{ width: '16px', height: '16px', background: '#ef4444', borderRadius: '50%' }}></div>
                  <div style={{ width: '16px', height: '16px', background: '#8b5cf6', borderRadius: '50%' }}></div>
                </div>
                
                {/* Indicadores de estado */}
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px'
                }}>
                  <div style={{ width: '20px', height: '3px', background: '#10b981', borderRadius: '2px' }}></div>
                  <div style={{ width: '15px', height: '3px', background: '#f59e0b', borderRadius: '2px' }}></div>
                  <div style={{ width: '25px', height: '3px', background: '#4c6ef5', borderRadius: '2px' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel derecho */}
        <div style={{
          width: '50%',
          backgroundColor: '#1e1e2e',
          padding: '24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
            <h2 style={{
              color: 'white',
              fontSize: '22px',
              fontWeight: '600',
              marginBottom: '20px',
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
                marginBottom: '16px',
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
              <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '4px', display: 'block' }}>
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
                      placeholder="Tu nombre"
                      style={{
                        width: '100%',
                        height: '44px',
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
                  <label style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '6px', display: 'block' }}>
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
                      placeholder="Tu apellido"
                      style={{
                        width: '100%',
                        height: '44px',
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
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '6px', display: 'block' }}>
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
                      height: '44px',
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

              {/* Rol */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '6px', display: 'block' }}>
                  Tu Rol *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    height: '44px',
                    backgroundColor: '#2d2d3a',
                    border: 'none',
                    borderRadius: '8px',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    color: 'white',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="caddie_master">Caddie Master</option>
                  <option value="profesor">Profesor de Tenis</option>
                </select>
              </div>

              {/* Separador */}
              <div style={{ 
                margin: '24px 0', 
                padding: '16px 0', 
                borderTop: '1px solid #374151',
                borderBottom: '1px solid #374151' 
              }}>
                <h3 style={{ 
                  color: '#f3f4f6', 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  margin: '0',
                  textAlign: 'center'
                }}>
                  📍 Información del Club
                </h3>
                <p style={{ 
                  color: '#9ca3af', 
                  fontSize: '13px', 
                  margin: '8px 0 0 0',
                  textAlign: 'center'
                }}>
                  Registra tu club para empezar a usar CaddieFlow
                </p>
              </div>

              {/* Nombre del Club */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '6px', display: 'block' }}>
                  Nombre del Club *
                </label>
                <input
                  type="text"
                  name="clubName"
                  value={formData.clubName}
                  onChange={handleChange}
                  placeholder="Ej: Club Puerto Peñaliza - Sede Tenis"
                  required
                  style={{
                    width: '100%',
                    height: '44px',
                    backgroundColor: '#2d2d3a',
                    border: 'none',
                    borderRadius: '8px',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    color: 'white',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Dirección y Ciudad */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <div style={{ flex: 2 }}>
                  <label style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '6px', display: 'block' }}>
                    Dirección *
                  </label>
                  <input
                    type="text"
                    name="clubAddress"
                    value={formData.clubAddress}
                    onChange={handleChange}
                    placeholder="Calle 123 #45-67"
                    required
                    style={{
                      width: '100%',
                      height: '44px',
                      backgroundColor: '#2d2d3a',
                      border: 'none',
                      borderRadius: '8px',
                      paddingLeft: '16px',
                      paddingRight: '16px',
                      color: 'white',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '6px', display: 'block' }}>
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    name="clubCity"
                    value={formData.clubCity}
                    onChange={handleChange}
                    placeholder="Medellín"
                    required
                    style={{
                      width: '100%',
                      height: '44px',
                      backgroundColor: '#2d2d3a',
                      border: 'none',
                      borderRadius: '8px',
                      paddingLeft: '16px',
                      paddingRight: '16px',
                      color: 'white',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* País y Canchas */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '6px', display: 'block' }}>
                    País *
                  </label>
                  <select
                    name="clubCountry"
                    value={formData.clubCountry}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      height: '44px',
                      backgroundColor: '#2d2d3a',
                      border: 'none',
                      borderRadius: '8px',
                      paddingLeft: '16px',
                      paddingRight: '16px',
                      color: 'white',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Colombia">Colombia</option>
                    <option value="México">México</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Chile">Chile</option>
                    <option value="Perú">Perú</option>
                    <option value="Ecuador">Ecuador</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '6px', display: 'block' }}>
                    Nº Canchas *
                  </label>
                  <input
                    type="number"
                    name="totalCourts"
                    value={formData.totalCourts}
                    onChange={handleChange}
                    min="1"
                    max="50"
                    required
                    style={{
                      width: '100%',
                      height: '44px',
                      backgroundColor: '#2d2d3a',
                      border: 'none',
                      borderRadius: '8px',
                      paddingLeft: '16px',
                      paddingRight: '16px',
                      color: 'white',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Email y Teléfono del Club */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '6px', display: 'block' }}>
                    Email del Club *
                  </label>
                  <input
                    type="email"
                    name="clubContactEmail"
                    value={formData.clubContactEmail}
                    onChange={handleChange}
                    placeholder="info@miclub.com"
                    required
                    style={{
                      width: '100%',
                      height: '44px',
                      backgroundColor: '#2d2d3a',
                      border: 'none',
                      borderRadius: '8px',
                      paddingLeft: '16px',
                      paddingRight: '16px',
                      color: 'white',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '6px', display: 'block' }}>
                    Teléfono del Club *
                  </label>
                  <input
                    type="tel"
                    name="clubContactPhone"
                    value={formData.clubContactPhone}
                    onChange={handleChange}
                    placeholder="+57 4 123-4567"
                    required
                    style={{
                      width: '100%',
                      height: '44px',
                      backgroundColor: '#2d2d3a',
                      border: 'none',
                      borderRadius: '8px',
                      paddingLeft: '16px',
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
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '6px', display: 'block' }}>
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
                    placeholder="Tu número de teléfono"
                    style={{
                      width: '100%',
                      height: '44px',
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

              {/* Contraseña */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '6px', display: 'block' }}>
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
                    placeholder="Crea una contraseña"
                    style={{
                      width: '100%',
                      height: '44px',
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

              {/* Confirmar Contraseña */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '6px', display: 'block' }}>
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
                      height: '44px',
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

              {/* Botón Registrarse */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  height: '44px',
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
                margin: '16px 0',
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
                onClick={() => {
                  // Marcar contexto de registro y redirigir
                  sessionStorage.setItem('oauth_context', 'register');
                  window.location.href = 'http://localhost:3002/auth/google?context=register';
                }}
                style={{
                  width: '100%',
                  height: '44px',
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
                  marginBottom: '16px'
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
                  marginBottom: '12px'
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
                  fontSize: '11px',
                  lineHeight: '1.4'
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