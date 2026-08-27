import { NextRequest, NextResponse } from 'next/server';
import { getStripeServerClient } from '@/lib/stripeServer';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import { sendMetaCAPIPurchase } from '@/lib/metaConversionsServer';
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
  const stripe = getStripeServerClient();

  try {
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
        .select('id, email')
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

      // Extract and normalize Stripe customer email
      const rawStripeEmail =
        session.customer_details?.email ||
        session.customer_email ||
        (typeof session.customer === 'object' &&
        session.customer &&
        'email' in session.customer
          ? (session.customer as { email?: string }).email
          : null) ||
        null;

      const normalizedCustomerEmail =
        typeof rawStripeEmail === 'string' && rawStripeEmail.trim().length > 0
          ? rawStripeEmail.trim().toLowerCase()
          : null;

      // Backfill email in quiz_profiles if it was NULL for this specific profile
      if (!profile.email && normalizedCustomerEmail) {
        const { error: backfillError } = await supabase
          .from('quiz_profiles')
          .update({ email: normalizedCustomerEmail })
          .eq('id', profileId);

        if (backfillError) {
          console.error(
            `[Stripe Webhook Error]: Failed to backfill email for profile ${profileId}:`,
            backfillError.message
          );
          return NextResponse.json(
            { error: 'Failed to backfill quiz profile email.' },
            { status: 500 }
          );
        }
      } else if (
        profile.email &&
        normalizedCustomerEmail &&
        profile.email.toLowerCase() !== normalizedCustomerEmail
      ) {
        console.warn(
          `[Stripe Webhook Warning]: Profile ${profileId} already has email set. Preserving existing profile email.`
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
      const { data: purchaseRecord, error: insertError } = await supabase
        .from('purchases')
        .upsert(
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
        )
        .select('id')
        .single();

      if (insertError || !purchaseRecord) {
        console.error(
          `[Stripe Webhook Error]: Failed to persist purchase for session ${session.id}:`,
          insertError?.message || 'No purchase record returned'
        );
        return NextResponse.json(
          { error: 'Failed to persist purchase record.' },
          { status: 500 }
        );
      }

      console.log(
        `[Stripe Webhook Success]: Purchase recorded for profile ${profileId}, session ${session.id}.`
      );

      // Fetch actual paid line items from Stripe API to store item entitlements
      const mainPriceId = process.env.STRIPE_PRICE_ID;
      const mobilityPriceId = process.env.STRIPE_MOBILITY_PROTOCOL_PRICE_ID;
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

      for (const item of lineItems.data) {
        const itemPriceId = item.price?.id;
        if (!itemPriceId) continue;

        let productKey: string | null = null;
        if (mainPriceId && itemPriceId === mainPriceId) {
          productKey = 'main_treadmill_method';
        } else if (mobilityPriceId && itemPriceId === mobilityPriceId) {
          productKey = 'mobility_protocol';
        }

        if (productKey) {
          const { error: itemInsertError } = await supabase
            .from('purchase_items')
            .upsert(
              {
                purchase_id: purchaseRecord.id,
                profile_id: profileId,
                stripe_price_id: itemPriceId,
                product_key: productKey,
                amount: item.amount_total ?? null,
                currency: session.currency ?? null,
              },
              {
                onConflict: 'purchase_id,stripe_price_id',
              }
            );

          if (itemInsertError) {
            console.error(
              `[Stripe Webhook Error]: Failed to persist purchase_items for product ${productKey}, session ${session.id}:`,
              itemInsertError.message
            );
            return NextResponse.json(
              { error: 'Failed to persist purchase item entitlements.' },
              { status: 500 }
            );
          }
        }
      }

      // Trigger server-side Meta CAPI Purchase event for confirmed paid sessions
      if (isPaid) {
        const customerEmail =
          session.customer_details?.email ||
          session.customer_email ||
          (typeof session.customer === 'object' &&
          session.customer &&
          'email' in session.customer
            ? (session.customer as { email?: string }).email
            : null) ||
          null;

        await sendMetaCAPIPurchase({
          sessionId: session.id,
          amountTotal: session.amount_total,
          currency: session.currency,
          email: customerEmail,
        });
      }
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
