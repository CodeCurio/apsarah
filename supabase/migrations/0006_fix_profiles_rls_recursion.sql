-- Fix Infinite Recursion on public.profiles RLS Policy
-- Problem: RLS policy on profiles queried public.profiles directly, causing infinite recursion loop.
-- Solution: Create a SECURITY DEFINER function `public.is_admin()` which bypasses RLS during check.

-- 1. Create SECURITY DEFINER helper function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Grant execution permission
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon, service_role;

-- 2. Re-create RLS policies on profiles without self-referential subqueries
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- 3. Fix orders RLS policies
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Customers view own orders" ON public.orders;
DROP POLICY IF EXISTS "Customers create orders" ON public.orders;
DROP POLICY IF EXISTS "Admins view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins update orders" ON public.orders;

CREATE POLICY "Customers view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Customers create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins update orders" ON public.orders
  FOR UPDATE USING (public.is_admin());

-- 4. Fix order_timeline RLS policies
ALTER TABLE public.order_timeline ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Timeline readable by order owner or admin" ON public.order_timeline;

CREATE POLICY "Timeline readable by order owner or admin" ON public.order_timeline
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
    OR public.is_admin()
  );

-- 5. Fix optional/legacy columns on orders & order_items tables
ALTER TABLE public.orders ALTER COLUMN total_amount DROP NOT NULL;
ALTER TABLE public.orders ALTER COLUMN total_amount SET DEFAULT 0;

ALTER TABLE public.order_items ALTER COLUMN total_price DROP NOT NULL;
ALTER TABLE public.order_items ALTER COLUMN total_price SET DEFAULT 0;


