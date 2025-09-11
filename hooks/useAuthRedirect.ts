import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

interface UseAuthRedirectOptions {
  requireAuth?: boolean;
  requireRole?: 'Student' | 'Teacher' | 'Admin';
  redirectTo?: string;
}

export const useAuthRedirect = ({
  requireAuth = false,
  requireRole,
  redirectTo
}: UseAuthRedirectOptions = {}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // If authentication is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      const redirectPath = redirectTo || '/login';
      router.push(redirectPath);
      return;
    }

    // If user is authenticated but shouldn't be on this route
    if (!requireAuth && isAuthenticated) {
      let redirectPath = redirectTo;
      
      if (!redirectPath) {
        // Redirect to dashboard - the layout will show the appropriate content based on user role
        redirectPath = '/dashboard';
      }
      
      router.push(redirectPath);
      return;
    }

    // If specific role is required but user doesn't have it
  if (requireRole && user && user.role !== requireRole) {
      let redirectPath = redirectTo;
      
      if (!redirectPath) {
      if (!redirectPath) {
        // Redirect to dashboard - the layout will show the appropriate content based on user role
        redirectPath = '/dashboard';
      }
      }
      
      router.push(redirectPath);
      return;
    }
  }, [isAuthenticated, user, isLoading, requireAuth, requireRole, redirectTo, router]);

  return {
    isAuthenticated,
    user,
    isLoading,
    shouldRender: !isLoading && 
      (requireAuth ? isAuthenticated : !isAuthenticated) &&
      (!requireRole || (user && user.role === requireRole))
  };
};
