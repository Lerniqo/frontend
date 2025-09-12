import { userService } from '@/services/userService';

export interface AuthState {
  isLoggedIn: boolean;
  isEmailVerified: boolean;
  isProfileComplete: boolean;
  user?: {
    userId: string;
    email: string;
    role: string;
    fullName?: string;
  };
}

export const checkAuthState = async (): Promise<AuthState> => {
  try {
    // Check if user has a valid token
    const token = userService.getToken();
    if (!token) {
      return {
        isLoggedIn: false,
        isEmailVerified: false,
        isProfileComplete: false,
      };
    }

    // Get current user from userService
    const currentUser = await userService.getCurrentUser();
    
    if (!currentUser.success || !currentUser.data) {
      return {
        isLoggedIn: false,
        isEmailVerified: false,
        isProfileComplete: false,
      };
    }

    const user = currentUser.data;
    
    // If user has a fullName, assume profile is completed
    // This is a safeguard in case the backend doesn't properly set profileCompleted
    const hasCompletedProfile = Boolean(user.profileCompleted || (user.fullName && user.fullName.trim().length > 0));
    
    return {
      isLoggedIn: true,
      isEmailVerified: user.isVerified,
      isProfileComplete: hasCompletedProfile,
      user: {
        userId: user.userId,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
    };
  } catch (error) {
    console.error('Auth state check error:', error);
    return {
      isLoggedIn: false,
      isEmailVerified: false,
      isProfileComplete: false,
    };
  }
};

export const getRedirectPath = (authState: AuthState): string => {
  if (!authState.isLoggedIn) {
    return '/login';
  }
  
  if (!authState.isEmailVerified && authState.user) {
    return `/signup/verify-email?email=${encodeURIComponent(authState.user.email)}&role=${encodeURIComponent(authState.user.role)}`;
  }
  
  if (!authState.isProfileComplete && authState.user) {
    return `/signup/complete-profile?userId=${encodeURIComponent(authState.user.userId)}&role=${encodeURIComponent(authState.user.role)}`;
  }
  
  // User is fully authenticated and verified - redirect to role-based dashboard
  if (authState.user) {
    switch (authState.user.role) {
      case 'Student':
        return '/dashboard'; // Will be routed to @student slot
      case 'Teacher':
        return '/dashboard'; // Will be routed to @teacher slot
      case 'Admin':
        return '/dashboard'; // Will be routed to @admin slot
      default:
        return '/dashboard';
    }
  }
  
  return '/dashboard';
};

export const redirectBasedOnAuthState = async (): Promise<string> => {
  const authState = await checkAuthState();
  return getRedirectPath(authState);
};

// Handle login response and determine next steps
export const handleLoginResponse = async (loginData: { email: string; password: string }) => {
  const result = await userService.login(loginData);
  
  if (!result.success) {
    return result;
  }

  // After successful login, check the user's current state
  const authState = await checkAuthState();
  const redirectPath = getRedirectPath(authState);
  
  // Log for debugging
  console.log('Login successful, auth state:', authState);
  console.log('Redirect path:', redirectPath);
  
  return {
    success: true,
    message: result.message,
    data: result.data,
    redirectPath,
    authState,
  };
};
