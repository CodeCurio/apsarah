-- ==========================================================
-- Migration 0010: Fix Admin Roles & Secure Order RLS Policies
-- Execute this script in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ==========================================================

-- 1. Reset all users to 'customer' role
UPDATE public.profiles
SET role = 'customer';

-- 2. Set designated Admin email address(es)
-- Replace 'admin@apsarah.in' with your real admin email account
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (
  SELECT id FROM auth.users WHERE email IN ('admin@apsarah.in', 'admin@apsarah.com')
);

-- 3. Secure Orders RLS Policy to Admin-Only Updates
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public order update policy" ON public.orders;
DROP POLICY IF EXISTS "Admins update orders" ON public.orders;

CREATE POLICY "Admins update orders" ON public.orders
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
