import React, { useEffect, useState } from 'react';
import { CheckCircle, Users, Trophy, Clock } from 'lucide-react';

interface RegistrationSuccessProps {
  userName: string;
  onComplete: () => void;
}

export const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({
  userName,
  onComplete,
}) => {
  const [step, setStep] = useState(0);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Animación por pasos
    const stepTimer = setTimeout(() => {
      if (step < 3) {
        setStep(step + 1);
      }
    }, 500);

    // Countdown después del paso 3
    let countdownTimer: NodeJS.Timeout;
    if (step === 3) {
      countdownTimer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearTimeout(stepTimer);
      if (countdownTimer) clearInterval(countdownTimer);
    };
  }, [step, onComplete]);

  const getCheckAnimation = () => ({
    transform: step >= 1 ? 'scale(1)' : 'scale(0)',
    opacity: step >= 1 ? 1 : 0,
    transition: 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  });

  const getTextAnimation = (stepNumber: number) => ({
    transform: step >= stepNumber ? 'translateY(0)' : 'translateY(20px)',
    opacity: step >= stepNumber ? 1 : 0,
    transition: `all 0.8s ease-out ${(stepNumber - 1) * 0.2}s`,
  });

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(15, 15, 35, 0.98)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}>
      <div style={{
        backgroundColor: '#1a1a2e',
        borderRadius: '20px',
        padding: '48px',
        textAlign: 'center',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
        border: '1px solid #2d2d3a',
      }}>
        
        {/* Icono de éxito animado */}
        <div style={{
          marginBottom: '32px',
          position: 'relative',
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...getCheckAnimation(),
          }}>
            <CheckCircle 
              size={60} 
              color="white"
              style={{
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
              }}
            />
          </div>
          
          {/* Partículas de celebración */}
          {step >= 2 && (
            <>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    top: '20px',
                    left: '50%',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#fbbf24',
                    transform: `rotate(${i * 60}deg) translate(60px) rotate(-${i * 60}deg)`,
                    animation: `sparkle 2s ease-out ${i * 0.1}s infinite`,
                  }}
                />
              ))}
            </>
          )}
        </div>

        {/* Título principal */}
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: 'white',
          marginBottom: '12px',
          ...getTextAnimation(2),
        }}>
          ¡Registro Exitoso! 🎉
        </h1>

        {/* Mensaje personalizado */}
        <p style={{
          fontSize: '18px',
          color: '#e5e7eb',
          marginBottom: '24px',
          lineHeight: '1.5',
          ...getTextAnimation(2),
        }}>
          ¡Bienvenido a <strong style={{ color: '#667eea' }}>CaddieFlow</strong>, {userName}!<br/>
          Tu cuenta ha sido creada correctamente.
        </p>

        {/* Stats preview */}
        {step >= 3 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginBottom: '32px',
            padding: '20px',
            backgroundColor: '#252545',
            borderRadius: '12px',
            ...getTextAnimation(3),
          }}>
            <div style={{ textAlign: 'center' }}>
              <Users size={24} color="#667eea" style={{ margin: '0 auto 8px' }} />
              <div style={{ color: '#9ca3af', fontSize: '12px' }}>Gestión</div>
              <div style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>Turnos</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Trophy size={24} color="#f59e0b" style={{ margin: '0 auto 8px' }} />
              <div style={{ color: '#9ca3af', fontSize: '12px' }}>Control</div>
              <div style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>Completo</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Clock size={24} color="#10b981" style={{ margin: '0 auto 8px' }} />
              <div style={{ color: '#9ca3af', fontSize: '12px' }}>Tiempo</div>
              <div style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>Real</div>
            </div>
          </div>
        )}

        {/* Contador y botón */}
        {step >= 3 && (
          <div style={getTextAnimation(3)}>
            <p style={{
              color: '#9ca3af',
              fontSize: '14px',
              marginBottom: '16px',
            }}>
              Redirigiendo al dashboard en <strong style={{ color: '#667eea' }}>{countdown}</strong> segundos...
            </p>
            
            <button
              onClick={onComplete}
              style={{
                backgroundColor: '#4c6ef5',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 32px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(76, 110, 245, 0.4)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#364fc7';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#4c6ef5';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Ir al Dashboard Ahora
            </button>
          </div>
        )}
      </div>

      {/* Inyectar animaciones CSS */}
      <style>{`
        @keyframes sparkle {
          0%, 100% { 
            opacity: 0; 
            transform: rotate(${Math.random() * 360}deg) translate(60px) rotate(-${Math.random() * 360}deg) scale(0);
          }
          50% { 
            opacity: 1; 
            transform: rotate(${Math.random() * 360}deg) translate(80px) rotate(-${Math.random() * 360}deg) scale(1);
          }
        }
      `}</style>
    </div>
  );
};