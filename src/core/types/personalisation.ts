import { PreferredWorkoutTime } from './quiz';

export type ProgrammeType = 'gentle_start' | 'progressive_incline' | 'pace_builder';

export type StartingLevelType = 'gentle' | 'standard' | 'progressive';

export type GoalFocusType =
  | 'weight_loss'
  | 'cardio_endurance'
  | 'consistency'
  | 'stress_relief'
  | 'general_health';

export type PersonalStrategyType =
  | 'minimum_session_rule'
  | 'variety_without_complexity'
  | 'walking_appointments'
  | 'comfort_first'
  | 'never_miss_twice';

export interface PersonalisedPlan {
  programme: ProgrammeType;
  starting_level: StartingLevelType;
  sessions_per_week: number;
  goal_focus: GoalFocusType;
  personal_strategy: PersonalStrategyType;
  preferred_workout_time: PreferredWorkoutTime | null;
  personalised_explanation: string;
}

export interface PersonalisedPlanDisplayLabels {
  programmeLabel: string;
  startingLevelLabel: string;
  sessionsPerWeekLabel: string;
  goalFocusLabel: string;
  personalStrategyLabel: string;
  preferredWorkoutTimeLabel: string;
  personalisedExplanation: string;
}
