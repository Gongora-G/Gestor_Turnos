import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts';
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import type { LoginCredentials, ApiError } from '../types';

export const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

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
      minHeight: '100vh',
      backgroundColor: '#0f0f23',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#1e1e2e',
        borderRadius: '12px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Título */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            color: 'white',
            fontSize: '24px',
            fontWeight: '600',
            margin: '0 0 8px 0'
          }}>
            Iniciar Sesión
          </h1>
          <p style={{
            color: '#9ca3af',
            fontSize: '14px',
            margin: '0'
          }}>
            ¡Bienvenido de nuevo!
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
            <a 
              href="#" 
              style={{
                color: '#4c6ef5',
                textDecoration: 'none'
              }}
            >
              Términos de Servicio
            </a>
            <span>•</span>
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
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};