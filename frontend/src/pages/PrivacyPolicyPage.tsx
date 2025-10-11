import React from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      backgroundColor: '#0f0f23',
      color: 'white',
      padding: '20px 20px 60px 20px',
      minHeight: '100vh',
      width: '100%',
      height: 'auto',
      overflow: 'visible'
    }}>
      {/* Header con botón de regreso */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        marginBottom: '32px'
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: '#4c6ef5',
            fontSize: '16px',
            cursor: 'pointer',
            marginBottom: '24px'
          }}
        >
          <ArrowLeft size={20} />
          Volver
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: '#10b981',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Lock size={24} color="white" />
          </div>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              margin: '0',
              color: 'white'
            }}>
              Política de Privacidad
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#9ca3af',
              margin: '4px 0 0 0'
            }}>
              Última actualización: {new Date().toLocaleDateString('es-ES')}
            </p>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#1e1e2e',
        borderRadius: '16px',
        padding: '32px',
        lineHeight: '1.6'
      }}>
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ color: '#10b981', fontSize: '24px', marginBottom: '16px' }}>
            1. Información que Recopilamos
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '16px' }}>
            Recopilamos información que usted nos proporciona directamente y automáticamente 
            cuando utiliza nuestro servicio:
          </p>
          
          <h3 style={{ color: '#f59e0b', fontSize: '18px', marginBottom: '12px' }}>
            Información Personal
          </h3>
          <ul style={{ color: '#d1d5db', paddingLeft: '24px', marginBottom: '16px' }}>
            <li>Nombre completo</li>
            <li>Dirección de correo electrónico</li>
            <li>Número de teléfono</li>
            <li>Información de perfil de Google (si usa autenticación OAuth)</li>
          </ul>

          <h3 style={{ color: '#f59e0b', fontSize: '18px', marginBottom: '12px' }}>
            Información de Uso
          </h3>
          <ul style={{ color: '#d1d5db', paddingLeft: '24px' }}>
            <li>Direcciones IP</li>
            <li>Información del navegador y dispositivo</li>
            <li>Páginas visitadas y tiempo de uso</li>
            <li>Fechas y horas de acceso</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ color: '#10b981', fontSize: '24px', marginBottom: '16px' }}>
            2. Cómo Utilizamos su Información
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '16px' }}>
            Utilizamos la información recopilada para:
          </p>
          <ul style={{ color: '#d1d5db', paddingLeft: '24px' }}>
            <li>Proporcionar y mantener nuestros servicios</li>
            <li>Procesar transacciones y gestionar citas</li>
            <li>Enviar notificaciones y comunicaciones importantes</li>
            <li>Mejorar la funcionalidad del servicio</li>
            <li>Detectar y prevenir fraudes o abusos</li>
            <li>Cumplir con obligaciones legales</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ color: '#10b981', fontSize: '24px', marginBottom: '16px' }}>
            3. Compartir Información
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '16px' }}>
            No vendemos, intercambiamos ni transferimos su información personal a terceros, 
            excepto en las siguientes circunstancias:
          </p>
          <ul style={{ color: '#d1d5db', paddingLeft: '24px' }}>
            <li>Con su consentimiento explícito</li>
            <li>Para cumplir con la ley o procesos legales</li>
            <li>Para proteger nuestros derechos y seguridad</li>
            <li>Con proveedores de servicios que nos ayudan a operar la plataforma</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ color: '#10b981', fontSize: '24px', marginBottom: '16px' }}>
            4. Seguridad de los Datos
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '16px' }}>
            Implementamos medidas de seguridad técnicas y organizativas para proteger 
            su información personal:
          </p>
          <ul style={{ color: '#d1d5db', paddingLeft: '24px' }}>
            <li>Cifrado de datos en tránsito y en reposo</li>
            <li>Autenticación de dos factores cuando sea aplicable</li>
            <li>Acceso restringido a datos personales</li>
            <li>Monitoreo regular de seguridad</li>
            <li>Copias de seguridad seguras</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ color: '#10b981', fontSize: '24px', marginBottom: '16px' }}>
            5. Sus Derechos
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '16px' }}>
            Bajo las leyes de protección de datos aplicables, usted tiene derecho a:
          </p>
          <ul style={{ color: '#d1d5db', paddingLeft: '24px' }}>
            <li><strong>Acceso:</strong> Solicitar una copia de sus datos personales</li>
            <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
            <li><strong>Eliminación:</strong> Solicitar la eliminación de sus datos</li>
            <li><strong>Portabilidad:</strong> Recibir sus datos en un formato estructurado</li>
            <li><strong>Objeción:</strong> Oponerse al procesamiento de sus datos</li>
            <li><strong>Limitación:</strong> Restringir el procesamiento en ciertas circunstancias</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ color: '#10b981', fontSize: '24px', marginBottom: '16px' }}>
            6. Cookies y Tecnologías Similares
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '16px' }}>
            Utilizamos cookies y tecnologías similares para:
          </p>
          <ul style={{ color: '#d1d5db', paddingLeft: '24px' }}>
            <li>Mantener su sesión activa</li>
            <li>Recordar sus preferencias</li>
            <li>Analizar el uso del servicio</li>
            <li>Mejorar la funcionalidad</li>
          </ul>
          <p style={{ color: '#d1d5db', marginTop: '16px' }}>
            Puede controlar las cookies a través de la configuración de su navegador.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ color: '#10b981', fontSize: '24px', marginBottom: '16px' }}>
            7. Retención de Datos
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '16px' }}>
            Conservamos su información personal solo durante el tiempo necesario para 
            cumplir con los propósitos descritos en esta política, a menos que la ley 
            requiera o permita un período de retención más largo.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ color: '#10b981', fontSize: '24px', marginBottom: '16px' }}>
            8. Cambios en esta Política
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '16px' }}>
            Podemos actualizar esta Política de Privacidad ocasionalmente. Le notificaremos 
            sobre cambios significativos publicando la nueva política en esta página y 
            actualizando la fecha de "última actualización".
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ color: '#10b981', fontSize: '24px', marginBottom: '16px' }}>
            9. Contacto
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '16px' }}>
            Si tiene preguntas sobre esta Política de Privacidad o desea ejercer sus derechos, 
            puede contactarnos:
          </p>
          <div style={{
            backgroundColor: '#2d2d3a',
            padding: '16px',
            borderRadius: '8px',
            color: '#d1d5db'
          }}>
            <p style={{ margin: '0' }}>
              <strong>Email:</strong> privacidad@gestorturnos.com<br />
              <strong>Teléfono:</strong> +57 (1) 234-5678<br />
              <strong>Dirección:</strong> Calle 100 #20-30, Bogotá, Colombia
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;