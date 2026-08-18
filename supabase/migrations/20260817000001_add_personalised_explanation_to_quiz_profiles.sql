-- Migration: 20260817000001_add_personalised_explanation_to_quiz_profiles.sql
-- Description: Add personalised_explanation column to public.quiz_profiles (Phase 4 Infrastructure)

ALTER TABLE public.quiz_profiles
ADD COLUMN IF NOT EXISTS personalised_explanation text NULL;
