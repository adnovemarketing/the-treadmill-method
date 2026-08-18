import { QuizData, PreferredWorkoutTime, MainBlocker, PrimaryGoal } from '../types/quiz';
import {
  PersonalisedPlan,
  ProgrammeType,
  StartingLevelType,
  GoalFocusType,
  PersonalStrategyType,
  PersonalisedPlanDisplayLabels,
} from '../types/personalisation';

/**
 * Pure, deterministic central Personalisation Engine for The Treadmill Method.
 *
 * Side-effect free: Does not invoke Supabase, Stripe, external APIs, or AI.
 * Deterministically maps quiz input state to a persisted personalized profile.
 */
export function generatePersonalisedPlan(quizData: Partial<QuizData> | null | undefined): PersonalisedPlan {
  const safeData: Partial<QuizData> = quizData || {};

  // 1. Joint sensitivity check (knee, ankle, lower back)
  const sensitivities = safeData.jointSensitivities;
  const hasJointSensitivities = Boolean(
    sensitivities && (sensitivities.knees || sensitivities.ankles || sensitivities.lowerBack)
  );

  // 2. Programme Determination
  // Rule Precedence 1: gentle_start if joint sensitivity reported
  // Rule Precedence 2: progressive_incline if NO sensitivity AND incline access AND intermediate/advanced fitness
  // Rule Precedence 3: pace_builder (default)
  let programme: ProgrammeType = 'pace_builder';

  if (hasJointSensitivities) {
    programme = 'gentle_start';
  } else if (
    safeData.hasInclineAccess &&
    (safeData.cardioFitnessLevel === 'intermediate' || safeData.cardioFitnessLevel === 'advanced')
  ) {
    programme = 'progressive_incline';
  }

  // 3. Starting Level Determination
  // Base mapping:
  //   poor_fitness / beginner -> gentle
  //   intermediate -> standard
  //   advanced -> progressive
  // Precedence Rule: If joint sensitivity exists, starting_level must NEVER be progressive (cap at standard/gentle).
  let starting_level: StartingLevelType = 'gentle';

  if (safeData.cardioFitnessLevel === 'advanced') {
    starting_level = hasJointSensitivities ? 'standard' : 'progressive';
  } else if (safeData.cardioFitnessLevel === 'intermediate') {
    starting_level = 'standard';
  } else {
    starting_level = 'gentle';
  }

  // 4. Weekly Schedule Determination (sessions_per_week)
  // Conceptual mapping:
  //   1–2 days -> 2
  //   3–4 days -> 3
  //   5+ days -> 5
  //   no_access_yet -> conservative schedule (2)
  // Readiness rule: If readyToChange === false (prefers slow start), cap at 3.
  let sessions_per_week = 2;

  switch (safeData.weeklyAccess) {
    case '5_plus_days':
      sessions_per_week = 5;
      break;
    case '3_4_days':
      sessions_per_week = 3;
      break;
    case '1_2_days':
    case 'no_access_yet':
    default:
      sessions_per_week = 2;
      break;
  }

  if (safeData.readyToChange === false) {
    sessions_per_week = Math.min(sessions_per_week, 3);
  }

  // 5. Goal Focus Determination
  let goal_focus: GoalFocusType = 'general_health';

  const goalInput: PrimaryGoal | null | undefined = safeData.primaryGoal;
  switch (goalInput) {
    case 'weight_loss':
      goal_focus = 'weight_loss';
      break;
    case 'cardio_endurance':
      goal_focus = 'cardio_endurance';
      break;
    case 'consistency':
      goal_focus = 'consistency';
      break;
    case 'stress_relief':
      goal_focus = 'stress_relief';
      break;
    case 'general_health':
    default:
      goal_focus = 'general_health';
      break;
  }

  // 6. Personal Strategy Determination
  let personal_strategy: PersonalStrategyType = 'never_miss_twice';

  const blockerInput: MainBlocker | null | undefined = safeData.mainBlocker;
  switch (blockerInput) {
    case 'time_constraint':
      personal_strategy = 'minimum_session_rule';
      break;
    case 'boredom':
      personal_strategy = 'variety_without_complexity';
      break;
    case 'lack_of_guidance':
      personal_strategy = 'walking_appointments';
      break;
    case 'joint_pain':
      personal_strategy = 'comfort_first';
      break;
    case 'none':
    default:
      personal_strategy = 'never_miss_twice';
      break;
  }

  // 7. Preferred Workout Time
  const preferred_workout_time: PreferredWorkoutTime | null = safeData.preferredWorkoutTime || null;

  // 8. Controlled Personalised Explanation Generation
  // Deterministic safe templates. 1–3 short sentences max. No AI. No health/medical claims.
  const explanationSentences: string[] = [];

  if (hasJointSensitivities) {
    explanationSentences.push(
      'You reported some sensitivity during movement, so your starting programme uses a gentler approach and avoids aggressive progression.'
    );
  } else if (safeData.readyToChange === false) {
    explanationSentences.push(
      "Because you told us you'd prefer to begin gradually, we've deliberately kept your starting routine manageable."
    );
  } else if (safeData.cardioFitnessLevel === 'poor_fitness' || safeData.cardioFitnessLevel === 'beginner') {
    explanationSentences.push(
      'Because brisk walking currently feels challenging for you, your programme begins with shorter, comfortable sessions before increasing gradually.'
    );
  } else if (programme === 'progressive_incline') {
    explanationSentences.push(
      'You told us you have access to treadmill incline and already feel reasonably comfortable with brisk walking, so your programme introduces controlled incline gradually.'
    );
  } else {
    explanationSentences.push(
      'Your plan is structured around your stated goal of building a more sustainable walking routine.'
    );
  }

  explanationSentences.push(
    'Your walking schedule reflects the number of days you told us you can realistically commit to.'
  );

  const personalised_explanation = explanationSentences.join(' ');

  return {
    programme,
    starting_level,
    sessions_per_week,
    goal_focus,
    personal_strategy,
    preferred_workout_time,
    personalised_explanation,
  };
}

