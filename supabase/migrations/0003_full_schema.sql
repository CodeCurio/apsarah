-- ============================================================
-- APSARAH E-COMMERCE — FULL SCHEMA MIGRATION (100% IDEMPOTENT)
-- Run this ENTIRE file in Supabase Dashboard → SQL Editor
-- https://supabase.com/dashboard/project/lgknzhwurdogezbvyjst/sql
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Helper: auto-update updated_at ──────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TABLE: profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT,
  full_name     TEXT,
  phone         TEXT,
  avatar_url    TEXT,
  role          TEXT NOT NULL DEFAULT 'customer',
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer';

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- ============================================================
-- TABLE: site_settings
-- ============================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id                        INT PRIMARY KEY DEFAULT 1,
  site_name                 TEXT DEFAULT 'Apsarah',
  tagline                   TEXT DEFAULT 'Luxury Ethnic Wear',
  logo_url                  TEXT,
  logo_inverted_url         TEXT,
  favicon_url               TEXT,
  contact_email             TEXT DEFAULT 'hello@apsarah.in',
  contact_phone             TEXT,
  business_address          TEXT,
  currency_code             TEXT DEFAULT 'INR',
  currency_symbol           TEXT DEFAULT '₹',
  tax_rate                  NUMERIC(5,2) DEFAULT 0,
  tax_inclusive             BOOLEAN DEFAULT TRUE,
  announcement_bar_active   BOOLEAN DEFAULT FALSE,
  announcement_bar_text     TEXT,
  announcement_bar_link     TEXT,
  announcement_bar_color    TEXT DEFAULT '#8F1020',
  social_instagram          TEXT,
  social_facebook           TEXT,
  social_twitter            TEXT,
  social_tiktok             TEXT,
  social_youtube            TEXT,
  updated_at                TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS site_name TEXT DEFAULT 'Apsarah';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS tagline TEXT DEFAULT 'Luxury Ethnic Wear';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS logo_inverted_url TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS favicon_url TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS contact_email TEXT DEFAULT 'hello@apsarah.in';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS business_address TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS currency_code TEXT DEFAULT 'INR';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS currency_symbol TEXT DEFAULT '₹';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS tax_rate NUMERIC(5,2) DEFAULT 0;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS tax_inclusive BOOLEAN DEFAULT TRUE;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS announcement_bar_active BOOLEAN DEFAULT FALSE;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS announcement_bar_text TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS announcement_bar_link TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS announcement_bar_color TEXT DEFAULT '#8F1020';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS social_instagram TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS social_facebook TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS social_twitter TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS social_tiktok TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS social_youtube TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

INSERT INTO public.site_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Site settings public read" ON public.site_settings;
DROP POLICY IF EXISTS "Admin can update site settings" ON public.site_settings;
CREATE POLICY "Site settings public read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin can update site settings" ON public.site_settings FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- TABLE: categories
-- ============================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url   TEXT,
  parent_id   UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS parent_id UUID;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

INSERT INTO public.categories (name, slug) VALUES
  ('Anarkali Sets', 'anarkali-sets'),
  ('Classic Kurtas', 'classic-kurtas'),
  ('Straight Suit Sets', 'straight-suit-sets'),
  ('Co-ord Sets', 'co-ord-sets'),
  ('Occasion Wear', 'occasion-wear'),
  ('Festive Sarees', 'festive-sarees')
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Categories public read" ON public.categories;
DROP POLICY IF EXISTS "Admin manages categories" ON public.categories;
CREATE POLICY "Categories public read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin manages categories" ON public.categories FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- TABLE: orders
-- ============================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number        TEXT,
  user_id             UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email               TEXT NOT NULL DEFAULT '',
  shipping_address    JSONB NOT NULL DEFAULT '{}',
  billing_address     JSONB,
  shipping_method     TEXT DEFAULT 'Standard Delivery',
  shipping_cost       NUMERIC(10,2) DEFAULT 0,
  subtotal            NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount_amount     NUMERIC(10,2) DEFAULT 0,
  tax_amount          NUMERIC(10,2) DEFAULT 0,
  total               NUMERIC(10,2) NOT NULL DEFAULT 0,
  coupon_code         TEXT,
  payment_status      TEXT DEFAULT 'pending',
  fulfillment_status  TEXT DEFAULT 'pending',
  payment_id          TEXT,
  tracking_number     TEXT,
  tracking_carrier    TEXT,
  notes               TEXT,
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_number TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS email TEXT DEFAULT '';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_address JSONB DEFAULT '{}';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS billing_address JSONB;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_method TEXT DEFAULT 'Standard Delivery';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC(10,2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS subtotal NUMERIC(10,2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10,2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tax_amount NUMERIC(10,2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total NUMERIC(10,2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS coupon_code TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS fulfillment_status TEXT DEFAULT 'pending';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_carrier TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS notes TEXT;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  seq_num INT;
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 5) AS INT)), 10000) + 1
    INTO seq_num FROM public.orders WHERE order_number LIKE 'ORD-%';
    NEW.order_number = 'ORD-' || seq_num;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_order_number ON public.orders;
