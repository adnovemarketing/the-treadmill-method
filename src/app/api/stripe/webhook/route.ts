import { NextRequest, NextResponse } from 'next/server';
import { getStripeServerClient } from '@/lib/stripeServer';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const bodyText = await request.text();
  const signature = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('[Stripe Webhook Error]: STRIPE_WEBHOOK_SECRET is missing.');
    return NextResponse.json(
      { error: 'Webhook secret is not configured.' },
      { status: 500 }
    );
  }

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header.' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripeServerClient();
    event = stripe.webhooks.constructEvent(bodyText, signature, webhookSecret);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Stripe Webhook Signature Verification Failed]:', errorMessage);
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  // Handle checkout.session.completed
  if (
    event.type === 'checkout.session.completed' ||
    event.type === 'checkout.session.async_payment_succeeded'
  ) {
    const session = event.data.object as Stripe.Checkout.Session;

    const profileId =
      session.metadata?.profile_id || session.client_reference_id || null;

    if (!profileId) {
      console.warn(
        `[Stripe Webhook Warning]: Checkout session ${session.id} completed without profile_id.`
      );
      return NextResponse.json({ received: true }, { status: 200 });
    }

    try {
      const supabase = getSupabaseServerClient();

      // Verify referenced quiz profile exists
      const { data: profile } = await supabase
        .from('quiz_profiles')
        .select('id')
        .eq('id', profileId)
        .maybeSingle();

      if (!profile) {
        console.error(
          `[Stripe Webhook Error]: Quiz profile ${profileId} not found in database.`
        );
        return NextResponse.json(
          { error: `Quiz profile ${profileId} not found.` },
          { status: 404 }
        );
      }

      const customerId =
        typeof session.customer === 'string'
          ? session.customer
          : session.customer && 'id' in session.customer
          ? session.customer.id
          : null;

      const isPaid = session.payment_status === 'paid';
      const paidAt = isPaid ? new Date().toISOString() : null;

      // Idempotent upsert into public.purchases on stripe_checkout_session_id
      const { error: insertError } = await supabase.from('purchases').upsert(
        {
          profile_id: profileId,
          stripe_checkout_session_id: session.id,
          stripe_customer_id: customerId,
          payment_status: session.payment_status || 'completed',
          amount_total: session.amount_total ?? null,
          currency: session.currency ?? null,
          paid_at: paidAt,
        },
        {
          onConflict: 'stripe_checkout_session_id',
        }
      );

      if (insertError) {
        console.error(
          `[Stripe Webhook Error]: Failed to persist purchase for session ${session.id}:`,
          insertError.message
        );
        return NextResponse.json(
          { error: 'Failed to persist purchase record.' },
          { status: 500 }
        );
      }

      console.log(
        `[Stripe Webhook Success]: Purchase recorded for profile ${profileId}, session ${session.id}.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      console.error('[Stripe Webhook Exception]:', msg);
      return NextResponse.json(
        { error: 'Internal server error processing purchase.' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
