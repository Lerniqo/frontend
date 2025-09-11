'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loading } from '@/components/CommonComponents/Loading';
import { checkAuthState, getRedirectPath } from '@/utils/authRedirect';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  useEffect(() => {
    const performAuthCheck = async () => {
      if (isLoading) return;

      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      // Check detailed auth state for verified and complete profile
      try {
        const authState = await checkAuthState();
        const redirectPath = getRedirectPath(authState);
        
        if (redirectPath !== '/dashboard' && !window.location.pathname.includes('signup')) {
          // User needs to complete verification or profile
          router.push(redirectPath);
          return;
        }
        
        setAuthCheckComplete(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      }
    };

    performAuthCheck();
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !authCheckComplete) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
