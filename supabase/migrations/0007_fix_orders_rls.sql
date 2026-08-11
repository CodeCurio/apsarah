-- Migration 0007: Fix Orders RLS UPDATE Permission & Auto-Grant Admin Role
-- 1. Ensure any email matching admin@... or store admin in profiles gets role = 'admin'
UPDATE public.profiles
SET role = 'admin'
WHERE email LIKE '%admin%' OR role IS NULL;

-- 2. Update order RLS UPDATE policy to allow authenticated users to update orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins update orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated update orders" ON public.orders;

CREATE POLICY "Authenticated update orders" ON public.orders
  FOR UPDATE USING (auth.role() = 'authenticated' OR public.is_admin());

-- 3. Update order_timeline RLS INSERT policy
ALTER TABLE public.order_timeline ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Timeline readable by order owner or admin" ON public.order_timeline;
DROP POLICY IF EXISTS "Authenticated insert order timeline" ON public.order_timeline;

CREATE POLICY "Authenticated select order timeline" ON public.order_timeline
  FOR SELECT USING (auth.role() = 'authenticated' OR public.is_admin());

CREATE POLICY "Authenticated insert order timeline" ON public.order_timeline
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR public.is_admin());
