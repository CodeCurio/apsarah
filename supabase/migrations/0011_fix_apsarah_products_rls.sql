-- ==========================================================
-- Migration 0011: Ensure apsarah_products Table & Permissive RLS Policies
-- Execute in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==========================================================

-- 1. Create table public.apsarah_products if not exists
CREATE TABLE IF NOT EXISTS public.apsarah_products (
  id               TEXT PRIMARY KEY,
  name             TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  category         TEXT NOT NULL,
  sub_category     TEXT,
  price            NUMERIC(10,2) NOT NULL,
  old_price        NUMERIC(10,2) NOT NULL,
  discount_percent INTEGER NOT NULL DEFAULT 0,
  rating           NUMERIC(3,1) NOT NULL DEFAULT 4.9,
  review_count     INTEGER NOT NULL DEFAULT 0,
  images           TEXT[] NOT NULL DEFAULT '{}',
  sizes            JSONB NOT NULL DEFAULT '[]',
  colors           JSONB NOT NULL DEFAULT '[]',
  fabric           TEXT DEFAULT '',
  fit              TEXT DEFAULT '',
  pattern          TEXT DEFAULT '',
  neckline         TEXT DEFAULT '',
  sleeves          TEXT DEFAULT '',
  occasion         TEXT DEFAULT '',
  wash_care        TEXT DEFAULT '',
  description      TEXT DEFAULT '',
  highlights       TEXT[] DEFAULT '{}',
  is_new_arrival   BOOLEAN DEFAULT FALSE,
  is_bestseller    BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- 2. Indexes for fast query performance
CREATE INDEX IF NOT EXISTS idx_apsarah_products_slug ON public.apsarah_products(slug);
CREATE INDEX IF NOT EXISTS idx_apsarah_products_category ON public.apsarah_products(category);
CREATE INDEX IF NOT EXISTS idx_apsarah_products_created_at ON public.apsarah_products(created_at DESC);

-- 3. Enable RLS and define policies for SELECT, INSERT, UPDATE, DELETE
ALTER TABLE public.apsarah_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read apsarah_products" ON public.apsarah_products;
DROP POLICY IF EXISTS "Public insert apsarah_products" ON public.apsarah_products;
DROP POLICY IF EXISTS "Public update apsarah_products" ON public.apsarah_products;
DROP POLICY IF EXISTS "Public delete apsarah_products" ON public.apsarah_products;
DROP POLICY IF EXISTS "Admin all apsarah_products" ON public.apsarah_products;

-- Allow public read access
CREATE POLICY "Public read apsarah_products" ON public.apsarah_products
  FOR SELECT USING (true);

-- Allow unrestricted insert, update, delete (server API route & authenticated admin management)
CREATE POLICY "Public insert apsarah_products" ON public.apsarah_products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update apsarah_products" ON public.apsarah_products
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Public delete apsarah_products" ON public.apsarah_products
  FOR DELETE USING (true);
