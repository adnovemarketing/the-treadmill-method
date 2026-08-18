import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { createServerClient } from '@supabase/ssr';

const locales = ['en-gb', 'pt-br'];
const defaultLocale = 'en-gb';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Verificar se a URL já possui localidade válida
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    const pathLocale = pathname.split('/')[1];
    let response = NextResponse.next({ request });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      });
      await supabase.auth.getUser();
    }

    response.cookies.set('locale', pathLocale, { maxAge: 365 * 24 * 60 * 60, path: '/' });
    return response;
  }


  // 2. Detecção automática na ausência da localidade na URL
  // Prioridade 1: Cookie 'locale'
  const cookieLocale = request.cookies.get('locale')?.value;
  let detectedLocale = cookieLocale;

  if (!detectedLocale || !locales.includes(detectedLocale)) {
    // Prioridade 2: Accept-Language Header do navegador
    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage) {
      const parsedLocales = acceptLanguage
        .split(',')
        .map((lang) => lang.split(';')[0].trim().toLowerCase());
      
      const foundLocale = parsedLocales.find((lang) => {
        if (locales.includes(lang)) return true;
        const prefix = lang.split('-')[0];
        return locales.some((l) => l.startsWith(prefix));
      });

      if (foundLocale) {
        if (locales.includes(foundLocale)) {
          detectedLocale = foundLocale;
        } else {
          detectedLocale = locales.find((l) => l.startsWith(foundLocale.split('-')[0])) || undefined;
        }
      }
    }
  }

  // Fallback final
  if (!detectedLocale || !locales.includes(detectedLocale)) {
    detectedLocale = defaultLocale;
  }

  // 3. Redirecionamento 307 limpo preservando queries e subpaths
  const url = request.nextUrl.clone();
  url.pathname = `/${detectedLocale}${pathname === '/' ? '' : pathname}`;
  
  const response = NextResponse.redirect(url, 307);
  response.cookies.set('locale', detectedLocale, { maxAge: 365 * 24 * 60 * 60, path: '/' });
  return response;
}

export const config = {
  matcher: [
    // Ignorar chamadas de API, arquivos estáticos, favicon, imagens, etc.
    '/((?!api|_next/static|_next/image|assets|favicon.ico|treadmill_woman_hero.png|.*\\..*).*)',
  ],
};
