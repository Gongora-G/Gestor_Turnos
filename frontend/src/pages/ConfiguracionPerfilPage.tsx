import React, { useState } from 'react';
import { AppLayout, GlobalFooter } from '../components';
import { useAuth } from '../contexts';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Palette, 
  Bell, 
  Save,
  Camera,
  Lock
} from 'lucide-react';

const ConfiguracionPerfilPage: React.FC = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'preferences' | 'notifications'>('personal');

  // Estados para los formularios
  const [personalData, setPersonalData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: ''
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // const [preferences, setPreferences] = useState({
  //   theme: 'dark',
  //   language: 'es',
  //   timezone: 'America/Bogota',
  //   dateFormat: 'DD/MM/YYYY'
  // });

  // const [notifications, setNotifications] = useState({
  //   emailNotifications: true,
  //   pushNotifications: true,
  //   turnoReminders: true,
  //   systemAlerts: true
  // });

  const handleSavePersonalData = async () => {
    setLoading(true);
    try {
      // Aquí irá la lógica para actualizar el perfil
      console.log('Guardando datos personales:', personalData);
      // Simulación de guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Actualizar el contexto de usuario
      if (setUser && user) {
        setUser({
          ...user,
          firstName: personalData.firstName,
          lastName: personalData.lastName,
          email: personalData.email
        });
      }
      
      alert('Datos personales actualizados correctamente');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      // Aquí irá la lógica para cambiar contraseña
      console.log('Cambiando contraseña');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSecurityData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      alert('Contraseña actualizada correctamente');
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      alert('Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Información Personal', icon: User },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'preferences', label: 'Preferencias', icon: Palette },
    { id: 'notifications', label: 'Notificaciones', icon: Bell }
  ];

  const renderPersonalTab = () => (
    <div style={{ padding: '24px' }}>
      <h3 style={{ 
        fontSize: '20px', 
        fontWeight: '600', 
        color: '#f1f5f9', 
        marginBottom: '24px' 
      }}>
        Información Personal
      </h3>

      {/* Avatar Section */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '24px', 
        marginBottom: '32px',
        padding: '24px',
        background: 'rgba(30, 41, 59, 0.5)',
        borderRadius: '12px',
        border: '1px solid #475569'
      }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '24px',
            fontWeight: '600'
          }}>
            {`${personalData.firstName.charAt(0)}${personalData.lastName.charAt(0)}`.toUpperCase()}
          </div>
          <button style={{
            position: 'absolute',
            bottom: '0',
            right: '0',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: '#3b82f6',
            border: '2px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <Camera size={14} color="white" />
          </button>
        </div>
        <div>
          <h4 style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
            Foto de Perfil
          </h4>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '12px' }}>
            Sube una imagen para personalizar tu perfil
          </p>
          <button style={{
            padding: '8px 16px',
            background: 'transparent',
            border: '1px solid #3b82f6',
            borderRadius: '8px',
            color: '#3b82f6',
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            Cambiar Foto
          </button>
        </div>
      </div>

      {/* Formulario */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div>
          <label style={{ 
            display: 'block', 
            color: '#f1f5f9', 
            fontSize: '14px', 
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            <User size={16} style={{ display: 'inline', marginRight: '8px' }} />
            Nombre
          </label>
          <input
            type="text"
            value={personalData.firstName}
            onChange={(e) => setPersonalData({...personalData, firstName: e.target.value})}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#f1f5f9',
              fontSize: '14px'
            }}
          />
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            color: '#f1f5f9', 
            fontSize: '14px', 
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            <User size={16} style={{ display: 'inline', marginRight: '8px' }} />
            Apellido
          </label>
          <input
            type="text"
            value={personalData.lastName}
            onChange={(e) => setPersonalData({...personalData, lastName: e.target.value})}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#f1f5f9',
              fontSize: '14px'
            }}
          />
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            color: '#f1f5f9', 
            fontSize: '14px', 
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            <Mail size={16} style={{ display: 'inline', marginRight: '8px' }} />
            Email
          </label>
          <input
            type="email"
            value={personalData.email}
            onChange={(e) => setPersonalData({...personalData, email: e.target.value})}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#f1f5f9',
              fontSize: '14px'
            }}
          />
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            color: '#f1f5f9', 
            fontSize: '14px', 
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            <Phone size={16} style={{ display: 'inline', marginRight: '8px' }} />
            Teléfono
          </label>
          <input
            type="tel"
            value={personalData.phone}
            onChange={(e) => setPersonalData({...personalData, phone: e.target.value})}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#f1f5f9',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      <div style={{ marginTop: '24px' }}>
        <label style={{ 
          display: 'block', 
          color: '#f1f5f9', 
          fontSize: '14px', 
          fontWeight: '500',
          marginBottom: '8px'
        }}>
          <MapPin size={16} style={{ display: 'inline', marginRight: '8px' }} />
          Dirección
        </label>
        <input
          type="text"
          value={personalData.address}
          onChange={(e) => setPersonalData({...personalData, address: e.target.value})}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid #475569',
            borderRadius: '8px',
            color: '#f1f5f9',
            fontSize: '14px'
          }}
        />
      </div>

      <button
        onClick={handleSavePersonalData}
        disabled={loading}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          border: 'none',
          borderRadius: '8px',
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginTop: '32px',
          opacity: loading ? 0.7 : 1
        }}
      >
        <Save size={16} />
        {loading ? 'Guardando...' : 'Guardar Cambios'}
      </button>
    </div>
  );

  const renderSecurityTab = () => (
    <div style={{ padding: '24px' }}>
      <h3 style={{ 
        fontSize: '20px', 
        fontWeight: '600', 
        color: '#f1f5f9', 
        marginBottom: '24px' 
      }}>
        Seguridad de la Cuenta
      </h3>

      <div style={{ maxWidth: '400px' }}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'block', 
            color: '#f1f5f9', 
            fontSize: '14px', 
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            <Lock size={16} style={{ display: 'inline', marginRight: '8px' }} />
            Contraseña Actual
          </label>
          <input
            type="password"
            value={securityData.currentPassword}
            onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#f1f5f9',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'block', 
            color: '#f1f5f9', 
            fontSize: '14px', 
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            <Lock size={16} style={{ display: 'inline', marginRight: '8px' }} />
            Nueva Contraseña
          </label>
          <input
            type="password"
            value={securityData.newPassword}
            onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#f1f5f9',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={{ 
            display: 'block', 
            color: '#f1f5f9', 
            fontSize: '14px', 
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            <Lock size={16} style={{ display: 'inline', marginRight: '8px' }} />
            Confirmar Nueva Contraseña
          </label>
          <input
            type="password"
            value={securityData.confirmPassword}
            onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#f1f5f9',
              fontSize: '14px'
            }}
          />
        </div>

        <button
          onClick={handleSavePassword}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            border: 'none',
            borderRadius: '8px',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          <Save size={16} />
          {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return renderPersonalTab();
      case 'security':
        return renderSecurityTab();
      case 'preferences':
        return (
          <div style={{ padding: '24px' }}>
            <h3 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: '600' }}>
              Preferencias del Sistema
            </h3>
            <p style={{ color: '#94a3b8', marginTop: '16px' }}>
              Esta sección estará disponible próximamente.
            </p>
          </div>
        );
      case 'notifications':
        return (
          <div style={{ padding: '24px' }}>
            <h3 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: '600' }}>
              Configuración de Notificaciones
            </h3>
            <p style={{ color: '#94a3b8', marginTop: '16px' }}>
              Esta sección estará disponible próximamente.
            </p>
          </div>
        );
      default:
        return renderPersonalTab();
    }
  };

  return (
    <AppLayout>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 24px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
          borderRadius: '16px',
          border: '1px solid #374151',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '24px',
            borderBottom: '1px solid #374151',
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
          }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>
              Configuración de Perfil
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#9ca3af',
              margin: '8px 0 0 0'
            }}>
              Administra tu información personal y configuraciones de cuenta
            </p>
          </div>

          <div style={{ display: 'flex' }}>
            {/* Sidebar de Tabs */}
            <div style={{
              width: '280px',
              background: 'rgba(30, 41, 59, 0.3)',
              borderRight: '1px solid #374151',
              padding: '24px'
            }}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                      marginBottom: '8px',
                      borderRadius: '12px',
                      border: 'none',
                      background: isActive 
                        ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
                        : 'transparent',
                      color: isActive ? '#ffffff' : '#cbd5e1',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontSize: '14px',
                      fontWeight: '500',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                        e.currentTarget.style.color = '#f1f5f9';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#cbd5e1';
                      }
                    }}
                  >
                    <Icon size={20} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Contenido */}
            <div style={{ flex: 1 }}>
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
      <GlobalFooter />
    </AppLayout>
  );
};

export default ConfiguracionPerfilPage;