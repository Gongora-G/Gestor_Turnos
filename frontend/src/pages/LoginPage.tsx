import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts';
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle, Info } from 'lucide-react';
import type { ApiError } from '../types';

interface LoginCredentials {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [searchParams] = useSearchParams();
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Manejar mensajes de URL desde OAuth
    const urlError = searchParams.get('error');
    const urlMessage = searchParams.get('message');
    const urlEmail = searchParams.get('email');
    
    if (urlError && urlMessage) {
      // Errores de OAuth
      setError(decodeURIComponent(urlMessage));
      
      // Limpiar URL después de mostrar el error
      window.history.replaceState({}, document.title, '/login');
    } else if (urlMessage === 'user_exists' && urlEmail) {
      // Usuario ya existe (mensaje específico)
      setMessage(`La cuenta ${urlEmail} ya existe. Por favor, inicia sesión con Google o usa tu contraseña.`);
      setCredentials(prev => ({ ...prev, email: decodeURIComponent(urlEmail) }));
    } else if (urlMessage) {
      // Otros mensajes informativos
      setMessage(decodeURIComponent(urlMessage));
      
      // Limpiar URL
      window.history.replaceState({}, document.title, '/login');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message || 'Error al iniciar sesión');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#0f0f23',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 0,
      padding: 0
    }}>
      <div style={{
        backgroundColor: '#1e1e2e',
        borderRadius: '12px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
        margin: '20px'
      }}>
        {/* Título */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎾</div>
          <h1 style={{
            color: 'white',
            fontSize: '24px',
            fontWeight: '600',
            margin: '0 0 8px 0'
          }}>
            CaddieFlow
          </h1>
          <p style={{
            color: '#9ca3af',
            fontSize: '14px',
            margin: '0'
          }}>
            Acceso para Caddie Masters y Profesores
          </p>
        </div>

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

        {/* Mensaje informativo */}
        {message && (
          <div style={{
            backgroundColor: '#1e3a8a',
            border: '1px solid #3b82f6',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Info size={16} color="#60a5fa" />
            <span style={{ color: '#93c5fd', fontSize: '14px' }}>{message}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {/* Campo Email */}
          <div style={{ marginBottom: '20px' }}>
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
                value={credentials.email}
                onChange={handleChange}
                placeholder="user@gestor.com"
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

          {/* Campo Contraseña */}
          <div style={{ marginBottom: '24px' }}>
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
                value={credentials.password}
                onChange={handleChange}
                placeholder="••••••••"
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

          {/* Botón */}
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
              opacity: loading ? 0.7 : 1
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
                <span>Iniciando sesión...</span>
              </>
            ) : (
              <>
                <LogIn size={16} />
                <span>Iniciar Sesión</span>
              </>
            )}
          </button>

          {/* Separador */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            margin: '20px 0 16px',
            color: '#9ca3af', 
            fontSize: '14px' 
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#374151' }}></div>
            <span style={{ margin: '0 16px' }}>o</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#374151' }}></div>
          </div>

          {/* Iniciar sesión con Google */}
          <button
            type="button"
            onClick={() => {
              // Marcar contexto de login y redirigir
              sessionStorage.setItem('oauth_context', 'login');
              window.location.href = 'http://localhost:3002/auth/google?context=login';
            }}
            style={{
              width: '100%',
              height: '44px',
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              color: '#374151',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#f9fafb';
              (e.target as HTMLButtonElement).style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = 'white';
              (e.target as HTMLButtonElement).style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Iniciar sesión con Google</span>
          </button>
        </form>

        {/* Enlaces */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <p style={{
            color: '#9ca3af',
            fontSize: '14px',
            marginBottom: '16px'
          }}>
            ¿No tienes una cuenta?{' '}
            <Link
              to="/register"
              style={{
                color: '#4c6ef5',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Regístrate aquí
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
            <span>•</span>
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
      </div>


    </div>
  );
};