import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const home = isAuthenticated
    ? user?.isHOD ? '/hod/dashboard' : '/faculty/dashboard'
    : '/login';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="text-center">
        {/* Giant 404 */}
        <p className="text-[120px] md:text-[180px] font-extrabold text-gray-100 dark:text-gray-800 leading-none select-none">
          404
        </p>
        <div className="-mt-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Page not found</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} /> Go Back
            </Button>
            <Button onClick={() => navigate(home)}>
              <Home size={16} /> {isAuthenticated ? 'Dashboard' : 'Login'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
