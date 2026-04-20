import Link from 'next/link';
import { Button } from '@/shared/components/base';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="mb-4 text-9xl font-bold text-gray-300">404</h1>
        <h2 className="mb-4 text-3xl font-bold text-gray-900">Page Not Found</h2>
        <p className="mb-8 text-gray-600">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/">
          <Button variant="primary" size="lg">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
