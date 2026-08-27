-- Migration: 20260827000000_make_quiz_profiles_email_nullable.sql
-- Description: Allow email column to be NULL in public.quiz_profiles and enforce unique session_id for idempotent profile creation

ALTER TABLE public.quiz_profiles
ALTER COLUMN email DROP NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_quiz_profiles_session_unique
ON public.quiz_profiles (session_id)
WHERE session_id IS NOT NULL;
