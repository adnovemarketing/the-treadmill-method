-- Migration: 20260828000000_create_purchase_items.sql
-- Description: Create public.purchase_items table for itemized purchase entitlements with RLS

CREATE TABLE IF NOT EXISTS public.purchase_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id uuid NOT NULL REFERENCES public.purchases(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.quiz_profiles(id) ON DELETE CASCADE,
  stripe_price_id text NOT NULL,
  product_key text NOT NULL,
  amount integer NULL,
  currency text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT purchase_items_purchase_price_unique UNIQUE (purchase_id, stripe_price_id)
);

-- Enable Row Level Security (RLS)
-- Access is restricted; anonymous browser clients cannot insert or select directly.
-- All writes and checks are performed server-side via SUPABASE_SECRET_KEY / server client.
ALTER TABLE public.purchase_items ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_purchase_items_purchase_id ON public.purchase_items (purchase_id);
CREATE INDEX IF NOT EXISTS idx_purchase_items_profile_id ON public.purchase_items (profile_id);
CREATE INDEX IF NOT EXISTS idx_purchase_items_product_key ON public.purchase_items (product_key);
