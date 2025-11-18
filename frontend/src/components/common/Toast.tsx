import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  onClose: (id: string) => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ id, type, message, onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: '✅',
          gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderColor: '#10b981'
        };
      case 'error':
        return {
          icon: '❌',
          gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          borderColor: '#ef4444'
        };
      case 'warning':
        return {
          icon: '⚠️',
          gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          borderColor: '#f59e0b'
        };
      case 'info':
        return {
          icon: 'ℹ️',
          gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          borderColor: '#3b82f6'
        };
    }
  };

  const config = getConfig();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 20px',
        background: '#1f2937',
        border: `1px solid ${config.borderColor}`,
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
        minWidth: '320px',
        maxWidth: '500px',
        animation: 'slideIn 0.3s ease-out',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Barra de progreso */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '3px',
          background: config.gradient,
          animation: `progress ${duration}ms linear`,
          transformOrigin: 'left'
        }}
      />

      {/* Icono */}
      <div
        style={{
          fontSize: '24px',
          flexShrink: 0
        }}
      >
        {config.icon}
      </div>

      {/* Mensaje */}
      <div style={{ flex: 1 }}>
        <p
          style={{
            color: '#f9fafb',
            fontSize: '14px',
            fontWeight: '500',
            margin: 0,
            lineHeight: '1.5'
          }}
        >
          {message}
        </p>
      </div>

      {/* Botón cerrar */}
      <button
        onClick={() => onClose(id)}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#9ca3af',
          cursor: 'pointer',
          fontSize: '20px',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.2s',
          flexShrink: 0
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#f9fafb')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}
      >
        ×
      </button>

      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(400px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @keyframes progress {
            from {
              width: 100%;
            }
            to {
              width: 0%;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Toast;
