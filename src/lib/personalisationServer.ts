import 'server-only';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import { generatePersonalisedPlan, getPersonalisedPlanDisplayLabels } from '@/core/personalisation/engine';
import {
  PersonalisedPlan,
  PersonalisedPlanDisplayLabels,
  ProgrammeType,
  StartingLevelType,
  GoalFocusType,
  PersonalStrategyType,
} from '@/core/types/personalisation';
import { PreferredWorkoutTime } from '@/core/types/quiz';

export interface UserPersonalisedProfileResult {
  success: boolean;
  profileId?: string;
  plan?: PersonalisedPlan;
  labels?: PersonalisedPlanDisplayLabels;
  error?: string;
}

/**
 * Server-only helper to fetch the authenticated user's personalised plan.
 *
 * 1. Identifies the user's paid purchase.
 * 2. Obtains profile_id and fetches quiz_profiles.
 * 3. If personalisation fields are NULL (legacy profile), generates and persists on demand.
 * 4. Returns structured plan data and display labels without exposing raw quiz_data.
 */
export async function getUserPersonalisedProfile(
  userId: string,
  locale: string = 'en-gb'
): Promise<UserPersonalisedProfileResult> {
  if (!userId) {
    return { success: false, error: 'User ID is required.' };
  }

  const supabase = getSupabaseServerClient();

  // 1. Locate the user's paid purchase record
  const { data: purchase, error: purchaseError } = await supabase
    .from('purchases')
    .select('profile_id')
    .eq('user_id', userId)
    .in('payment_status', ['paid', 'completed', 'active', 'succeeded'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (purchaseError || !purchase) {
    return { success: false, error: 'No active paid purchase found for user.' };
  }

  // 2. Fetch the corresponding quiz_profiles record
  const { data: quizProfile, error: profileError } = await supabase
    .from('quiz_profiles')
    .select(
      'id, quiz_data, programme, starting_level, sessions_per_week, goal_focus, personal_strategy, preferred_workout_time, personalised_explanation'
    )
    .eq('id', purchase.profile_id)
    .maybeSingle();

  if (profileError || !quizProfile) {
    return { success: false, error: 'Quiz profile record not found.' };
  }

  let plan: PersonalisedPlan;

  // 3. On-demand fallback/lazy write-back for legacy NULL rows
  if (
    !quizProfile.programme ||
    !quizProfile.starting_level ||
    !quizProfile.sessions_per_week ||
    !quizProfile.goal_focus ||
    !quizProfile.personal_strategy
  ) {
    plan = generatePersonalisedPlan(quizProfile.quiz_data);

    await supabase
      .from('quiz_profiles')
      .update({
        programme: plan.programme,
        starting_level: plan.starting_level,
        sessions_per_week: plan.sessions_per_week,
        goal_focus: plan.goal_focus,
        personal_strategy: plan.personal_strategy,
        preferred_workout_time: plan.preferred_workout_time,
        personalised_explanation: plan.personalised_explanation,
      })
      .eq('id', quizProfile.id);
  } else {
    plan = {
      programme: quizProfile.programme as ProgrammeType,
      starting_level: quizProfile.starting_level as StartingLevelType,
      sessions_per_week: quizProfile.sessions_per_week,
      goal_focus: quizProfile.goal_focus as GoalFocusType,
      personal_strategy: quizProfile.personal_strategy as PersonalStrategyType,
      preferred_workout_time: (quizProfile.preferred_workout_time as PreferredWorkoutTime) || null,
      personalised_explanation:
        quizProfile.personalised_explanation ||
        generatePersonalisedPlan(quizProfile.quiz_data).personalised_explanation,
    };
  }

  const labels = getPersonalisedPlanDisplayLabels(plan, locale);

  return {
    success: true,
    profileId: quizProfile.id,
    plan,
    labels,
  };
}
