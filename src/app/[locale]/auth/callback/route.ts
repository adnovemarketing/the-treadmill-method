import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerAppClient } from '@/lib/supabase/server';
import { checkAndLinkUserEntitlement } from '@/lib/entitlement';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ locale: string }> }
) {
  const { locale = 'en-gb' } = await context.params;
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  const origin = requestUrl.origin;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin;
  const baseUrl = siteUrl.replace(/\/$/, '');

  if (code) {
    const supabase = await createSupabaseServerAppClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      const user = data.user;
      const entitlement = await checkAndLinkUserEntitlement(
        user.id,
        user.email || ''
      );

      if (entitlement.hasEntitlement) {
        return NextResponse.redirect(`${baseUrl}/${locale}/app`);
      } else {
        return NextResponse.redirect(`${baseUrl}/${locale}/no-access`);
      }
    }
  }

  // Return user to login if auth code exchange failed or missing
  return NextResponse.redirect(`${baseUrl}/${locale}/login`);
}
