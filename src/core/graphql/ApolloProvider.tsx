/**
 * Apollo Provider Component
 * Wraps the application with Apollo Client provider
 */

'use client';
import React from 'react';

import { ApolloProvider as BaseApolloProvider } from '@apollo/client/react';
import { apolloClient } from './apollo-client';

interface ApolloProviderProps {
  children: React.ReactNode;
}

export const ApolloProvider: React.FC<ApolloProviderProps> = ({ children }) => {
  return <BaseApolloProvider client={apolloClient}>{children}</BaseApolloProvider>;
};

export default ApolloProvider;
