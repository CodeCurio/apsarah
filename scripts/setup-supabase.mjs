// Run: node scripts/setup-supabase.mjs
// This creates the apsarah_products table and seeds initial data

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lgknzhwurdogezbvyjst.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxna256aHd1cmRvZ2V6YnZ5anN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTE3NTE4NiwiZXhwIjoyMTAwNzUxMTg2fQ.z4swKbRzhiNy2a8nh72QZDMJqQxFioRFPf8gz-ZYRCo'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// Initial seed products
const initialProducts = [
  {
    id: 'prod-1',
    name: 'Gulnaar Embroidered Anarkali Set',
    slug: 'gulnaar-embroidered-anarkali-set',
    category: 'Anarkali Sets',
    sub_category: 'Festive Wear',
    price: 3300, old_price: 5500, discount_percent: 40,
    rating: 4.9, review_count: 128,
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85','/assets/img-2.jpeg','/assets/img-3.jpeg','https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85'],
    sizes: [{"size":"S","stock":5},{"size":"M","stock":8},{"size":"L","stock":2},{"size":"XL","stock":4},{"size":"XXL","stock":1}],
    colors: [{"name":"Navy Blue","hex":"#1c2541"},{"name":"Maroon Red","hex":"#7a1c24"}],
    fabric:'Pure Chanderi Silk', fit:'Flared Anarkali Fit', pattern:'Intricate Zari Embroidery',
    neckline:'Sweetheart Neck', sleeves:'Three-Quarter Sleeves', occasion:'Festive & Celebration', wash_care:'Dry Clean Only',
    description:'Immerse in royal heritage with the Gulnaar Embroidered Anarkali Set.',
    highlights:['Pure Chanderi Silk fabric with soft lining','Intricate Zari & Sequins embroidery detailing','Includes Anarkali Kurta, Churidar Pants & Organza Dupatta'],
    is_bestseller: true
  },
  {
    id: 'prod-2',
    name: 'Ivory Heritage Kurta Set',
    slug: 'ivory-heritage-kurta-set',
    category: 'Classic Kurtas',
    sub_category: 'Everyday Luxury',
    price: 2759, old_price: 4599, discount_percent: 40,
    rating: 4.8, review_count: 94,
    images: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85','/assets/img-2.jpeg','https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85','/assets/img-3.jpeg'],
    sizes: [{"size":"S","stock":12},{"size":"M","stock":6},{"size":"L","stock":0},{"size":"XL","stock":3}],
    colors: [{"name":"Ivory White","hex":"#fdfbf7"},{"name":"Pastel Peach","hex":"#fcd5ce"}],
    fabric:'Pure Cotton Mulmul', fit:'Straight Fit', pattern:'Chikan Work & Mirror Embroidery',
    neckline:'Mandarin Collar', sleeves:'Full Sleeves', occasion:'Puja & Festive Gatherings', wash_care:'Hand Wash Separately in Cold Water',
    description:'Timeless elegance redefined in pristine Ivory Mulmul.',
    highlights:['Breathable 100% Cotton Mulmul fabric','Hand-crafted Chikankari motif work','Matching straight trousers with elasticated waistband'],
    is_new_arrival: true
  },
  {
    id: 'prod-3',
    name: 'Neel Indigo Straight Suit',
    slug: 'neel-indigo-straight-suit',
    category: 'Straight Suit Sets',
    sub_category: 'Contemporary Indian',
    price: 2399, old_price: 3999, discount_percent: 40,
    rating: 4.9, review_count: 76,
    images: ['/assets/img-2.jpeg','https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=1200&q=85','/assets/img-3.jpeg','https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85'],
    sizes: [{"size":"S","stock":2},{"size":"M","stock":4},{"size":"L","stock":1},{"size":"XL","stock":0}],
    colors: [{"name":"Indigo Blue","hex":"#1d3557"}],
    fabric:'Handblock Printed Cotton', fit:'Relaxed Straight Fit', pattern:'Dabu Indigo Block Print',
    neckline:'V-Neck with Lace Border', sleeves:'Three-Quarter Sleeves', occasion:'Office & Casual Festive', wash_care:'Gentle Machine Wash',
    description:'Artisanal indigo dabu prints combined with contemporary tailored lines.',
    highlights:['Authentic Bagru handblock print','Contrast piping and delicate lace edges','Paired with palazzo pants & cotton dupatta'],
    is_bestseller: true
  },
  {
    id: 'prod-4',
    name: 'Mehr Crimson Festive Set',
    slug: 'mehr-crimson-festive-set',
    category: 'Occasion Wear',
    sub_category: 'Wedding Edit',
    price: 2000, old_price: 3999, discount_percent: 50,
    rating: 4.7, review_count: 112,
    images: ['https://images.unsplash.com/photo-1610189012906-4c0aa9b9781e?auto=format&fit=crop&w=1200&q=85','/assets/img-2.jpeg','/assets/img-3.jpeg','https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&w=1200&q=85'],
    sizes: [{"size":"S","stock":1},{"size":"M","stock":3},{"size":"L","stock":5},{"size":"XL","stock":2}],
    colors: [{"name":"Deep Crimson","hex":"#800020"}],
    fabric:'Georgette Silk Blend', fit:'A-Line Flared', pattern:'Gota Patti & Dori Work',
    neckline:'Round Neck', sleeves:'Elbow Sleeves', occasion:'Wedding & Sangeet', wash_care:'Dry Clean Only',
    description:'Turn heads with the vibrant Mehr Crimson Set.',
    highlights:['Rich Georgette fabric with smooth satin lining','Heavy embroidery bodice and hem','Statement net dupatta with scalloped borders']
  },
  {
    id: 'prod-5',
    name: 'Gulabi Cotton Kurta Set',
    slug: 'gulabi-cotton-kurta-set',
    category: 'Co-ord Sets',
    sub_category: 'Summer Collection',
    price: 3219, old_price: 4599, discount_percent: 30,
    rating: 4.8, review_count: 65,
    images: ['/assets/img-3.jpeg','https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&w=1200&q=85','/assets/img-2.jpeg','https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85'],
    sizes: [{"size":"S","stock":8},{"size":"M","stock":10},{"size":"L","stock":6},{"size":"XL","stock":4}],
    colors: [{"name":"Rani Pink","hex":"#d81b60"}],
    fabric:'100% Premium Chanderi Cotton', fit:'Co-ord Tunic Fit', pattern:'Floral Screen Print with Foil Highlights',
    neckline:'Notch Collar', sleeves:'Full Cuffed Sleeves', occasion:'Casual Celebrations', wash_care:'Hand Wash in Cold Water',
    description:'Vibrant Rani Pink floral printed co-ord set designed for effortless summer chic.',
    highlights:['100% Premium breathable cotton','Foil print floral patterns','Matching ankle-length tapered trousers']
  }
]

