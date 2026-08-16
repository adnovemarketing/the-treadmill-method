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
