import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getAdaptiveGuidance, ProgressRecordLike } from '../adaptive';

describe('Adaptive Guidance Engine (Phase 7)', () => {
  it('1. last 3: Hard/No, Hard/No, Good/Yes -> repeat', () => {
    const records: ProgressRecordLike[] = [
      { programme_session_id: 's1', completed_at: '2026-08-01T10:00:00Z', difficulty: 'Good', could_continue: 'Yes' },
      { programme_session_id: 's2', completed_at: '2026-08-02T10:00:00Z', difficulty: 'Hard', could_continue: 'No' },
      { programme_session_id: 's3', completed_at: '2026-08-03T10:00:00Z', difficulty: 'Hard', could_continue: 'No' },
    ];

    const result = getAdaptiveGuidance(records, 'en-gb');
    assert.strictEqual(result.recommendation, 'repeat');
    assert.strictEqual(result.recommendationTitle, 'Repeat Your Final Week');
  });

  it('2. last 3: Good/Yes, Easy/Yes, Good/Maybe -> progress', () => {
    const records: ProgressRecordLike[] = [
      { programme_session_id: 's1', completed_at: '2026-08-01T10:00:00Z', difficulty: 'Good', could_continue: 'Yes' },
      { programme_session_id: 's2', completed_at: '2026-08-02T10:00:00Z', difficulty: 'Easy', could_continue: 'Yes' },
      { programme_session_id: 's3', completed_at: '2026-08-03T10:00:00Z', difficulty: 'Good', could_continue: 'Maybe' },
    ];

    const result = getAdaptiveGuidance(records, 'en-gb');
    assert.strictEqual(result.recommendation, 'progress');
    assert.strictEqual(result.recommendationTitle, 'Progress Gradually');
  });

  it('3. mixed: Good/Maybe, Hard/Yes, Good/Yes -> maintain', () => {
    const records: ProgressRecordLike[] = [
      { programme_session_id: 's1', completed_at: '2026-08-01T10:00:00Z', difficulty: 'Good', could_continue: 'Maybe' },
      { programme_session_id: 's2', completed_at: '2026-08-02T10:00:00Z', difficulty: 'Hard', could_continue: 'Yes' },
      { programme_session_id: 's3', completed_at: '2026-08-03T10:00:00Z', difficulty: 'Good', could_continue: 'Yes' },
    ];

    const result = getAdaptiveGuidance(records, 'en-gb');
    assert.strictEqual(result.recommendation, 'maintain');
    assert.strictEqual(result.recommendationTitle, 'Maintain Your Current Routine');
  });

  it('4. final session Hard + No alone triggers repeat even if previous two were manageable', () => {
    const records: ProgressRecordLike[] = [
      { programme_session_id: 's1', completed_at: '2026-08-01T10:00:00Z', difficulty: 'Easy', could_continue: 'Yes' },
      { programme_session_id: 's2', completed_at: '2026-08-02T10:00:00Z', difficulty: 'Good', could_continue: 'Yes' },
      { programme_session_id: 's3', completed_at: '2026-08-03T10:00:00Z', difficulty: 'Hard', could_continue: 'No' },
    ];

    const result = getAdaptiveGuidance(records, 'en-gb');
    assert.strictEqual(result.recommendation, 'repeat');
    assert.ok(result.reason.includes('Repeat Week 3'));
  });

  it('5. fewer than 3 sessions -> maintain', () => {
    const records: ProgressRecordLike[] = [
      { programme_session_id: 's1', completed_at: '2026-08-01T10:00:00Z', difficulty: 'Hard', could_continue: 'No' },
      { programme_session_id: 's2', completed_at: '2026-08-02T10:00:00Z', difficulty: 'Hard', could_continue: 'No' },
    ];

    const result = getAdaptiveGuidance(records, 'en-gb');
    assert.strictEqual(result.recommendation, 'maintain');
    assert.ok(result.reason.includes('There is not enough recent session feedback'));
  });

  it('6. recent Hard + No produces contextual next-session warning', () => {
    const records: ProgressRecordLike[] = [
      { programme_session_id: 's1', completed_at: '2026-08-01T10:00:00Z', difficulty: 'Hard', could_continue: 'No' },
    ];

    const result = getAdaptiveGuidance(records, 'en-gb');
    assert.ok(result.contextualNotice);
    assert.ok(result.contextualNotice.includes('challenging'));
  });

  it('7. Easy + Yes does not produce a warning', () => {
    const records: ProgressRecordLike[] = [
      { programme_session_id: 's1', completed_at: '2026-08-01T10:00:00Z', difficulty: 'Easy', could_continue: 'Yes' },
    ];

    const result = getAdaptiveGuidance(records, 'en-gb');
    assert.strictEqual(result.contextualNotice, null);
  });

  it('8. Validation case: Good+Yes / Hard+No / Hard+No -> repeat', () => {
    const records: ProgressRecordLike[] = [
      { programme_session_id: 'w3-s1', completed_at: '2026-08-01T10:00:00Z', difficulty: 'Good', could_continue: 'Yes' },
      { programme_session_id: 'w3-s2', completed_at: '2026-08-02T10:00:00Z', difficulty: 'Hard', could_continue: 'No' },
      { programme_session_id: 'w3-s3', completed_at: '2026-08-03T10:00:00Z', difficulty: 'Hard', could_continue: 'No' },
    ];

    const result = getAdaptiveGuidance(records, 'en-gb');
    assert.strictEqual(result.recommendation, 'repeat');
  });

  it('9. Portuguese locale formatting', () => {
    const records: ProgressRecordLike[] = [
      { programme_session_id: 's1', completed_at: '2026-08-01T10:00:00Z', difficulty: 'Hard', could_continue: 'No' },
      { programme_session_id: 's2', completed_at: '2026-08-02T10:00:00Z', difficulty: 'Hard', could_continue: 'No' },
      { programme_session_id: 's3', completed_at: '2026-08-03T10:00:00Z', difficulty: 'Hard', could_continue: 'No' },
    ];

    const result = getAdaptiveGuidance(records, 'pt-br');
    assert.strictEqual(result.recommendationTitle, 'Repita Sua Última Semana');
    assert.ok(result.reason.includes('Semana 3'));
    assert.ok(result.contextualNotice?.includes('desafiador'));
  });
});
