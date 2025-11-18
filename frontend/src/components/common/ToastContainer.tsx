import React from 'react';
import { useToast } from '../../contexts/ToastContext';
import Toast from './Toast';

const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        pointerEvents: 'none'
      }}
    >
      {toasts.map((toast) => (
        <div key={toast.id} style={{ pointerEvents: 'auto' }}>
          <Toast
            id={toast.id}
            type={toast.type}
            message={toast.title + (toast.message ? `: ${toast.message}` : '')}
            onClose={(id) => {
              const { removeToast } = useToast();
              removeToast(id);
            }}
            duration={toast.duration}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
