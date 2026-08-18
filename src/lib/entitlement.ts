import { getSupabaseServerClient } from '@/lib/supabaseServer';

export interface EntitlementCheckResult {
  hasEntitlement: boolean;
  userId?: string;
  email?: string;
  purchaseId?: string;
}

/**
 * Server-side entitlement check utility.
 * Verifies whether an authenticated user has a paid purchase record linked via their quiz profile email.
 * If entitled, links purchase.user_id = userId and ensures a public.profiles record exists.
 */
export async function checkAndLinkUserEntitlement(
  userId: string,
  userEmail: string
): Promise<EntitlementCheckResult> {
  if (!userId || !userEmail) {
    return { hasEntitlement: false };
  }

  const normalizedEmail = userEmail.trim().toLowerCase();
  const supabase = getSupabaseServerClient();

  // 1. Ensure public.profiles record exists for the user
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  if (!existingProfile) {
    await supabase.from('profiles').insert({
      id: userId,
      email: normalizedEmail,
    });
  }

  // 2. Locate all quiz profiles matching this email
  const { data: quizProfiles } = await supabase
    .from('quiz_profiles')
    .select('id')
    .eq('email', normalizedEmail);

  if (!quizProfiles || quizProfiles.length === 0) {
    return { hasEntitlement: false, userId, email: normalizedEmail };
  }

  const profileIds = quizProfiles.map((p) => p.id);

  // 3. Search for a paid purchase record matching any of these profile_ids
  const { data: purchase } = await supabase
    .from('purchases')
    .select('id, user_id, payment_status')
    .in('profile_id', profileIds)
    .in('payment_status', ['paid', 'completed', 'active', 'succeeded'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!purchase) {
    return { hasEntitlement: false, userId, email: normalizedEmail };
  }

  // 4. Associate purchase.user_id = user.id if not already associated
  if (purchase.user_id !== userId) {
    await supabase
      .from('purchases')
      .update({ user_id: userId })
      .eq('id', purchase.id);
  }

  return {
    hasEntitlement: true,
    userId,
    email: normalizedEmail,
    purchaseId: purchase.id,
  };
}
