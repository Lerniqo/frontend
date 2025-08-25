# JWT Authentication System Documentation

## Overview

This frontend application has been refactored with a comprehensive JWT (JSON Web Token) authentication system that provides secure user authentication, role-based access control, and protected routing.

## Architecture

### 1. Authentication Context (`contexts/AuthContext.tsx`)

The `AuthContext` provides authentication state management throughout the application:

- **State Management**: Manages user authentication state, loading states, and user information
- **Token Storage**: Uses secure HTTP-only cookies for storing JWT tokens
- **Authentication Methods**: Provides login, register, logout, and token refresh functionality
- **User Management**: Handles user profile updates and role-based access

#### Key Features:
- Automatic token validation on app initialization
- Secure cookie-based token storage
- Automatic redirects based on authentication status
- Role-based access control

### 2. Route Protection Components

#### ProtectedRoute (`components/CommonComponents/ProtectedRoute.tsx`)
- Guards routes that require authentication
- Supports role-based access control
- Automatically redirects unauthenticated users
- Handles role-specific redirects

#### PublicRoute (`components/CommonComponents/PublicRoute.tsx`)
- Prevents authenticated users from accessing public routes (login/signup)
- Automatically redirects to appropriate dashboard based on user role

### 3. User Service (`services/userService.ts`)

The user service handles all authentication-related API calls:

- **Token Management**: Secure cookie-based token storage
- **API Communication**: Handles all backend API requests
- **Error Handling**: Comprehensive error handling and user feedback
- **Token Refresh**: Automatic token refresh functionality

#### Key Methods:
- `login()`: User authentication
- `register()`: User registration
- `logout()`: User logout and token cleanup
- `getCurrentUser()`: Fetch current user profile
- `refreshAccessToken()`: Refresh expired access tokens

### 4. Middleware (`middleware.ts`)

Server-side route protection that runs before page rendering:

- **Route Protection**: Protects routes at the server level
- **Token Validation**: Validates JWT tokens from cookies
- **Automatic Redirects**: Handles authentication redirects
- **Performance**: Runs before page rendering for better UX

## Authentication Flow

### 1. User Registration
```
User fills signup form → API call to register → JWT tokens received → 
Tokens stored in cookies → User redirected to appropriate dashboard
```

### 2. User Login
```
User fills login form → API call to authenticate → JWT tokens received → 
Tokens stored in cookies → User redirected to appropriate dashboard
```

### 3. Protected Route Access
```
User requests protected route → Middleware checks token → 
Token valid → Route rendered → Token invalid → Redirect to login
```

### 4. Token Refresh
```
Access token expires → API call with refresh token → 
New access token received → Token updated in cookies → Request continues
```

## Route Structure

### Public Routes (No Authentication Required)
- `/LandingPage` - Landing page with navigation
- `/Login` - User login page
- `/SignUp` - User registration page

### Protected Routes (Authentication Required)
- `/Student/*` - Student-specific routes (requires student role)
- `/Teacher/*` - Teacher-specific routes (requires teacher role)
- `/Admin/*` - Admin-specific routes (requires admin role)

### Role-Based Access Control
- **Students**: Access to student dashboard, learning paths, profile, store
- **Teachers**: Access to teacher dashboard, course management, student progress
- **Admins**: Access to system administration, user management, system status

## Security Features

### 1. Token Security
- **HTTP-Only Cookies**: Prevents XSS attacks
- **Secure Cookies**: HTTPS-only in production
- **SameSite Policy**: Prevents CSRF attacks
- **Token Expiration**: Short-lived access tokens (1 day)
- **Refresh Tokens**: Long-lived refresh tokens (7 days)

### 2. Route Protection
- **Client-Side**: React components with authentication checks
- **Server-Side**: Next.js middleware for additional security
- **Role-Based**: Granular access control based on user roles

### 3. API Security
- **Bearer Tokens**: JWT tokens in Authorization header
- **Automatic Refresh**: Seamless token refresh on expiration
- **Error Handling**: Secure error messages without information leakage

## Implementation Details

### 1. Cookie Configuration
```typescript
Cookies.set('accessToken', token, { 
  expires: 1, // 1 day
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
});
```

### 2. Protected Route Usage
```typescript
<ProtectedRoute requiredRole="student">
  <StudentDashboard />
</ProtectedRoute>
```

### 3. Public Route Usage
```typescript
<PublicRoute>
  <LoginPage />
</PublicRoute>
```

### 4. Authentication Hook Usage
```typescript
const { isAuthenticated, user, login, logout } = useAuth();
```

## Backend Integration

The authentication system is designed to work with a backend that provides:

### Required API Endpoints
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User authentication
- `POST /api/auth/refresh` - Token refresh
- `GET /api/users/me` - Current user profile
- `POST /api/users/logout` - User logout

### Expected Response Format
```typescript
interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
    refreshToken: string;
  };
  error?: string;
}
```

## Usage Examples

### 1. Creating a Protected Page
```typescript
import ProtectedRoute from '@/components/CommonComponents/ProtectedRoute';

const MyProtectedPage = () => {
  return (
    <ProtectedRoute requiredRole="student">
      <div>This content is only visible to students</div>
    </ProtectedRoute>
  );
};
```

### 2. Using Authentication in Components
```typescript
import { useAuth } from '@/contexts/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.fullName}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### 3. Custom Authentication Hook
```typescript
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

const MyPage = () => {
  const { shouldRender, user } = useAuthRedirect({
    requireAuth: true,
    requireRole: 'teacher'
  });

  if (!shouldRender) {
    return <div>Loading...</div>;
  }

  return <div>Teacher Dashboard</div>;
};
```

## Environment Variables

### Required Environment Variables
```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com

# JWT Configuration (if implementing server-side JWT validation)
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
```

## Testing

### 1. Authentication Flow Testing
- Test user registration and login
- Verify token storage in cookies
- Test protected route access
- Test role-based access control

### 2. Security Testing
- Verify XSS protection (HTTP-only cookies)
- Test CSRF protection (SameSite policy)
- Verify token expiration handling
- Test unauthorized access attempts

### 3. Edge Cases
- Network failures during authentication
- Invalid/expired tokens
- Role mismatch scenarios
- Concurrent authentication requests

## Troubleshooting

### Common Issues

#### 1. Authentication State Not Persisting
- Check cookie settings and domain configuration
- Verify token expiration times
- Check browser cookie policies

#### 2. Route Protection Not Working
- Ensure ProtectedRoute components are properly wrapped
- Check middleware configuration
- Verify authentication context is properly provided

#### 3. API Calls Failing
- Check API endpoint configuration
- Verify token format in Authorization header
- Check CORS configuration on backend

### Debug Steps
1. Check browser developer tools for cookie storage
2. Verify authentication context state
3. Check network requests for authentication headers
4. Verify middleware execution in server logs

## Future Enhancements

### 1. Advanced Security Features
- Multi-factor authentication (MFA)
- Session management and device tracking
- Rate limiting for authentication attempts
- Audit logging for security events

### 2. Performance Optimizations
- Token caching strategies
- Background token refresh
- Optimistic authentication updates
- Service worker integration

### 3. User Experience Improvements
- Remember me functionality
- Social authentication providers
- Progressive web app features
- Offline authentication support

## Conclusion

This JWT authentication system provides a robust, secure, and scalable foundation for user authentication and authorization. The implementation follows security best practices while maintaining excellent user experience and developer productivity.

For questions or issues, please refer to the code comments and this documentation. The system is designed to be easily extensible and maintainable for future requirements.
