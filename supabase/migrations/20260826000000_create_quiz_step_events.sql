-- Migration: 20260826000000_create_quiz_step_events.sql
-- Description: Create public.quiz_step_events table and add session_id to public.quiz_profiles

CREATE TABLE IF NOT EXISTS public.quiz_step_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  session_id uuid NOT NULL,

  event_type text NOT NULL
    CHECK (
      event_type IN (
        'quiz_started',
        'step_viewed',
        'question_answered',
        'lead_submitted',
        'offer_cta_clicked',
        'checkout_started'
      )
    ),

  step_slug text NULL
    CHECK (
      step_slug IS NULL
      OR (
        length(btrim(step_slug)) >= 1
        AND length(step_slug) <= 100
      )
    ),

  step_number integer NULL
    CHECK (
      step_number IS NULL
      OR step_number BETWEEN 1 AND 30
    ),

  payload jsonb NULL,

  created_at timestamptz NOT NULL DEFAULT now(),

  -- Step views must always identify the step.
  CONSTRAINT quiz_step_view_requires_step
    CHECK (
      event_type <> 'step_viewed'
      OR (step_slug IS NOT NULL AND step_number IS NOT NULL)
    ),

  -- Answer events must identify the answered step.
  CONSTRAINT quiz_answer_requires_step
    CHECK (
      event_type <> 'question_answered'
      OR step_slug IS NOT NULL
    )
);

-- Enable RLS.
-- No browser/client write policy is intentionally created.
-- Writes are performed only through privileged server-side logic.
ALTER TABLE public.quiz_step_events ENABLE ROW LEVEL SECURITY;

-- Indexes for efficient funnel querying.
CREATE INDEX IF NOT EXISTS idx_quiz_events_session
  ON public.quiz_step_events (session_id);

CREATE INDEX IF NOT EXISTS idx_quiz_events_type_step
  ON public.quiz_step_events (event_type, step_slug);

-- Prevent duplicate step views for the same anonymous journey.
CREATE UNIQUE INDEX IF NOT EXISTS idx_quiz_unique_step_view
  ON public.quiz_step_events (session_id, step_slug)
  WHERE event_type = 'step_viewed';

-- Link anonymous quiz journey to completed quiz profile.
ALTER TABLE public.quiz_profiles
  ADD COLUMN IF NOT EXISTS session_id uuid NULL;

CREATE INDEX IF NOT EXISTS idx_quiz_profiles_session
  ON public.quiz_profiles (session_id);