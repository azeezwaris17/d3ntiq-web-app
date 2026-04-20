import { Suspense } from 'react';
import { ForgotPasswordPage } from '@/modules/auth/presentation/ForgotPasswordPage';

// ForgotPasswordPage manages its own header/footer (layout differs by role)
export default function ForgotPasswordRoute() {
  return (
    <Suspense>
      <ForgotPasswordPage />
    </Suspense>
  );
}
