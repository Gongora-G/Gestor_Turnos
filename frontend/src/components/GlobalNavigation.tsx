import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserProfileMenu from './UserProfileMenu';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Settings,
  ChevronRight 
} from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
  description?: string;
}

const GlobalNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Panel principal'
    },
    {
      path: '/turnos',
      label: 'Gestión de Turnos',
      icon: Calendar,
      description: 'Administrar reservas'
    },

    {
      path: '/reportes',
      label: 'Reportes',
      icon: FileText,
      description: 'Análisis y estadísticas'
    },
    {
      path: '/configuracion',
      label: 'Configuración',
      icon: Settings,
      description: 'Ajustes del sistema'
    }
  ];

  const handleNavigation = (path: string) => {
    console.log('🔄 Navegando a:', path);
    console.log('📍 Ubicación actual:', location.pathname);
    navigate(path);
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const getCurrentPageName = () => {
    const currentItem = navItems.find(item => isActive(item.path));
    return currentItem?.label || 'Sistema de Gestión de Turnos';
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      borderBottom: '1px solid #334155',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Breadcrumb y Título */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          color: '#94a3b8',
          fontSize: '14px'
        }}>
          <span>AdminFlow</span>
          <ChevronRight size={16} />
          <span style={{ color: '#f1f5f9', fontWeight: '500' }}>
            {getCurrentPageName()}
          </span>
        </div>
      </div>

      {/* Navegación Principal */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        background: 'rgba(30, 41, 59, 0.5)',
        padding: '8px',
        borderRadius: '12px',
        border: '1px solid #475569'
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                background: active 
                  ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
                  : 'transparent',
                color: active ? '#ffffff' : '#cbd5e1',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '14px',
                fontWeight: active ? '600' : '500',
                boxShadow: active ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                  e.currentTarget.style.color = '#f1f5f9';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#cbd5e1';
                }
              }}
              title={item.description}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Menú de Perfil de Usuario */}
      <UserProfileMenu />
    </div>
  );
};

export default GlobalNavigation;