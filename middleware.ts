import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes
const protectedRoutes = [
  '/Student',
  '/Teacher', 
  '/Admin',
  '/Profile',
  '/Settings'
];

// Define public routes that should redirect authenticated users
const publicRoutes = [
  '/Login',
  '/SignUp',
  '/LandingPage'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Check if the route is public (should redirect authenticated users)
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  );

  // If accessing a protected route without a token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/Login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing a public route with a valid token, redirect to appropriate dashboard
  if (isPublicRoute && token) {
    // For now, redirect to student dashboard (you can enhance this logic)
    return NextResponse.redirect(new URL('/Student/Dashboard', request.url));
  }

  // Continue with the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
