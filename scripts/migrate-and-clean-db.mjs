import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lgknzhwurdogezbvyjst.supabase.co'
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxna256aHd1cmRvZ2V6YnZ5anN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTE3NTE4NiwiZXhwIjoyMTAwNzUxMTg2fQ.z4swKbRzhiNy2a8nh72QZDMJqQxFioRFPf8gz-ZYRCo'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

async function run() {
  console.log('Fetching all products from DB...')
  const { data: products, error } = await supabase
    .from('apsarah_products')
    .select('*')

  if (error) {
    console.error('Error fetching products:', error)
    return
  }

  console.log(`Found ${products.length} products to audit & clean.`)

  let updatedCount = 0

  for (const prod of products) {
    let modified = false
    const newImages = []

    // 1. Process images
    if (Array.isArray(prod.images)) {
      for (const img of prod.images) {
        if (typeof img === 'string' && img.startsWith('data:image/')) {
          try {
            const match = img.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/)
            if (match) {
              const mimeType = match[1]
              const fileBuffer = Buffer.from(match[2], 'base64')
              let ext = 'jpg'
              if (mimeType.includes('png')) ext = 'png'
              else if (mimeType.includes('webp')) ext = 'webp'

              const filename = `migrated-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}.${ext}`
              const { data: upData, error: upErr } = await supabase.storage
                .from('product-images')
                .upload(filename, fileBuffer, { contentType: mimeType, upsert: true })

              if (!upErr && upData) {
                const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/product-images/${filename}`
                newImages.push(publicUrl)
                modified = true
                console.log(`Converted base64 image for product "${prod.name}" (${prod.id}) to ${publicUrl}`)
                continue
              } else {
                console.error(`Failed to upload base64 image for ${prod.id}:`, upErr)
              }
            }
          } catch (e) {
            console.error(`Error processing image for ${prod.id}:`, e)
          }
        }
        newImages.push(img)
      }
    }

    // 2. Standardize category taxonomy
    let newCategory = prod.category
    if (prod.category === 'Kurta Sets') {
      const lowerName = (prod.name || '').toLowerCase()
      if (lowerName.includes('kurti') && !lowerName.includes('set') && !lowerName.includes('suit')) {
        newCategory = 'Kurtis & Tops'
      } else {
        newCategory = 'Suit Sets'
      }
      modified = true
    }

    if (modified) {
      const { error: updateErr } = await supabase
        .from('apsarah_products')
        .update({
          images: newImages,
          category: newCategory,
        })
        .eq('id', prod.id)

      if (updateErr) {
        console.error(`Failed to update DB row ${prod.id}:`, updateErr)
      } else {
        updatedCount++
        console.log(`✅ Successfully updated product "${prod.name}" (${prod.id}) -> Category: "${newCategory}"`)
      }
    }
  }

  console.log(`\n🎉 Audit & Cleanup complete! ${updatedCount} products updated in DB.`)
}

run()
