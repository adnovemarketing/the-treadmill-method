import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

export type AllowedAnalyticsEventType =
  | 'quiz_started'
  | 'step_viewed'
  | 'question_answered'
  | 'lead_submitted'
  | 'offer_cta_clicked'
  | 'checkout_started';

const ALLOWED_EVENTS: Set<string> = new Set([
  'quiz_started',
  'step_viewed',
  'question_answered',
  'lead_submitted',
  'offer_cta_clicked',
  'checkout_started',
]);

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface AnalyticsEventPayload {
  session_id: string;
  event_type: AllowedAnalyticsEventType;
  step_slug?: string | null;
  step_number?: number | null;
  payload?: Record<string, unknown> | null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
    }

    const { session_id, event_type, step_slug, step_number, payload } = body;

    // 1. Validate session_id (valid UUID string)
    if (!session_id || typeof session_id !== 'string' || !UUID_REGEX.test(session_id)) {
      return NextResponse.json({ success: false, error: 'Invalid session_id' }, { status: 400 });
    }

    // 2. Validate event_type (allow-listed values only)
    if (!event_type || typeof event_type !== 'string' || !ALLOWED_EVENTS.has(event_type)) {
      return NextResponse.json({ success: false, error: 'Invalid event_type' }, { status: 400 });
    }

    // 3. Validate step_number when supplied (integer between 1 and 30)
    let validatedStepNumber: number | null = null;
    if (step_number !== undefined && step_number !== null) {
      if (typeof step_number !== 'number' || !Number.isInteger(step_number) || step_number < 1 || step_number > 30) {
        return NextResponse.json({ success: false, error: 'Invalid step_number' }, { status: 400 });
      }
      validatedStepNumber = step_number;
    }

    // 4. Validate step_slug when supplied (trimmed string, non-empty, <= 100 chars)
    let validatedStepSlug: string | null = null;
    if (step_slug !== undefined && step_slug !== null) {
      if (typeof step_slug !== 'string') {
        return NextResponse.json({ success: false, error: 'Invalid step_slug' }, { status: 400 });
      }
      const trimmed = step_slug.trim();
      if (trimmed.length === 0 || trimmed.length > 100) {
        return NextResponse.json({ success: false, error: 'Invalid step_slug length' }, { status: 400 });
      }
      validatedStepSlug = trimmed;
    }

    // 5. Validate payload when supplied (plain object, non-array, serialized size <= 4096 bytes)
    let validatedPayload: Record<string, unknown> | null = null;
    if (payload !== undefined && payload !== null) {
      if (typeof payload !== 'object' || Array.isArray(payload)) {
        return NextResponse.json({ success: false, error: 'Invalid payload format' }, { status: 400 });
      }
      const serialized = JSON.stringify(payload);
      if (Buffer.byteLength(serialized, 'utf8') > 4096) {
        return NextResponse.json({ success: false, error: 'Payload size limit exceeded' }, { status: 400 });
      }
      validatedPayload = payload as Record<string, unknown>;
    }

    const supabase = getSupabaseServerClient();

    if (event_type === 'step_viewed') {
      // Use ON CONFLICT DO NOTHING (ignore duplicate step views for the same session)
      const { error: insertError } = await supabase
        .from('quiz_step_events')
        .upsert(
          {
            session_id,
            event_type: 'step_viewed',
            step_slug: validatedStepSlug,
            step_number: validatedStepNumber,
            payload: validatedPayload,
          },
          {
            onConflict: 'session_id,step_slug',
            ignoreDuplicates: true,
          }
        );

      if (insertError) {
        console.error('[Analytics Event Insert Error]:', insertError.message);
        return NextResponse.json({ success: false, error: 'Database insert failed' }, { status: 500 });
      }
    } else {
      // Insert event (quiz_started, question_answered, lead_submitted, offer_cta_clicked, checkout_started)
      const { error: insertError } = await supabase.from('quiz_step_events').insert({
        session_id,
        event_type,
        step_slug: validatedStepSlug,
        step_number: validatedStepNumber,
        payload: validatedPayload,
      });

      if (insertError) {
        console.error('[Analytics Event Insert Error]:', insertError.message);
        return NextResponse.json({ success: false, error: 'Database insert failed' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Analytics Route Exception]:', errorMessage);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
