'use client';

import { useEffect } from 'react';
import type { FC, ReactElement } from 'react';
import { ErrorDisplay } from '@/shared/components/base/ErrorDisplay';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const Error: FC<ErrorPageProps> = ({ error, reset }): ReactElement => {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <ErrorDisplay
        title="Something went wrong!"
        message={
          error.message ||
          'An unexpected error occurred. Please try again or contact support if the problem persists.'
        }
        onRetry={reset}
      />
    </div>
  );
};

export default Error;
