import React from 'react';
import { cn } from '../../utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  id,
  className,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-neutral-700 mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'block w-full rounded-xl border-neutral-300 bg-white px-4 py-3 text-neutral-900 shadow-soft transition-all duration-200',
          'focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 placeholder:text-neutral-400',
          error && 'border-error-300 focus:border-error-500 focus:ring-error-500 focus:ring-opacity-20',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-error-600 font-medium">{error}</p>
      )}
      {helper && !error && (
        <p className="mt-2 text-sm text-neutral-500">{helper}</p>
      )}
    </div>
  );
};