import { Suspense } from 'react';
import { AuthHeader } from '@/modules/auth/presentation/components/AuthHeader';
import { AuthFooter } from '@/modules/auth/presentation/components/AuthFooter';
import { LoginPage } from '@/modules/auth/presentation/LoginPage';

/**
 * Login route — header + teal background with card + footer.
 * Role is read from ?role=patient (default) or ?role=provider.
 */
export default function LoginRoute() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AuthHeader />
      {/* LoginPage renders AuthBackground (teal image + centred card) */}
      <Suspense>
        <LoginPage />
      </Suspense>
      <AuthFooter />
    </div>
  );
}