/**
 * Returns human-readable display labels for a PersonalisedPlan.
 */
export function getPersonalisedPlanDisplayLabels(
  plan: PersonalisedPlan,
  locale: string = 'en-gb'
): PersonalisedPlanDisplayLabels {
  const isPtBr = locale.toLowerCase() === 'pt-br';

  const programmeMap: Record<ProgrammeType, { en: string; pt: string }> = {
    gentle_start: { en: 'Gentle Start', pt: 'Gentle Start (Início Suave)' },
    pace_builder: { en: 'Pace Builder', pt: 'Pace Builder (Construção de Ritmo)' },
    progressive_incline: { en: 'Progressive Incline', pt: 'Progressive Incline (Inclinação Progressiva)' },
  };

  const levelMap: Record<StartingLevelType, { en: string; pt: string }> = {
    gentle: { en: 'Gentle', pt: 'Suave' },
    standard: { en: 'Standard', pt: 'Padrão' },
    progressive: { en: 'Progressive', pt: 'Progressivo' },
  };

  const goalMap: Record<GoalFocusType, { en: string; pt: string }> = {
    weight_loss: { en: 'Sustainable Weight Management', pt: 'Gestão Sustentável de Peso' },
    cardio_endurance: { en: 'Cardio & Stamina', pt: 'Cardio e Resistência' },
    consistency: { en: 'Consistency & Habit', pt: 'Consistência e Hábito' },
    stress_relief: { en: 'Stress Relief', pt: 'Alívio de Estresse' },
    general_health: { en: 'Health & Longevity', pt: 'Saúde e Longevidade' },
  };

  const strategyMap: Record<PersonalStrategyType, { en: string; pt: string }> = {
    minimum_session_rule: { en: 'The Minimum Session Rule', pt: 'A Regra da Sessão Mínima' },
    variety_without_complexity: { en: 'Variety Without Complexity', pt: 'Variedade sem Complexidade' },
    walking_appointments: { en: 'Walking Appointments', pt: 'Compromisso com a Caminhada' },
    comfort_first: { en: 'Comfort First', pt: 'Conforto em Primeiro Lugar' },
    never_miss_twice: { en: 'Never Miss Twice', pt: 'Nunca Falte Duas Vezes' },
  };

  const timeMap: Record<PreferredWorkoutTime, { en: string; pt: string }> = {
    morning: { en: 'Morning', pt: 'Manhã' },
    midday: { en: 'Midday', pt: 'Meio-dia' },
    evening: { en: 'Evening', pt: 'Noite' },
    not_sure: { en: 'Flexible / Not Sure', pt: 'Flexível / Não decidido' },
  };

  const p = plan.programme;
  const l = plan.starting_level;
  const g = plan.goal_focus;
  const s = plan.personal_strategy;
  const t = plan.preferred_workout_time;

  return {
    programmeLabel: isPtBr ? programmeMap[p]?.pt || p : programmeMap[p]?.en || p,
    startingLevelLabel: isPtBr ? levelMap[l]?.pt || l : levelMap[l]?.en || l,
    sessionsPerWeekLabel: isPtBr
      ? `${plan.sessions_per_week} Dias / Semana`
      : `${plan.sessions_per_week} Days / Week`,
    goalFocusLabel: isPtBr ? goalMap[g]?.pt || g : goalMap[g]?.en || g,
    personalStrategyLabel: isPtBr ? strategyMap[s]?.pt || s : strategyMap[s]?.en || s,
    preferredWorkoutTimeLabel: t
      ? isPtBr
        ? timeMap[t]?.pt || t
        : timeMap[t]?.en || t
      : isPtBr
      ? 'Não especificado'
      : 'Not specified',
    personalisedExplanation: plan.personalised_explanation,
  };
}
