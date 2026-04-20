import { Suspense } from 'react';
import { VerifyOtpPage } from '@/modules/auth/presentation/VerifyOtpPage';

// VerifyOtpPage manages its own header/footer (layout differs by role)
export default function VerifyOtpRoute() {
  return (
    <Suspense>
      <VerifyOtpPage />
    </Suspense>
  );
}
