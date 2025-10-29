import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts';
import { 
  Building, 
  Clock, 
  Users, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Shield, 
  FileText, 
  HelpCircle,
  Activity,
  Server,
  Database,
  Wifi,
  Heart
} from 'lucide-react';


const GlobalFooter: React.FC = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [uptime] = useState('2d 14h 32m');
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline'>('online');

  // Actualizar la hora cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simular estado de conexión
  useEffect(() => {
    const checkConnection = () => {
      setConnectionStatus(navigator.onLine ? 'online' : 'offline');
    };

    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);
    
    return () => {
      window.removeEventListener('online', checkConnection);
      window.removeEventListener('offline', checkConnection);
    };
  }, []);

  // Datos mock para las estadísticas (en el futuro se conectarán con APIs reales)
  const stats = {
    activeUsers: 15,
    todayTurnos: 23,
    activeCourts: 8,
    totalCourts: 12
  };

  const clubInfo = {
    name: 'Club de Tenis Los Pinos',
    address: 'Av. El Poblado #123, Medellín',
    phone: '+57 (4) 123-4567',
    email: 'info@clubpinos.com'
  };

  const systemInfo = {
    version: '1.0.0',
    buildDate: '2025-10-24',
    environment: 'production'
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-CO', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      borderTop: '1px solid #334155',
      marginTop: 'auto',
      color: '#f1f5f9'
    }}>
      {/* Contenido Principal del Footer */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 24px 24px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px',
          marginBottom: '32px'
        }}>
          
          {/* Columna 1 - Información del Sistema */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#f1f5f9',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Activity size={20} style={{ color: '#3b82f6' }} />
              TennisFlow System
            </h3>
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                fontSize: '14px',
                color: '#94a3b8'
              }}>
                <Server size={16} />
                <span>Versión {systemInfo.version}</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                fontSize: '14px',
                color: '#94a3b8'
              }}>
                <Database size={16} />
                <span>Uptime: {uptime}</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                fontSize: '14px',
                color: connectionStatus === 'online' ? '#10b981' : '#ef4444'
              }}>
                <Wifi size={16} />
                <span>Estado: {connectionStatus === 'online' ? 'Conectado' : 'Desconectado'}</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: '#94a3b8'
              }}>
                <Clock size={16} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>{formatTime(currentTime)}</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    {formatDate(currentTime)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Columna 2 - Información del Club */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#f1f5f9',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Building size={20} style={{ color: '#8b5cf6' }} />
              {clubInfo.name}
            </h3>
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                marginBottom: '8px',
                fontSize: '14px',
                color: '#94a3b8'
              }}>
                <MapPin size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{clubInfo.address}</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                fontSize: '14px',
                color: '#94a3b8'
              }}>
                <Phone size={16} />
                <span>{clubInfo.phone}</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: '#94a3b8'
              }}>
                <Mail size={16} />
                <span>{clubInfo.email}</span>
              </div>
            </div>
          </div>

          {/* Columna 3 - Enlaces Útiles */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#f1f5f9',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Globe size={20} style={{ color: '#10b981' }} />
              Enlaces Útiles
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { icon: HelpCircle, label: 'Centro de Ayuda', href: '/ayuda' },
                { icon: FileText, label: 'Documentación', href: '/docs' },
                { icon: Shield, label: 'Términos de Servicio', href: '/terms-of-service' },
                { icon: Shield, label: 'Política de Privacidad', href: '/privacy-policy' }
              ].map((link, index) => {
                const Icon = link.icon;
                return (
                  <a
                    key={index}
                    href={link.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      color: '#94a3b8',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                      padding: '4px 0'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#3b82f6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#94a3b8';
                    }}
                  >
                    <Icon size={16} />
                    <span>{link.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Columna 4 - Estadísticas en Tiempo Real */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#f1f5f9',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Calendar size={20} style={{ color: '#f59e0b' }} />
              Estadísticas del Día
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '8px',
                padding: '12px',
                textAlign: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginBottom: '4px'
                }}>
                  <Users size={16} style={{ color: '#3b82f6' }} />
                  <span style={{ fontSize: '18px', fontWeight: '600', color: '#3b82f6' }}>
                    {stats.activeUsers}
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Usuarios Activos</span>
              </div>

              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '8px',
                padding: '12px',
                textAlign: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginBottom: '4px'
                }}>
                  <Calendar size={16} style={{ color: '#10b981' }} />
                  <span style={{ fontSize: '18px', fontWeight: '600', color: '#10b981' }}>
                    {stats.todayTurnos}
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Turnos Hoy</span>
              </div>

              <div style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '8px',
                padding: '12px',
                textAlign: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginBottom: '4px'
                }}>
                  <Activity size={16} style={{ color: '#8b5cf6' }} />
                  <span style={{ fontSize: '18px', fontWeight: '600', color: '#8b5cf6' }}>
                    {stats.activeCourts}
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Canchas Activas</span>
              </div>

              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: '8px',
                padding: '12px',
                textAlign: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginBottom: '4px'
                }}>
                  <Building size={16} style={{ color: '#f59e0b' }} />
                  <span style={{ fontSize: '18px', fontWeight: '600', color: '#f59e0b' }}>
                    {stats.totalCourts}
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Total Canchas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Separador */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, #334155 50%, transparent 100%)',
          margin: '24px 0'
        }} />

        {/* Footer Bottom */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '14px',
          color: '#64748b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>© 2025 TennisFlow</span>
            <span>•</span>
            <span>Desarrollado con</span>
            <Heart size={14} style={{ color: '#ef4444' }} />
            <span>para clubes deportivos</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Usuario: {user?.firstName} {user?.lastName}</span>
            <span>•</span>
            <span>Build: {systemInfo.buildDate}</span>
            <span>•</span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              background: connectionStatus === 'online' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              borderRadius: '12px',
              fontSize: '12px',
              color: connectionStatus === 'online' ? '#10b981' : '#ef4444'
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: connectionStatus === 'online' ? '#10b981' : '#ef4444'
              }} />
              <span>{connectionStatus === 'online' ? 'En línea' : 'Sin conexión'}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;