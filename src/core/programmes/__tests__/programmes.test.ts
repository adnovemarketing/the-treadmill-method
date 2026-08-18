import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  getProgrammeDefinition,
  getAllSessions,
  getSessionById,
  isSessionInProgramme,
  getNextSession,
  calculateProgrammeProgress,
} from '../helpers';

describe('Programme Library & Helpers (The Treadmill Method)', () => {
  it('1. correct programme library selection returns 9 sessions for each programme', () => {
    const gentle = getProgrammeDefinition('gentle_start');
    const pace = getProgrammeDefinition('pace_builder');
    const incline = getProgrammeDefinition('progressive_incline');

    assert.strictEqual(gentle.weeks.length, 3);
    assert.strictEqual(pace.weeks.length, 3);
    assert.strictEqual(incline.weeks.length, 3);

    assert.strictEqual(getAllSessions('gentle_start').length, 9);
    assert.strictEqual(getAllSessions('pace_builder').length, 9);
    assert.strictEqual(getAllSessions('progressive_incline').length, 9);
  });

  it('2. getSessionById returns correct session metadata', () => {
    const s1 = getSessionById('gentle-w1-s1');
    assert.ok(s1);
    assert.strictEqual(s1?.durationMinutes, 10);
    assert.strictEqual(s1?.effort, 'Easy');

    const sIncline = getSessionById('incline-w3-s3');
    assert.ok(sIncline);
    assert.strictEqual(sIncline?.durationMinutes, 32);
  });

  it('3. isSessionInProgramme validates session ownership correctly', () => {
    assert.strictEqual(isSessionInProgramme('gentle-w1-s1', 'gentle_start'), true);
    assert.strictEqual(isSessionInProgramme('gentle-w1-s1', 'pace_builder'), false);
    assert.strictEqual(isSessionInProgramme('pace-w2-s3', 'pace_builder'), true);
    assert.strictEqual(isSessionInProgramme('non-existent-session', 'progressive_incline'), false);
  });

  it('4. getNextSession advances sequentially from Session 1 to Session 9', () => {
    const next1 = getNextSession('pace_builder', []);
    assert.strictEqual(next1?.id, 'pace-w1-s1');

    const next2 = getNextSession('pace_builder', ['pace-w1-s1']);
    assert.strictEqual(next2?.id, 'pace-w1-s2');

    const allPaceIds = getAllSessions('pace_builder').map((s) => s.id);
    const nextEnd = getNextSession('pace_builder', allPaceIds);
    assert.strictEqual(nextEnd, null); // All 9 completed
  });

  it('5. calculateProgrammeProgress derives correct completion count, total time, and week', () => {
    const completed = ['gentle-w1-s1', 'gentle-w1-s2'];
    const summary = calculateProgrammeProgress('gentle_start', completed);

    assert.strictEqual(summary.completedCount, 2);
    assert.strictEqual(summary.totalCoreSessions, 9);
    assert.strictEqual(summary.progressPercent, 22); // round(2/9 * 100) = 22
    assert.strictEqual(summary.totalDurationMinutes, 22); // 10 + 12
    assert.strictEqual(summary.currentWeek, 1);
    assert.strictEqual(summary.isComplete, false);
  });

  it('6. calculateProgrammeProgress handles duplicate completion IDs gracefully', () => {
    const duplicates = ['gentle-w1-s1', 'gentle-w1-s1', 'gentle-w1-s2'];
    const summary = calculateProgrammeProgress('gentle_start', duplicates);

    // Should filter duplicates against core IDs or sum unique completed core sessions
    assert.strictEqual(summary.completedCount, 2);
    assert.strictEqual(summary.isComplete, false);
  });

  it('7. programme completion logic triggers when all 9 core sessions are logged', () => {
    const allGentleIds = getAllSessions('gentle_start').map((s) => s.id);
    const summary = calculateProgrammeProgress('gentle_start', allGentleIds);

    assert.strictEqual(summary.completedCount, 9);
    assert.strictEqual(summary.progressPercent, 100);
    assert.strictEqual(summary.isComplete, true);
    assert.strictEqual(summary.nextSession, null);
  });
});
