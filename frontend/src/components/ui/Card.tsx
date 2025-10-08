import React from 'react';
import { cn } from '../../utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = 'md',
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-neutral-200 shadow-soft hover:shadow-medium transition-all duration-200',
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
};