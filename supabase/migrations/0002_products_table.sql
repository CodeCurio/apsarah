-- Products table for Apsarah store
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/lgknzhwurdogezbvyjst/sql

CREATE TABLE IF NOT EXISTS public.products (
  id            TEXT PRIMARY KEY DEFAULT ('prod-' || extract(epoch from now())::bigint::text),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  category      TEXT NOT NULL,
  sub_category  TEXT,
  price         INTEGER NOT NULL,
  old_price     INTEGER NOT NULL,
  discount_percent INTEGER NOT NULL DEFAULT 0,
  rating        NUMERIC(3,1) NOT NULL DEFAULT 4.5,
  review_count  INTEGER NOT NULL DEFAULT 0,
  images        TEXT[] NOT NULL DEFAULT '{}',
  sizes         JSONB NOT NULL DEFAULT '[]',
  colors        JSONB NOT NULL DEFAULT '[]',
  fabric        TEXT NOT NULL DEFAULT '',
  fit           TEXT NOT NULL DEFAULT '',
  pattern       TEXT NOT NULL DEFAULT '',
  neckline      TEXT NOT NULL DEFAULT '',
  sleeves       TEXT NOT NULL DEFAULT '',
  occasion      TEXT NOT NULL DEFAULT '',
  wash_care     TEXT NOT NULL DEFAULT '',
  description   TEXT NOT NULL DEFAULT '',
  highlights    TEXT[] NOT NULL DEFAULT '{}',
  is_new_arrival  BOOLEAN DEFAULT FALSE,
  is_bestseller   BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Allow public read access (products are visible to all visitors)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert products"
  ON public.products FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update products"
  ON public.products FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete products"
  ON public.products FOR DELETE
  USING (true);

-- Seed the initial 5 products
INSERT INTO public.products (id, name, slug, category, sub_category, price, old_price, discount_percent, rating, review_count, images, sizes, colors, fabric, fit, pattern, neckline, sleeves, occasion, wash_care, description, highlights, is_bestseller)
VALUES
(
  'prod-1', 'Gulnaar Embroidered Anarkali Set', 'gulnaar-embroidered-anarkali-set',
  'Anarkali Sets', 'Festive Wear', 3300, 5500, 40, 4.9, 128,
  ARRAY['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85', '/assets/img-2.jpeg', '/assets/img-3.jpeg', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85'],
  '[{"size":"S","stock":5},{"size":"M","stock":8},{"size":"L","stock":2},{"size":"XL","stock":4},{"size":"XXL","stock":1}]'::jsonb,
  '[{"name":"Navy Blue","hex":"#1c2541"},{"name":"Maroon Red","hex":"#7a1c24"}]'::jsonb,
  'Pure Chanderi Silk', 'Flared Anarkali Fit', 'Intricate Zari Embroidery',
  'Sweetheart Neck', 'Three-Quarter Sleeves', 'Festive & Celebration', 'Dry Clean Only',
  'Immerse in royal heritage with the Gulnaar Embroidered Anarkali Set.',
  ARRAY['Pure Chanderi Silk fabric with soft lining','Intricate Zari & Sequins embroidery detailing','Includes Anarkali Kurta, Churidar Pants & Organza Dupatta'],
  TRUE
),
(
  'prod-2', 'Ivory Heritage Kurta Set', 'ivory-heritage-kurta-set',
  'Classic Kurtas', 'Everyday Luxury', 2759, 4599, 40, 4.8, 94,
  ARRAY['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85', '/assets/img-2.jpeg', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85', '/assets/img-3.jpeg'],
  '[{"size":"S","stock":12},{"size":"M","stock":6},{"size":"L","stock":0},{"size":"XL","stock":3}]'::jsonb,
  '[{"name":"Ivory White","hex":"#fdfbf7"},{"name":"Pastel Peach","hex":"#fcd5ce"}]'::jsonb,
  'Pure Cotton Mulmul', 'Straight Fit', 'Chikan Work & Mirror Embroidery',
  'Mandarin Collar', 'Full Sleeves', 'Puja & Festive Gatherings', 'Hand Wash Separately in Cold Water',
  'Timeless elegance redefined in pristine Ivory Mulmul.',
  ARRAY['Breathable 100% Cotton Mulmul fabric','Hand-crafted Chikankari motif work','Matching straight trousers with elasticated waistband'],
  FALSE
),
(
  'prod-3', 'Neel Indigo Straight Suit', 'neel-indigo-straight-suit',
  'Straight Suit Sets', 'Contemporary Indian', 2399, 3999, 40, 4.9, 76,
  ARRAY['/assets/img-2.jpeg','https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=1200&q=85','/assets/img-3.jpeg','https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85'],
  '[{"size":"S","stock":2},{"size":"M","stock":4},{"size":"L","stock":1},{"size":"XL","stock":0}]'::jsonb,
  '[{"name":"Indigo Blue","hex":"#1d3557"}]'::jsonb,
  'Handblock Printed Cotton', 'Relaxed Straight Fit', 'Dabu Indigo Block Print',
  'V-Neck with Lace Border', 'Three-Quarter Sleeves', 'Office & Casual Festive', 'Gentle Machine Wash',
  'Artisanal indigo dabu prints combined with contemporary tailored lines.',
  ARRAY['Authentic Bagru handblock print','Contrast piping and delicate lace edges','Paired with palazzo pants & cotton dupatta'],
  TRUE
),
(
  'prod-4', 'Mehr Crimson Festive Set', 'mehr-crimson-festive-set',
  'Occasion Wear', 'Wedding Edit', 2000, 3999, 50, 4.7, 112,
  ARRAY['https://images.unsplash.com/photo-1610189012906-4c0aa9b9781e?auto=format&fit=crop&w=1200&q=85','/assets/img-2.jpeg','/assets/img-3.jpeg','https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&w=1200&q=85'],
  '[{"size":"S","stock":1},{"size":"M","stock":3},{"size":"L","stock":5},{"size":"XL","stock":2}]'::jsonb,
  '[{"name":"Deep Crimson","hex":"#800020"}]'::jsonb,
  'Georgette Silk Blend', 'A-Line Flared', 'Gota Patti & Dori Work',
  'Round Neck', 'Elbow Sleeves', 'Wedding & Sangeet', 'Dry Clean Only',
  'Turn heads with the vibrant Mehr Crimson Set.',
  ARRAY['Rich Georgette fabric with smooth satin lining','Heavy embroidery bodice and hem','Statement net dupatta with scalloped borders'],
  FALSE
),
(
  'prod-5', 'Gulabi Cotton Kurta Set', 'gulabi-cotton-kurta-set',
  'Co-ord Sets', 'Summer Collection', 3219, 4599, 30, 4.8, 65,
  ARRAY['/assets/img-3.jpeg','https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&w=1200&q=85','/assets/img-2.jpeg','https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85'],
  '[{"size":"S","stock":8},{"size":"M","stock":10},{"size":"L","stock":6},{"size":"XL","stock":4}]'::jsonb,
  '[{"name":"Rani Pink","hex":"#d81b60"}]'::jsonb,
  '100% Premium Chanderi Cotton', 'Co-ord Tunic Fit', 'Floral Screen Print with Foil Highlights',
  'Notch Collar', 'Full Cuffed Sleeves', 'Casual Celebrations', 'Hand Wash in Cold Water',
  'Vibrant Rani Pink floral printed co-ord set designed for effortless summer chic.',
  ARRAY['100% Premium breathable cotton','Foil print floral patterns','Matching ankle-length tapered trousers'],
  FALSE
)
ON CONFLICT (id) DO NOTHING;
