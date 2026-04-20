/**
 * /provider — redirect to /provider/profile (only MVP page for providers)
 */
import { redirect } from 'next/navigation';

export default function ProviderDashboardRoot() {
  redirect('/provider/profile');
}
