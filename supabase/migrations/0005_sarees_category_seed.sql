-- ============================================================
-- 0005_sarees_category_seed.sql
-- Seed Sarees primary category and its subcategories into Supabase
-- ============================================================

-- 1. Insert Sarees Primary Category
INSERT INTO public.categories (name, slug, description, image_url, is_coming_soon, sort_order, parent_id) VALUES
  ('Sarees', 'sarees', 'Handcrafted Banarasi, Kanjivaram, and contemporary sarees woven with heritage artistry.', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=88', FALSE, 7, NULL)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  is_coming_soon = EXCLUDED.is_coming_soon,
  sort_order = EXCLUDED.sort_order,
  parent_id = NULL;

-- 2. Bump sort_order for Jewellery and Fragrance to make room
UPDATE public.categories SET sort_order = 8 WHERE slug = 'jewellery' AND parent_id IS NULL;
UPDATE public.categories SET sort_order = 9 WHERE slug = 'fragrance' AND parent_id IS NULL;

-- 3. Insert Sarees Subcategories
INSERT INTO public.categories (name, slug, parent_id) VALUES
  ('Banarasi Silk Sarees', 'banarasi-silk-sarees', (SELECT id FROM public.categories WHERE slug = 'sarees' LIMIT 1)),
  ('Kanjivaram Sarees', 'kanjivaram-sarees', (SELECT id FROM public.categories WHERE slug = 'sarees' LIMIT 1)),
  ('Chiffon Sarees', 'chiffon-sarees', (SELECT id FROM public.categories WHERE slug = 'sarees' LIMIT 1)),
  ('Organza Sarees', 'organza-sarees', (SELECT id FROM public.categories WHERE slug = 'sarees' LIMIT 1)),
  ('Cotton Sarees', 'cotton-sarees', (SELECT id FROM public.categories WHERE slug = 'sarees' LIMIT 1)),
  ('Georgette Sarees', 'georgette-sarees', (SELECT id FROM public.categories WHERE slug = 'sarees' LIMIT 1)),
  ('Tussar Silk Sarees', 'tussar-silk-sarees', (SELECT id FROM public.categories WHERE slug = 'sarees' LIMIT 1))
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;
