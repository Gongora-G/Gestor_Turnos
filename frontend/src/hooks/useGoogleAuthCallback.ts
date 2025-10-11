import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts';

export const useGoogleAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleGoogleCallback = () => {
      const token = searchParams.get('token');
      
      if (token) {
        // Guardar el token en localStorage
        localStorage.setItem('token', token);
        
        // Validar el token y obtener información del usuario
        fetch('http://localhost:3002/auth/validate', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(data => {
          if (data.valid && data.user) {
            setUser(data.user);
            navigate('/dashboard');
          } else {
            console.error('Token inválido');
            navigate('/login');
          }
        })
        .catch(error => {
          console.error('Error validando token:', error);
          navigate('/login');
        });
      }
    };

    // Solo ejecutar si estamos en la página de dashboard con un token
    if (window.location.pathname === '/dashboard' && searchParams.get('token')) {
      handleGoogleCallback();
    }
  }, [searchParams, navigate, setUser]);
};