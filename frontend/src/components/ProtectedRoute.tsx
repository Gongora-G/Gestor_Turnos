import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts';
import { LoadingSpinner } from '../components/ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f0f23'
      }}>
        <div style={{ textAlign: 'center' }}>
          <LoadingSpinner size={32} color="#3b82f6" />
          <p style={{ 
            color: '#9ca3af', 
            marginTop: '16px',
            fontSize: '16px'
          }}>
            Cargando...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};