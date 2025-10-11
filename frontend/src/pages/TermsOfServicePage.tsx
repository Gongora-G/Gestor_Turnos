import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsOfServicePage: React.FC = () => {
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
            backgroundColor: '#4c6ef5',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={24} color="white" />
          </div>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              margin: '0',
              color: 'white'
            }}>
              Términos de Servicio
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
          <h2 style={{ color: '#4c6ef5', fontSize: '24px', marginBottom: '16px' }}>
            1. Aceptación de los Términos
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '16px' }}>
            Al acceder y utilizar el Sistema de Gestión de Turnos ("el Servicio"), usted acepta 
            cumplir con estos Términos de Servicio y todas las leyes y regulaciones aplicables. 
            Si no está de acuerdo con alguno de estos términos, no debe usar este servicio.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ color: '#4c6ef5', fontSize: '24px', marginBottom: '16px' }}>
            2. Descripción del Servicio
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '16px' }}>
            Nuestro servicio proporciona una plataforma para la gestión de turnos y citas, 
            permitiendo a los usuarios:
          </p>
          <ul style={{ color: '#d1d5db', paddingLeft: '24px' }}>
            <li>Programar y gestionar citas</li>
            <li>Administrar horarios de disponibilidad</li>
            <li>Gestionar información de clientes</li>
            <li>Generar reportes y estadísticas</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ color: '#4c6ef5', fontSize: '24px', marginBottom: '16px' }}>
            3. Registro de Cuenta
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '16px' }}>
            Para utilizar el servicio, debe crear una cuenta proporcionando información precisa 
            y completa. Usted es responsable de:
          </p>
          <ul style={{ color: '#d1d5db', paddingLeft: '24px' }}>
            <li>Mantener la confidencialidad de su contraseña</li>
            <li>Todas las actividades que ocurran bajo su cuenta</li>
            <li>Notificar inmediatamente cualquier uso no autorizado</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ color: '#4c6ef5', fontSize: '24px', marginBottom: '16px' }}>
            4. Uso Aceptable
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '16px' }}>
            Usted se compromete a utilizar el servicio únicamente para fines legítimos y de 
            acuerdo con estos términos. Está prohibido:
          </p>
          <ul style={{ color: '#d1d5db', paddingLeft: '24px' }}>
            <li>Usar el servicio para actividades ilegales o no autorizadas</li>
            <li>Intentar obtener acceso no autorizado a otros sistemas</li>
            <li>Interferir con el funcionamiento del servicio</li>
            <li>Transmitir virus, malware o código malicioso</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ color: '#4c6ef5', fontSize: '24px', marginBottom: '16px' }}>
            5. Privacidad y Protección de Datos
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '16px' }}>
            Su privacidad es importante para nosotros. El tratamiento de sus datos personales 
            se rige por nuestra Política de Privacidad, que forma parte integral de estos términos.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ color: '#4c6ef5', fontSize: '24px', marginBottom: '16px' }}>
            6. Limitación de Responsabilidad
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '16px' }}>
            El servicio se proporciona "tal como está" sin garantías de ningún tipo. 
            No seremos responsables por daños indirectos, incidentales o consecuentes 
            que resulten del uso del servicio.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ color: '#4c6ef5', fontSize: '24px', marginBottom: '16px' }}>
            7. Modificaciones
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '16px' }}>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. 
            Las modificaciones entrarán en vigor inmediatamente después de su publicación. 
            El uso continuado del servicio constituye la aceptación de los términos modificados.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ color: '#4c6ef5', fontSize: '24px', marginBottom: '16px' }}>
            8. Contacto
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '16px' }}>
            Si tiene preguntas sobre estos Términos de Servicio, puede contactarnos en:
          </p>
          <div style={{
            backgroundColor: '#2d2d3a',
            padding: '16px',
            borderRadius: '8px',
            color: '#d1d5db'
          }}>
            <p style={{ margin: '0' }}>
              <strong>Email:</strong> soporte@gestorturnos.com<br />
              <strong>Teléfono:</strong> +57 (1) 234-5678
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsOfServicePage;