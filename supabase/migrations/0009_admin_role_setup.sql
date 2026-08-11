-- ==========================================================
-- Migration: Admin Role Assignment & Helper Utilities
-- Description: Run this SQL in your Supabase SQL Editor to make
--              any user an Admin or set default admin roles.
-- ==========================================================

-- 1. Example: Promote a specific user by Email to Admin
-- Replace 'admin@apsarah.com' with the email address you signed up with in Supabase.
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'admin@apsarah.com'
);

-- 2. Optional: Function to make role promotion easy via SQL Editor
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET role = 'admin'
  WHERE id IN (
    SELECT id FROM auth.users WHERE email = user_email
  );
END;
$$;

-- Grant execution to service role / postgres
GRANT EXECUTE ON FUNCTION public.make_user_admin(TEXT) TO service_role, postgres;
