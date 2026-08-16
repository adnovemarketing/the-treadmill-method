-- Migration: 20260816000000_create_quiz_profiles.sql
-- Description: Create public.quiz_profiles table and enable RLS (Phase 1 Infrastructure)

CREATE TABLE IF NOT EXISTS public.quiz_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  quiz_data jsonb NOT NULL,
  programme text NULL,
  starting_level text NULL,
  sessions_per_week integer NULL,
  goal_focus text NULL,
  personal_strategy text NULL,
  preferred_workout_time text NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
-- Access is restricted; anonymous browser clients cannot insert directly.
-- Insertion is handled by the server-side API using SUPABASE_SECRET_KEY.
ALTER TABLE public.quiz_profiles ENABLE ROW LEVEL SECURITY;

-- Optional index for faster profile lookups by email
CREATE INDEX IF NOT EXISTS idx_quiz_profiles_email ON public.quiz_profiles (email);
