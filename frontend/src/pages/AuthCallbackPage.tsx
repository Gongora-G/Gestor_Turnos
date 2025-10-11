import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts';

export const AuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');
      const action = searchParams.get('action') || 'login';
      
      console.log('🔍 AuthCallback - URL params:', {
        token: token ? `${token.substring(0, 20)}...` : null,
        error,
        action,
        fullURL: window.location.href
      });

      if (error) {
        console.error('❌ Error en autenticación:', error);
        navigate('/login?error=' + error);
        return;
      }

      if (token) {
        try {
          console.log('💾 Guardando token en localStorage...');
          // Guardar el token en localStorage
          localStorage.setItem('token', token);
          
          console.log('🔍 Validando token con backend...');
          // Validar el token y obtener información del usuario
          const response = await fetch('http://localhost:3002/auth/validate', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          console.log('📡 Response status:', response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log('📊 Response data:', data);
            
            if (data.valid && data.user) {
              console.log('✅ Token válido, actualizando usuario y navegando al dashboard...');
              setUser(data.user);
              
              // Determinar mensaje de éxito basado en el contexto
              const isNewUser = searchParams.get('isNewUser') === 'true';
              const successMessage = isNewUser ? 'registered' : 'logged_in';
              
              navigate(`/dashboard?success=${successMessage}`);
            } else {
              console.error('❌ Token inválido:', data);
              navigate('/login?error=invalid_token');
            }
          } else {
            const errorText = await response.text();
            console.error('❌ Error validando token:', response.status, errorText);
            navigate('/login?error=validation_error');
          }
        } catch (error) {
          console.error('❌ Error en callback:', error);
          navigate('/login?error=callback_error');
        }
      } else {
        console.error('❌ No se encontró token en URL');
        navigate('/login?error=no_token');
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate, setUser]);

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
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '4px solid #4c6ef5',
        borderTop: '4px solid transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{ 
        color: '#9ca3af', 
        fontSize: '16px',
        textAlign: 'center'
      }}>
        Procesando autenticación con Google...
      </p>
      <p style={{ 
        color: '#6b7280', 
        fontSize: '14px',
        textAlign: 'center'
      }}>
        {searchParams.get('action') === 'register' ? 'Completando registro...' : 'Iniciando sesión...'}
      </p>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};