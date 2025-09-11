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
        // Redirect to dashboard - the layout will show the appropriate content based on user role
        router.push('/dashboard');
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
