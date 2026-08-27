import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import { getStripeServerClient } from '@/lib/stripeServer';

interface CreateCheckoutRequestBody {
  profile_id: string;
  locale?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: Partial<CreateCheckoutRequestBody> = await request.json();
    const { profile_id, locale = 'en-gb' } = body || {};

    if (!profile_id || typeof profile_id !== 'string') {
      return NextResponse.json(
        { success: false, error: 'profile_id is required.' },
        { status: 400 }
      );
    }

    // Basic UUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(profile_id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid profile_id format.' },
        { status: 400 }
      );
    }

    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) {
      console.error('[Checkout API Error]: STRIPE_PRICE_ID is not configured.');
      return NextResponse.json(
        { success: false, error: 'Stripe pricing is not configured.' },
        { status: 500 }
      );
    }

    // Fetch the quiz profile server-side
    const supabase = getSupabaseServerClient();
    const { data: profile, error: dbError } = await supabase
      .from('quiz_profiles')
      .select('id, email')
      .eq('id', profile_id)
      .maybeSingle();

    if (dbError || !profile) {
      return NextResponse.json(
        { success: false, error: 'Quiz profile not found.' },
        { status: 404 }
      );
    }

    // Resolve base site URL
    const origin = request.headers.get('origin');
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin || 'http://localhost:3000';
    const baseUrl = siteUrl.replace(/\/$/, '');

    const stripe = getStripeServerClient();

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: profile.email ? profile.email : undefined,
      client_reference_id: profile.id,
      metadata: {
        profile_id: profile.id,
      },
      success_url: `${baseUrl}/${locale}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/${locale}/checkout`,

    });

    if (!session.url) {
      throw new Error('Failed to generate Stripe checkout session URL.');
    }

    return NextResponse.json(
      {
        success: true,
        url: session.url,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Checkout API Exception]:', errorMessage);
    return NextResponse.json(
      { success: false, error: 'Internal server error generating checkout session.' },
      { status: 500 }
    );
  }
}
