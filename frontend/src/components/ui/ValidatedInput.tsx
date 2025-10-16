import React, { useState, useEffect } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';

interface ValidationState {
  isValid: boolean | null;
  message?: string;
}

interface ValidatedInputProps {
  type?: 'text' | 'email' | 'password';
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  label?: string;
  icon?: React.ReactNode;
  validator?: (value: string) => ValidationState;
  showValidation?: boolean;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  label,
  icon,
  validator,
  showValidation = true,
  style,
  disabled = false,
}) => {
  const [validation, setValidation] = useState<ValidationState>({ isValid: null });
  const [isFocused, setIsFocused] = useState(false);
  const [hasBeenBlurred, setHasBeenBlurred] = useState(false);

  // Validar el valor cuando cambia
  useEffect(() => {
    if (validator && value.length > 0) {
      const result = validator(value);
      setValidation(result);
    } else {
      setValidation({ isValid: null });
    }
  }, [value, validator]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setHasBeenBlurred(true);
    onBlur?.();
  };

  const shouldShowValidation = showValidation && hasBeenBlurred && !isFocused && value.length > 0;
  
  const getBorderColor = () => {
    if (!shouldShowValidation) return '#374151';
    if (validation.isValid === true) return '#10b981';
    if (validation.isValid === false) return '#ef4444';
    return '#374151';
  };

  const getValidationIcon = () => {
    if (!shouldShowValidation) return null;
    if (validation.isValid === true) return <Check size={16} color="#10b981" />;
    if (validation.isValid === false) return <X size={16} color="#ef4444" />;
    return null;
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '30px',
    backgroundColor: '#2d2d3a',
    border: `1px solid ${getBorderColor()}`,
    borderRadius: '4px',
    paddingLeft: icon ? '26px' : '8px',
    paddingRight: shouldShowValidation ? '30px' : '8px',
    color: 'white',
    fontSize: '12px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    ...style,
  };

  if (isFocused) {
    inputStyle.boxShadow = `0 0 0 2px ${getBorderColor()}33`;
  }

  return (
    <div style={{ marginBottom: '10px' }}>
      {label && (
        <label style={{ 
          color: '#9ca3af', 
          fontSize: '11px', 
          marginBottom: '2px', 
          display: 'block' 
        }}>
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}
      
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{
            position: 'absolute',
            left: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1,
            color: '#6b7280'
          }}>
            {icon}
          </div>
        )}
        
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          style={inputStyle}
        />
        
        {shouldShowValidation && (
          <div style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1,
          }}>
            {getValidationIcon()}
          </div>
        )}
      </div>
      
      {shouldShowValidation && validation.message && (
        <div style={{ 
          color: validation.isValid ? '#10b981' : '#ef4444', 
          fontSize: '10px', 
          marginTop: '2px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          {validation.isValid ? '✓' : '⚠'} {validation.message}
        </div>
      )}
    </div>
  );
};

// Validadores comunes
export const validators = {
  email: (value: string): ValidationState => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(value);
    return {
      isValid,
      message: isValid ? 'Email válido' : 'Formato de email inválido'
    };
  },

  password: (value: string): ValidationState => {
    const hasMinLength = value.length >= 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[@$!%*?&]/.test(value);
    
    const isValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    
    if (isValid) {
      return { isValid: true, message: 'Contraseña segura' };
    } else {
      const missing = [];
      if (!hasMinLength) missing.push('8 caracteres');
      if (!hasUpperCase) missing.push('mayúscula');
      if (!hasLowerCase) missing.push('minúscula');
      if (!hasNumber) missing.push('número');
      if (!hasSpecialChar) missing.push('símbolo');
      
      return { 
        isValid: false, 
        message: `Falta: ${missing.join(', ')}`
      };
    }
  },

  required: (fieldName: string) => (value: string): ValidationState => {
    const isValid = value.trim().length > 0;
    return {
      isValid,
      message: isValid ? `${fieldName} válido` : `${fieldName} es requerido`
    };
  },

  minLength: (min: number, fieldName: string) => (value: string): ValidationState => {
    const isValid = value.trim().length >= min;
    return {
      isValid,
      message: isValid ? `${fieldName} válido` : `Mínimo ${min} caracteres`
    };
  }
};