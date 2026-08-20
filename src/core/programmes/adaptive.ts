export type AdaptiveRecommendation = 'repeat' | 'maintain' | 'progress';

export interface ProgressRecordLike {
  programme_session_id: string;
  completed_at: string;
  difficulty?: string | null;
  could_continue?: string | null;
}

export interface AdaptiveGuidanceResult {
  recommendation: AdaptiveRecommendation;
  recommendationTitle: string;
  reason: string;
  contextualNotice: string | null;
}

/**
 * Normalizes difficulty input to exact expected literals
 */
export function normalizeDifficulty(value?: string | null): 'Easy' | 'Good' | 'Hard' | null {
  if (!value) return null;
  const v = value.trim();
  if (v === 'Easy') return 'Easy';
  if (v === 'Good') return 'Good';
  if (v === 'Hard') return 'Hard';
  return null;
}

/**
 * Normalizes could_continue input to exact expected literals
 */
export function normalizeCouldContinue(value?: string | null): 'Yes' | 'Maybe' | 'No' | null {
  if (!value) return null;
  const v = value.trim();
  if (v === 'Yes') return 'Yes';
  if (v === 'Maybe') return 'Maybe';
  if (v === 'No') return 'No';
  return null;
}

/**
 * Pure, deterministic adaptive guidance helper.
 * Evaluates stored post-session feedback to produce:
 * 1. Recommendation for After Day 21 (Repeat, Maintain, or Progress)
 * 2. Contextual next-session notice for during-programme display
 */
export function getAdaptiveGuidance(
  records: ProgressRecordLike[],
  locale: string = 'en-gb'
): AdaptiveGuidanceResult {
  const isPtBr = locale.toLowerCase() === 'pt-br';

  // Sort records descending by completed_at timestamp (newest first)
  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
  );

  // --- 1. CONTEXTUAL NEXT-SESSION NOTICE ---
  let contextualNotice: string | null = null;
  const mostRecent = sortedRecords[0];

  if (mostRecent) {
    const diff = normalizeDifficulty(mostRecent.difficulty);
    const continueVal = normalizeCouldContinue(mostRecent.could_continue);

    if (diff === 'Hard' && continueVal === 'No') {
      contextualNotice = isPtBr
        ? "Seu último treino foi desafiador. Mantenha a caminhada de hoje controlada, diminua o ritmo se necessário e encerre mais cedo se não se sentir confortável."
        : "Your last session felt challenging. Keep today's walk controlled, slow down if needed, and end early if it does not feel appropriate to continue.";
    } else if (
      (diff === 'Hard' && continueVal === 'Maybe') ||
      (diff === 'Good' && continueVal === 'No')
    ) {
      contextualNotice = isPtBr
        ? "Seu último treino foi exigente. Mantenha o esforço controlado hoje e evite aumentar o desafio além do planejado."
        : "Your last session felt demanding. Keep today's effort controlled and avoid increasing the challenge beyond the planned session.";
    }
  }

  // --- 2. AFTER DAY 21 DECISION RULES ---
  if (sortedRecords.length < 3) {
    return {
      recommendation: 'maintain',
      recommendationTitle: isPtBr ? 'Mantenha Sua Rotina Atual' : 'Maintain Your Current Routine',
      reason: isPtBr
        ? 'Ainda não há feedback recente suficiente para fornecer uma recomendação personalizada de progressão. Recomenda-se manter sua rotina atual.'
        : 'There is not enough recent session feedback to provide a custom progression recommendation yet. Maintaining your current routine is recommended.',
      contextualNotice,
    };
  }

  // Take the 3 most recently completed core sessions
  const last3 = sortedRecords.slice(0, 3);
  const finalSession = last3[0]; // newest completed session

  const hardCount = last3.filter((r) => normalizeDifficulty(r.difficulty) === 'Hard').length;
  const noCount = last3.filter((r) => normalizeCouldContinue(r.could_continue) === 'No').length;
  const yesCount = last3.filter((r) => normalizeCouldContinue(r.could_continue) === 'Yes').length;

  const finalDiff = normalizeDifficulty(finalSession.difficulty);
  const finalContinue = normalizeCouldContinue(finalSession.could_continue);

  // RULE A: REPEAT PRECEDENCE
  const isRepeatTriggered =
    hardCount >= 2 ||
    noCount >= 2 ||
    (finalDiff === 'Hard' && finalContinue === 'No');

  if (isRepeatTriggered) {
    let reason = isPtBr
      ? 'Você relatou que várias sessões recentes foram difíceis ou que não continuaria com conforto. Dê mais tempo ao seu nível atual antes de avançar.'
      : 'You reported that several recent sessions felt hard or that you would not have comfortably continued. Give your current level more time before progressing.';

    if (finalDiff === 'Hard' && finalContinue === 'No') {
      reason = isPtBr
        ? 'O feedback das suas sessões recentes indica que sua última semana ainda foi desafiadora. Repita a Semana 3 antes de aumentar a intensidade.'
        : 'Your recent session feedback suggests your final week was still challenging. Repeat Week 3 before increasing anything.';
    }

    return {
      recommendation: 'repeat',
      recommendationTitle: isPtBr ? 'Repita Sua Última Semana' : 'Repeat Your Final Week',
      reason,
      contextualNotice,
    };
  }

  // RULE B: PROGRESS
  const easyOrGoodCount = last3.filter((r) => {
    const d = normalizeDifficulty(r.difficulty);
    return d === 'Easy' || d === 'Good';
  }).length;

  const isProgressTriggered =
    hardCount === 0 &&
    noCount === 0 &&
    yesCount >= 2 &&
    easyOrGoodCount >= 2;

  if (isProgressTriggered) {
    return {
      recommendation: 'progress',
      recommendationTitle: isPtBr ? 'Avance Gradualmente' : 'Progress Gradually',
      reason: isPtBr
        ? 'Suas sessões recentes foram consistentes e confortáveis. Você pode estar pronto para uma pequena progressão.'
        : 'Your recent sessions felt consistently manageable and you generally felt able to continue. You may be ready for a small progression.',
      contextualNotice,
    };
  }

  // RULE C: MAINTAIN (DEFAULT FOR OTHER PATTERNS)
  return {
    recommendation: 'maintain',
    recommendationTitle: isPtBr ? 'Mantenha Sua Rotina Atual' : 'Maintain Your Current Routine',
    reason: isPtBr
      ? 'Seu feedback recente é misto, portanto não há necessidade de aumentar o desafio ainda. Continue com sua rotina atual até que pareça consistente e confortável.'
      : 'Your recent feedback is mixed, so there is no need to increase the challenge yet. Continue with your current routine until it feels consistently manageable.',
    contextualNotice,
  };
}
