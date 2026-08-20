-- Migration: 20260820000000_create_post_programme_progress.sql
-- Description: Create public.post_programme_cycles and public.post_programme_progress tables with RLS and unique completion position constraint (Phase 8D Infrastructure)

-- 1. Create post_programme_cycles table
CREATE TABLE IF NOT EXISTS public.post_programme_cycles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.quiz_profiles(id) ON DELETE CASCADE,
  programme text NOT NULL,
  action_type text NOT NULL CHECK (action_type IN ('repeat', 'maintain', 'progress')),
  cycle_number integer NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz NULL,
  CONSTRAINT unique_user_cycle_number UNIQUE (user_id, cycle_number)
);

-- Partial Unique Index: At most ONE active cycle per user at any time
CREATE UNIQUE INDEX IF NOT EXISTS idx_post_prog_cycles_active_user 
  ON public.post_programme_cycles (user_id) 
  WHERE (status = 'active');

-- Index for fast user cycles lookup
CREATE INDEX IF NOT EXISTS idx_post_prog_cycles_user_status 
  ON public.post_programme_cycles (user_id, status);

-- Enable RLS for post_programme_cycles
ALTER TABLE public.post_programme_cycles ENABLE ROW LEVEL SECURITY;

-- SELECT policy: Authenticated users can view their own cycles
CREATE POLICY "Users can view own post programme cycles"
  ON public.post_programme_cycles
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Note: No INSERT/UPDATE/DELETE policies for authenticated role on post_programme_cycles.
-- Cycle creation and completion are managed exclusively via privileged server logic (service role / secret client).


-- 2. Create post_programme_progress table
CREATE TABLE IF NOT EXISTS public.post_programme_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.quiz_profiles(id) ON DELETE CASCADE,
  cycle_id uuid NOT NULL REFERENCES public.post_programme_cycles(id) ON DELETE CASCADE,
  cycle_number integer NOT NULL,
  action_type text NOT NULL CHECK (action_type IN ('repeat', 'maintain', 'progress')),
  programme_session_id text NOT NULL,
  session_position integer NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  duration_minutes integer NOT NULL,
  difficulty text NULL,
  could_continue text NULL,
  note text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unique_cycle_session_position UNIQUE (cycle_id, session_position)
);

-- Enable RLS for post_programme_progress
ALTER TABLE public.post_programme_progress ENABLE ROW LEVEL SECURITY;

-- SELECT policy: Authenticated users can view their own session completions
CREATE POLICY "Users can view own post programme progress"
  ON public.post_programme_progress
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Note: No INSERT/UPDATE/DELETE policies for authenticated role on post_programme_progress.
-- Completion writes are managed exclusively via privileged server logic (service role / secret client).

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_post_prog_user_date ON public.post_programme_progress (user_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_prog_user_cycle ON public.post_programme_progress (user_id, cycle_id);
