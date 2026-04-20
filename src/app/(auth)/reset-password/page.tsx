import { Suspense } from 'react';
import { ResetPasswordPage } from '@/modules/auth/presentation/ResetPasswordPage';

// ResetPasswordPage manages its own header/footer (layout differs by role)
export default function ResetPasswordRoute() {
  return (
    <Suspense>
      <ResetPasswordPage />
    </Suspense>
  );
}
