// Run: node scripts/seed-sarees.js
// Seeds the Sarees primary category and its subcategories into Supabase

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lgknzhwurdogezbvyjst.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxna256aHd1cmRvZ2V6YnZ5anN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTE3NTE4NiwiZXhwIjoyMTAwNzUxMTg2fQ.z4swKbRzhiNy2a8nh72QZDMJqQxFioRFPf8gz-ZYRCo'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

async function seed() {
  console.log('Seeding Sarees category...')

  // 1. Insert primary "Sarees" category
  const { data: existing } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'sarees')
    .maybeSingle()

  let sareeId = existing?.id

  if (!sareeId) {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: 'Sarees',
        slug: 'sarees',
        description: 'Handcrafted Banarasi, Kanjivaram, and contemporary sarees woven with heritage artistry.',
        image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=88',
        is_coming_soon: false,
        sort_order: 7,
        parent_id: null,
      })
      .select('id')
      .single()

    if (error) {
      console.error('Error inserting Sarees category:', error.message)
      return
    }
    sareeId = data.id
    console.log('Created Sarees primary category:', sareeId)
  } else {
    console.log('Sarees category already exists:', sareeId)
  }

  // 2. Bump sort_order for Jewellery and Fragrance
  await supabase.from('categories').update({ sort_order: 8 }).eq('slug', 'jewellery').is('parent_id', null)
  await supabase.from('categories').update({ sort_order: 9 }).eq('slug', 'fragrance').is('parent_id', null)

  // 3. Insert subcategories
  const subcategories = [
    { name: 'Banarasi Silk Sarees', slug: 'banarasi-silk-sarees' },
    { name: 'Kanjivaram Sarees', slug: 'kanjivaram-sarees' },
    { name: 'Chiffon Sarees', slug: 'chiffon-sarees' },
    { name: 'Organza Sarees', slug: 'organza-sarees' },
    { name: 'Cotton Sarees', slug: 'cotton-sarees' },
    { name: 'Georgette Sarees', slug: 'georgette-sarees' },
    { name: 'Tussar Silk Sarees', slug: 'tussar-silk-sarees' },
  ]

  for (const sub of subcategories) {
    const { data: existingSub } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', sub.slug)
      .maybeSingle()

    if (!existingSub) {
      const { error } = await supabase
        .from('categories')
        .insert({
          name: sub.name,
          slug: sub.slug,
          parent_id: sareeId,
        })

      if (error) {
        console.error(`Error inserting ${sub.name}:`, error.message)
      } else {
        console.log(`  Added subcategory: ${sub.name}`)
      }
    } else {
      console.log(`  Subcategory already exists: ${sub.name}`)
    }
  }

  console.log('Done!')
}

seed().catch(console.error)
