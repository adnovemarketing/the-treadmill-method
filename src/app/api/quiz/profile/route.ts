import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import { QuizProfileApiRequest, QuizProfileApiResponse } from '@/core/types/quiz';

export async function POST(request: NextRequest) {
  try {
    const body: Partial<QuizProfileApiRequest> = await request.json();
    const { email, quizData } = body || {};

    if (!email || typeof email !== 'string') {
      return NextResponse.json<QuizProfileApiResponse>(
        { success: false, error: 'Email is required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json<QuizProfileApiResponse>(
        { success: false, error: 'Invalid email format.' },
        { status: 400 }
      );
    }

    if (!quizData || typeof quizData !== 'object') {
      return NextResponse.json<QuizProfileApiResponse>(
        { success: false, error: 'Quiz payload is required.' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();

    const { data: insertedRecord, error: insertError } = await supabase
      .from('quiz_profiles')
      .insert({
        email: normalizedEmail,
        quiz_data: { ...quizData, email: normalizedEmail },
        status: 'pending',
      })
      .select('id')
      .single();

    if (insertError) {
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
