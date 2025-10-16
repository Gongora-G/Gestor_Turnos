import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  format: string;
}

const countries: Country[] = [
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', dialCode: '+57', format: '### ### ####' },
  { code: 'US', name: 'Estados Unidos', flag: '🇺🇸', dialCode: '+1', format: '(###) ###-####' },
  { code: 'MX', name: 'México', flag: '🇲🇽', dialCode: '+52', format: '## #### ####' },
  { code: 'ES', name: 'España', flag: '🇪🇸', dialCode: '+34', format: '### ### ###' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', dialCode: '+54', format: '## #### ####' },
];

interface PhoneInputProps {
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  name?: string;
  label?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value = '',
  onChange,
  onBlur,
  placeholder = 'Número de teléfono',
  required = false,
  error,
  name,
  label,
  style,
  disabled = false,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]); // Colombia por defecto
  const [showCountryList, setShowCountryList] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  // Formatear número según el patrón del país
  const formatPhoneNumber = (number: string, format: string): string => {
    const digitsOnly = number.replace(/\D/g, '');
    let formatted = '';
    let digitIndex = 0;

    for (const char of format) {
      if (char === '#' && digitIndex < digitsOnly.length) {
        formatted += digitsOnly[digitIndex];
        digitIndex++;
      } else if (char !== '#') {
        formatted += char;
      } else {
        break;
      }
    }

    return formatted;
  };

  // Validar número de teléfono
  const validatePhoneNumber = (number: string): boolean => {
    const digitsOnly = number.replace(/\D/g, '');
    
    // Validaciones específicas por país
    switch (selectedCountry.code) {
      case 'CO': // Colombia: 10 dígitos (3## ### ####)
        return digitsOnly.length === 10 && /^[3][0-9]{9}$/.test(digitsOnly);
      case 'US': // Estados Unidos: 10 dígitos
        return digitsOnly.length === 10 && /^[2-9][0-9]{2}[2-9][0-9]{6}$/.test(digitsOnly);
      case 'MX': // México: 10 dígitos
        return digitsOnly.length === 10;
      case 'ES': // España: 9 dígitos
        return digitsOnly.length === 9 && /^[679][0-9]{8}$/.test(digitsOnly);
      case 'AR': // Argentina: 10 dígitos
        return digitsOnly.length === 10;
      default:
        return digitsOnly.length >= 7 && digitsOnly.length <= 15;
    }
  };

  // Manejar cambio en el input
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const digitsOnly = inputValue.replace(/\D/g, '');
    
    // Limitar a la longitud máxima del formato
    const maxDigits = selectedCountry.format.split('#').length - 1;
    const limitedDigits = digitsOnly.slice(0, maxDigits);
    
    const formatted = formatPhoneNumber(limitedDigits, selectedCountry.format);
    setPhoneNumber(formatted);
    
    // Validar
    const valid = validatePhoneNumber(limitedDigits);
    setIsValid(limitedDigits.length > 0 ? valid : null);
    
    // Enviar el valor completo con código de país
    const fullNumber = limitedDigits ? `${selectedCountry.dialCode}${limitedDigits}` : '';
    onChange(fullNumber);
  };

  // Manejar cambio de país
  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    setShowCountryList(false);
    setPhoneNumber('');
    setIsValid(null);
    onChange('');
  };

  // Inicializar desde el value prop
  useEffect(() => {
    if (value) {
      // Extraer código de país y número
      const country = countries.find(c => value.startsWith(c.dialCode));
      if (country) {
        setSelectedCountry(country);
        const numberPart = value.replace(country.dialCode, '');
        const formatted = formatPhoneNumber(numberPart, country.format);
        setPhoneNumber(formatted);
        setIsValid(validatePhoneNumber(numberPart));
      }
    }
  }, [value]);

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '36px',
    backgroundColor: '#2d2d3a',
    border: `1px solid ${error ? '#ef4444' : isValid === true ? '#10b981' : isValid === false ? '#f59e0b' : '#374151'}`,
    borderRadius: '6px',
    paddingLeft: '90px',
    paddingRight: '40px',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
    ...style
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
  };

  const countryButtonStyle: React.CSSProperties = {
    position: 'absolute',
    left: '1px',
    top: '1px',
    height: '34px',
    backgroundColor: '#374151',
    border: 'none',
    borderRadius: '5px 0 0 5px',
    paddingLeft: '8px',
    paddingRight: '8px',
    color: 'white',
    fontSize: '13px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    zIndex: 1,
    opacity: disabled ? 0.6 : 1,
  };

  const iconStyle: React.CSSProperties = {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: isValid === true ? '#10b981' : isValid === false ? '#f59e0b' : '#9ca3af',
    width: '18px',
    height: '18px',
  };

  return (
    <div style={{ marginBottom: '12px' }}>
      {label && (
        <label style={{ 
          color: '#9ca3af', 
          fontSize: '12px', 
          marginBottom: '4px', 
          display: 'block' 
        }}>
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}
      
      <div style={containerStyle}>
        <button
          type="button"
          style={countryButtonStyle}
          onClick={() => !disabled && setShowCountryList(!showCountryList)}
          disabled={disabled}
        >
          <span style={{ fontSize: '16px' }}>{selectedCountry.flag}</span>
          <span style={{ fontSize: '11px' }}>{selectedCountry.dialCode}</span>
          <span style={{ fontSize: '10px' }}>▼</span>
        </button>
        
        <input
          type="tel"
          name={name}
          value={phoneNumber}
          onChange={handlePhoneChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          style={inputStyle}
        />
        
        <Phone style={iconStyle} />
        
        {showCountryList && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#2d2d3a',
            border: '1px solid #374151',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: 1000,
            maxHeight: '200px',
            overflowY: 'auto',
          }}>
            {countries.map((country) => (
              <button
                key={country.code}
                type="button"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  ':hover': {
                    backgroundColor: '#374151'
                  }
                }}
                onClick={() => handleCountryChange(country)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#374151';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span style={{ fontSize: '16px' }}>{country.flag}</span>
                <span style={{ fontSize: '12px' }}>{country.dialCode}</span>
                <span style={{ fontSize: '12px', flex: 1, textAlign: 'left' }}>{country.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {error && (
        <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>
          {error}
        </div>
      )}
      
      {isValid === false && !error && phoneNumber.length > 0 && (
        <div style={{ color: '#f59e0b', fontSize: '11px', marginTop: '4px' }}>
          Número de teléfono inválido para {selectedCountry.name}
        </div>
      )}
      
      {isValid === true && (
        <div style={{ color: '#10b981', fontSize: '11px', marginTop: '4px' }}>
          ✓ Número válido
        </div>
      )}
    </div>
  );
};