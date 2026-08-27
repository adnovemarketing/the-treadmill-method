import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import { QuizProfileApiResponse } from '@/core/types/quiz';
import { generatePersonalisedPlan } from '@/core/personalisation/engine';

export async function POST(request: NextRequest) {
  try {
    const body: Record<string, unknown> = await request.json();
    const { email, quizData, session_id } = body || {};
    const sessionId =
      (session_id as string) ||
      ((quizData as Record<string, unknown>)?.sessionId as string) ||
      null;

    let normalizedEmail: string | null = null;
    if (email && typeof email === 'string' && email.trim().length > 0) {
      normalizedEmail = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalizedEmail)) {
        return NextResponse.json<QuizProfileApiResponse>(
          { success: false, error: 'Invalid email format.' },
          { status: 400 }
        );
      }
    }

    if (!quizData || typeof quizData !== 'object') {
      return NextResponse.json<QuizProfileApiResponse>(
        { success: false, error: 'Quiz payload is required.' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();

    // 1. Idempotency Check: Pre-lookup by session_id if present
    if (sessionId) {
      const { data: existingProfile } = await supabase
        .from('quiz_profiles')
        .select('id')
        .eq('session_id', sessionId)
        .maybeSingle();

      if (existingProfile) {
        return NextResponse.json<QuizProfileApiResponse>(
          {
            success: true,
            profile_id: existingProfile.id,
          },
          { status: 200 }
        );
      }
    }

    const plan = generatePersonalisedPlan(quizData as any);

    // 2. Insert new quiz profile
    const { data: insertedRecord, error: insertError } = await supabase
      .from('quiz_profiles')
      .insert({
        email: normalizedEmail,
        session_id: sessionId,
        quiz_data: { ...(quizData as object), email: normalizedEmail, sessionId },
        programme: plan.programme,
        starting_level: plan.starting_level,
        sessions_per_week: plan.sessions_per_week,
        goal_focus: plan.goal_focus,
        personal_strategy: plan.personal_strategy,
        preferred_workout_time: plan.preferred_workout_time,
        personalised_explanation: plan.personalised_explanation,
        status: 'pending',
      })
      .select('id')
      .single();

    if (insertError) {
      // 3. Race condition handling: PostgreSQL 23505 (unique_violation)
      if (insertError.code === '23505' && sessionId) {
        const { data: racedProfile } = await supabase
          .from('quiz_profiles')
          .select('id')
          .eq('session_id', sessionId)
          .maybeSingle();

        if (racedProfile) {
          return NextResponse.json<QuizProfileApiResponse>(
            {
              success: true,
              profile_id: racedProfile.id,
            },
            { status: 200 }
          );
        }
      }

      console.error('[Quiz Profile DB Insert Error]:', insertError.message);
      return NextResponse.json<QuizProfileApiResponse>(
        { success: false, error: 'Failed to persist quiz profile.' },
        { status: 500 }
      );
    }

    return NextResponse.json<QuizProfileApiResponse>(
      {
        success: true,
        profile_id: insertedRecord.id,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Quiz Profile Route Exception]:', errorMessage);
    return NextResponse.json<QuizProfileApiResponse>(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
