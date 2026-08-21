-- ==============================================================================
-- DEVELOPER-ONLY QA ACCOUNT RESET PROCEDURE (HARDENED)
-- ==============================================================================
-- TARGET ACCOUNT (PERMANENT PRODUCTION QA):
--   - QA user_id:         363526cd-7e77-42d9-9e86-dd7458dda901
--   - QA email:           adnove.marketing@gmail.com
--   - Canonical profile_id: 5ba28d09-ae1b-40eb-bbf2-62367591e5c9
--
-- PURPOSE:
--   Resets progress state back to a clean baseline (0 progress rows) after QA testing.
--
-- WHAT IS DELETED:
--   1. public.post_programme_progress (where user_id = QA ID AND profile_id = Canonical Profile ID)
--   2. public.post_programme_cycles   (where user_id = QA ID AND profile_id = Canonical Profile ID)
--   3. public.programme_progress      (where user_id = QA ID AND profile_id = Canonical Profile ID)
--
-- WHAT IS PRESERVED:
--   - auth.users record (matching ID AND email adnove.marketing@gmail.com)
--   - public.quiz_profiles (canonical row: 5ba28d09-ae1b-40eb-bbf2-62367591e5c9)
--   - public.purchases     (paid entitlement record linking QA user ID + canonical profile ID)
--
-- SECURITY & INTEGRITY GUARDRAILS:
--   - User ID, Profile ID, and Email are hard-coded to the whitelisted QA identity only.
--   - Requires BOTH user_id AND profile_id match on all DELETE statements.
--   - Contains pre-execution and atomic post-execution assertion checks.
--   - MUST NEVER BE GENERALIZED OR ACCEPTS ARBITRARY USER IDs.
-- ==============================================================================

DO $$
DECLARE
  c_qa_user_id CONSTANT uuid := '363526cd-7e77-42d9-9e86-dd7458dda901'::uuid;
  c_qa_profile_id CONSTANT uuid := '5ba28d09-ae1b-40eb-bbf2-62367591e5c9'::uuid;
  c_qa_email CONSTANT text := 'adnove.marketing@gmail.com';
  
  v_user_auth_valid boolean;
  v_profile_exists boolean;
  v_entitlement_exists boolean;
  
  v_deleted_post_prog integer := 0;
  v_deleted_cycles integer := 0;
  v_deleted_prog integer := 0;
  
  v_post_check_prog integer;
  v_post_check_post_prog integer;
  v_post_check_cycles integer;
  v_post_check_profile integer;
  v_post_check_entitlement integer;
