import React from 'react';

interface ContainerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  children: React.ReactNode;
}

export const Container = ({ size = 'lg', className = '', children }: ContainerProps) => {
  const maxWidth = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-[1400px]',
    full: 'max-w-full',
  };

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${maxWidth[size]} ${className}`.trim()}>
      {children}
    </div>
  );
};
