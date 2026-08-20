import { getSupabaseServerClient } from './supabaseServer';
import {
  PostProgrammeRecord,
  PostProgrammeCycleRecord,
  getPostProgrammeCycleSessions,
  getNextCycleNumber,
} from '@/core/programmes/postProgramme';
import { ProgressRecordLike, getAdaptiveGuidance } from '@/core/programmes/adaptive';
import { getUserPersonalisedProfile } from './personalisationServer';

export interface ProgrammeProgressRecord {
  id: string;
  user_id: string;
  profile_id: string;
  programme_session_id: string;
  completed_at: string;
  duration_minutes: number;
  difficulty?: string | null;
  could_continue?: string | null;
  note?: string | null;
}

export interface RecordSessionInput {
  userId: string;
  profileId: string;
  sessionId: string;
  difficulty?: 'Easy' | 'Good' | 'Hard';
  couldContinue?: 'Yes' | 'Maybe' | 'No';
  note?: string;
}

export interface RecordPostProgrammeInput {
  userId: string;
  cycleId: string;
  sessionId: string;
  difficulty?: 'Easy' | 'Good' | 'Hard';
  couldContinue?: 'Yes' | 'Maybe' | 'No';
  note?: string;
}

/**
 * Fetches completed 21-Day core programme sessions for a user.
 */
export async function getUserProgrammeProgress(userId: string): Promise<ProgrammeProgressRecord[]> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from('programme_progress')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: true });

  if (error) {
    console.error('[getUserProgrammeProgress Error]:', error.message);
    return [];
  }

  return (data || []) as ProgrammeProgressRecord[];
}

/**
 * Fetches completed Post-Day-21 sessions for a user.
 */
export async function getUserPostProgrammeProgress(userId: string): Promise<PostProgrammeRecord[]> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from('post_programme_progress')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: true });

  if (error) {
    console.error('[getUserPostProgrammeProgress Error]:', error.message);
    return [];
  }

  return (data || []) as PostProgrammeRecord[];
}

/**
 * Fetches all Post-Day-21 cycles for a user.
 */
export async function getUserPostProgrammeCycles(userId: string): Promise<PostProgrammeCycleRecord[]> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from('post_programme_cycles')
    .select('*')
    .eq('user_id', userId)
    .order('cycle_number', { ascending: true });

  if (error) {
    console.error('[getUserPostProgrammeCycles Error]:', error.message);
    return [];
  }

  return (data || []) as PostProgrammeCycleRecord[];
}

/**
 * Fetches the currently active Post-Day-21 cycle for a user, if any.
 */
export async function getUserActivePostProgrammeCycle(userId: string): Promise<PostProgrammeCycleRecord | null> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from('post_programme_cycles')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();

  if (error) {
    console.error('[getUserActivePostProgrammeCycle Error]:', error.message);
    return null;
  }

  return (data as PostProgrammeCycleRecord) || null;
}

/**
 * Merges initial 21-Day core completions and Post-Day-21 completions into a single
 * chronologically sorted array of ProgressRecordLike items for Phase 7 adaptive guidance.
 */
export async function getUserAllProgressRecords(userId: string): Promise<ProgressRecordLike[]> {
  const [initialRecords, postRecords] = await Promise.all([
    getUserProgrammeProgress(userId),
    getUserPostProgrammeProgress(userId),
  ]);

  const merged: ProgressRecordLike[] = [
    ...initialRecords.map((r) => ({
      programme_session_id: r.programme_session_id,
      completed_at: r.completed_at,
      difficulty: r.difficulty || null,
      could_continue: r.could_continue || null,
    })),
    ...postRecords.map((r) => ({
      programme_session_id: r.programme_session_id,
      completed_at: r.completed_at,
      difficulty: r.difficulty || null,
      could_continue: r.could_continue || null,
    })),
  ];

  merged.sort((a, b) => new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime());

  return merged;
}

/**
 * Records a 21-Day core session completion into programme_progress using UPSERT.
 */
