import React from 'react';
import { Container, ContainerProps } from './Container';

export interface PageLayoutProps extends ContainerProps {
  title?: string;
  description?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  description,
  header,
  footer,
  className = '',
  maxWidth = 'xl',
}) => {
  return (
    <div className={`flex min-h-screen flex-col ${className}`}>
      {header && <header>{header}</header>}
      <main className="flex-1">
        <Container maxWidth={maxWidth} className="py-8">
          {title && (
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              {description && <p className="mt-2 text-gray-600">{description}</p>}
            </div>
          )}
          {children}
        </Container>
      </main>
      {footer && <footer>{footer}</footer>}
    </div>
  );
};
