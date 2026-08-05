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

export function trackEvent(event: AnalyticsEvent, params: AnalyticsPayload = {}) {
  if (typeof window === 'undefined') return;

  const timestamp = new Date().toISOString();
  console.log(`[Analytics] ${event}`, {
    ...params,
    timestamp,
    url: window.location.href,
  });

  // Em um ambiente real, integraríamos com Firebase Analytics, GTM, GA4, ou Meta Pixel:
  // if (window.gtag) {
  //   window.gtag('event', event, params);
  // }
}
