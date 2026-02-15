import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/login';
  const token = request.cookies.get('auth_token')?.value || '';

  // 1. Logged in user trying to access Login -> Go to Projects
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/projects', request.nextUrl));
  }

  // 2. Not logged in user trying to access Protected Routes -> Go to Login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  // 3. Allow request
  return NextResponse.next();
}

// Routes to protect
export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/kanban/:path*',
    '/reports/:path*',
    '/projects/:path*',
    '/login'
  ]
};