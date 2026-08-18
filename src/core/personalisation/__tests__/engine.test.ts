import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generatePersonalisedPlan } from '../engine';
import { QuizData } from '../../types/quiz';

describe('Personalisation Engine (The Treadmill Method)', () => {
  const baseQuizData: QuizData = {
    primaryGoal: 'general_health',
    ageGroup: '35_44',
    biomechanicsGender: 'female',
    weeklyAccess: '3_4_days',
    cardioFitnessLevel: 'intermediate',
    hasInclineAccess: true,
    jointSensitivities: {
      knees: false,
      ankles: false,
      lowerBack: false,
      none: true,
    },
    sleepDuration: '7_to_8h',
    waterIntake: '2_to_3L',
    jobActivity: 'moderate',
    nutritionBaseline: 'balanced',
    weight: 70,
    height: 165,
    targetWeight: 65,
    weightUnit: 'kg',
    heightUnit: 'cm',
    importantEvent: 'no_specific_date',
    mainBlocker: 'none',
    preferredWorkoutTime: 'morning',
    readyToChange: true,
    email: 'test@example.com',
  };

  // Scenario 1: joint sensitivity overrides progressive incline
  it('1. joint sensitivity overrides progressive incline -> gentle_start', () => {
    const data: QuizData = {
      ...baseQuizData,
      hasInclineAccess: true,
      cardioFitnessLevel: 'advanced',
      jointSensitivities: { knees: true, ankles: false, lowerBack: false, none: false },
    };
    const plan = generatePersonalisedPlan(data);
    assert.strictEqual(plan.programme, 'gentle_start');
  });

  // Scenario 2: intermediate + incline + no sensitivity -> progressive_incline
  it('2. intermediate + incline + no sensitivity -> progressive_incline', () => {
    const data: QuizData = {
      ...baseQuizData,
      hasInclineAccess: true,
      cardioFitnessLevel: 'intermediate',
      jointSensitivities: { knees: false, ankles: false, lowerBack: false, none: true },
    };
    const plan = generatePersonalisedPlan(data);
    assert.strictEqual(plan.programme, 'progressive_incline');
  });

  // Scenario 3: no incline -> pace_builder
  it('3. no incline -> pace_builder', () => {
    const data: QuizData = {
      ...baseQuizData,
      hasInclineAccess: false,
      cardioFitnessLevel: 'advanced',
      jointSensitivities: { knees: false, ankles: false, lowerBack: false, none: true },
    };
    const plan = generatePersonalisedPlan(data);
    assert.strictEqual(plan.programme, 'pace_builder');
  });

  // Scenario 4: low fitness -> gentle starting level
  it('4. low fitness -> gentle starting level', () => {
    const dataPoor: QuizData = {
      ...baseQuizData,
      cardioFitnessLevel: 'poor_fitness',
    };
    const dataBeginner: QuizData = {
      ...baseQuizData,
      cardioFitnessLevel: 'beginner',
    };
    assert.strictEqual(generatePersonalisedPlan(dataPoor).starting_level, 'gentle');
    assert.strictEqual(generatePersonalisedPlan(dataBeginner).starting_level, 'gentle');
  });

  // Scenario 5: advanced + sensitivity -> not progressive starting level
  it('5. advanced + sensitivity -> capped at standard starting level', () => {
    const data: QuizData = {
      ...baseQuizData,
      cardioFitnessLevel: 'advanced',
      jointSensitivities: { knees: false, ankles: false, lowerBack: true, none: false },
    };
    const plan = generatePersonalisedPlan(data);
    assert.notStrictEqual(plan.starting_level, 'progressive');
    assert.strictEqual(plan.starting_level, 'standard');
  });

  // Scenario 6: 5+ days + readyToChange=false -> max 3 sessions
  it('6. 5+ days + readyToChange=false -> capped at 3 sessions', () => {
    const data: QuizData = {
      ...baseQuizData,
      weeklyAccess: '5_plus_days',
      readyToChange: false,
    };
    const plan = generatePersonalisedPlan(data);
    assert.strictEqual(plan.sessions_per_week, 3);
  });

  // Scenario 7: blocker mapping
  it('7. blocker mapping maps all mainBlockers correctly', () => {
    assert.strictEqual(
      generatePersonalisedPlan({ ...baseQuizData, mainBlocker: 'time_constraint' }).personal_strategy,
      'minimum_session_rule'
    );
    assert.strictEqual(
      generatePersonalisedPlan({ ...baseQuizData, mainBlocker: 'boredom' }).personal_strategy,
      'variety_without_complexity'
    );
    assert.strictEqual(
      generatePersonalisedPlan({ ...baseQuizData, mainBlocker: 'lack_of_guidance' }).personal_strategy,
      'walking_appointments'
    );
    assert.strictEqual(
      generatePersonalisedPlan({ ...baseQuizData, mainBlocker: 'joint_pain' }).personal_strategy,
      'comfort_first'
    );
    assert.strictEqual(
      generatePersonalisedPlan({ ...baseQuizData, mainBlocker: 'none' }).personal_strategy,
      'never_miss_twice'
    );
  });

  // Scenario 8: goal mapping
  it('8. goal mapping maps all primaryGoals correctly', () => {
    assert.strictEqual(
      generatePersonalisedPlan({ ...baseQuizData, primaryGoal: 'weight_loss' }).goal_focus,
      'weight_loss'
    );
    assert.strictEqual(
      generatePersonalisedPlan({ ...baseQuizData, primaryGoal: 'cardio_endurance' }).goal_focus,
      'cardio_endurance'
    );
    assert.strictEqual(
      generatePersonalisedPlan({ ...baseQuizData, primaryGoal: 'consistency' }).goal_focus,
      'consistency'
    );
    assert.strictEqual(
      generatePersonalisedPlan({ ...baseQuizData, primaryGoal: 'stress_relief' }).goal_focus,
      'stress_relief'
    );
    assert.strictEqual(
      generatePersonalisedPlan({ ...baseQuizData, primaryGoal: 'general_health' }).goal_focus,
      'general_health'
    );
  });

  // Scenario 9: preferred time passthrough
  it('9. preferred time passthrough works for all times', () => {
    assert.strictEqual(
      generatePersonalisedPlan({ ...baseQuizData, preferredWorkoutTime: 'evening' }).preferred_workout_time,
      'evening'
    );
    assert.strictEqual(
      generatePersonalisedPlan({ ...baseQuizData, preferredWorkoutTime: 'midday' }).preferred_workout_time,
      'midday'
    );
  });

  // Scenario 10: deterministic explanation generation
  it('10. deterministic explanation generation creates valid, safe sentences', () => {
    const plan = generatePersonalisedPlan({
      ...baseQuizData,
      jointSensitivities: { knees: true, ankles: false, lowerBack: false, none: false },
    });
    assert.strictEqual(typeof plan.personalised_explanation, 'string');
    assert.ok(plan.personalised_explanation.length > 20);
    assert.ok(plan.personalised_explanation.includes('sensitivity during movement'));
    // Ensure no forbidden terms
    const text = plan.personalised_explanation.toLowerCase();
    assert.strictEqual(text.includes('medical'), false);
    assert.strictEqual(text.includes('cure'), false);
    assert.strictEqual(text.includes('guarantee'), false);
  });
});
