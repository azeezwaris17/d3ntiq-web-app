import React from 'react';

interface ComponentGroupProps {
  direction?: 'row' | 'col';
  spacing?: 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end';
  className?: string;
  children: React.ReactNode;
}

export const ComponentGroup = ({
  direction = 'col',
  spacing = 'md',
  align = 'start',
  className = '',
  children,
}: ComponentGroupProps) => {
  const spacingClasses = {
    sm: direction === 'col' ? 'space-y-2' : 'space-x-4',
    md: direction === 'col' ? 'space-y-4' : 'space-x-6',
    lg: direction === 'col' ? 'space-y-6' : 'space-x-8',
  };

  const alignClass =
    align === 'center' ? 'items-center' : align === 'end' ? 'items-end' : 'items-start';

  return (
    <div
      className={`
        flex
        ${direction === 'col' ? 'flex-col' : 'flex-row flex-wrap'}
        ${spacingClasses[spacing]}
        ${alignClass}
        ${className}
      `.trim()}
    >
      {children}
    </div>
  );
};
