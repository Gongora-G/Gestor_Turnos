import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import type { Toast as ToastType } from '../contexts/ToastContext';
import { useToast } from '../contexts/ToastContext';

interface ToastComponentProps {
  toast: ToastType;
}

const ToastComponent: React.FC<ToastComponentProps> = ({ toast }) => {
  const { removeToast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => removeToast(toast.id), 300);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-400" />;
      case 'error':
        return <XCircle size={20} className="text-red-400" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-400" />;
      case 'info':
        return <Info size={20} className="text-blue-400" />;
      default:
        return <Info size={20} className="text-blue-400" />;
    }
  };

  const getColors = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'from-green-900/90 to-green-800/90',
          border: 'border-green-500/30',
          text: 'text-green-100'
        };
      case 'error':
        return {
          bg: 'from-red-900/90 to-red-800/90',
          border: 'border-red-500/30',
          text: 'text-red-100'
        };
      case 'warning':
        return {
          bg: 'from-yellow-900/90 to-yellow-800/90',
          border: 'border-yellow-500/30',
          text: 'text-yellow-100'
        };
      case 'info':
        return {
          bg: 'from-blue-900/90 to-blue-800/90',
          border: 'border-blue-500/30',
          text: 'text-blue-100'
        };
      default:
        return {
          bg: 'from-gray-900/90 to-gray-800/90',
          border: 'border-gray-500/30',
          text: 'text-gray-100'
        };
    }
  };

  const colors = getColors();

  return (
    <div
      className={`
        relative max-w-sm w-full bg-gradient-to-r ${colors.bg} shadow-xl rounded-lg pointer-events-auto
        border ${colors.border} backdrop-blur-md transition-all duration-300 ease-out
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className={`text-sm font-semibold ${colors.text}`}>
              {toast.title}
            </p>
            {toast.message && (
              <p className={`mt-1 text-sm ${colors.text} opacity-90`}>
                {toast.message}
              </p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className={`inline-flex ${colors.text} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 rounded-md p-1`}
              onClick={handleClose}
            >
              <span className="sr-only">Cerrar</span>
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${colors.bg} rounded-b-lg overflow-hidden`}>
        <div 
          className="h-full bg-white/30 transition-all ease-linear shrink-animation"
          style={{
            animationDuration: `${toast.duration}ms`,
            width: '100%'
          }}
        />
      </div>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div 
      style={{ 
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        padding: '24px',
        pointerEvents: 'none',
        zIndex: 99999
      }}
    >
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '16px'
      }}>
        {toasts.map((toast) => (
          <ToastComponent key={toast.id} toast={toast} />
        ))}
      </div>
    </div>
  );
};