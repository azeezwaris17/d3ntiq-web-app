import { Suspense } from 'react';
import { AuthHeader } from '@/modules/auth/presentation/components/AuthHeader';
import { AuthFooter } from '@/modules/auth/presentation/components/AuthFooter';
import { RegisterPage } from '@/modules/auth/presentation/RegisterPage';

/**
 * Register route — header + teal background with card + footer.
 * Role is read from ?role=patient (default) or ?role=provider.
 */
export default function RegisterRoute() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AuthHeader />
      {/* RegisterPage renders AuthBackground (teal image + centred card) */}
      <Suspense>
        <RegisterPage />
      </Suspense>
      <AuthFooter />
    </div>
  );
}
