import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui';

export function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-stone-300 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-stone-900 mb-2">
          Page Not Found
        </h2>
        <p className="text-stone-500 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button variant="secondary" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Link to="/">
            <Button>
              <Home className="w-4 h-4" />
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

