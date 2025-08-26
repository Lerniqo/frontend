'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import Loading from './Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'Student' | 'Teacher' | 'Admin';
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole, 
  redirectTo = '/LandingPage' 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      if (requiredRole && user && user.role !== requiredRole) {
        // Redirect to appropriate dashboard based on user role
        switch (user.role) {
          case 'Student':
            router.push('/Student/Dashboard');
            break;
          case 'Teacher':
            router.push('/Teacher/Dashboard');
            break;
          case 'Admin':
            router.push('/Admin/Dashboard');
            break;
          default:
            router.push(redirectTo);
        }
      }
    }
  }, [isAuthenticated, user, isLoading, requiredRole, redirectTo, router]);

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (requiredRole && user && user.role !== requiredRole) {
    return null; // Will redirect
  }

  return <>{children}</>;
};

export default ProtectedRoute;
