import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  Building, 
  Shield, 
  CreditCard,
  UserCheck,
  FileText,
  Clock,
  Users,
  Activity
} from 'lucide-react';
import { GlobalNavigation, TiposPersonalConfig } from '../components';
import RegistroJornadas from '../components/RegistroJornadas';
import ConfiguracionJornadasSimple from '../components/ConfiguracionJornadasSimple';
import { SociosPage } from './SociosPage';

type CategoriaConfig = 'general' | 'membresias' | 'canchas' | 'configuracion-jornadas' | 'registro-jornadas' | 'socios' | 'tipos-personal' | 'sistema';

const ConfiguracionPage: React.FC = () => {
  const [categoriaActiva, setCategoriaActiva] = useState<CategoriaConfig>('general');
  const navigate = useNavigate();

  const categorias = [
    { 
      id: 'general' as CategoriaConfig, 
      nombre: 'General', 
      icono: Settings, 
      color: '#3b82f6',
      descripcion: 'Configuración básica del club'
    },
    { 
      id: 'membresias' as CategoriaConfig, 
      nombre: 'Membresías', 
      icono: CreditCard, 
      color: '#8b5cf6',
      descripcion: 'Tipos y precios de membresías'
    },
    { 
      id: 'canchas' as CategoriaConfig, 
      nombre: 'Canchas', 
      icono: Building, 
      color: '#10b981',
      descripcion: 'Gestión de canchas disponibles'
    },
    { 
      id: 'configuracion-jornadas' as CategoriaConfig, 
      nombre: 'Configurar Jornadas', 
      icono: Clock, 
      color: '#8b5cf6',
      descripcion: 'Configurar horarios y esquemas de jornadas'
    },
    { 
      id: 'registro-jornadas' as CategoriaConfig, 
      nombre: 'Registro de Jornadas', 
      icono: FileText, 
      color: '#ef4444',
      descripcion: 'Consultar registros de jornadas'
    },
    { 
      id: 'socios' as CategoriaConfig, 
      nombre: 'Gestión de Socios', 
      icono: UserCheck, 
      color: '#06b6d4',
      descripcion: 'Administrar socios del club'
    },
    { 
      id: 'tipos-personal' as CategoriaConfig, 
      nombre: 'Tipos de Personal', 
      icono: Users, 
      color: '#ec4899',
      descripcion: 'Configurar tipos de personal del club'
    },
    { 
      id: 'sistema' as CategoriaConfig, 
      nombre: 'Sistema', 
      icono: Shield, 
      color: '#f59e0b',
      descripcion: 'Configuración avanzada del sistema'
    }
  ];

  const containerStyles = {
    minHeight: '100vh',
    backgroundColor: '#0f0f23',
    color: '#fff',
    fontFamily: 'Inter, system-ui, sans-serif'
  };

  const sidebarStyles = {
    minWidth: '300px',
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    padding: '24px',
    borderRight: '1px solid #374151'
  };

  const contentStyles = {
    flex: 1,
    padding: '32px',
    overflowY: 'auto' as const
  };

  const cardStyles = {
    background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #374151',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    marginBottom: '24px'
  };

  const renderConfiguracionGeneral = () => (
    <div style={cardStyles}>
      <h3 style={{ color: '#f9fafb', fontSize: '20px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Settings size={24} style={{ color: '#3b82f6' }} />
        Configuración General
      </h3>
      <p style={{ color: '#9ca3af', textAlign: 'center', padding: '32px' }}>
        Configuración general del club - Próximamente
      </p>
    </div>
  );

  const renderMembresias = () => (
    <div style={cardStyles}>
      <h3 style={{ color: '#f9fafb', fontSize: '20px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <CreditCard size={24} style={{ color: '#8b5cf6' }} />
        Gestión de Membresías
      </h3>
      <p style={{ color: '#9ca3af', textAlign: 'center', padding: '32px' }}>
        Gestión de tipos de membresías - Próximamente
      </p>
    </div>
  );

  const renderCanchas = () => (
    <div style={cardStyles}>
      <h3 style={{ color: '#f9fafb', fontSize: '20px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Building size={24} style={{ color: '#10b981' }} />
        Gestión de Canchas
      </h3>
      <p style={{ color: '#9ca3af', textAlign: 'center', padding: '32px' }}>
        Gestión de canchas disponibles - Próximamente
      </p>
    </div>
  );

  const renderRegistroJornadas = () => (
    <div style={{ backgroundColor: 'transparent', padding: 0, margin: 0 }}>
      <RegistroJornadas />
    </div>
  );

  const renderConfiguracionJornadas = () => (
    <div style={{ backgroundColor: 'transparent', padding: 0, margin: 0 }}>
      <ConfiguracionJornadasSimple />
    </div>
  );

  const renderSistema = () => (
    <div style={cardStyles}>
      <h3 style={{ color: '#f9fafb', fontSize: '20px', fontWeight: '600', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Shield size={24} style={{ color: '#f59e0b' }} />
        Configuración del Sistema
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {/* Card: Estados del Personal */}
        <button
          onClick={() => navigate('/configuracion/estados-personal')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '20px',
            background: 'linear-gradient(135deg, #8b5cf620 0%, #8b5cf610 100%)',
            border: '1px solid #8b5cf640',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            textAlign: 'left',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.borderColor = '#8b5cf680';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = '#8b5cf640';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ padding: '8px', backgroundColor: '#8b5cf620', borderRadius: '8px' }}>
              <Activity size={24} style={{ color: '#8b5cf6' }} />
            </div>
            <h4 style={{ color: '#f9fafb', fontSize: '16px', fontWeight: '600', margin: 0 }}>
              Estados del Personal
            </h4>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
            Gestiona y crea estados personalizados para el personal (Disponible, Ocupado, etc.)
          </p>
        </button>

        {/* Placeholder para futuras configuraciones */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '20px',
            background: 'linear-gradient(135deg, #6b728020 0%, #6b728010 100%)',
            border: '1px solid #6b728030',
            borderRadius: '12px',
            opacity: 0.6,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ padding: '8px', backgroundColor: '#6b728020', borderRadius: '8px' }}>
              <Shield size={24} style={{ color: '#6b7280' }} />
            </div>
            <h4 style={{ color: '#f9fafb', fontSize: '16px', fontWeight: '600', margin: 0 }}>
              Más Configuraciones
            </h4>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
            Próximamente más opciones de configuración del sistema
          </p>
        </div>
      </div>
    </div>
  );

  const renderSocios = () => {
    return (
      <div style={{ backgroundColor: 'transparent', padding: 0, margin: 0 }}>
        <SociosPage isSubModule={true} />
      </div>
    );
  };

  const renderTiposPersonal = () => {
    return (
      <div style={{ backgroundColor: 'transparent', padding: 0, margin: 0 }}>
        <TiposPersonalConfig />
      </div>
    );
  };

  const renderContenido = () => {
    switch (categoriaActiva) {
      case 'general':
        return renderConfiguracionGeneral();
      case 'membresias':
        return renderMembresias();
      case 'canchas':
        return renderCanchas();
      case 'configuracion-jornadas':
        return renderConfiguracionJornadas();
      case 'registro-jornadas':
        return renderRegistroJornadas();
      case 'socios':
        return renderSocios();
      case 'tipos-personal':
        return renderTiposPersonal();
      case 'sistema':
        return renderSistema();
      default:
        return renderConfiguracionGeneral();
    }
  };

  return (
    <div style={containerStyles}>
      <GlobalNavigation />
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
        <div style={sidebarStyles}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ color: '#f9fafb', fontSize: '20px', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={24} style={{ color: '#3b82f6' }} />
              Configuración
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
              Gestiona todos los aspectos de tu club
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {categorias.map((categoria) => {
              const Icon = categoria.icono;
              const isActive = categoriaActiva === categoria.id;
              return (
                <button
                  key={categoria.id}
                  onClick={() => setCategoriaActiva(categoria.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    background: isActive ? `linear-gradient(135deg, ${categoria.color}20 0%, ${categoria.color}10 100%)` : 'transparent',
                    border: isActive ? `1px solid ${categoria.color}40` : '1px solid transparent',
                    borderRadius: '12px',
                    color: isActive ? categoria.color : '#9ca3af',
                    fontSize: '14px',
                    fontWeight: isActive ? '600' : '500',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    width: '100%'
                  }}
                >
                  <Icon size={20} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: isActive ? '600' : '500' }}>
                      {categoria.nombre}
                    </div>
                    <div style={{ fontSize: '12px', color: isActive ? `${categoria.color}80` : '#6b7280', marginTop: '2px' }}>
                      {categoria.descripcion}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <div style={contentStyles}>
          {renderContenido()}
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionPage;