async function main() {
  console.log('📦 Inserting products into Supabase...')
  
  const { data, error } = await supabase
    .from('apsarah_products')
    .upsert(initialProducts, { onConflict: 'id' })
    .select()

  if (error) {
    console.error('❌ Error:', error.message)
    console.error('Details:', error.details)
    // Table might not exist yet — print the SQL to create it
    console.log('\n⚠️  If the table does not exist, run this SQL in Supabase Dashboard → SQL Editor:')
    console.log(`
CREATE TABLE IF NOT EXISTS public.apsarah_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  sub_category TEXT,
  price INTEGER NOT NULL,
  old_price INTEGER NOT NULL,
  discount_percent INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC(3,1) NOT NULL DEFAULT 4.5,
  review_count INTEGER NOT NULL DEFAULT 0,
  images TEXT[] NOT NULL DEFAULT '{}',
  sizes JSONB NOT NULL DEFAULT '[]',
  colors JSONB NOT NULL DEFAULT '[]',
  fabric TEXT NOT NULL DEFAULT '',
  fit TEXT NOT NULL DEFAULT '',
  pattern TEXT NOT NULL DEFAULT '',
  neckline TEXT NOT NULL DEFAULT '',
  sleeves TEXT NOT NULL DEFAULT '',
  occasion TEXT NOT NULL DEFAULT '',
  wash_care TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  highlights TEXT[] NOT NULL DEFAULT '{}',
  is_new_arrival BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.apsarah_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.apsarah_products FOR SELECT USING (true);
CREATE POLICY "Public insert" ON public.apsarah_products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update" ON public.apsarah_products FOR UPDATE USING (true);
CREATE POLICY "Public delete" ON public.apsarah_products FOR DELETE USING (true);
    `)
  } else {
    console.log(`✅ ${data?.length ?? 0} products upserted successfully!`)
  }
}

main()
