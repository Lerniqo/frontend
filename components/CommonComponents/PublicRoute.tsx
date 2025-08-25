'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import Loading from './Loading';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  redirectTo 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Redirect authenticated users to their appropriate dashboard
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        switch (user.role) {
          case 'student':
            router.push('/Student/Dashboard');
            break;
          case 'teacher':
            router.push('/Teacher/Dashboard');
            break;
          case 'admin':
            router.push('/Admin/Dashboard');
            break;
          default:
            router.push('/LandingPage');
        }
      }
    }
  }, [isAuthenticated, user, isLoading, redirectTo, router]);

  if (isLoading) {
    return <Loading />;
  }

  if (isAuthenticated && user) {
    return null; // Will redirect
  }

  return <>{children}</>;
};

export default PublicRoute;
