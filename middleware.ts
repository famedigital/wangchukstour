import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const publicAdminRoutes = ['/admin/login', '/admin/forgot-password'];

function getJwtSecret() {
  const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  if (publicAdminRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('access_token')?.value;

  if (!accessToken) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(accessToken, getJwtSecret());
    const response = NextResponse.next();
    if (payload.userId) response.headers.set('x-user-id', String(payload.userId));
    if (payload.email) response.headers.set('x-user-email', String(payload.email));
    if (payload.role) response.headers.set('x-user-role', String(payload.role));
    return response;
  } catch {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
