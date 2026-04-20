/**
 * /patient — redirect to /patient/oral-iq (default landing for patients)
 */
import { redirect } from 'next/navigation';

export default function PatientDashboardRoot() {
  redirect('/patient/oral-iq');
}
