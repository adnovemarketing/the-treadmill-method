import { NextResponse } from 'next/server';
import { createSupabaseServerAppClient } from '@/lib/supabase/server';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import { checkAndLinkUserEntitlement, checkProductEntitlement } from '@/lib/entitlement';

export async function GET() {
  try {
    // 1. Resolve authenticated user via Supabase server app client
    const supabaseUserClient = await createSupabaseServerAppClient();
    const { data: authData } = await supabaseUserClient.auth.getUser();

    if (!authData?.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to access member resources.' },
        { status: 401 }
      );
    }

    const user = authData.user;

    // 2. Ensure purchase entitlement linking is updated
    if (user.email) {
      await checkAndLinkUserEntitlement(user.id, user.email);
    }

    // 3. Check product-specific entitlement for mobility_protocol
    const isEntitled = await checkProductEntitlement(user.id, 'mobility_protocol');
    if (!isEntitled) {
      return NextResponse.json(
        { error: 'Forbidden. Mobility Protocol purchase required.' },
        { status: 403 }
      );
    }

    // 4. Read configured private PDF object path
    const pdfPath = process.env.MOBILITY_PROTOCOL_PDF_PATH;
    if (!pdfPath) {
      console.error(
        '[Mobility Protocol API Error]: MOBILITY_PROTOCOL_PDF_PATH environment variable is not configured.'
      );
      return NextResponse.json(
        { error: 'Resource configuration error.' },
        { status: 500 }
      );
    }

    // 5. Generate short-lived signed URL using privileged server client
    const supabaseAdmin = getSupabaseServerClient();
    const { data: signedData, error: storageError } = await supabaseAdmin.storage
      .from('paid-assets')
      .createSignedUrl(pdfPath, 120);

    if (storageError || !signedData?.signedUrl) {
      console.error(
        '[Mobility Protocol API Storage Error]:',
        storageError?.message || 'Failed to generate signed URL'
      );
      return NextResponse.json(
        { error: 'Failed to generate access link.' },
        { status: 500 }
      );
    }

    // 6. Securely redirect user to signed URL
    return NextResponse.redirect(signedData.signedUrl);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Mobility Protocol API Exception]:', msg);
    return NextResponse.json(
      { error: 'Internal server error processing resource request.' },
      { status: 500 }
    );
  }
}
