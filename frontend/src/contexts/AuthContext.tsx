import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AuthContextType, User, LoginCredentials, RegisterData } from '../types';
import { authService } from '../services';

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
    const storedToken = authService.getStoredToken();
    const storedUser = authService.getStoredUser();

    if (storedToken && storedUser) {
      try {
        // Validate token with server
        const validation = await authService.validateToken();
        if (validation.valid) {
          setToken(storedToken);
          setUser(validation.user);
        } else {
          // Invalid token, clear storage
          authService.logout();
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        authService.logout();
      }
    }

    setLoading(false);
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setLoading(true);
    try {
      // Bypass para desarrollo - usuario demo
      if (credentials.email === 'demo@gestor.com' && credentials.password === 'password123') {
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
        
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setToken(demoToken);
        setUser(demoUser);
        
        // Guardar en localStorage
        localStorage.setItem('auth_token', demoToken);
        localStorage.setItem('auth_user', JSON.stringify(demoUser));
        
        return;
      }
      
      // Intentar login real con el backend
      const response = await authService.login(credentials);
      setToken(response.access_token);
      setUser(response.user);
    } catch (error) {
      throw error;
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