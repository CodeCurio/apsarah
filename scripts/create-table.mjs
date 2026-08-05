// Creates the apsarah_products table via Supabase's pg endpoint
// Run: node scripts/create-table.mjs

const SUPABASE_URL = 'https://lgknzhwurdogezbvyjst.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxna256aHd1cmRvZ2V6YnZ5anN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTE3NTE4NiwiZXhwIjoyMTAwNzUxMTg2fQ.z4swKbRzhiNy2a8nh72QZDMJqQxFioRFPf8gz-ZYRCo'

const CREATE_SQL = `
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

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='apsarah_products' AND policyname='Public read') THEN
    CREATE POLICY "Public read" ON public.apsarah_products FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='apsarah_products' AND policyname='Public insert') THEN
    CREATE POLICY "Public insert" ON public.apsarah_products FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='apsarah_products' AND policyname='Public update') THEN
    CREATE POLICY "Public update" ON public.apsarah_products FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='apsarah_products' AND policyname='Public delete') THEN
    CREATE POLICY "Public delete" ON public.apsarah_products FOR DELETE USING (true);
  END IF;
END $$;
`

// Use Supabase's pg-meta endpoint
async function runSQL(sql) {
  const res = await fetch(`${SUPABASE_URL}/pg/query`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  })
  const text = await res.text()
  return { status: res.status, body: text }
}

const result = await runSQL(CREATE_SQL)
console.log('Status:', result.status)
console.log('Response:', result.body.slice(0, 300))