BEGIN
  -- 1. Safety Check: Verify QA user ID AND email match in auth.users
  SELECT EXISTS(
    SELECT 1 FROM auth.users 
    WHERE id = c_qa_user_id 
      AND lower(email) = lower(c_qa_email)
  ) INTO v_user_auth_valid;

  IF NOT v_user_auth_valid THEN
    RAISE EXCEPTION 'SAFETY ABORT: Target QA auth.users record (ID: %, Email: %) not found or identity mismatch!', c_qa_user_id, c_qa_email;
  END IF;

  -- 2. Safety Check: Verify QA canonical profile exists in quiz_profiles
  SELECT EXISTS(
    SELECT 1 FROM public.quiz_profiles WHERE id = c_qa_profile_id
  ) INTO v_profile_exists;

  IF NOT v_profile_exists THEN
    RAISE EXCEPTION 'SAFETY ABORT: Target QA canonical quiz_profile (%) not found!', c_qa_profile_id;
  END IF;

  -- 3. Safety Check: Verify paid entitlement relationship exists in purchases
  SELECT EXISTS(
    SELECT 1 FROM public.purchases 
    WHERE profile_id = c_qa_profile_id 
      AND user_id = c_qa_user_id 
      AND payment_status IN ('paid', 'completed', 'active', 'succeeded')
  ) INTO v_entitlement_exists;

  IF NOT v_entitlement_exists THEN
    RAISE EXCEPTION 'SAFETY ABORT: Target QA paid entitlement link (user_id: %, profile_id: %) not found!', c_qa_user_id, c_qa_profile_id;
  END IF;

  -- 4. Delete progress rows requiring BOTH user_id AND profile_id match:
  -- Step A: post_programme_progress (FK to post_programme_cycles)
  WITH deleted_post_prog AS (
    DELETE FROM public.post_programme_progress 
    WHERE user_id = c_qa_user_id 
      AND profile_id = c_qa_profile_id
    RETURNING 1
  )
  SELECT count(*) FROM deleted_post_prog INTO v_deleted_post_prog;

  -- Step B: post_programme_cycles
  WITH deleted_cycles AS (
    DELETE FROM public.post_programme_cycles 
    WHERE user_id = c_qa_user_id 
      AND profile_id = c_qa_profile_id
    RETURNING 1
  )
  SELECT count(*) FROM deleted_cycles INTO v_deleted_cycles;

  -- Step C: programme_progress (initial 21-Day core progress)
  WITH deleted_prog AS (
    DELETE FROM public.programme_progress 
    WHERE user_id = c_qa_user_id 
      AND profile_id = c_qa_profile_id
    RETURNING 1
  )
  SELECT count(*) FROM deleted_prog INTO v_deleted_prog;

  -- 5. Atomic Post-Reset Assertions (Fails and rolls back transaction if any assertion is invalid)
  SELECT count(*) FROM public.programme_progress 
  WHERE user_id = c_qa_user_id AND profile_id = c_qa_profile_id 
  INTO v_post_check_prog;

  SELECT count(*) FROM public.post_programme_progress 
  WHERE user_id = c_qa_user_id AND profile_id = c_qa_profile_id 
  INTO v_post_check_post_prog;

  SELECT count(*) FROM public.post_programme_cycles 
  WHERE user_id = c_qa_user_id AND profile_id = c_qa_profile_id 
  INTO v_post_check_cycles;

  SELECT count(*) FROM public.quiz_profiles 
  WHERE id = c_qa_profile_id 
  INTO v_post_check_profile;

  SELECT count(*) FROM public.purchases 
  WHERE profile_id = c_qa_profile_id 
    AND user_id = c_qa_user_id 
    AND payment_status IN ('paid', 'completed', 'active', 'succeeded') 
  INTO v_post_check_entitlement;

  IF v_post_check_prog <> 0 OR v_post_check_post_prog <> 0 OR v_post_check_cycles <> 0 THEN
    RAISE EXCEPTION 'POST-ASSERTION FAILURE: Progress rows still remain after deletion! Rolling back transaction.';
  END IF;

  IF v_post_check_profile <> 1 THEN
    RAISE EXCEPTION 'POST-ASSERTION FAILURE: Canonical quiz_profile was missing after deletion! Rolling back transaction.';
  END IF;

  IF v_post_check_entitlement < 1 THEN
    RAISE EXCEPTION 'POST-ASSERTION FAILURE: Paid entitlement link was missing after deletion! Rolling back transaction.';
  END IF;

  -- 6. Output audit log notices
  RAISE NOTICE '--------------------------------------------------';
  RAISE NOTICE 'QA ACCOUNT RESET COMPLETED SUCCESSFULLY';
  RAISE NOTICE 'Target User ID:    %', c_qa_user_id;
  RAISE NOTICE 'Target Profile ID: %', c_qa_profile_id;
  RAISE NOTICE 'Target Auth Email: %', c_qa_email;
  RAISE NOTICE 'Deleted post_programme_progress rows: %', v_deleted_post_prog;
  RAISE NOTICE 'Deleted post_programme_cycles rows:   %', v_deleted_cycles;
  RAISE NOTICE 'Deleted programme_progress rows:      %', v_deleted_prog;
  RAISE NOTICE '--------------------------------------------------';
END $$;

-- ==============================================================================
-- POST-RESET VERIFICATION QUERY
-- ==============================================================================
-- Run after the reset block to verify total reset and QA account preservation.
-- Expected output:
--   programme_progress_count = 0
--   post_programme_progress_count = 0
--   post_programme_cycles_count = 0
--   quiz_profile_exists = 1
--   entitlement_exists = 1
-- ==============================================================================
SELECT 
  (SELECT count(*) FROM public.programme_progress WHERE user_id = '363526cd-7e77-42d9-9e86-dd7458dda901' AND profile_id = '5ba28d09-ae1b-40eb-bbf2-62367591e5c9') AS programme_progress_count,
  (SELECT count(*) FROM public.post_programme_progress WHERE user_id = '363526cd-7e77-42d9-9e86-dd7458dda901' AND profile_id = '5ba28d09-ae1b-40eb-bbf2-62367591e5c9') AS post_programme_progress_count,
  (SELECT count(*) FROM public.post_programme_cycles WHERE user_id = '363526cd-7e77-42d9-9e86-dd7458dda901' AND profile_id = '5ba28d09-ae1b-40eb-bbf2-62367591e5c9') AS post_programme_cycles_count,
  (SELECT count(*) FROM public.quiz_profiles WHERE id = '5ba28d09-ae1b-40eb-bbf2-62367591e5c9') AS quiz_profile_exists,
  (SELECT count(*) FROM public.purchases WHERE profile_id = '5ba28d09-ae1b-40eb-bbf2-62367591e5c9' AND user_id = '363526cd-7e77-42d9-9e86-dd7458dda901' AND payment_status IN ('paid', 'completed', 'active', 'succeeded')) AS entitlement_exists;
