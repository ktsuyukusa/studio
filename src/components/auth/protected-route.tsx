'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // List of public paths that don't require authentication
  const publicPaths = ['/auth', '/examples', '/examples/images', '/examples/analytics'];
  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(path + '/'));

  useEffect(() => {
    // Skip redirect during initial loading
    if (loading) return;

    // If user is not authenticated and not on a public page, redirect to auth page
    if (!user && !isPublicPath) {
      router.push('/auth');
    }

    // If user is authenticated and on the auth page, redirect to home page
    if (user && pathname === '/auth') {
      router.push('/');
    }
  }, [user, loading, router, pathname, isPublicPath]);

  // Show nothing while loading or redirecting
  if (loading || (!user && !isPublicPath) || (user && pathname === '/auth')) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render children when authenticated or on a public page
  return <>{children}</>;
}
