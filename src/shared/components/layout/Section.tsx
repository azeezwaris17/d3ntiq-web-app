import React from 'react';

interface SectionProps {
  background?: 'primary' | 'secondary' | 'dark' | 'light' | string;
  backgroundImage?: string;
  className?: string;
  children: React.ReactNode;
}

export const Section = ({ background, backgroundImage, className = '', children }: SectionProps) => {
  return (
    <section
      className={`
        w-full
        ${background === 'primary' ? 'bg-primary-600' : ''}
        ${background === 'secondary' ? 'bg-secondary-500' : ''}
        ${background === 'dark' ? 'bg-gray-900' : ''}
        ${background === 'light' ? 'bg-gray-50' : ''}
        ${backgroundImage ? 'bg-cover bg-center' : ''}
        ${className}
      `.trim()}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
    >
      {children}
    </section>
  );
};
