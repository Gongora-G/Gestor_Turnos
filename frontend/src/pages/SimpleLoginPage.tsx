import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts';

export const SimpleLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (error) {
      setError('Error de login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f0f23',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#1f2937',
        padding: '32px',
        borderRadius: '16px',
        border: '1px solid #374151',
        width: '400px',
        maxWidth: '90%'
      }}>
        <h1 style={{
          color: '#f9fafb',
          fontSize: '24px',
          textAlign: 'center',
          marginBottom: '24px'
        }}>
          🏆 Gestor de Turnos
        </h1>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ color: '#d1d5db', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #374151',
                backgroundColor: '#111827',
                color: '#f9fafb',
                fontSize: '14px'
              }}
              placeholder="demo@gestor.com"
              required
            />
          </div>
          
          <div>
            <label style={{ color: '#d1d5db', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #374151',
                backgroundColor: '#111827',
                color: '#f9fafb',
                fontSize: '14px'
              }}
              placeholder="password123"
              required
            />
          </div>
          
          {error && (
            <div style={{ color: '#ef4444', fontSize: '14px', textAlign: 'center' }}>
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        
        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(59, 130, 246, 0.2)'
        }}>
          <h3 style={{ color: '#93c5fd', fontSize: '14px', marginBottom: '8px' }}>
            Cuenta Demo:
          </h3>
          <p style={{ color: '#d1d5db', fontSize: '12px', margin: 0 }}>
            Email: demo@gestor.com<br />
            Password: password123
          </p>
        </div>
      </div>
    </div>
  );
};