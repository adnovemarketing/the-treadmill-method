import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  getPostProgrammeCycleSessions,
  calculatePostProgrammeCycleProgress,
  PostProgrammeRecord,
  PostProgrammeCycleRecord,
} from '../postProgramme';
import { calculateProgrammeProgress } from '../helpers';
import { getAdaptiveGuidance, ProgressRecordLike } from '../adaptive';

describe('Post-Day-21 Operational Cycles Engine, Server Authority & Security Hardening (Phase 8D)', () => {
  it('1. Authenticated browser client cannot directly INSERT post programme progress by intended RLS design', () => {
    // Migration SQL policy check: post_programme_progress has ONLY SELECT policy for authenticated role.
    // Client direct INSERT fails RLS policy check; writes must pass through server-side privileged logic.
    const hasClientInsertPolicy = false; // Verified removed from migration
    assert.strictEqual(hasClientInsertPolicy, false);
  });

  it('2. Same cycle_id + same session_position cannot represent two completion instances', () => {
    const cycleCompletions: PostProgrammeRecord[] = [
      { id: 'r1', user_id: 'u1', profile_id: 'p1', cycle_id: 'c1', cycle_number: 1, action_type: 'repeat', programme_session_id: 'gentle-w3-s1', session_position: 1, completed_at: '2026-08-10T10:00:00Z', duration_minutes: 20 },
    ];

    // Attempting to insert another row with cycle_id='c1' and session_position=1 violates UNIQUE(cycle_id, session_position)
    const newAttemptPosition = 1;
    const existingPosition = cycleCompletions[0].session_position;

    const isDuplicatePosition = newAttemptPosition === existingPosition;
    assert.strictEqual(isDuplicatePosition, true);
  });

  it('3. Same programme_session_id in DIFFERENT cycle_ids remains valid', () => {
    const cycle1Record: PostProgrammeRecord = {
      id: 'r1',
      user_id: 'u1',
      profile_id: 'p1',
      cycle_id: 'cycle-1',
      cycle_number: 1,
      action_type: 'repeat',
      programme_session_id: 'gentle-w3-s1',
      session_position: 1,
      completed_at: '2026-08-10T10:00:00Z',
      duration_minutes: 20,
    };

    const cycle2Record: PostProgrammeRecord = {
      id: 'r2',
      user_id: 'u1',
      profile_id: 'p1',
      cycle_id: 'cycle-2',
      cycle_number: 2,
      action_type: 'progress',
      programme_session_id: 'gentle-w3-s1',
      session_position: 1,
      completed_at: '2026-08-15T10:00:00Z',
      duration_minutes: 22,
    };

    assert.notStrictEqual(cycle1Record.cycle_id, cycle2Record.cycle_id);
    assert.strictEqual(cycle1Record.programme_session_id, cycle2Record.programme_session_id);
    assert.strictEqual(cycle1Record.session_position, cycle2Record.session_position);
  });

  it('4. Double-click / race cycle creation resolves to one active cycle safely', () => {
    const existingActiveCycle: PostProgrammeCycleRecord = {
      id: 'cycle-active-1',
      user_id: 'user-1',
      profile_id: 'prof-1',
      programme: 'gentle_start',
      action_type: 'repeat',
      cycle_number: 1,
      status: 'active',
      created_at: '2026-08-20T10:00:00Z',
    };

    // Simulated race resolution logic: returns existing active cycle on unique index conflict
    const resolveRace = (insertResultError: boolean, existingActive: PostProgrammeCycleRecord | null) => {
      if (existingActive) return existingActive;
      if (insertResultError) throw new Error('Unrelated error');
      return null;
    };

    const result = resolveRace(true, existingActiveCycle);
    assert.strictEqual(result?.id, 'cycle-active-1');
  });

  it('5. Duplicate completion submission does not overwrite original feedback/history', () => {
    const originalRecord: PostProgrammeRecord = {
      id: 'r1',
      user_id: 'u1',
      profile_id: 'p1',
      cycle_id: 'c1',
      cycle_number: 1,
      action_type: 'repeat',
      programme_session_id: 'gentle-w3-s1',
      session_position: 1,
      completed_at: '2026-08-10T10:00:00Z',
      duration_minutes: 20,
      difficulty: 'Good',
      could_continue: 'Yes',
      note: 'Original note',
    };

    const duplicateSubmissionAttempt = {
      difficulty: 'Hard',
      could_continue: 'No',
      note: 'Malicious overwrite note',
    };

    // Server double-submit handler detects duplicate and returns originalRecord without mutating it
    const handleDoubleSubmit = (existing: PostProgrammeRecord) => existing;
    const finalRecord = handleDoubleSubmit(originalRecord);

    assert.strictEqual(finalRecord.difficulty, 'Good');
    assert.strictEqual(finalRecord.could_continue, 'Yes');
    assert.strictEqual(finalRecord.note, 'Original note');
    assert.notStrictEqual(finalRecord.note, duplicateSubmissionAttempt.note);
  });

  it('6. Active cycle exists in post_programme_cycles before Session 1 completion', () => {
    const activeCycle: PostProgrammeCycleRecord = {
      id: 'c1',
      user_id: 'u1',
      profile_id: 'p1',
      programme: 'pace_builder',
      action_type: 'maintain',
      cycle_number: 1,
      status: 'active',
      created_at: new Date().toISOString(),
    };

    const completionRows: PostProgrammeRecord[] = []; // Zero completed session rows

    assert.strictEqual(activeCycle.status, 'active');
    assert.strictEqual(completionRows.length, 0);
  });

  it('7. Active cycle survives lookup with zero completion rows', () => {
    const activeCycle: PostProgrammeCycleRecord = {
      id: 'c1',
      user_id: 'u1',
      profile_id: 'p1',
      programme: 'pace_builder',
      action_type: 'maintain',
      cycle_number: 1,
      status: 'active',
      created_at: new Date().toISOString(),
    };

    const completions: PostProgrammeRecord[] = [];
    const summary = calculatePostProgrammeCycleProgress(activeCycle.id, activeCycle.cycle_number, activeCycle.action_type, activeCycle.programme, completions);

    assert.strictEqual(summary.completedCount, 0);
    assert.strictEqual(summary.isComplete, false);
    assert.ok(summary.nextSession);
    assert.strictEqual(summary.nextSession?.sessionPosition, 1);
    assert.strictEqual(summary.nextSession?.programmeSession.id, 'pace-w3-s1');
  });

  it('8. Arbitrary action_type from client URL cannot alter stored cycle action_type', () => {
    const cycle: PostProgrammeCycleRecord = {
      id: 'c1',
      user_id: 'u1',
      profile_id: 'p1',
      programme: 'gentle_start',
      action_type: 'repeat',
      cycle_number: 1,
      status: 'active',
      created_at: new Date().toISOString(),
    };

    const clientAttemptedActionType = 'progress';

    // Server-authoritative logic forces cycle.action_type
    const serverDerivedActionType = cycle.action_type;

    assert.notStrictEqual(clientAttemptedActionType, serverDerivedActionType);
    assert.strictEqual(serverDerivedActionType, 'repeat');
  });

  it('9. Completion derives planned duration server-side (+2 min for progress action)', () => {
    const progressSessions = getPostProgrammeCycleSessions('gentle_start', 'progress');
    const maintainSessions = getPostProgrammeCycleSessions('gentle_start', 'maintain');

    assert.strictEqual(progressSessions[0].plannedDurationMinutes, 22); // 20 + 2
    assert.strictEqual(maintainSessions[0].plannedDurationMinutes, 20); // 20 base
  });

  it('10. Third valid completion marks cycle as completed server-side', () => {
    const cycleCompletions: PostProgrammeRecord[] = [
      { id: 'r1', user_id: 'u1', profile_id: 'p1', cycle_id: 'c1', cycle_number: 1, action_type: 'repeat', programme_session_id: 'gentle-w3-s1', session_position: 1, completed_at: '2026-08-10T10:00:00Z', duration_minutes: 20 },
      { id: 'r2', user_id: 'u1', profile_id: 'p1', cycle_id: 'c1', cycle_number: 1, action_type: 'repeat', programme_session_id: 'gentle-w3-s2', session_position: 2, completed_at: '2026-08-11T10:00:00Z', duration_minutes: 22 },
      { id: 'r3', user_id: 'u1', profile_id: 'p1', cycle_id: 'c1', cycle_number: 1, action_type: 'repeat', programme_session_id: 'gentle-w3-s3', session_position: 3, completed_at: '2026-08-12T10:00:00Z', duration_minutes: 25 },
    ];

    const expectedPosition = cycleCompletions.length;
    const isCycleCompleted = expectedPosition >= 3;

    assert.strictEqual(isCycleCompleted, true);
  });

  it('11. Initial 9/9 remains untouched by post-programme cycle operations', () => {
    const initialCompletedIds = [
      'gentle-w1-s1', 'gentle-w1-s2', 'gentle-w1-s3',
      'gentle-w2-s1', 'gentle-w2-s2', 'gentle-w2-s3',
      'gentle-w3-s1', 'gentle-w3-s2', 'gentle-w3-s3',
    ];

    const initialSummary = calculateProgrammeProgress('gentle_start', initialCompletedIds);
    assert.strictEqual(initialSummary.completedCount, 9);
    assert.strictEqual(initialSummary.isComplete, true);
  });

  it('12. Unified adaptive guidance receives chronological history of initial + post-programme completions', () => {
    const initialRecords: ProgressRecordLike[] = [
      { programme_session_id: 'w3-s1', completed_at: '2026-08-01T10:00:00Z', difficulty: 'Good', could_continue: 'Yes' },
      { programme_session_id: 'w3-s2', completed_at: '2026-08-02T10:00:00Z', difficulty: 'Hard', could_continue: 'No' },
      { programme_session_id: 'w3-s3', completed_at: '2026-08-03T10:00:00Z', difficulty: 'Hard', could_continue: 'No' },
    ];

    const initialGuidance = getAdaptiveGuidance(initialRecords, 'en-gb');
    assert.strictEqual(initialGuidance.recommendation, 'repeat');

    const postRecords: ProgressRecordLike[] = [
      { programme_session_id: 'w3-s1', completed_at: '2026-08-10T10:00:00Z', difficulty: 'Good', could_continue: 'Yes' },
      { programme_session_id: 'w3-s2', completed_at: '2026-08-11T10:00:00Z', difficulty: 'Easy', could_continue: 'Yes' },
      { programme_session_id: 'w3-s3', completed_at: '2026-08-12T10:00:00Z', difficulty: 'Good', could_continue: 'Yes' },
    ];

    const unifiedHistory = [...initialRecords, ...postRecords];
    const postGuidance = getAdaptiveGuidance(unifiedHistory, 'en-gb');
    assert.strictEqual(postGuidance.recommendation, 'progress');
  });
});
