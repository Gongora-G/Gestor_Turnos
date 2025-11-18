import React from 'react';

interface Props {
  title: string;
  message: string;
  itemName?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const DeleteConfirmModal: React.FC<Props> = ({ 
  title, 
  message, 
  itemName, 
  onConfirm, 
  onCancel, 
  loading = false 
}) => {
  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)'
      }}
      onClick={onCancel}
    >
      <div 
        style={{
          background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '480px',
          width: '90%',
          border: '1px solid #ef4444',
          boxShadow: '0 20px 60px rgba(239, 68, 68, 0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con icono de advertencia */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 16px',
            padding: '16px',
            background: 'rgba(239, 68, 68, 0.15)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="32" height="32" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h2 style={{ 
            color: '#f9fafb', 
            fontSize: '22px', 
            fontWeight: '700', 
            margin: 0,
            marginBottom: '8px'
          }}>
            {title}
          </h2>
          
          <p style={{ 
            color: '#9ca3af', 
            fontSize: '14px', 
            margin: 0,
            lineHeight: '1.6'
          }}>
            {message}
          </p>

          {itemName && (
            <div style={{
              marginTop: '16px',
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px'
            }}>
              <p style={{
                color: '#ef4444',
                fontSize: '14px',
                fontWeight: '600',
                margin: 0
              }}>
                "{itemName}"
              </p>
            </div>
          )}
        </div>

        {/* Advertencia */}
        <div style={{
          padding: '12px 16px',
          background: 'rgba(251, 191, 36, 0.1)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <p style={{
            color: '#fbbf24',
            fontSize: '13px',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Esta acción no se puede deshacer
          </p>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px',
              background: 'transparent',
              border: '1px solid #374151',
              borderRadius: '10px',
              color: '#d1d5db',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: loading ? 0.5 : 1
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.background = '#1f2937')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px',
              background: loading ? '#7f1d1d' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: loading ? 'none' : '0 4px 12px rgba(239, 68, 68, 0.3)'
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {loading ? '⏳ Eliminando...' : '🗑️ Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
