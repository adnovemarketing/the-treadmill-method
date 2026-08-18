'use server';

import { createSupabaseServerAppClient } from '@/lib/supabase/server';
import { recordSessionCompletion, RecordSessionInput } from '@/lib/progressServer';

export async function recordSessionCompletionAction(input: RecordSessionInput) {
  const supabase = await createSupabaseServerAppClient();
  const { data } = await supabase.auth.getUser();

  if (!data?.user || data.user.id !== input.userId) {
    return { success: false, error: 'Unauthorized.' };
  }

  return await recordSessionCompletion(input);
}
