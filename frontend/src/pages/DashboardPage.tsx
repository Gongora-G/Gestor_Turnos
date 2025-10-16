import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts';
import { useSearchParams } from 'react-router-dom';
// Los componentes ahora usan CSS moderno directo
import { formatDateTime, getInitials } from '../utils';
import type { UserRole } from '../types';
import { 
  Calendar, 
  Clock, 
  Users, 
  Settings, 
  BarChart3, 
  Bell,
  LogOut,
  Plus,
  Search,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    const success = searchParams.get('success');
    const oauthResult = searchParams.get('oauth_result');
    const message = searchParams.get('message');
    
    if (success === 'true' && oauthResult) {
      if (oauthResult === 'register') {
        setSuccessMessage(message || '¡Registro con Google exitoso! Bienvenido a Gestor de Turnos.');
      } else if (oauthResult === 'login') {
        setSuccessMessage(message || '¡Inicio de sesión con Google exitoso!');
      }
    } else if (success === 'registered') {
      setSuccessMessage('¡Registro completado exitosamente! Bienvenido a Gestor de Turnos.');
    } else if (success === 'logged_in') {
      setSuccessMessage('¡Has iniciado sesión correctamente!');
    }
    
    // Limpiar los parámetros de la URL
    if (success || oauthResult) {
      setSearchParams({});
      // Auto-ocultar el mensaje después de 5 segundos
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  }, [searchParams, setSearchParams]);

  if (!user) {
    return null;
  }

  const getRoleDisplayName = (role: UserRole): string => {
    const roleNames: Record<UserRole, string> = {
      'admin': 'Administrador',
      'coordinator': 'Coordinador',
      'employee': 'Empleado',
      'client': 'Cliente',
    };
    return roleNames[role] || role;
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)' }}>
      {/* Header */}
      <header className="modern-header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-medium">
                <span className="text-white text-lg">🎾</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-900">CaddieFlow</h1>
                <p className="text-xs text-neutral-500">
                  {user?.role === 'caddie_master' ? 'Panel Caddie Master' : 'Panel Profesor'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-white/60 rounded-xl transition-all duration-200">
                <Search className="h-5 w-5" />
              </button>
              <button className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-white/60 rounded-xl transition-all duration-200 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-error-500 rounded-full animate-pulse"></span>
              </button>
              
              <div className="flex items-center space-x-3 pl-4 border-l border-neutral-200">
                <div className="text-right">
                  <div className="text-sm font-semibold text-neutral-900">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-xs text-neutral-500 flex items-center justify-end">
                    <span className="w-2 h-2 bg-success-500 rounded-full mr-1"></span>
                    {user.email}
                  </div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-medium">
                  <span className="text-white text-sm font-semibold">
                    {getInitials(user.firstName, user.lastName)}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl transition-all duration-200 hover:bg-red-50"
                  style={{ color: '#6b7280' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#dc2626';
                    e.currentTarget.style.backgroundColor = '#fef2f2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#6b7280';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Success Message */}
      {successMessage && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          backgroundColor: '#10b981',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          maxWidth: '400px',
          animation: 'slideInRight 0.3s ease-out'
        }}>
          <CheckCircle size={20} />
          <span style={{ fontSize: '14px', fontWeight: '500' }}>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage('')}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              marginLeft: '8px'
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                ¡Bienvenido, {user.firstName}!
              </h2>
              <p className="text-neutral-600 text-lg">
                Este es tu panel de control del sistema de gestión de turnos.
              </p>
            </div>
            <button className="modern-button modern-button-primary flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Turno
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="modern-stats-card" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', borderLeftColor: 'var(--color-primary)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: '#1d4ed8' }}>Caddies Registrados</p>
                <p className="text-2xl font-bold" style={{ color: '#1e3a8a' }}>18/30</p>
                <p className="text-xs flex items-center mt-1" style={{ color: '#3730a3' }}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  83% puntualidad
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="modern-stats-card" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', borderLeftColor: 'var(--color-success)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: '#065f46' }}>Completados</p>
                <p className="text-2xl font-bold" style={{ color: '#064e3b' }}>8</p>
                <p className="text-xs flex items-center mt-1" style={{ color: '#047857' }}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  66% tasa éxito
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-success)' }}>
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="modern-stats-card" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', borderLeftColor: 'var(--color-warning)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: '#92400e' }}>Pendientes</p>
                <p className="text-2xl font-bold" style={{ color: '#78350f' }}>4</p>
                <p className="text-xs flex items-center mt-1" style={{ color: '#a16207' }}>
                  <Clock className="h-3 w-3 mr-1" />
                  En progreso
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-warning)' }}>
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="modern-stats-card" style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', borderLeftColor: 'var(--color-neutral)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: '#374151' }}>Usuarios</p>
                <p className="text-2xl font-bold" style={{ color: '#1f2937' }}>156</p>
                <p className="text-xs flex items-center mt-1" style={{ color: '#4b5563' }}>
                  <Users className="h-3 w-3 mr-1" />
                  Total activos
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-neutral)' }}>
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <div className="modern-card p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-medium">
                <span className="text-white text-xl font-bold">
                  {getInitials(user.firstName, user.lastName)}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900">Mi Perfil</h3>
                <p className="text-neutral-500">Información personal</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-700">NOMBRE COMPLETO</label>
                <p className="text-neutral-900 font-medium mt-1">
                  {user.firstName} {user.lastName}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-neutral-700">CORREO ELECTRÓNICO</label>
                <p className="text-neutral-900 font-medium mt-1">{user.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-neutral-700">ROL</label>
                <div className="mt-1">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 border border-primary-200">
                    {getRoleDisplayName(user.role)}
                  </span>
                </div>
              </div>
              
              {user.phone && (
                <div>
                  <label className="text-sm font-medium text-neutral-700">TELÉFONO</label>
                  <p className="text-neutral-900 font-medium mt-1">{user.phone}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-neutral-700">ÚLTIMO ACCESO</label>
                <p className="text-neutral-900 font-medium mt-1">
                  {formatDateTime(new Date())}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t" style={{ borderColor: '#e5e7eb' }}>
              <button className="modern-button modern-button-outline w-full flex items-center justify-center gap-2">
                <Settings className="h-4 w-4" />
                Editar Perfil
              </button>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="modern-card p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900">Acciones Rápidas</h3>
                <p className="text-neutral-500 text-sm">Operaciones frecuentes</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <button className="modern-button modern-button-primary w-full flex items-center justify-start gap-3">
                <Plus className="h-4 w-4" />
                <span className="text-sm font-medium">Solicitar Turno</span>
              </button>
              
              <button className="modern-button modern-button-outline w-full flex items-center justify-start gap-3">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">Ver Mis Turnos</span>
              </button>
              
              <button className="modern-button modern-button-outline w-full flex items-center justify-start gap-3">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">Gestionar Usuarios</span>
              </button>

              <button className="modern-button modern-button-outline w-full flex items-center justify-start gap-3">
                <BarChart3 className="h-4 w-4" />
                <span className="text-sm font-medium">Ver Reportes</span>
              </button>
            </div>
          </div>

          {/* System Status Card */}
          <div className="modern-card p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-success-600 rounded-2xl flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900">Estado del Sistema</h3>
                <p className="text-neutral-500 text-sm">Monitoreo en tiempo real</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-success-50 rounded-xl border border-success-200">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-sm font-semibold text-success-900">API Backend</p>
                    <p className="text-xs text-success-700">Conectado y funcionando</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-success-700 bg-success-200 px-2 py-1 rounded-full">
                  ACTIVO
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-success-50 rounded-xl border border-success-200">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-sm font-semibold text-success-900">Base de Datos</p>
                    <p className="text-xs text-success-700">PostgreSQL operativo</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-success-700 bg-success-200 px-2 py-1 rounded-full">
                  ACTIVO
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-primary-50 rounded-xl border border-primary-200">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-sm font-semibold text-primary-900">Sesión Activa</p>
                    <p className="text-xs text-primary-700">Token JWT válido</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-primary-700 bg-primary-200 px-2 py-1 rounded-full">
                  VÁLIDO
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="modern-card">
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Funcionalidades en Desarrollo
            </h3>
            <p className="text-gray-500 mb-6">
              Estamos trabajando en las siguientes características:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>📅 Sistema de calendarios</div>
              <div>🎫 Gestión avanzada de turnos</div>
              <div>📊 Reportes y estadísticas</div>
              <div>🔔 Notificaciones en tiempo real</div>
              <div>👥 Gestión de usuarios</div>
              <div>⚙️ Configuraciones del sistema</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};