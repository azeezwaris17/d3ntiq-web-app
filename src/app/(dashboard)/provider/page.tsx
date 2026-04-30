/**
 * /provider — redirect to /provider/appointments (default landing page for providers)
 */
import { redirect } from 'next/navigation';

export default function ProviderDashboardRoot() {
  redirect('/provider/appointments');
}
