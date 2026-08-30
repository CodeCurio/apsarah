import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lgknzhwurdogezbvyjst.supabase.co'
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxna256aHd1cmRvZ2V6YnZ5anN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTE3NTE4NiwiZXhwIjoyMTAwNzUxMTg2fQ.z4swKbRzhiNy2a8nh72QZDMJqQxFioRFPf8gz-ZYRCo'

export const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
})

