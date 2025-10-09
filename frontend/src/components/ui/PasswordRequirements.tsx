import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordRequirementsProps {
  password: string;
  show: boolean;
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password, show }) => {
  if (!show) return null;

  const requirements = [
    {
      text: 'Al menos 8 caracteres',
      met: password.length >= 8,
    },
    {
      text: 'Una letra mayúscula',
      met: /[A-Z]/.test(password),
    },
    {
      text: 'Una letra minúscula',
      met: /[a-z]/.test(password),
    },
    {
      text: 'Un número',
      met: /\d/.test(password),
    },
    {
      text: 'Un carácter especial (@$!%*?&)',
      met: /[@$!%*?&]/.test(password),
    },
  ];

  return (
    <div style={{
      backgroundColor: '#2d2d3a',
      border: '1px solid #374151',
      borderRadius: '6px',
      padding: '8px',
      marginTop: '4px',
      fontSize: '11px'
    }}>
      <div style={{ color: '#9ca3af', marginBottom: '4px', fontWeight: '500' }}>
        Requisitos de contraseña:
      </div>
      {requirements.map((req, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: req.met ? '#10b981' : '#6b7280',
            marginBottom: '2px'
          }}
        >
          {req.met ? (
            <Check size={10} color="#10b981" />
          ) : (
            <X size={10} color="#6b7280" />
          )}
          <span>{req.text}</span>
        </div>
      ))}
    </div>
  );
};