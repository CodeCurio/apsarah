-- ============================================================
-- 0004_categories_seed.sql
-- Seed script for Primary Categories and Subcategories in Supabase
-- Uses dynamic slug lookup for parent_id to avoid FK constraint violations!
-- ============================================================

-- 1. Ensure categories table schema supports parent_id & is_coming_soon
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.categories(id) ON DELETE CASCADE;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS is_coming_soon BOOLEAN DEFAULT FALSE;

-- 2. Insert Primary Categories (with conflict handling on slug)
INSERT INTO public.categories (name, slug, description, image_url, is_coming_soon, sort_order, parent_id) VALUES
  ('Kurta Sets', 'kurta-sets', 'Royalty & Grace in Every Stitch', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=88', FALSE, 1, NULL),
  ('Kurtas & Tops', 'kurtas-tops', 'Modern Indian Everyday Elegance', 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=900&q=88', FALSE, 2, NULL),
  ('Dresses', 'dresses', 'Statement Festive & Fusion Gowns', '/assets/img-2.jpeg', FALSE, 3, NULL),
  ('Lehengas', 'lehengas', 'Celebration Opulence & Heritage', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=88', FALSE, 4, NULL),
  ('Co-ord Sets', 'co-ord-sets', 'Effortless Matched Perfection', 'https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&w=900&q=88', FALSE, 5, NULL),
  ('Bottoms', 'bottoms', 'Chic Pairings for Every Silhouette', 'https://images.unsplash.com/photo-1610189012906-4c0aa9b9781e?auto=format&fit=crop&w=900&q=88', FALSE, 6, NULL),
  ('Jewellery', 'jewellery', 'Royal Finishing Touch — Launching Soon', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=88', TRUE, 7, NULL),
  ('Fragrance', 'fragrance', 'Artisanal Royal Indian Scents — Launching Soon', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=88', TRUE, 8, NULL)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  is_coming_soon = EXCLUDED.is_coming_soon,
  parent_id = NULL;

-- 3. Insert Subcategories via Dynamic Subqueries for parent_id
-- Kurta Sets Subcategories
INSERT INTO public.categories (name, slug, parent_id) VALUES
  ('Anarkali Sets', 'anarkali-sets', (SELECT id FROM public.categories WHERE slug = 'kurta-sets' LIMIT 1)),
  ('Straight Suit Sets', 'straight-suit-sets', (SELECT id FROM public.categories WHERE slug = 'kurta-sets' LIMIT 1)),
  ('Sharara & Gharara Sets', 'sharara-gharara-sets', (SELECT id FROM public.categories WHERE slug = 'kurta-sets' LIMIT 1)),
  ('Angrakha Sets', 'angrakha-sets', (SELECT id FROM public.categories WHERE slug = 'kurta-sets' LIMIT 1)),
  ('Velvet Sets', 'velvet-sets', (SELECT id FROM public.categories WHERE slug = 'kurta-sets' LIMIT 1)),
  ('Silk Kurta Sets', 'silk-kurta-sets', (SELECT id FROM public.categories WHERE slug = 'kurta-sets' LIMIT 1)),
  ('Palazzo Sets', 'palazzo-sets', (SELECT id FROM public.categories WHERE slug = 'kurta-sets' LIMIT 1))
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

-- Kurtas & Tops Subcategories
INSERT INTO public.categories (name, slug, parent_id) VALUES
  ('Short Kurtis', 'short-kurtis', (SELECT id FROM public.categories WHERE slug = 'kurtas-tops' LIMIT 1)),
  ('Long Straight Kurtas', 'long-straight-kurtas', (SELECT id FROM public.categories WHERE slug = 'kurtas-tops' LIMIT 1)),
  ('Ethnic Tunics', 'ethnic-tunics', (SELECT id FROM public.categories WHERE slug = 'kurtas-tops' LIMIT 1)),
  ('Peplum Tops', 'peplum-tops', (SELECT id FROM public.categories WHERE slug = 'kurtas-tops' LIMIT 1)),
  ('Printed Tops', 'printed-tops', (SELECT id FROM public.categories WHERE slug = 'kurtas-tops' LIMIT 1)),
  ('Chikankari Kurtas', 'chikankari-kurtas', (SELECT id FROM public.categories WHERE slug = 'kurtas-tops' LIMIT 1))
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

-- Dresses Subcategories
INSERT INTO public.categories (name, slug, parent_id) VALUES
  ('Festive Dresses', 'festive-dresses', (SELECT id FROM public.categories WHERE slug = 'dresses' LIMIT 1)),
  ('Indo-Western Gowns', 'indo-western-gowns', (SELECT id FROM public.categories WHERE slug = 'dresses' LIMIT 1)),
  ('Anarkali Dresses', 'anarkali-dresses', (SELECT id FROM public.categories WHERE slug = 'dresses' LIMIT 1)),
  ('Maxi Dresses', 'maxi-dresses', (SELECT id FROM public.categories WHERE slug = 'dresses' LIMIT 1)),
  ('Printed Slip Dresses', 'printed-slip-dresses', (SELECT id FROM public.categories WHERE slug = 'dresses' LIMIT 1)),
  ('Tiered Dresses', 'tiered-dresses', (SELECT id FROM public.categories WHERE slug = 'dresses' LIMIT 1))
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

-- Lehengas Subcategories
INSERT INTO public.categories (name, slug, parent_id) VALUES
  ('Bridal Lehengas', 'bridal-lehengas', (SELECT id FROM public.categories WHERE slug = 'lehengas' LIMIT 1)),
  ('Festive Crop Top Lehengas', 'festive-crop-top-lehengas', (SELECT id FROM public.categories WHERE slug = 'lehengas' LIMIT 1)),
  ('Printed Silk Lehengas', 'printed-silk-lehengas', (SELECT id FROM public.categories WHERE slug = 'lehengas' LIMIT 1)),
  ('Drape & Pre-Stitched Lehengas', 'drape-lehengas', (SELECT id FROM public.categories WHERE slug = 'lehengas' LIMIT 1)),
  ('Jacket Lehengas', 'jacket-lehengas', (SELECT id FROM public.categories WHERE slug = 'lehengas' LIMIT 1))
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

-- Co-ord Sets Subcategories
INSERT INTO public.categories (name, slug, parent_id) VALUES
  ('Festive Co-ords', 'festive-co-ords', (SELECT id FROM public.categories WHERE slug = 'co-ord-sets' LIMIT 1)),
  ('Velvet Co-ords', 'velvet-co-ords', (SELECT id FROM public.categories WHERE slug = 'co-ord-sets' LIMIT 1)),
  ('Printed Cotton Co-ords', 'printed-cotton-co-ords', (SELECT id FROM public.categories WHERE slug = 'co-ord-sets' LIMIT 1)),
  ('Indo-Western Tunic Sets', 'indo-western-tunic-sets', (SELECT id FROM public.categories WHERE slug = 'co-ord-sets' LIMIT 1)),
  ('Crop Top & Pants', 'crop-top-pants', (SELECT id FROM public.categories WHERE slug = 'co-ord-sets' LIMIT 1))
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

-- Bottoms Subcategories
INSERT INTO public.categories (name, slug, parent_id) VALUES
  ('Flared Palazzos', 'flared-palazzos', (SELECT id FROM public.categories WHERE slug = 'bottoms' LIMIT 1)),
  ('Pants & Trousers', 'pants-trousers', (SELECT id FROM public.categories WHERE slug = 'bottoms' LIMIT 1)),
  ('Ethnic Skirts', 'ethnic-skirts', (SELECT id FROM public.categories WHERE slug = 'bottoms' LIMIT 1)),
  ('Salwars & Churidars', 'salwars-churidars', (SELECT id FROM public.categories WHERE slug = 'bottoms' LIMIT 1)),
  ('Dhoti Pants', 'dhoti-pants', (SELECT id FROM public.categories WHERE slug = 'bottoms' LIMIT 1))
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

-- Jewellery Subcategories
INSERT INTO public.categories (name, slug, parent_id) VALUES
  ('Earrings', 'earrings', (SELECT id FROM public.categories WHERE slug = 'jewellery' LIMIT 1)),
  ('Necklaces', 'necklaces', (SELECT id FROM public.categories WHERE slug = 'jewellery' LIMIT 1)),
  ('Bangles & Kadas', 'bangles-kadas', (SELECT id FROM public.categories WHERE slug = 'jewellery' LIMIT 1)),
  ('Kundan Sets', 'kundan-sets', (SELECT id FROM public.categories WHERE slug = 'jewellery' LIMIT 1)),
  ('Maang Tikkas', 'maang-tikkas', (SELECT id FROM public.categories WHERE slug = 'jewellery' LIMIT 1))
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

-- Fragrance Subcategories
INSERT INTO public.categories (name, slug, parent_id) VALUES
  ('Luxury Perfumes', 'luxury-perfumes', (SELECT id FROM public.categories WHERE slug = 'fragrance' LIMIT 1)),
  ('Royal Attars', 'royal-attars', (SELECT id FROM public.categories WHERE slug = 'fragrance' LIMIT 1)),
  ('Body Mists', 'body-mists', (SELECT id FROM public.categories WHERE slug = 'fragrance' LIMIT 1)),
  ('Scented Oils', 'scented-oils', (SELECT id FROM public.categories WHERE slug = 'fragrance' LIMIT 1))
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

