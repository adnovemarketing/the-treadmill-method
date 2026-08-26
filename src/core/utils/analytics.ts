// Analytics utility for The Treadmill Method
export type AnalyticsEvent =
  | 'landing_view'
  | 'quiz_started'
  | 'quiz_step_viewed'
  | 'question_answered'
  | 'quiz_abandoned'
  | 'intermediate_result_viewed'
  | 'lead_form_viewed'
  | 'lead_submitted'
  | 'final_result_viewed'
  | 'offer_viewed'
  | 'plan_selected'
  | 'checkout_clicked';

export type AnalyticsPayload = Record<string, string | number | boolean | null | undefined | unknown>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

export function trackEvent(event: AnalyticsEvent, params: AnalyticsPayload = {}) {
  if (typeof window === 'undefined') return;

  const timestamp = new Date().toISOString();
  console.log(`[Analytics] ${event}`, {
    ...params,
    timestamp,
    url: window.location.href,
  });

  // Meta Pixel integration
  if (typeof window.fbq === 'function') {
    const standardEvents: Record<string, string> = {
      landing_view: 'PageView',
      lead_submitted: 'Lead',
      checkout_clicked: 'InitiateCheckout',
      offer_viewed: 'ViewContent',
      quiz_started: 'StartTrial',
      plan_selected: 'AddToCart',
    };

    const fbEvent = standardEvents[event];
    if (fbEvent) {
      window.fbq('track', fbEvent, params);
    } else {
      window.fbq('trackCustom', event, params);
    }
  }
}

export function sendQuizAnalyticsEvent(params: {
  sessionId: string;
  eventType: 'quiz_started' | 'step_viewed' | 'question_answered' | 'lead_submitted' | 'offer_cta_clicked' | 'checkout_started';
  stepSlug?: string | null;
  stepNumber?: number | null;
  payload?: Record<string, unknown> | null;
}) {
  if (typeof window === 'undefined' || !params.sessionId) return;

  const data = JSON.stringify({
    session_id: params.sessionId,
    event_type: params.eventType,
    step_slug: params.stepSlug,
    step_number: params.stepNumber,
    payload: params.payload,
  });

  try {
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([data], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/event', blob);
    } else {
      fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Fail silently so UI/quiz execution is never interrupted
  }
}

