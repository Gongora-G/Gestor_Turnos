import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AuthContextType, User, LoginCredentials, RegisterData } from '../types';
import { authService } from '../services/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    setLoading(true);
    
    // Intentar desde localStorage primero
    let storedToken = localStorage.getItem('auth_token');
    let storedUserStr = localStorage.getItem('auth_user');
    
    // Si no hay en localStorage, intentar desde sessionStorage
    if (!storedToken) {
      storedToken = sessionStorage.getItem('auth_token');
      storedUserStr = sessionStorage.getItem('auth_user');
    }
    
    let storedUser = null;
    if (storedUserStr) {
      try {
        storedUser = JSON.parse(storedUserStr);
      } catch (error) {
        console.error('Error parseando usuario:', error);
        // Limpiar datos corruptos
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_user');
      }
    }

    if (storedToken && storedUser) {
      // Verificar si el token es válido haciendo una petición de validación
      try {
        console.log('🔍 Validando token almacenado...');
        await authService.validateToken();
        console.log('✅ Token válido');
        setToken(storedToken);
        setUser(storedUser);
      } catch (error) {
        console.log('❌ Token inválido, limpiando autenticación');
        // Token inválido, limpiar todo
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_user');
        setToken(null);
        setUser(null);
      }
    }

    setLoading(false);
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setLoading(true);
    try {
      // Intentar login real con el backend SIEMPRE
      console.log('🎯 Intentando login con backend:', credentials.email);
      const response = await authService.login(credentials);
      console.log('✅ Login exitoso con backend:', response);
      
      // Guardar tanto en localStorage como en sessionStorage para asegurar persistencia
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      sessionStorage.setItem('auth_token', response.access_token);
      sessionStorage.setItem('auth_user', JSON.stringify(response.user));
      
      console.log('💾 Token guardado en localStorage:', response.access_token);
      console.log('💾 Verificando localStorage después de guardar:', localStorage.getItem('auth_token'));
      
      setToken(response.access_token);
      setUser(response.user);
      
    } catch (error) {
      console.error('❌ Error en login con backend:', error);
      
      // Solo como fallback para demo si el backend falla
      if (credentials.email === 'demo@gestor.com' && credentials.password === 'password123') {
        console.log('⚠️ Usando fallback demo debido a error del backend');
        
        const demoUser: User = {
          id: '1',
          firstName: 'Demo',
          lastName: 'User',
          email: 'demo@gestor.com',
          role: 'client' as any,
          status: 'active' as any,
          createdAt: new Date()
        };
        const demoToken = 'demo-token-12345';
        
        // Guardar en localStorage Y sessionStorage como respaldo
        localStorage.setItem('auth_token', demoToken);
        localStorage.setItem('auth_user', JSON.stringify(demoUser));
        sessionStorage.setItem('auth_token', demoToken);
        sessionStorage.setItem('auth_user', JSON.stringify(demoUser));
        
        setToken(demoToken);
        setUser(demoUser);
      } else {
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    setLoading(true);
    try {
      const response = await authService.register(data);
      setToken(response.access_token);
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    authService.logout();
    // También limpiar sessionStorage
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!(token && user);

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};