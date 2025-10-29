import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts';
import { 
  Settings, 
  Bell, 
  Moon, 
  Sun, 
  LogOut, 
  Edit, 
  Shield,
  Activity,
  ChevronDown
} from 'lucide-react';

const UserProfileMenu: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('dark');
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generar iniciales del usuario
  const getInitials = () => {
    if (!user) return 'U';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Obtener nombre completo
  const getFullName = () => {
    if (!user) return 'Usuario';
    return `${user.firstName || ''} ${user.lastName || ''}`.trim();
  };

  // Obtener rol traducido
  const getRoleLabel = () => {
    const roleLabels: Record<string, string> = {
      'caddie_master': 'Caddie Master',
      'profesor': 'Profesor',
      'caddie': 'Caddie',
      'boleador': 'Boleador',
      'admin': 'Administrador',
      'super_admin': 'Super Admin',
    };
    return roleLabels[user?.role || ''] || user?.role || 'Usuario';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const menuItems = [
    {
      icon: Edit,
      label: 'Editar Perfil',
      action: () => {
        navigate('/perfil');
        setIsOpen(false);
      }
    },
    {
      icon: Settings,
      label: 'Configuración',
      action: () => {
        navigate('/configuracion-perfil');
        setIsOpen(false);
      }
    },
    {
      icon: Bell,
      label: 'Notificaciones',
      action: () => {
        navigate('/notificaciones');
        setIsOpen(false);
      }
    },
    {
      icon: Shield,
      label: 'Seguridad',
      action: () => {
        navigate('/seguridad');
        setIsOpen(false);
      }
    },
    {
      icon: Activity,
      label: 'Mi Actividad',
      action: () => {
        navigate('/mi-actividad');
        setIsOpen(false);
      }
    }
  ];

  const toggleTheme = () => {
    const themes: ('light' | 'dark' | 'auto')[] = ['light', 'dark', 'auto'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
    // Aquí podrías agregar lógica para aplicar el tema globalmente
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return Sun;
      case 'dark': return Moon;
      case 'auto': return Settings;
      default: return Moon;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light': return 'Tema Claro';
      case 'dark': return 'Tema Oscuro';
      case 'auto': return 'Tema Auto';
      default: return 'Tema Oscuro';
    }
  };

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      {/* Botón del Perfil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 16px',
          borderRadius: '12px',
          border: '1px solid #475569',
          background: isOpen 
            ? 'rgba(59, 130, 246, 0.1)' 
            : 'rgba(30, 41, 59, 0.5)',
          color: '#f1f5f9',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontSize: '14px',
          fontWeight: '500'
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
            e.currentTarget.style.borderColor = '#3b82f6';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.background = 'rgba(30, 41, 59, 0.5)';
            e.currentTarget.style.borderColor = '#475569';
          }
        }}
      >
        {/* Avatar */}
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          {getInitials()}
        </div>

        {/* Información del Usuario */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'flex-start',
          minWidth: '120px'
        }}>
          <span style={{ 
            fontSize: '14px', 
            fontWeight: '600',
            color: '#f1f5f9'
          }}>
            {getFullName()}
          </span>
          <span style={{ 
            fontSize: '12px', 
            color: '#94a3b8',
            fontWeight: '400'
          }}>
            {getRoleLabel()}
          </span>
        </div>

        {/* Icono de dropdown */}
        <ChevronDown 
          size={16} 
          style={{ 
            color: '#94a3b8',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }} 
        />
      </button>

      {/* Menú Dropdown */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: '0',
          marginTop: '8px',
          width: '280px',
          background: '#1e293b',
          border: '1px solid #475569',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          {/* Header del menú */}
          <div style={{
            padding: '16px',
            borderBottom: '1px solid #475569',
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                {getInitials()}
              </div>
              <div>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: '600',
                  color: '#f1f5f9',
                  marginBottom: '2px'
                }}>
                  {getFullName()}
                </div>
                <div style={{ 
                  fontSize: '13px', 
                  color: '#94a3b8'
                }}>
                  {user?.email}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#60a5fa',
                  fontWeight: '500'
                }}>
                  {getRoleLabel()}
                </div>
              </div>
            </div>
          </div>

          {/* Opciones del menú */}
          <div style={{ padding: '8px' }}>
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={item.action}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'transparent',
                    color: '#cbd5e1',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '14px',
                    fontWeight: '500',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                    e.currentTarget.style.color = '#f1f5f9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#cbd5e1';
                  }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Selector de tema */}
            <button
              onClick={toggleTheme}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                color: '#cbd5e1',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '14px',
                fontWeight: '500',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                e.currentTarget.style.color = '#f1f5f9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#cbd5e1';
              }}
            >
              {React.createElement(getThemeIcon(), { size: 18 })}
              <span>{getThemeLabel()}</span>
            </button>

            {/* Separador */}
            <div style={{
              height: '1px',
              background: '#475569',
              margin: '8px 16px'
            }} />

            {/* Cerrar sesión */}
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                color: '#ef4444',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '14px',
                fontWeight: '500',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                e.currentTarget.style.color = '#f87171';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#ef4444';
              }}
            >
              <LogOut size={18} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileMenu;