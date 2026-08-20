import { ProgrammeSession } from './library';
import { ProgrammeType } from '../types/personalisation';
import { getProgrammeDefinition } from './helpers';
import { AdaptiveRecommendation } from './adaptive';

export type PostProgrammeCycleStatus = 'active' | 'completed';

export interface PostProgrammeCycleRecord {
  id: string;
  user_id: string;
  profile_id: string;
  programme: ProgrammeType;
  action_type: AdaptiveRecommendation;
  cycle_number: number;
  status: PostProgrammeCycleStatus;
  created_at: string;
  completed_at?: string | null;
}

export interface PostProgrammeRecord {
  id: string;
  user_id: string;
  profile_id: string;
  cycle_id: string;
  cycle_number: number;
  action_type: AdaptiveRecommendation;
  programme_session_id: string;
  session_position: number;
  completed_at: string;
  duration_minutes: number;
  difficulty?: string | null;
  could_continue?: string | null;
  note?: string | null;
}

export interface CycleSessionItem {
  sessionPosition: number; // 1, 2, or 3
  programmeSession: ProgrammeSession;
  plannedDurationMinutes: number;
}

export interface CycleProgressSummary {
  cycleId: string;
  cycleNumber: number;
  actionType: AdaptiveRecommendation;
  programmeType: ProgrammeType;
  totalSessions: number; // 3
  completedCount: number;
  isComplete: boolean;
  nextSession: CycleSessionItem | null;
}

/**
 * Returns the 3 sessions for a Post-Day-21 cycle (Week 3 of assigned programme).
 * If actionType === 'progress', adds +2 minutes to plannedDurationMinutes.
 */
export function getPostProgrammeCycleSessions(
  programmeType: ProgrammeType,
  actionType: AdaptiveRecommendation
): CycleSessionItem[] {
  const definition = getProgrammeDefinition(programmeType);
  const week3 = definition.weeks.find((w) => w.week === 3);

  if (!week3 || week3.sessions.length === 0) {
    throw new Error(`Week 3 not found for programme ${programmeType}`);
  }

  return week3.sessions.slice(0, 3).map((session, index) => {
    let plannedDurationMinutes = session.durationMinutes;
    if (actionType === 'progress') {
      plannedDurationMinutes += 2;
    }

    return {
      sessionPosition: index + 1,
      programmeSession: session,
      plannedDurationMinutes,
    };
  });
}

/**
 * Derives cycle completion progress from existing post_programme_progress records.
 */
export function calculatePostProgrammeCycleProgress(
  cycleId: string,
  cycleNumber: number,
  actionType: AdaptiveRecommendation,
  programmeType: ProgrammeType,
  records: PostProgrammeRecord[]
): CycleProgressSummary {
  const cycleSessions = getPostProgrammeCycleSessions(programmeType, actionType);
  const cycleCompletions = records.filter((r) => r.cycle_id === cycleId);
  const completedPositions = new Set(cycleCompletions.map((r) => r.session_position));

  const completedCount = completedPositions.size;
  const isComplete = completedCount >= 3;

  const nextSession = cycleSessions.find((s) => !completedPositions.has(s.sessionPosition)) || null;

  return {
    cycleId,
    cycleNumber,
    actionType,
    programmeType,
    totalSessions: 3,
    completedCount,
    isComplete,
    nextSession,
  };
}

/**
 * Calculates the next cycle number based on existing user cycle records.
 */
export function getNextCycleNumber(cycles: { cycle_number: number }[]): number {
  if (!cycles || cycles.length === 0) {
    return 1;
  }
  const max = Math.max(...cycles.map((c) => c.cycle_number));
  return max + 1;
}
