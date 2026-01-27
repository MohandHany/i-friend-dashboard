import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth token from cookies or headers
  const authToken = request.cookies.get('accessToken')?.value;

  // Define public paths that don't require authentication
  const isPublicPath = pathname.startsWith('/sign-in');

  // Define protected paths (dashboard routes)
  const isProtectedPath = !isPublicPath && pathname !== '/_next' && !pathname.startsWith('/api');

  // Redirect to sign-in if trying to access protected path without token
  if (isProtectedPath && !authToken) {
    const signInUrl = new URL('/sign-in', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect to dashboard if trying to access sign-in while authenticated
  if (isPublicPath && authToken) {
    const dashboardUrl = new URL('/', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
};
