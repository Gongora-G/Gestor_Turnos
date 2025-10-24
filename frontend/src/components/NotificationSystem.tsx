import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CheckCircle, XCircle, AlertCircle, X, Info } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

interface NotificationContextType {
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  hideNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 4000,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-hide after duration
    setTimeout(() => {
      hideNotification(id);
    }, newNotification.duration);
  };

  const hideNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <XCircle size={20} />;
      case 'warning':
        return <AlertCircle size={20} />;
      case 'info':
        return <Info size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const getStyles = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderColor: '#10b981',
          color: 'white'
        };
      case 'error':
        return {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          borderColor: '#ef4444',
          color: 'white'
        };
      case 'warning':
        return {
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          borderColor: '#f59e0b',
          color: 'white'
        };
      case 'info':
        return {
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          borderColor: '#3b82f6',
          color: 'white'
        };
      default:
        return {
          background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
          borderColor: '#6b7280',
          color: 'white'
        };
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      
      {/* Notification Container */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '400px'
      }}>
        {notifications.map((notification) => {
          const styles = getStyles(notification.type);
          return (
            <div
              key={notification.id}
              style={{
                ...styles,
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                border: `1px solid ${styles.borderColor}`,
                animation: 'slideInRight 0.3s ease-out',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => hideNotification(notification.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(-4px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  {getIcon(notification.type)}
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: notification.message ? '4px' : 0,
                    lineHeight: '1.3'
                  }}>
                    {notification.title}
                  </div>
                  {notification.message && (
                    <div style={{
                      fontSize: '13px',
                      opacity: 0.9,
                      lineHeight: '1.4'
                    }}>
                      {notification.message}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    hideNotification(notification.id);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </NotificationContext.Provider>
  );
};