import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'ar'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // التحقق مما إذا كان المسار يحتوي بالفعل على لغة
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // إذا لم يكن المسار يحتوي على لغة، قم بالتوجيه للغة الافتراضية
  const locale = defaultLocale;
  request.nextUrl.pathname = `/${locale}${pathname}`;
  
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // استثناء الملفات الثابتة
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',  ],
}