import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rate limiting storage (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60000);

function checkRateLimit(identifier: string, limit: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= limit) {
    return false;
  }
  
  record.count++;
  return true;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip for static files and API health checks
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname === '/favicon.ico' ||
    pathname === '/api/health'
  ) {
    return NextResponse.next();
  }

  // Rate limiting for authentication routes
  if (pathname === '/api/auth/callback/credentials' || pathname === '/api/auth/register') {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip, 10, 60000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }
  }

  // Rate limiting for agent API
  if (pathname.startsWith('/api/agent/')) {
    const sessionToken = request.headers.get('cookie')?.match(/next-auth.session-token=([^;]+)/)?.[1] || 'unknown';
    if (!checkRateLimit(sessionToken, 30, 60000)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded for agent requests' },
        { status: 429 }
      );
    }
  }

  // Admin route protection
  if (pathname.startsWith('/dashboard/admin')) {
    // Let the page handle authorization - middleware just logs
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
  ],
};