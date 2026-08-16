import 'server-only';
import { createClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase client utilizing SUPABASE_SECRET_KEY for privileged operations.
 * Protected with Next.js 'server-only' to prevent accidental client-side usage.
 */
export function getSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      'Supabase server configuration error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY must be set in environment variables.'
    );
  }

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