CREATE TRIGGER orders_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_order_number();

DROP TRIGGER IF EXISTS orders_updated_at ON public.orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Customers view own orders" ON public.orders;
DROP POLICY IF EXISTS "Customers create orders" ON public.orders;
DROP POLICY IF EXISTS "Admins view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins update orders" ON public.orders;
CREATE POLICY "Customers view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Customers create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view all orders" ON public.orders FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins update orders" ON public.orders FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- TABLE: order_items
-- ============================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id    TEXT NOT NULL,
  title         TEXT NOT NULL,
  variant_info  JSONB DEFAULT '{}',
  quantity      INT NOT NULL DEFAULT 1,
  unit_price    NUMERIC(10,2) NOT NULL DEFAULT 0,
  line_total    NUMERIC(10,2) NOT NULL DEFAULT 0,
  image_url     TEXT
);

ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS product_id TEXT;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS variant_info JSONB DEFAULT '{}';
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS quantity INT DEFAULT 1;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS unit_price NUMERIC(10,2) DEFAULT 0;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS line_total NUMERIC(10,2) DEFAULT 0;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS image_url TEXT;

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Order items readable by order owner" ON public.order_items;
DROP POLICY IF EXISTS "Order items insertable" ON public.order_items;
DROP POLICY IF EXISTS "Admins read all order items" ON public.order_items;
CREATE POLICY "Order items readable by order owner" ON public.order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid()));
CREATE POLICY "Order items insertable" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins read all order items" ON public.order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- TABLE: order_timeline
-- ============================================================
CREATE TABLE IF NOT EXISTS public.order_timeline (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status      TEXT NOT NULL,
  note        TEXT,
  created_by  UUID REFERENCES auth.users(id),
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.order_timeline ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE;
ALTER TABLE public.order_timeline ADD COLUMN IF NOT EXISTS status TEXT;
ALTER TABLE public.order_timeline ADD COLUMN IF NOT EXISTS note TEXT;
ALTER TABLE public.order_timeline ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE public.order_timeline ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

ALTER TABLE public.order_timeline ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Timeline readable by order owner or admin" ON public.order_timeline;
DROP POLICY IF EXISTS "Timeline insertable" ON public.order_timeline;
CREATE POLICY "Timeline readable by order owner or admin" ON public.order_timeline FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Timeline insertable" ON public.order_timeline FOR INSERT WITH CHECK (true);

-- ============================================================
-- TABLE: reviews
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  TEXT NOT NULL,
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rating      INT NOT NULL DEFAULT 5,
  title       TEXT,
  body        TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS product_id TEXT;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS rating INT DEFAULT 5;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS body TEXT;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Reviews public read" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can delete reviews" ON public.reviews;
CREATE POLICY "Reviews public read" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reviews" ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can delete reviews" ON public.reviews FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- TABLE: coupons
-- ============================================================
CREATE TABLE IF NOT EXISTS public.coupons (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code                    TEXT NOT NULL UNIQUE,
  type                    TEXT NOT NULL DEFAULT 'percentage',
  value                   NUMERIC(10,2) NOT NULL DEFAULT 0,
  min_order_amount        NUMERIC(10,2) DEFAULT 0,
  max_discount_amount     NUMERIC(10,2),
  usage_limit             INT,
  per_customer_limit      INT DEFAULT 1,
  times_used              INT DEFAULT 0,
  valid_from              TIMESTAMPTZ DEFAULT now(),
  valid_until             TIMESTAMPTZ,
  is_active               BOOLEAN DEFAULT TRUE,
  created_at              TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS code TEXT;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'percentage';
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS value NUMERIC(10,2) DEFAULT 0;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS min_order_amount NUMERIC(10,2) DEFAULT 0;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS max_discount_amount NUMERIC(10,2);
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS usage_limit INT;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS per_customer_limit INT DEFAULT 1;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS times_used INT DEFAULT 0;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS valid_from TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS valid_until TIMESTAMPTZ;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Drop NOT NULL constraints from any pre-existing legacy columns on coupons table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='coupons' AND column_name='discount_value') THEN
    ALTER TABLE public.coupons ALTER COLUMN discount_value DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='coupons' AND column_name='discount_type') THEN
    ALTER TABLE public.coupons ALTER COLUMN discount_type DROP NOT NULL;
  END IF;
END $$;

