import 'server-only';
import Stripe from 'stripe';

/**
 * Server-only Stripe client utility.
 * Protected with Next.js 'server-only' to prevent accidental client-side usage.
 */
export function getStripeServerClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      'Stripe server configuration error: STRIPE_SECRET_KEY is not set in environment variables.'
    );
  }

  return new Stripe(secretKey);
}
