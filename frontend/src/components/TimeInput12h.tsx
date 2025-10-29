import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import type { TimeFormat12h } from '../utils/timeFormat';
import { 
  convertTo12h, 
  convertTo24h, 
  isValidTime12h 
} from '../utils/timeFormat';

interface TimeInput12hProps {
  value?: string; // Valor en formato 24h (HH:MM)
  onChange: (value: string) => void; // Callback con valor en formato 24h
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const TimeInput12h: React.FC<TimeInput12hProps> = ({
  value = '',
  onChange,
  label,
  required = false,
  disabled = false,
  className = ''
}) => {
  const [time12h, setTime12h] = useState<TimeFormat12h>({
    hour: 12,
    minute: 0,
    period: 'AM'
  });
  const [isOpen, setIsOpen] = useState(false);

  // Inicializar el estado cuando cambie el valor prop
  useEffect(() => {
    if (value) {
      try {
        const converted = convertTo12h(value);
        setTime12h(converted);
      } catch (error) {
        console.error('Error converting time:', error);
      }
    }
  }, [value]);

  // Manejar cambio de valores
  const handleTimeChange = (newTime: Partial<TimeFormat12h>) => {
    const updatedTime = { ...time12h, ...newTime };
    
    if (isValidTime12h(updatedTime)) {
      setTime12h(updatedTime);
      const time24h = convertTo24h(updatedTime);
      onChange(time24h);
    }
  };

  // Generar opciones de horas (1-12)
  const hourOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  
  // Generar opciones de minutos (0-59)
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);

  // Función para seleccionar la hora actual
  const selectCurrentTime = () => {
    const now = new Date();
    const currentTime = convertTo12h({ hour: now.getHours(), minute: now.getMinutes() });
    setTime12h(currentTime);
    const time24h = convertTo24h(currentTime);
    onChange(time24h);
    setIsOpen(false);
  };

  return (
    <div className={className}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '8px',
          color: '#d1d5db'
        }}>
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
        </label>
      )}
      
      <div style={{ position: 'relative' }}>
        <div 
          style={{
            position: 'relative',
            width: '100%',
            height: '44px',
            background: '#111827',
            border: '2px solid transparent',
            borderRadius: '12px',
            backgroundImage: 'linear-gradient(#111827, #111827), linear-gradient(135deg, #6b7280, #4b5563)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundImage = 'linear-gradient(#111827, #111827), linear-gradient(135deg, #8b5cf6, #3b82f6)';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundImage = 'linear-gradient(#111827, #111827), linear-gradient(135deg, #6b7280, #4b5563)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {/* Icono de reloj */}
          <div style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            zIndex: 1
          }}>
            <Clock style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
          </div>
          
          {/* Display visual de la hora */}
          <div style={{
            paddingLeft: '44px',
            paddingRight: '12px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '400',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
          }}>
            <span>{time12h.hour}</span>
            <span style={{ margin: '0 4px' }}>:</span>
            <span>{time12h.minute.toString().padStart(2, '0')}</span>
            <span style={{ marginLeft: '8px', fontWeight: '600' }}>{time12h.period}</span>
          </div>
          
          {/* Flecha dropdown */}
          <div style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none'
          }}>
            <svg 
              width="12" 
              height="12" 
              viewBox="0 0 12 12" 
              fill="none"
              style={{
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}
            >
              <path 
                d="M3 4.5L6 7.5L9 4.5" 
                stroke="#9ca3af" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        
        {/* Dropdown personalizado */}
        {isOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            right: '0',
            marginTop: '4px',
            background: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
            zIndex: 1000,
            overflow: 'hidden'
          }}>
            {/* Botón de Hora Actual */}
            <div style={{
              padding: '8px 12px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderBottom: '1px solid #374151',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onClick={() => {
              selectCurrentTime();
              setIsOpen(false);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #059669, #047857)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                color: 'white',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                <Clock style={{ width: '14px', height: '14px' }} />
                Hora Actual
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '1px',
              background: '#374151'
            }}>
              {/* Columna de Horas */}
              <div style={{ background: '#1f2937' }}>
                <div style={{
                  padding: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#9ca3af',
                  textAlign: 'center',
                  borderBottom: '1px solid #374151'
                }}>
                  Hora
                </div>
                <div style={{ 
                  maxHeight: '150px', 
                  overflowY: 'auto',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#4b5563 #1f2937'
                }}>
                  <style>{`
                    .hour-scroll::-webkit-scrollbar { width: 6px; }
                    .hour-scroll::-webkit-scrollbar-track { background: #1f2937; }
                    .hour-scroll::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 3px; }
                    .hour-scroll::-webkit-scrollbar-thumb:hover { background: #6b7280; }
                  `}</style>
                  {hourOptions.map(hour => (
                    <div
                      key={hour}
                      onClick={() => {
                        handleTimeChange({ hour });
                        setIsOpen(false);
                      }}
                      style={{
                        padding: '6px 12px',
                        color: time12h.hour === hour ? '#3b82f6' : 'white',
                        background: time12h.hour === hour ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                        cursor: 'pointer',
                        fontSize: '13px',
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (time12h.hour !== hour) {
                          e.currentTarget.style.background = 'rgba(75, 85, 99, 0.5)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (time12h.hour !== hour) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      {hour}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Columna de Minutos */}
              <div style={{ background: '#1f2937' }}>
                <div style={{
                  padding: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#9ca3af',
                  textAlign: 'center',
                  borderBottom: '1px solid #374151'
                }}>
                  Min
                </div>
                <div 
                  className="minute-scroll"
                  style={{ 
                    maxHeight: '150px', 
                    overflowY: 'auto',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#4b5563 #1f2937'
                  }}
                >
                  <style>{`
                    .minute-scroll::-webkit-scrollbar { width: 6px; }
                    .minute-scroll::-webkit-scrollbar-track { background: #1f2937; }
                    .minute-scroll::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 3px; }
                    .minute-scroll::-webkit-scrollbar-thumb:hover { background: #6b7280; }
                  `}</style>
                  {minuteOptions.map(minute => (
                    <div
                      key={minute}
                      onClick={() => {
                        handleTimeChange({ minute });
                        setIsOpen(false);
                      }}
                      style={{
                        padding: '6px 12px',
                        color: time12h.minute === minute ? '#3b82f6' : 'white',
                        background: time12h.minute === minute ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                        cursor: 'pointer',
                        fontSize: '13px',
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (time12h.minute !== minute) {
                          e.currentTarget.style.background = 'rgba(75, 85, 99, 0.5)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (time12h.minute !== minute) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      {minute.toString().padStart(2, '0')}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Columna de AM/PM */}
              <div style={{ background: '#1f2937' }}>
                <div style={{
                  padding: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#9ca3af',
                  textAlign: 'center',
                  borderBottom: '1px solid #374151'
                }}>
                  Período
                </div>
                <div>
                  {['AM', 'PM'].map(period => (
                    <div
                      key={period}
                      onClick={() => {
                        handleTimeChange({ period: period as 'AM' | 'PM' });
                        setIsOpen(false);
                      }}
                      style={{
                        padding: '12px',
                        color: time12h.period === period ? '#3b82f6' : 'white',
                        background: time12h.period === period ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (time12h.period !== period) {
                          e.currentTarget.style.background = 'rgba(75, 85, 99, 0.5)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (time12h.period !== period) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      {period}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Overlay para cerrar el dropdown */}
        {isOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default TimeInput12h;