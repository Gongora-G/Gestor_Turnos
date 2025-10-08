import React from 'react';
import { cn } from '../../utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-soft hover:shadow-medium';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 focus-visible:ring-primary-500',
    secondary: 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400 focus-visible:ring-primary-500',
    outline: 'border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 focus-visible:ring-primary-500',
    ghost: 'text-neutral-700 hover:bg-neutral-100 focus-visible:ring-neutral-500',
    danger: 'bg-gradient-to-r from-error-600 to-error-700 text-white hover:from-error-700 hover:to-error-800 focus-visible:ring-error-500',
  };

  const sizeClasses = {
    sm: 'h-9 px-4 text-sm rounded-xl',
    md: 'h-11 px-6 py-3 text-sm rounded-xl',
    lg: 'h-13 px-8 py-4 text-base rounded-xl',
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="w-4 h-4 mr-2 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            d="m15 12a3 3 0 11-6 0 3 3 0 016 0z"
            fill="currentColor"
          />
        </svg>
      )}
      {children}
    </button>
  );
};