import { ProgrammeType } from '../types/personalisation';
import { PROGRAMME_LIBRARY, ProgrammeDefinition, ProgrammeSession } from './library';

export function getProgrammeDefinition(programmeType: ProgrammeType): ProgrammeDefinition {
  return PROGRAMME_LIBRARY[programmeType] || PROGRAMME_LIBRARY.pace_builder;
}

export function getAllSessions(programmeType: ProgrammeType): ProgrammeSession[] {
  const programme = getProgrammeDefinition(programmeType);
  const sessions: ProgrammeSession[] = [];
  for (const week of programme.weeks) {
    sessions.push(...week.sessions);
  }
  return sessions;
}

export function getSessionById(sessionId: string): ProgrammeSession | null {
  for (const progKey of Object.keys(PROGRAMME_LIBRARY) as ProgrammeType[]) {
    const sessions = getAllSessions(progKey);
    const found = sessions.find((s) => s.id === sessionId);
    if (found) return found;
  }
  return null;
}

export function isSessionInProgramme(sessionId: string, programmeType: ProgrammeType): boolean {
  const sessions = getAllSessions(programmeType);
  return sessions.some((s) => s.id === sessionId);
}

export function getNextSession(
  programmeType: ProgrammeType,
  completedSessionIds: string[]
): ProgrammeSession | null {
  const sessions = getAllSessions(programmeType);
  const completedSet = new Set(completedSessionIds);
  for (const s of sessions) {
    if (!completedSet.has(s.id)) {
      return s;
    }
  }
  return null; // All 9 Core Sessions completed
}

export interface ProgrammeProgressSummary {
  totalCoreSessions: number;
  completedCount: number;
  progressPercent: number;
  totalDurationMinutes: number;
  isComplete: boolean;
  currentWeek: 1 | 2 | 3;
  nextSession: ProgrammeSession | null;
}

export function calculateProgrammeProgress(
  programmeType: ProgrammeType,
  completedSessionIds: string[],
  completedDurations?: number[]
): ProgrammeProgressSummary {
  const allCore = getAllSessions(programmeType);
  const coreIds = new Set(allCore.map((s) => s.id));

  // Filter completed IDs to unique core sessions belonging to the user's programme
  const uniqueCompletedIds = Array.from(new Set(completedSessionIds));
  const completedCoreIds = uniqueCompletedIds.filter((id) => coreIds.has(id));
  const completedCount = completedCoreIds.length;
  const totalCoreSessions = allCore.length; // 9
  const progressPercent = Math.min(100, Math.round((completedCount / totalCoreSessions) * 100));
  const isComplete = completedCount >= totalCoreSessions;

  // Total duration calculation
  let totalDurationMinutes = 0;
  if (completedDurations && completedDurations.length > 0) {
    totalDurationMinutes = completedDurations.reduce((acc, curr) => acc + curr, 0);
  } else {
    // Sum duration of completed core sessions using canonical duration
    for (const session of allCore) {
      if (completedSessionIds.includes(session.id)) {
        totalDurationMinutes += session.durationMinutes;
      }
    }
  }

  // Derive current week (1, 2, or 3)
  const next = getNextSession(programmeType, completedSessionIds);
  const currentWeek: 1 | 2 | 3 = next ? next.week : 3;

  return {
    totalCoreSessions,
    completedCount,
    progressPercent,
    totalDurationMinutes,
    isComplete,
    currentWeek,
    nextSession: next,
  };
}
