// Tipos e Enums para The Treadmill Method

export type PrimaryGoal = 'weight_loss' | 'cardio_endurance' | 'consistency' | 'stress_relief' | 'general_health';

export type AgeGroup = '18_24' | '25_34' | '35_44' | '45_54' | '55_plus';

export type BiomechanicsGender = 'male' | 'female' | 'other';

export type WeeklyAccess = '1_2_days' | '3_4_days' | '5_plus_days' | 'no_access_yet';

export type CardioFitnessLevel = 'beginner' | 'intermediate' | 'advanced' | 'poor_fitness';

export interface JointSensitivities {
  knees: boolean;
  ankles: boolean;
  lowerBack: boolean;
  none: boolean;
}

export type SleepDuration = 'less_5h' | '5_to_6h' | '6_to_7h' | '7_to_8h' | 'more_8h';

export type WaterIntake = 'less_1L' | '1_to_2L' | '2_to_3L' | 'more_3L';

export type JobActivity = 'sedentary' | 'light_movement' | 'moderate' | 'very_active';

export type NutritionBaseline = 'carbs_heavy' | 'balanced' | 'low_carb_keto' | 'unstructured';

export type ImportantEvent = 'wedding' | 'vacation' | 'birthday' | 'health_goal' | 'no_specific_date';

export type MainBlocker = 'boredom' | 'time_constraint' | 'joint_pain' | 'lack_of_guidance' | 'none';

export type PreferredWorkoutTime = 'morning' | 'midday' | 'evening' | 'not_sure';

export interface QuizData {
  primaryGoal: PrimaryGoal | null;
  ageGroup: AgeGroup | null;
  biomechanicsGender: BiomechanicsGender | null;
  weeklyAccess: WeeklyAccess | null;
  cardioFitnessLevel: CardioFitnessLevel | null;
  hasInclineAccess: boolean;
  jointSensitivities: JointSensitivities;
  sleepDuration: SleepDuration | null;
  waterIntake: WaterIntake | null;
  jobActivity: JobActivity | null;
  nutritionBaseline: NutritionBaseline | null;
  weight: number | null; // em kg
  height: number | null; // em cm
  targetWeight: number | null; // em kg
  weightUnit: 'kg' | 'lb';
  heightUnit: 'cm' | 'ft';
  importantEvent: ImportantEvent | null;
  mainBlocker: MainBlocker | null;
  preferredWorkoutTime: PreferredWorkoutTime | null;
  readyToChange: boolean | null;
  email: string | null;
  profileId?: string | null;
}

export interface QuizProfileApiRequest {
  email: string;
  quizData: QuizData;
}

export interface QuizProfileApiResponse {
  success: boolean;
  profile_id?: string;
  error?: string;
}


export type QuizStep =
  | 'onboarding-basics'
  | 'age-selection'
  | 'gender-selection'
  | 'treadmill-frequency'
  | 'cardio-level'
  | 'incline-profile'
  | 'injury-triage'
  | 'sleep-quality'
  | 'water-intake'
  | 'daily-activity'
  | 'daily-nutrition'
  | 'antropometria'
  | 'important-event'
  | 'mindset-blockers'
  | 'educational-transition'
  | 'loading-calculation'
  | 'report-projection'
  | 'email-capture';
