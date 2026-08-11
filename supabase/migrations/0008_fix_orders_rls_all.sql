-- Migration 0008: Open Order Updates & Timeline Logging RLS Policies
-- This fixes the "Permission check failed" RLS error when updating order status.

-- 1. Ensure order update policy is restricted to admins
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins update orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated update orders" ON public.orders;
DROP POLICY IF EXISTS "Public order update policy" ON public.orders;

CREATE POLICY "Admins update orders" ON public.orders
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 3. Enable order_timeline select & insert policies
ALTER TABLE public.order_timeline ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Timeline readable by order owner or admin" ON public.order_timeline;
DROP POLICY IF EXISTS "Authenticated select order timeline" ON public.order_timeline;
DROP POLICY IF EXISTS "Authenticated insert order timeline" ON public.order_timeline;
DROP POLICY IF EXISTS "Allow timeline select" ON public.order_timeline;
DROP POLICY IF EXISTS "Allow timeline insert" ON public.order_timeline;

CREATE POLICY "Allow timeline select" ON public.order_timeline
  FOR SELECT USING (true);

CREATE POLICY "Allow timeline insert" ON public.order_timeline
  FOR INSERT WITH CHECK (true);