export async function recordSessionCompletion(
  input: RecordSessionInput
): Promise<{ success: boolean; record?: ProgrammeProgressRecord; error?: string }> {
  const { userId, profileId, sessionId, difficulty, couldContinue, note } = input;

  if (!userId || !profileId || !sessionId) {
    return { success: false, error: 'Missing required parameters.' };
  }

  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from('programme_progress')
    .upsert(
      {
        user_id: userId,
        profile_id: profileId,
        programme_session_id: sessionId,
        completed_at: new Date().toISOString(),
        duration_minutes: 0, // Calculated dynamically from library
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

/**
 * Starts or resumes a Post-Day-21 cycle server-side.
 * Prevents duplicate active cycles via database unique constraints and active cycle checks.
 * Safely handles active-cycle creation race conditions.
 */
export async function startPostProgrammeCycle(
  userId: string
): Promise<{ success: boolean; cycle?: PostProgrammeCycleRecord; error?: string }> {
  if (!userId) {
    return { success: false, error: 'User ID is required.' };
  }

  const supabase = getSupabaseServerClient();

  // 1. Check if an active cycle already exists for this user
  const existingActive = await getUserActivePostProgrammeCycle(userId);
  if (existingActive) {
    return { success: true, cycle: existingActive };
  }

  // 2. Resolve personalisation profile & guidance server-side
  const personalisation = await getUserPersonalisedProfile(userId, 'en-gb');
  if (!personalisation.success || !personalisation.plan || !personalisation.profileId) {
    return { success: false, error: 'User profile or plan not found.' };
  }

  const profileId = personalisation.profileId;
  const programme = personalisation.plan.programme;

  const allRecords = await getUserAllProgressRecords(userId);
  const guidance = getAdaptiveGuidance(allRecords, 'en-gb');

  // 3. Compute next cycle number
  const existingCycles = await getUserPostProgrammeCycles(userId);
  const nextCycleNumber = getNextCycleNumber(existingCycles);

  // 4. Create new active cycle using privileged server client
  const { data, error } = await supabase
    .from('post_programme_cycles')
    .insert({
      user_id: userId,
      profile_id: profileId,
      programme: programme,
      action_type: guidance.recommendation,
      cycle_number: nextCycleNumber,
      status: 'active',
      created_at: new Date().toISOString(),
    })
    .select('*')
    .single();

  if (error) {
    // Handle concurrent creation race: re-check if an active cycle was inserted concurrently
    const activeAfterRace = await getUserActivePostProgrammeCycle(userId);
    if (activeAfterRace) {
      return { success: true, cycle: activeAfterRace };
    }

    console.error('[startPostProgrammeCycle Error]:', error.message);
    return { success: false, error: 'Failed to start post-programme cycle.' };
  }

  return {
    success: true,
    cycle: data as PostProgrammeCycleRecord,
  };
}

/**
 * Records a Post-Day-21 session completion with full server-side authority & validation.
 * Uses privileged server client to bypass client RLS restriction and handles duplicate double-submit safely.
 */
export async function recordPostProgrammeCompletion(
  input: RecordPostProgrammeInput
): Promise<{ success: boolean; record?: PostProgrammeRecord; isCycleCompleted?: boolean; error?: string }> {
  const { userId, cycleId, sessionId, difficulty, couldContinue, note } = input;

  if (!userId || !cycleId || !sessionId) {
    return { success: false, error: 'Missing required parameters.' };
  }

  const supabase = getSupabaseServerClient();

  // 1. Validate active cycle ownership server-side
  const { data: cycle, error: cycleErr } = await supabase
    .from('post_programme_cycles')
    .select('*')
    .eq('id', cycleId)
    .eq('user_id', userId)
    .single();

  if (cycleErr || !cycle) {
    return { success: false, error: 'Active cycle not found or unauthorized.' };
  }

  if (cycle.status !== 'active') {
    return { success: false, error: 'This cycle is already completed.' };
  }

  // 2. Resolve existing completions for this cycle
  const { data: existingProgress } = await supabase
    .from('post_programme_progress')
    .select('*')
    .eq('cycle_id', cycleId)
    .order('session_position', { ascending: true });

  const existingCompletions = (existingProgress || []) as PostProgrammeRecord[];

  // Double-submit protection: check if this session ID has already been recorded in this cycle
  const duplicateRow = existingCompletions.find((r) => r.programme_session_id === sessionId);
  if (duplicateRow) {
    const isCycleCompleted = existingCompletions.length >= 3;
    return {
      success: true,
      record: duplicateRow,
      isCycleCompleted,
    };
  }

  const completedPositions = existingCompletions.map((r) => r.session_position);
  const expectedPosition = completedPositions.length + 1;

  if (expectedPosition > 3) {
    return { success: false, error: 'Cycle already has 3 completed sessions.' };
  }

  // 3. Derive expected session & duration server-side
  const cycleSessions = getPostProgrammeCycleSessions(cycle.programme, cycle.action_type);
  const expectedSessionItem = cycleSessions[expectedPosition - 1];

  if (!expectedSessionItem || expectedSessionItem.programmeSession.id !== sessionId) {
    return { success: false, error: 'Session does not match expected position in active cycle.' };
  }

  const durationMinutes = expectedSessionItem.plannedDurationMinutes;

  // 4. Insert completion record via privileged server client
  const { data: completionData, error: insertErr } = await supabase
    .from('post_programme_progress')
    .insert({
      user_id: userId,
      profile_id: cycle.profile_id,
      cycle_id: cycle.id,
      cycle_number: cycle.cycle_number,
      action_type: cycle.action_type,
      programme_session_id: sessionId,
      session_position: expectedPosition,
      completed_at: new Date().toISOString(),
      duration_minutes: durationMinutes,
      difficulty: difficulty || null,
      could_continue: couldContinue || null,
      note: note ? note.trim().slice(0, 300) : null,
    })
    .select('*')
    .single();

  if (insertErr) {
    // Handle double-submit race condition on UNIQUE(cycle_id, session_position)
    const { data: raceCheck } = await supabase
      .from('post_programme_progress')
      .select('*')
      .eq('cycle_id', cycleId)
      .eq('session_position', expectedPosition)
      .maybeSingle();

    if (raceCheck) {
      const isCycleCompleted = expectedPosition >= 3;
      return {
        success: true,
        record: raceCheck as PostProgrammeRecord,
        isCycleCompleted,
      };
    }

    console.error('[recordPostProgrammeCompletion Error]:', insertErr.message);
    return { success: false, error: 'Failed to record post-programme session completion.' };
  }

  // 5. If this was position 3, mark cycle as completed server-side
  let isCycleCompleted = false;
  if (expectedPosition === 3) {
    isCycleCompleted = true;
    await supabase
      .from('post_programme_cycles')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', cycle.id);
  }

  return {
    success: true,
    record: completionData as PostProgrammeRecord,
    isCycleCompleted,
  };
}
