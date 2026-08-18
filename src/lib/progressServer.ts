import 'server-only';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import { getSessionById } from '@/core/programmes/helpers';

export interface ProgrammeProgressRecord {
  id: string;
  user_id: string;
  profile_id: string;
  programme_session_id: string;
  completed_at: string;
  duration_minutes: number;
  difficulty: string | null;
  could_continue: string | null;
  note: string | null;
}

export interface RecordSessionInput {
  userId: string;
  profileId: string;
  sessionId: string;
  difficulty?: 'Easy' | 'Good' | 'Hard' | null;
  couldContinue?: 'Yes' | 'Maybe' | 'No' | null;
  note?: string | null;
}

export interface RecordSessionResult {
  success: boolean;
  record?: ProgrammeProgressRecord;
  error?: string;
}

/**
 * Fetches all programme progress records for an authenticated user.
 */
export async function getUserProgrammeProgress(userId: string): Promise<ProgrammeProgressRecord[]> {
  if (!userId) return [];

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('programme_progress')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: true });

  if (error || !data) {
    console.error('[getUserProgrammeProgress Error]:', error?.message);
    return [];
  }

  return data as ProgrammeProgressRecord[];
}

/**
 * Records a session completion safely.
 * Canonical duration_minutes is derived from the central programme library.
 */
export async function recordSessionCompletion(
  input: RecordSessionInput
): Promise<RecordSessionResult> {
  const { userId, profileId, sessionId, difficulty, couldContinue, note } = input;

  if (!userId || !profileId || !sessionId) {
    return { success: false, error: 'Missing required parameters.' };
  }

  // Derive canonical duration from programme library
  const sessionDef = getSessionById(sessionId);
  if (!sessionDef) {
    return { success: false, error: 'Invalid programme session ID.' };
  }

  const durationMinutes = sessionDef.durationMinutes;
  const supabase = getSupabaseServerClient();

  // Upsert record on unique (user_id, programme_session_id) constraint
  const { data, error } = await supabase
    .from('programme_progress')
    .upsert(
      {
        user_id: userId,
        profile_id: profileId,
        programme_session_id: sessionId,
        completed_at: new Date().toISOString(),
        duration_minutes: durationMinutes,
        difficulty: difficulty || null,
        could_continue: couldContinue || null,
        note: note ? note.trim().slice(0, 300) : null,
      },
      {
        onConflict: 'user_id,programme_session_id',
      }
    )
    .select('*')
    .single();

  if (error || !data) {
    console.error('[recordSessionCompletion Error]:', error?.message);
    return { success: false, error: 'Failed to record session completion.' };
  }

  return {
    success: true,
    record: data as ProgrammeProgressRecord,
  };
}
