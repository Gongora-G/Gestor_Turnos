import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts';
import { useToast } from '../contexts/ToastContext';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { PasswordRequirements, PhoneInput, LoadingButton, ValidatedInput, validators, RegistrationSuccess } from '../components/ui';
import type { RegisterData, ApiError } from '../types';

export const RegisterPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
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
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isGoogleRegistration, setIsGoogleRegistration] = useState(false);
  const [searchParams] = useSearchParams();

  // Detectar si viene de Google OAuth
  useEffect(() => {
    const googleEmail = searchParams.get('google_email');
    const googleFirstName = searchParams.get('google_firstName');
    const googleLastName = searchParams.get('google_lastName');
    const error = searchParams.get('error');
    const message = searchParams.get('message');
    
    // Manejar errores de OAuth
    if (error && message) {
      showError(decodeURIComponent(message), 6000);
      
      // Limpiar URL después de mostrar el error
      window.history.replaceState({}, document.title, '/register');
      return;
    }
    
    // Manejar datos exitosos de Google
    if (googleEmail && googleFirstName && googleLastName) {
      // Auto-completar con datos de Google
      setFormData(prev => ({
        ...prev,
        email: decodeURIComponent(googleEmail),
        firstName: decodeURIComponent(googleFirstName),
        lastName: decodeURIComponent(googleLastName),
      }));
      
      // Marcar como registro de Google y saltar al paso 2
      setIsGoogleRegistration(true);
      setCurrentStep(2);
      
      // Mostrar mensaje de bienvenida
      success(`¡Hola ${decodeURIComponent(googleFirstName)}! Completa los datos de tu club para finalizar el registro.`, 5000);
      
      // Limpiar URL para una mejor UX
      window.history.replaceState({}, document.title, '/register');
    }
  }, [searchParams, success, showError]);

  const handleSuccessComplete = () => {
    navigate('/dashboard');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      // Convertir totalCourts a número
      const processedValue = name === 'totalCourts' ? parseInt(value) || 1 : value;
      setFormData(prev => ({ ...prev, [name]: processedValue }));
    }
  };

  const handleNextStep = () => {
    // Validar paso 1 antes de continuar
    const step1Errors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      step1Errors.firstName = 'El nombre es requerido';
    }
    if (!formData.lastName.trim()) {
      step1Errors.lastName = 'El apellido es requerido';
    }
    if (!formData.email.trim()) {
      step1Errors.email = 'El email es requerido';
    }
    if (!formData.password) {
      step1Errors.password = 'La contraseña es requerida';
    }
    if (!confirmPassword) {
      step1Errors.confirmPassword = 'Confirma tu contraseña';
    }
    if (formData.password !== confirmPassword) {
      step1Errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (Object.keys(step1Errors).length > 0) {
      setFieldErrors(step1Errors);
      return;
    }

    setFieldErrors({});
    setCurrentStep(2);
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
    setFieldErrors({});
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
      const finalData = {
        ...dataToSend,
        ...(phone && { phone }),
      };
      
      console.log('📤 Datos que se van a enviar:', finalData);
      
      await register(finalData);
      
      // Mostrar pantalla de éxito en lugar de navegar inmediatamente
      setShowSuccess(true);
    } catch (error) {
      console.error('❌ Error completo:', error);
      const apiError = error as ApiError;
      
      // Verificar si apiError.message es string antes de usar toLowerCase
      const errorMessage = typeof apiError.message === 'string' ? apiError.message : 
                          (apiError.message && typeof apiError.message === 'object' ? 
                           JSON.stringify(apiError.message) : 'Error desconocido');
      
      console.log('🔍 Mensaje de error procesado:', errorMessage);
      
      // Manejar errores específicos del backend
      if (errorMessage.toLowerCase().includes('email ya está registrado') || 
          errorMessage.toLowerCase().includes('correo electrónico ya está registrado')) {
        setFieldErrors({ email: errorMessage });
        showError('Este email ya está registrado. Intenta con otro email o inicia sesión.', 6000);
      } else if (errorMessage.toLowerCase().includes('contraseña')) {
        setFieldErrors({ password: errorMessage });
        showError('Error en la contraseña. Revisa los requisitos.', 6000);
      } else if (errorMessage.toLowerCase().includes('teléfono')) {
        showError('Error en el formato del número de teléfono. Verifica que sea válido.', 6000);
      } else {
        setError(errorMessage || 'Error al registrar la cuenta. Por favor, intenta nuevamente.');
        showError(errorMessage || 'Ocurrió un error inesperado. Por favor, intenta nuevamente.', 6000);
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f0f23',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '800px',
        display: 'flex',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: '#1a1a2e',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        height: 'auto',
        maxHeight: '95vh'
      }}>
        {/* Panel Izquierdo */}
        <div style={{
          flex: 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <UserPlus size={26} />
          </div>
          
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            marginBottom: '12px',
            lineHeight: '1.2'
          }}>
            Gestión de Turnos<br />Inteligente
          </h1>
          
          <p style={{ 
            fontSize: '14px', 
            opacity: 0.9, 
            lineHeight: '1.4',
            marginBottom: '0'
          }}>
            Únete a nuestra plataforma y organiza tus citas de manera eficiente. Controla horarios, clientes y servicios desde un solo lugar.
          </p>
          
          <div style={{
            marginTop: '16px',
            padding: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '280px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '30px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: '18px' }}>📋</div>
              </div>
              <div style={{
                width: '20px',
                height: '20px',
                backgroundColor: 'rgba(76, 175, 80, 0.8)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: '12px' }}>✓</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <div style={{ width: '60px', height: '2px', backgroundColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '1px' }}></div>
              <div style={{ width: '60px', height: '2px', backgroundColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '1px' }}></div>
              <div style={{ width: '60px', height: '2px', backgroundColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '1px' }}></div>
            </div>
          </div>
        </div>

        {/* Panel Derecho - Formulario */}
        <div style={{
          flex: 1,
          padding: '24px',
          backgroundColor: '#1a1a2e',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ 
              color: '#f3f4f6', 
              fontSize: '20px', 
              fontWeight: '600', 
              marginBottom: '4px' 
            }}>
              Crear tu cuenta
            </h2>
            <p style={{ 
              color: '#9ca3af', 
              fontSize: '13px',
              margin: '0'
            }}>
              Completa tus datos para empezar
            </p>
          </div>

          {/* Mostrar error general */}
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              padding: '8px',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <AlertCircle size={14} color="#dc2626" />
              <span style={{ color: '#dc2626', fontSize: '12px' }}>{error}</span>
            </div>
          )}

          {/* Indicador de Progreso */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '6px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: currentStep >= 1 ? '#4f46e5' : '#374151',
                transition: 'background-color 0.3s'
              }}></div>
              <div style={{
                width: '30px',
                height: '2px',
                backgroundColor: currentStep >= 2 ? '#4f46e5' : '#374151',
                transition: 'background-color 0.3s'
              }}></div>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: currentStep >= 2 ? '#4f46e5' : '#374151',
                transition: 'background-color 0.3s'
              }}></div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ color: '#9ca3af', fontSize: '11px' }}>
                Paso {currentStep} de 2: {currentStep === 1 ? 'Información Personal' : 'Información del Club'}
              </span>
            </div>
          </div>

          <form onSubmit={currentStep === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNextStep(); }}>
            {/* PASO 1: Información Personal */}
            {currentStep === 1 && (
              <>
                {/* Nombre y Apellido */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <ValidatedInput
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      label="Nombre"
                      required
                      icon={<User size={12} />}
                      validator={validators.required('Nombre')}
                      style={{ marginBottom: '0' }}
                    />
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <ValidatedInput
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Tu apellido"
                      label="Apellido"
                      required
                      icon={<User size={12} />}
                      validator={validators.required('Apellido')}
                      style={{ marginBottom: '0' }}
                    />
                  </div>
                </div>

                {/* Email */}
                <ValidatedInput
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  label="Correo Electrónico"
                  required
                  icon={<Mail size={12} />}
                  validator={validators.email}
                />

                {/* Teléfono */}
                <PhoneInput
                  label="Teléfono"
                  name="phone"
                  value={formData.phone}
                  onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
                  placeholder="Tu número de teléfono"
                  error={fieldErrors.phone}
                  style={{ marginBottom: '10px' }}
                />

                {/* Contraseñas */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ color: '#9ca3af', fontSize: '11px', marginBottom: '2px', display: 'block' }}>
                      Contraseña *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock 
                        size={12} 
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
                        placeholder="Mínimo 8 caracteres"
                        style={{
                          width: '100%',
                          height: '30px',
                          backgroundColor: '#2d2d3a',
                          border: fieldErrors.password ? '1px solid #ef4444' : 'none',
                          borderRadius: '4px',
                          paddingLeft: '26px',
                          paddingRight: '32px',
                          color: 'white',
                          fontSize: '12px',
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
                          color: '#6b7280'
                        }}
                      >
                        {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                      </button>
                    </div>
                    {fieldErrors.password && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        marginTop: '2px',
                        color: '#ef4444',
                        fontSize: '10px'
                      }}>
                        <AlertCircle size={10} />
                        <span>{fieldErrors.password}</span>
                      </div>
                    )}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <label style={{ color: '#9ca3af', fontSize: '11px', marginBottom: '2px', display: 'block' }}>
                      Confirmar *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock 
                        size={12} 
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
                        placeholder="Confirmar contraseña"
                        style={{
                          width: '100%',
                          height: '30px',
                          backgroundColor: '#2d2d3a',
                          border: fieldErrors.confirmPassword ? '1px solid #ef4444' : 'none',
                          borderRadius: '4px',
                          paddingLeft: '26px',
                          paddingRight: '32px',
                          color: 'white',
                          fontSize: '12px',
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
                          color: '#6b7280'
                        }}
                      >
                        {showConfirmPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                      </button>
                    </div>
                    {fieldErrors.confirmPassword && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        marginTop: '2px',
                        color: '#ef4444',
                        fontSize: '10px'
                      }}>
                        <AlertCircle size={10} />
                        <span>{fieldErrors.confirmPassword}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mostrar requisitos de contraseña */}
                {showPasswordRequirements && (
                  <div style={{ marginBottom: '8px' }}>
                    <PasswordRequirements password={formData.password} show={true} />
                  </div>
                )}
              </>
            )}

            {/* PASO 2: Información del Club y Rol */}
            {currentStep === 2 && (
              <>
                {/* Rol */}
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ color: '#9ca3af', fontSize: '11px', marginBottom: '2px', display: 'block' }}>
                    Tu Rol *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      height: '30px',
                      backgroundColor: '#2d2d3a',
                      border: 'none',
                      borderRadius: '4px',
                      paddingLeft: '8px',
                      paddingRight: '8px',
                      color: 'white',
                      fontSize: '12px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="caddie_master">Caddie Master</option>
                    <option value="profesor">Profesor de Tenis</option>
                  </select>
                </div>

                {/* Separador Club */}
                <div style={{ 
                  margin: '12px 0 8px 0', 
                  padding: '8px 0', 
                  borderTop: '1px solid #374151',
                  borderBottom: '1px solid #374151' 
                }}>
                  <h3 style={{ 
                    color: '#f3f4f6', 
                    fontSize: '13px', 
                    fontWeight: '600', 
                    margin: '0',
                    textAlign: 'center'
                  }}>
                    🏛️ Información del Club
                  </h3>
                  <p style={{ 
                    color: '#9ca3af', 
                    fontSize: '10px', 
                    margin: '4px 0 0 0',
                    textAlign: 'center'
                  }}>
                    Registra tu club para empezar a usar CaddieFlow
                  </p>
                </div>

                {/* Nombre del Club */}
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ color: '#9ca3af', fontSize: '11px', marginBottom: '2px', display: 'block' }}>
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
                      height: '30px',
                      backgroundColor: '#2d2d3a',
                      border: 'none',
                      borderRadius: '4px',
                      paddingLeft: '8px',
                      paddingRight: '8px',
                      color: 'white',
                      fontSize: '12px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Dirección y Ciudad */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ flex: 2 }}>
                    <label style={{ color: '#9ca3af', fontSize: '11px', marginBottom: '2px', display: 'block' }}>
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
                        height: '30px',
                        backgroundColor: '#2d2d3a',
                        border: 'none',
                        borderRadius: '4px',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                        color: 'white',
                        fontSize: '12px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ color: '#9ca3af', fontSize: '11px', marginBottom: '2px', display: 'block' }}>
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
                        height: '34px',
                        backgroundColor: '#2d2d3a',
                        border: 'none',
                        borderRadius: '5px',
                        paddingLeft: '10px',
                        paddingRight: '10px',
                        color: 'white',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* País y Canchas */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ color: '#9ca3af', fontSize: '11px', marginBottom: '2px', display: 'block' }}>
                      País *
                    </label>
                    <select
                      name="clubCountry"
                      value={formData.clubCountry}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        height: '30px',
                        backgroundColor: '#2d2d3a',
                        border: 'none',
                        borderRadius: '4px',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                        color: 'white',
                        fontSize: '12px',
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
                    <label style={{ color: '#9ca3af', fontSize: '11px', marginBottom: '2px', display: 'block' }}>
                      Nº Canchas *
                    </label>
                    <input
                      type="number"
                      name="totalCourts"
                      value={formData.totalCourts}
                      onChange={handleChange}
                      min="1"
                      max="999"
                      required
                      style={{
                        width: '100%',
                        height: '30px',
                        backgroundColor: '#2d2d3a',
                        border: 'none',
                        borderRadius: '4px',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                        color: 'white',
                        fontSize: '12px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* Email del Club */}
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ color: '#9ca3af', fontSize: '11px', marginBottom: '2px', display: 'block' }}>
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
                      height: '30px',
                      backgroundColor: '#2d2d3a',
                      border: 'none',
                      borderRadius: '4px',
                      paddingLeft: '8px',
                      paddingRight: '8px',
                      color: 'white',
                      fontSize: '12px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Teléfono del Club */}
                <PhoneInput
                  label="Teléfono del Club"
                  name="clubContactPhone"
                  value={formData.clubContactPhone}
                  onChange={(value) => setFormData(prev => ({ ...prev, clubContactPhone: value }))}
                  placeholder="Teléfono de contacto"
                  error={fieldErrors.clubContactPhone}
                  required
                  style={{ marginBottom: '12px' }}
                />
              </>
            )}

            {/* Botones de Navegación */}
            {currentStep === 1 && (
              <>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    height: '34px',
                    backgroundColor: '#4c6ef5',
                    border: 'none',
                    borderRadius: '5px',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  Siguiente →
                </button>

                {/* OAuth y Términos - Solo en Paso 1 */}
                <div style={{ marginTop: '8px' }}>
                  {/* Separador */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    margin: '12px 0', 
                    color: '#9ca3af', 
                    fontSize: '11px' 
                  }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#374151' }}></div>
                    <span style={{ margin: '0 10px' }}>o</span>
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
                      height: '34px',
                      backgroundColor: 'white',
                      border: '1px solid #d1d5db',
                      borderRadius: '5px',
                      color: '#374151',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      marginBottom: '12px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLButtonElement).style.backgroundColor = '#f9fafb';
                      (e.target as HTMLButtonElement).style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLButtonElement).style.backgroundColor = 'white';
                      (e.target as HTMLButtonElement).style.boxShadow = 'none';
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Registrarse con Google</span>
                  </button>

                  {/* Términos y Condiciones */}
                  <div style={{ 
                    textAlign: 'center', 
                    fontSize: '10px', 
                    color: '#9ca3af', 
                    lineHeight: '1.3' 
                  }}>
                    Al registrarte, aceptas nuestros{' '}
                    <button
                      type="button"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#60a5fa',
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
                        color: '#60a5fa',
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
              </>
            )}

            {currentStep === 2 && (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <button
                  type="button"
                  onClick={handlePrevStep}
                  style={{
                    flex: 1,
                    height: '34px',
                    backgroundColor: '#374151',
                    border: 'none',
                    borderRadius: '5px',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  ← Anterior
                </button>
                <LoadingButton
                  type="submit"
                  loading={loading}
                  style={{
                    flex: 2,
                    height: '34px',
                    backgroundColor: '#4c6ef5',
                    fontSize: '13px',
                    fontWeight: '600',
                  }}
                >
                  <UserPlus size={16} />
                  Crear Cuenta
                </LoadingButton>
              </div>
            )}
          </form>

          {/* Ya tienes cuenta - Siempre visible */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '12px', 
            fontSize: '12px', 
            color: '#9ca3af' 
          }}>
            ¿Ya tienes una cuenta?{' '}
            <Link 
              to="/login" 
              style={{ 
                color: '#60a5fa', 
                textDecoration: 'none', 
                fontWeight: '500' 
              }}
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
      
      {/* Pantalla de éxito */}
      {showSuccess && (
        <RegistrationSuccess 
          userName={formData.firstName}
          onComplete={handleSuccessComplete}
        />
      )}
    </div>
  );
};