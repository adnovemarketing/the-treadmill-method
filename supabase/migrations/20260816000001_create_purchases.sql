-- Migration: 20260816000001_create_purchases.sql
-- Description: Create public.purchases table and enable RLS (Phase 2 Infrastructure)

CREATE TABLE IF NOT EXISTS public.purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.quiz_profiles(id) ON DELETE CASCADE,
  user_id uuid NULL,
  stripe_checkout_session_id text NOT NULL UNIQUE,
  stripe_customer_id text NULL,
  payment_status text NOT NULL,
  amount_total integer NULL,
  currency text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz NULL
);

-- Enable Row Level Security (RLS)
-- Access is restricted; anonymous browser clients cannot insert or select directly.
-- Insertion and updates are performed server-side via SUPABASE_SECRET_KEY.
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_purchases_profile_id ON public.purchases (profile_id);
CREATE INDEX IF NOT EXISTS idx_purchases_session_id ON public.purchases (stripe_checkout_session_id);
