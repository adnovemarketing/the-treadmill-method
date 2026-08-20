'use server';

import { createSupabaseServerAppClient } from '@/lib/supabase/server';
import { checkAndLinkUserEntitlement } from '@/lib/entitlement';
import {
  recordSessionCompletion,
  RecordSessionInput,
  startPostProgrammeCycle,
  recordPostProgrammeCompletion,
  getUserPostProgrammeProgress,
} from '@/lib/progressServer';
import { getPostProgrammeCycleSessions } from '@/core/programmes/postProgramme';

export async function recordSessionCompletionAction(input: RecordSessionInput) {
  const supabase = await createSupabaseServerAppClient();
  const { data } = await supabase.auth.getUser();

  if (!data?.user || data.user.id !== input.userId) {
    return { success: false, error: 'Unauthorized.' };
  }

  return await recordSessionCompletion(input);
}

export async function startPostProgrammeCycleAction() {
  const supabase = await createSupabaseServerAppClient();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    return { success: false, error: 'Unauthorized.' };
  }

  const user = data.user;
  const entitlement = await checkAndLinkUserEntitlement(user.id, user.email || '');
  if (!entitlement.hasEntitlement) {
    return { success: false, error: 'Entitlement required.' };
  }

  const startRes = await startPostProgrammeCycle(user.id);
  if (!startRes.success || !startRes.cycle) {
    return { success: false, error: startRes.error || 'Failed to start cycle.' };
  }

  const cycle = startRes.cycle;

  // Resolve next expected session ID for this cycle
  const postRecords = await getUserPostProgrammeProgress(user.id);
  const cycleCompletions = postRecords.filter((r) => r.cycle_id === cycle.id);
  const completedPositions = new Set(cycleCompletions.map((r) => r.session_position));
  const nextPos = [1, 2, 3].find((p) => !completedPositions.has(p)) || 1;

  const cycleSessions = getPostProgrammeCycleSessions(cycle.programme, cycle.action_type);
  const nextSessionItem = cycleSessions[nextPos - 1] || cycleSessions[0];

  return {
    success: true,
    cycleId: cycle.id,
    nextSessionId: nextSessionItem.programmeSession.id,
  };
}

export interface RecordPostProgrammeActionInput {
  cycleId: string;
  sessionId: string;
  difficulty?: 'Easy' | 'Good' | 'Hard';
  couldContinue?: 'Yes' | 'Maybe' | 'No';
  note?: string;
}

export async function recordPostProgrammeCompletionAction(input: RecordPostProgrammeActionInput) {
  const supabase = await createSupabaseServerAppClient();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    return { success: false, error: 'Unauthorized.' };
  }

  const user = data.user;
  const entitlement = await checkAndLinkUserEntitlement(user.id, user.email || '');
  if (!entitlement.hasEntitlement) {
    return { success: false, error: 'Entitlement required.' };
  }

  return await recordPostProgrammeCompletion({
    userId: user.id,
    cycleId: input.cycleId,
    sessionId: input.sessionId,
    difficulty: input.difficulty,
    couldContinue: input.couldContinue,
    note: input.note,
  });
}
