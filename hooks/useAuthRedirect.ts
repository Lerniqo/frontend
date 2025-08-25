import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

interface UseAuthRedirectOptions {
  requireAuth?: boolean;
  requireRole?: 'student' | 'teacher' | 'admin';
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
      const redirectPath = redirectTo || '/Login';
      router.push(redirectPath);
      return;
    }

    // If user is authenticated but shouldn't be on this route
    if (!requireAuth && isAuthenticated) {
      let redirectPath = redirectTo;
      
      if (!redirectPath) {
        // Redirect to appropriate dashboard based on user role
        switch (user?.role) {
          case 'student':
            redirectPath = '/Student/Dashboard';
            break;
          case 'teacher':
            redirectPath = '/Teacher/Dashboard';
            break;
          case 'admin':
            redirectPath = '/Admin/Dashboard';
            break;
          default:
            redirectPath = '/LandingPage';
        }
      }
      
      router.push(redirectPath);
      return;
    }

    // If specific role is required but user doesn't have it
    if (requireRole && user && user.role !== requireRole) {
      let redirectPath = redirectTo;
      
      if (!redirectPath) {
        // Redirect to appropriate dashboard based on user role
        switch (user.role) {
          case 'student':
            redirectPath = '/Student/Dashboard';
            break;
          case 'teacher':
            redirectPath = '/Teacher/Dashboard';
            break;
          case 'admin':
            redirectPath = '/Admin/Dashboard';
            break;
          default:
            redirectPath = '/LandingPage';
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
