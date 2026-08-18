-- Migration: 20260817000200_create_programme_progress.sql
-- Description: Create public.programme_progress table and enable RLS (Phase 5 Infrastructure)

CREATE TABLE IF NOT EXISTS public.programme_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.quiz_profiles(id) ON DELETE CASCADE,
  programme_session_id text NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  duration_minutes integer NOT NULL,
  difficulty text NULL,
  could_continue text NULL,
  note text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_session UNIQUE (user_id, programme_session_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.programme_progress ENABLE ROW LEVEL SECURITY;

-- User-owned RLS Policies: Authenticated users manage their own progress
CREATE POLICY "Users can view own programme progress"
  ON public.programme_progress
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own programme progress"
  ON public.programme_progress
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own programme progress"
  ON public.programme_progress
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_programme_progress_user_id ON public.programme_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_programme_progress_profile_id ON public.programme_progress (profile_id);
