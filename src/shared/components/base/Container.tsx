'use client';
import React from 'react';

import {
  Container as MantineContainer,
  ContainerProps as MantineContainerProps,
} from '@mantine/core';

export interface ContainerProps extends Omit<MantineContainerProps, 'size'> {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'fluid';
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  maxWidth = 'xl',
  ...props
}) => {
  return (
    <MantineContainer
      size={maxWidth}
      className={className}
      ff="inherit"
      px={{ base: 'md', sm: 'lg', lg: 'xl' }}
      {...props}
    >
      {children}
    </MantineContainer>
  );
};