INSERT INTO public.coupons (code, type, value, min_order_amount, usage_limit, valid_until)
VALUES ('WELCOME10', 'percentage', 10, 500, 1000, now() + interval '1 year')
ON CONFLICT (code) DO NOTHING;

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read active coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admins manage coupons" ON public.coupons;
CREATE POLICY "Anyone can read active coupons" ON public.coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage coupons" ON public.coupons FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- TABLE: addresses
-- ============================================================
CREATE TABLE IF NOT EXISTS public.addresses (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name      TEXT NOT NULL,
  phone          TEXT,
  address_line1  TEXT NOT NULL,
  address_line2  TEXT,
  city           TEXT NOT NULL,
  state          TEXT NOT NULL,
  pincode        TEXT NOT NULL,
  country        TEXT NOT NULL DEFAULT 'India',
  is_default     BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.addresses ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.addresses ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.addresses ADD COLUMN IF NOT EXISTS address_line1 TEXT;
ALTER TABLE public.addresses ADD COLUMN IF NOT EXISTS address_line2 TEXT;
ALTER TABLE public.addresses ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.addresses ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE public.addresses ADD COLUMN IF NOT EXISTS pincode TEXT;
ALTER TABLE public.addresses ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'India';
ALTER TABLE public.addresses ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT FALSE;

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own addresses" ON public.addresses;
CREATE POLICY "Users manage own addresses" ON public.addresses FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- TABLE: wishlist
-- ============================================================
CREATE TABLE IF NOT EXISTS public.wishlist (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id  TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, product_id)
);

ALTER TABLE public.wishlist ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.wishlist ADD COLUMN IF NOT EXISTS product_id TEXT;

ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own wishlist" ON public.wishlist;
CREATE POLICY "Users manage own wishlist" ON public.wishlist FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- TABLE: subscribers (newsletter)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subscribers (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS email TEXT;

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.subscribers;
DROP POLICY IF EXISTS "Admins read subscribers" ON public.subscribers;
CREATE POLICY "Anyone can subscribe" ON public.subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins read subscribers" ON public.subscribers FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- TABLE: hero_slides
-- ============================================================
CREATE TABLE IF NOT EXISTS public.hero_slides (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url   TEXT NOT NULL,
  heading     TEXT,
  subheading  TEXT,
  cta_text    TEXT DEFAULT 'Shop Now',
  cta_link    TEXT DEFAULT '/shop',
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.hero_slides ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.hero_slides ADD COLUMN IF NOT EXISTS heading TEXT;
ALTER TABLE public.hero_slides ADD COLUMN IF NOT EXISTS subheading TEXT;
ALTER TABLE public.hero_slides ADD COLUMN IF NOT EXISTS cta_text TEXT DEFAULT 'Shop Now';
ALTER TABLE public.hero_slides ADD COLUMN IF NOT EXISTS cta_link TEXT DEFAULT '/shop';
ALTER TABLE public.hero_slides ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE public.hero_slides ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Hero slides public read" ON public.hero_slides;
DROP POLICY IF EXISTS "Admins manage hero slides" ON public.hero_slides;
CREATE POLICY "Hero slides public read" ON public.hero_slides FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage hero slides" ON public.hero_slides FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- TABLE: contact_submissions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  subject     TEXT,
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS subject TEXT;
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS message TEXT;

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can submit contact" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins read contact submissions" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins read contact submissions" ON public.contact_submissions FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- TABLE: shipping_methods
-- ============================================================
CREATE TABLE IF NOT EXISTS public.shipping_methods (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  TEXT NOT NULL UNIQUE,
  estimated_delivery    TEXT DEFAULT '5-7 business days',
  price                 NUMERIC(10,2) DEFAULT 0,
  free_above            NUMERIC(10,2),
  is_active             BOOLEAN DEFAULT TRUE,
  sort_order            INT DEFAULT 0
);

ALTER TABLE public.shipping_methods ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.shipping_methods ADD COLUMN IF NOT EXISTS estimated_delivery TEXT DEFAULT '5-7 business days';
ALTER TABLE public.shipping_methods ADD COLUMN IF NOT EXISTS price NUMERIC(10,2) DEFAULT 0;
ALTER TABLE public.shipping_methods ADD COLUMN IF NOT EXISTS free_above NUMERIC(10,2);
ALTER TABLE public.shipping_methods ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

INSERT INTO public.shipping_methods (name, estimated_delivery, price, free_above) VALUES
  ('Standard Delivery', '5-7 business days', 99, 999),
  ('Express Delivery', '2-3 business days', 199, 1999),
  ('Overnight Delivery', '1 business day', 399, NULL)
ON CONFLICT (name) DO NOTHING;

ALTER TABLE public.shipping_methods ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Shipping methods public read" ON public.shipping_methods;
DROP POLICY IF EXISTS "Admins manage shipping" ON public.shipping_methods;
CREATE POLICY "Shipping methods public read" ON public.shipping_methods FOR SELECT USING (true);
CREATE POLICY "Admins manage shipping" ON public.shipping_methods FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- Ensure apsarah_products RLS allows admin operations
-- ============================================================
DROP POLICY IF EXISTS "Admin all apsarah_products" ON public.apsarah_products;
CREATE POLICY "Admin all apsarah_products" ON public.apsarah_products FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
