import crypto from 'crypto';

export interface MetaCAPIUserData {
  em?: string[];
  client_ip_address?: string;
  client_user_agent?: string;
  [key: string]: unknown;
}

export interface MetaCAPIEventPayload {
  event_name: string;
  event_time?: number;
  event_id?: string;
  action_source?: string;
  event_source_url?: string;
  user_data?: MetaCAPIUserData;
  custom_data?: Record<string, unknown>;
}

/**
 * Core function to send events directly to Meta Conversions API via Graph API.
 */
export async function sendMetaCAPIEvent(event: MetaCAPIEventPayload) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1055533277366534';
  const accessToken = process.env.META_CONVERSIONS_API_ACCESS_TOKEN;

  if (!accessToken) {
    console.warn('[Meta CAPI]: META_CONVERSIONS_API_ACCESS_TOKEN is not configured.');
    return { success: false, error: 'Meta Conversions API access token not configured.' };
  }

  const payload = {
    data: [
      {
        event_name: event.event_name,
        event_time: event.event_time || Math.floor(Date.now() / 1000),
        event_id: event.event_id,
        action_source: event.action_source || 'website',
        event_source_url: event.event_source_url || '',
        user_data: event.user_data || {},
        custom_data: event.custom_data || {},
      },
    ],
  };

  const res = await fetch(
    `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { success: false, status: res.status, data };
  }
  return { success: true, status: res.status, data };
}

interface SendMetaPurchaseParams {
  sessionId: string;
  amountTotal: number | null;
  currency: string | null;
  email?: string | null;
  eventSourceUrl?: string;
}

/**
 * Sends a server-side Meta CAPI Purchase event for a confirmed Stripe session.
 * Non-blocking: catches all errors internally and logs without exposing secrets/PII.
 */
export async function sendMetaCAPIPurchase({
  sessionId,
  amountTotal,
  currency,
  email,
  eventSourceUrl,
}: SendMetaPurchaseParams): Promise<void> {
  try {
    // Require amountTotal to be a valid number and currency to exist
    if (typeof amountTotal !== 'number' || !currency || !currency.trim()) {
      console.warn(
        `[Meta CAPI Warning]: Missing valid amountTotal or currency for session ${sessionId}. Skipping CAPI Purchase event.`
      );
      return;
    }

    const userData: MetaCAPIUserData = {};

    if (email && email.trim()) {
      const normalizedEmail = email.trim().toLowerCase();
      const hashedEmail = crypto.createHash('sha256').update(normalizedEmail).digest('hex');
      userData.em = [hashedEmail];
    }

    const value = amountTotal / 100;
    const uppercaseCurrency = currency.trim().toUpperCase();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ? process.env.NEXT_PUBLIC_SITE_URL.trim().replace(/\/+$/, '') : '';
    const sourceUrl = eventSourceUrl || siteUrl;

    const result = await sendMetaCAPIEvent({
      event_name: 'Purchase',
      event_id: sessionId,
      action_source: 'website',
      event_source_url: sourceUrl,
      user_data: userData,
      custom_data: {
        value,
        currency: uppercaseCurrency,
      },
    });

    if (!result.success) {
      console.error(
        `[Meta CAPI Error]: Purchase event failed for session ${sessionId}. Status: ${result.status}`,
        (result.data as { error?: { message?: string } })?.error?.message || result.data
      );
    } else {
      console.log(`[Meta CAPI Success]: Purchase event sent for session ${sessionId}.`);
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[Meta CAPI Exception]: Failed to send Purchase event for session ${sessionId}:`, msg);
  }
}
