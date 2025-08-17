import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(req) {
  // Keep root URL as "/" while serving English content internally
  if (req.nextUrl.pathname === '/') {
    const url = new URL('/en', req.url);
    return NextResponse.rewrite(url);
  }
  return intlMiddleware(req);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g., `favicon.ico`)
  // - … and exclude `/ingest` so PostHog proxy endpoints bypass i18n middleware
  matcher: '/((?!api|trpc|_next|_vercel|ingest|.*\\..*).*)'
};