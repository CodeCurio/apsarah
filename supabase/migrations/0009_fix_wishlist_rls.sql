-- Migration 0009: Wishlist RLS Policies for Cross-Device Sync
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own wishlist" ON public.wishlist;
DROP POLICY IF EXISTS "Users can manage own wishlist" ON public.wishlist;
DROP POLICY IF EXISTS "Users select own wishlist" ON public.wishlist;
DROP POLICY IF EXISTS "Users insert own wishlist" ON public.wishlist;
DROP POLICY IF EXISTS "Users delete own wishlist" ON public.wishlist;

CREATE POLICY "Users select own wishlist" ON public.wishlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own wishlist" ON public.wishlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own wishlist" ON public.wishlist
  FOR DELETE USING (auth.uid() = user_id);
